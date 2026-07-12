// Homepage.jsx
import React, { useState } from "react";
import { Navbar } from "../assets/components/layout/Navbar";
import { HeroSection } from "../assets/components/layout/HeroSection";
import {
  BrandList,
  DEFAULT_BRAND_ID,
} from "../assets/components/layout/BrandList";
import { SearchMenu } from "../assets/components/layout/SearchMenu";
import { FilterMenu } from "../assets/components/layout/FilterMenu";

export const Homepage = () => {
  const [selectedBrandId, setSelectedBrandId] = useState(DEFAULT_BRAND_ID);
  return (
    <div className="min-h-screen bg-slate-100 pb-12">
      <Navbar />
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:w-[80%] lg:px-0">
        <HeroSection />
        <BrandList selected={selectedBrandId} onSelect={setSelectedBrandId} />
        <div className="mt-6 sm:mt-8">
          <SearchMenu selectedBrandId={selectedBrandId} />
        </div>
        <div className="mt-4">
          <FilterMenu />
        </div>
      </div>
    </div>
  );
};
