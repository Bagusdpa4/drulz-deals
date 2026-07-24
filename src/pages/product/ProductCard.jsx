import React, { useState } from "react";
import { Plus, Flame, Zap } from "lucide-react";
import { formatRupiah } from "../../assets/lib/useCatalog";
import {
  getEffectivePrice,
  formatPromoRange,
} from "../../assets/lib/promoUtils";
import { ProductOptionModal } from "../../assets/components/modal/ProductOptionModal";
import { highlightQuotedText } from "../../assets/lib/highlightText";

export const ProductCard = ({ product, onAdd }) => {
  const [showOptions, setShowOptions] = useState(false);

  const sizeKeys = product.sizes ? Object.keys(product.sizes) : [];
  const [previewSize, setPreviewSize] = useState(sizeKeys[0] ?? null);
  const activePrice = getEffectivePrice(product, previewSize);
  const discountPercent =
    activePrice?.price && activePrice?.discPrice
      ? Math.round(100 - (activePrice.discPrice / activePrice.price) * 100)
      : 0;

  return (
    <>
      <div className="flex flex-col overflow-hidden rounded-2xl border border-neutral-300 bg-slate-100/70 shadow-lg transition-shadow hover:shadow-xl">
        <div
          onClick={() => setShowOptions(true)}
          className="relative flex aspect-square h-40 w-full cursor-pointer items-center justify-center bg-white p-3 sm:h-60"
        >
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            loading="lazy"
          />
          {activePrice.isPromo ? (
            <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-red-500 px-2 py-1 text-[10px] font-bold text-white">
              <Zap size={11} />
              PROMO TERBATAS
            </span>
          ) : (
            discountPercent > 0 && (
              <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-orange-500 px-2 py-1 text-[10px] font-bold text-white">
                <Flame size={11} />
                {discountPercent}%
              </span>
            )
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-3">
          <h3
            onClick={() => setShowOptions(true)}
            className="text-md line-clamp-2 cursor-pointer font-semibold leading-snug text-neutral-900"
          >
            {highlightQuotedText(product.name)}
          </h3>
          {activePrice.isPromo && (
            <p className="text-[10px] font-bold text-red-500">
              Berlaku {formatPromoRange(product.promo)}
            </p>
          )}

          {sizeKeys.length > 1 && (
            <div className="flex gap-1.5">
              {sizeKeys.map((size) => (
                <button
                  key={size}
                  onClick={() => setPreviewSize(size)}
                  className={`cursor-pointer rounded-full border px-2.5 py-1 text-[12px] font-bold transition-colors ${
                    previewSize === size
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-slate-400 bg-white text-neutral-500"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}

          <div className="mt-auto flex items-end justify-between gap-2 pt-1">
            <div>
              <p className="text-sm font-extrabold text-neutral-900">
                {formatRupiah(activePrice?.discPrice)}
              </p>
              {activePrice?.discPrice !== activePrice?.price && (
                <p className="text-[11px] text-neutral-400 line-through">
                  {formatRupiah(activePrice?.price)}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowOptions(true)}
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-neutral-900 text-white transition-colors hover:bg-orange-500"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      <ProductOptionModal
        open={showOptions}
        onClose={() => setShowOptions(false)}
        product={product}
        onAdd={onAdd}
      />
    </>
  );
};
