import { redisClient } from "../config/redis";

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
      console.info("Car cache miss; entry is absent or expired.", {
        cacheType,
      });
      return null;
    }

    try {
      const result = JSON.parse(cachedValue) as T;
      console.info("Car cache hit.", { cacheType });
      return result;
    } catch (error) {
      console.error("Invalid JSON in Redis car cache; deleting entry", {
        cacheType,
        error,
      });
      await redisClient.del(cacheKey);
      return null;
    }
  } catch (error) {
    console.error("Redis car cache read failed; falling back to MySQL", {
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
    console.info("Car cache entry created.", {
      cacheType,
      ttlSeconds: CAR_CACHE_TTL_SECONDS,
    });
  } catch (error) {
    console.error("Redis car cache write failed", { cacheType, error });
  }
}

export async function invalidateCarCache({
  source,
  reason,
}: CarCacheInvalidationContext) {
  try {
    const version = await redisClient.incr(CAR_CACHE_VERSION_KEY);
    console.info(
      "Car cache generation advanced; the next read will miss previous entries.",
      { version, source, reason },
    );
  } catch (error) {
    console.error("Redis car cache invalidation failed", {
      source,
      reason,
      error,
    });
    throw error;
  }
}
