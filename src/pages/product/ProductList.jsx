import React from "react";
import { ProductCard } from "./ProductCard";
import { BundlingCard } from "./BundlingCard";
import {
  getBundlingProducts,
  getFlattenedSatuanProducts,
} from "../../assets/lib/useCatalog";

export const ProductList = ({
  selectedBrandId,
  mode,
  activeFilter = "all",
  onAddToCart,
}) => {
  if (!selectedBrandId) return null;

  if (mode === "bundling") {
    const bundles = getBundlingProducts(selectedBrandId);
    if (bundles.length === 0) {
      return (
        <p className="mt-8 text-center text-sm text-neutral-400">
          Belum ada paket bundling untuk brand ini.
        </p>
      );
    }
    return (
      <section className="mt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {bundles.map((bundle) => (
            <BundlingCard
              key={bundle.id}
              bundle={bundle}
              onSelect={onAddToCart}
            />
          ))}
        </div>
      </section>
    );
  }

  const allSections = getFlattenedSatuanProducts(selectedBrandId);
  const sections =
    activeFilter === "all"
      ? allSections
      : allSections.filter((s) => s.groupKey === activeFilter);

  if (sections.length === 0) {
    return (
      <p className="mt-8 text-center text-sm text-neutral-400">
        Belum ada produk untuk brand ini.
      </p>
    );
  }

  return (
    <div className="mt-6 space-y-8 pb-6">
      {sections.map((section) => (
        <section key={section.groupKey}>
          <h2 className="mb-3 text-sm font-bold text-neutral-900 sm:text-base">
            {section.groupLabel}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {section.items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={onAddToCart}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
