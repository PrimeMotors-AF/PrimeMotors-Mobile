import { redisClient } from "../config/redis";
import { CircuitBreaker } from "./circuitBreaker";
import { logger } from "../utils/logger";

const PROPOSAL_CREATED_CHANNEL = "proposals.created";
const EMAIL_CONFIRMATION_STREAM = "email.confirmations";
const STREAM_MAX_LENGTH = 10_000;
const STREAM_RETENTION_DAYS = 30;

export const proposalStreamCircuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  resetTimeoutMs: 30_000,
  onStateChange: (state) => {
    logger.warn("resilience.circuit_breaker.state_changed", {
      dependency: "redis.proposal_stream",
      state,
    });
  },
});

export async function trimProposalEventStream() {
  const minimumStreamId =
    `${Date.now() - STREAM_RETENTION_DAYS * 24 * 60 * 60 * 1_000}-0`;
  await redisClient.xTrim(EMAIL_CONFIRMATION_STREAM, "MINID", minimumStreamId, {
    strategyModifier: "~",
  });
}

export type ProposalCreatedEvent = {
  eventId: string;
  type: "proposal.created";
  occurredAt: string;
  proposalId: string;
};

export async function publishProposalCreated(
  proposal: Pick<ProposalCreatedEvent, "eventId" | "proposalId" | "occurredAt">,
) {
  const event: ProposalCreatedEvent = {
    ...proposal,
    type: "proposal.created",
  };
  const serializedEvent = JSON.stringify(event);

  const streamId = await proposalStreamCircuitBreaker.execute(() =>
    redisClient.xAdd(
      EMAIL_CONFIRMATION_STREAM,
      "*",
      { event: serializedEvent },
      {
        TRIM: {
          strategy: "MAXLEN",
          strategyModifier: "~",
          threshold: STREAM_MAX_LENGTH,
        },
      },
    ),
  );

  logger.info("proposal.event.persisted", {
    eventId: event.eventId,
    stream: EMAIL_CONFIRMATION_STREAM,
    streamId,
  });

  try {
    await trimProposalEventStream();
  } catch (error) {
    logger.error("proposal.event.retention_cleanup_failed", {
      stream: EMAIL_CONFIRMATION_STREAM,
      error,
    });
  }

  try {
    const subscriberCount = await redisClient.publish(
      PROPOSAL_CREATED_CHANNEL,
      serializedEvent,
    );
    logger.info("proposal.event.pubsub_notified", {
      eventId: event.eventId,
      channel: PROPOSAL_CREATED_CHANNEL,
      subscriberCount,
    });
  } catch (error) {
    logger.error("proposal.event.pubsub_notification_failed", {
      eventId: event.eventId,
      channel: PROPOSAL_CREATED_CHANNEL,
      error,
    });
  }

  return event.eventId;
}

export async function startProposalEventSubscriber() {
  const subscriber = redisClient.duplicate();
  subscriber.on("error", (error) => {
    logger.error("proposal.event.pubsub_subscriber_error", { error });
  });
  try {
    await subscriber.connect();
    await subscriber.subscribe(PROPOSAL_CREATED_CHANNEL, (message) => {
      try {
        const event = JSON.parse(message) as ProposalCreatedEvent;
        logger.info("proposal.event.pubsub_received", {
          eventId: event.eventId,
          type: event.type,
          proposalId: event.proposalId,
        });
      } catch (error) {
        logger.error("proposal.event.pubsub_invalid_message", { error });
      }
    });

    logger.info("proposal.event.pubsub_subscribed", {
      channel: PROPOSAL_CREATED_CHANNEL,
    });
    return subscriber;
  } catch (error) {
    if (subscriber.isOpen) {
      await subscriber.quit();
    }
    throw error;
  }
}

export const proposalEventStream = EMAIL_CONFIRMATION_STREAM;
