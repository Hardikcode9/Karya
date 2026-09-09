import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import App from "./App";
import LoadingScreen from "./components/layout/LoadingScreen";
import { OfflineProvider } from "./context/OfflineContext";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import "./i18n";

export default function Root() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <OfflineProvider>
          <AuthProvider>
            <CartProvider>
              <ToastProvider>
                <BrowserRouter>
                  <AnimatePresence mode="wait">
                    {loading && <LoadingScreen key="loading" />}
                  </AnimatePresence>
                  {!loading && <App />}
                </BrowserRouter>
              </ToastProvider>
            </CartProvider>
          </AuthProvider>
        </OfflineProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
