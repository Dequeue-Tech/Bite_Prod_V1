import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteContext = {
  params: Promise<{ restaurantSlug: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { restaurantSlug } = await params;

  if (!restaurantSlug) {
    return NextResponse.json({ error: 'Missing restaurantSlug' }, { status: 400 });
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: restaurantSlug },
    select: { googleReviewUrl: true, name: true },
  });

  if (!restaurant) {
    return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
  }

  return NextResponse.json({
    googleReviewUrl: restaurant.googleReviewUrl || null,
    name: restaurant.name || null,
  });
}
