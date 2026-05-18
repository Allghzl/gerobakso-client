"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function TopBanner() {
  const [showBanner, setShowBanner] = useState(true);

  if (!showBanner) return null;

  return (
    <div className="bg-raw-umber-600 text-white px-4 py-2.5 flex items-center justify-between text-sm">
      <p className="text-center flex-1 font-medium">🔥 Promo Grand Opening: Diskon 20% untuk semua menu Prasmanan!</p>
      <button onClick={() => setShowBanner(false)} className="hover:text-bright-snow-200 cursor-pointer">
        <X size={18} />
      </button>
    </div>
  );
}
