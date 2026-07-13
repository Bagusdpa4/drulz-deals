import React from "react";
import { ShoppingCart } from "lucide-react";
import { formatRupiah } from "../../lib/useCatalog";

export const FloatingCartButton = ({
  itemCount = 0,
  totalPrice = 0,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 flex cursor-pointer items-center gap-2.5 rounded-full bg-neutral-900 py-3 pl-4 pr-5 text-white shadow-lg transition-transform hover:scale-105 hover:bg-neutral-700"
    >
      <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-orange-500">
        <ShoppingCart size={16} />
        {itemCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-neutral-900">
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        )}
      </span>
      <span className="text-sm font-bold">
        {itemCount} Menu &bull; {formatRupiah(totalPrice)}
      </span>
    </button>
  );
};
