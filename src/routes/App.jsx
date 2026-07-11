import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Pages
import { Homepage } from "../pages/Homepage";
import { Error } from "../pages/error/Error";

// Components

export const App = () => {
  return (
    <BrowserRouter>
      {/* <AnimatePresence mode="wait"> */}
      <Routes>
        {/* Home */}
        <Route path="/" element={<Homepage />} />

        {/* Error */}
        <Route path="*" element={<Error />} />
      </Routes>
      {/* </AnimatePresence> */}
    </BrowserRouter>
  );
};
