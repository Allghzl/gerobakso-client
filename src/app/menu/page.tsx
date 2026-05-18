'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Category, Product } from '@/types/api';
import { useCartStore } from '@/store/useCartStore';
import { Search, Plus, Loader2 } from 'lucide-react';
import { formatCurrency, getImageUrl, cn } from '@/lib/utils';

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');

  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products')
        ]);
        setCategories(categoriesRes.data.data || categoriesRes.data);
        const productsData = productsRes.data.data;
        if (productsData && typeof productsData === 'object' && !Array.isArray(productsData)) {
          // Handle { available: [], unavailable: [] }
          setProducts([...(productsData.available || []), ...(productsData.unavailable || [])]);
        } else {
          setProducts(productsRes.data.data || productsRes.data);
        }
      } catch (error) {
        console.error('Failed to fetch menu data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-raw-umber-500 animate-spin" />
        <p className="mt-4 text-gray-500 font-medium">Memuat Menu Lezat...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 md:p-8">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:block w-64 space-y-6">
        <div className="sticky top-24">
          <h2 className="text-xl font-bold text-white-900 mb-4">Kategori</h2>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl font-bold transition-all",
                selectedCategory === 'all'
                  ? "bg-raw-umber-500 text-white shadow-lg"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              )}
            >
              Semua Menu
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl font-bold transition-all",
                  selectedCategory === category.id
                    ? "bg-raw-umber-500 text-white shadow-lg"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                )}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari menu favoritmu..."
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-raw-umber-500 transition-all text-white-900"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Mobile Categories */}
        <div className="flex md:hidden overflow-x-auto pb-2 gap-2 -mx-4 px-4 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              "whitespace-nowrap px-6 py-2 rounded-full font-bold text-sm transition-all",
              selectedCategory === 'all' ? "bg-raw-umber-500 text-white" : "bg-white text-gray-500"
            )}
          >
            Semua
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "whitespace-nowrap px-6 py-2 rounded-full font-bold text-sm transition-all",
                selectedCategory === category.id ? "bg-raw-umber-500 text-white" : "bg-white text-gray-500"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl">
            <p className="text-gray-500">Menu tidak ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {!product.is_available && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                        Habis
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-white-900 leading-tight mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{product.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <span className="text-xl font-black text-raw-umber-500">{formatCurrency(product.price)}</span>
                    <button
                      disabled={!product.is_available}
                      onClick={() => addItem({
                        id: product.id.toString(),
                        productId: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        quantity: 1
                      })}
                      className={cn(
                        "p-3 rounded-2xl transition-all",
                        product.is_available
                          ? "bg-raw-umber-500 text-white hover:bg-raw-umber-600 shadow-lg shadow-raw-umber-500/20 active:scale-95"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      )}
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
