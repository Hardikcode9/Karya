import { useState, useCallback } from "react";
import Toast from "../components/ui/Toast";
import { ToastContext } from "./contexts";

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3000) => {
    let finalType = "info";
    let finalDuration = 3000;

    if (typeof type === "string") {
      finalType = type;
    } else if (typeof type === "number") {
      finalDuration = type;
    }

    if (typeof duration === "number") {
      finalDuration = duration;
    }

    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type: finalType }]);

    // Always auto-remove after 3 seconds (or specified duration)
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, finalDuration);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    show: (msg, type = "info", duration = 3000) => {
      if (typeof type === "number") {
        return addToast(msg, "info", type);
      }
      return addToast(msg, type || "info", duration || 3000);
    },
    success: (msg, duration = 3000) => addToast(msg, "success", duration),
    error: (msg, duration = 3000) => addToast(msg, "error", duration),
    info: (msg, duration = 3000) => addToast(msg, "info", duration),
    remove: removeToast,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none w-full max-w-md px-4">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onDismiss={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
