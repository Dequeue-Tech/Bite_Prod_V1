import { NextRequest, NextResponse } from 'next/server';
import { invalidatePattern } from '@/lib/cache';

/**
 * POST /api/cache/invalidate
 * Invalidate cache keys matching a pattern
 * 
 * Body: { pattern: string }
 * Example: { pattern: 'restaurant:*' } or { pattern: 'menu:haveli-dhaba' }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pattern } = body;

    if (!pattern || typeof pattern !== 'string') {
      return NextResponse.json(
        { error: 'Pattern is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate pattern to prevent dangerous operations
    if (pattern.includes('*') && !pattern.endsWith('*')) {
      return NextResponse.json(
        { error: 'Wildcard (*) can only be used at the end of pattern' },
        { status: 400 }
      );
    }

    console.log(`🗑️ Cache invalidation requested for pattern: ${pattern}`);
    await invalidatePattern(pattern);
    
    return NextResponse.json({ 
      success: true, 
      message: `Successfully invalidated cache matching: ${pattern}`,
      pattern,
    });
  } catch (error) {
    console.error('❌ Cache invalidation error:', error);
    return NextResponse.json(
      { error: 'Failed to invalidate cache', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/cache/invalidate
 * Get information about cache invalidation
 */
export async function GET() {
  return NextResponse.json({
    description: 'Cache invalidation endpoint',
    usage: {
      method: 'POST',
      body: { pattern: 'string' },
      examples: [
        { pattern: 'restaurants:all', description: 'Invalidate all restaurants list' },
        { pattern: 'restaurant:*', description: 'Invalidate all restaurant pages' },
        { pattern: 'menu:*', description: 'Invalidate all menu pages' },
        { pattern: 'restaurant:haveli-dhaba', description: 'Invalidate specific restaurant' },
      ],
    },
  });
}
