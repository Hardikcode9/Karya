import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] bg-cream flex flex-col items-center justify-center gap-5"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-3"
      >
        <motion.span
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-14 h-14 rounded-full bg-olive-700 text-cream flex items-center justify-center font-display text-2xl"
        >
          K
        </motion.span>
        <span className="font-display text-3xl text-charcoal">Karya</span>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-charcoal/55 text-sm"
        >
          Local skills. Better opportunities.
        </motion.p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="w-32 h-[3px] rounded-full bg-olive-100 overflow-hidden"
      >
        <motion.div
          className="h-full bg-olive-600 rounded-full"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
}
