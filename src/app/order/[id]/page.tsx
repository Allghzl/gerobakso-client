'use client';

import { useEffect, useState, use } from 'react';
import api from '@/lib/api';
import { Order } from '@/types/api';
import { formatCurrency, cn } from '@/lib/utils';
import { CheckCircle2, Clock, UtensilsCrossed, ArrowLeft, Loader2, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

export default function OrderStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data.data || res.data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    // Poll for status updates every 10 seconds
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Loader2 className="w-10 h-10 text-raw-umber-500 animate-spin" />
        <p className="mt-4 text-gray-500 font-medium">Memuat Status Pesanan...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
        <h2 className="text-2xl font-bold text-white-900 mb-2">Pesanan Tidak Ditemukan</h2>
        <p className="text-gray-500 mb-6">Maaf, kami tidak dapat menemukan detail pesanan Anda.</p>
        <Link href="/menu" className="bg-raw-umber-500 text-white px-8 py-3 rounded-xl font-bold">
          Kembali ke Menu
        </Link>
      </div>
    );
  }

  const steps = [
    { id: 'pending', label: 'Menunggu Konfirmasi', icon: Clock },
    { id: 'preparing', label: 'Sedang Disiapkan', icon: UtensilsCrossed },
    { id: 'ready', label: 'Siap Disajikan', icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === order.status);

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <Link href="/menu" className="flex items-center gap-2 text-gray-500 font-bold hover:text-raw-umber-500 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Menu
        </Link>
        <button onClick={fetchOrder} className="p-2 text-gray-400 hover:text-raw-umber-500 transition-colors">
          <RefreshCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Main Status Card */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-raw-umber-500/5 overflow-hidden border border-gray-50">
        <div className="bg-raw-umber-500 p-8 text-center text-white">
          <p className="text-raw-umber-100 font-bold uppercase tracking-widest text-xs mb-2">Nomor Antrean Anda</p>
          <h1 className="text-7xl font-black">{order.id.toString().padStart(3, '0')}</h1>
          <p className="mt-4 text-raw-umber-100 font-medium">{order.customer_name}</p>
        </div>

        <div className="p-8">
          {/* Visual Step Tracker */}
          <div className="relative flex justify-between mb-12">
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-100 -z-0" />
            <div
              className="absolute top-5 left-0 h-1 bg-raw-umber-500 transition-all duration-1000 ease-in-out"
              style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isActive = index === currentStepIndex;

              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                      isCompleted ? "bg-raw-umber-500 text-white" : "bg-gray-100 text-gray-400",
                      isActive && "ring-4 ring-raw-umber-100 scale-110"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={cn(
                      "absolute top-12 whitespace-nowrap text-[10px] font-black uppercase tracking-wider",
                      isCompleted ? "text-raw-umber-500" : "text-gray-400"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Details Section */}
          <div className="bg-bright-snow-50 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <h3 className="font-black text-white-900">Rincian Pesanan</h3>
              <span className="text-xs font-bold px-3 py-1 bg-white border border-gray-200 rounded-full text-gray-500">
                {order.type === 'dine_in' ? `Dine-In (Meja ${order.table_id || '-'})` : 'Takeaway'}
              </span>
            </div>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <p className="text-gray-600">
                    <span className="font-bold text-white-900">{item.quantity}x</span> {item.product?.name}
                  </p>
                  <p className="font-bold text-white-900">{formatCurrency((item.price || 0) * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200 space-y-1">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Pajak (11%)</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between text-lg font-black text-white-900 pt-1">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 pt-0">
          <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 text-yellow-800 text-sm flex gap-3">
            <Clock className="w-5 h-5 flex-shrink-0" />
            <p>Mohon tunjukkan layar ini kepada kasir atau pramusaji saat Anda menerima pesanan.</p>
          </div>
        </div>
      </div>

      <footer className="text-center text-gray-400 text-xs py-4">
        &copy; 2025 Gerobakso Premium Taste. All rights reserved.
      </footer>
    </div>
  );
}
