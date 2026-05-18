'use client';

import { ShoppingCart, Menu as MenuIcon, Utensils } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import CartDrawer from './CartDrawer';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { getTotalItems } = useCartStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted ? getTotalItems() : 0;

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-raw-umber-500 rounded-xl flex items-center justify-center">
              <Utensils className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white-900 tracking-tight">GEROBAKSO</h1>
              <p className="text-[10px] text-raw-umber-500 font-bold uppercase tracking-widest leading-none">Premium Taste</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/menu"
              className={cn(
                "font-bold transition-colors",
                pathname === '/menu' ? "text-raw-umber-500" : "text-gray-500 hover:text-raw-umber-500"
              )}
            >
              Katalog
            </Link>
            <Link
              href="/prasmanan"
              className={cn(
                "font-bold transition-colors",
                pathname === '/prasmanan' ? "text-raw-umber-500" : "text-gray-500 hover:text-raw-umber-500"
              )}
            >
              Prasmanan
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 bg-bright-snow-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-white-900" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-raw-umber-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {totalItems}
                </span>
              )}
            </button>
            <button className="md:hidden p-2">
              <MenuIcon className="w-6 h-6 text-white-900" />
            </button>
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
