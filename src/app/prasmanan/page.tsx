'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Product } from '@/types/api';
import { useCartStore } from '@/store/useCartStore';
import { Loader2, ChevronRight, ChevronLeft, Check, ShoppingBag } from 'lucide-react';
import { formatCurrency, getImageUrl, cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const STEPS = [
  { id: 'kuah', name: 'Pilih Kuah', slug: 'makanan' }, // Changed to 'makanan' based on API data
  { id: 'mie', name: 'Pilih Mie', slug: 'makanan' },
  { id: 'bakso', name: 'Pilih Bakso', slug: 'makanan' },
  { id: 'topping', name: 'Pilih Topping', slug: 'addon' }, // Changed to 'addon'
];

export default function PrasmananPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, Product[]>>({
    kuah: [],
    mie: [],
    bakso: [],
    topping: [],
  });

  const { addItem } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products', {
          params: { include: 'category' } // If the backend supports it, otherwise we'll rely on local logic
        });
        const productsData = res.data.data;
        if (productsData && typeof productsData === 'object' && !Array.isArray(productsData)) {
          setProducts([...(productsData.available || []), ...(productsData.unavailable || [])]);
        } else {
          setProducts(res.data.data || res.data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const currentStep = STEPS[currentStepIndex];

  // Helper to filter products for current step
  const getStepProducts = () => {
    // Since the actual API uses broad categories like 'makanan', 'minuman', 'addon'
    // we might need to filter by name if slug-based sub-categorization isn't available
    if (currentStep.id === 'kuah') {
      return products.filter(p => p.category?.name.toLowerCase() === 'makanan' && (p.name.toLowerCase().includes('bakso') || p.name.toLowerCase().includes('mie')));
    }
    if (currentStep.id === 'mie') {
      return products.filter(p => p.category?.name.toLowerCase() === 'makanan' && p.name.toLowerCase().includes('mie'));
    }
    if (currentStep.id === 'bakso') {
      return products.filter(p => p.category?.name.toLowerCase() === 'makanan' && p.name.toLowerCase().includes('bakso'));
    }
    if (currentStep.id === 'topping') {
      return products.filter(p => p.category?.name.toLowerCase() === 'addon');
    }
    return products.filter(p => p.category?.slug === currentStep.slug);
  };

  const toggleSelection = (product: Product) => {
    const stepId = currentStep.id;
    const isSelected = selections[stepId].some(p => p.id === product.id);

    setSelections(prev => {
      // For Kuah and Mie, usually only one is allowed?
      // Let's allow multiple for now as per "Prasmanan" concept, but maybe limit Kuah to 1?
      if (stepId === 'kuah') {
        return { ...prev, [stepId]: isSelected ? [] : [product] };
      }

      if (isSelected) {
        return { ...prev, [stepId]: prev[stepId].filter(p => p.id !== product.id) };
      } else {
        return { ...prev, [stepId]: [...prev[stepId], product] };
      }
    });
  };

  const calculateTotal = () => {
    return Object.values(selections).flat().reduce((total, p) => total + p.price, 0);
  };

  const handleFinish = () => {
    const allSelectedItems = Object.values(selections).flat();
    if (allSelectedItems.length === 0) return;

    const customBowlId = `custom-${Date.now()}`;
    addItem({
      id: customBowlId,
      name: "Custom Bowl (Racikan Sendiri)",
      price: calculateTotal(),
      quantity: 1,
      isCustom: true,
      components: allSelectedItems.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category?.name || '',
        price: p.price
      }))
    });

    router.push('/menu');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-raw-umber-500 animate-spin" />
        <p className="mt-4 text-gray-500 font-medium">Menyiapkan Meja Prasmanan...</p>
      </div>
    );
  }

  const stepProducts = getStepProducts();

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Header & Stepper */}
      <div className="bg-white border-b sticky top-16 z-30 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1 last:flex-none">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                    index <= currentStepIndex ? "bg-raw-umber-500 text-white" : "bg-gray-100 text-gray-400"
                  )}
                >
                  {index < currentStepIndex ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-1 flex-1 mx-2 rounded-full",
                      index < currentStepIndex ? "bg-raw-umber-500" : "bg-gray-100"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          <h2 className="text-2xl font-black text-white-900">{currentStep.name}</h2>
          <p className="text-sm text-gray-500">Pilih item yang kamu inginkan untuk racikan spesialmu.</p>
        </div>
      </div>

      {/* Product List */}
      <div className="flex-1 p-4 md:p-8 max-w-3xl mx-auto w-full pb-32">
        <div className="grid grid-cols-2 gap-4">
          {stepProducts.length === 0 ? (
            <div className="col-span-2 text-center py-10 text-gray-500">
              Tidak ada item tersedia untuk kategori ini.
            </div>
          ) : (
            stepProducts.map((product) => {
              const isSelected = selections[currentStep.id].some(p => p.id === product.id);
              return (
                <button
                  key={product.id}
                  onClick={() => toggleSelection(product)}
                  className={cn(
                    "relative text-left bg-white rounded-3xl p-3 border-2 transition-all group",
                    isSelected ? "border-raw-umber-500 bg-raw-umber-50/50" : "border-transparent shadow-sm hover:border-gray-200"
                  )}
                >
                  <div className="aspect-square rounded-2xl overflow-hidden mb-3 bg-gray-50">
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-bold text-white-900 text-sm leading-tight mb-1">{product.name}</h3>
                  <p className="text-raw-umber-500 font-bold text-sm">{formatCurrency(product.price)}</p>

                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-raw-umber-500 text-white p-1 rounded-full">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Sticky Bottom Summary */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-[0_-4px_20px_rgba(0,0,0,0,0.05)] z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Racikan</p>
            <p className="text-xl font-black text-raw-umber-500">{formatCurrency(calculateTotal())}</p>
          </div>
          <div className="flex gap-2">
            {currentStepIndex > 0 && (
              <button
                onClick={() => setCurrentStepIndex(prev => prev - 1)}
                className="p-4 rounded-2xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {currentStepIndex < STEPS.length - 1 ? (
              <button
                onClick={() => setCurrentStepIndex(prev => prev + 1)}
                className="bg-raw-umber-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-raw-umber-600 transition-all active:scale-95 shadow-lg shadow-raw-umber-500/20"
              >
                Lanjut <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={calculateTotal() === 0}
                className={cn(
                  "px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg",
                  calculateTotal() > 0
                    ? "bg-raw-umber-500 text-white hover:bg-raw-umber-600 shadow-raw-umber-500/20"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                )}
              >
                Selesai & Tambah <ShoppingBag className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
