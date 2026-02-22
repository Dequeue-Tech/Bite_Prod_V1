'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Percent, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatInr } from '@/lib/currency';

type RestaurantCategory = {
  id: string;
  name: string;
};

type LandingMenuItem = {
  id: string;
  name: string;
  pricePaise: number;
  category?: {
    id: string;
    name: string;
  } | null;
};

export type LandingRestaurant = {
  id?: string;
  name: string;
  address: string;
  categories: RestaurantCategory[];
  menuItems: LandingMenuItem[];
  googleReviewUrl?: string | null;
};

export default function RestaurantLandingClient({ restaurant }: { restaurant: LandingRestaurant }) {
  const router = useRouter();
  const [currentDealIndex, setCurrentDealIndex] = useState(0);

  const buildDeals = () => {
    return [
      {
        title: 'Welcome Deal',
        detail: 'Get 15% OFF on your first order above ' + formatInr(39900),
        icon: Percent,
      },
    ];
  };

  const googleReviewLink =
    restaurant.googleReviewUrl ||
    `https://www.google.com/search?q=${encodeURIComponent(`${restaurant.name} reviews`)}`;

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-5xl mx-auto px-3 sm:px-4">
        <section className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-5">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-xl sm:rounded-2xl bg-orange-600 text-white flex items-center justify-center text-xl sm:text-2xl font-bold shadow-sm flex-shrink-0">
                Haveli Dhabba
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-orange-700">Restaurant Landing</p>
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900 truncate">{restaurant.name}</h1>
                <p className="text-gray-600 mt-0.5 sm:mt-1 text-xs sm:text-sm truncate">{restaurant.address}</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/menu')}
              className="inline-flex items-center justify-center bg-orange-600 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl hover:bg-orange-700 font-medium text-sm sm:text-base"
            >
              View Menu
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Offers & Deals</h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentDealIndex((prev) => (prev === 0 ? buildDeals().length - 1 : prev - 1))}
                className="p-1.5 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                aria-label="Previous deal"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={() => setCurrentDealIndex((prev) => (prev === buildDeals().length - 1 ? 0 : prev + 1))}
                className="p-1.5 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                aria-label="Next deal"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentDealIndex * 100}%)` }}
            >
              {buildDeals().map((deal: any) => (
                <div
                  key={deal.title}
                  className="w-full flex-shrink-0 rounded-lg border border-orange-100 bg-orange-50/60 p-4 sm:p-5"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 p-2 sm:p-3 bg-orange-100 rounded-lg">
                      <deal.icon className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-base sm:text-lg">{deal.title}</p>
                      <p className="text-sm sm:text-base text-gray-700 mt-1">{deal.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-3 sm:mt-4">
            {buildDeals().map((deal: any, index: number) => (
              <button
                key={deal.title}
                onClick={() => setCurrentDealIndex(index)}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors ${
                  index === currentDealIndex ? 'bg-orange-600' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to deal ${index + 1}`}
              />
            ))}
          </div>
        </section>

        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 mb-4 sm:mb-6">
          <h2 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Quick Actions</h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => router.push('/menu')}
              className="bg-orange-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-orange-700 text-sm"
            >
              Open Menu
            </button>
            <a
              href={googleReviewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-orange-700 border border-orange-200 px-3 sm:px-4 py-2 rounded-lg hover:bg-orange-50 text-sm"
            >
              Google Reviews
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pb-4 sm:pb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
            <h2 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Categories</h2>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {(restaurant.categories || []).map((cat) => (
                <span key={cat.id} className="text-xs sm:text-sm bg-orange-100 text-orange-700 px-2 py-1 rounded">
                  {cat.name}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
            <h2 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Popular Dishes</h2>
            <div className="space-y-1.5 sm:space-y-2">
              {(restaurant.menuItems || []).slice(0, 6).map((item) => (
                <div key={item.id} className="flex items-center justify-between border border-gray-100 rounded p-1.5 sm:p-2 gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                    <p className="text-xs text-gray-500 truncate">{item.category?.name}</p>
                  </div>
                  <span className="font-semibold text-orange-700 text-sm whitespace-nowrap">{formatInr(item.pricePaise)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
