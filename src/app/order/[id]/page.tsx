'use client';

import { useEffect, useState, use } from 'react';
import { Loader2, CheckCircle2, Clock, Utensils, ArrowLeft, Printer, RefreshCw } from 'lucide-react';
import { getOrder } from '@/lib/api';
import { Order } from '@/types';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function OrderStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrder = async (isRefreshing = false) => {
    if (isRefreshing) setRefreshing(true);
    try {
      const data = await getOrder(resolvedParams.id);
      setOrder(data.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    // Polling for status updates every 10 seconds
    const interval = setInterval(() => {
      fetchOrder();
    }, 10000);

    return () => clearInterval(interval);
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bright-snow-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-raw-umber-600" size={48} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-bright-snow-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-black text-white-900 mb-4">Pesanan Tidak Ditemukan</h1>
        <Link href="/menu" className="text-raw-umber-600 font-bold hover:underline">
          Kembali ke Menu
        </Link>
      </div>
    );
  }

  const steps = [
    { id: 'pending', label: 'Pesanan Diterima', icon: <Clock size={20} />, color: 'bg-yellow-500' },
    { id: 'preparing', label: 'Sedang Disiapkan', icon: <Utensils size={20} />, color: 'bg-raw-umber-500' },
    { id: 'ready', label: 'Siap Disajikan', icon: <CheckCircle2 size={20} />, color: 'bg-green-500' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === order.status);

  return (
    <div className="min-h-screen bg-bright-snow-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full font-bold text-sm mb-4">
            <CheckCircle2 size={18} /> Pesanan Berhasil Dibuat
          </div>
          <h1 className="text-4xl font-black text-white-900 mb-2">Terima Kasih!</h1>
          <p className="text-white-600">Pesananmu sedang kami proses. Silakan tunggu sebentar.</p>
        </div>

        {/* Queue Card */}
        <div className="bg-white rounded-[40px] border border-white-200 shadow-xl overflow-hidden mb-8">
          <div className="p-8 text-center border-b border-white-100 bg-bright-snow-50/50">
            <span className="text-white-500 font-bold uppercase tracking-[0.2em] text-sm">Nomor Antrean</span>
            <div className="text-8xl font-black text-raw-umber-600 my-4 tabular-nums">
              {order.id.toString().padStart(3, '0')}
            </div>
            <div className="flex items-center justify-center gap-4">
              <span className={`px-4 py-2 rounded-full text-white font-black text-sm uppercase ${
                order.status === 'pending' ? 'bg-yellow-500' :
                order.status === 'preparing' ? 'bg-raw-umber-500' :
                order.status === 'ready' ? 'bg-green-500' : 'bg-white-400'
              }`}>
                {order.status}
              </span>
              <button
                onClick={() => fetchOrder(true)}
                disabled={refreshing}
                className="p-2 text-white-400 hover:text-raw-umber-600 transition disabled:opacity-50"
              >
                <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Stepper */}
          <div className="p-8">
            <div className="flex justify-between relative">
              <div className="absolute top-5 left-0 w-full h-1 bg-white-100 -z-0" />
              <div
                className="absolute top-5 left-0 h-1 bg-raw-umber-500 transition-all duration-1000 -z-0"
                style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
              />

              {steps.map((step, index) => (
                <div key={step.id} className="relative z-10 flex flex-col items-center">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 ${
                    index <= currentStepIndex ? step.color + ' text-white scale-110 shadow-lg' : 'bg-white text-white-300 border-4 border-white-100'
                  }`}>
                    {index < currentStepIndex ? <CheckCircle2 size={24} /> : step.icon}
                  </div>
                  <span className={`mt-3 text-xs font-black uppercase tracking-wider text-center max-w-[80px] ${
                    index <= currentStepIndex ? 'text-white-900' : 'text-white-300'
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-3xl border border-white-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-white-900">Rincian Pesanan</h3>
            <button onClick={() => window.print()} className="text-white-400 hover:text-raw-umber-600 transition flex items-center gap-2 font-bold text-sm">
              <Printer size={18} /> Cetak Struk
            </button>
          </div>

          <div className="space-y-4 mb-8">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-white-900">{item.name}</p>
                  <p className="text-white-400 text-sm">{item.quantity}x Rp {item.price.toLocaleString('id-ID')}</p>
                </div>
                <span className="font-bold text-white-800">
                  Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-dashed border-white-200 space-y-3">
            <div className="flex justify-between text-white-600 font-medium">
              <span>Metode</span>
              <span className="capitalize">{order.order_type} ({order.payment_method})</span>
            </div>
            {order.table && (
              <div className="flex justify-between text-white-600 font-medium">
                <span>Nomor Meja</span>
                <span>Meja {order.table.number}</span>
              </div>
            )}
            <div className="flex justify-between text-2xl font-black text-raw-umber-600 pt-2">
              <span>Total Bayar</span>
              <span>Rp {order.total_price.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/menu"
            className="flex items-center gap-2 text-raw-umber-600 font-black hover:underline group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Pesan Menu Lainnya
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
