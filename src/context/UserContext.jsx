import { useState } from "react";
import { UserContext } from "./User";

export const UserProvider = ({ children }) => {
  // Ambil data user dari localStorage saat inisialisasi
  const storedUser = localStorage.getItem("user");
  const initialUser = storedUser ? JSON.parse(storedUser) : null;
  const [user, setUser] = useState(initialUser);

  const loginUser = (userData) => {
    setUser(userData);
    // Simpan data user ke localStorage
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const updateUser = (updatedUserData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedUserData,
    }));
  };

  const logoutUser = () => {
    setUser(null);
    // Hapus data user dan token dari localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
