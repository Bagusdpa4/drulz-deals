import React from "react";
import { Plus, Gift } from "lucide-react";
import { formatRupiah } from "../../assets/lib/useCatalog";

export const BundlingCard = ({ bundle, onSelect }) => {
  let displayPrice = bundle.price;
  let priceLabel = "";
  let priceRange = null;

  if (bundle.type === "fixed_choice" && bundle.fixedOptions?.length) {
    const prices = bundle.fixedOptions.map((o) => o.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    priceLabel = "Pilihan Harga";
    priceRange = min === max ? null : { min, max };
    displayPrice = min;
  } else if (bundle.type === "duo_pay_highest") {
    priceLabel = "Bayar harga tertinggi";
  }

  return (
    <div
      className="hover:scale-102 flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-neutral-400 bg-slate-100/70 shadow-lg transition-shadow hover:shadow-xl"
      onClick={() => onSelect?.(bundle)}
    >
      <div className="aspect-4/3 relative w-full bg-white">
        <img
          src={bundle.image}
          alt={bundle.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
          loading="lazy"
        />
        <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-neutral-900 px-2 py-1 text-[10px] font-bold text-white">
          <Gift size={11} />
          Bundling
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="text-md line-clamp-2 font-bold leading-snug text-neutral-900">
          {bundle.name}
        </h3>
        {bundle.description && (
          <p className="line-clamp-2 text-sm text-neutral-500">
            {bundle.description}
          </p>
        )}
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            {priceLabel && (
              <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                {priceLabel}
              </p>
            )}
            {priceRange ? (
              <p className="text-sm font-extrabold text-neutral-900">
                {formatRupiah(priceRange.min)} - {formatRupiah(priceRange.max)}
              </p>
            ) : (
              <p className="text-sm font-extrabold text-neutral-900">
                {displayPrice != null
                  ? formatRupiah(displayPrice)
                  : "Lihat pilihan"}
              </p>
            )}
          </div>
          <button
            type="button"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-neutral-900 text-white transition-colors hover:bg-orange-500"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
