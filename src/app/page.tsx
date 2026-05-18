'use client';

import Link from 'next/link';
import { Utensils, ChevronRight, ShoppingBag, ChefHat, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 text-center">
      <div className="w-24 h-24 bg-raw-umber-500 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-raw-umber-500/20 rotate-12">
        <Utensils className="text-white w-12 h-12 -rotate-12" />
      </div>

      <h1 className="text-5xl md:text-7xl font-black text-white-900 leading-tight mb-4">
        Nikmati Bakso <br />
        <span className="text-raw-umber-500">Premium Taste.</span>
      </h1>

      <p className="text-gray-500 max-w-md mx-auto mb-12 text-lg font-medium">
        Rasakan kelezatan bakso asli dengan kuah kaldu pilihan dan racikan mie ayam spesial kami.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
        <Link
          href="/menu"
          className="group relative bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-gray-50 overflow-hidden"
        >
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 bg-raw-umber-50 rounded-xl flex items-center justify-center mb-4 text-raw-umber-500 group-hover:bg-raw-umber-500 group-hover:text-white transition-colors">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white-900 mb-2">Lihat Katalog</h2>
            <p className="text-xs text-gray-500 font-medium">Pilih menu favoritmu langsung dari sini.</p>
            <ChevronRight className="w-5 h-5 mt-4 text-raw-umber-500 group-hover:translate-x-1 transition-transform" />
          </div>
          <Sparkles className="absolute -bottom-4 -right-4 w-24 h-24 text-gray-50 opacity-50" />
        </Link>

        <Link
          href="/prasmanan"
          className="group relative bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-gray-50 overflow-hidden"
        >
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 bg-raw-umber-50 rounded-xl flex items-center justify-center mb-4 text-raw-umber-500 group-hover:bg-raw-umber-500 group-hover:text-white transition-colors">
              <ChefHat className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white-900 mb-2">Prasmanan</h2>
            <p className="text-xs text-gray-500 font-medium">Racik sendiri mangkuk bakso impianmu.</p>
            <ChevronRight className="w-5 h-5 mt-4 text-raw-umber-500 group-hover:translate-x-1 transition-transform" />
          </div>
          <Sparkles className="absolute -bottom-4 -right-4 w-24 h-24 text-gray-50 opacity-50" />
        </Link>
      </div>

      <footer className="mt-20 text-gray-400 text-sm font-bold tracking-widest uppercase">
        Gerobakso &bull; Sejak 2024
      </footer>
    </div>
  );
}
