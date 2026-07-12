// HeroSection.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, CheckSquare, MessageSquareQuote } from "lucide-react";
import { GuideOrder } from "../modal/GuideOrder";

export const HeroSection = () => {
  const [showGuide, setShowGuide] = useState(false);
  const navigate = useNavigate();

  return (
    <section className="px-0 pt-4 sm:px-5 sm:pt-6">
      <div className="relative overflow-hidden rounded-2xl bg-orange-100 px-5 py-6 shadow-sm sm:rounded-3xl sm:px-8 sm:py-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[12px] font-bold text-orange-600 shadow-lg sm:px-3 sm:text-xs">
          <Flame size={14} />
          PROMO SPESIAL
        </span>

        <h1 className="mt-3 max-w-full pr-16 text-2xl font-extrabold leading-tight text-neutral-900 sm:max-w-md sm:pr-0 sm:text-3xl md:text-4xl">
          Pesan Kopi Kenangan, Tomoro, Fore &amp; Lainnya{" "}
          <span className="text-orange-500">Lebih Hemat!</span>
        </h1>

        <div className="mt-4 flex flex-wrap gap-2.5 sm:gap-3">
          <button
            onClick={() => setShowGuide(true)}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:scale-105 sm:gap-2 sm:px-5 sm:py-3"
          >
            <CheckSquare size={16} />
            Cara Pemesanan
          </button>
          <button className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:scale-105 hover:border-orange-300 sm:gap-2 sm:px-5 sm:py-3">
            <MessageSquareQuote size={16} />
            Testimonial
          </button>
        </div>

        <div className="pointer-events-none absolute -right-4 bottom-0 hidden h-full items-end gap-2 opacity-90 lg:flex">
          <div className="bg-linear-to-b h-32 w-14 rounded-t-full from-amber-800 to-amber-950" />
          <div className="bg-linear-to-b h-40 w-14 rounded-t-full from-amber-200 to-amber-400" />
          <div className="bg-linear-to-b h-36 w-14 rounded-t-full from-lime-200 to-lime-400" />
        </div>

        {/* <div className="absolute right-3 top-3 flex h-12 w-12 flex-col items-center justify-center rounded-full bg-orange-500 text-center text-white shadow-md sm:right-6 sm:top-6 sm:h-16 sm:w-16 md:right-10">
          <span className="text-[7px] font-medium leading-none sm:text-[10px]">
            HEMAT
          </span>
          <span className="text-[9px] font-extrabold leading-tight sm:text-sm">
            SAMPAI
          </span>
          <span className="text-[9px] font-extrabold leading-none sm:text-sm">
            40%
          </span>
        </div> */}
      </div>

      <GuideOrder
        open={showGuide}
        onClose={() => setShowGuide(false)}
        onOrderNow={() => {
          setShowGuide(false);
          navigate("/minuman");
        }}
      />
    </section>
  );
};
