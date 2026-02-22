import { Suspense } from 'react';
import { ChefHat } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import MenuPageClient, { MenuPageCategory, MenuPageItem } from '@/app/menu/page-client';

type MenuPageData = {
  categories: MenuPageCategory[];
  menuItems: MenuPageItem[];
  selectedSubdomain: string | null;
};

async function getMenuPageData(): Promise<MenuPageData> {
  const restaurant = await prisma.restaurant.findFirst({
    orderBy: {
      createdAt: 'asc',
    },
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

  if (!restaurant) {
    return {
      categories: [],
      menuItems: [],
      selectedSubdomain: null,
    };
  }

  return {
    selectedSubdomain: restaurant.subdomain,
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
}

export default async function MenuPage() {
  const data = await getMenuPageData();

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
        selectedSubdomain={data.selectedSubdomain}
      />
    </Suspense>
  );
}
