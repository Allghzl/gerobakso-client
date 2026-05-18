export default function Footer() {
  return (
    <footer className="bg-golden-apricot-950 text-bright-snow-300 py-12 border-t border-white-900">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src="/gerobakso-logo.svg" alt="Gerobakso Logo" className="h-8 w-auto" />
          </div>
          <p className="text-sm text-white-500 max-w-xs">Platform prasmanan bakso modern yang memberikan kebebasan meracik mangkok impianmu.</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Tautan</h4>
          <ul className="space-y-2 text-sm text-white-400">
            <li>
              <a href="#" className="hover:text-raw-umber-400 transition">
                Beranda
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-raw-umber-400 transition">
                Katalog Menu
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-raw-umber-400 transition">
                Prasmanan (Custom)
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Kontak</h4>
          <ul className="space-y-2 text-sm text-white-400">
            <li>📍 Tangerang, Banten</li>
            <li>📞 0882-xxxx-xxxx</li>
            <li>✉️ halo@gerobakso.com</li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 mt-12 pt-8 border-t border-white-400 text-center text-sm text-white-600">© 2026 Gerobakso. All rights reserved.</div>
    </footer>
  );
}
