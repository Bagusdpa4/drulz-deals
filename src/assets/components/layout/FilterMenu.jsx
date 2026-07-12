import React, { useState } from "react";
import { Star, Coffee, CircleDashed, Cloud, Leaf } from "lucide-react";

const FILTERS = [
  { id: "tomoro-signature", label: "Tomoro Signature", icon: Star },
  { id: "classic-coffee", label: "Classic Coffee", icon: Coffee },
  { id: "fruity-series", label: "Fruity Series", icon: CircleDashed },
  { id: "cloud-series", label: "Cloud Series", icon: Cloud },
  { id: "non-coffee", label: "Non Coffee", icon: Leaf },
];

export const FilterMenu = () => {
  const [active, setActive] = useState(FILTERS[0].id);

  return (
    <div className="scrollbar-none flex gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {FILTERS.map((filter) => {
        const Icon = filter.icon;
        const isActive = active === filter.id;
        return (
          <button
            key={filter.id}
            onClick={() => setActive(filter.id)}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors ${
              isActive
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "cursor-pointer border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
            }`}
          >
            <Icon
              size={16}
              className={
                isActive ? "fill-white text-white" : "text-neutral-500"
              }
            />
            {filter.label}
          </button>
        );
      })}
    </div>
  );
};
