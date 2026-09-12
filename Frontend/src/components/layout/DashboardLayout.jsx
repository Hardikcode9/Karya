import { useState, useRef, useEffect, useMemo } from "react";
import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Menu, X, LogOut, ShieldCheck, ChevronRight,
  Globe, ChevronDown, Check, Sparkles, Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../ui/Logo";
import OfflineIndicator from "./OfflineIndicator";
import ThemeToggle from "../ui/ThemeToggle";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../hooks/useLanguage";

export default function DashboardLayout({ navItems, roleLabel }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { current, setLanguage, languageOptions } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const [langSearch, setLangSearch] = useState("");
  const langMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isProfileActive = location.pathname.includes("/profile");

  // Real-time language filter
  const filteredLanguages = useMemo(() => {
    if (!langSearch.trim()) return languageOptions;
    const q = langSearch.toLowerCase().trim();
    return languageOptions.filter(
      (l) =>
        l.label.toLowerCase().includes(q) ||
        l.english?.toLowerCase().includes(q) ||
        l.native?.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q) ||
        (l.region && l.region.toLowerCase().includes(q))
    );
  }, [langSearch, languageOptions]);

  // Close language popup on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLabel =
    languageOptions.find((l) => l.code === current)?.label || "English";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const workerName =
    user?.name ||
    (roleLabel === "Worker" ? "Ramesh Kumar" : `${roleLabel || "User"}`);

  const workerPhoto =
    user?.photo ||
    user?.avatar ||
    (roleLabel === "Worker"
      ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
      : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80");

  return (
    <div className="min-h-screen bg-cream dark:bg-dark-bg text-charcoal dark:text-dark-text flex flex-col lg:flex-row transition-colors">
      {/* Mobile Drawer Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 inset-y-0 left-0 z-50 w-72 h-screen bg-cream-card dark:bg-dark-surface border-r border-charcoal/10 dark:border-dark-border flex flex-col transition-transform duration-300 ease-kare shrink-0 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between border-b border-charcoal/5 dark:border-dark-border">
          <Link to="/" onClick={() => setOpen(false)}>
            <Logo />
          </Link>
          <button
            className="lg:hidden p-2 rounded-xl text-charcoal/50 hover:text-charcoal dark:text-dark-muted"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav Items */}
        <div className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          <span className="px-3 text-[10px] font-bold text-charcoal/40 dark:text-dark-muted uppercase tracking-wider mb-2">
            Navigation Menu
          </span>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-olive-700 dark:bg-olive-600 text-cream shadow-xs"
                    : "text-charcoal/70 dark:text-dark-muted hover:bg-ivory dark:hover:bg-dark-cardHover hover:text-charcoal dark:hover:text-dark-text"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon size={17} />
                <span>{item.label}</span>
              </div>
              <ChevronRight size={14} className="opacity-40" />
            </NavLink>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-charcoal/5 dark:border-dark-border flex items-center justify-between">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
          <ThemeToggle />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* RIGHT SIDE TOP NAVIGATION BAR */}
        <header className="sticky top-0 z-30 bg-cream/90 dark:bg-dark-surface/90 backdrop-blur-md border-b border-charcoal/10 dark:border-dark-border px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between transition-colors shadow-2xs">
          {/* Left of Nav Bar: Mobile Menu Button & Desk Indicator */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text hover:bg-charcoal/5 cursor-pointer"
              aria-label="Open menu"
            >
              <Menu size={19} />
            </button>
            <div className="lg:hidden">
              <Link to="/" onClick={() => setOpen(false)}>
                <Logo />
              </Link>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-charcoal/60 dark:text-dark-muted">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Karya Village Hub</span>
              <span className="opacity-40">•</span>
              <span className="text-charcoal/80 dark:text-dark-text font-bold">
                {roleLabel} Desk
              </span>
            </div>
          </div>

          {/* Right of Nav Bar: Multilingual Toggle, Theme, Worker Profile Button & Logout in Right Corner */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 1. Multilingual Feature Toggle Button & Dropdown (22 Constitutional + English) */}
            <div className="relative notranslate" translate="no" ref={langMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setLangOpen((v) => !v);
                  setLangSearch("");
                }}
                className="h-9 px-2.5 sm:px-3 flex items-center gap-1.5 rounded-full border border-charcoal/15 dark:border-dark-border bg-white dark:bg-dark-card text-charcoal/80 dark:text-dark-text hover:border-olive-600/50 text-xs font-bold transition-all shadow-2xs notranslate cursor-pointer"
                translate="no"
                aria-label="Select Language"
              >
                <Globe size={14} className="text-olive-700 dark:text-olive-400 shrink-0 notranslate" />
                <span className="hidden sm:inline notranslate">{currentLabel}</span>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 opacity-60 notranslate ${
                    langOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    role="dialog"
                    className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-dark-card shadow-lg border border-charcoal/10 dark:border-dark-border p-2 z-50 notranslate"
                    translate="no"
                  >
                    <div className="px-2 py-1 border-b border-charcoal/5 dark:border-dark-border mb-2 flex items-center justify-between text-[10px] text-charcoal/50 dark:text-dark-muted font-bold tracking-wider uppercase">
                      <span className="flex items-center gap-1 text-olive-800 dark:text-olive-300">
                        <Sparkles size={11} className="text-amber-500" />
                        <span>22 Official Languages + English</span>
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-olive-100 dark:bg-olive-950/60 text-olive-800 dark:text-olive-300 font-bold lowercase">
                        i18n &amp; translate
                      </span>
                    </div>

                    {/* Search Bar for Languages */}
                    <div className="relative mb-2 px-1">
                      <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-dark-muted pointer-events-none" />
                      <input
                        type="text"
                        value={langSearch}
                        onChange={(e) => setLangSearch(e.target.value)}
                        placeholder="Search language / भाषा खोजें..."
                        className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-charcoal/5 dark:bg-dark-surface border border-charcoal/15 dark:border-dark-border text-xs text-charcoal dark:text-dark-text placeholder:text-charcoal/40 dark:placeholder:text-dark-muted font-medium focus:outline-none focus:border-olive-600 notranslate"
                        translate="no"
                        autoFocus
                      />
                      {langSearch && (
                        <button
                          type="button"
                          onClick={() => setLangSearch("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal p-0.5"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>

                    {/* Languages List */}
                    <ul role="listbox" className="max-h-72 overflow-y-auto divide-y divide-charcoal/5 dark:divide-dark-border/40 pr-0.5">
                      {filteredLanguages.length === 0 ? (
                        <li className="py-4 text-center text-xs text-charcoal/50 dark:text-dark-muted">
                          No language found matching "{langSearch}".
                        </li>
                      ) : (
                        filteredLanguages.map((opt) => (
                          <li key={opt.code}>
                            <button
                              type="button"
                              role="option"
                              aria-selected={current === opt.code}
                              onClick={() => {
                                setLanguage(opt.code);
                                setLangOpen(false);
                                setLangSearch("");
                              }}
                              className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors notranslate cursor-pointer ${
                                current === opt.code
                                  ? "bg-olive-100 dark:bg-olive-900/50 text-olive-900 dark:text-olive-200 font-bold"
                                  : "hover:bg-charcoal/5 dark:hover:bg-dark-surface text-charcoal dark:text-dark-text"
                              }`}
                              translate="no"
                            >
                              <div className="flex flex-col">
                                <span className="font-semibold text-xs notranslate">{opt.label}</span>
                                {opt.region && (
                                  <span className="text-[10px] text-charcoal/45 dark:text-dark-muted notranslate">
                                    {opt.region}
                                  </span>
                                )}
                              </div>
                              {current === opt.code && (
                                <Check size={14} className="text-olive-700 dark:text-olive-400 shrink-0" />
                              )}
                            </button>
                          </li>
                        ))
                      )}
                    </ul>

                    <div className="px-2 py-1.5 border-t border-charcoal/5 dark:border-dark-border mt-2 text-[9px] text-charcoal/50 dark:text-dark-muted flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{filteredLanguages.length} of 23 languages</span>
                      </span>
                      <span>8th Schedule &amp; English</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle Button */}
            <ThemeToggle className="h-9 w-9 flex items-center justify-center" />

            {/* 2. Worker Name Button with Circular Photo */}
            <Link
              to={`/${user?.role || "worker"}/profile`}
              className={`flex items-center gap-2 pl-1 pr-2.5 sm:pr-3.5 py-1 rounded-full border transition-all group cursor-pointer shadow-2xs hover:shadow-xs ${
                isProfileActive
                  ? "border-olive-600 bg-olive-50 dark:bg-olive-950/40 text-olive-800 dark:text-olive-300 ring-2 ring-olive-500/20"
                  : "border-charcoal/15 dark:border-dark-border bg-white dark:bg-dark-card hover:border-olive-600/60"
              }`}
              title="View Worker Profile"
            >
              <img
                src={workerPhoto}
                alt={workerName}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-olive-600/40 dark:border-olive-400/50 shadow-xs shrink-0"
              />
              <div className="flex flex-col text-left leading-tight">
                <span className="text-xs font-bold text-charcoal dark:text-dark-text group-hover:text-olive-700 dark:group-hover:text-olive-300 transition-colors truncate max-w-[110px] sm:max-w-[150px]">
                  {workerName}
                </span>
                <span className="hidden sm:inline text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  {roleLabel || "Worker"}
                </span>
              </div>
            </Link>

            {/* 3. Logout Button at Far Right Corner */}
            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out of Account"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200/70 dark:border-rose-800/50 transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Dashboard Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto pb-24 lg:pb-8">
          <Outlet />
        </main>
      </div>

      <OfflineIndicator />
    </div>
  );
}
