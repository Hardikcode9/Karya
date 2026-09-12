import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 250);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll up to top"
      title="Scroll up to top"
      className="fixed bottom-6 left-6 z-40 inline-flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-white dark:bg-dark-card text-black dark:text-white border-2 border-black dark:border-white shadow-elevation-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-200 active:scale-95 group cursor-pointer"
    >
      <ArrowUp size={16} className="group-hover:-translate-y-0.5 transition-transform" />
      <span className="text-xs font-bold font-sans">Scroll Up</span>
    </button>
  );
}
