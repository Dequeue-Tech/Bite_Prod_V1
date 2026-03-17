import { redis } from './redis';

/**
 * Test Redis connection on startup
 */
export async function testRedisConnection() {
  try {
    // Test connection with a simple PING command
    const result = await redis.ping();
    console.log('✅ Connected to Redis successfully');
    console.log('☁️ Using Upstash Cloud Redis');
    console.log(`📊 Response: ${result}`);
    
    // Test basic operations
    await redis.set('test:connection', 'ok', { ex: 60 });
    const value = await redis.get('test:connection');
    console.log(`🧪 Test key value: ${value}`);
    
    await redis.del('test:connection');
    console.log('✅ Redis connection test passed!\n');
    
    return true;
  } catch (error) {
    console.error('❌ Redis connection test failed:', error);
    console.error('\n⚠️ Check your .env.local configuration:\n');
    console.error('REDIS_URL should be like: https://xxx.upstash.io');
    console.error('UPSTASH_REDIS_REST_TOKEN should be your token\n');
    return false;
  }
}

// Auto-run on import in development
if (process.env.NODE_ENV === 'development') {
  testRedisConnection();
}
