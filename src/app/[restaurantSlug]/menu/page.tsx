import { Suspense, cache } from 'react';
import { notFound } from 'next/navigation';
import { ChefHat } from 'lucide-react';
import { menuPrisma } from '@/lib/menu-prisma';
// Make sure this path is correct for your project
import MenuPageClient, { MenuPageCategory, MenuPageItem } from '@/app/menu/page-client';

type PageProps = {
  params: Promise<{ restaurantSlug: string }>;
};

type MenuPageData = {
  categories: MenuPageCategory[];
  menuItems: MenuPageItem[];
  restaurantSlug: string;
};

const getMenuPageData = cache(async (slug: string): Promise<MenuPageData | null> => {
  const restaurant = await menuPrisma.restaurant.findUnique({
    where: { slug },
    include: {
      categories: {
        where: { active: true },
        orderBy: { sortOrder: 'asc' },
      },
      menuItems: {
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

  if (!restaurant) return null;

  return {
    restaurantSlug: restaurant.slug,
    categories: restaurant.categories.map((category: any) => ({
      id: category.id,
      name: category.name,
      description: category.description || '',
      image: category.image || '',
      active: category.active,
      sortOrder: category.sortOrder,
    })),
    menuItems: restaurant.menuItems.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      pricePaise: item.pricePaise,
      image: item.image || '',
      categoryId: item.categoryId,
      available: item.available,
      preparationTime: item.preparationTime,
      ingredients: item.ingredients,
      allergens: item.allergens,
      isVeg: item.isVeg,
      isVegan: item.isVegan,
      isGlutenFree: item.isGlutenFree,
      spiceLevel: item.spiceLevel,
      category: item.category,
    })),
  };
}); // <--- ADDED missing `);` HERE

export default async function MenuPage({ params }: PageProps) {
  const { restaurantSlug } = await params;
  const data = await getMenuPageData(restaurantSlug);

  if (!data) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <ChefHat className="h-12 w-12 text-orange-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading menu...</p>
          </div>
        </div>
      }
    >
      <MenuPageClient
        initialMenuItems={data.menuItems}
        initialCategories={data.categories}
        restaurantSlug={data.restaurantSlug}
      />
    </Suspense>
  );
}