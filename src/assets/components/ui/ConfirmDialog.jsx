import React from "react";

export const ConfirmDialog = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;
  return (
    <div
      className="z-60 fixed inset-0 flex items-center justify-center bg-neutral-900/60 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-extrabold text-neutral-900">{title}</h3>
        <p className="mt-1.5 text-sm text-neutral-500">{message}</p>
        <div className="mt-5 flex gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 cursor-pointer rounded-full border border-slate-300 py-2.5 text-sm font-bold text-neutral-700 hover:bg-slate-100"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 cursor-pointer rounded-full bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-600"
          >
            Ganti & Kosongkan
          </button>
        </div>
      </div>
    </div>
  );
};
