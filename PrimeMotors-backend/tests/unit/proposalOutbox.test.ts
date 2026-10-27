jest.mock("../../src/config/database", () => ({
  __esModule: true,
  default: {
    proposalOutbox: {
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
      findFirst: jest.fn(),
      updateMany: jest.fn(),
    },
  },
}));

jest.mock("../../src/services/proposalEvents", () => ({
  publishProposalCreated: jest.fn(),
  trimProposalEventStream: jest.fn().mockResolvedValue(undefined),
}));

import prisma from "../../src/config/database";
import {
  publishProposalCreated,
  trimProposalEventStream,
} from "../../src/services/proposalEvents";
import { startProposalOutboxDispatcher } from "../../src/services/proposalOutbox";

describe("proposal outbox dispatcher", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("leaves an event pending and schedules a retry when Redis publishing fails", async () => {
    const event = {
      id: "event-1",
      proposalId: "proposal-1",
      createdAt: new Date("2026-10-27T12:00:00.000Z"),
      attempts: 0,
    };
    jest
      .mocked(prisma.proposalOutbox.findFirst)
      .mockResolvedValueOnce(event)
      .mockResolvedValueOnce(null);
    jest
      .mocked(prisma.proposalOutbox.updateMany)
      .mockResolvedValueOnce({ count: 1 })
      .mockResolvedValueOnce({ count: 1 });
    jest.mocked(publishProposalCreated).mockRejectedValueOnce(new Error("Redis unavailable"));
    const errorLog = jest.spyOn(console, "error").mockImplementation(() => {});

    const stop = startProposalOutboxDispatcher();
    await stop();

    const updateCalls = jest.mocked(prisma.proposalOutbox.updateMany).mock.calls;
    expect(updateCalls[1][0].data).toEqual(
      expect.objectContaining({
        lockedUntil: null,
        nextAttemptAt: expect.any(Date),
      }),
    );
    expect(publishProposalCreated).toHaveBeenCalledWith({
      eventId: event.id,
      proposalId: event.proposalId,
      occurredAt: event.createdAt.toISOString(),
    });
    expect(trimProposalEventStream).toHaveBeenCalled();
    expect(updateCalls).toHaveLength(2);
    errorLog.mockRestore();
  });
});
