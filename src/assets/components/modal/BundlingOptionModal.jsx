import React, { useEffect, useMemo, useState } from "react";
import { X, Minus, Plus, Gift } from "lucide-react";
import { formatRupiah } from "../../lib/useCatalog";
import { useBodyScrollLock } from "../../lib/useBodyScrollLock";

const NOTES_MAX_LENGTH = 250;

const emptyGroupSelections = (bundle) =>
  (bundle?.chooseGroups ?? []).map(() => ({})); // tiap index: { [optionId]: qty }

const countPicked = (selectionMap) =>
  Object.values(selectionMap ?? {}).reduce((sum, q) => sum + q, 0);

export const BundlingOptionModal = ({ open, onClose, bundle, onAdd }) => {
  useBodyScrollLock(open);

  const isFixedChoice = bundle?.type === "fixed_choice";
  const groups = bundle?.chooseGroups ?? [];

  const [groupSelections, setGroupSelections] = useState(() =>
    emptyGroupSelections(bundle),
  );
  const [fixedOptionId, setFixedOptionId] = useState(
    bundle?.fixedOptions?.[0]?.id ?? null,
  );
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");

  // Reset semua pilihan setiap kali bundle yang dibuka berganti
  useEffect(() => {
    setGroupSelections(emptyGroupSelections(bundle));
    setFixedOptionId(bundle?.fixedOptions?.[0]?.id ?? null);
    setQty(1);
    setNotes("");
  }, [bundle?.id]);

  const addToGroup = (groupIndex, option) => {
    const group = groups[groupIndex];
    setGroupSelections((prev) => {
      const current = prev[groupIndex] ?? {};
      const picked = countPicked(current);
      if (picked >= group.chooseCount) return prev; // kuota grup sudah penuh
      const next = [...prev];
      next[groupIndex] = {
        ...current,
        [option.id]: (current[option.id] ?? 0) + 1,
      };
      return next;
    });
  };

  const removeFromGroup = (groupIndex, option) => {
    setGroupSelections((prev) => {
      const current = prev[groupIndex] ?? {};
      const currentQty = current[option.id] ?? 0;
      if (currentQty <= 0) return prev;
      const next = [...prev];
      const updated = { ...current, [option.id]: currentQty - 1 };
      if (updated[option.id] === 0) delete updated[option.id];
      next[groupIndex] = updated;
      return next;
    });
  };

  const allGroupsComplete = useMemo(
    () =>
      groups.every(
        (group, i) => countPicked(groupSelections[i]) === group.chooseCount,
      ),
    [groups, groupSelections],
  );

  const totalPrice = useMemo(() => {
    if (!bundle) return 0;

    if (isFixedChoice) {
      const opt = bundle.fixedOptions?.find((o) => o.id === fixedOptionId);
      return (opt?.price ?? 0) * qty;
    }

    if (bundle.type === "duo_pay_highest") {
      const chosenPrices = [];
      groups.forEach((group, i) => {
        const sel = groupSelections[i] ?? {};
        Object.entries(sel).forEach(([optId, count]) => {
          const opt = group.options.find((o) => o.id === optId);
          for (let c = 0; c < count; c++) chosenPrices.push(opt?.price ?? 0);
        });
      });
      const maxPrice = chosenPrices.length ? Math.max(...chosenPrices) : 0;
      return maxPrice * qty;
    }

    // Bundling biasa: harga fix, tidak tergantung pilihan produk
    return (bundle.price ?? 0) * qty;
  }, [bundle, isFixedChoice, fixedOptionId, groups, groupSelections, qty]);

  const canSubmit = isFixedChoice ? !!fixedOptionId : allGroupsComplete;

  if (!open || !bundle) return null;

  const handleAdd = () => {
    const chosenProducts = isFixedChoice
      ? []
      : groups.flatMap((group, i) => {
          const sel = groupSelections[i] ?? {};
          return Object.entries(sel).flatMap(([optId, count]) => {
            const opt = group.options.find((o) => o.id === optId);
            return Array.from({ length: count }, () => ({
              groupLabel: group.label,
              id: opt.id,
              name: opt.name,
              image: opt.image,
              price: opt.price ?? null,
            }));
          });
        });

    onAdd?.({
      ...bundle,
      isBundling: true,
      selectedFixedOption: isFixedChoice
        ? bundle.fixedOptions.find((o) => o.id === fixedOptionId)
        : null,
      chosenProducts,
      qty,
      notes: notes.trim() || null,
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
            src={bundle.image}
            alt={bundle.name}
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
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-neutral-900 px-2.5 py-1 text-[10px] font-bold text-white">
            <Gift size={11} />
            Bundling
          </span>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 space-y-5 overflow-y-auto bg-slate-100/70 px-5 py-5">
          <div>
            <h2 className="text-lg font-extrabold text-neutral-900">
              {bundle.name}
            </h2>
            {bundle.description && (
              <p className="mt-0.5 text-sm text-neutral-500">
                {bundle.description}
              </p>
            )}
            {!isFixedChoice && (
              <p className="mt-1 text-sm font-bold text-orange-600">
                {formatRupiah(totalPrice)}
              </p>
            )}
          </div>

          {/* === fixed_choice: single select paket harga === */}
          {isFixedChoice && (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-neutral-500">
                Pilih Paket
              </p>
              <div className="space-y-2">
                {bundle.fixedOptions.map((opt) => {
                  const active = fixedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setFixedOptionId(opt.id)}
                      className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-3 text-left text-sm transition-colors ${
                        active
                          ? "border-neutral-900 bg-neutral-50"
                          : "border-slate-200 bg-white hover:border-orange-300"
                      }`}
                    >
                      <span>
                        <span className="block font-semibold text-neutral-900">
                          {opt.label}
                        </span>
                        {opt.description && (
                          <span className="block text-xs text-neutral-500">
                            {opt.description}
                          </span>
                        )}
                      </span>
                      <span className="font-bold text-orange-600">
                        {formatRupiah(opt.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* === chooseGroups: pilih produk, boleh duplikat === */}
          {!isFixedChoice &&
            groups.map((group, groupIndex) => {
              const selection = groupSelections[groupIndex] ?? {};
              const picked = countPicked(selection);
              const groupFull = picked >= group.chooseCount;

              return (
                <div key={group.label}>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">
                      {group.label}
                    </p>
                    <span
                      className={`text-[11px] font-bold ${
                        groupFull ? "text-emerald-600" : "text-neutral-400"
                      }`}
                    >
                      {picked}/{group.chooseCount} dipilih
                    </span>
                  </div>

                  <div className="space-y-2">
                    {group.options.map((option) => {
                      const qtyPicked = selection[option.id] ?? 0;
                      return (
                        <div
                          key={option.id}
                          className={`flex items-center justify-between rounded-xl border px-3 py-2 transition-colors ${
                            qtyPicked > 0
                              ? "border-neutral-900 bg-neutral-50"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <img
                              src={option.image}
                              alt={option.name}
                              className="h-10 w-10 shrink-0 rounded-lg bg-white object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                            <div>
                              <p className="text-sm font-semibold text-neutral-800">
                                {option.name}
                              </p>
                              {option.price != null && (
                                <p className="text-xs text-neutral-500">
                                  {formatRupiah(option.price)}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 rounded-full border border-slate-300 px-1.5 py-1">
                            <button
                              type="button"
                              onClick={() =>
                                removeFromGroup(groupIndex, option)
                              }
                              disabled={qtyPicked === 0}
                              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-slate-200 disabled:opacity-30"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-4 text-center text-sm font-bold text-neutral-900">
                              {qtyPicked}
                            </span>
                            <button
                              type="button"
                              onClick={() => addToGroup(groupIndex, option)}
                              disabled={groupFull}
                              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-slate-200 disabled:opacity-30"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

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
              placeholder="Contoh: less ice semua, dll"
              rows={4}
              className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
            />
          </div>
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
            disabled={!canSubmit}
            className="flex flex-1 cursor-pointer items-center justify-between rounded-full bg-neutral-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-neutral-900"
          >
            <span>
              {canSubmit ? "Tambah ke Keranjang" : "Lengkapi pilihan dulu"}
            </span>
            <span>{formatRupiah(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
