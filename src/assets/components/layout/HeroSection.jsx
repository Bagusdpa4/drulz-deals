// HeroSection.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, CheckSquare, MessageSquareQuote } from "lucide-react";
import { GuideOrder } from "../modal/GuideOrder";
import { TestimonialModal } from "../modal/TestimonialModal";
import { getTestimonials } from "../../lib/useTestimonials";

export const HeroSection = () => {
  const [showGuide, setShowGuide] = useState(false);
  const [showTestimonial, setShowTestimonial] = useState(false);
  const navigate = useNavigate();

  const testimonials = getTestimonials();

  return (
    <section className="px-0 pt-4 sm:px-5 sm:pt-6">
      <div className="relative overflow-hidden rounded-2xl bg-orange-100 shadow-sm sm:rounded-3xl">
        <div className="flex flex-col items-center gap-6 px-5 py-6 sm:px-8 sm:py-8 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          {/* Left: text content */}
          <div className="w-full text-center lg:max-w-lg lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[12px] font-bold text-orange-600 shadow-sm sm:px-3 sm:text-xs">
              <Flame size={14} />
              PROMO SPESIAL
            </span>

            <h1 className="mt-3 text-xl font-extrabold leading-tight sm:text-3xl md:text-4xl">
              <span className="block text-neutral-900">
                Semua Promo, Satu Tempat.
              </span>
              <span className="block text-orange-500">
                Coffee &bull; Tea &bull; Food &bull; Deals
              </span>
            </h1>

            <p className="mt-2 text-sm font-medium text-neutral-500 sm:text-base">
              * Harga tertera sudah termasuk fee
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-2.5 sm:gap-3 lg:justify-start">
              <button
                onClick={() => setShowGuide(true)}
                className="flex cursor-pointer items-center gap-1.5 rounded-full border bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 sm:gap-2 sm:px-5 sm:py-3"
              >
                <CheckSquare size={16} className="animate-bounce" />
                Cara Pemesanan
              </button>
              <button
                onClick={() => setShowTestimonial(true)}
                className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 transition-transform hover:scale-105 hover:border-orange-300 sm:gap-2 sm:px-5 sm:py-3"
              >
                <MessageSquareQuote size={16} />
                Testimonial
              </button>
            </div>
          </div>

          {/* Right: image */}
          <div className="max-w-70 w-full shrink-0 sm:max-w-xs lg:w-auto lg:max-w-sm">
            <img
              src="/hero.png"
              alt="Promo Drulz Deals"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </div>

      <GuideOrder
        open={showGuide}
        onClose={() => setShowGuide(false)}
        onOrderNow={() => {
          setShowGuide(false);
          navigate("/");
        }}
      />

      <TestimonialModal
        open={showTestimonial}
        onClose={() => setShowTestimonial(false)}
        testimonials={testimonials}
      />
    </section>
  );
};
