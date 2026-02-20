import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SanriyaSorPage from "./pages/SanriyaSorPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<SanriyaSorPage />} />
      </Routes>
    </BrowserRouter>
  );
}