"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  ChefHat,
  ShoppingCart,
  Home,
  UtensilsCrossed,
  ClipboardList,
} from "lucide-react";
import { useCartStore } from "@/store/cart";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { getTotalItems } = useCartStore();
  const cartItemsCount = getTotalItems();

  // Desktop navigation links
  const desktopNavLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
  ];

  // Mobile bottom navigation links (max 4 items, profile is in top nav)
  const mobileNavLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Menu", href: "/menu", icon: UtensilsCrossed },
    { name: "Cart", href: "/cart", icon: ShoppingCart, badge: cartItemsCount },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between h-14 sm:h-16">
            {/* Logo and brand */}
            <div className="flex items-center min-w-0">
              <Link href="/" className="flex items-center min-w-0">
                <div className="flex items-center group">
                  <div className="p-1.5 sm:p-2 bg-orange-50 rounded-xl mr-3 transition-colors group-hover:bg-orange-100">
                    <ChefHat className="h-7 w-7 sm:h-8 sm:w-8 text-orange-600 flex-shrink-0" />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-l sm:text-xl font-black text-gray-900 uppercase tracking-normal leading-none">
                      Haveli <span className="text-orange-600">Dhaba</span>
                    </h2>
                  </div>
                </div>
              </Link>
            </div>

            {/* Mobile Rate Us button (visible only on small screens) */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() =>
                  window.open("https://www.google.com/maps", "_blank")
                }
                className="text-sm px-2 py-1 rounded-lg border border-orange-600 text-orange-600 hover:bg-orange-50 transition-colors font-medium"
              >
                Rate Us
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {desktopNavLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm lg:text-base ${
                    pathname === link.href
                      ? "text-orange-600 font-medium"
                      : "text-gray-600 hover:text-orange-600"
                  } transition-colors`}
                >
                  {link.name}
                </Link>
              ))}

              <button
                onClick={() =>
                  window.open("https://www.google.com/maps", "_blank")
                }
                className="text-sm lg:text-base px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg border border-orange-600 text-orange-600 hover:bg-orange-50 transition-colors font-medium"
              >
                Rate Us
              </button>

              {/* Cart icon for authenticated users */}
              {
                <Link href="/cart" className="relative p-2 -m-2">
                  <ShoppingCart className="h-5 w-5 lg:h-6 lg:w-6 text-gray-600 hover:text-orange-600 transition-colors" />
                  {cartItemsCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-[10px] sm:text-xs">
                      {cartItemsCount > 9 ? "9+" : cartItemsCount}
                    </span>
                  )}
                </Link>
              }
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
        <div className="flex justify-around items-center h-16">
          {mobileNavLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex flex-col items-center justify-center flex-1 h-full min-w-0 ${
                  active
                    ? "text-orange-600"
                    : "text-gray-500 hover:text-gray-700"
                } transition-colors active:bg-gray-50`}
              >
                <div className="relative">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  {typeof link.badge === "number" && link.badge > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {link.badge > 9 ? "9+" : link.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] sm:text-xs mt-0.5 truncate max-w-[60px]">
                  {link.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
