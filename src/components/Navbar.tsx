'use client';

import { ShoppingBag, Menu as MenuIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-bright-snow-50/90 backdrop-blur-md border-b border-white-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/gerobakso-logo.svg" alt="Gerobakso Logo" className="h-8 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8 font-medium text-white-700">
          <Link href="/" className="hover:text-raw-umber-600 transition">
            Beranda
          </Link>
          <Link href="/menu" className="hover:text-raw-umber-600 transition">
            Menu Kami
          </Link>
          <Link href="/prasmanan" className="hover:text-raw-umber-600 transition">
            Prasmanan
          </Link>
          <a href="/#about" className="hover:text-raw-umber-600 transition">
            Tentang
          </a>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 cursor-pointer text-white-800 hover:text-raw-umber-600 transition"
          >
            <ShoppingBag size={24} />
            {totalItems() > 0 && (
              <span className="absolute top-0 right-0 bg-raw-umber-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems()}
              </span>
            )}
          </button>
          <button className="md:hidden p-2 cursor-pointer  text-white-800">
            <MenuIcon size={24} />
          </button>
        </div>
      </div>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
}
