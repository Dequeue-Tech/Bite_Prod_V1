import { prisma } from '@/lib/prisma';
import RestaurantLandingClient, { LandingRestaurant } from '@/app/restaurant-landing-client';

async function getLandingRestaurant(): Promise<LandingRestaurant> {
  const fallback: LandingRestaurant = {
    name: 'Haveli Dhabba',
    address: 'Address not provided',
    categories: [],
    menuItems: [],
    googleReviewUrl: null,
  };

  try {
    const restaurant = await prisma.restaurant.findFirst({
      include: {
        categories: {
          select: {
            id: true,
            name: true,
          },
          orderBy: {
            name: 'asc',
          },
        },
        menuItems: {
          where: {
            available: true,
          },
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!restaurant) return fallback;

    return {
      id: restaurant.id,
      name: restaurant.name || fallback.name,
      address: restaurant.address || fallback.address,
      categories: restaurant.categories || [],
      menuItems: restaurant.menuItems || [],
      googleReviewUrl: restaurant.googleReviewUrl || null,
    };
  } catch {
    return fallback;
  }
}

export default async function RestaurantLandingPage() {
  const restaurant = await getLandingRestaurant();
  return <RestaurantLandingClient restaurant={restaurant} />;
}
