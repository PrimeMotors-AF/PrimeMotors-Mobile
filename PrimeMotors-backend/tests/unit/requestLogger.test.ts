import express from "express";
import request from "supertest";
import { requestLogger } from "../../src/middlewares/requestLogger";

describe("requestLogger", () => {
  let infoSpy: jest.SpyInstance;

  beforeEach(() => {
    infoSpy = jest.spyOn(console, "info").mockImplementation(() => {});
  });

  afterEach(() => {
    infoSpy.mockRestore();
  });

  it("logs status, duration, request ID, and the matched route template", async () => {
    const app = express();
    app.use(requestLogger);
    app.get("/cars/:id", (_req, res) => {
      res.sendStatus(204);
    });

    const response = await request(app)
      .get("/cars/private-id?token=do-not-log")
      .set("X-Request-ID", "request-123");

    const logEntry = JSON.parse(infoSpy.mock.calls[0][0] as string);

    expect(response.headers["x-request-id"]).toBe("request-123");
    expect(logEntry).toMatchObject({
      event: "http.request",
      requestId: "request-123",
      method: "GET",
      route: "/cars/:id",
      statusCode: 204,
      responseCompleted: true,
    });
    expect(logEntry.durationMs).toEqual(expect.any(Number));
    expect(JSON.stringify(logEntry)).not.toContain("private-id");
    expect(JSON.stringify(logEntry)).not.toContain("do-not-log");
  });

  it("logs unmatched requests without exposing their path or query", async () => {
    const app = express();
    app.use(requestLogger);

    const response = await request(app).get(
      "/private-user-id?token=do-not-log",
    );

    const logEntry = JSON.parse(infoSpy.mock.calls[0][0] as string);

    expect(response.status).toBe(404);
    expect(logEntry).toMatchObject({
      method: "GET",
      route: "unmatched",
      statusCode: 404,
      responseCompleted: true,
    });
    expect(JSON.stringify(logEntry)).not.toContain("private-user-id");
    expect(JSON.stringify(logEntry)).not.toContain("do-not-log");
  });
});
