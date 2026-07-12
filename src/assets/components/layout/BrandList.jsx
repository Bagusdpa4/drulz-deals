import React, { useState, useRef } from "react";
import { Sparkles } from "lucide-react";
import { getBrands } from "../../lib/useBrands";

const BRANDS = getBrands("minuman");
const ITEMS_PER_PAGE_MOBILE = 3;
export const DEFAULT_BRAND_ID = BRANDS[0]?.id ?? null;

export const BrandList = ({ selected, onSelect }) => {
  const [page, setPage] = useState(0);
  const scrollRef = useRef(null);

  const totalPages = Math.ceil(BRANDS.length / ITEMS_PER_PAGE_MOBILE);
  const pages = Array.from({ length: totalPages }, (_, i) =>
    BRANDS.slice(
      i * ITEMS_PER_PAGE_MOBILE,
      i * ITEMS_PER_PAGE_MOBILE + ITEMS_PER_PAGE_MOBILE,
    ),
  );

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setPage(Math.round(el.scrollLeft / el.clientWidth));
  };

  const renderCard = (brand) => {
    const isActive = selected === brand.id;
    return (
      <button
        key={brand.id}
        onClick={() => onSelect(brand.id)}
        className={`flex w-28 shrink-0 flex-col items-center gap-1 rounded-xl border p-2 text-center shadow-sm transition-all duration-300 ease-out sm:w-40 sm:gap-2 sm:rounded-2xl sm:p-3 ${
          isActive
            ? "border-neutral-900 bg-neutral-900 text-white"
            : "cursor-pointer border-neutral-200 bg-white text-neutral-900 hover:scale-105 hover:border-orange-300"
        }`}
      >
        <div
          className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg p-1 transition-all duration-300 ease-out sm:h-16 sm:w-16 ${
            isActive ? "bg-white shadow-sm" : "bg-transparent shadow-none"
          }`}
        >
          <img
            src={brand.logo}
            alt={brand.name}
            className="h-full w-full object-contain p-1"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextSibling.style.display = "flex";
            }}
          />
          <span
            className="hidden h-full w-full items-center justify-center text-[9px] font-bold text-neutral-800 sm:text-[10px]"
            aria-hidden="true"
          >
            {brand.name.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <span className="line-clamp-1 text-[12px] font-bold leading-tight sm:text-[16px]">
          {brand.name}
        </span>
        <span
          className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold sm:px-2 sm:text-[12px] ${
            isActive
              ? "bg-white text-neutral-900"
              : "bg-orange-100 text-orange-500"
          }`}
        >
          Special Price
        </span>
      </button>
    );
  };

  return (
    <section className="px-0 pt-6 sm:px-5 sm:pt-8">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-sm font-bold text-neutral-900 sm:text-base">
          Pilih Brand Favoritmu{" "}
          <Sparkles size={15} className="text-orange-400" />
        </h2>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="scrollbar-none py-4 mt-3 flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] sm:hidden [&::-webkit-scrollbar]:hidden"
      >
        {pages.map((groupBrands, i) => (
          <div
            key={i}
            className="flex w-full shrink-0 snap-center justify-center gap-2"
          >
            {groupBrands.map(renderCard)}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-1.5 sm:hidden">
          {Array.from({ length: totalPages }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === page ? "w-4 bg-neutral-900" : "w-1.5 bg-neutral-300"}`}
            />
          ))}
        </div>
      )}

      <div className="mt-3 hidden flex-wrap justify-center gap-2 sm:flex sm:gap-4">
        {BRANDS.map(renderCard)}
      </div>
    </section>
  );
};
