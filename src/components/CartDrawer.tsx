'use client';

import { ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import Link from 'next/link';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-bright-snow-50 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-4 border-b border-white-200 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg text-white-900">
            <ShoppingBag size={24} className="text-raw-umber-600" />
            Keranjang Belanja
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white-100 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-white-400 gap-4">
              <ShoppingBag size={64} strokeWidth={1} />
              <p className="text-lg">Keranjangmu masih kosong</p>
              <button
                onClick={onClose}
                className="text-raw-umber-600 font-medium hover:underline"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 bg-white border border-white-100 rounded-2xl shadow-sm">
                <img
                  src={item.image?.startsWith('http') ? item.image : `https://gerobakso.pinat.my.id/storage/${item.image || 'default.jpg'}`}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-white-900 leading-tight">{item.name}</h4>
                    <p className="text-raw-umber-600 font-bold text-sm">
                      Rp {item.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-bright-snow-50 rounded-lg px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.name, item.quantity - 1)}
                        className="p-1 hover:text-raw-umber-600"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.name, item.quantity + 1)}
                        className="p-1 hover:text-raw-umber-600"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id, item.name)}
                      className="text-white-300 hover:text-red-500 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-white-200 bg-white space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white-600">Total Pembayaran</span>
              <span className="text-xl font-black text-raw-umber-600">
                Rp {totalPrice().toLocaleString('id-ID')}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={clearCart}
                className="py-3 border border-white-200 rounded-xl font-bold text-white-600 hover:bg-white-50 transition"
              >
                Hapus Semua
              </button>
              <Link
                href="/checkout"
                onClick={onClose}
                className="py-3 bg-raw-umber-500 text-white rounded-xl font-bold text-center hover:bg-raw-umber-600 transition shadow-lg shadow-raw-umber-200"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
