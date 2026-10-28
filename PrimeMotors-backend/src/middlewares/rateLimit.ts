import { RequestHandler } from "express";
import { redisClient } from "../config/redis";

const incrementRateLimitScript = `
local count = redis.call("INCR", KEYS[1])
if count == 1 then
  redis.call("PEXPIRE", KEYS[1], ARGV[1])
end
return { count, redis.call("PTTL", KEYS[1]) }
`;

function readPositiveInteger(name: string, defaultValue: number) {
  const value = Number(process.env[name] ?? defaultValue);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer.`);
  }
  return value;
}

function createRedisRateLimit(options: {
  keyPrefix: string;
  windowMs: number;
  max: number;
}): RequestHandler {
  return async (req, res, next) => {
    const key = `rate-limit:${options.keyPrefix}:${req.ip}`;
    let count: number;
    let ttlMs: number;

    try {
      const result: unknown = await redisClient.eval(incrementRateLimitScript, {
        keys: [key],
        arguments: [String(options.windowMs)],
      });

      if (
        !Array.isArray(result) ||
        typeof result[0] !== "number" ||
        typeof result[1] !== "number" ||
        result[1] < 0
      ) {
        throw new Error("Redis returned an invalid rate limit result.");
      }

      [count, ttlMs] = result;
    } catch (error) {
      console.error("Redis rate limiter failed", {
        policy: options.keyPrefix,
        method: req.method,
        path: req.path,
        error,
      });
      res.status(503).json({ error: "Serviço temporariamente indisponível." });
      return;
    }

    const retryAfterSeconds = Math.max(1, Math.ceil(ttlMs / 1_000));
    res.setHeader("RateLimit-Limit", options.max);
    res.setHeader("RateLimit-Remaining", Math.max(0, options.max - count));
    res.setHeader("RateLimit-Reset", retryAfterSeconds);
    res.setHeader(
      "RateLimit-Policy",
      `${options.max};w=${Math.ceil(options.windowMs / 1_000)}`,
    );

    if (count > options.max) {
      res.setHeader("Retry-After", retryAfterSeconds);
      res.status(429).json({
        error: "Limite de requisições excedido. Tente novamente mais tarde.",
        retryAfterSeconds,
      });
      return;
    }

    next();
  };
}

export const apiRateLimit = createRedisRateLimit({
  keyPrefix: "api",
  windowMs: readPositiveInteger("API_RATE_LIMIT_WINDOW_MS", 15 * 60 * 1_000),
  max: readPositiveInteger("API_RATE_LIMIT_MAX", 300),
});

export const authRateLimit = createRedisRateLimit({
  keyPrefix: "auth",
  windowMs: readPositiveInteger("AUTH_RATE_LIMIT_WINDOW_MS", 15 * 60 * 1_000),
  max: readPositiveInteger("AUTH_RATE_LIMIT_MAX", 10),
});
