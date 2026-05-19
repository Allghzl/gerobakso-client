'use client';

import { useEffect, useState } from 'react';
import { Loader2, ChevronRight, ChevronLeft, Check, Plus, ShoppingBag } from 'lucide-react';
import { getProducts } from '@/lib/api';
import { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const STEPS = [
  { id: 'kuah', name: 'Pilih Kuah', category: 'Makanan' },
  { id: 'mie', name: 'Pilih Mie', category: 'Makanan' },
  { id: 'pentol', name: 'Pilih Pentol', category: 'Makanan' },
  { id: 'topping', name: 'Pilih Topping', category: 'Addon' },
];

export default function PrasmananPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState<Record<string, Product[]>>({
    kuah: [],
    mie: [],
    pentol: [],
    topping: [],
  });

  const { addItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const prodData = await getProducts();
        setProducts(prodData.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const currentStepData = STEPS[currentStep];
  const stepProducts = products.filter(p => p.category?.name === currentStepData.category && p.is_available);

  const toggleSelection = (product: Product) => {
    const stepId = currentStepData.id;
    setSelections(prev => {
      const isSelected = prev[stepId].find(p => p.id === product.id);
      if (isSelected) {
        return { ...prev, [stepId]: prev[stepId].filter(p => p.id !== product.id) };
      } else {
        // For kuah and mie, maybe only one selection is allowed?
        // User didn't specify, but usually it's one. Let's allow multiple for now as per "flattened list" logic.
        return { ...prev, [stepId]: [...prev[stepId], product] };
      }
    });
  };

  const calculateStepTotal = () => {
    return Object.values(selections).flat().reduce((sum, p) => sum + p.price, 0);
  };

  const handleFinish = () => {
    const allSelectedItems = Object.values(selections).flat();
    allSelectedItems.forEach(item => {
      addItem(item, 1, '[Bowl] ');
    });
    // Reset selections and go to first step
    setSelections({ kuah: [], mie: [], pentol: [], topping: [] });
    setCurrentStep(0);
    alert('Bowl kustom berhasil ditambahkan ke keranjang!');
  };

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

      <main className="max-w-4xl mx-auto px-4 py-8 pb-32">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white-900 mb-2">Buat Bakso Versimu</h1>
          <p className="text-white-600">Pilih komponen sesuai seleramu step by step.</p>
        </div>

        {/* Stepper Header */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white-200 -translate-y-1/2 -z-10" />
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  index <= currentStep
                    ? 'bg-raw-umber-500 text-white scale-110 shadow-lg shadow-raw-umber-200'
                    : 'bg-white text-white-400 border-2 border-white-200'
                }`}
              >
                {index < currentStep ? <Check size={20} /> : index + 1}
              </div>
              <span className={`mt-2 text-xs font-bold uppercase tracking-wider ${index <= currentStep ? 'text-raw-umber-600' : 'text-white-400'}`}>
                {step.name.split(' ')[1]}
              </span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white-900">{currentStepData.name}</h2>
            <span className="text-white-500 text-sm">{stepProducts.length} pilihan tersedia</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stepProducts.map((product) => {
              const isSelected = selections[currentStepData.id].find(p => p.id === product.id);
              return (
                <button
                  key={product.id}
                  onClick={() => toggleSelection(product)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                    isSelected
                      ? 'border-raw-umber-500 bg-raw-umber-50/50 ring-4 ring-raw-umber-500/10'
                      : 'border-white-200 bg-white hover:border-raw-umber-200'
                  }`}
                >
                  <img
                    src={product.image?.startsWith('http') ? product.image : `https://gerobakso.pinat.my.id/storage/${product.image || 'default.jpg'}`}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-white-900">{product.name}</h4>
                    <p className="text-raw-umber-600 font-bold">Rp {product.price.toLocaleString('id-ID')}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-raw-umber-500 border-raw-umber-500 text-white' : 'border-white-200'
                  }`}>
                    {isSelected && <Check size={14} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-white-200 p-4 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-white-500 text-sm font-medium">Estimasi Harga</span>
            <span className="text-2xl font-black text-raw-umber-600">Rp {calculateStepTotal().toLocaleString('id-ID')}</span>
          </div>

          <div className="flex items-center gap-3">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="p-4 border-2 border-white-200 rounded-2xl font-bold text-white-700 hover:bg-white-50 transition"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {currentStep < STEPS.length - 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-8 py-4 bg-raw-umber-500 text-white rounded-2xl font-black flex items-center gap-2 hover:bg-raw-umber-600 transition shadow-lg shadow-raw-umber-200"
              >
                Lanjut <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-8 py-4 bg-raw-umber-500 text-white rounded-2xl font-black flex items-center gap-2 hover:bg-raw-umber-600 transition shadow-lg shadow-raw-umber-200"
              >
                <ShoppingBag size={20} /> Masukkan Keranjang
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
