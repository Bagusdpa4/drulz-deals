import React from "react";
import {
  HiXMark,
  HiLink,
  HiTag,
  HiShoppingBag,
  HiHeart,
  HiAdjustmentsHorizontal,
  HiShoppingCart,
  HiPaperAirplane,
  HiChatBubbleLeftRight,
  HiQrCode,
  HiTicket,
  HiArrowRight,
  HiMiniShoppingBag,
  HiBookOpen,
} from "react-icons/hi2";
import { useBodyScrollLock } from "../../lib/useBodyScrollLock";

const STEPS = [
  {
    number: 1,
    icon: HiLink,
    title: "Buka Link",
    description: "Buka link untuk cek promo & order.",
  },
  {
    number: 2,
    icon: HiHeart,
    title: "Pilih Brand",
    description: "Pilih brand yang ingin kamu beli.",
  },
  {
    number: 3,
    icon: HiTag,
    title: "Pilih Paket",
    description: "Pilih paket satuan atau promo bundling.",
  },
  {
    number: 4,
    icon: HiShoppingBag,
    title: "Pilih Minuman / Makanan Favoritmu",
    description:
      "Isi nama customer, nama outlet untuk diambil, dan jam pengambilan.",
  },
  {
    number: 5,
    icon: HiAdjustmentsHorizontal,
    title: "Pilih Opsi",
    description: "Pilih ukuran, level manis, & level ice.",
  },
  {
    number: 6,
    icon: HiShoppingCart,
    title: "Cek Keranjang",
    description: "Cek menu yang kamu pilih di keranjang (pojok kanan bawah).",
  },
  {
    number: 7,
    icon: HiBookOpen,
    title: "Isi Biodata",
    description: "Isi nama anda, outlet tujuan, & jam pengambilan.",
  },
  {
    number: 8,
    icon: HiPaperAirplane,
    title: "Pesan Sekarang",
    description: "Klik pesan sekarang untuk buat pesanan.",
  },
  {
    number: 9,
    icon: HiChatBubbleLeftRight,
    title: "Konfirmasi dari Admin",
    description: "Admin akan konfirmasi ketersediaan menu melalui WhatsApp.",
  },
  {
    number: 10,
    icon: HiQrCode,
    title: "Bayar Pakai QRIS",
    description: "Bayar pesanan pakai QRIS.",
  },
  {
    number: 11,
    icon: HiTicket,
    title: "Dapat Nomor Antrian & Ambil di Outlet",
    description:
      "Dapat nomor antrian & nama untuk ambil di outlet yang kamu pilih.",
  },
];

export const GuideOrder = ({ open, onClose, onOrderNow }) => {
  useBodyScrollLock(open);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-0 backdrop-blur-sm sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[80vh] w-full max-w-[85vw] flex-col overflow-hidden rounded-3xl bg-white md:max-w-2xl md:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <span className="mb-1 inline-block rounded-full bg-slate-200 px-3 py-1 text-xs font-bold uppercase tracking-wide text-neutral-700">
              Step by Step
            </span>
            <h2 className="text-xl font-extrabold tracking-tight text-neutral-900">
              Cara Order di Drulz Deals
            </h2>
            <p className="text-sm text-neutral-600">
              Ngopi dulu, baru mikir 🧠
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-slate-200 text-neutral-600 transition-colors hover:bg-neutral-900 hover:text-white"
          >
            <HiXMark className="h-5 w-5" />
          </button>
        </div>

        {/* Steps list — scrollable */}
        <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="flex items-start gap-4 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3.5 transition-colors hover:border-neutral-300"
              >
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white">
                  <Icon className="h-4.5 w-4.5" />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-neutral-900 text-[10px] font-bold text-white">
                    {step.number}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900">
                    {step.title}
                  </h3>
                  <p className="text-xs text-neutral-500">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="border-t border-slate-100 bg-white px-6 py-4">
          <button
            type="button"
            onClick={onOrderNow}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-neutral-700"
          >
            <HiMiniShoppingBag className="h-4.5 w-4.5" />
            Klik Order Now
            <HiArrowRight className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
