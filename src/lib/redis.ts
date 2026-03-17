import { Redis } from '@upstash/redis';

// Upstash Redis configuration
const redis = new Redis({
  url: process.env.REDIS_URL || 'https://your-upstash-url.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Export singleton instance
export { redis };
