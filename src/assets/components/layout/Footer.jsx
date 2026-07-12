import React from "react";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="rounded-3xl border border-neutral-300 bg-white py-6 text-center shadow-md mb-10 sm:mb-0">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
        ☕
      </div>

      <h2 className="mt-4 text-2xl font-extrabold text-neutral-900 sm:text-4xl">
        Drulz <span className="text-orange-500">Deals</span>
      </h2>

      <p className="mt-1 text-base text-neutral-400 sm:text-lg">
        Jasa Order Kopi Harga Special ✨
      </p>

      <p className="mt-6 text-base font-semibold text-neutral-400/70">
        &copy; {year} Drulz Deals
      </p>
    </footer>
  );
};
