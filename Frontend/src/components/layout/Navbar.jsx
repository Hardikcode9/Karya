import { useEffect, useState, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Globe,
  ChevronDown,
  ShoppingBag,
  ShieldAlert,
  LogIn,
  Check,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../hooks/useLanguage";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";
import Logo from "../ui/Logo";
import ThemeToggle from "../ui/ThemeToggle";

// Before login: ONLY Home and How It Works
const publicNavItems = [
  { to: "/", key: "home" },
  { to: "/how-it-works", key: "howItWorks" },
];

// For customer role: How-it-works, workers, work, and resources are removed
const customerNavItems = [
  { to: "/", key: "home" },
  { to: "/services", key: "services" },
  { to: "/shgs", key: "shgs" },
];

// For other authenticated roles (e.g. worker, shg, admin)
const authenticatedNavItems = [
  { to: "/", key: "home" },
  { to: "/how-it-works", key: "howItWorks" },
  { to: "/services", key: "services" },
  { to: "/workers", key: "workers" },
  { to: "/shgs", key: "shgs" },
  { to: "/work", key: "work" },
  { to: "/resources", key: "resources" },
];

export default function Navbar({ onOpenEmergency, onOpenContact }) {
  const { t } = useTranslation();
  const { current, setLanguage, languageOptions } = useLanguage();
  const { totalCount, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const lastScrollY = useRef(0);
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langMenuRef = useRef(null);

  // Scroll effect: dynamic black border when scrolling up / page is scrolled
  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const isUp = currentScrollY < lastScrollY.current;
      setIsScrollingUp(isUp);
      setScrolled(currentScrollY > 8);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close language popup on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    if (langOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [langOpen]);

  const currentLabel =
    languageOptions.find((l) => l.code === current)?.label || "English";

  const activeNavList = !user
    ? publicNavItems
    : user.role === "customer"
    ? customerNavItems
    : authenticatedNavItems;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 rounded-none border-b ${
        scrolled
          ? isScrollingUp
            ? "bg-cream/95 dark:bg-dark-surface/95 backdrop-blur-md shadow-xs border-black dark:border-white/40 border-b-2"
            : "bg-cream/95 dark:bg-dark-surface/95 backdrop-blur-md shadow-xs border-black dark:border-white/30 border-b"
          : "bg-cream/90 dark:bg-dark-surface/90 backdrop-blur-sm border-transparent"
      }`}
    >
      <div className="w-full px-[5%] h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link
          to="/"
          className="shrink-0 flex items-center group transition-transform active:scale-98"
          onClick={() => {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
            setOpen(false);
          }}
        >
          <Logo />
        </Link>

        {/* Center: Main Navigation */}
        <nav
          aria-label="Main Navigation"
          className="hidden lg:flex items-center gap-[4vw] xl:gap-[5vw] ml-[5%]"
        >
          {activeNavList.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.to === "/"}
              onClick={() => {
                window.scrollTo({ top: 0, left: 0, behavior: "instant" });
              }}
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors duration-200 py-1 whitespace-nowrap ${
                  isActive
                    ? "text-olive-800 dark:text-olive-300 font-bold"
                    : "text-charcoal/70 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text"
                }`
              }
            >
              {t(`nav.${item.key}`) || item.key}
            </NavLink>
          ))}

          {/* Contact Page Link */}
          <NavLink
            to="/contact"
            onClick={() => {
              window.scrollTo({ top: 0, left: 0, behavior: "instant" });
            }}
            className={({ isActive }) =>
              `text-sm font-semibold transition-colors duration-200 py-1 whitespace-nowrap ${
                isActive
                  ? "text-olive-800 dark:text-olive-300 font-bold"
                  : "text-charcoal/70 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text"
              }`
            }
          >
            {t("nav.contact") || "Contact"}
          </NavLink>
        </nav>

        {/* Right Side: Tools, Actions & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Cart Trigger (Authenticated Only) */}
          {user && (
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative h-9 w-9 flex items-center justify-center rounded-full border border-charcoal/10 dark:border-dark-border bg-cream/90 dark:bg-dark-card text-charcoal dark:text-dark-text hover:text-olive-700 dark:hover:text-olive-400 hover:border-olive-500/40 transition-all shadow-2xs"
              aria-label="Open Cart"
              title="Cart"
            >
              <ShoppingBag size={16} />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-olive-700 text-cream text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {totalCount}
                </span>
              )}
            </button>
          )}

          {/* Theme Toggle Button */}
          <ThemeToggle className="h-9 w-9 flex items-center justify-center" />

          {/* Language Switcher (Google Translate Integration) */}
          <div className="relative notranslate" translate="no" ref={langMenuRef}>
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              className="h-9 px-2.5 sm:px-3 flex items-center gap-1.5 rounded-full border border-charcoal/10 dark:border-dark-border bg-cream/90 dark:bg-dark-card text-charcoal/80 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text hover:border-olive-500/40 text-xs font-medium transition-all shadow-2xs"
              aria-label="Translate Website with Google"
              aria-expanded={langOpen}
            >
              <Globe size={14} className="text-olive-700 dark:text-olive-400 shrink-0" />
              <span className="hidden sm:inline font-semibold">{currentLabel}</span>
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 opacity-60 ${
                  langOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  role="listbox"
                  className="absolute right-0 mt-2 w-52 rounded-2xl bg-cream dark:bg-dark-card shadow-nav border border-charcoal/10 dark:border-dark-border p-1.5 z-50 max-h-80 overflow-y-auto no-scrollbar"
                >
                  <div className="px-3 py-1.5 border-b border-charcoal/5 dark:border-dark-border mb-1 flex items-center justify-between text-[10px] text-charcoal/50 dark:text-dark-muted font-bold tracking-wider uppercase">
                    <span className="flex items-center gap-1">
                      <Sparkles size={10} className="text-amber-500" />
                      Translate
                    </span>
                    <span className="text-[9px] text-olive-700 dark:text-olive-400 font-bold lowercase">
                      google api
                    </span>
                  </div>

                  {languageOptions.map((opt) => (
                    <li key={opt.code}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={current === opt.code}
                        onClick={() => {
                          setLanguage(opt.code);
                          setLangOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                          current === opt.code
                            ? "bg-olive-100 dark:bg-olive-900/50 text-olive-900 dark:text-olive-200 font-bold"
                            : "hover:bg-ivory dark:hover:bg-dark-surface text-charcoal dark:text-dark-text"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {current === opt.code && (
                          <Check size={14} className="text-olive-700 dark:text-olive-400 shrink-0" />
                        )}
                      </button>
                    </li>
                  ))}

                  <div className="px-3 py-1.5 border-t border-charcoal/5 dark:border-dark-border mt-1 text-[9px] text-charcoal/50 dark:text-dark-muted flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Entire site translates live</span>
                  </div>
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Account Profile / Auth CTAs */}
          {user ? (
            <Link
              to={`/${user.role}`}
              className="h-9 pl-1.5 pr-3.5 flex items-center gap-2 rounded-full bg-olive-100/90 dark:bg-olive-900/50 border border-olive-200/80 dark:border-olive-800/80 text-olive-900 dark:text-olive-200 text-xs font-bold hover:bg-olive-200 dark:hover:bg-olive-800 transition-all shadow-2xs active:scale-98"
              title="Go to Dashboard"
            >
              <span className="w-6 h-6 rounded-full bg-olive-700 dark:bg-olive-500 text-white flex items-center justify-center text-[11px] font-extrabold uppercase shadow-xs">
                {user?.name?.charAt(0) || user?.role?.charAt(0) || "U"}
              </span>
              <span className="hidden xs:inline max-w-[95px] truncate capitalize font-semibold">
                {user?.name?.split(" ")[0] || user?.role}
              </span>
            </Link>
          ) : (
            <div className="flex items-center gap-1 sm:gap-1.5">
              <Link
                to="/login"
                className="h-9 px-3 flex items-center gap-1 rounded-full text-xs font-semibold text-charcoal/80 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text hover:bg-charcoal/5 dark:hover:bg-white/5 transition-all"
              >
                <LogIn size={13} />
                <span>Log in</span>
              </Link>
              <Button
                as={Link}
                to="/register"
                size="sm"
                className="hidden xs:inline-flex h-9 px-4 rounded-full text-xs font-bold shadow-xs py-0 items-center"
              >
                Join
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="lg:hidden h-9 w-9 flex items-center justify-center rounded-full text-charcoal dark:text-dark-text hover:bg-charcoal/5 dark:hover:bg-white/5 transition-colors -mr-1"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-full bg-cream/98 dark:bg-dark-surface/98 backdrop-blur-xl border-b border-charcoal/10 dark:border-dark-border px-4 sm:px-6 py-4 shadow-xl overflow-hidden lg:hidden"
          >
            <div className="max-w-7xl mx-auto flex flex-col gap-2">
              {/* Navigation Links */}
              <div className="flex flex-col gap-1">
                {activeNavList.map((item) => (
                  <NavLink
                    key={item.key}
                    to={item.to}
                    end={item.to === "/"}
                    onClick={() => {
                      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
                      setOpen(false);
                    }}
                    className={({ isActive }) =>
                      `px-4 py-2.5 rounded-2xl text-sm font-semibold transition-colors ${
                        isActive
                          ? "bg-olive-100 dark:bg-olive-900/50 text-olive-800 dark:text-olive-300 font-bold"
                          : "text-charcoal/80 dark:text-dark-muted hover:bg-ivory dark:hover:bg-dark-card"
                      }`
                    }
                  >
                    {t(`nav.${item.key}`) || item.key}
                  </NavLink>
                ))}

                {/* Mobile Contact Link */}
                <NavLink
                  to="/contact"
                  onClick={() => {
                    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
                    setOpen(false);
                  }}
                  className={({ isActive }) =>
                    `px-4 py-2.5 rounded-2xl text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-olive-100 dark:bg-olive-900/50 text-olive-800 dark:text-olive-300 font-bold"
                        : "text-charcoal/80 dark:text-dark-muted hover:bg-ivory dark:hover:bg-dark-card"
                    }`
                  }
                >
                  {t("nav.contact") || "Contact"}
                </NavLink>
              </div>

              <div className="h-px bg-charcoal/10 dark:bg-dark-border my-1" />

              {/* Mobile Translation Language Section */}
              <div className="px-2 pt-1 notranslate" translate="no">
                <div className="flex items-center justify-between text-[11px] font-bold text-charcoal/50 dark:text-dark-muted uppercase tracking-wider mb-2">
                  <span className="flex items-center gap-1.5">
                    <Globe size={13} className="text-olive-700 dark:text-olive-400" />
                    Select Language
                  </span>
                  <span className="text-[10px] text-olive-600 dark:text-olive-400 font-semibold lowercase">
                    Google Translate
                  </span>
                </div>
                <div className="grid grid-cols-3 xs:grid-cols-4 gap-1.5 max-h-36 overflow-y-auto no-scrollbar pb-1">
                  {languageOptions.map((opt) => (
                    <button
                      key={opt.code}
                      type="button"
                      onClick={() => setLanguage(opt.code)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold text-center border transition-all truncate ${
                        current === opt.code
                          ? "bg-olive-700 text-cream border-olive-700 shadow-xs"
                          : "border-charcoal/15 dark:border-dark-border text-charcoal/70 dark:text-dark-muted hover:bg-white dark:hover:bg-dark-card"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Footer CTAs */}
              <div className="pt-2">
                {!user ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      as={Link}
                      to="/login"
                      variant="outline"
                      className="w-full text-xs font-semibold py-2.5"
                      onClick={() => setOpen(false)}
                    >
                      Log in
                    </Button>
                    <Button
                      as={Link}
                      to="/register"
                      className="w-full text-xs font-semibold py-2.5"
                      onClick={() => setOpen(false)}
                    >
                      Create Free Account
                    </Button>
                  </div>
                ) : (
                  <Button
                    as={Link}
                    to={`/${user.role}`}
                    className="w-full text-xs font-semibold py-2.5"
                    onClick={() => setOpen(false)}
                  >
                    Open {user.role.toUpperCase()} Dashboard
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
