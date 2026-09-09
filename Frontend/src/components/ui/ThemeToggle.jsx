import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

export default function ThemeToggle({ className = "" }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      onClick={toggleTheme}
      className={`relative p-2 rounded-full border border-charcoal/10 dark:border-dark-border bg-cream dark:bg-dark-card text-charcoal dark:text-dark-text hover:text-olive-700 dark:hover:text-olive-400 transition-colors shadow-xs ${className}`}
      aria-label="Toggle light and dark mode"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0, scale: isDark ? 0.9 : 1 }}
        transition={{ duration: 0.25 }}
      >
        {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
      </motion.div>
    </motion.button>
  );
}
