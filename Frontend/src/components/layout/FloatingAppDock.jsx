import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function FloatingAppDock({ onOpenCompanion }) {
  return (
    <div className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 z-40">
      <motion.button
        whileHover={{ scale: 1.06, y: -2 }}
        whileTap={{ scale: 0.94 }}
        onClick={onOpenCompanion}
        className="group relative flex items-center gap-2.5 bg-olive-900 text-cream px-4 sm:px-5 py-3 rounded-full shadow-2xl border border-olive-700/50 backdrop-blur transition-all"
        aria-label="Open Karya Companion"
      >
        <span className="relative flex items-center justify-center">
          <Sparkles size={18} className="text-olive-300 animate-spin-slow group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-olive-900 animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-olive-900" />
        </span>
        <span className="text-xs sm:text-sm font-semibold tracking-wide">
          Companion AI
        </span>
      </motion.button>
    </div>
  );
}
