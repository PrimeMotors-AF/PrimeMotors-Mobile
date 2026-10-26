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
export declare function publishProposalCreated(proposal: Omit<ProposalCreatedEvent, "eventId" | "type" | "occurredAt">): Promise<string>;
export declare function startProposalEventSubscriber(): Promise<import("@redis/client").RedisClientType<import("redis").RedisDefaultModules, {}, {}, 3, {}>>;
export declare const proposalEventStream = "email.confirmations";
