import { useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * Standardized Admin Portal Modal
 * - Both the left sidebar (w-64) and top/right navigation bar (h-16) remain visible.
 * - Below the top nav bar (top-16), all background page content (stats, tables, buttons, filters) is completely hidden under solid backdrop.
 * - The popup window is centered in the screen viewport space below the top navbar at 70vw width and ~76vh height.
 * - Locks background page scrolling while open.
 */
export default function AdminModal({ isOpen, onClose, children, className = "" }) {
  useEffect(() => {
    if (!isOpen) return;

    // Lock body scroll while modal is active
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
      className="fixed top-16 bottom-0 right-0 left-0 lg:left-64 z-40 flex items-center justify-center p-3 sm:p-6 bg-cream dark:bg-dark-bg overflow-hidden"
    >
      <div
        className={`w-[70vw] max-w-[calc(100%-2rem)] h-[76vh] max-h-[calc(100vh-6rem)] bg-white dark:bg-dark-card rounded-2xl sm:rounded-3xl border border-charcoal/15 dark:border-dark-border shadow-2xl flex flex-col overflow-hidden animate-scale-up ${className}`}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
