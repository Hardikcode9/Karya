import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ toast, onDismiss }) {
  const { message, type } = toast;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-olive-600 dark:text-olive-400 shrink-0" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl bg-charcoal/95 dark:bg-dark-card text-cream dark:text-dark-text border border-white/10 shadow-elevation-3 backdrop-blur-md max-w-sm w-full"
    >
      {icons[type] || icons.info}
      <p className="text-xs sm:text-sm font-medium flex-1 leading-snug">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="p-1 rounded-full text-cream/50 hover:text-cream dark:text-dark-muted dark:hover:text-dark-text transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
