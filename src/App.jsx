import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import MainLayout from "./components/MainLayout";
import Homepage from "./pages/HomePage";
import Profile from "./pages/ProfilePage";
import ViewSpace from "./pages/ViewSpace";

import { UserProvider } from "./context/UserContext";
export default function App() {
  return (
    <UserProvider>
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
            <Route path="space/:id" element={<ViewSpace />} />
          </Route>

          {/* ini harusnya ganti ke / aja gasih jgn login? */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <ToastContainer position="top-center" />
      </BrowserRouter>
    </UserProvider>
  );
}
