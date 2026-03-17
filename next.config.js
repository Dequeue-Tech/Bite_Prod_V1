/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**', // allow all HTTPS domains
      },
    ]
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    REDIS_URL: process.env.REDIS_URL,
    REDIS_TTL_RESTAURANTS: process.env.REDIS_TTL_RESTAURANTS,
    REDIS_TTL_MENU: process.env.REDIS_TTL_MENU,
    REDIS_TTL_CART: process.env.REDIS_TTL_CART,
  },
  // Output file tracing root to fix warning
  outputFileTracingRoot: __dirname,
}

module.exports = nextConfig
