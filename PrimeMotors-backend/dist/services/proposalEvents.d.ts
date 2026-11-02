export declare function trimProposalEventStream(): Promise<void>;
export type ProposalCreatedEvent = {
    eventId: string;
    type: "proposal.created";
    occurredAt: string;
    proposalId: string;
};
export declare function publishProposalCreated(proposal: Pick<ProposalCreatedEvent, "eventId" | "proposalId" | "occurredAt">): Promise<string>;
export declare function startProposalEventSubscriber(): Promise<import("@redis/client").RedisClientType<import("redis").RedisDefaultModules, {}, {}, 3, {}>>;
export declare const proposalEventStream = "email.confirmations";
