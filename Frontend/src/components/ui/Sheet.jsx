import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function Sheet({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  side = "bottom", // 'bottom' on mobile, can be 'right' on desktop
  className = "",
}) {
  // Prevent background scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isBottom = side === "bottom";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-end sm:items-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Sheet Body */}
          <motion.div
            initial={isBottom ? { y: "100%" } : { x: "100%" }}
            animate={isBottom ? { y: 0 } : { x: 0 }}
            exit={isBottom ? { y: "100%" } : { x: "100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`relative z-10 w-full sm:max-w-lg bg-cream dark:bg-dark-surface rounded-t-3xl sm:rounded-3xl border border-charcoal/10 dark:border-dark-border shadow-elevation-3 max-h-[88vh] flex flex-col overflow-hidden ${className}`}
          >
            {/* Grab handle for bottom sheet on mobile */}
            <div className="pt-3 pb-1 flex justify-center sm:hidden">
              <div className="w-12 h-1.5 rounded-full bg-charcoal/20 dark:bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-charcoal/10 dark:border-dark-border shrink-0">
              <div>
                {title && (
                  <h3 className="font-display font-medium text-lg sm:text-xl text-charcoal dark:text-dark-text">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full text-charcoal/50 hover:text-charcoal dark:text-dark-muted dark:hover:text-dark-text hover:bg-charcoal/5 dark:hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content area */}
            <div className="px-5 sm:px-6 py-5 overflow-y-auto overscroll-contain flex-1 pb-safe">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
