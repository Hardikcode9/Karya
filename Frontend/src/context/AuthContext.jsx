import { useState } from "react";
import { AuthContext } from "./contexts";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async ({ role, email }) => {
    setUser({ role, name: "Demo User", email: email || "demo@example.com" });
    return { role };
  };

  const register = async (data) => {
    setUser({ role: data.role, name: data.name || "New User", email: data.email });
    return data;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
