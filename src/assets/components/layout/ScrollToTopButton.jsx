import React, { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export const ScrollToTopButton = ({ threshold = 400 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > threshold);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll ke atas"
      className="fixed bottom-6 left-6 z-40 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition-transform hover:scale-105 hover:bg-neutral-700"
    >
      <ChevronUp size={22} />
    </button>
  );
};
