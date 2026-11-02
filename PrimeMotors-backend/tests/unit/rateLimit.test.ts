jest.mock("../../src/config/redis", () => ({
  redisClient: {
    eval: jest.fn(),
  },
}));

import express from "express";
import request from "supertest";
import { redisClient } from "../../src/config/redis";
import {
  apiRateLimit,
  authRateLimit,
} from "../../src/middlewares/rateLimit";

const createApp = () => {
  const app = express();
  app.set("trust proxy", true);
  app.post("/auth/login", authRateLimit, (_req, res) => {
    res.sendStatus(200);
  });
  return app;
};

describe("Redis rate limiter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("allows requests and uses the client IP in a Redis-backed counter", async () => {
    jest.mocked(redisClient.eval).mockResolvedValueOnce([1, 900_000]);

    const response = await request(createApp())
      .post("/auth/login")
      .set("X-Forwarded-For", "203.0.113.12");

    expect(response.status).toBe(200);
    expect(response.headers["ratelimit-limit"]).toBe("10");
    expect(response.headers["ratelimit-remaining"]).toBe("9");
    expect(redisClient.eval).toHaveBeenCalledWith(
      expect.stringContaining('redis.call("INCR", KEYS[1])'),
      {
        keys: ["rate-limit:auth:203.0.113.12"],
        arguments: ["900000"],
      },
    );
  });

  it("returns 429 and Retry-After when the limit is exceeded", async () => {
    jest.mocked(redisClient.eval).mockResolvedValueOnce([11, 42_000]);

    const response = await request(createApp()).post("/auth/login");

    expect(response.status).toBe(429);
    expect(response.headers["retry-after"]).toBe("42");
    expect(response.body).toEqual({
      error: "Limite de requisições excedido. Tente novamente mais tarde.",
      retryAfterSeconds: 42,
    });
  });

  it("returns 503 when Redis is unavailable", async () => {
    jest
      .mocked(redisClient.eval)
      .mockRejectedValueOnce(new Error("Redis unavailable"));
    const errorLog = jest.spyOn(console, "error").mockImplementation(() => {});

    const response = await request(createApp()).post("/auth/login");

    expect(response.status).toBe(503);
    expect(response.body).toEqual({
      error: "Serviço temporariamente indisponível.",
    });
    expect(errorLog).toHaveBeenCalled();
    errorLog.mockRestore();
  });

  it("uses an independent Redis counter for the general API limit", async () => {
    jest.mocked(redisClient.eval).mockResolvedValueOnce([1, 900_000]);
    const app = express();
    app.set("trust proxy", true);
    app.get("/cars", apiRateLimit, (_req, res) => {
      res.sendStatus(200);
    });

    const response = await request(app).get("/cars");

    expect(response.status).toBe(200);
    expect(response.headers["ratelimit-limit"]).toBe("300");
    expect(redisClient.eval).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        keys: ["rate-limit:api:127.0.0.1"],
      }),
    );
  });
});
