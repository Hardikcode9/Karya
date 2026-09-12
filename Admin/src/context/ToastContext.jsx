import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg) => addToast(msg, "success"),
    error: (msg) => addToast(msg, "error"),
    info: (msg) => addToast(msg, "info"),
    warning: (msg) => addToast(msg, "warning"),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Overlay */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold animate-fade-in ${
              t.type === "success"
                ? "bg-emerald-900 text-white border-emerald-700"
                : t.type === "error"
                ? "bg-rose-900 text-white border-rose-700"
                : t.type === "warning"
                ? "bg-amber-900 text-white border-amber-700"
                : "bg-charcoal text-white border-charcoal/40"
            }`}
          >
            {t.type === "success" && <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />}
            {t.type === "error" && <XCircle size={16} className="text-rose-400 shrink-0" />}
            {t.type === "warning" && <AlertTriangle size={16} className="text-amber-400 shrink-0" />}
            {t.type === "info" && <Info size={16} className="text-blue-400 shrink-0" />}
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="text-white/60 hover:text-white p-0.5"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      success: (msg) => console.log("Toast success:", msg),
      error: (msg) => console.log("Toast error:", msg),
      info: (msg) => console.log("Toast info:", msg),
      warning: (msg) => console.log("Toast warning:", msg),
    };
  }
  return context;
}
