'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowRight,
  Star,
  MapPin,
  Banknote,
  Crown,
  GlassWater
} from 'lucide-react';
import { formatInr } from '@/lib/currency';
import toast from 'react-hot-toast';

// --- Types ---

type RestaurantCategory = {
  id: string;
  name: string;
};

type LandingMenuItem = {
  id: string;
  name: string;
  pricePaise: number;
  image?: string | null;
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
  slug?: string | null;
  subdomain?: string | null;
  backgroundImage?: string | null;
  logo?: string | null;
  paymentCollectionTiming?: 'BEFORE_MEAL' | 'AFTER_MEAL';
  cashPaymentEnabled?: boolean;
};

// --- Component ---

export default function RestaurantLandingClient({ restaurant }: { restaurant: LandingRestaurant }) {
  const router = useRouter();
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const defaultBg = '/WhatsApp Image 2026-02-20 at 2.26.12 PM.jpeg';
  const defaultLogo = '/WhatsApp Image 2026-02-20 at 2.25.28 PM.jpeg';

  // Format deals for the high-end UI Carousel
  const deals = useMemo(() => {
    if (!restaurant) return [];
    const topPrice = Math.max(...(restaurant.menuItems || []).map((item) => item.pricePaise), 0);
    return [
      {
        id: 'deal-1',
        title: 'Welcome Deal',
        detail: '15% OFF above ' + formatInr(39900),
        design: 'modern_cashback'
      },
      {
        id: 'deal-2',
        title: 'Chef Special',
        detail: topPrice > 0 ? `Combos from ${formatInr(Math.max(topPrice - 10000, 12900))}` : 'Ask for today’s special',
        design: 'premium_gold'
      },
      {
        id: 'deal-3',
        title: 'Flexible Payment',
        detail: restaurant.paymentCollectionTiming === 'BEFORE_MEAL' ? 'Pay before meal' : 'Pay after meal',
        design: 'minimalist_glass'
      }
    ];
  }, [restaurant]);

  // Helper to safely scroll to a specific offer card
  const scrollToOffer = (index: number) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const card = container.children[index] as HTMLElement;
    if (!card) return;

    // Calculate exact position to center the card in the container safely
    const scrollPos = card.getBoundingClientRect().left - container.getBoundingClientRect().left + container.scrollLeft - (container.clientWidth - card.clientWidth) / 2;

    container.scrollTo({
      left: scrollPos,
      behavior: 'smooth'
    });
    setCurrentOfferIndex(index);
  };

  // Auto-rotate carousel (Decoupled from dependency arrays to avoid manual scroll fighting)
  useEffect(() => {
    if (deals.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentOfferIndex((prev) => {
        const next = (prev + 1) % deals.length;
        if (carouselRef.current) {
          const container = carouselRef.current;
          const card = container.children[next] as HTMLElement;
          if (card) {
            const scrollPos = card.getBoundingClientRect().left - container.getBoundingClientRect().left + container.scrollLeft - (container.clientWidth - card.clientWidth) / 2;
            container.scrollTo({ left: scrollPos, behavior: 'smooth' });
          }
        }
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [deals.length]);

  const selectAndOpen = () => {
    const slug = restaurant?.slug || restaurant?.subdomain || restaurant?.id;
    if (!slug) return;
    try {
      localStorage.setItem('selectedRestaurantSlug', slug);
    } catch { }
    toast.success(`${restaurant.name} selected`);
    router.push(`/${slug}/menu`);
  };

  const getPriceForTwo = () => {
    if (!restaurant?.menuItems || restaurant.menuItems.length === 0) return '₹800';
    const avgPrice = restaurant.menuItems.reduce((sum, item) => sum + item.pricePaise, 0) / restaurant.menuItems.length;
    return formatInr(Math.round(avgPrice * 2));
  };

  const getCuisineTypes = () => {
    if (!restaurant?.categories || restaurant.categories.length === 0) return 'Multi-cuisine';
    return restaurant.categories.slice(0, 2).map(c => c.name).join(', ');
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-gray-700 mb-4">Restaurant not found.</p>
          <Link href="/" className="text-orange-600 font-bold hover:underline">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] overflow-x-hidden pb-10">
      {/* Hero Section with Dark Overlay */}
      <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-gray-900">
        <Image
          src={restaurant.backgroundImage || defaultBg}
          alt={restaurant.name}
          fill
          className="object-cover opacity-70"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Floating Card overlapping hero image */}
      <div className="relative -mt-12 sm:-mt-16 z-10 px-4 sm:px-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden">

          <div className="p-6 sm:p-8">
            {/* Header: Logo, Title, Rating */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl overflow-hidden shadow-md shrink-0 border border-gray-100 bg-white relative">
                  <Image
                    src={restaurant.logo || defaultLogo}
                    alt={restaurant.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                    {restaurant.name}
                  </h1>
                  <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {restaurant.address || 'Address not provided'}
                  </p>
                </div>
              </div>

              {/* Static Premium Rating Badge */}
              <div className="flex items-center gap-1 bg-green-900 text-white px-3 py-1.5 rounded-xl shadow-sm shrink-0">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="text-sm font-bold">4.5</span>
              </div>
            </div>

            {/* Cuisine & Price Row */}
            <div className="flex items-center gap-3 text-gray-600 text-sm font-medium mb-6 bg-gray-50 p-3 rounded-2xl border border-gray-100">
              {/* <span>{getCuisineTypes()}</span> */}
              <span>North Indian, Chinese</span>
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
              <span>{getPriceForTwo()} for two</span>
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
              <span className="text-green-600">Open Now</span>
            </div>

            {/* Multi-Variant Offer Carousel */}
            {deals.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-black text-gray-900 mb-4">Offers for you</h2>

                <div
                  ref={carouselRef}
                  className="relative flex overflow-x-scroll gap-4 snap-x snap-mandatory no-scrollbar"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  onScroll={(e) => {
                    const container = e.currentTarget;
                    const center = container.scrollLeft + container.clientWidth / 2;
                    let closestIndex = 0;
                    let minDistance = Infinity;

                    // Accurately find the physical center card based on bounding box
                    Array.from(container.children).forEach((child, index) => {
                      const card = child as HTMLElement;
                      const cardCenter = card.getBoundingClientRect().left - container.getBoundingClientRect().left + container.scrollLeft + card.clientWidth / 2;
                      const distance = Math.abs(cardCenter - center);
                      if (distance < minDistance) {
                        minDistance = distance;
                        closestIndex = index;
                      }
                    });

                    if (closestIndex !== currentOfferIndex) {
                      setCurrentOfferIndex(closestIndex);
                    }
                  }}
                >
                  {/* Hide Scrollbar CSS */}
                  <style jsx global>{`
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                  `}</style>

                  {deals.map((deal) => (
                    <div
                      key={deal.id}
                      className="snap-center shrink-0 w-full sm:w-80 h-36 rounded-3xl p-5 relative overflow-hidden transition-all duration-500 border border-gray-100 shadow-sm"
                    >
                      {/* Style 1: Modern Cashback */}
                      {deal.design === 'modern_cashback' && (
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 to-emerald-600">
                          <div className="absolute top-0 right-2 text-8xl font-black text-white/5 select-none">%</div>
                          <Banknote className="absolute top-6 left-6 h-6 w-6 text-white/10 rotate-12" />
                          <Banknote className="absolute bottom-6 right-10 h-5 w-5 text-white/10 -rotate-6" />
                        </div>
                      )}

                      {/* Style 2: Candy Stripes */}
                      {deal.design === 'premium_gold' && (
                        <div className="absolute inset-0 bg-rose-400">
                          {/* CSS Diagonal Stripes */}
                          <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }} />
                          {/* Bottom gradient to ensure text readability */}
                          <div className="absolute inset-0 bg-gradient-to-t from-rose-600/80 to-transparent" />
                          {/* Requires importing Star from lucide-react */}
                          <Star className="absolute top-3 right-4 h-8 w-8 text-yellow-300 fill-yellow-300 rotate-12 drop-shadow-md hover:scale-110 transition-transform" />
                        </div>
                      )}

                      {/* Style 3: Minimalist Glass */}
                      {deal.design === 'minimalist_glass' && (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white border border-blue-100">
                          <GlassWater className="absolute bottom-2 right-2 h-16 w-16 text-blue-500/10" />
                        </div>
                      )}

                      {/* Card Content */}
                      <div className="relative z-10 h-full flex flex-col justify-center">
                        <h3 className={`text-xl sm:text-2xl font-black mb-1 ${deal.design === 'minimalist_glass' ? 'text-blue-900' : 'text-white'}`}>
                          {deal.title}
                        </h3>
                        <p className={`text-xs sm:text-sm font-medium ${deal.design === 'minimalist_glass' ? 'text-blue-600' : 'text-white/80'}`}>
                          {deal.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Carousel Indicators */}
                <div className="flex justify-center gap-2 mt-4">
                  {deals.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToOffer(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${index === currentOfferIndex ? 'w-6 bg-orange-600' : 'w-1.5 bg-gray-300'
                        }`}
                      aria-label={`Go to offer ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Pre-booking Offers Section */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">More deals</h3>
              <div className="flex flex-wrap gap-2">
                {['Pre-booking offers', 'Early bird discount', 'Weekend special', 'Flat ₹100 OFF'].map((badge) => (
                  <button
                    key={badge}
                    className="px-4 py-2 bg-gray-50 border border-gray-100 hover:border-orange-200 hover:bg-orange-50 text-gray-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    {badge}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={selectAndOpen}
              className="w-full bg-orange-600 text-white py-4 sm:py-5 rounded-2xl hover:bg-orange-700 active:scale-[0.98] transition-all shadow-xl shadow-orange-500/20 font-black text-lg flex items-center justify-center gap-2"
            >
              View Menu & Order
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="max-w-3xl mx-auto px-4 mt-8 mb-16">
        <div className="relative rounded-[32px] border border-gray-200/50 bg-white p-6 sm:p-8 shadow-sm overflow-hidden">
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col items-center text-center">
            <h1 className="text-2xl font-black tracking-tighter text-gray-900 sm:text-3xl">
              <span className="text-orange-600">#</span>Bite
            </h1>

            <div className="my-3 flex items-center gap-3">
              <div className="h-[1px] w-8 bg-gray-200" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                Product of Dequeue
              </h2>
              <div className="h-[1px] w-8 bg-gray-200" />
            </div>

            <h3 className="max-w-[250px] text-[10px] leading-relaxed text-gray-400">
              Terms and conditions applied <br />
              <span className="font-bold text-gray-500">
                Dequeue Retail Technologies Pvt Ltd.
              </span>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}