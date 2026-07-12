import React, { useState } from "react";
import { Search, X, Wifi, WifiOff } from "lucide-react";
import { WifiPasswordModal } from "../modal/WifiModal";

const WIFI_BRAND_IDS = ["kopken", "fore"];

export const SearchMenu = ({ selectedBrandId }) => {
  const [showWifi, setShowWifi] = useState(false);
  const hasWifi = WIFI_BRAND_IDS.includes(selectedBrandId);

  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
      <div className="flex flex-1 items-center gap-3 rounded-full border border-slate-300 bg-white px-5 py-3.5 shadow-sm">
        <Search size={20} className="shrink-0 text-neutral-400" />
        <input
          type="text"
          placeholder="Cari menu favorit kamu..."
          className="w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
        />
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-neutral-900 text-white transition-colors hover:bg-neutral-700"
        >
          <X size={16} />
        </button>
      </div>

      <button
        type="button"
        onClick={() => hasWifi && setShowWifi(true)}
        disabled={!hasWifi}
        title={
          hasWifi
            ? undefined
            : "WiFi hanya tersedia untuk Kopi Kenangan & Fore Coffee"
        }
        className={`flex shrink-0 items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold shadow-sm transition-colors ${
          hasWifi
            ? "cursor-pointer bg-neutral-900 text-white hover:scale-105 hover:bg-neutral-700"
            : "cursor-not-allowed bg-slate-200 text-neutral-400"
        }`}
      >
        {hasWifi ? <Wifi size={16} /> : <WifiOff size={16} />}
        Lihat Password WiFi
      </button>

      <WifiPasswordModal
        open={showWifi}
        onClose={() => setShowWifi(false)}
        brand={hasWifi ? selectedBrandId : null}
      />
    </div>
  );
};
