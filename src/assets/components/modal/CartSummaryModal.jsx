import React, { useMemo, useState } from "react";
import {
  X,
  Minus,
  Plus,
  Trash2,
  Pencil,
  ShoppingBag,
  ChevronLeft,
  Zap,
} from "lucide-react";
import { formatRupiah } from "../../lib/useCatalog";
import { useBodyScrollLock } from "../../lib/useBodyScrollLock";
import {
  getNowHour,
  getNowMinute,
  HOUR_OPTIONS,
  MINUTE_OPTIONS,
  ScrollPicker,
} from "../ui/ScrollPicker";

// BARU: biaya kantong per brand
const KANTONG_PRICES = {
  chagee: 2000,
  janjijiwa: 5000,
  kopken: 6000,
};

const buildVariantSummary = (item) => {
  const parts = [];

  if (item.isBundling) {
    if (item.selectedFixedOption?.label)
      parts.push(item.selectedFixedOption.label);
    if (item.chosenProducts?.length) {
      parts.push(item.chosenProducts.map((p) => p.name).join(", "));
    }
  } else {
    if (item.selectedSize) parts.push(item.selectedSize);
    if (item.temperature === "hot") {
      parts.push("Hot");
    } else if (item.temperature === "ice" && !item.ice) {
      parts.push("Ice");
    }
    if (item.ice) parts.push(item.ice.replace("_", " "));
    if (item.sugar) parts.push(item.sugar.replace("_", " "));
    if (item.sweetness) parts.push(item.sweetness.replace("_", " "));
    if (item.dairy) parts.push(item.dairy.replace("_", " "));
    if (item.espresso && item.espresso !== "normal_shot") {
      parts.push(item.espresso.replace("_", " "));
    }
    if (item.toppings?.length) {
      parts.push(item.toppings.map((t) => t.name).join(", "));
    }
  }

  return parts.filter(Boolean).join(" • ");
};

export const CartSummaryModal = ({
  open,
  onClose,
  items = [],
  onUpdateQty,
  onRemoveItem,
  onEditItem,
  onCheckout,
}) => {
  useBodyScrollLock(open);

  const [step, setStep] = useState("review"); // "review" | "form"
  const [customerName, setCustomerName] = useState("");
  const [outlet, setOutlet] = useState("");
  const [globalNotes, setGlobalNotes] = useState("");
  const [pickupHour, setPickupHour] = useState("");
  const [pickupMinute, setPickupMinute] = useState("");
  const [useKantong, setUseKantong] = useState(false); // BARU

  const pickupTime =
    pickupHour && pickupMinute ? `${pickupHour}:${pickupMinute}` : "";

  const isFormValid =
    customerName.trim() !== "" && outlet.trim() !== "" && pickupTime !== "";

  // BARU: tentukan brand cart (semua item selalu 1 brand yang sama)
  const brandId = items[0]?.brandId ?? null;
  const kantongPrice = KANTONG_PRICES[brandId] ?? 0;
  const showKantongOption = kantongPrice > 0;
  const kantongFee = useKantong ? kantongPrice : 0;

  const itemsTotal = useMemo(
    () => items.reduce((sum, item) => sum + (item.finalPrice ?? 0), 0),
    [items],
  );

  const totalPrice = itemsTotal + kantongFee; // UBAH: total termasuk kantong

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + (item.qty ?? 1), 0),
    [items],
  );

  const handleClose = () => {
    setStep("review");
    setUseKantong(false); // BARU: reset toggle tiap modal ditutup
    onClose?.();
  };

  if (!open) return null;

  const isEmpty = items.length === 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-neutral-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={handleClose}
    >
      <div
        className="relative flex h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white sm:h-[80vh] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            {step === "form" && (
              <button
                type="button"
                onClick={() => setStep("review")}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-neutral-500 text-neutral-600 hover:bg-slate-100"
              >
                <ChevronLeft size={18} />
              </button>
            )}
            <h2 className="text-lg font-extrabold text-neutral-900">
              {step === "review" ? "Keranjang" : "Data Pemesanan"}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-neutral-400 bg-slate-200 text-neutral-600 shadow-sm transition-colors hover:bg-neutral-900 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-neutral-400">
              <ShoppingBag size={24} />
            </span>
            <p className="text-sm font-medium text-neutral-500">
              Keranjang kamu masih kosong
            </p>
          </div>
        ) : step === "review" ? (
          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-100/70 px-5 py-5">
            {items.map((item, index) => {
              const variantSummary = buildVariantSummary(item);
              return (
                <div
                  key={index}
                  className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-3"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>

                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="flex flex-wrap items-center gap-1.5 text-sm font-bold leading-snug text-neutral-900">
                        {item.name}
                        {item.isPromo && (
                          <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                            <Zap size={9} />
                            PROMO Terbatas
                          </span>
                        )}
                      </p>
                      <div className="flex shrink-0 items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => onEditItem?.(index)}
                          className="cursor-pointer text-neutral-400 transition-colors hover:text-neutral-900"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveItem?.(index)}
                          className="cursor-pointer text-neutral-400 transition-colors hover:text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {variantSummary && (
                      <p className="line-clamp-2 text-xs text-neutral-500">
                        {variantSummary}
                      </p>
                    )}

                    {item.notes && (
                      <p className="text-xs italic text-neutral-400">
                        "{item.notes}"
                      </p>
                    )}

                    <div className="mt-1 flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full border border-slate-300 px-1.5 py-1">
                        <button
                          type="button"
                          onClick={() =>
                            item.qty <= 1
                              ? onRemoveItem?.(index)
                              : onUpdateQty?.(index, item.qty - 1)
                          }
                          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-neutral-700 hover:bg-slate-200"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-4 text-center text-sm font-bold text-neutral-900">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty?.(index, item.qty + 1)}
                          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-neutral-700 hover:bg-slate-200"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-extrabold text-orange-600">
                        {formatRupiah(item.finalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* BARU: opsi kantong */}
            {showKantongOption && (
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3.5">
                <div>
                  <p className="text-sm font-bold text-neutral-900">Kantong</p>
                  <p className="text-xs font-bold text-orange-600">
                    +{formatRupiah(kantongPrice)}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={useKantong}
                  onClick={() => setUseKantong((prev) => !prev)}
                  className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                    useKantong ? "bg-neutral-900" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                      useKantong ? "translate-x-0" : "-translate-x-5"
                    }`}
                  />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            <div className="rounded-2xl bg-slate-100/70 px-4 py-3 text-sm">
              <span className="font-medium text-neutral-500">
                {totalItems} item
                {useKantong && showKantongOption ? " + Kantong" : ""}
              </span>
              <span className="mx-1.5 text-neutral-300">•</span>
              <span className="font-bold text-neutral-900">
                {formatRupiah(totalPrice)}
              </span>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-neutral-500">
                Nama Customer
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nama kamu"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-neutral-500">
                Outlet Tujuan
              </label>
              <input
                type="text"
                value={outlet}
                onChange={(e) => setOutlet(e.target.value)}
                placeholder="Nama outlet sesuai google maps"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-neutral-500">
                Jam Pengambilan
              </label>
              <div className="flex gap-2">
                <ScrollPicker
                  value={pickupHour}
                  options={HOUR_OPTIONS}
                  onChange={setPickupHour}
                  placeholder="Jam"
                  defaultValue={getNowHour()}
                />
                <ScrollPicker
                  value={pickupMinute}
                  options={MINUTE_OPTIONS}
                  onChange={setPickupMinute}
                  placeholder="Menit"
                  defaultValue={getNowMinute()}
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-neutral-500">
                Catatan (untuk semua produk)
              </label>
              <textarea
                value={globalNotes}
                onChange={(e) => setGlobalNotes(e.target.value)}
                rows={4}
                placeholder="Contoh: semua minuman less sugar, dll"
                className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Footer */}
        {!isEmpty && (
          <div className="border-t border-slate-100 bg-white px-5 py-4">
            {step === "review" ? (
              <>
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="font-medium text-neutral-500">
                    Total ({totalItems} item)
                  </span>
                  <span className="text-base font-extrabold text-neutral-900">
                    {formatRupiah(totalPrice)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="flex w-full cursor-pointer items-center justify-center rounded-full bg-neutral-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-500"
                >
                  Lanjut ke Data Pemesanan
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() =>
                  onCheckout?.({
                    customerName,
                    outlet,
                    pickupTime,
                    globalNotes,
                    useKantong,
                    kantongFee,
                    totalPrice,
                  })
                }
                disabled={!isFormValid}
                className="flex w-full cursor-pointer items-center justify-center rounded-full bg-neutral-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-neutral-900"
              >
                {isFormValid ? "Checkout" : "Lengkapi data dulu"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
