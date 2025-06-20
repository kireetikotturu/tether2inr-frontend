import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load from localStorage if present
    const saved = localStorage.getItem("tether2inr:user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = (data) => {
    // data now includes: token, role, email, usdtBalance, referralCode
    setUser(data);
    localStorage.setItem("tether2inr:user", JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("tether2inr:user");
  };

  // Provide token as a top-level value for easy destructuring
  const token = user?.token || null;

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}