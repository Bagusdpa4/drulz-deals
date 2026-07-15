import React, { useEffect } from "react";
import { List, Gift, Coffee } from "lucide-react";
import { getAvailableModes, getBrandModeConfig } from "../../lib/useCatalog";

export const ModeTabs = ({ selectedBrandId, mode, onChangeMode }) => {
  const modeConfig = getBrandModeConfig(selectedBrandId);
  const isVariantBrand = modeConfig.type === "variants";

  const { hasSatuan, hasBundling } = getAvailableModes(selectedBrandId);

  // set default mode otomatis
  useEffect(() => {
    if (isVariantBrand) {
      const validIds = modeConfig.variants.map((v) => v.id);
      if (!validIds.includes(mode)) {
        onChangeMode(modeConfig.variants[0]?.id);
      }
    } else if (mode === "bundling" && !hasBundling) {
      onChangeMode("satuan");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBrandId]);

  // ==== BRAND BERTIPE VARIANTS (misal Janji Jiwa) ====
  if (isVariantBrand) {
    if (modeConfig.variants.length < 2) return null;

    return (
      <div className="mt-6 flex justify-center gap-4 sm:mt-10">
        {modeConfig.variants.map((v) => (
          <button
            key={v.id}
            onClick={() => onChangeMode(v.id)}
            className={`flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold shadow-sm transition-colors sm:w-[35%] ${
              mode === v.id
                ? "bg-neutral-900 text-white"
                : "cursor-pointer border border-slate-300 bg-white text-neutral-600 hover:scale-105 hover:border-orange-300"
            }`}
          >
            <Coffee size={16} />
            {v.label}
          </button>
        ))}
      </div>
    );
  }

  // ==== BRAND STANDAR (satuan / bundling) — logika lama, tidak berubah ====
  if (hasSatuan && !hasBundling) return null;
  if (!hasSatuan && !hasBundling) return null;

  return (
    <div className="mt-6 flex justify-center gap-4 sm:mt-10">
      {hasSatuan && (
        <button
          onClick={() => onChangeMode("satuan")}
          className={`flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold shadow-sm transition-colors sm:w-[35%] ${
            mode === "satuan"
              ? "bg-neutral-900 text-white"
              : "cursor-pointer border border-slate-300 bg-white text-neutral-600 hover:scale-105 hover:border-orange-300"
          }`}
        >
          <List size={16} />
          Satuan
        </button>
      )}
      {hasBundling && (
        <button
          onClick={() => onChangeMode("bundling")}
          className={`flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold shadow-sm transition-colors sm:w-[35%] ${
            mode === "bundling"
              ? "bg-neutral-900 text-white"
              : "cursor-pointer border border-slate-300 bg-white text-neutral-500 hover:scale-105 hover:border-orange-300"
          }`}
        >
          <Gift size={16} />
          Bundling
        </button>
      )}
    </div>
  );
};
