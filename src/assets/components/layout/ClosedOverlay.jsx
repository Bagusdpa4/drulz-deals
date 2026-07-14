import React from "react";
import { Clock } from "lucide-react";
import { useBodyScrollLock } from "../../lib/useBodyScrollLock";

export const ClosedOverlay = ({ message }) => {
  useBodyScrollLock(true);
  return (
    <div className="z-100 fixed inset-0 flex items-center justify-center bg-neutral-900/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center">
        <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-orange-500">
          <Clock size={26} />
        </span>
        <h2 className="text-lg font-extrabold text-neutral-900">
          Sedang Tutup
        </h2>
        <p className="mt-1.5 text-sm text-neutral-500">{message}</p>
      </div>
    </div>
  );
};
