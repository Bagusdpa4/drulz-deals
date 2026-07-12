import React from "react";
import { LayoutGrid } from "lucide-react";
import { getSatuanCategories } from "../../lib/useCatalog";

export const FilterMenu = ({
  selectedBrandId,
  activeFilter,
  onChangeFilter,
}) => {
  const categories = getSatuanCategories(selectedBrandId);
  if (categories.length === 0) return null;

  const filters = [{ id: "all", label: "Semua" }, ...categories];

  return (
    <div className="scrollbar-none flex md:justify-center gap-2.5 overflow-x-auto pb-1 px-2 py-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        return (
          <button
            key={filter.id}
            onClick={() => onChangeFilter(filter.id)}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold uppercase tracking-wide shadow-sm transition-colors ${
              isActive
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "cursor-pointer border-slate-300 bg-white text-neutral-600 hover:scale-105 hover:border-orange-300"
            }`}
          >
            <LayoutGrid
              size={16}
              className={isActive ? "text-white" : "text-neutral-500"}
            />
            {filter.label}
          </button>
        );
      })}
    </div>
  );
};
