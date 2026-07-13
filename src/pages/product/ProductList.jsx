import React, { useState } from "react";
import { ProductCard } from "./ProductCard";
import { BundlingCard } from "./BundlingCard";
import {
  getBundlingProducts,
  getFlattenedSatuanProducts,
  searchBundlingProducts,
  searchFlattenedSatuanProducts,
} from "../../assets/lib/useCatalog";
import { BundlingOptionModal } from "../../assets/components/modal/BundlingOptionModal";

export const ProductList = ({
  selectedBrandId,
  mode,
  activeFilter = "all",
  searchQuery = "",
  onAddToCart,
}) => {
  const [activeBundle, setActiveBundle] = useState(null);

  if (!selectedBrandId) return null;

  if (mode === "bundling") {
    const bundles = searchQuery
      ? searchBundlingProducts(selectedBrandId, searchQuery)
      : getBundlingProducts(selectedBrandId);

    if (bundles.length === 0) {
      return (
        <p className="mt-10 mb-8 text-center text-sm text-neutral-400">
          {searchQuery
            ? `Paket bundling "${searchQuery}" tidak ditemukan.`
            : "Belum ada paket bundling untuk brand ini."}
        </p>
      );
    }
    return (
      <section className="mb-6 mt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {bundles.map((bundle) => (
            <BundlingCard
              key={bundle.id}
              bundle={bundle}
              onSelect={setActiveBundle}
            />
          ))}
        </div>

        <BundlingOptionModal
          open={!!activeBundle}
          bundle={activeBundle}
          onClose={() => setActiveBundle(null)}
          onAdd={onAddToCart}
        />
      </section>
    );
  }

  const allSections = searchQuery
    ? searchFlattenedSatuanProducts(selectedBrandId, searchQuery)
    : getFlattenedSatuanProducts(selectedBrandId);

  const sections =
    activeFilter === "all"
      ? allSections
      : allSections.filter((s) => s.groupKey === activeFilter);

  if (sections.length === 0) {
    return (
      <p className="text-center mb-8 text-sm text-neutral-400">
        {searchQuery
          ? `Menu "${searchQuery}" tidak ditemukan.`
          : "Belum ada produk untuk brand ini."}
      </p>
    );
  }

  return (
    <div className="mt-6 space-y-8 pb-6">
      {sections.map((section) => (
        <section key={section.groupKey}>
          <h2 className="text-md mb-3 font-bold uppercase text-neutral-900">
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
