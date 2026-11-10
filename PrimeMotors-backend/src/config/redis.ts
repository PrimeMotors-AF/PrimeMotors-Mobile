import "dotenv/config";
import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL ?? "redis://127.0.0.1:6379";

export const redisClient = createClient({ url: redisUrl });

redisClient.on("connect", () => {
  console.info("Redis connection established.");
});

redisClient.on("ready", () => {
  console.info("Redis client is ready.");
});

redisClient.on("reconnecting", () => {
  console.warn("Redis connection lost; reconnecting.");
});

redisClient.on("end", () => {
  console.warn("Redis connection closed.");
});

redisClient.on("error", (error) => {
  console.error("Redis client error:", error);
});
