import { useContext } from "react";
import { ToastContext } from "../context/contexts";

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      show: () => {},
      success: () => {},
      error: () => {},
      info: () => {},
      remove: () => {},
    };
  }
  return context;
}
