'use client';

import { useCartStore } from '@/store/useCartStore';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getSubtotal, getTax, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-md bg-bright-snow-50 z-50 shadow-xl transition-transform duration-300 transform",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-raw-umber-500" />
              <h2 className="text-lg font-bold text-white-900">Keranjang Belanja</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
                <ShoppingCart className="w-12 h-12 opacity-20" />
                <p>Keranjang masih kosong</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                    {item.image ? (
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-raw-umber-500/10 text-raw-umber-500 font-bold">
                        Bks
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-white-900 leading-tight">{item.name}</h3>
                      {item.isCustom && item.components && (
                        <p className="text-xs text-gray-500 mt-1">
                          {item.components.map(c => c.name).join(', ')}
                        </p>
                      )}
                      <p className="text-raw-umber-500 font-bold mt-1">{formatCurrency(item.price)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:text-raw-umber-500"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:text-raw-umber-500"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary */}
          {items.length > 0 && (
            <div className="p-4 bg-white border-t space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>{formatCurrency(getSubtotal())}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Pajak (11%)</span>
                  <span>{formatCurrency(getTax())}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-white-900 border-t pt-2 mt-2">
                  <span>Total</span>
                  <span>{formatCurrency(getTotalPrice())}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full bg-raw-umber-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-raw-umber-600 transition-colors"
              >
                Lanjut ke Pembayaran
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
