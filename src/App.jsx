import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* halaman login */}
        <Route path="/login" element={<LoginPage />} />

        {/* halaman sign up */}
        <Route path="/signup" element={<SignUpPage />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
