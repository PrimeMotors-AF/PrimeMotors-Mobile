import { redisClient } from "../config/redis";
import { logger } from "../utils/logger";

const CAR_CACHE_VERSION_KEY = "cache:cars:version";
const CAR_CACHE_TTL_SECONDS = Number(process.env.CAR_CACHE_TTL_SECONDS ?? 300);

type CarCacheInvalidationContext = {
  source: string;
  reason: string;
};

if (!Number.isInteger(CAR_CACHE_TTL_SECONDS) || CAR_CACHE_TTL_SECONDS <= 0) {
  throw new Error("CAR_CACHE_TTL_SECONDS must be a positive integer.");
}

function getCacheType(key: string) {
  return key.startsWith("list:") ? "list" : "detail";
}

async function getCarCacheVersion() {
  return (await redisClient.get(CAR_CACHE_VERSION_KEY)) ?? "0";
}

export async function getCachedCarResult<T>(key: string): Promise<T | null> {
  const cacheType = getCacheType(key);
  try {
    const version = await getCarCacheVersion();
    const cacheKey = `cache:cars:v${version}:${key}`;
    const cachedValue = await redisClient.get(cacheKey);

    if (cachedValue === null) {
      logger.info("car_cache.miss", {
        cacheType,
      });
      return null;
    }

    try {
      const result = JSON.parse(cachedValue) as T;
      logger.info("car_cache.hit", { cacheType });
      return result;
    } catch (error) {
      logger.error("car_cache.invalid_value", {
        cacheType,
        error,
      });
      await redisClient.del(cacheKey);
      return null;
    }
  } catch (error) {
    logger.error("car_cache.read_failed", {
      cacheType,
      error,
    });
    return null;
  }
}

export async function setCachedCarResult<T>(key: string, value: T) {
  const cacheType = getCacheType(key);
  try {
    const version = await getCarCacheVersion();
    const cacheKey = `cache:cars:v${version}:${key}`;
    await redisClient.set(cacheKey, JSON.stringify(value), {
      EX: CAR_CACHE_TTL_SECONDS,
    });
    logger.info("car_cache.entry_created", {
      cacheType,
      ttlSeconds: CAR_CACHE_TTL_SECONDS,
    });
  } catch (error) {
    logger.error("car_cache.write_failed", { cacheType, error });
  }
}

export async function invalidateCarCache({
  source,
  reason,
}: CarCacheInvalidationContext) {
  try {
    const version = await redisClient.incr(CAR_CACHE_VERSION_KEY);
    logger.info("car_cache.generation_advanced", {
      version,
      source,
      reason,
    });
  } catch (error) {
    logger.error("car_cache.invalidation_failed", {
      source,
      reason,
      error,
    });
    throw error;
  }
}
