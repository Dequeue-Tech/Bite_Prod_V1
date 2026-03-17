import { redis } from './redis';

/**
 * Cache key constants and patterns
 */
export const CACHE_KEYS = {
  RESTAURANTS: 'restaurants:all',
  RESTAURANT_BY_SLUG: (slug: string) => `restaurant:${slug}`,
  MENU_BY_SLUG: (slug: string) => `menu:${slug}`,
  CART_BY_USER: (userId: string) => `cart:${userId}`,
};

/**
 * Cache TTL (Time To Live) in seconds
 */
export const CACHE_TTL = {
  RESTAURANTS: parseInt(process.env.REDIS_TTL_RESTAURANTS || '3600'), // 1 hour
  MENU: parseInt(process.env.REDIS_TTL_MENU || '1800'), // 30 minutes
  CART: parseInt(process.env.REDIS_TTL_CART || '900'), // 15 minutes
};

/**
 * Get data from cache
 * @param key - Cache key
 * @returns Cached data or null if not found/error
 */
export async function getFromCache<T>(key: string): Promise<T | null> {
  try {
    const startTime = Date.now();
    const data = await redis.get<string>(key);
    
    if (data) {
      const parseTime = Date.now() - startTime;
      console.log(`✅ Cache HIT for ${key} (${parseTime}ms)`);
      return JSON.parse(data) as T;
    }
    
    console.log(`❌ Cache MISS for ${key}`);
    return null;
  } catch (error) {
    console.error('❌ Redis GET error:', error);
    return null; // Graceful fallback
  }
}

/**
 * Set data in cache with TTL
 * @param key - Cache key
 * @param value - Data to cache
 * @param ttl - Time to live in seconds
 */
export async function setInCache<T>(key: string, value: T, ttl: number): Promise<void> {
  try {
    await redis.setex(key, ttl, JSON.stringify(value));
    console.log(`💾 Cached ${key} with TTL ${ttl}s`);
  } catch (error) {
    console.error('❌ Redis SET error:', error);
  }
}

/**
 * Invalidate/delete a specific cache key
 * @param key - Cache key to invalidate
 */
export async function invalidateCache(key: string): Promise<void> {
  try {
    await redis.del(key);
    console.log(`🗑️ Invalidated cache: ${key}`);
  } catch (error) {
    console.error('❌ Redis DEL error:', error);
  }
}

/**
 * Invalidate cache keys matching a pattern
 * @param pattern - Redis pattern (e.g., 'restaurant:*', 'menu:*')
 * Note: Upstash doesn't support KEYS command in production, so we'll use a different approach
 */
export async function invalidatePattern(pattern: string): Promise<void> {
  try {
    // For Upstash, we need to track keys manually or use SCAN
    // This is a simplified version - in production you might want to track keys differently
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`🗑️ Invalidated ${keys.length} cache keys matching: ${pattern}`);
    } else {
      console.log(`ℹ️ No cache keys found matching: ${pattern}`);
    }
  } catch (error) {
    console.error('❌ Redis pattern invalidation error:', error);
    // If pattern invalidation fails, log but don't crash
    console.warn('⚠️ Pattern invalidation not available, consider using specific key invalidation');
  }
}

/**
 * Get cached data or fetch from source if not cached
 * This is a convenience wrapper that combines getFromCache and setInCache
 * 
 * @param key - Cache key
 * @param fetcher - Async function to fetch data if not in cache
 * @param ttl - Time to live in seconds
 * @returns Cached or freshly fetched data
 */
export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number
): Promise<T> {
  // Try cache first
  const cached = await getFromCache<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Cache miss - fetch fresh data
  console.log(`🔄 Fetching fresh data for ${key}`);
  const freshData = await fetcher();
  
  // Store in cache
  await setInCache(key, freshData, ttl);
  
  return freshData;
}
