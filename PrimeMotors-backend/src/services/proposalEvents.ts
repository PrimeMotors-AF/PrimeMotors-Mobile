import { randomUUID } from "node:crypto";
import { redisClient } from "../config/redis";

const PROPOSAL_CREATED_CHANNEL = "proposals.created";
const EMAIL_CONFIRMATION_STREAM = "email.confirmations";

export type ProposalCreatedEvent = {
  eventId: string;
  type: "proposal.created";
  occurredAt: string;
  proposalId: string;
  userId: string;
  userName: string;
  userEmail: string;
  carId: string;
  carName: string;
  offeredValue: string;
};

export async function publishProposalCreated(
  proposal: Omit<ProposalCreatedEvent, "eventId" | "type" | "occurredAt">,
) {
  const event: ProposalCreatedEvent = {
    ...proposal,
    eventId: randomUUID(),
    type: "proposal.created",
    occurredAt: new Date().toISOString(),
  };
  const serializedEvent = JSON.stringify(event);

  const streamId = await redisClient.xAdd(EMAIL_CONFIRMATION_STREAM, "*", {
    event: serializedEvent,
  });

  console.info("Proposal event persisted to Redis Stream", {
    eventId: event.eventId,
    stream: EMAIL_CONFIRMATION_STREAM,
    streamId,
  });

  try {
    const subscriberCount = await redisClient.publish(
      PROPOSAL_CREATED_CHANNEL,
      serializedEvent,
    );
    console.info("Proposal event published to Redis Pub/Sub", {
      eventId: event.eventId,
      channel: PROPOSAL_CREATED_CHANNEL,
      subscriberCount,
    });
  } catch (error) {
    console.error("Proposal event Pub/Sub notification failed", {
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
    console.error("Proposal Pub/Sub subscriber error:", error);
  });
  try {
    await subscriber.connect();
    await subscriber.subscribe(PROPOSAL_CREATED_CHANNEL, (message) => {
      try {
        const event = JSON.parse(message) as ProposalCreatedEvent;
        console.info("Proposal event received from Redis Pub/Sub", {
          eventId: event.eventId,
          type: event.type,
          proposalId: event.proposalId,
        });
      } catch (error) {
        console.error("Invalid proposal event received from Redis Pub/Sub", error);
      }
    });

    console.info("Subscribed to Redis Pub/Sub channel", {
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
