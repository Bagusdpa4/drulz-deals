import React, { useMemo, useState } from "react";
import { X, Minus, Plus, Flame, Snowflake } from "lucide-react";
import { formatRupiah } from "../../lib/useCatalog";

const ICE_LEVELS = [
  { id: "normal_ice", label: "Normal Ice" },
  { id: "less_ice", label: "Less Ice" },
  { id: "no_ice", label: "No Ice" },
];

const SUGAR_LEVELS = [
  { id: "normal_sugar", label: "Normal Sugar" },
  { id: "less_sugar", label: "Less Sugar" },
  { id: "no_sugar", label: "No Sugar" },
];

const ESPRESSO_LABELS = {
  no_coffee: "No Coffee",
  normal_shot: "Normal Shot",
  plus_1_shot: "+1 Shot",
  plus_2_shot: "+2 Shot",
};

// Ketentuan #5: surcharge khusus espresso shot (saat ini hanya dipakai brand Fore)
const ESPRESSO_SURCHARGE = {
  no_coffee: 0,
  normal_shot: 0,
  plus_1_shot: 7000,
  plus_2_shot: 14000,
};

const DAIRY_LABELS = {
  milk: "Fresh Milk",
  soy_multigrain: "Soy Multigrain",
  oat_milk: "Oat Milk",
  almond_milk: "Almond Milk",
};

// Ketentuan #5: surcharge khusus pilihan susu (saat ini hanya dipakai brand Fore)
const DAIRY_SURCHARGE = {
  milk: 0,
  soy_multigrain: 7000,
  oat_milk: 15000,
  almond_milk: 15000,
};

const SWEETNESS_LABELS = {
  normal_sweet: "Normal Sweet",
  less_sweet: "Less Sweet",
  slightly_sweet: "Slightly Sweet",
  no_sugar: "No Sugar",
};

// Field-field ini hanya muncul pada item minuman di JSON.
// Kalau produk tidak punya satupun field ini, dianggap makanan/snack.
const DRINK_INDICATOR_KEYS = [
  "sizes",
  "noHot",
  "noIce",
  "noSugar",
  "allowedEspresso",
  "allowedDairy",
  "allowedSweet",
  "sweetness",
];

const isDrinkProduct = (product) =>
  DRINK_INDICATOR_KEYS.some((key) => product?.[key] !== undefined);

// Kategori "Foreveryone 1L" ditandai dengan field "sweetness" (lowercase),
// beda dari "allowedSweet" yang dipakai minuman satuan biasa.
const isForeveryone1LProduct = (product) => Array.isArray(product?.sweetness);

// Batas maksimal karakter untuk kolom "Catatan"
const NOTES_MAX_LENGTH = 250;

const OptionGroup = ({ label, children }) => (
  <div>
    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-neutral-500">
      {label}
    </p>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
);

const OptionPill = ({ active, onClick, children, extra }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors ${
      active
        ? "border-neutral-900 bg-neutral-900 text-white"
        : "cursor-pointer border-slate-300 bg-white text-neutral-600 hover:border-orange-400"
    }`}
  >
    <span>{children}</span>
    {extra && (
      <span
        className={`text-[10px] font-bold ${
          active ? "text-white/80" : "text-orange-500"
        }`}
      >
        {extra}
      </span>
    )}
  </button>
);

export const ProductOptionModal = ({ open, onClose, product, onAdd }) => {
  const isDrink = isDrinkProduct(product);
  const isForeveryone1L = isForeveryone1LProduct(product);

  const sizeKeys = product?.sizes ? Object.keys(product.sizes) : [];
  const [selectedSize, setSelectedSize] = useState(sizeKeys[0] ?? null);

  // Ketentuan hot/ice — dimatikan total untuk Foreveryone 1L
  const forcedIced = !!product?.noHot;
  const forcedHot = !!product?.noIce;
  const showTempSelector =
    isDrink && !isForeveryone1L && !forcedIced && !forcedHot;

  const [temp, setTemp] = useState(
    forcedIced ? "ice" : forcedHot ? "hot" : "ice",
  );
  const effectiveTemp = forcedIced ? "ice" : forcedHot ? "hot" : temp;

  const showIceLevel = isDrink && !isForeveryone1L && effectiveTemp === "ice";
  const showSugar = isDrink && !isForeveryone1L && !product?.noSugar;

  // Untuk Foreveryone 1L, espresso & dairy TIDAK ditampilkan & TIDAK dikenakan biaya,
  // meskipun datanya ada di JSON (mengikuti ketentuan: modal hanya Sweet Level + Catatan)
  const showEspresso = !isForeveryone1L && product?.allowedEspresso?.length > 0;
  const showDairy = !isForeveryone1L && product?.allowedDairy?.length > 0;

  // Sumber pilihan sweet level: "sweetness" (Foreveryone 1L) atau "allowedSweet" (minuman biasa)
  const sweetOptions = isForeveryone1L
    ? (product?.sweetness ?? [])
    : (product?.allowedSweet ?? []);

  const [ice, setIce] = useState("normal_ice");
  const [sugar, setSugar] = useState("normal_sugar");
  const [espresso, setEspresso] = useState(
    !isForeveryone1L ? (product?.allowedEspresso?.[0] ?? null) : null,
  );
  const [dairy, setDairy] = useState(
    !isForeveryone1L ? (product?.allowedDairy?.[0] ?? null) : null,
  );
  const [sweetness, setSweetness] = useState(sweetOptions[0] ?? null);
  const [toppings, setToppings] = useState([]);
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");

  const activePrice = useMemo(() => {
    if (!product) return { price: 0, discPrice: 0 };
    return product.sizes
      ? product.sizes[selectedSize]
      : { price: product.price, discPrice: product.discPrice };
  }, [product, selectedSize]);

  const toppingsTotal = useMemo(
    () => toppings.reduce((sum, t) => sum + t.price, 0),
    [toppings],
  );

  // Surcharge espresso/dairy tidak berlaku untuk Foreveryone 1L
  const espressoSurcharge =
    !isForeveryone1L && espresso ? (ESPRESSO_SURCHARGE[espresso] ?? 0) : 0;
  const dairySurcharge =
    !isForeveryone1L && dairy ? (DAIRY_SURCHARGE[dairy] ?? 0) : 0;

  const unitPrice =
    (activePrice?.discPrice ?? activePrice?.price ?? 0) +
    toppingsTotal +
    espressoSurcharge +
    dairySurcharge;
  const totalPrice = unitPrice * qty;

  const toggleTopping = (topping) => {
    setToppings((prev) =>
      prev.some((t) => t.id === topping.id)
        ? prev.filter((t) => t.id !== topping.id)
        : [...prev, topping],
    );
  };

  if (!open || !product) return null;

  const handleAdd = () => {
    onAdd?.({
      ...product,
      selectedSize,
      temperature: isDrink && !isForeveryone1L ? effectiveTemp : null,
      ice: showIceLevel ? ice : null,
      sugar: showSugar ? sugar : null,
      espresso: !isForeveryone1L ? espresso : null,
      dairy: !isForeveryone1L ? dairy : null,
      sweetness,
      toppings,
      qty,
      notes: notes.trim() || null,
      unitPrice,
      finalPrice: totalPrice,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-neutral-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[75vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white sm:max-h-[85vh] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header image */}
        <div className="relative h-40 w-full shrink-0 bg-white sm:h-48">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain p-4"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-neutral-400 bg-slate-200 text-neutral-600 shadow-sm transition-colors hover:bg-neutral-900 hover:text-white"
          >
            <X size={16} />
          </button>
          {!isForeveryone1L && forcedIced && (
            <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-neutral-900 px-2.5 py-1 text-[10px] font-bold text-white">
              <Snowflake size={11} />
              Iced Only
            </span>
          )}
          {!isForeveryone1L && forcedHot && (
            <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-neutral-900 px-2.5 py-1 text-[10px] font-bold text-white">
              <Flame size={11} />
              Hot Only
            </span>
          )}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 space-y-5 overflow-y-auto bg-slate-100/70 px-5 py-5">
          <div>
            <h2 className="text-lg font-extrabold text-neutral-900">
              {product.name}
            </h2>
            <p className="mt-0.5 text-sm font-bold text-orange-600">
              {formatRupiah(activePrice?.discPrice ?? activePrice?.price)}
              {activePrice?.discPrice !== activePrice?.price && (
                <span className="ml-2 text-xs font-medium text-neutral-400 line-through">
                  {formatRupiah(activePrice?.price)}
                </span>
              )}
            </p>
          </div>

          {/* ==== KHUSUS MAKANAN/SNACK: cuma topping (jika ada) + catatan ==== */}
          {!isDrink && (
            <>
              {product.hasTopping && product.toppings?.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-neutral-500">
                    Tambahan Topping/Saus
                  </p>
                  <div className="space-y-2">
                    {product.toppings.map((topping) => {
                      const checked = toppings.some((t) => t.id === topping.id);
                      return (
                        <button
                          key={topping.id}
                          type="button"
                          onClick={() => toggleTopping(topping)}
                          className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-sm transition-colors ${
                            checked
                              ? "border-neutral-900 bg-neutral-50"
                              : "border-slate-200 bg-white hover:border-orange-300"
                          }`}
                        >
                          <span className="font-medium text-neutral-800">
                            {topping.name}
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="text-xs text-neutral-500">
                              +{formatRupiah(topping.price)}
                            </span>
                            <span
                              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                checked
                                  ? "border-neutral-900 bg-neutral-900"
                                  : "border-slate-300"
                              }`}
                            >
                              {checked && (
                                <span className="h-2 w-2 rounded-full bg-white" />
                              )}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">
                    Catatan
                  </p>
                  <span className="text-[10px] font-medium text-neutral-400">
                    {notes.length}/{NOTES_MAX_LENGTH}
                  </span>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value.slice(0, NOTES_MAX_LENGTH))
                  }
                  maxLength={NOTES_MAX_LENGTH}
                  placeholder="Contoh: pedas sedikit, tanpa saus, dll"
                  rows={2}
                  className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
                />
              </div>
            </>
          )}

          {/* ==== KHUSUS FOREVERYONE 1L: cuma Sweet Level + Catatan ==== */}
          {isDrink && isForeveryone1L && (
            <>
              {sweetOptions.length > 0 && (
                <OptionGroup label="Sweet Level">
                  {sweetOptions.map((key) => (
                    <OptionPill
                      key={key}
                      active={sweetness === key}
                      onClick={() => setSweetness(key)}
                    >
                      {SWEETNESS_LABELS[key] ?? key}
                    </OptionPill>
                  ))}
                </OptionGroup>
              )}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">
                    Catatan
                  </p>
                  <span className="text-[10px] font-medium text-neutral-400">
                    {notes.length}/{NOTES_MAX_LENGTH}
                  </span>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value.slice(0, NOTES_MAX_LENGTH))
                  }
                  maxLength={NOTES_MAX_LENGTH}
                  placeholder="Contoh: less sweet, dll"
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
                />
              </div>
            </>
          )}

          {/* ==== MINUMAN BIASA (bukan Foreveryone 1L) ==== */}
          {isDrink && !isForeveryone1L && (
            <>
              {sizeKeys.length > 1 && (
                <OptionGroup label="Sizes">
                  {sizeKeys.map((size) => (
                    <OptionPill
                      key={size}
                      active={selectedSize === size}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </OptionPill>
                  ))}
                </OptionGroup>
              )}

              {showTempSelector && (
                <OptionGroup label="Temperature">
                  <OptionPill
                    active={temp === "ice"}
                    onClick={() => setTemp("ice")}
                  >
                    <span className="inline-flex items-center gap-1">
                      <Snowflake size={13} /> Ice
                    </span>
                  </OptionPill>
                  <OptionPill
                    active={temp === "hot"}
                    onClick={() => setTemp("hot")}
                  >
                    <span className="inline-flex items-center gap-1">
                      <Flame size={13} /> Hot
                    </span>
                  </OptionPill>
                </OptionGroup>
              )}

              {showIceLevel && (
                <OptionGroup label="Iced Level">
                  {ICE_LEVELS.map((lvl) => (
                    <OptionPill
                      key={lvl.id}
                      active={ice === lvl.id}
                      onClick={() => setIce(lvl.id)}
                    >
                      {lvl.label}
                    </OptionPill>
                  ))}
                </OptionGroup>
              )}

              {showSugar && (
                <OptionGroup label="Sweet Level">
                  {SUGAR_LEVELS.map((lvl) => (
                    <OptionPill
                      key={lvl.id}
                      active={sugar === lvl.id}
                      onClick={() => setSugar(lvl.id)}
                    >
                      {lvl.label}
                    </OptionPill>
                  ))}
                </OptionGroup>
              )}

              {showEspresso && (
                <OptionGroup label="Espresso Shot">
                  {product.allowedEspresso.map((key) => {
                    const surcharge = ESPRESSO_SURCHARGE[key] ?? 0;
                    return (
                      <OptionPill
                        key={key}
                        active={espresso === key}
                        onClick={() => setEspresso(key)}
                        extra={
                          surcharge > 0 ? `+${formatRupiah(surcharge)}` : null
                        }
                      >
                        {ESPRESSO_LABELS[key] ?? key}
                      </OptionPill>
                    );
                  })}
                </OptionGroup>
              )}

              {showDairy && (
                <OptionGroup label="Dairy">
                  {product.allowedDairy.map((key) => {
                    const surcharge = DAIRY_SURCHARGE[key] ?? 0;
                    return (
                      <OptionPill
                        key={key}
                        active={dairy === key}
                        onClick={() => setDairy(key)}
                        extra={
                          surcharge > 0 ? `+${formatRupiah(surcharge)}` : null
                        }
                      >
                        {DAIRY_LABELS[key] ?? key}
                      </OptionPill>
                    );
                  })}
                </OptionGroup>
              )}

              {sweetOptions.length > 0 && (
                <OptionGroup label="Sweet Level">
                  {sweetOptions.map((key) => (
                    <OptionPill
                      key={key}
                      active={sweetness === key}
                      onClick={() => setSweetness(key)}
                    >
                      {SWEETNESS_LABELS[key] ?? key}
                    </OptionPill>
                  ))}
                </OptionGroup>
              )}

              {product.hasTopping && product.toppings?.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-neutral-500">
                    Tambahan Topping/Saus
                  </p>
                  <div className="space-y-2">
                    {product.toppings.map((topping) => {
                      const checked = toppings.some((t) => t.id === topping.id);
                      return (
                        <button
                          key={topping.id}
                          type="button"
                          onClick={() => toggleTopping(topping)}
                          className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-sm transition-colors ${
                            checked
                              ? "border-neutral-900 bg-neutral-50"
                              : "border-slate-200 bg-white hover:border-orange-300"
                          }`}
                        >
                          <span className="font-medium text-neutral-800">
                            {topping.name}
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="text-xs text-neutral-500">
                              +{formatRupiah(topping.price)}
                            </span>
                            <span
                              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                checked
                                  ? "border-neutral-900 bg-neutral-900"
                                  : "border-slate-300"
                              }`}
                            >
                              {checked && (
                                <span className="h-2 w-2 rounded-full bg-white" />
                              )}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">
                    Catatan
                  </p>
                  <span className="text-[10px] font-medium text-neutral-400">
                    {notes.length}/{NOTES_MAX_LENGTH}
                  </span>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value.slice(0, NOTES_MAX_LENGTH))
                  }
                  maxLength={NOTES_MAX_LENGTH}
                  placeholder="Contoh: less ice, extra hot, dll"
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer: qty + add to cart */}
        <div className="flex items-center gap-3 border-t border-slate-100 bg-white px-5 py-4">
          <div className="flex items-center gap-3 rounded-full border border-slate-400 px-2 py-1.5">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-neutral-700 hover:bg-slate-200"
            >
              <Minus size={14} />
            </button>
            <span className="w-5 text-center text-sm font-bold text-neutral-900">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-neutral-700 hover:bg-slate-200"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="flex flex-1 cursor-pointer items-center justify-between rounded-full bg-neutral-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-500"
          >
            <span>Tambah ke Keranjang</span>
            <span>{formatRupiah(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
