import React, { useState } from "react";
import { MessageSquareQuote } from "lucide-react";
import { TestimonialModal } from "../modal/TestimonialModal";
import { getTestimonials } from "../../lib/useTestimonials";

export const TestimonialButton = () => {
  const [open, setOpen] = useState(false);
  const testimonials = getTestimonials();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900"
      >
        <MessageSquareQuote size={16} />
        Testimoni
      </button>

      <TestimonialModal
        open={open}
        onClose={() => setOpen(false)}
        testimonials={testimonials}
      />
    </>
  );
};