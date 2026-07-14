import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Pages
import { Homepage } from "../pages/Homepage";
import { Error } from "../pages/error/Error";
import { AdminPage } from "../pages/admin/AdminPage";

// Components

export const App = () => {
  return (
    <BrowserRouter>
      {/* <AnimatePresence mode="wait"> */}
      <Routes>
        {/* Home */}
        <Route path="/" element={<Homepage />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminPage />} />

        {/* Error */}
        <Route path="*" element={<Error />} />
      </Routes>
      {/* </AnimatePresence> */}
    </BrowserRouter>
  );
};
