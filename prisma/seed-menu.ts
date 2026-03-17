import fs from "fs";
import path from "path";
import { menuPrisma } from "@/lib/menu-prisma";

type MenuJson = {
  name: string;
  menus: Array<{
    name: string;
    category: Array<{
      name: string;
      items: Array<{
        name: string;
        price: string;
        desc: string;
        dietary_slugs: string;
        image: string;
      }>;
    }>;
  }>;
};

function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

function parseDietary(dietary: string) {
  const normalized = (dietary || "").toLowerCase();
  if (normalized.includes("veg") && !normalized.includes("non")) return { isVeg: true, isVegan: false };
  if (normalized.includes("vegan")) return { isVeg: true, isVegan: true };
  return { isVeg: false, isVegan: false };
}

function parsePriceToPaise(price: string) {
  const parsed = Number(price.replace(/[^[0-9].]/g, ""));
  if (Number.isNaN(parsed)) return 0;
  return Math.round(parsed * 100);
}

async function main() {
  const menuJsonPath = path.join(process.cwd(), "Haveli Dhaba(2).json");
  const raw = fs.readFileSync(menuJsonPath, "utf-8");
  const data = JSON.parse(raw) as MenuJson;

  const slug = toSlug(data.name || "restaurant");

  const restaurant = await menuPrisma.restaurant.upsert({
    where: { slug },
    update: {
      name: data.name,
      updatedAt: new Date(),
    },
    create: {
      name: data.name,
      slug,
    },
  });

  // Clear existing menu data for this restaurant
  await menuPrisma.menuItem.deleteMany({ where: { restaurantId: restaurant.id } });
  await menuPrisma.category.deleteMany({ where: { restaurantId: restaurant.id } });

  // Insert categories + items
  for (const menuSection of data.menus) {
    for (const categoryGroup of menuSection.category) {
      const categoryName = categoryGroup.name?.trim() || menuSection.name || "Uncategorized";
      const categorySlug = toSlug(categoryName);

      const category = await menuPrisma.category.create({
        data: {
          name: categoryName,
          description: menuSection.name,
          image: null,
          restaurantId: restaurant.id,
          sortOrder: 0,
        },
      });

      for (const item of categoryGroup.items) {
        const dietary = parseDietary(item.dietary_slugs);

        await menuPrisma.menuItem.create({
          data: {
            name: item.name,
            description: item.desc || null,
            image: item.image || null,
            pricePaise: parsePriceToPaise(item.price),
            restaurantId: restaurant.id,
            categoryId: category.id,
            available: true,
            preparationTime: 15,
            ingredients: [],
            allergens: [],
            isVeg: dietary.isVeg,
            isVegan: dietary.isVegan,
            isGlutenFree: false,
            spiceLevel: "MILD",
          },
        });
      }
    }
  }

  console.log(`Seeded menu data for restaurant '${data.name}' (slug: ${slug})`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await menuPrisma.$disconnect();
  });
