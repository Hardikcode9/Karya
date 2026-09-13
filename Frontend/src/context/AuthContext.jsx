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

  const login = async ({ email, password, role }) => {
    try {
      if (email && password) {
        const response = await api.post("/auth/login", { email, password });
        const { token, user: userData } = response.data;
        
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        
        return userData;
      }

      // Demo role login support for quick access & preview testing
      const selectedRole = role || "customer";
      const demoUser = {
        id: "demo-" + selectedRole,
        name:
          selectedRole === "customer"
            ? "Siddhant Sharma"
            : selectedRole === "worker"
            ? "Ramesh Kumar"
            : selectedRole === "admin"
            ? "Admin Officer"
            : "Pragati Mahila SHG",
        email:
          selectedRole === "customer"
            ? "siddhant.sharma@example.com"
            : selectedRole === "worker"
            ? "ramesh.worker@example.com"
            : selectedRole === "admin"
            ? "admin@karya.in"
            : "shg.pragati@example.com",
        phone: "+91 98765 43210",
        role: selectedRole,
      };
      const demoToken = "demo-token-" + selectedRole + "-" + Date.now();
      localStorage.setItem("token", demoToken);
      localStorage.setItem("user", JSON.stringify(demoUser));
      setUser(demoUser);
      return demoUser;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (data) => {
    try {
      const response = await api.post("/auth/register", data);
      
      // Some backends return token on register, if not, we can just return the user
      // Assuming the backend doesn't return a token on register directly based on authController.js
      // The user will need to login after register or we login them in automatically if token is returned.
      // Wait, let's check authController.js registerUser. It returns user object but NO token.
      
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
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
