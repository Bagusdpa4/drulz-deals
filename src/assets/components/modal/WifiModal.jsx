import React, { useState } from "react";
import { X, Wifi, Copy, Check } from "lucide-react";
import {
  KOPKEN_WIFI_SSID,
  KOPKEN_WIFI_USERNAME,
  FORE_WIFI_PASSWORD,
  getTodayWifiPassword,
  getTodayFormatted,
} from "../../../helper/wifi";
import { useBodyScrollLock } from "../../lib/useBodyScrollLock";

const CopyButton = ({ value }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
        copied
          ? "bg-emerald-600 text-white"
          : "cursor-pointer bg-orange-500 text-white hover:bg-orange-600"
      }`}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Tersalin" : "Salin"}
    </button>
  );
};

const KopkenContent = () => {
  const kopkenPassword = getTodayWifiPassword();
  const todayFormatted = getTodayFormatted();
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-100 px-4 py-4">
      <p className="text-[12px] font-semibold uppercase tracking-wide text-neutral-500">
        Password WiFi — {todayFormatted}
      </p>
      <div className="mt-1.5 flex items-center justify-between gap-3">
        <p className="text-base font-bold text-neutral-900">
          {kopkenPassword ?? "Belum tersedia"}
        </p>
        {kopkenPassword && <CopyButton value={kopkenPassword} />}
      </div>
      <div className="mt-1.5 flex flex-col gap-0.5 text-sm font-semibold text-neutral-500 sm:flex-row sm:items-center sm:gap-1">
        <span>
          SSID:{" "}
          <span className="font-semibold text-neutral-700">
            {KOPKEN_WIFI_SSID}
          </span>
        </span>
        <span className="hidden sm:inline">•</span>
        <span>
          Username:{" "}
          <span className="font-semibold text-neutral-700">
            {KOPKEN_WIFI_USERNAME}
          </span>
        </span>
      </div>
    </div>
  );
};

const ForeContent = () => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-100 px-4 py-4">
    <h3 className="mb-3 text-sm font-bold text-neutral-900">
      Password Fore Coffee
    </h3>
    <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
          Password
        </p>
        <p className="text-lg font-extrabold text-neutral-900">
          {FORE_WIFI_PASSWORD}
        </p>
      </div>
      <CopyButton value={FORE_WIFI_PASSWORD} />
    </div>
  </div>
);

const BRAND_LABELS = { kopken: "Kopi Kenangan", fore: "Fore Coffee" };

export const WifiPasswordModal = ({ open, onClose, brand = null }) => {
  useBodyScrollLock(open);

  if (!open) return null;
  const showKopken = brand === "kopken" || brand === null;
  const showFore = brand === "fore" || brand === null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-0 backdrop-blur-sm sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-[85vw] flex-col overflow-hidden rounded-3xl bg-white sm:max-w-lg sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-white">
              <Wifi size={16} />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-neutral-900">
                Password WiFi
              </h2>
              {brand && (
                <p className="text-sm font-semibold text-neutral-500">
                  {BRAND_LABELS[brand]}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-slate-200 text-neutral-600 transition-colors hover:bg-neutral-900 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
        <div className="space-y-4 px-5 py-5">
          {showKopken && <KopkenContent />}
          {showFore && <ForeContent />}
        </div>
      </div>
    </div>
  );
};
