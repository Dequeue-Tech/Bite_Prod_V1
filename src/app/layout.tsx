import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import { testRedisConnection } from '@/lib/redis-test'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Restaurant Online Ordering',
  description: 'Order delicious food online from our restaurant with secure payment and table delivery',
  keywords: ['restaurant', 'food', 'online ordering', 'delivery', 'takeout'],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ea580c',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Test Redis connection on server startup
  if (typeof window === 'undefined') {
    testRedisConnection();
  }
  
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body className="antialiased">
        <div id="root" className="min-h-screen flex flex-col pb-20 md:pb-0 safe-area-pb">
          
          {/* 2. Wrap Navbar in Suspense */}
          <Suspense fallback={<div className="h-16 bg-white" />}>
            <Navbar />
          </Suspense>

          {/* main content area now flexes; padding applied on root to push pages up above fixed nav */}
          <main className="flex-1">
            {children}
          </main>
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                maxWidth: '90vw',
                fontSize: '14px',
              },
            }}
          />
        </div>
      </body>
    </html>
  )
}