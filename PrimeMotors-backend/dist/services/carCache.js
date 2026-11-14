"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCachedCarResult = getCachedCarResult;
exports.setCachedCarResult = setCachedCarResult;
exports.invalidateCarCache = invalidateCarCache;
const redis_1 = require("../config/redis");
const CAR_CACHE_VERSION_KEY = "cache:cars:version";
const CAR_CACHE_TTL_SECONDS = Number(process.env.CAR_CACHE_TTL_SECONDS ?? 300);
if (!Number.isInteger(CAR_CACHE_TTL_SECONDS) || CAR_CACHE_TTL_SECONDS <= 0) {
    throw new Error("CAR_CACHE_TTL_SECONDS must be a positive integer.");
}
function getCacheType(key) {
    return key.startsWith("list:") ? "list" : "detail";
}
async function getCarCacheVersion() {
    return (await redis_1.redisClient.get(CAR_CACHE_VERSION_KEY)) ?? "0";
}
async function getCachedCarResult(key) {
    const cacheType = getCacheType(key);
    try {
        const version = await getCarCacheVersion();
        const cacheKey = `cache:cars:v${version}:${key}`;
        const cachedValue = await redis_1.redisClient.get(cacheKey);
        if (cachedValue === null) {
            console.info("Car cache miss; entry is absent or expired.", {
                cacheType,
            });
            return null;
        }
        try {
            const result = JSON.parse(cachedValue);
            console.info("Car cache hit.", { cacheType });
            return result;
        }
        catch (error) {
            console.error("Invalid JSON in Redis car cache; deleting entry", {
                cacheType,
                error,
            });
            await redis_1.redisClient.del(cacheKey);
            return null;
        }
    }
    catch (error) {
        console.error("Redis car cache read failed; falling back to MySQL", {
            cacheType,
            error,
        });
        return null;
    }
}
async function setCachedCarResult(key, value) {
    const cacheType = getCacheType(key);
    try {
        const version = await getCarCacheVersion();
        const cacheKey = `cache:cars:v${version}:${key}`;
        await redis_1.redisClient.set(cacheKey, JSON.stringify(value), {
            EX: CAR_CACHE_TTL_SECONDS,
        });
        console.info("Car cache entry created.", {
            cacheType,
            ttlSeconds: CAR_CACHE_TTL_SECONDS,
        });
    }
    catch (error) {
        console.error("Redis car cache write failed", { cacheType, error });
    }
}
async function invalidateCarCache({ source, reason, }) {
    try {
        const version = await redis_1.redisClient.incr(CAR_CACHE_VERSION_KEY);
        console.info("Car cache generation advanced; the next read will miss previous entries.", { version, source, reason });
    }
    catch (error) {
        console.error("Redis car cache invalidation failed", {
            source,
            reason,
            error,
        });
        throw error;
    }
}
//# sourceMappingURL=carCache.js.map