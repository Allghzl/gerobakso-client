'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Table, CreateOrderPayload } from '@/types/api';
import { useCartStore } from '@/store/useCartStore';
import { formatCurrency, cn } from '@/lib/utils';
import { User, MapPin, CreditCard, ClipboardList, ChevronLeft, Loader2, Info } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getTax, getTotalPrice, clearCart } = useCartStore();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: '',
    type: 'dine_in' as 'dine_in' | 'takeaway',
    table_id: '' as string | number,
    payment_method: 'cash' as 'cash' | 'qris'
  });

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await api.get('/tables');
        setTables(res.data.data || res.data);
      } catch (error) {
        console.error('Failed to fetch tables:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTables();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setSubmitting(true);
    try {
      const payload: CreateOrderPayload = {
        customer_name: formData.customer_name,
        type: formData.type,
        table_id: formData.type === 'dine_in' ? Number(formData.table_id) : null,
        items: items.map(item => ({
          product_id: item.productId || 0, // Fallback for custom items - might need backend support for custom items
          quantity: item.quantity
        })).filter(item => item.product_id !== 0) // Filtering out custom items if not supported yet by simple POST
      };

      // Note: If the backend supports custom bowls, we would send a different structure.
      // Based on the provided POST api/orders schema, it only accepts product_id and quantity.
      // I will proceed with this schema.

      const res = await api.post('/orders', payload);
      const orderId = res.data.id;

      clearCart();
      router.push(`/order/${orderId}`);
    } catch (error) {
      console.error('Order submission failed:', error);
      alert('Gagal mengirim pesanan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0 && !submitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm text-center max-w-sm w-full">
          <ClipboardList className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white-900 mb-2">Keranjang Kosong</h2>
          <p className="text-gray-500 mb-6">Kamu belum memilih menu apapun untuk dipesan.</p>
          <Link href="/menu" className="block w-full bg-raw-umber-500 text-white py-4 rounded-2xl font-bold">
            Lihat Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/menu" className="p-2 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
          <ChevronLeft className="w-6 h-6 text-white-900" />
        </Link>
        <h1 className="text-2xl font-black text-white-900">Pembayaran</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Details */}
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-raw-umber-500 mb-2">
              <User className="w-5 h-5" />
              <h2 className="font-bold text-white-900">Informasi Pelanggan</h2>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pemesan</label>
              <input
                required
                type="text"
                placeholder="Masukkan nama Anda"
                className="w-full px-4 py-3 bg-bright-snow-50 rounded-xl border-none focus:ring-2 focus:ring-raw-umber-500 transition-all"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              />
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-raw-umber-500 mb-2">
              <MapPin className="w-5 h-5" />
              <h2 className="font-bold text-white-900">Tipe Pesanan</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'dine_in' })}
                className={cn(
                  "py-4 rounded-xl font-bold border-2 transition-all",
                  formData.type === 'dine_in'
                    ? "border-raw-umber-500 bg-raw-umber-50 text-raw-umber-500"
                    : "border-transparent bg-gray-50 text-gray-500"
                )}
              >
                Makan di Sini
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'takeaway' })}
                className={cn(
                  "py-4 rounded-xl font-bold border-2 transition-all",
                  formData.type === 'takeaway'
                    ? "border-raw-umber-500 bg-raw-umber-50 text-raw-umber-500"
                    : "border-transparent bg-gray-50 text-gray-500"
                )}
              >
                Bawa Pulang
              </button>
            </div>

            {formData.type === 'dine_in' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Meja</label>
                <select
                  required={formData.type === 'dine_in'}
                  className="w-full px-4 py-3 bg-bright-snow-50 rounded-xl border-none focus:ring-2 focus:ring-raw-umber-500 transition-all appearance-none"
                  value={formData.table_id}
                  onChange={(e) => setFormData({ ...formData, table_id: e.target.value })}
                >
                  <option value="">Pilih No. Meja</option>
                  {tables.filter(t => t.status === 'available').map((table) => (
                    <option key={table.id} value={table.id}>{table.name || `Meja ${table.number}`}</option>
                  ))}
                </select>
              </div>
            )}
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-raw-umber-500 mb-2">
              <CreditCard className="w-5 h-5" />
              <h2 className="font-bold text-white-900">Metode Pembayaran</h2>
            </div>
            <div className="space-y-2">
              <label className={cn(
                "flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer",
                formData.payment_method === 'cash' ? "border-raw-umber-500 bg-raw-umber-50" : "border-transparent bg-gray-50"
              )}>
                <input
                  type="radio"
                  name="payment"
                  className="hidden"
                  checked={formData.payment_method === 'cash'}
                  onChange={() => setFormData({ ...formData, payment_method: 'cash' })}
                />
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  formData.payment_method === 'cash' ? "border-raw-umber-500" : "border-gray-300"
                )}>
                  {formData.payment_method === 'cash' && <div className="w-2.5 h-2.5 bg-raw-umber-500 rounded-full" />}
                </div>
                <span className={cn("font-bold", formData.payment_method === 'cash' ? "text-raw-umber-500" : "text-gray-600")}>
                  Bayar di Kasir (Tunai)
                </span>
              </label>

              <label className={cn(
                "flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer",
                formData.payment_method === 'qris' ? "border-raw-umber-500 bg-raw-umber-50" : "border-transparent bg-gray-50"
              )}>
                <input
                  type="radio"
                  name="payment"
                  className="hidden"
                  checked={formData.payment_method === 'qris'}
                  onChange={() => setFormData({ ...formData, payment_method: 'qris' })}
                />
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  formData.payment_method === 'qris' ? "border-raw-umber-500" : "border-gray-300"
                )}>
                  {formData.payment_method === 'qris' && <div className="w-2.5 h-2.5 bg-raw-umber-500 rounded-full" />}
                </div>
                <span className={cn("font-bold", formData.payment_method === 'qris' ? "text-raw-umber-500" : "text-gray-600")}>
                  QRIS (Otomatis)
                </span>
              </label>
            </div>
          </section>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white p-6 rounded-3xl shadow-sm space-y-6">
            <h2 className="font-bold text-white-900 border-b pb-4">Ringkasan Pesanan</h2>

            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-white-900 text-sm leading-tight">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.quantity}x @ {formatCurrency(item.price)}</p>
                  </div>
                  <p className="font-bold text-white-900 text-sm">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>{formatCurrency(getSubtotal())}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Pajak (11%)</span>
                <span>{formatCurrency(getTax())}</span>
              </div>
              <div className="flex justify-between text-xl font-black text-white-900 pt-2">
                <span>Total Bayar</span>
                <span>{formatCurrency(getTotalPrice())}</span>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 text-blue-700 text-sm">
              <Info className="w-5 h-5 flex-shrink-0" />
              <p>Mohon pastikan pesanan Anda sudah benar sebelum menekan tombol bayar.</p>
            </div>

            <button
              disabled={submitting}
              type="submit"
              className="w-full bg-raw-umber-500 text-white py-5 rounded-2xl font-black text-lg hover:bg-raw-umber-600 transition-all active:scale-[0.98] shadow-xl shadow-raw-umber-500/20 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" /> Memproses...
                </>
              ) : (
                'Simpan & Bayar Pesanan'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
