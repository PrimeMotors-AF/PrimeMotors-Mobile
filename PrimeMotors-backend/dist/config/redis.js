"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
require("dotenv/config");
const redis_1 = require("redis");
const redisUrl = process.env.REDIS_URL ?? "redis://127.0.0.1:6379";
exports.redisClient = (0, redis_1.createClient)({ url: redisUrl });
exports.redisClient.on("error", (error) => {
    console.error("Redis client error:", error);
});
//# sourceMappingURL=redis.js.map