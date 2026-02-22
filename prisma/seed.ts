import { PrismaClient, SpiceLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const restaurant = await prisma.restaurant.upsert({
    where: { subdomain: 'haveli-dhabba' },
    update: {
      name: 'Haveli Dhabba',
      address: 'Civil Lines, Ludhiana, Punjab',
      googleReviewUrl: 'https://www.google.com/search?q=Haveli+Dhabba+reviews',
    },
    create: {
      name: 'Haveli Dhabba',
      subdomain: 'haveli-dhabba',
      address: 'Civil Lines, Ludhiana, Punjab',
      googleReviewUrl: 'https://www.google.com/search?q=Haveli+Dhabba+reviews',
    },
  });

  // Keep this seed idempotent by recreating child records for this restaurant.
  await prisma.menuItem.deleteMany({ where: { restaurantId: restaurant.id } });
  await prisma.category.deleteMany({ where: { restaurantId: restaurant.id } });

  const categories = [
    { name: 'Starters', description: 'Perfect to begin your meal', sortOrder: 1 },
    { name: 'Main Course', description: 'House special curries and gravies', sortOrder: 2 },
    { name: 'Breads', description: 'Fresh from tandoor', sortOrder: 3 },
    { name: 'Rice & Biryani', description: 'Aromatic rice dishes', sortOrder: 4 },
    { name: 'Beverages', description: 'Refreshing drinks', sortOrder: 5 },
  ];

  const createdCategories = await Promise.all(
    categories.map((category) =>
      prisma.category.create({
        data: {
          restaurantId: restaurant.id,
          name: category.name,
          description: category.description,
          sortOrder: category.sortOrder,
          active: true,
        },
      })
    )
  );

  const categoryIdByName = Object.fromEntries(createdCategories.map((category) => [category.name, category.id]));

  const menuItems = [
    {
      name: 'Paneer Tikka',
      description: 'Smoky marinated paneer cubes grilled in tandoor',
      pricePaise: 27900,
      categoryName: 'Starters',
      isVeg: true,
      isVegan: false,
      isGlutenFree: true,
      spiceLevel: SpiceLevel.MEDIUM,
      preparationTime: 18,
      ingredients: ['Paneer', 'Yogurt', 'Spices', 'Capsicum'],
      allergens: ['Dairy'],
    },
    {
      name: 'Veg Spring Roll',
      description: 'Crispy rolls stuffed with julienned vegetables',
      pricePaise: 19900,
      categoryName: 'Starters',
      isVeg: true,
      isVegan: true,
      isGlutenFree: false,
      spiceLevel: SpiceLevel.MILD,
      preparationTime: 12,
      ingredients: ['Cabbage', 'Carrot', 'Flour Sheet', 'Spices'],
      allergens: ['Gluten'],
    },
    {
      name: 'Dal Makhani',
      description: 'Slow cooked black lentils in buttery tomato gravy',
      pricePaise: 24900,
      categoryName: 'Main Course',
      isVeg: true,
      isVegan: false,
      isGlutenFree: true,
      spiceLevel: SpiceLevel.MILD,
      preparationTime: 20,
      ingredients: ['Black Lentils', 'Butter', 'Cream', 'Tomato'],
      allergens: ['Dairy'],
    },
    {
      name: 'Kadhai Paneer',
      description: 'Paneer tossed in onion tomato masala',
      pricePaise: 29900,
      categoryName: 'Main Course',
      isVeg: true,
      isVegan: false,
      isGlutenFree: true,
      spiceLevel: SpiceLevel.MEDIUM,
      preparationTime: 22,
      ingredients: ['Paneer', 'Onion', 'Tomato', 'Spices'],
      allergens: ['Dairy'],
    },
    {
      name: 'Butter Naan',
      description: 'Soft leavened bread brushed with butter',
      pricePaise: 5500,
      categoryName: 'Breads',
      isVeg: true,
      isVegan: false,
      isGlutenFree: false,
      spiceLevel: SpiceLevel.NONE,
      preparationTime: 8,
      ingredients: ['Flour', 'Butter', 'Yeast', 'Salt'],
      allergens: ['Gluten', 'Dairy'],
    },
    {
      name: 'Garlic Naan',
      description: 'Classic naan topped with garlic and coriander',
      pricePaise: 7000,
      categoryName: 'Breads',
      isVeg: true,
      isVegan: false,
      isGlutenFree: false,
      spiceLevel: SpiceLevel.NONE,
      preparationTime: 9,
      ingredients: ['Flour', 'Garlic', 'Butter', 'Yeast'],
      allergens: ['Gluten', 'Dairy'],
    },
    {
      name: 'Veg Biryani',
      description: 'Fragrant basmati rice layered with vegetables',
      pricePaise: 26900,
      categoryName: 'Rice & Biryani',
      isVeg: true,
      isVegan: true,
      isGlutenFree: true,
      spiceLevel: SpiceLevel.MEDIUM,
      preparationTime: 25,
      ingredients: ['Basmati Rice', 'Vegetables', 'Saffron', 'Spices'],
      allergens: [],
    },
    {
      name: 'Jeera Rice',
      description: 'Steamed rice tempered with cumin and ghee',
      pricePaise: 14900,
      categoryName: 'Rice & Biryani',
      isVeg: true,
      isVegan: false,
      isGlutenFree: true,
      spiceLevel: SpiceLevel.NONE,
      preparationTime: 12,
      ingredients: ['Rice', 'Cumin', 'Ghee'],
      allergens: ['Dairy'],
    },
    {
      name: 'Sweet Lassi',
      description: 'Traditional Punjabi yogurt drink',
      pricePaise: 9000,
      categoryName: 'Beverages',
      isVeg: true,
      isVegan: false,
      isGlutenFree: true,
      spiceLevel: SpiceLevel.NONE,
      preparationTime: 5,
      ingredients: ['Yogurt', 'Sugar', 'Cardamom'],
      allergens: ['Dairy'],
    },
    {
      name: 'Masala Chaas',
      description: 'Spiced buttermilk for a refreshing finish',
      pricePaise: 7000,
      categoryName: 'Beverages',
      isVeg: true,
      isVegan: false,
      isGlutenFree: true,
      spiceLevel: SpiceLevel.NONE,
      preparationTime: 4,
      ingredients: ['Buttermilk', 'Roasted Cumin', 'Mint'],
      allergens: ['Dairy'],
    },
  ];

  await prisma.menuItem.createMany({
    data: menuItems.map((item) => ({
      restaurantId: restaurant.id,
      categoryId: categoryIdByName[item.categoryName],
      name: item.name,
      description: item.description,
      pricePaise: item.pricePaise,
      available: true,
      preparationTime: item.preparationTime,
      ingredients: item.ingredients,
      allergens: item.allergens,
      isVeg: item.isVeg,
      isVegan: item.isVegan,
      isGlutenFree: item.isGlutenFree,
      spiceLevel: item.spiceLevel,
    })),
  });

  const [categoryCount, menuCount] = await Promise.all([
    prisma.category.count({ where: { restaurantId: restaurant.id } }),
    prisma.menuItem.count({ where: { restaurantId: restaurant.id } }),
  ]);

  console.log(`Seeded restaurant "${restaurant.name}" (${restaurant.subdomain})`);
  console.log(`Created ${categoryCount} categories and ${menuCount} menu items`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
