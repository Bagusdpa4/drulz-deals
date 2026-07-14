import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { formatRupiah } from "../../lib/useCatalog";
import { CartSummaryModal } from "../modal/CartSummaryModal";
import { ProductOptionModal } from "../modal/ProductOptionModal";
import { BundlingOptionModal } from "../modal/BundlingOptionModal";

export const FloatingCartButton = ({
  items = [],
  onUpdateQty,
  onRemoveItem,
  onEditCartItem,
  onCheckout,
}) => {
  const [cartOpen, setCartOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const itemCount = items.reduce((sum, item) => sum + (item.qty ?? 1), 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.finalPrice ?? 0),
    0,
  );

  if (itemCount === 0) return null;

  const editingItem = editingIndex !== null ? items[editingIndex] : null;
  const isEditingBundle = !!editingItem?.isBundling;

  return (
    <>
      <button
        type="button"
        onClick={() => setCartOpen(true)}
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

      <CartSummaryModal
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={items}
        onUpdateQty={onUpdateQty}
        onRemoveItem={onRemoveItem}
        onEditItem={(index) => setEditingIndex(index)}
        onCheckout={onCheckout}
      />

      <ProductOptionModal
        open={editingIndex !== null}
        onClose={() => setEditingIndex(null)}
        product={editingItem?.sourceProduct ?? editingItem}
        editItem={editingItem}
        onAdd={(updatedItem) => {
          onEditCartItem?.(editingIndex, updatedItem);
          setEditingIndex(null);
        }}
      />

      <BundlingOptionModal
        open={editingIndex !== null && isEditingBundle}
        onClose={() => setEditingIndex(null)}
        bundle={editingItem?.sourceBundle}
        editItem={editingItem}
        onAdd={(updatedItem) => {
          onEditCartItem?.(editingIndex, updatedItem);
          setEditingIndex(null);
        }}
      />
    </>
  );
};
