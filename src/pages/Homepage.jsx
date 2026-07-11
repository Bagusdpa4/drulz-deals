// Homepage.jsx
import React from "react";
import { Navbar } from "../assets/components/layout/Navbar";
import { HeroSection } from "../assets/components/layout/HeroSection";
import { BrandList } from "../assets/components/layout/BrandList";

export const Homepage = () => {
  return (
    <div className="min-h-screen bg-slate-100 pb-12">
      <Navbar />
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:w-[80%] lg:px-0">
        <HeroSection />
        <BrandList />
      </div>
    </div>
  );
};
