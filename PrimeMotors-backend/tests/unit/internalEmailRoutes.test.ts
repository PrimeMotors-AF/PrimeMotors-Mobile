jest.mock("../../src/config/database", () => ({
  __esModule: true,
  default: {
    garage: {
      findUnique: jest.fn(),
    },
  },
}));

import express from "express";
import request from "supertest";
import prisma from "../../src/config/database";
import internalRoutes from "../../src/routes/internalRoutes";

const app = express();
app.use("/internal", internalRoutes);

describe("internal email event route", () => {
  const originalToken = process.env.SERVICE_TOKEN;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SERVICE_TOKEN = "test-service-token";
  });

  afterAll(() => {
    if (originalToken === undefined) {
      delete process.env.SERVICE_TOKEN;
    } else {
      process.env.SERVICE_TOKEN = originalToken;
    }
  });

  it("rejects requests without the service token", async () => {
    const response = await request(app).get(
      "/internal/proposals/proposal-1/email-event",
    );

    expect(response.status).toBe(401);
    expect(prisma.garage.findUnique).not.toHaveBeenCalled();
  });

  it("returns only the proposal, user, and car fields needed by email", async () => {
    jest.mocked(prisma.garage.findUnique).mockResolvedValue({
      id: "proposal-1",
      offeredValue: { toString: () => "95000.00" },
      message: "Tenho interesse.",
      status: "Pendente",
      date_offer: new Date("2026-11-06T12:00:00.000Z"),
      user: {
        id: "user-1",
        name: "Cliente",
        email: "cliente@example.com",
      },
      car: {
        id: "car-1",
        name: "Modelo",
        value: { toString: () => "100000.00" },
      },
    } as never);

    const response = await request(app)
      .get("/internal/proposals/proposal-1/email-event")
      .set("X-Service-Token", "test-service-token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      event: "proposal.created",
      data: {
        proposal: {
          id: "proposal-1",
          offeredValue: "95000.00",
          message: "Tenho interesse.",
          status: "Pendente",
          createdAt: "2026-11-06T12:00:00.000Z",
        },
        user: {
          id: "user-1",
          name: "Cliente",
          email: "cliente@example.com",
        },
        car: {
          id: "car-1",
          name: "Modelo",
          value: "100000.00",
        },
      },
    });
  });
});
