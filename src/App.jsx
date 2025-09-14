import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import MainLayout from "./components/MainLayout";
import Homepage from "./pages/Homepage";
import Profile from "./pages/ProfilePage";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* halaman login */}
        <Route path="/login" element={<LoginPage />} />

        {/* halaman sign up */}
        <Route path="/signup" element={<SignUpPage />} />

        {/* Di bawah ini buat pages yang pengen paling atas nya ada navbar*/}
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer position="top-center" />
    </BrowserRouter>
  );
}
