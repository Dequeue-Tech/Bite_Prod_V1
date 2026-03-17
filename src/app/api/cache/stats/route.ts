import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

/**
 * GET /api/cache/stats
 * Get Redis cache statistics and monitoring information
 */
export async function GET() {
  try {
    // For Upstash, we'll get basic stats
    const dbSize = await redis.dbsize();
    
    // Get all keys for detailed stats
    const keys = await redis.keys('*');
    const keyDetails: Array<{ key: string; ttl: number }> = [];
    
    for (const key of keys) {
      const ttl = await redis.ttl(key);
      keyDetails.push({ key, ttl });
    }

    return NextResponse.json({
      connected: true,
      provider: 'Upstash Cloud Redis',
      stats: {
        totalKeys: dbSize,
        cachedPages: keyDetails.length,
        keyBreakdown: keyDetails.map((k) => ({
          pattern: k.key.split(':')[0],
          key: k.key,
          ttl: k.ttl > 0 ? `${Math.floor(k.ttl / 60)}m ${k.ttl % 60}s` : 'no expiry',
        })),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Cache stats error:', error);
    return NextResponse.json(
      { 
        connected: false,
        error: 'Failed to get cache statistics',
        details: String(error),
      },
      { status: 500 }
    );
  }
}
