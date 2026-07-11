import React from "react";

export const Error = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6 text-neutral-900">
      <div className="max-w-sm text-center">
        {/* Icon/illustration */}
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-orange-100" />
          <span className="relative text-4xl">☕</span>
        </div>

        <p className="mb-1 text-7xl font-black tracking-tight text-neutral-900">
          4<span className="text-orange-500">0</span>4
        </p>

        <h1 className="mb-2 text-2xl font-bold">Halaman tidak ditemukan</h1>
        <p className="mb-8 text-base leading-relaxed text-stone-500">
          Menu yang kamu cari mungkin sudah pindah, habis, atau belum tersedia.
        </p>

        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-base font-semibold border text-slate-100 transition-colors hover:border-neutral-900 hover:bg-orange-500"
        >
          Kembali ke Halaman Utama
        </a>

        <p className="mt-6 text-sm text-stone-400">Drulz Deals</p>
      </div>
    </div>
  );
};
