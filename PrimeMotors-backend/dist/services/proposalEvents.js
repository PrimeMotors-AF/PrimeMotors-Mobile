"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proposalEventStream = void 0;
exports.publishProposalCreated = publishProposalCreated;
exports.startProposalEventSubscriber = startProposalEventSubscriber;
const node_crypto_1 = require("node:crypto");
const redis_1 = require("../config/redis");
const PROPOSAL_CREATED_CHANNEL = "proposals.created";
const EMAIL_CONFIRMATION_STREAM = "email.confirmations";
async function publishProposalCreated(proposal) {
    const event = {
        ...proposal,
        eventId: (0, node_crypto_1.randomUUID)(),
        type: "proposal.created",
        occurredAt: new Date().toISOString(),
    };
    const serializedEvent = JSON.stringify(event);
    const streamId = await redis_1.redisClient.xAdd(EMAIL_CONFIRMATION_STREAM, "*", {
        event: serializedEvent,
    });
    console.info("Proposal event persisted to Redis Stream", {
        eventId: event.eventId,
        stream: EMAIL_CONFIRMATION_STREAM,
        streamId,
    });
    try {
        const subscriberCount = await redis_1.redisClient.publish(PROPOSAL_CREATED_CHANNEL, serializedEvent);
        console.info("Proposal event published to Redis Pub/Sub", {
            eventId: event.eventId,
            channel: PROPOSAL_CREATED_CHANNEL,
            subscriberCount,
        });
    }
    catch (error) {
        console.error("Proposal event Pub/Sub notification failed", {
            eventId: event.eventId,
            channel: PROPOSAL_CREATED_CHANNEL,
            error,
        });
    }
    return event.eventId;
}
async function startProposalEventSubscriber() {
    const subscriber = redis_1.redisClient.duplicate();
    subscriber.on("error", (error) => {
        console.error("Proposal Pub/Sub subscriber error:", error);
    });
    try {
        await subscriber.connect();
        await subscriber.subscribe(PROPOSAL_CREATED_CHANNEL, (message) => {
            try {
                const event = JSON.parse(message);
                console.info("Proposal event received from Redis Pub/Sub", {
                    eventId: event.eventId,
                    type: event.type,
                    proposalId: event.proposalId,
                });
            }
            catch (error) {
                console.error("Invalid proposal event received from Redis Pub/Sub", error);
            }
        });
        console.info("Subscribed to Redis Pub/Sub channel", {
            channel: PROPOSAL_CREATED_CHANNEL,
        });
        return subscriber;
    }
    catch (error) {
        if (subscriber.isOpen) {
            await subscriber.quit();
        }
        throw error;
    }
}
exports.proposalEventStream = EMAIL_CONFIRMATION_STREAM;
//# sourceMappingURL=proposalEvents.js.map