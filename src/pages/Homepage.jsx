import React, { useRef, useState } from "react";
import { Navbar } from "../assets/components/layout/Navbar";
import { HeroSection } from "../assets/components/layout/HeroSection";
import {
  BrandList,
  DEFAULT_BRAND_ID,
} from "../assets/components/layout/BrandList";
import { SearchMenu } from "../assets/components/layout/SearchMenu";
import { FilterMenu } from "../assets/components/layout/FilterMenu";
import { ModeTabs } from "../assets/components/layout/ModeTabs";
import { ProductList } from "./product/ProductList";
import { ScrollToTopButton } from "../assets/components/layout/ScrollToTopButton";
import { FloatingCartButton } from "../assets/components/layout/FloatingCartButton";
import { Footer } from "../assets/components/layout/Footer";

export const Homepage = () => {
  const productListRef = useRef(null);
  const [selectedBrandId, setSelectedBrandId] = useState(DEFAULT_BRAND_ID);
  const [mode, setMode] = useState("satuan");
  const [cart, setCart] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  const handleSelectBrand = (brandId) => {
    setSelectedBrandId(brandId);
    setMode("satuan");
    setActiveFilter("all");
  };

  const handleChangeMode = (newMode) => {
    setMode(newMode);
    setActiveFilter("all");
  };

  const handleAddToCart = (item) => {
    setCart((prev) => [...prev, { ...item, qty: 1 }]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.finalPrice ?? item.price ?? 0) * item.qty,
    0,
  );

  const handleChangeFilter = (filterId) => {
    setActiveFilter(filterId);
    productListRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleOpenCart = () => {
    // TODO: buka drawer/modal keranjang
    console.log("Open cart:", cart);
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-12">
      <Navbar />
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:w-[80%] lg:px-0">
        <HeroSection />
        <BrandList selected={selectedBrandId} onSelect={handleSelectBrand} />
        <ModeTabs
          selectedBrandId={selectedBrandId}
          mode={mode}
          onChangeMode={handleChangeMode}
        />
        <div className="mb-4 mt-6 sm:mt-8">
          <SearchMenu selectedBrandId={selectedBrandId} />
        </div>
        {mode === "satuan" && (
          <div className="sticky top-0 z-30 -mx-4 bg-slate-100/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
            <FilterMenu
              selectedBrandId={selectedBrandId}
              activeFilter={activeFilter}
              onChangeFilter={handleChangeFilter}
            />
          </div>
        )}
        <div ref={productListRef} className="scroll-mt-20">
          <ProductList
            selectedBrandId={selectedBrandId}
            mode={mode}
            activeFilter={activeFilter}
            onAddToCart={handleAddToCart}
          />
        </div>
        <Footer />
      </div>
      <ScrollToTopButton />
      <FloatingCartButton
        itemCount={totalItems}
        totalPrice={totalPrice}
        onClick={handleOpenCart}
      />
    </div>
  );
};
