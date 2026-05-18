import { ArrowRight } from "lucide-react";

export default function ExploreMenu() {
  return (
    <section className="py-20 bg-bright-snow-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white-900 mb-2">Eksplorasi Menu</h2>
            <p className="text-white-600">Temukan rasa yang pas untuk lidahmu.</p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {["Semua", "Bakso Kuah", "Mie Ayam", "Minuman", "Cemilan"].map((kat, i) => (
              <button
                key={kat}
                className={`whitespace-nowrap px-5 py-2 rounded-full font-medium text-sm transition ${
                  i === 0 ? "bg-raw-umber-500 text-white" : "bg-white text-white-700 border border-white-200 hover:border-raw-umber-300"
                }`}
              >
                {kat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white p-4 rounded-2xl border border-bright-snow-200 hover:border-raw-umber-300 transition group">
              <div className="h-32 bg-white-100 rounded-xl mb-4 flex items-center justify-center text-white-400 group-hover:bg-bright-snow-200 transition">[Img]</div>
              <h3 className="font-bold text-white-900 mb-1">Es Teh Manis</h3>
              <p className="text-raw-umber-600 font-bold">Rp 5.000</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button className="flex items-center gap-2 text-raw-umber-600 font-bold hover:text-raw-umber-700 transition">
            Lihat Semua Menu <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
