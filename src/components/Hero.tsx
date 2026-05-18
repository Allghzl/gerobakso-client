import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <header className="relative bg-raw-umber-50 bg-cover bg-center overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center">
        <span className="px-4 py-1.5 bg-raw-umber-100 text-raw-umber-700 rounded-full text-sm font-bold mb-6">#1 Bakso Khas Nusantara</span>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white-900 tracking-tight mb-6">
          Racik Sendiri <br />
          <span className="text-raw-umber-600">Mangkok Impianmu.</span>
        </h1>
        <p className="text-lg md:text-xl text-white-600 max-w-2xl mb-10">
          Dari kuah kaldu sapi asli hingga berbagai pilihan pentol urat dan topping melimpah. Nikmati sensasi prasmanan bakso terbaik di kota ini.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="px-8 py-4 bg-raw-umber-500 cursor-pointer text-white rounded-full font-bold text-lg hover:bg-raw-umber-600 hover:shadow-lg transition flex items-center justify-center gap-2">
            Prasmanan Sekarang <ArrowRight size={20} />
          </button>
          <button className="px-8 py-4 bg-white cursor-pointer text-raw-umber-700 border border-white-300 rounded-full font-bold text-lg hover:bg-bright-snow-100 transition">Lihat Menu Paket</button>
        </div>
      </div>
    </header>
  );
}
