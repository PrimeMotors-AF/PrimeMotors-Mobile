jest.mock("../../src/config/redis", () => ({
  redisClient: {
    xAdd: jest.fn().mockResolvedValue("123-0"),
    xTrim: jest.fn().mockResolvedValue(0),
    publish: jest.fn().mockResolvedValue(0),
  },
}));

import { redisClient } from "../../src/config/redis";
import { publishProposalCreated } from "../../src/services/proposalEvents";

describe("proposal event publishing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("publishes only identifiers and event metadata with bounded retention", async () => {
    const event = {
      eventId: "event-1",
      proposalId: "proposal-1",
      occurredAt: "2026-10-27T12:00:00.000Z",
    };

    await publishProposalCreated(event);

    const xAdd = jest.mocked(redisClient.xAdd);
    const xTrim = jest.mocked(redisClient.xTrim);
    const publish = jest.mocked(redisClient.publish);
    const serializedEvent = xAdd.mock.calls[0][2].event;

    expect(JSON.parse(serializedEvent)).toEqual({
      ...event,
      type: "proposal.created",
    });
    expect(Object.keys(JSON.parse(serializedEvent)).sort()).toEqual([
      "eventId",
      "occurredAt",
      "proposalId",
      "type",
    ]);
    expect(xAdd).toHaveBeenCalledWith(
      "email.confirmations",
      "*",
      { event: serializedEvent },
      {
        TRIM: {
          strategy: "MAXLEN",
          strategyModifier: "~",
          threshold: 10_000,
        },
      },
    );
    expect(xTrim).toHaveBeenCalledWith(
      "email.confirmations",
      "MINID",
      expect.stringMatching(/^\d+-0$/),
      { strategyModifier: "~" },
    );
    expect(publish).toHaveBeenCalledWith("proposals.created", serializedEvent);
  });
});
