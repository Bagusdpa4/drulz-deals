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
import { ConfirmDialog } from "../assets/components/ui/ConfirmDialog";
import {
  buildWhatsAppOrderMessage,
  sendWhatsAppOrder,
} from "../assets/lib/waOrderMessage";

export const Homepage = () => {
  const productListRef = useRef(null);
  const [selectedBrandId, setSelectedBrandId] = useState(DEFAULT_BRAND_ID);
  const [mode, setMode] = useState("satuan");
  const [cart, setCart] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState(""); // BARU
  const [pendingBrandId, setPendingBrandId] = useState(null);

  const applyBrandChange = (brandId) => {
    setSelectedBrandId(brandId);
    setMode("satuan");
    setActiveFilter("all");
    setSearchQuery(""); // BARU: reset search saat ganti brand
  };

  const handleSelectBrand = (brandId) => {
    if (brandId === selectedBrandId) return;
    const cartHasOtherBrand = cart.some((item) => item.brandId !== brandId);
    if (cart.length > 0 && cartHasOtherBrand) {
      setPendingBrandId(brandId);
      return;
    }
    applyBrandChange(brandId);
  };

  const confirmBrandChange = () => {
    setCart([]);
    applyBrandChange(pendingBrandId);
    setPendingBrandId(null);
  };

  const cancelBrandChange = () => setPendingBrandId(null);

  const handleChangeMode = (newMode) => {
    setMode(newMode);
    setActiveFilter("all");
  };

  // BARU: saat user mengetik pencarian, reset filter kategori ke "Semua"
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setActiveFilter("all");
  };

  const handleAddToCart = (item) => {
    setCart((prev) => [
      ...prev,
      { ...item, qty: item.qty ?? 1, brandId: selectedBrandId },
    ]);
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

  const handleUpdateQty = (index, newQty) => {
    setCart((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              qty: newQty,
              finalPrice: (item.unitPrice ?? 0) * newQty,
            }
          : item,
      ),
    );
  };

  const handleEditCartItem = (index, updatedItem) => {
    setCart((prev) =>
      prev.map((item, i) =>
        i === index ? { ...updatedItem, brandId: item.brandId } : item,
      ),
    );
  };

  const handleRemoveItem = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCheckout = (formData) => {
    const message = buildWhatsAppOrderMessage({
      cart,
      brandLabel: selectedBrandId,
      formData,
    });
    sendWhatsAppOrder(message);
    setCart([]);
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
          <SearchMenu
            selectedBrandId={selectedBrandId}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
        </div>
        {mode === "satuan" && (
          <div className="sticky top-0 z-30 -mx-4 bg-slate-100/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
            <FilterMenu
              selectedBrandId={selectedBrandId}
              activeFilter={activeFilter}
              onChangeFilter={handleChangeFilter}
              searchQuery={searchQuery}
            />
          </div>
        )}
        <div ref={productListRef} className="scroll-mt-20">
          <ProductList
            selectedBrandId={selectedBrandId}
            mode={mode}
            activeFilter={activeFilter}
            searchQuery={searchQuery}
            onAddToCart={handleAddToCart}
          />
        </div>
        <Footer />
      </div>
      <ScrollToTopButton />
      <FloatingCartButton
        items={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onEditCartItem={handleEditCartItem}
        onCheckout={handleCheckout}
      />
      <ConfirmDialog
        open={!!pendingBrandId}
        title="Ganti Brand?"
        message="Keranjang kamu masih ada item dari brand lain. Ganti brand akan mengosongkan keranjang."
        onConfirm={confirmBrandChange}
        onCancel={cancelBrandChange}
      />
    </div>
  );
};
