import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const storedUser = localStorage.getItem("admin_user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("admin_user");
        localStorage.removeItem("admin_token");
      }
    }
    setLoading(false);
  }, []);

  const login = async ({ email, password }) => {
    const response = await api.post("/auth/login", { email, password });
    const { token, user: userData } = response.data;

    if (userData.role !== "admin") {
      throw new Error("Access denied. Admin credentials required.");
    }

    localStorage.setItem("admin_token", token);
    localStorage.setItem("admin_user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-dark-bg">
        <div className="animate-pulse text-charcoal/50 dark:text-dark-muted text-sm font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return { user: null, logout: () => {} };
  }
  return context;
}
