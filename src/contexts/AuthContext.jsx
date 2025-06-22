import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Initialize user state from localStorage synchronously
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("tether2inr:user");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Failed to parse user from storage", e);
      return null;
    }
  });

  // Token derived from user object
  const token = user?.token || null;

  // Login: set user in state and persist
  const login = (data) => {
    setUser(data);
    localStorage.setItem("tether2inr:user", JSON.stringify(data));
  };

  // Logout: clear state and storage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("tether2inr:user");
  };

  // Optional: refresh user data from backend
  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        "https://tetherbridge-backend.onrender.com/api/user/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updated = { ...user, ...res.data };
      setUser(updated);
      localStorage.setItem("tether2inr:user", JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to refresh user", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
