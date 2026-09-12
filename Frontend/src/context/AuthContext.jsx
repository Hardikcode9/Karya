import { useState, useEffect } from "react";
import { AuthContext } from "./contexts";
import api from "../utils/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on load
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = async ({ email, password }) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const loginWithOtp = async ({ email, otp, role }) => {
    try {
      const response = await api.post("/auth/verify-otp", { email, otp, role });
      const { token, user: userData } = response.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error("OTP login failed:", error);
      throw error;
    }
  };

  const register = async (data) => {
    try {
      const response = await api.post("/auth/register", data);
      return response.data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const nextUser = { ...(prev || {}), ...updatedData };
      localStorage.setItem("user", JSON.stringify(nextUser));
      return nextUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithOtp, register, logout, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
