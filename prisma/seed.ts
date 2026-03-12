import { PrismaClient, SpiceLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: 'haveli-dhaba' },
    update: {
      name: 'Haveli Dhaba',
      slug: 'haveli-dhaba',
      address: 'Near Vikash Vidyalaya, Nevri Chowk, Ring Road, Ranchi (Jh.)',
    },
    create: {
      name: 'Haveli Dhaba',
      slug: 'haveli-dhaba',
      subdomain: 'haveli-dhaba',
      address: 'Near Vikash Vidyalaya, Nevri Chowk, Ring Road, Ranchi (Jh.)',
    },
  });

  // Idempotency: Clear existing records for this restaurant
  await prisma.menuItem.deleteMany({ where: { restaurantId: restaurant.id } });
  await prisma.category.deleteMany({ where: { restaurantId: restaurant.id } });
  await prisma.popularDish.deleteMany({ where: { restaurantId: restaurant.id } });

  const MENU_DATA = [
    {
      name: "Chinese Non-Veg",
      isVeg: false,
      image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1000",
      items: [
        { name: "Chicken Hakka Noodles", price: 279, desc: "Classic wok-tossed noodles with chicken strips and veggies.", prep: 15, ingredients: ["Noodles", "Chicken", "Soy Sauce", "Cabbage"], allergens: ["Gluten", "Soy"], image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1000" },
        { name: "Mix Hakka Noodles", price: 289, desc: "A protein-packed noodle dish with chicken, egg, and seafood.", prep: 18, ingredients: ["Noodles", "Chicken", "Egg", "Shrimp"], allergens: ["Gluten", "Soy", "Egg", "Shellfish"], image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1000" },
        { name: "Chicken Schezwan Hakka Noodle", price: 269, desc: "Spicy stir-fried noodles with chicken in a fiery Schezwan base.", prep: 15, ingredients: ["Noodles", "Chicken", "Schezwan Sauce", "Dry Red Chilli"], allergens: ["Gluten", "Soy"], image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1000" },
        { name: "Egg Hakka Noodles", price: 219, desc: "Simple and flavorful noodles tossed with scrambled eggs.", prep: 12, ingredients: ["Noodles", "Egg", "Spring Onion", "Soy Sauce"], allergens: ["Gluten", "Soy", "Egg"], image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1000" },
        { name: "Egg Schezwan Hakka Noodles", price: 279, desc: "Noodles with egg tossed in a pungent Schezwan sauce.", prep: 15, ingredients: ["Noodles", "Egg", "Szechuan Pepper", "Garlic"], allergens: ["Gluten", "Soy", "Egg"], image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1000" },
        { name: "Chicken Garlic Hakka Noodles", price: 269, desc: "Noodles infused with a strong punch of roasted garlic and chicken.", prep: 15, ingredients: ["Noodles", "Chicken", "Minced Garlic", "Celery"], allergens: ["Gluten", "Soy"], image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1000" },
        { name: "Chicken Shanghai Noodles", price: 289, desc: "Thick savory noodles in a dark soy and ginger chicken base.", prep: 18, ingredients: ["Noodles", "Chicken", "Dark Soy", "Ginger"], allergens: ["Gluten", "Soy"], image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1000" },
        { name: "Chicken Manchurian", price: 359, desc: "Golden fried chicken balls in a thick ginger-garlic soy gravy.", prep: 20, ingredients: ["Chicken", "Corn Flour", "Ginger", "Garlic", "Soy"], allergens: ["Soy", "Gluten"], image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=1000" },
        { name: "Chicken Chilli Bone", price: 339, desc: "Bone-in chicken sautéed with fresh green chillies and bell peppers.", prep: 20, ingredients: ["Chicken with Bone", "Capsicum", "Onion", "Green Chilli"], allergens: ["Soy", "Gluten"], image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=1000" },
        { name: "Chicken Chilli Boneless", price: 349, desc: "Tender boneless chicken stir-fried in a spicy chilli soy glaze.", prep: 18, ingredients: ["Chicken Boneless", "Bell Pepper", "Soy Sauce", "Vinegar"], allergens: ["Soy", "Gluten"], image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=1000" },
        { name: "Chicken Salt & Pepper", price: 329, desc: "Dry-fried crunchy chicken seasoned with sea salt and cracked pepper.", prep: 15, ingredients: ["Chicken", "Black Pepper", "Spring Onion", "Salt"], allergens: ["Gluten"], image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1000" },
        { name: "Chicken Schezwan (Dry/Gravy/Semi)", price: 359, desc: "Succulent chicken cooked in a hot and spicy Schezwan base.", prep: 20, ingredients: ["Chicken", "Schezwan Sauce", "Celery", "Garlic"], allergens: ["Soy", "Gluten"], image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=1000" },
        { name: "Chicken Garlic (Gravy/Semi)", price: 349, desc: "Chicken pieces simmered in a rich, garlic-heavy aromatic sauce.", prep: 20, ingredients: ["Chicken", "Garlic Paste", "Soy Sauce", "Onion"], allergens: ["Soy", "Gluten"], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Ginger Chicken (Semi/Gravy/Latpt)", price: 339, desc: "Chicken tossed with fresh julienned ginger and savory spices.", prep: 20, ingredients: ["Chicken", "Fresh Ginger", "Green Onion", "Soy Sauce"], allergens: ["Soy", "Gluten"], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Chicken Lolipop", price: 359, desc: "Frenched chicken wings deep-fried and served with hot garlic sauce.", prep: 22, ingredients: ["Chicken Wings", "Ginger-Garlic Paste", "Chilli Powder"], allergens: ["Gluten", "Egg"], image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1000" },
        { name: "Drums of Heaven Chicken", price: 369, desc: "Fried chicken wings tossed in a sweet and spicy Schezwan glaze.", prep: 22, ingredients: ["Chicken Wings", "Honey", "Schezwan Sauce", "Garlic"], allergens: ["Gluten", "Soy"], image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1000" },
        { name: "Chicken Pan Fry Noodles", price: 289, desc: "Crispy-bottomed noodles topped with a savory chicken-veg sauce.", prep: 20, ingredients: ["Noodles", "Chicken", "Corn Starch", "Mix Veg"], allergens: ["Gluten", "Soy"], image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1000" },
        { name: "Chicken Spring Roll", price: 289, desc: "Crispy fried rolls stuffed with seasoned chicken and veggies.", prep: 15, ingredients: ["Flour Wrap", "Chicken", "Cabbage", "Carrot"], allergens: ["Gluten", "Soy"], image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000" },
        { name: "Chicken 65", price: 349, desc: "Spicy South-Indian style deep-fried chicken tempered with curry leaves.", prep: 18, ingredients: ["Chicken", "Rice Flour", "Curry Leaves", "Yogurt"], allergens: ["Gluten", "Dairy"], image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1000" },
      ]
    },
    {
      name: "Chinese Veg",
      isVeg: true,
      image: "https://images.unsplash.com/photo-1512058560366-cd2429598a6a?q=80&w=1000",
      items: [
        { name: "Veg Hakka Noodle", price: 219, desc: "Simple stir-fried noodles with farm-fresh garden vegetables.", prep: 12, ingredients: ["Noodles", "Carrot", "Beans", "Cabbage"], allergens: ["Gluten", "Soy"], image: "https://images.unsplash.com/photo-1512058560366-cd2429598a6a?q=80&w=1000" },
        { name: "Veg Mix Chowmein", price: 259, desc: "A blend of noodles and crunchy assorted veggies in savory spices.", prep: 15, ingredients: ["Noodles", "Mix Veg", "Soy Sauce", "MSG-free spice"], allergens: ["Gluten", "Soy"], image: "https://images.unsplash.com/photo-1512058560366-cd2429598a6a?q=80&w=1000" },
        { name: "Mushroom Chowmein", price: 209, desc: "Earthy mushrooms and noodles tossed in a high-flame wok.", prep: 15, ingredients: ["Noodles", "Button Mushrooms", "Garlic", "Onion"], allergens: ["Gluten", "Soy"], image: "https://images.unsplash.com/photo-1512058560366-cd2429598a6a?q=80&w=1000" },
        { name: "Schezwan Hakka Noodles", price: 215, desc: "Veggie noodles tossed in a fiery, homemade Schezwan sauce.", prep: 15, ingredients: ["Noodles", "Dried Chilli", "Garlic", "Bell Pepper"], allergens: ["Gluten", "Soy"], image: "https://images.unsplash.com/photo-1512058560366-cd2429598a6a?q=80&w=1000" },
        { name: "Garlic Hakka Noodles", price: 219, desc: "Noodles featuring a heavy punch of roasted golden garlic.", prep: 12, ingredients: ["Noodles", "Garlic", "Celery", "Spring Onion"], allergens: ["Gluten", "Soy"], image: "https://images.unsplash.com/photo-1512058560366-cd2429598a6a?q=80&w=1000" },
        { name: "Shanghai Noodles", price: 201, desc: "Veggies and noodles cooked in a sweet-savory traditional style.", prep: 15, ingredients: ["Noodles", "Dark Soy", "Cabbage", "Vinegar"], allergens: ["Gluten", "Soy"], image: "https://images.unsplash.com/photo-1512058560366-cd2429598a6a?q=80&w=1000" },
        { name: "Veg Manchurian", price: 269, desc: "Vegetable dumplings in a spicy, ginger-garlic soy-based gravy.", prep: 20, ingredients: ["Mix Veg Balls", "Soy Sauce", "Ginger", "Garlic"], allergens: ["Gluten", "Soy"], image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1000" },
        { name: "Veg Chilli Dry", price: 259, desc: "Stir-fried assorted veggies tossed in a spicy green chilli glaze.", prep: 18, ingredients: ["Mix Veg", "Capsicum", "Soy", "Green Chilli"], allergens: ["Soy", "Gluten"], image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000" },
        { name: "Corn Salt & Pepper", price: 289, desc: "Crispy fried corn kernels seasoned with simple salt and pepper.", prep: 15, ingredients: ["Sweet Corn", "Black Pepper", "Corn Flour"], allergens: ["Corn"], image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000" },
        { name: "Mushroom Salt & Pepper", price: 279, desc: "Lightly battered mushrooms seasoned with cracked peppercorns.", prep: 15, ingredients: ["Mushrooms", "Black Pepper", "Flour"], allergens: ["Gluten"], image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000" },
        { name: "Mushroom Chilli", price: 289, desc: "Mushrooms sautéed with capsicum and spicy chilli sauce.", prep: 18, ingredients: ["Mushrooms", "Onion", "Capsicum", "Chilli"], allergens: ["Soy", "Gluten"], image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000" },
        { name: "Paneer Chilli", price: 285, desc: "Fresh cottage cheese cubes tossed in a hot and tangy chilli base.", prep: 18, ingredients: ["Paneer", "Capsicum", "Soy Sauce", "Chillies"], allergens: ["Dairy", "Soy", "Gluten"], image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000" },
        { name: "Paneer Salt & Pepper", price: 299, desc: "Crispy paneer cubes seasoned with salt and freshly ground pepper.", prep: 15, ingredients: ["Paneer", "Pepper", "Corn Starch"], allergens: ["Dairy", "Gluten"], image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000" },
        { name: "Paneer Schezwan Dry", price: 259, desc: "Paneer chunks prepared in a hot and pungent Schezwan base.", prep: 18, ingredients: ["Paneer", "Schezwan Pepper", "Garlic"], allergens: ["Dairy", "Soy", "Gluten"], image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000" },
        { name: "Potato Chilli", price: 259, desc: "Crispy potato wedges tossed with onions and spicy chilli sauce.", prep: 15, ingredients: ["Potato", "Onion", "Soy Sauce", "Green Chilli"], allergens: ["Soy", "Gluten"], image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=1000" },
        { name: "Honey Chilli Potato", price: 269, desc: "Crispy potatoes glazed with a sweet and spicy honey chilli sauce.", prep: 15, ingredients: ["Potato", "Honey", "Chilli Flakes", "Sesame"], allergens: ["Soy", "Gluten", "Sesame"], image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=1000" },
        { name: "French Fry", price: 210, desc: "Classic golden deep-fried salted potato strips.", prep: 10, ingredients: ["Potato", "Salt", "Oil"], allergens: [], image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=1000" },
        { name: "Chana Chilli", price: 279, desc: "Boiled chickpeas sautéed with spices and a spicy chilli glaze.", prep: 15, ingredients: ["Chickpeas", "Soy Sauce", "Onion", "Chilli"], allergens: ["Soy", "Gluten"], image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000" },
        { name: "Paneer 65", price: 309, desc: "Spicy deep-fried paneer bites tempered with fresh curry leaves.", prep: 18, ingredients: ["Paneer", "Rice Flour", "Spices", "Curry Leaves"], allergens: ["Dairy", "Gluten"], image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000" },
        { name: "Cheese Chilli (Haveli Dhaba Special)", price: 399, desc: "Signature rich dish of melted cheese and spicy green chillies.", prep: 20, ingredients: ["Processed Cheese", "Paneer", "Green Chilli", "Garlic"], allergens: ["Dairy", "Soy", "Gluten"], image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000" },
        { name: "Baby Corn Chilli", price: 299, desc: "Crunchy baby corn tossed in a hot and tangy chilli soy sauce.", prep: 15, ingredients: ["Baby Corn", "Capsicum", "Onion", "Soy"], allergens: ["Soy", "Gluten"], image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000" },
        { name: "Baby Corn Salt & Pepper", price: 289, desc: "Fried baby corn pieces seasoned with sea salt and cracked pepper.", prep: 15, ingredients: ["Baby Corn", "Black Pepper", "Flour"], allergens: ["Gluten"], image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000" },
        { name: "Pan Fry Noodles", price: 280, desc: "Noodles pan-fried until crispy, served with a light veggie sauce.", prep: 20, ingredients: ["Noodles", "Mix Veg", "Soy Sauce"], allergens: ["Gluten", "Soy"], image: "https://images.unsplash.com/photo-1512058560366-cd2429598a6a?q=80&w=1000" },
        { name: "Veg Spring Roll", price: 281, desc: "Crispy rolls filled with shredded seasonal vegetables and spices.", prep: 15, ingredients: ["Flour Sheet", "Cabbage", "Carrot", "Capsicum"], allergens: ["Gluten", "Soy"], image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000" },
      ]
    },
    {
      name: "Tandoor Veg",
      isVeg: true,
      image: "https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?q=80&w=1000",
      items: [
        { name: "Paneer Tikka", price: 298, desc: "Tandoori-grilled paneer cubes marinated in yogurt and spices.", prep: 20, ingredients: ["Paneer", "Yogurt", "Ginger-Garlic", "Spices"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?q=80&w=1000" },
        { name: "Veg Hara Bhara Kabab", price: 315, desc: "Nutritious green kababs made with spinach, peas, and potatoes.", prep: 15, ingredients: ["Spinach", "Green Peas", "Potato", "Breadcrumbs"], allergens: ["Gluten", "Dairy"], image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1000" },
        { name: "Mushroom Tikka", price: 289, desc: "Fresh button mushrooms marinated and grilled in a clay oven.", prep: 15, ingredients: ["Mushrooms", "Yogurt", "Tandoori Masala"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?q=80&w=1000" },
        { name: "Veg Seek Kabab", price: 279, desc: "Skewered minced vegetables seasoned with herbs and grilled.", prep: 18, ingredients: ["Minced Veg", "Potatoes", "Spices"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1000" },
        { name: "Paneer Malai Tikka", price: 349, desc: "Mildly spiced paneer cubes in a rich, creamy white marinade.", prep: 22, ingredients: ["Paneer", "Fresh Cream", "Cheese", "Cardamom"], allergens: ["Dairy", "Nuts"], image: "https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?q=80&w=1000" },
        { name: "Veg Platter", price: 399, desc: "Assorted tandoori starters perfect for a group sampling.", prep: 25, ingredients: ["Paneer", "Mushroom", "Veg Kabab", "Soya"], allergens: ["Dairy", "Gluten", "Soy"], image: "https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?q=80&w=1000" },
        { name: "Baby Corn Tikka", price: 289, desc: "Baby corn marinated in tandoori spices and char-grilled.", prep: 15, ingredients: ["Baby Corn", "Yogurt", "Besan", "Spices"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?q=80&w=1000" },
        { name: "Paneer Aachari Tikka", price: 359, desc: "Paneer cubes marinated in a tangy pickling (achari) spice blend.", prep: 20, ingredients: ["Paneer", "Pickle Spices", "Mustard Oil", "Yogurt"], allergens: ["Dairy", "Mustard"], image: "https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?q=80&w=1000" },
        { name: "Paneer Haryali Tikka", price: 389, desc: "Cottage cheese chunks in a fresh mint and coriander marinade.", prep: 20, ingredients: ["Paneer", "Mint", "Coriander", "Green Chilli"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?q=80&w=1000" },
        { name: "Paneer Mushroom Tikka", price: 322, desc: "Skewered combination of paneer and mushrooms grilled together.", prep: 20, ingredients: ["Paneer", "Mushrooms", "Yogurt", "Spices"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?q=80&w=1000" },
        { name: "Soya Afghani Chap", price: 299, desc: "Soya chunks in a rich, creamy Afghani style white marinade.", prep: 20, ingredients: ["Soya Chap", "Cream", "Cashew Paste", "Yogurt"], allergens: ["Dairy", "Soy", "Nuts"], image: "https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?q=80&w=1000" },
        { name: "Soya Aachari Chap", price: 319, desc: "Tangy soya chunks marinated in a spicy pickling spice mix.", prep: 20, ingredients: ["Soya Chap", "Pickle Paste", "Mustard Oil"], allergens: ["Dairy", "Soy", "Mustard"], image: "https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?q=80&w=1000" },
        { name: "Soya Malai Chap", price: 349, desc: "Soft soya chunks marinated in a delicate cream and cardamom blend.", prep: 22, ingredients: ["Soya Chap", "Malai", "Cheese", "Cardamom"], allergens: ["Dairy", "Soy"], image: "https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?q=80&w=1000" },
      ]
    },
    {
      name: "Tandoor Non-Veg",
      isVeg: false,
      image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=1000",
      items: [
        { name: "Tandoori Chicken (8 ps / 4 ps)", price: 589, desc: "Whole chicken marinated in spices and yogurt, grilled in tandoor.", prep: 30, ingredients: ["Whole Chicken", "Yogurt", "Kashmiri Chilli", "Lemon"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=1000" },
        { name: "Chicken Tikka (10 ps)", price: 389, desc: "Boneless chicken chunks grilled to a smoky, spicy finish.", prep: 20, ingredients: ["Chicken Boneless", "Yogurt", "Mustard Oil", "Spices"], allergens: ["Dairy", "Mustard"], image: "https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?q=80&w=1000" },
        { name: "Chicken Malai Tikka (10 ps)", price: 399, desc: "Melt-in-mouth chicken pieces in a creamy, mild white marinade.", prep: 22, ingredients: ["Chicken", "Cream", "Cheese", "Cardamom"], allergens: ["Dairy", "Nuts"], image: "https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?q=80&w=1000" },
        { name: "Chicken Seek Kabab (8 ps)", price: 389, desc: "Skewered minced chicken seasoned with fresh cilantro and spices.", prep: 18, ingredients: ["Minced Chicken", "Coriander", "Ginger-Garlic", "Spices"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1000" },
        { name: "Chicken Lahsuni Tikka (10 ps)", price: 385, desc: "Tandoori chicken chunks flavored heavily with roasted garlic.", prep: 20, ingredients: ["Chicken", "Roasted Garlic", "Yogurt", "Spices"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?q=80&w=1000" },
        { name: "Chicken Kali Mirch Tikka (10 ps)", price: 399, desc: "Chicken pieces seasoned with pungent crushed black peppercorns.", prep: 20, ingredients: ["Chicken", "Black Pepper", "Yogurt", "Cream"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?q=80&w=1000" },
        { name: "Chicken Boti Kabab (10 ps)", price: 399, desc: "Traditional boneless chicken pieces grilled to smoky perfection.", prep: 20, ingredients: ["Chicken Boti", "Yogurt", "Dhaba Masala"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1000" },
        { name: "Pahadi Kabab (10 ps)", price: 389, desc: "Fresh green kabab flavored with mint, coriander, and green chillies.", prep: 20, ingredients: ["Chicken", "Mint Paste", "Coriander", "Yogurt"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?q=80&w=1000" },
        { name: "Chicken Haryali Kabab (10 ps)", price: 385, desc: "Chicken chunks in a fresh cilantro and herb marinade.", prep: 20, ingredients: ["Chicken", "Spinach", "Mint", "Yogurt"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?q=80&w=1000" },
        { name: "Chicken Reshmi Kabab (8 ps)", price: 395, desc: "Chicken kebabs with a silky, 'reshmi' (silken) texture.", prep: 22, ingredients: ["Chicken", "Egg White", "Cream", "Spices"], allergens: ["Dairy", "Egg"], image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1000" },
        { name: "Chicken Afghani Kabab (Bone 8 ps/4 ps)", price: 589, desc: "Rich and mildly spiced bone-in chicken in Afghani marinade.", prep: 30, ingredients: ["Chicken", "Cashew Paste", "Cream", "Melon Seeds"], allergens: ["Dairy", "Nuts"], image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=1000" },
        { name: "Chicken Platter", price: 499, desc: "A premium assortment of Haveli Dhaba's best chicken kababs.", prep: 35, ingredients: ["Chicken Tikka", "Malai Tikka", "Seek Kabab", "Haryali"], allergens: ["Dairy", "Nuts", "Egg"], image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=1000" },
        { name: "Kali Mirch Tandoori with Bone (8 ps/4 ps)", price: 599, desc: "Bone-in chicken seasoned with bold black pepper and grilled.", prep: 30, ingredients: ["Chicken", "Crushed Pepper", "Yogurt", "Ghee"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=1000" },
        { name: "Haveli Dhaba Special Kabab (Bone Less 10 ps)", price: 499, desc: "Chef's special boneless kebab with a unique spice blend.", prep: 25, ingredients: ["Chicken", "Secret Dhaba Spices", "Lemon", "Ginger"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?q=80&w=1000" },
        { name: "Haveli Dhaba Special Kabab (Bone 8 ps)", price: 599, desc: "Our signature bone-in chicken preparation, a house specialty.", prep: 30, ingredients: ["Chicken", "Traditional Dhaba Spices", "Mustard Oil"], allergens: ["Dairy", "Mustard"], image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=1000" },
      ]
    },
    {
      name: "Indian Bread",
      isVeg: true,
      image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=1000",
      items: [
        { name: "Tandoori Roti Plain", price: 30, desc: "Wheat flour bread baked in a traditional clay oven.", prep: 8, ingredients: ["Whole Wheat Flour", "Water"], allergens: ["Gluten"], image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=1000" },
        { name: "Tandoori Roti Butter", price: 35, desc: "Tandoori roti brushed with golden yellow butter.", prep: 8, ingredients: ["Whole Wheat Flour", "Butter"], allergens: ["Gluten", "Dairy"], image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=1000" },
        { name: "Tawa Roti Plain", price: 22, desc: "Hand-rolled wheat flatbread cooked on a griddle.", prep: 5, ingredients: ["Whole Wheat Flour"], allergens: ["Gluten"], image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000" },
        { name: "Tawa Roti Butter", price: 30, desc: "Wheat tawa roti topped with melted butter.", prep: 5, ingredients: ["Whole Wheat Flour", "Butter"], allergens: ["Gluten", "Dairy"], image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000" },
        { name: "Plain Naan", price: 60, desc: "Soft, leavened white flour bread baked in tandoor.", prep: 10, ingredients: ["Refined Flour", "Yeast", "Milk"], allergens: ["Gluten", "Dairy"], image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=1000" },
        { name: "Butter Naan", price: 80, desc: "Soft naan topped with a generous amount of butter.", prep: 10, ingredients: ["Refined Flour", "Butter", "Milk"], allergens: ["Gluten", "Dairy"], image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=1000" },
        { name: "Masala Kulcha", price: 79, desc: "Leavened bread stuffed with spicy potato and onion mix.", prep: 12, ingredients: ["Flour", "Potato", "Onion", "Amchur"], allergens: ["Gluten", "Dairy"], image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=1000" },
        { name: "Garlic Naan", price: 89, desc: "Naan topped with chopped garlic and coriander leaves.", prep: 12, ingredients: ["Flour", "Minced Garlic", "Coriander", "Butter"], allergens: ["Gluten", "Dairy"], image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=1000" },
        { name: "Missi Roti", price: 60, desc: "Spiced chickpea flour and wheat bread with fenugreek.", prep: 10, ingredients: ["Besan", "Wheat Flour", "Fenugreek", "Cumin"], allergens: ["Gluten"], image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=1000" },
        { name: "Aloo Paratha", price: 60, desc: "Wheat flatbread stuffed with mashed seasoned potatoes.", prep: 15, ingredients: ["Wheat Flour", "Potato", "Green Chilli", "Ghee"], allergens: ["Gluten", "Dairy"], image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000" },
        { name: "Paneer Kulcha", price: 80, desc: "Bread stuffed with spiced crumbled cottage cheese.", prep: 15, ingredients: ["Flour", "Paneer", "Spices", "Coriander"], allergens: ["Gluten", "Dairy"], image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=1000" },
        { name: "Shahi Naan", price: 95, desc: "Royal naan topped with dry fruits and nuts.", prep: 15, ingredients: ["Flour", "Cashews", "Raisins", "Butter"], allergens: ["Gluten", "Dairy", "Nuts"], image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=1000" },
        { name: "Plain Kulcha", price: 60, desc: "Unstuffed soft leavened bread baked in tandoor.", prep: 10, ingredients: ["Flour", "Milk", "Yeast"], allergens: ["Gluten", "Dairy"], image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=1000" },
        { name: "Cheese Naan", price: 85, desc: "Naan bread stuffed with melted cheese.", prep: 15, ingredients: ["Flour", "Processed Cheese", "Butter"], allergens: ["Gluten", "Dairy"], image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=1000" },
      ]
    },
    {
      name: "Soup Veg",
      isVeg: true,
      image: "https://images.unsplash.com/photo-1547592115-0dec33f78d7a?q=80&w=1000",
      items: [
        { name: "Veg Manchow Soup", price: 189, desc: "Spicy and thick Indo-Chinese soup served with crispy noodles.", prep: 12, ingredients: ["Vegetable Broth", "Cabbage", "Soy", "Crispy Noodles"], allergens: ["Soy", "Gluten"], image: "https://images.unsplash.com/photo-1547592115-0dec33f78d7a?q=80&w=1000" },
        { name: "Veg Hot & Sour Soup", price: 179, desc: "Tangy and spicy broth with assorted vegetables and mushrooms.", prep: 12, ingredients: ["Mix Veg", "Vinegar", "Chilli Sauce", "Soy"], allergens: ["Soy"], image: "https://images.unsplash.com/photo-1547592115-0dec33f78d7a?q=80&w=1000" },
        { name: "Lemon Garlic Veg Soup", price: 155, desc: "Light vegetable soup with zesty lemon and roasted garlic.", prep: 10, ingredients: ["Clear Broth", "Lemon Juice", "Garlic", "Coriander"], allergens: [], image: "https://images.unsplash.com/photo-1547592115-0dec33f78d7a?q=80&w=1000" },
        { name: "Veg Coriander Soup", price: 149, desc: "Refreshing clear soup with plenty of fresh cilantro.", prep: 10, ingredients: ["Veg Stock", "Coriander", "Ginger", "Lemon"], allergens: [], image: "https://images.unsplash.com/photo-1547592115-0dec33f78d7a?q=80&w=1000" },
        { name: "Sweet Corn Soup", price: 169, desc: "Creamy soup with sweet corn kernels and mild spices.", prep: 12, ingredients: ["Sweet Corn", "Cream", "Veg Stock"], allergens: ["Corn"], image: "https://images.unsplash.com/photo-1547592115-0dec33f78d7a?q=80&w=1000" },
        { name: "Veg Clear Soup", price: 145, desc: "Healthy transparent broth with steamed seasonal vegetables.", prep: 10, ingredients: ["Water", "Carrot", "Beans", "Salt"], allergens: [], image: "https://images.unsplash.com/photo-1547592115-0dec33f78d7a?q=80&w=1000" },
        { name: "Tomato Soup", price: 160, desc: "Classic soup made from slow-cooked fresh tomatoes.", prep: 10, ingredients: ["Tomato", "Cream", "Herbs"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1547592115-0dec33f78d7a?q=80&w=1000" },
        { name: "Cream of Tomato Soup", price: 165, desc: "Smooth tomato soup enriched with butter and cream.", prep: 12, ingredients: ["Tomato", "Fresh Cream", "Butter"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1547592115-0dec33f78d7a?q=80&w=1000" },
        { name: "Cream of Musroom Soup", price: 189, desc: "Thick mushroom puree blended with fresh cream.", prep: 15, ingredients: ["Mushrooms", "Cream", "Butter", "Black Pepper"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1547592115-0dec33f78d7a?q=80&w=1000" },
      ]
    },
    {
      name: "Soup Non-Veg",
      isVeg: false,
      image: "https://images.unsplash.com/photo-1547592115-0dec33f78d7a?q=80&w=1000",
      items: [
        { name: "Chicken Manchow Soup", price: 189, desc: "Spicy thick soup with chicken bits and fried noodles.", prep: 15, ingredients: ["Chicken Stock", "Chicken Bits", "Soy Sauce", "Noodles"], allergens: ["Soy", "Gluten", "Egg"], image: "https://images.unsplash.com/photo-1547592115-0dec33f78d7a?q=80&w=1000" },
        { name: "Chicken Hot & Soup Sour", price: 185, desc: "Spicy chicken soup with a tangy finish and egg drops.", prep: 15, ingredients: ["Chicken", "Egg", "Soy", "Chilli Sauce"], allergens: ["Soy", "Egg"], image: "https://images.unsplash.com/photo-1547592115-0dec33f78d7a?q=80&w=1000" },
        { name: "Chicken Lemon Garlic Soup", price: 179, desc: "Zesty chicken soup flavored with lemon and roasted garlic.", prep: 12, ingredients: ["Chicken Stock", "Garlic", "Lemon", "Chicken pieces"], allergens: [], image: "https://images.unsplash.com/photo-1547592115-0dec33f78d7a?q=80&w=1000" },
        { name: "Chicken Soup Coriander", price: 175, desc: "Chicken clear soup infused with fresh coriander leaves.", prep: 12, ingredients: ["Chicken Stock", "Coriander", "Ginger"], allergens: [], image: "https://images.unsplash.com/photo-1547592115-0dec33f78d7a?q=80&w=1000" },
        { name: "Chicken Sweet Corn Soup", price: 180, desc: "Creamy soup with shredded chicken and sweet corn kernels.", prep: 15, ingredients: ["Chicken", "Sweet Corn", "Cream"], allergens: ["Corn"], image: "https://images.unsplash.com/photo-1547592115-0dec33f78d7a?q=80&w=1000" },
        { name: "Chicken Clear Soup", price: 170, desc: "Simple chicken broth with clear flavors and lean chicken pieces.", prep: 12, ingredients: ["Chicken", "Onion", "Black Pepper"], allergens: [], image: "https://images.unsplash.com/photo-1547592115-0dec33f78d7a?q=80&w=1000" },
      ]
    },
    {
      name: "Indian Veg Main Course",
      isVeg: true,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000",
      items: [
        { name: "Paneer Tikka Masala", price: 389, desc: "Grilled paneer tikka chunks simmered in a spiced masala gravy.", prep: 20, ingredients: ["Grilled Paneer", "Tomato", "Onion", "Cream"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Paneer Tikka Butter Masala", price: 399, desc: "Smoky paneer tikka in a rich, buttery and creamy tomato sauce.", prep: 22, ingredients: ["Paneer Tikka", "Butter", "Cream", "Cashew Paste"], allergens: ["Dairy", "Nuts"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Paneer Masala", price: 379, desc: "Paneer cooked in a traditional Indian spiced onion-tomato base.", prep: 18, ingredients: ["Paneer", "Onion", "Tomato", "Spices"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Paneer Butter Masala", price: 385, desc: "Soft paneer in a silky smooth, mildly sweet buttery gravy.", prep: 20, ingredients: ["Paneer", "Butter", "Cream", "Honey"], allergens: ["Dairy", "Nuts"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Kadhai Paneer", price: 378, desc: "Paneer tossed with capsicum and fresh ground spices in a wok.", prep: 20, ingredients: ["Paneer", "Bell Peppers", "Kadhai Masala"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Paneer Keema", price: 349, desc: "Minced paneer cooked with green peas and aromatic spices.", prep: 18, ingredients: ["Minced Paneer", "Green Peas", "Tomato", "Spices"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Paneer Do Pyaza", price: 385, desc: "Paneer cooked with twice the amount of onions in a thick gravy.", prep: 20, ingredients: ["Paneer", "Diced Onions", "Fried Onions", "Tomato"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Matar Paneer", price: 369, desc: "Homestyle curry made with cottage cheese and sweet green peas.", prep: 18, ingredients: ["Paneer", "Green Peas", "Indian Curry Base"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Shahi Paneer", price: 399, desc: "Royal paneer dish prepared in a luscious white cashew gravy.", prep: 22, ingredients: ["Paneer", "Cashew Cream", "Cardamom", "Saffron"], allergens: ["Dairy", "Nuts"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Paneer Methi Malai", price: 379, desc: "Paneer in a fragrant cream sauce flavored with fenugreek leaves.", prep: 22, ingredients: ["Paneer", "Fresh Fenugreek", "Cream", "Garlic"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Paneer Mushroom Masala", price: 399, desc: "Hearty combination of paneer and mushrooms in a spicy gravy.", prep: 20, ingredients: ["Paneer", "Mushroom", "Onion-Tomato Masala"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Palak Paneer", price: 381, desc: "Healthy dish of paneer cubes in a smooth spinach puree.", prep: 18, ingredients: ["Paneer", "Spinach", "Cream", "Ginger"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Palak Paneer Lehsuni", price: 369, desc: "Spinach paneer with a heavy tempering of roasted garlic.", prep: 20, ingredients: ["Paneer", "Spinach", "Garlic bits", "Ghee"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Paneer Chatpata", price: 380, desc: "Paneer cooked in a tangy, spicy and uniquely flavored sauce.", prep: 20, ingredients: ["Paneer", "Tamarind", "Chilli", "Jaggery"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Paneer Shahi Kofta", price: 390, desc: "Royal paneer dumplings served in a rich and velvety gravy.", prep: 25, ingredients: ["Paneer Balls", "Cream", "Cashew Sauce", "Butter"], allergens: ["Dairy", "Nuts", "Gluten"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Mushroom Chatpata", price: 349, desc: "Mushrooms sautéed in a tangy and spicy tomato-based sauce.", prep: 18, ingredients: ["Mushrooms", "Lemon Juice", "Chilli", "Coriander"], allergens: [], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Mushroom Do Pyaza", price: 359, desc: "Mushrooms prepared with a double portion of sautéed onions.", prep: 18, ingredients: ["Mushrooms", "Onion Bulbs", "Spices"], allergens: [], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Mushroom Masala", price: 385, desc: "Fresh button mushrooms cooked in a thick spicy Indian gravy.", prep: 18, ingredients: ["Mushrooms", "Onion", "Tomato Masala"], allergens: [], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Mushroom Kadhai", price: 389, desc: "Mushrooms tossed with bell peppers and ground kadhai spices.", prep: 20, ingredients: ["Mushrooms", "Capsicum", "Spices"], allergens: [], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Corn Mushroom Masala", price: 379, desc: "Sweet corn and mushrooms in a rich and flavorful gravy.", prep: 20, ingredients: ["Sweet Corn", "Mushrooms", "Onion Base"], allergens: ["Corn"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Matar Mushroom", price: 369, desc: "Earthy mushrooms and green peas in a comforting curry.", prep: 18, ingredients: ["Mushrooms", "Peas", "Tomato Masala"], allergens: [], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Mushroom Hyderabadi", price: 375, desc: "Mushrooms cooked in a spicy, spinach-based Hyderabadi style.", prep: 20, ingredients: ["Mushrooms", "Spinach", "Green Chilli"], allergens: [], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Mix Veg", price: 299, desc: "Assorted seasonal vegetables cooked in a blend of Indian spices.", prep: 18, ingredients: ["Carrot", "Beans", "Peas", "Potato", "Paneer"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Veg Kadhai", price: 369, desc: "Mixed vegetables tossed with fresh spices in a traditional wok.", prep: 20, ingredients: ["Assorted Veg", "Kadhai Masala"], allergens: [], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Veg Do Pyaza", price: 379, desc: "Mixed vegetables prepared with plenty of caramelized onions.", prep: 20, ingredients: ["Mix Veg", "Onions", "Spices"], allergens: [], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Tawa Veg", price: 359, desc: "Seasonal vegetables stir-fried on a flat griddle with spices.", prep: 15, ingredients: ["Veggies", "Griddle Spices"], allergens: [], image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000" },
        { name: "Aloo Gobi Matar", price: 269, desc: "Classic trio of potato, cauliflower, and green peas.", prep: 15, ingredients: ["Potato", "Cauliflower", "Peas"], allergens: [], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Aloo Dam Kashmiri", price: 259, desc: "Fried whole baby potatoes in a sweet-spicy Kashmiri gravy.", prep: 20, ingredients: ["Potato", "Saffron", "Dry Ginger", "Fennel"], allergens: [], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Aloo Matar", price: 255, desc: "Simple homestyle potato and pea curry.", prep: 15, ingredients: ["Potato", "Green Peas", "Cumin"], allergens: [], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Baby Corn Masala", price: 369, desc: "Tender baby corn pieces sautéed in a thick tomato-based sauce.", prep: 18, ingredients: ["Baby Corn", "Tomato", "Ginger-Garlic"], allergens: [], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Palak Corn Lehsuni", price: 295, desc: "Smooth spinach puree with sweet corn and heavy garlic tempering.", prep: 18, ingredients: ["Spinach", "Sweet Corn", "Fried Garlic"], allergens: ["Corn"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Soya Chap Masala", price: 349, desc: "Meaty soya chunks cooked in a thick and spicy masala gravy.", prep: 20, ingredients: ["Soya Chap", "Tomato", "Onion", "Ghee"], allergens: ["Soy", "Dairy"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Paneer Pakoda", price: 349, desc: "Fresh cottage cheese fritters fried to a golden crisp.", prep: 15, ingredients: ["Paneer", "Gram Flour", "Chilli"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000" },
        { name: "Onion Pakoda", price: 259, desc: "Spiced onion fritters, a perfect tea-time or starter snack.", prep: 15, ingredients: ["Onion", "Gram Flour", "Cumin"], allergens: [], image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000" },
        { name: "Navratan Korma", price: 289, desc: "Nine varieties of vegetables and fruits in a mild creamy sauce.", prep: 22, ingredients: ["Mix Veg", "Fruit bits", "Cream Sauce"], allergens: ["Dairy", "Nuts"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Kaju Kadhai", price: 449, desc: "Roasted cashews cooked in a spicy kadhai gravy with capsicum.", prep: 22, ingredients: ["Cashews", "Capsicum", "Tomato", "Spices"], allergens: ["Nuts", "Dairy"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Kaju Masala", price: 459, desc: "Whole cashews simmered in a rich and spicy tomato-onion base.", prep: 22, ingredients: ["Cashews", "Gravy Base", "Butter"], allergens: ["Nuts", "Dairy"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Malai Kofta", price: 339, desc: "Paneer dumplings served in a silky smooth, nutty mild gravy.", prep: 25, ingredients: ["Paneer Balls", "Cream", "Cashew Gravy"], allergens: ["Dairy", "Nuts", "Gluten"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Veg Kofta", price: 299, desc: "Mixed vegetable dumplings in a spicy Indian red gravy.", prep: 22, ingredients: ["Veg Balls", "Onion-Tomato Gravy"], allergens: ["Gluten"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Nargis Kofta", price: 315, desc: "Vegetable dumplings stuffed with paneer in a rich gravy.", prep: 25, ingredients: ["Veg Shell", "Paneer Core", "Rich Sauce"], allergens: ["Dairy", "Gluten"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Veg Akbari", price: 295, desc: "Assorted vegetables cooked in a royal, yellow spicy gravy.", prep: 20, ingredients: ["Mix Veg", "Turmeric Sauce", "Cream"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Chana Masala", price: 289, desc: "Hearty chickpeas cooked in a robust blend of Indian spices.", prep: 15, ingredients: ["Chickpeas", "Tomato", "Coriander"], allergens: [], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Punjabi Chana Masala", price: 295, desc: "Spicy dark chickpea curry prepared in traditional Punjabi style.", prep: 18, ingredients: ["Black Chana", "Tea leaves", "Ginger", "Amla"], allergens: [], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
      ]
    },
    {
      name: "Indian Non-Veg Main Course",
      isVeg: false,
      image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000",
      items: [
        { name: "Chicken Curry (4 P/2 P)", price: 469, desc: "Standard home-style chicken curry with flavorful thin gravy.", prep: 25, ingredients: ["Chicken", "Onion", "Tomato Stock"], allergens: [], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Chicken Handi (4 P/2 P)", price: 489, desc: "Chicken slow-cooked in a clay pot with traditional spices.", prep: 30, ingredients: ["Chicken", "Yogurt", "Clay Pot Spices"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Chicken Do Pyaza (4P)", price: 465, desc: "Chicken chunks cooked with a double layer of sweet onions.", prep: 25, ingredients: ["Chicken", "Caramelized Onions", "Tomato"], allergens: [], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Chicken Kassa (4 Pis)", price: 479, desc: "A dry and spicy slow-roasted chicken preparation with thick gravy.", prep: 28, ingredients: ["Chicken", "Roasted Spices", "Mustard Oil"], allergens: ["Mustard"], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Chicken Butter Masala (4 P/2 P)", price: 499, desc: "Tandoori chicken pieces in a rich tomato and butter-based gravy.", prep: 28, ingredients: ["Chicken Tikka", "Butter", "Tomato Cream Sauce"], allergens: ["Dairy", "Nuts"], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Chicken Masala (4 P)", price: 479, desc: "Chicken sautéed in a thick, aromatic onion-tomato masala base.", prep: 25, ingredients: ["Chicken", "Garam Masala", "Ginger-Garlic"], allergens: [], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Chicken Tikka Masala (8P)", price: 449, desc: "Grilled chicken tikka pieces simmered in a spicy masala gravy.", prep: 28, ingredients: ["Chicken Tikka", "Spicy Gravy"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Chicken Tikka Butter Masala (8 P)", price: 459, desc: "Tikka pieces in a silky, butter-enriched creamy tomato sauce.", prep: 28, ingredients: ["Chicken Tikka", "Butter", "Cashew Sauce"], allergens: ["Dairy", "Nuts"], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Chicken Lawabdar (4P)", price: 489, desc: "Tender chicken in a mildly spicy and velvety creamy gravy.", prep: 28, ingredients: ["Chicken", "Cream", "Melon Seeds"], allergens: ["Dairy", "Nuts"], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Chicken Lakhnawi (4 P)", price: 480, desc: "Slow-cooked chicken prepared with aromatic Lucknowi spices.", prep: 30, ingredients: ["Chicken", "Rose Water", "Mace", "Cardamom"], allergens: [], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Chicken Patiala Bone (4P)", price: 479, desc: "Spicy and tangy chicken curry prepared in traditional Patiala style.", prep: 30, ingredients: ["Chicken", "Omelette wrapper", "Spicy Sauce"], allergens: ["Egg"], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Chicken Patiala Boneless (8P)", price: 489, desc: "Boneless version of the spicy and tangy Patiala chicken curry.", prep: 30, ingredients: ["Chicken Boneless", "Spices", "Egg garnish"], allergens: ["Egg"], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Chicken Kadhai (4P)", price: 475, desc: "Chicken and capsicum stir-fried with fresh ground spices in a wok.", prep: 25, ingredients: ["Chicken", "Bell Peppers", "Kadhai Masala"], allergens: [], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Chicken Kolhapuri (4 P)", price: 485, desc: "Fiery spicy chicken curry using traditional Kolhapuri chillies.", prep: 28, ingredients: ["Chicken", "Kolhapuri Masala", "Dry Coconut"], allergens: [], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Chicken Methi Malai (8 P)", price: 689, desc: "Rich chicken dish flavored with fenugreek and heavy cream.", prep: 30, ingredients: ["Chicken", "Fresh Fenugreek", "Cream", "Garlic"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Haveli Dhaba Special Chicken (8 P)", price: 699, desc: "Our house specialty rich chicken preparation with unique secret spices.", prep: 35, ingredients: ["Chicken", "House Spice Mix", "Ghee"], allergens: ["Dairy", "Nuts"], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Tawa Chicken (4P)", price: 499, desc: "Succulent chicken cooked on a griddle with plenty of spices.", prep: 25, ingredients: ["Chicken", "Tomato", "Ginger", "Green Chilli"], allergens: [], image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1000" },
        { name: "Chicken Bhuna Gosht (4P)", price: 489, desc: "Slow-roasted chicken in a dry, concentrated spice gravy.", prep: 30, ingredients: ["Chicken", "Roasted Onion Paste"], allergens: [], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Murg Masallam (8P/4P)", price: 699, desc: "Whole chicken roasted and served in a rich egg-enriched gravy.", prep: 40, ingredients: ["Whole Chicken", "Boiled Egg", "Cashew Sauce"], allergens: ["Dairy", "Nuts", "Egg"], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Chicken Dehati", price: 689, desc: "Rustic village-style chicken curry with strong mustard oil flavor.", prep: 35, ingredients: ["Chicken", "Whole Spices", "Mustard Oil"], allergens: ["Mustard"], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Chicken Bharta", price: 449, desc: "Shredded chicken prepared in a rich and creamy egg-based gravy.", prep: 25, ingredients: ["Shredded Chicken", "Mashed Egg", "Cream"], allergens: ["Dairy", "Egg"], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Egg Curry (2P)", price: 219, desc: "Boiled eggs served in a flavorful onion-tomato based gravy.", prep: 15, ingredients: ["Boiled Egg", "Indian Sauce Base"], allergens: ["Egg"], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Egg Masala (2P)", price: 222, desc: "Eggs cooked in a thick and spicy masala base.", prep: 15, ingredients: ["Egg", "Onion-Tomato Masala"], allergens: ["Egg"], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Egg Do Pyaza (2 P)", price: 229, desc: "Eggs prepared with a generous amount of sautéed onions.", prep: 18, ingredients: ["Egg", "Diced Onions"], allergens: ["Egg"], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Fish Curry (2P)", price: 269, desc: "Fresh fish pieces in a light and aromatic Indian fish gravy.", prep: 20, ingredients: ["Fish", "Mustard Paste", "Tamarind"], allergens: ["Fish", "Mustard"], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Fish Masala (2P)", price: 289, desc: "Spiced pan-fried fish pieces in a thick masala gravy.", prep: 22, ingredients: ["Fish", "Onion", "Tomato", "Garlic"], allergens: ["Fish"], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Fish Fry (2 P)", price: 199, desc: "Crispy deep-fried fish pieces marinated in traditional spices.", prep: 15, ingredients: ["Fish", "Gram Flour", "Chilli"], allergens: ["Fish"], image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1000" },
        { name: "Fish Do Pyaza (2 P)", price: 299, desc: "Fish chunks cooked with plenty of caramelized onions.", prep: 22, ingredients: ["Fish", "Onions", "Spices"], allergens: ["Fish"], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Mutton Curry (4P)", price: 599, desc: "Tender goat meat slow-cooked in a traditional Indian curry.", prep: 35, ingredients: ["Mutton", "Curry base"], allergens: [], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Mutton Dehati (8 P/4P)", price: 949, desc: "Classic rustic village-style mutton curry cooked on slow fire.", prep: 45, ingredients: ["Mutton", "Whole Garlic", "Mustard Oil"], allergens: ["Mustard"], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Mutton Kassa (4 P)", price: 579, desc: "Spicy dry-braised mutton dish with deep concentrated flavors.", prep: 40, ingredients: ["Mutton", "Roasted Onion", "Garam Masala"], allergens: [], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
        { name: "Mutton Rogan Josh (4P)", price: 589, desc: "Kashmiri-style mutton curry with a thin, vibrant red gravy.", prep: 40, ingredients: ["Mutton", "Ratan Jot", "Dry Ginger", "Fennel"], allergens: [], image: "https://images.unsplash.com/photo-1603894584134-f1746b3f309a?q=80&w=1000" },
      ]
    },
    {
      name: "Rice & Biryani",
      isVeg: true,
      image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?q=80&w=1000",
      items: [
        { name: "Steam Rice", price: 115, desc: "Classic long-grain steamed basmati rice.", prep: 10, ingredients: ["Basmati Rice"], allergens: [], image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?q=80&w=1000" },
        { name: "Jeera Rice", price: 129, desc: "Fragrant rice tempered with cumin seeds and ghee.", prep: 12, ingredients: ["Rice", "Cumin", "Ghee"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?q=80&w=1000" },
        { name: "Veg Mix Pulaw", price: 199, desc: "Aromatic basmati rice cooked with assorted vegetables.", prep: 15, ingredients: ["Rice", "Mix Veg", "Whole Spices"], allergens: [], image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?q=80&w=1000" },
        { name: "Pease Pulaw", price: 159, desc: "Basmati rice cooked with sweet green peas and mild spices.", prep: 15, ingredients: ["Rice", "Green Peas", "Cumin"], allergens: [], image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?q=80&w=1000" },
        { name: "Kashmiri Pulaw", price: 209, desc: "Sweet and aromatic rice cooked with dry fruits and nuts.", prep: 18, ingredients: ["Rice", "Raisins", "Cashews", "Fruits"], allergens: ["Nuts"], image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?q=80&w=1000" },
        { name: "Veg Biryani", price: 329, desc: "Fragrant rice layered with spiced vegetables and herbs.", prep: 25, ingredients: ["Rice", "Mix Veg", "Saffron", "Spices"], allergens: [], image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?q=80&w=1000" },
        { name: "Veg Hydrabadi Biryani", price: 339, desc: "Spicy Hyderabadi style biryani cooked with veggies.", prep: 25, ingredients: ["Rice", "Spicy Veg", "Fried Onions"], allergens: [], image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?q=80&w=1000" },
        { name: "Veg Kolhapuri Biryani", price: 349, desc: "Extra spicy biryani influenced by Kolhapuri flavors.", prep: 25, ingredients: ["Rice", "Kolhapuri Masala", "Veg"], allergens: [], image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?q=80&w=1000" },
        { name: "Paneer Biryani", price: 329, desc: "Aromatic rice layered with spiced paneer cubes.", prep: 25, ingredients: ["Rice", "Paneer", "Dum spices"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?q=80&w=1000" },
        { name: "Egg Biryani", price: 310, isVeg: false, desc: "Long-grain rice cooked with hard-boiled spiced eggs.", prep: 22, ingredients: ["Rice", "Boiled Eggs", "Biryani Masala"], allergens: ["Egg"], image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?q=80&w=1000" },
        { name: "Chicken Dum Biryani", price: 369, isVeg: false, desc: "Traditional slow-cooked chicken and rice preparation.", prep: 30, ingredients: ["Rice", "Chicken", "Kesar", "Dum Spices"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?q=80&w=1000" },
        { name: "Chicken Hydrabadi Biryani", price: 379, isVeg: false, desc: "Authentic spicy Hyderabadi chicken biryani.", prep: 30, ingredients: ["Rice", "Spicy Chicken", "Hyderabadi Spices"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?q=80&w=1000" },
        { name: "Chicken Kolkata Dum Biryani", price: 389, isVeg: false, desc: "Mildly spiced chicken biryani served with a potato.", prep: 30, ingredients: ["Rice", "Chicken", "Potato", "Sweet Spices"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?q=80&w=1000" },
        { name: "Mutton Dum Biryani", price: 399, isVeg: false, desc: "Slow-cooked rice and tender mutton layered together.", prep: 35, ingredients: ["Rice", "Mutton", "Nutmeg", "Saffron"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?q=80&w=1000" },
        { name: "Mutton Hydrabadi Biryani", price: 385, isVeg: false, desc: "Spicy Hyderabadi goat meat biryani.", prep: 35, ingredients: ["Rice", "Mutton", "Fried Onions", "Chilli"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?q=80&w=1000" },
        { name: "Mutton Kolkata Dum Biryani", price: 389, isVeg: false, desc: "Kolkata style mutton biryani with potato and mild aroma.", prep: 35, ingredients: ["Rice", "Mutton", "Potato", "Rose Water"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?q=80&w=1000" },
      ]
    },
    {
      name: "Daal",
      isVeg: true,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000",
      items: [
        { name: "Daal Fry", price: 199, desc: "Yellow lentils tempered with onions, tomatoes, and cumin.", prep: 12, ingredients: ["Tur Dal", "Cumin", "Onion", "Garlic"], allergens: [], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Daal Makhani", price: 239, desc: "Slow-cooked black lentils with cream and butter.", prep: 25, ingredients: ["Black Dal", "Kidney Beans", "Butter", "Cream"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Daal Tadka", price: 249, desc: "Lentils with a vibrant tempering of dried chillies and garlic.", prep: 12, ingredients: ["Toor Dal", "Dried Chilli", "Fried Garlic"], allergens: [], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Daal Amritsari", price: 259, desc: "Thick, split black gram lentils cooked in Amritsari style.", prep: 18, ingredients: ["Split Urad Dal", "Chana Dal", "Ginger"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Daal Makkhan Wala", price: 255, desc: "Silky yellow lentils finished with a heavy hand of butter.", prep: 15, ingredients: ["Mixed Lentils", "Extra Butter"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Dal Handi", price: 245, desc: "Lentils slow-cooked in a handi with rich dhaba spices.", prep: 20, ingredients: ["Lentils", "Handi Spices"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Egg Daal Tadka", price: 265, isVeg: false, desc: "Spiced lentils with a unique tempering of scrambled eggs.", prep: 18, ingredients: ["Yellow Dal", "Egg", "Spices"], allergens: ["Egg"], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
        { name: "Daal Do Pyaza", price: 249, desc: "Lentils cooked with a double portion of savory onions.", prep: 18, ingredients: ["Lentils", "Caramelized Onions"], allergens: [], image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000" },
      ]
    },
    {
      name: "Chinese Rice",
      isVeg: true,
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1000",
      items: [
        { name: "Egg Fry Rice", price: 229, isVeg: false, desc: "Indo-Chinese style fried rice with scrambled eggs.", prep: 12, ingredients: ["Rice", "Egg", "Soy Sauce"], allergens: ["Egg", "Soy"], image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1000" },
        { name: "Chicken Fry Rice", price: 259, isVeg: false, desc: "Wok-tossed fried rice with chicken bits and vegetables.", prep: 15, ingredients: ["Rice", "Chicken", "Soy Sauce"], allergens: ["Soy"], image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1000" },
        { name: "Mix Fry Rice Non-Veg", price: 289, isVeg: false, desc: "Fried rice containing chicken, egg, and shrimp.", prep: 18, ingredients: ["Rice", "Chicken", "Egg", "Shrimp"], allergens: ["Egg", "Soy", "Shellfish"], image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1000" },
        { name: "Chicken Schezwan Fry Rice", price: 255, isVeg: false, desc: "Spicy fried rice with chicken in Schezwan sauce.", prep: 15, ingredients: ["Rice", "Chicken", "Schezwan Sauce"], allergens: ["Soy"], image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1000" },
        { name: "Chicken Shanghai Fry Rice", price: 259, isVeg: false, desc: "Savory fried rice prepared with Shanghai style flavors.", prep: 18, ingredients: ["Rice", "Chicken", "Ginger", "Soy"], allergens: ["Soy"], image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1000" },
        { name: "Veg Fry Rice", price: 189, desc: "Simple and clean fried rice with garden vegetables.", prep: 12, ingredients: ["Rice", "Mix Veg", "Soy"], allergens: ["Soy"], image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1000" },
        { name: "Mix Veg Fry Rice", price: 249, desc: "Wok-tossed rice with a heavy portion of assorted veggies.", prep: 15, ingredients: ["Rice", "Assorted Veg", "Soy"], allergens: ["Soy"], image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1000" },
        { name: "Schezwan Fry Rice", price: 199, desc: "Spicy vegetable fried rice in fiery Schezwan sauce.", prep: 15, ingredients: ["Rice", "Veg", "Red Chilli Paste"], allergens: ["Soy"], image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1000" },
        { name: "Shanghai Fry Rice", price: 219, desc: "Vegetable fried rice with traditional Shanghai seasonings.", prep: 15, ingredients: ["Rice", "Veggies", "Shanghai Sauce"], allergens: ["Soy"], image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1000" },
        { name: "Singapoori Fry Rice", price: 229, desc: "Turmeric flavored rice with curry powder and veggies.", prep: 15, ingredients: ["Rice", "Curry Powder", "Veg"], allergens: ["Soy"], image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1000" },
      ]
    },
    {
      name: "Sides, Salad & Raita",
      isVeg: true,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000",
      items: [
        { name: "Green Salad", price: 99, desc: "Fresh seasonal sliced raw vegetables.", prep: 5, ingredients: ["Cucumber", "Carrot", "Onion", "Tomato"], allergens: [], image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000" },
        { name: "Onion Salad", price: 69, desc: "Sliced onions with lemon and green chillies.", prep: 5, ingredients: ["Onion", "Lemon", "Chilli"], allergens: [], image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000" },
        { name: "Kachumber Salad", price: 189, desc: "Diced vegetables tossed with lemon juice and chaat masala.", prep: 8, ingredients: ["Tomato", "Cucumber", "Onion", "Chaat Masala"], allergens: [], image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000" },
        { name: "Peanut Salad", price: 199, desc: "Crunchy roasted peanuts with onions and tangy spices.", prep: 10, ingredients: ["Peanuts", "Onion", "Tomato", "Lemon"], allergens: ["Nuts"], image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000" },
        { name: "Masala Papad", price: 109, desc: "Crispy papad topped with spicy onion-tomato salad.", prep: 8, ingredients: ["Papad", "Onion", "Tomato", "Spices"], allergens: [], image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000" },
        { name: "Plain Curd", price: 89, desc: "Freshly set thick yogurt.", prep: 5, ingredients: ["Milk"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000" },
        { name: "Mix Raita", price: 129, desc: "Yogurt with diced vegetables and roasted cumin.", prep: 8, ingredients: ["Yogurt", "Cucumber", "Onion", "Tomato"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000" },
        { name: "Bundi Raita", price: 105, desc: "Yogurt with crispy chickpea flour droplets.", prep: 8, ingredients: ["Yogurt", "Boondi"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000" },
        { name: "Pineapple Raita", price: 149, desc: "Sweet and tangy yogurt with pineapple bits.", prep: 10, ingredients: ["Yogurt", "Pineapple", "Sugar"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000" },
      ]
    },
    {
      name: "Desserts & Drinks",
      isVeg: true,
      image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=1000",
      items: [
        { name: "Hot Gulab Jamun", price: 79, desc: "Warm milk-solid dumplings in rose-scented syrup.", prep: 5, ingredients: ["Khoya", "Sugar Syrup", "Cardamom"], allergens: ["Dairy", "Gluten"], image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=1000" },
        { name: "Hot Gulab Jamun with Ice-Creame", price: 139, desc: "Warm jamuns paired with a scoop of cold vanilla.", prep: 5, ingredients: ["Gulab Jamun", "Vanilla Ice Cream"], allergens: ["Dairy", "Gluten"], image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=1000" },
        { name: "Mix Ice Creame", price: 169, desc: "Selection of various ice cream scoops.", prep: 5, ingredients: ["Assorted Ice Cream"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?q=80&w=1000" },
        { name: "Butter Scotch Ice Creame", price: 105, desc: "Creamy butterscotch flavored ice cream.", prep: 5, ingredients: ["Ice Cream", "Butterscotch bits"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?q=80&w=1000" },
        { name: "Kesar Pista Ice Creame", price: 119, desc: "Traditional saffron and pistachio flavored ice cream.", prep: 5, ingredients: ["Ice Cream", "Saffron", "Pistachio"], allergens: ["Dairy", "Nuts"], image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?q=80&w=1000" },
        { name: "Chocolate Ice Creame", price: 109, desc: "Rich chocolate flavored frozen dessert.", prep: 5, ingredients: ["Ice Cream", "Cocoa"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1563805042-7684c8a9e9ce?q=80&w=1000" },
        { name: "Vanilla Ice Creame", price: 105, desc: "Classic smooth vanilla bean ice cream.", prep: 5, ingredients: ["Ice Cream", "Vanilla"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?q=80&w=1000" },
        { name: "Coldrinks", price: 55, desc: "Assorted chilled carbonated soft drinks.", prep: 2, ingredients: ["Soft Drink"], allergens: [], image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1000" },
        { name: "Masala Coldrinks", price: 75, desc: "Soft drink with a spicy tang of chaat masala and lemon.", prep: 5, ingredients: ["Soft Drink", "Chaat Masala", "Lemon"], allergens: [], image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1000" },
        { name: "Mineral Water", price: 25, desc: "Packaged 1L purified drinking water.", prep: 1, ingredients: ["Water"], allergens: [], image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?q=80&w=1000" },
        { name: "Cold Coffee", price: 149, desc: "Refreshing blended coffee with milk and sugar.", prep: 8, ingredients: ["Coffee", "Milk", "Ice Cream"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1461023058943-07cb14c4e5f0?q=80&w=1000" },
        { name: "Vanilla Shake", price: 139, desc: "Thick milk shake flavored with vanilla.", prep: 10, ingredients: ["Milk", "Vanilla Ice Cream"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=1000" },
        { name: "Chocolate Shake", price: 159, desc: "Thick and rich blended chocolate milk shake.", prep: 10, ingredients: ["Milk", "Chocolate Sauce", "Ice Cream"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=1000" },
        { name: "Coffee", price: 80, desc: "Classic hot milk coffee.", prep: 8, ingredients: ["Milk", "Coffee beans"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1000" },
        { name: "Tea", price: 50, desc: "Traditional Indian milk tea with ginger and cardamom.", prep: 8, ingredients: ["Tea leaves", "Milk", "Ginger"], allergens: ["Dairy"], image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1000" },
        { name: "Mojito", price: 179, desc: "Refreshing non-alcoholic mint and lime mocktail.", prep: 10, ingredients: ["Mint", "Lime", "Soda"], allergens: [], image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=1000" },
      ]
    }
  ];

  // Database insertion logic
  for (const catData of MENU_DATA) {
    const category = await prisma.category.create({
      data: {
        restaurantId: restaurant.id,
        name: catData.name,
        image: catData.image,
        active: true,
      },
    });

    await prisma.menuItem.createMany({
      data: catData.items.map((item) => ({
        restaurantId: restaurant.id,
        categoryId: category.id,
        name: item.name,
        description: item.desc,
        pricePaise: item.price * 100, // Multiplied by 100 for Paise
        image: item.image, // ---> NEW LINE EXTRACTING THE IMAGE URL FOR THE DB
        available: true,
        preparationTime: item.prep || 20,
        ingredients: item.ingredients || [],
        allergens: item.allergens || [],
        isVeg: item.isVeg !== undefined ? item.isVeg : catData.isVeg,
        spiceLevel: (item.isVeg === false || catData.isVeg === false) ? SpiceLevel.MEDIUM : SpiceLevel.MILD,
      })),
    });
  }

  // Mark first 6 items as popular (simple default)
  const topItems = await prisma.menuItem.findMany({
    where: { restaurantId: restaurant.id },
    orderBy: { createdAt: 'asc' },
    take: 6,
  });

  if (topItems.length > 0) {
    await prisma.popularDish.createMany({
      data: topItems.map((item, idx) => ({
        restaurantId: restaurant.id,
        menuItemId: item.id,
        rank: idx + 1,
        featured: true,
      })),
      skipDuplicates: true,
    });
  }

  const [categoryCount, menuCount] = await Promise.all([
    prisma.category.count({ where: { restaurantId: restaurant.id } }),
    prisma.menuItem.count({ where: { restaurantId: restaurant.id } }),
  ]);

  console.log(`Seeded restaurant "${restaurant.name}"`);
  console.log(`Summary: ${categoryCount} categories and ${menuCount} items successfully added.`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
