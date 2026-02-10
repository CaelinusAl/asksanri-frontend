import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SanriyaSorPage from "./pages/SanriyaSorPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/sanriya-sor" replace />} />
        <Route path="/sanriya-sor" element={<SanriyaSorPage />} />
        <Route path="*" element={<Navigate to="/sanriya-sor" replace />} />
      </Routes>
    </BrowserRouter>
  );
}