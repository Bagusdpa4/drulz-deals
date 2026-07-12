import React from "react";
import { Plus, Gift } from "lucide-react";
import { formatRupiah } from "../../assets/lib/useCatalog";

export const BundlingCard = ({ bundle, onSelect }) => {
  let displayPrice = bundle.price;
  let priceLabel = "";
  if (bundle.type === "fixed_choice" && bundle.fixedOptions?.length) {
    displayPrice = Math.min(...bundle.fixedOptions.map((o) => o.price));
    priceLabel = "Mulai dari";
  } else if (bundle.type === "duo_pay_highest") {
    priceLabel = "Bayar termahal aja";
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] w-full bg-slate-100">
        <img src={bundle.image} alt={bundle.name} className="h-full w-full object-cover"
          onError={(e) => { e.currentTarget.style.display = "none"; }} loading="lazy" />
        <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-neutral-900 px-2 py-1 text-[10px] font-bold text-white">
          <Gift size={11} />Bundling
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-neutral-900">{bundle.name}</h3>
        {bundle.description && <p className="line-clamp-2 text-xs text-neutral-500">{bundle.description}</p>}
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            {priceLabel && <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">{priceLabel}</p>}
            <p className="text-sm font-extrabold text-neutral-900">
              {displayPrice != null ? formatRupiah(displayPrice) : "Lihat pilihan"}
            </p>
          </div>
          <button type="button" onClick={() => onSelect?.(bundle)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white transition-colors hover:bg-orange-500">
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};