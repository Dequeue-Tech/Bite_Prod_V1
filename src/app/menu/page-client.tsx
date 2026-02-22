'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChefHat, Plus, Minus, Search, Menu, X } from 'lucide-react';
import { useCartStore, CartItem } from '@/store/cart';
import { formatInr } from '@/lib/currency';
import toast from 'react-hot-toast';
import Image from 'next/image';

export type MenuPageItem = {
  id: string;
  name: string;
  description: string;
  pricePaise: number;
  image?: string;
  categoryId: string;
  available: boolean;
  preparationTime: number;
  ingredients: string[];
  allergens: string[];
  isVeg: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  spiceLevel: 'NONE' | 'MILD' | 'MEDIUM' | 'HOT' | 'EXTRA_HOT';
  category: {
    id: string;
    name: string;
  } | null;
};

export type MenuPageCategory = {
  id: string;
  name: string;
  description?: string;
  image?: string;
  active: boolean;
  sortOrder: number;
};

type MenuPageClientProps = {
  initialMenuItems: MenuPageItem[];
  initialCategories: MenuPageCategory[];
  selectedSubdomain: string | null;
};

export default function MenuPageClient({
  initialMenuItems,
  initialCategories,
  selectedSubdomain,
}: MenuPageClientProps) {
  const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/api\/?$/, '');
  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000';
  const searchParams = useSearchParams();
  const { items, addItem, removeItem, updateQuantity, setActiveOrderId } = useCartStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const [filters, setFilters] = useState({
    isVeg: false,
    isVegan: false,
    isGlutenFree: false,
    spiceLevel: 'all',
  });

  useEffect(() => {
    setActiveOrderId(searchParams.get('orderId'));
  }, [searchParams, setActiveOrderId]);

  const filteredItems = useMemo(
    () =>
      initialMenuItems.filter((item) => {
        if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
          return false;
        }

        if (searchTerm && !item.name?.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }

        if (filters.isVeg && !item.isVeg) return false;
        if (filters.isVegan && !item.isVegan) return false;
        if (filters.isGlutenFree && !item.isGlutenFree) return false;
        if (filters.spiceLevel !== 'all' && item.spiceLevel !== filters.spiceLevel) return false;

        return item.available;
      }),
    [initialMenuItems, selectedCategory, searchTerm, filters]
  );

  const groupedItems = useMemo(() => {
    const itemsByCategory = new Map<string, MenuPageItem[]>();

    filteredItems.forEach((item) => {
      const key = item.categoryId || 'uncategorized';
      const existing = itemsByCategory.get(key) || [];
      existing.push(item);
      itemsByCategory.set(key, existing);
    });

    const visibleCategoryIds =
      selectedCategory === 'all' ? initialCategories.map((category) => category.id) : [selectedCategory];

    const groups = visibleCategoryIds
      .map((categoryId) => {
        const category = initialCategories.find((c) => c.id === categoryId);
        const items = itemsByCategory.get(categoryId) || [];

        if (!category || items.length === 0) {
          return null;
        }

        return {
          id: category.id,
          name: category.name,
          items,
        };
      })
      .filter((group): group is { id: string; name: string; items: MenuPageItem[] } => Boolean(group));

    const uncategorizedItems = itemsByCategory.get('uncategorized') || [];
    if (uncategorizedItems.length > 0) {
      groups.push({
        id: 'uncategorized',
        name: 'Uncategorized',
        items: uncategorizedItems,
      });
    }

    return groups;
  }, [filteredItems, initialCategories, selectedCategory]);

  const handleAddToCart = (item: MenuPageItem) => {
    try {
      addItem({
        id: item.id,
        name: item.name || '',
        pricePaise: item.pricePaise,
        image: item.image,
        quantity: 1,
      });

      toast.success(
        <div className="flex items-center">
          <span className="font-medium">{item.name || 'Item'}</span>
          <span className="mx-2">added to cart!</span>
          <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded">
            {formatInr(item.pricePaise)}
          </span>
        </div>,
        {
          duration: 3000,
          position: 'bottom-right',
        }
      );
    } catch (err) {
      console.error('Error adding item to cart:', err);
      toast.error('Failed to add item to cart');
    }
  };

  const handleUpdateQuantity = (item: MenuPageItem, newQuantity: number) => {
    try {
      if (newQuantity <= 0) {
        removeItem(item.id);
        toast.success(`${item.name || 'Item'} removed from cart`);
      } else {
        updateQuantity(item.id, newQuantity);
        toast.success(`Quantity updated to ${newQuantity}`);
      }
    } catch (err) {
      console.error('Error updating item quantity:', err);
      toast.error('Failed to update item quantity');
    }
  };

  const getCartItemQuantity = (itemId: string) => {
    const cartItem = items.find((cartItem: CartItem) => cartItem.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const getSpiceLevelDisplay = (level: string) => {
    const spiceMap = {
      NONE: 'No Spice',
      MILD: 'MILD',
      MEDIUM: 'MEDIUM',
      HOT: 'HOT',
      EXTRA_HOT: 'EXTRA HOT',
    };
    return spiceMap[level as keyof typeof spiceMap] || '';
  };

  const resolveImageSrc = (image?: string) => {
    if (!image) {
      return FALLBACK_IMAGE;
    }

    if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:')) {
      return image;
    }

    if (!API_ORIGIN) {
      return FALLBACK_IMAGE;
    }

    if (image.startsWith('/')) {
      return `${API_ORIGIN}${image}`;
    }

    return `${API_ORIGIN}/${image}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Menu</h2>
          {selectedSubdomain ? (
            <p className="text-sm text-gray-600 mb-2">Restaurant context: @{selectedSubdomain}</p>
          ) : (
            <p className="text-sm text-orange-700 mb-2">No restaurant selected. Go to Home and select a restaurant first.</p>
          )}
          {searchParams.get('orderId') && (
            <p className="text-sm text-green-700 mb-2">You are adding dishes to an ongoing meal.</p>
          )}

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No items found matching your criteria</p>
          </div>
        ) : (
          <div className="space-y-10">
            {groupedItems.map((group) => (
              <section key={group.id}>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{group.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.items.map((item) => {
                    const quantity = getCartItemQuantity(item.id);

                    return (
                      <div key={item.id} className="bg-white rounded-lg shadow-md relative">
                        <div className="absolute top-3 right-3 w-16 h-16 rounded-md overflow-hidden border border-gray-200 bg-gray-100">
                          <Image
                            src={resolveImageSrc(item.image)}
                            alt={item.name || ''}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2 pr-20">
                            <h3 className="text-lg font-semibold text-gray-800">{item.name || 'Unknown Item'}</h3>
                            <span className="text-lg font-bold text-orange-600">{formatInr(item.pricePaise)}</span>
                          </div>

                          <p className="text-gray-600 mb-4 text-sm">{item.description || ''}</p>

                          <div className="flex gap-1 mb-3">
                            {item.isVeg && <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">Veg</span>}
                            {item.isVegan && <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">Vegan</span>}
                          </div>

                          <div className="flex justify-between items-center mb-4">
                            <span className="text-xs text-gray-500 uppercase tracking-wide bg-gray-100 px-2 py-1 rounded">
                              {getSpiceLevelDisplay(item.spiceLevel)}
                            </span>

                            <div className="flex items-center">
                              {quantity === 0 ? (
                                <button
                                  onClick={() => handleAddToCart(item)}
                                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                                >
                                  Add to Cart
                                </button>
                              ) : (
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                  <button
                                    onClick={() => handleUpdateQuantity(item, quantity - 1)}
                                    className="p-2 text-gray-600 hover:bg-gray-100"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="px-3 py-1 font-medium">{quantity}</span>
                                  <button
                                    onClick={() => handleUpdateQuantity(item, quantity + 1)}
                                    className="p-2 text-gray-600 hover:bg-gray-100"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <div className="fixed right-4 bottom-20 z-40">
        {isCategoryMenuOpen && (
          <div className="mb-3 w-64 max-h-80 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl p-3">
            <p className="text-sm font-semibold text-gray-700 mb-2">Switch Category</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setIsCategoryMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === 'all' ? 'bg-orange-100 text-orange-800' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              All Categories
            </button>
            {initialCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(category.id);
                  setIsCategoryMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === category.id ? 'bg-orange-100 text-orange-800' : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          aria-label="Toggle category switcher"
          onClick={() => setIsCategoryMenuOpen((prev) => !prev)}
          className="h-14 w-14 rounded-full bg-orange-600 text-white shadow-lg hover:bg-orange-700 transition-colors flex items-center justify-center"
        >
          {isCategoryMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
    </div>
  );
}
