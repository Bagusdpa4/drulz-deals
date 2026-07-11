// Navbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="shadow-2xs flex items-center justify-between bg-slate-50 px-4 py-3 sm:px-5">
      <div
        className="flex cursor-pointer items-center gap-2 sm:gap-2.5"
        onClick={() => navigate("/")}
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-2xl shadow-sm sm:h-12 sm:w-12 sm:text-2xl">
          ☕
        </div>
        <span className="text-xl font-extrabold text-neutral-900 sm:text-2xl">
          Drulz <span className="text-orange-500">Deals</span>
        </span>
      </div>
      <div />
    </nav>
  );
};
