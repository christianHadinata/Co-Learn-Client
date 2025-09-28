import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import MainLayout from "./components/MainLayout";
import Homepage from "./pages/Homepage";
import Profile from "./pages/ProfilePage";
import NewLearningSpace from "./pages/CreateLearningSpacePage";
import ViewSpace from "./pages/ViewSpace";
import ViewProfileDetail from "./pages/ProfileDetailPage";
import ViewPost from "./pages/ViewPost";
import CreatePost from "./pages/CreatePost";

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
            <Route
              path="create-new-learning-space"
              element={<NewLearningSpace />}
            />
            <Route path="space/:id" element={<ViewSpace />} />
            <Route path="space/:id/post/new" element={<CreatePost />} />
            <Route path="space/:id/post/:postId" element={<ViewPost />} />
            <Route
              path="view-profile/:user_id"
              element={<ViewProfileDetail />}
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer position="top-center" />
      </BrowserRouter>
    </UserProvider>
  );
}
