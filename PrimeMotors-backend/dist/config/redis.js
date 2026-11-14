"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
require("dotenv/config");
const redis_1 = require("redis");
const redisUrl = process.env.REDIS_URL ?? "redis://127.0.0.1:6379";
exports.redisClient = (0, redis_1.createClient)({ url: redisUrl });
exports.redisClient.on("connect", () => {
    console.info("Redis connection established.");
});
exports.redisClient.on("ready", () => {
    console.info("Redis client is ready.");
});
exports.redisClient.on("reconnecting", () => {
    console.warn("Redis connection lost; reconnecting.");
});
exports.redisClient.on("end", () => {
    console.warn("Redis connection closed.");
});
exports.redisClient.on("error", (error) => {
    console.error("Redis client error:", error);
});
//# sourceMappingURL=redis.js.map