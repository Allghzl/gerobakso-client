import { Star, ShoppingBag } from "lucide-react";

export default function BestSellers() {
  return (
    <section className="py-20 max-w-6xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white-900 mb-4">Pilihan Terlaris</h2>
        <p className="text-white-600">Menu favorit yang selalu jadi incaran pelanggan Gerobakso.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-bright-snow-200 hover:shadow-md transition">
            <div className="h-48 bg-white-200 flex items-center justify-center text-white-500">[Gambar Bakso {item}]</div>
            <div className="p-6">
              <div className="flex items-center gap-1 text-raw-umber-500 mb-2">
                <Star size={16} className="fill-current" />
                <span className="text-sm font-bold text-white-700">4.9</span>
              </div>
              <h3 className="text-xl font-bold text-white-900 mb-2">Paket Bakso Urat Jumbo</h3>
              <p className="text-white-600 text-sm mb-4 line-clamp-2">Bakso urat sapi asli dengan ukuran jumbo, kuah kaldu gurih, mie kuning, bihun, dan sayuran.</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-raw-umber-600">Rp 25.000</span>
                <button className="p-2 bg-raw-umber-100 text-raw-umber-600 rounded-full hover:bg-raw-umber-500 hover:text-white transition">
                  <ShoppingBag size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
