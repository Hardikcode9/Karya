import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2 rounded-xl text-charcoal/70 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text hover:bg-charcoal/5 dark:hover:bg-dark-card transition-colors cursor-pointer"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-label="Toggle dark mode"
    >
      {theme === "dark" ? (
        <Sun size={17} className="text-amber-400" />
      ) : (
        <Moon size={17} className="text-charcoal/70" />
      )}
    </button>
  );
}
