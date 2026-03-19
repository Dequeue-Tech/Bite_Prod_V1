import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import RestaurantLandingClient, { LandingRestaurant } from '@/app/restaurant-landing-client';
import { getFromCache, setInCache, CACHE_KEYS, CACHE_TTL } from '@/lib/cache';

type PageProps = {
  params: Promise<{ restaurantSlug: string }>;
};

async function getLandingRestaurant(slug: string): Promise<LandingRestaurant | null> {
  const cacheKey = CACHE_KEYS.RESTAURANT_BY_SLUG(slug);
  
  // Try cache first
  const cached = await getFromCache<LandingRestaurant>(cacheKey);
  if (cached) {
    return cached;
  }

  console.log(`🔄 Fetching restaurant ${slug} from database...`);
  
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
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
      offers: {
        where: {
          active: true,
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
      popularDishes: {
        where: { featured: true },
        include: {
          menuItem: {
            include: {
              category: {
                select: { id: true, name: true },
              },
            },
          },
        },
        orderBy: { rank: 'asc' },
      },
    },
  });

  if (!restaurant) return null;

  const result = {
    id: restaurant.id,
    name: restaurant.name || 'Restaurant',
    address: restaurant.address || 'Address not provided',
    categories: restaurant.categories || [],
    menuItems:
      restaurant.popularDishes?.length > 0
        ? restaurant.popularDishes.map((pd: any) => pd.menuItem)
        : restaurant.menuItems || [],
    offers: restaurant.offers || [],
    googleReviewUrl: restaurant.googleReviewUrl || null,
    slug: restaurant.slug,
    subdomain: restaurant.subdomain || null,
    backgroundImage: (restaurant as any).backgroundImage || null,
    logo: (restaurant as any).logo || null,
    paymentCollectionTiming: (restaurant as any).paymentCollectionTiming,
    cashPaymentEnabled: (restaurant as any).cashPaymentEnabled || false,
  };
  
  // Store in cache
  await setInCache(cacheKey, result, CACHE_TTL.RESTAURANTS);
  
  return result;
}

export default async function RestaurantLandingPage({ params }: PageProps) {
  const { restaurantSlug } = await params;
  const restaurant = await getLandingRestaurant(restaurantSlug);

  if (!restaurant) {
    notFound();
  }

  return <RestaurantLandingClient restaurant={restaurant} />;
}
