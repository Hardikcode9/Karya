import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const ADMIN_USER = {
  id: "admin-super-01",
  name: "Vikramaditya Solanki",
  role: "admin",
  level: "Super Admin",
  phone: "+91 94220 99881",
  email: "admin.district@karya.gov.in",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(ADMIN_USER);

  const logout = () => {
    alert("Super Admin session logout triggered.");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return { user: ADMIN_USER, logout: () => {} };
  }
  return context;
}
