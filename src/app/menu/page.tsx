'use client';

import { useEffect, useState } from 'react';
import { Search, ChevronRight, Plus, Loader2 } from 'lucide-react';
import { getCategories, getProducts } from '@/lib/api';
import { Category, Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { addItem } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catData, prodData] = await Promise.all([
          getCategories(),
          getProducts()
        ]);
        setCategories([{ id: 0, name: 'Semua', slug: 'all' }, ...catData.data]);
        setProducts(prodData.data);
      } catch (error) {
        console.error('Error fetching menu data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === null || selectedCategory === 0 || product.category_id === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-bright-snow-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-raw-umber-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bright-snow-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-white-900 mb-2">Menu Kami</h1>
            <p className="text-white-600">Pilih bakso favoritmu dan nikmati kelezatannya.</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white-400" size={20} />
            <input
              type="text"
              placeholder="Cari bakso..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-white-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-raw-umber-500/20 transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Categories */}
          <aside className="w-full md:w-64 space-y-2">
            <h3 className="font-bold text-white-800 px-2 mb-4">Kategori</h3>
            <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible gap-2 pb-4 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium transition whitespace-nowrap md:whitespace-normal ${
                    selectedCategory === cat.id || (selectedCategory === null && cat.id === 0)
                      ? 'bg-raw-umber-500 text-white shadow-lg shadow-raw-umber-200'
                      : 'bg-white text-white-700 border border-white-200 hover:border-raw-umber-500/50'
                  }`}
                >
                  {cat.name}
                  <ChevronRight size={16} className="hidden md:block opacity-50" />
                </button>
              ))}
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-white-200">
                <p className="text-white-400">Tidak ada produk yang ditemukan.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="group bg-white rounded-3xl border border-white-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={product.image?.startsWith('http') ? product.image : `https://gerobakso.pinat.my.id/storage/${product.image || 'default.jpg'}`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                      {!product.is_available && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm">Habis</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="mb-4">
                        <h3 className="font-bold text-white-900 text-lg mb-1">{product.name}</h3>
                        <p className="text-white-500 text-sm line-clamp-2">{product.description}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-raw-umber-600 font-black text-xl">
                          Rp {product.price.toLocaleString('id-ID')}
                        </span>
                        <button
                          disabled={!product.is_available}
                          onClick={() => addItem(product)}
                          className="p-3 bg-bright-snow-50 text-raw-umber-600 rounded-2xl hover:bg-raw-umber-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
