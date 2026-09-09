import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, ChevronDown, ShoppingBag, ShieldAlert, User, LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../hooks/useLanguage";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";
import Logo from "../ui/Logo";
import ThemeToggle from "../ui/ThemeToggle";

// Before login: ONLY Home and How It Works are exposed
const publicNavItems = [
  { to: "/", key: "home" },
  { to: "/how-it-works", key: "howItWorks" },
];

// After login: Full feature set
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
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const currentLabel = languageOptions.find((l) => l.code === current)?.label || "English";
  const activeNavList = user ? authenticatedNavItems : publicNavItems;

  return (
    <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 px-3 sm:px-5">
      <motion.div
        animate={{
          boxShadow: scrolled
            ? "0 8px 30px -12px rgba(42,38,32,0.22)"
            : "0 4px 16px -10px rgba(42,38,32,0.08)",
        }}
        className="container-kare flex items-center justify-between rounded-full bg-cream/95 dark:bg-dark-surface/95 backdrop-blur border border-charcoal/5 dark:border-dark-border px-3 sm:px-6 py-2.5 transition-colors"
      >
        <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1">
          {activeNavList.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 ${
                  isActive
                    ? "bg-olive-100 dark:bg-olive-900/50 text-olive-800 dark:text-olive-300 font-bold"
                    : "text-charcoal/70 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text"
                }`
              }
            >
              {t(`nav.${item.key}`) || item.key}
            </NavLink>
          ))}
        </nav>

        {/* Contact Us – visible to all users */}
        {onOpenContact && (
          <button
            onClick={onOpenContact}
            className="hidden md:inline-flex px-3.5 py-1.5 rounded-full text-xs font-semibold text-charcoal/70 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text hover:bg-ivory dark:hover:bg-dark-card transition-colors"
          >
            {t("nav.contact") || "Contact"}
          </button>
        )}

        {/* Right Side Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Emergency SOS Button (Only visible after login) */}
          {user && onOpenEmergency && (
            <button
              onClick={onOpenEmergency}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs animate-pulse transition-all"
              title="1-Click Emergency SOS"
            >
              <ShieldAlert size={14} />
              <span className="hidden sm:inline">SOS</span>
            </button>
          )}

          {/* Cart Trigger (Only visible after login) */}
          {user && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full border border-charcoal/10 dark:border-dark-border bg-cream dark:bg-dark-card text-charcoal dark:text-dark-text hover:text-olive-700 dark:hover:text-olive-400 transition-colors shadow-xs"
              aria-label="Open Cart"
              title="Cart"
            >
              <ShoppingBag size={17} />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-olive-700 text-cream text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {totalCount}
                </span>
              )}
            </button>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Language Switcher */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-charcoal/70 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text hover:bg-ivory dark:hover:bg-dark-card transition-colors"
              aria-haspopup="listbox"
              aria-expanded={langOpen}
            >
              <Globe size={15} />
              <span>{currentLabel}</span>
              <ChevronDown size={13} className={`transition-transform ${langOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  role="listbox"
                  className="absolute right-0 mt-2 w-40 rounded-2xl bg-cream dark:bg-dark-card shadow-nav border border-charcoal/5 dark:border-dark-border p-1.5 overflow-hidden z-50"
                >
                  {languageOptions.map((opt) => (
                    <li key={opt.code}>
                      <button
                        role="option"
                        aria-selected={current === opt.code}
                        onClick={() => {
                          setLanguage(opt.code);
                          setLangOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium ${
                          current === opt.code
                            ? "bg-olive-100 dark:bg-olive-900/50 text-olive-800 dark:text-olive-300 font-bold"
                            : "hover:bg-ivory dark:hover:bg-dark-surface text-charcoal dark:text-dark-text"
                        }`}
                      >
                        {opt.label}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Account or Login / Register */}
          {user ? (
            <Link
              to={`/${user.role}`}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-olive-100 dark:bg-olive-900/50 text-olive-900 dark:text-olive-200 text-xs font-bold hover:bg-olive-200 transition-colors"
            >
              <User size={14} />
              <span className="capitalize">{user.role}</span>
            </Link>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                to="/login"
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-charcoal/80 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text hover:bg-charcoal/5 dark:hover:bg-white/5 transition-colors"
              >
                <LogIn size={14} />
                <span>Log in</span>
              </Link>
              <Button as={Link} to="/register" size="sm" className="hidden xs:inline-flex text-xs py-1.5 px-3.5">
                Join
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 -mr-1 text-charcoal dark:text-dark-text"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="container-kare mt-2 md:hidden"
          >
            <div className="rounded-3xl bg-cream dark:bg-dark-surface shadow-nav border border-charcoal/5 dark:border-dark-border p-4 flex flex-col gap-1">
              {activeNavList.map((item) => (
                <NavLink
                  key={item.key}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-2xl text-sm font-semibold ${
                      isActive
                        ? "bg-olive-100 dark:bg-olive-900/50 text-olive-800 dark:text-olive-300 font-bold"
                        : "text-charcoal/80 dark:text-dark-muted"
                    }`
                  }
                >
                  {t(`nav.${item.key}`) || item.key}
                </NavLink>
              ))}

              <div className="h-px bg-charcoal/10 dark:bg-dark-border my-2" />

              {/* Contact Us button in mobile drawer – visible to all */}
              {onOpenContact && (
                <button
                  onClick={() => { onOpenContact(); setOpen(false); }}
                  className="px-4 py-3 rounded-2xl text-sm font-semibold text-charcoal/80 dark:text-dark-muted text-left"
                >
                  {t("nav.contact") || "Contact"}
                </button>
              )}

              <div className="h-px bg-charcoal/10 dark:bg-dark-border my-2" />

              {/* Language Selection inside drawer */}
              <div className="flex flex-wrap gap-1.5 px-2 pb-1">
                {languageOptions.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => setLanguage(opt.code)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      current === opt.code
                        ? "bg-olive-700 text-cream border-olive-700"
                        : "border-charcoal/15 dark:border-dark-border text-charcoal/70 dark:text-dark-muted"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {!user ? (
                <div className="pt-2 flex flex-col gap-2">
                  <Button as={Link} to="/login" variant="outline" onClick={() => setOpen(false)}>
                    Log in
                  </Button>
                  <Button as={Link} to="/register" onClick={() => setOpen(false)}>
                    Create Free Account
                  </Button>
                </div>
              ) : (
                <Button as={Link} to={`/${user.role}`} className="mt-2" onClick={() => setOpen(false)}>
                  Go to {user.role.toUpperCase()} Dashboard
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
