import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

export default function FloatingEmergencyButton({ onOpenEmergency, className = "" }) {
  return (
    <motion.button
      whileHover={{ scale: 1.06, y: -2 }}
      whileTap={{ scale: 0.94 }}
      onClick={onOpenEmergency}
      className={`group relative flex items-center gap-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white px-4 py-3 rounded-full shadow-xl shadow-rose-600/30 border border-white/20 transition-all pointer-events-auto cursor-pointer ${className}`}
      aria-label="1-Click Emergency SOS"
      title="1-Click Emergency SOS"
    >
      <span className="relative flex items-center justify-center">
        <ShieldAlert size={18} className="animate-pulse" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white ring-2 ring-rose-600 animate-ping" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white ring-2 ring-rose-600" />
      </span>
      <span className="text-xs sm:text-sm font-bold tracking-wide">
        Emergency SOS
      </span>
    </motion.button>
  );
}
