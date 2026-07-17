import React, { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, MessageSquareQuote } from "lucide-react";
import { useBodyScrollLock } from "../../lib/useBodyScrollLock";

const PAGE_SIZE = 10;

export const TestimonialModal = ({ open, onClose, testimonials = [] }) => {
  useBodyScrollLock(open);

  const [activeIndex, setActiveIndex] = useState(null);
  const [page, setPage] = useState(0);
  const lightboxOpen = activeIndex !== null;

  const totalPages = Math.ceil(testimonials.length / PAGE_SIZE);
  const pageItems = testimonials.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE,
  );

  const goPrev = () =>
    setActiveIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  const goNext = () => setActiveIndex((i) => (i + 1) % testimonials.length);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, testimonials.length]);

  // Reset lightbox setiap kali modal galeri ditutup
  useEffect(() => {
    if (!open) {
      setActiveIndex(null);
      setPage(0);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-neutral-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[75vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white sm:max-h-[80vh] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-white">
              <MessageSquareQuote size={16} />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-neutral-900">
                Testimoni Customer
              </h2>
              <p className="text-xs font-semibold text-neutral-500">
                {testimonials.length} testimoni
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-slate-200 text-neutral-600 transition-colors hover:bg-neutral-900 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Grid thumbnail */}
        <div className="flex-1 overflow-y-auto bg-slate-100/70 px-5 py-5">
          {testimonials.length === 0 ? (
            <p className="mt-8 text-center text-sm text-neutral-400">
              Belum ada testimoni.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {pageItems.map((item, i) => {
                  const globalIndex = page * PAGE_SIZE + i;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveIndex(globalIndex)}
                      className="aspect-3/4 group relative overflow-hidden rounded-xl border border-neutral-300 bg-white"
                    >
                      <img
                        src={item.image_url}
                        alt={`Testimoni ${globalIndex + 1}`}
                        className="h-full w-full cursor-pointer object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </button>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-neutral-300 text-neutral-600 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs font-semibold text-neutral-500">
                    {page + 1} / {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setPage((p) => Math.min(totalPages - 1, p + 1))
                    }
                    disabled={page === totalPages - 1}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-neutral-300 text-neutral-600 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Lightbox full-size */}
      {lightboxOpen && (
        <div
          className="z-60 fixed inset-0 flex items-center justify-center bg-black/90 p-4"
          onClick={(e) => {
            e.stopPropagation();
            setActiveIndex(null);
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex(null);
            }}
            className="absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X size={20} />
          </button>

          {testimonials.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-3 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          <div
            className="flex max-h-[75vh] max-w-[70vw] flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={testimonials[activeIndex].image_url}
              alt={`Testimoni ${activeIndex + 1}`}
              className="max-h-[75vh] max-w-[75vw] rounded-xl object-contain"
            />
            <p className="mt-3 text-xs text-white/40">
              {activeIndex + 1} / {testimonials.length}
            </p>
          </div>

          {testimonials.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-3 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
