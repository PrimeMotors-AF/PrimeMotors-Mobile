import "dotenv/config";
import { createClient } from "redis";
import { logger } from "../utils/logger";

const redisUrl = process.env.REDIS_URL ?? "redis://127.0.0.1:6379";

export const redisClient = createClient({ url: redisUrl });

redisClient.on("connect", () => {
  logger.info("dependency.redis.connected");
});

redisClient.on("ready", () => {
  logger.info("dependency.redis.ready");
});

redisClient.on("reconnecting", () => {
  logger.warn("dependency.redis.reconnecting");
});

redisClient.on("end", () => {
  logger.warn("dependency.redis.connection_closed");
});

redisClient.on("error", (error) => {
  logger.error("dependency.redis.error", { error });
});
