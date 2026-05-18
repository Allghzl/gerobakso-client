'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, MapPin, CreditCard, User, ShoppingBag, Info } from 'lucide-react';
import { getTables, createOrder } from '@/lib/api';
import { Table } from '@/types';
import { useCart } from '@/hooks/useCart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: '',
    order_type: 'dine-in' as 'dine-in' | 'takeaway',
    table_id: '',
    payment_method: 'cash' as 'cash' | 'qris',
  });

  useEffect(() => {
    if (items.length === 0) {
      router.push('/menu');
      return;
    }

    const fetchTables = async () => {
      try {
        const tableData = await getTables();
        setTables(tableData.data.filter((t: Table) => t.status === 'available'));
      } catch (error) {
        console.error('Error fetching tables:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, [items, router]);

  const subtotal = totalPrice();
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_name) return alert('Nama pelanggan harus diisi');
    if (formData.order_type === 'dine-in' && !formData.table_id) return alert('Pilih meja untuk makan di tempat');

    setSubmitting(true);
    try {
      const payload = {
        customer_name: formData.customer_name,
        order_type: formData.order_type,
        table_id: formData.order_type === 'dine-in' ? parseInt(formData.table_id) : null,
        payment_method: formData.payment_method,
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          name: item.name, // Send the potentially prefixed name
        }))
      };

      const result = await createOrder(payload);
      clearCart();
      router.push(`/order/${result.data.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Gagal membuat pesanan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
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

      <main className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white-500 hover:text-raw-umber-600 font-bold mb-8 transition"
        >
          <ArrowLeft size={20} /> Kembali
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Info */}
              <div className="bg-white p-6 rounded-3xl border border-white-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-raw-umber-50 text-raw-umber-600 rounded-lg">
                    <User size={24} />
                  </div>
                  <h3 className="text-xl font-black text-white-900">Informasi Pelanggan</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-white-700 mb-2">Nama Lengkap</label>
                    <input
                      required
                      type="text"
                      placeholder="Masukkan nama Anda"
                      className="w-full px-4 py-3 bg-bright-snow-50 border border-white-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-raw-umber-500/20 transition"
                      value={formData.customer_name}
                      onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Order Type */}
              <div className="bg-white p-6 rounded-3xl border border-white-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-raw-umber-50 text-raw-umber-600 rounded-lg">
                    <MapPin size={24} />
                  </div>
                  <h3 className="text-xl font-black text-white-900">Metode Pesanan</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, order_type: 'dine-in'})}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition ${
                      formData.order_type === 'dine-in'
                        ? 'border-raw-umber-500 bg-raw-umber-50/50 text-raw-umber-600'
                        : 'border-white-100 bg-bright-snow-50 text-white-400'
                    }`}
                  >
                    <span className="font-bold">Makan di Tempat</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, order_type: 'takeaway'})}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition ${
                      formData.order_type === 'takeaway'
                        ? 'border-raw-umber-500 bg-raw-umber-50/50 text-raw-umber-600'
                        : 'border-white-100 bg-bright-snow-50 text-white-400'
                    }`}
                  >
                    <span className="font-bold">Bawa Pulang</span>
                  </button>
                </div>

                {formData.order_type === 'dine-in' && (
                  <div>
                    <label className="block text-sm font-bold text-white-700 mb-2">Pilih Meja</label>
                    <select
                      required
                      className="w-full px-4 py-3 bg-bright-snow-50 border border-white-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-raw-umber-500/20 transition"
                      value={formData.table_id}
                      onChange={(e) => setFormData({...formData, table_id: e.target.value})}
                    >
                      <option value="">Pilih nomor meja</option>
                      {tables.map((table) => (
                        <option key={table.id} value={table.id}>Meja {table.number} (Kapasitas {table.capacity})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white p-6 rounded-3xl border border-white-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-raw-umber-50 text-raw-umber-600 rounded-lg">
                    <CreditCard size={24} />
                  </div>
                  <h3 className="text-xl font-black text-white-900">Metode Pembayaran</h3>
                </div>

                <div className="space-y-3">
                  <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
                    formData.payment_method === 'cash' ? 'border-raw-umber-500 bg-raw-umber-50/50' : 'border-white-100'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData.payment_method === 'cash' ? 'border-raw-umber-500' : 'border-white-300'
                      }`}>
                        {formData.payment_method === 'cash' && <div className="w-2.5 h-2.5 bg-raw-umber-500 rounded-full" />}
                      </div>
                      <span className="font-bold text-white-800">Bayar di Kasir (Cash)</span>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      className="hidden"
                      value="cash"
                      checked={formData.payment_method === 'cash'}
                      onChange={() => setFormData({...formData, payment_method: 'cash'})}
                    />
                  </label>

                  <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
                    formData.payment_method === 'qris' ? 'border-raw-umber-500 bg-raw-umber-50/50' : 'border-white-100'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData.payment_method === 'qris' ? 'border-raw-umber-500' : 'border-white-300'
                      }`}>
                        {formData.payment_method === 'qris' && <div className="w-2.5 h-2.5 bg-raw-umber-500 rounded-full" />}
                      </div>
                      <span className="font-bold text-white-800">QRIS (Otomatis)</span>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      className="hidden"
                      value="qris"
                      checked={formData.payment_method === 'qris'}
                      onChange={() => setFormData({...formData, payment_method: 'qris'})}
                    />
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-white-200 shadow-sm overflow-hidden sticky top-24">
              <div className="p-6 bg-raw-umber-500 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <ShoppingBag size={20} />
                  <h3 className="text-xl font-black">Ringkasan Pesanan</h3>
                </div>
                <p className="opacity-80 text-sm">{items.length} item dipilih</p>
              </div>

              <div className="p-6 space-y-4">
                <div className="max-h-60 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="font-bold text-white-900 text-sm leading-tight">{item.name}</p>
                        <p className="text-white-400 text-xs">{item.quantity}x Rp {item.price.toLocaleString('id-ID')}</p>
                      </div>
                      <span className="font-bold text-white-800 text-sm">
                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-dashed border-white-200 space-y-2">
                  <div className="flex justify-between text-white-600">
                    <span>Subtotal</span>
                    <span className="font-bold">Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-white-600">
                    <div className="flex items-center gap-1">
                      <span>Pajak</span>
                      <Info size={14} className="opacity-50" />
                    </div>
                    <span className="font-bold">Rp {tax.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-black text-raw-umber-600 pt-2">
                    <span>Total</span>
                    <span>Rp {total.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  form="checkout-form"
                  disabled={submitting}
                  className="w-full py-4 bg-raw-umber-500 text-white rounded-2xl font-black text-lg hover:bg-raw-umber-600 transition shadow-lg shadow-raw-umber-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={24} className="animate-spin" /> Memproses...
                    </>
                  ) : (
                    'Bayar / Simpan Pesanan'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
