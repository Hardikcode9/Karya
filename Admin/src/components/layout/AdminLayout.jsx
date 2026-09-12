import { useState, useRef, useEffect, useMemo } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, UserCheck, Users2, Users, Settings2, Package,
  Lightbulb, HelpCircle, IndianRupee, PhoneCall, Sliders, Menu, X,
  LogOut, Globe, ChevronDown, Check, ShieldCheck, Search
} from "lucide-react";
import Logo from "../ui/Logo";
import ThemeToggle from "../ui/ThemeToggle";
import { useAuth } from "../../hooks/useAuth";
import { LANGUAGE_OPTIONS } from "../../constants/languages";
import { changeGoogleTranslate } from "../../utils/googleTranslate";

const adminNav = [
  { to: "/", end: true, label: "Dashboard", icon: LayoutDashboard },
  { to: "/workers", label: "Worker", icon: UserCheck },
  { to: "/shgs", label: "SGH group", icon: Users2 },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/services", label: "Services", icon: Settings2 },
  { to: "/products", label: "Product", icon: Package },
  { to: "/suggestions", label: "Suggestion", icon: Lightbulb },
  { to: "/queries", label: "Query", icon: HelpCircle },
  { to: "/sales", label: "Sales", icon: IndianRupee },
  { to: "/contact", label: "Contact", icon: PhoneCall },
  { to: "/others", label: "Others", icon: Sliders },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [langSearch, setLangSearch] = useState("");
  const [currentLang, setCurrentLang] = useState(() => {
    try {
      return localStorage.getItem("karya-admin-language") || "en";
    } catch (e) {
      return "en";
    }
  });
  const langMenuRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // On initial mount, apply saved language if not English
  useEffect(() => {
    try {
      const saved = localStorage.getItem("karya-admin-language");
      if (saved && saved !== "en") {
        changeGoogleTranslate(saved);
      }
    } catch (e) {
      // Ignore localStorage read errors
    }
  }, []);

  // Filter 23 languages by search query
  const filteredLanguages = useMemo(() => {
    if (!langSearch.trim()) return LANGUAGE_OPTIONS;
    const q = langSearch.toLowerCase().trim();
    return LANGUAGE_OPTIONS.filter(
      (l) =>
        l.label.toLowerCase().includes(q) ||
        l.english?.toLowerCase().includes(q) ||
        l.native?.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q) ||
        (l.region && l.region.toLowerCase().includes(q))
    );
  }, [langSearch]);

  // Close language dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLang = (code) => {
    setCurrentLang(code);
    try {
      localStorage.setItem("karya-admin-language", code);
    } catch (e) {
      // Ignore storage errors
    }
    setLangOpen(false);
    changeGoogleTranslate(code);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out of the Admin Console?")) {
      logout();
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-dark-bg text-charcoal dark:text-dark-text flex flex-col lg:flex-row transition-colors">
      {/* Mobile Drawer Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* 1. Left Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 inset-y-0 left-0 z-50 w-64 h-screen bg-cream-card dark:bg-dark-surface border-r border-charcoal/10 dark:border-dark-border flex flex-col transition-transform duration-300 ease-in-out shrink-0 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-charcoal/10 dark:border-dark-border">
          <Link to="/" onClick={() => setOpen(false)}>
            <Logo />
          </Link>
          <button
            type="button"
            className="lg:hidden p-2 rounded-xl text-charcoal/50 hover:text-charcoal dark:text-dark-muted"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Items (All 11 requested items) */}
        <div className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          <span className="px-3 text-[10px] font-bold text-charcoal/40 dark:text-dark-muted uppercase tracking-wider mb-2">
            Admin Management
          </span>

          {adminNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-olive-700 dark:bg-olive-600 text-white shadow-xs font-bold"
                      : "text-charcoal/70 dark:text-dark-muted hover:bg-charcoal/5 dark:hover:bg-dark-cardHover hover:text-charcoal dark:hover:text-dark-text"
                  }`
                }
              >
                <Icon size={16} className="shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Platform Status Pill */}
        <div className="p-4 border-t border-charcoal/10 dark:border-dark-border">
          <div className="p-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-charcoal dark:text-dark-text">Zero-Commission Mode</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              100% Payout
            </span>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area & Sticky Top Navbar */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-50 h-16 bg-cream/95 dark:bg-dark-bg/95 backdrop-blur-md border-b border-charcoal/10 dark:border-dark-border px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden p-2 rounded-xl text-charcoal/70 dark:text-dark-muted hover:bg-charcoal/5"
              onClick={() => setOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-charcoal/55 dark:text-dark-muted">
              <span>District Governance Portal</span>
              <span>·</span>
              <span className="text-emerald-600 font-semibold">18 Gram Panchayats Active</span>
            </div>
          </div>

          {/* Right Header Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Multilingual Selector (All 22 Constitutional Languages + English) */}
            <div className="relative notranslate" translate="no" ref={langMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setLangOpen(!langOpen);
                  setLangSearch("");
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-dark-card border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text hover:border-olive-600 transition-colors shadow-2xs cursor-pointer notranslate"
                translate="no"
              >
                <Globe size={14} className="text-olive-700 dark:text-olive-400 notranslate" />
                <span className="hidden md:inline notranslate">
                  {LANGUAGE_OPTIONS.find((l) => l.code === currentLang)?.label || "English"}
                </span>
                <ChevronDown size={12} className="notranslate" />
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/15 dark:border-dark-border shadow-xl p-2 z-50 text-xs notranslate" translate="no">
                  <div className="px-2 py-1 border-b border-charcoal/5 dark:border-dark-border mb-2 flex items-center justify-between text-[10px] text-charcoal/50 dark:text-dark-muted font-bold tracking-wider uppercase">
                    <span className="text-olive-800 dark:text-olive-300">22 Official Languages + English</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-olive-100 dark:bg-olive-950 text-olive-800 dark:text-olive-300 font-bold lowercase">
                      i18n
                    </span>
                  </div>

                  {/* Language Search Bar */}
                  <div className="relative mb-2 px-1">
                    <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-dark-muted pointer-events-none" />
                    <input
                      type="text"
                      value={langSearch}
                      onChange={(e) => setLangSearch(e.target.value)}
                      placeholder="Search language / भाषा खोजें..."
                      className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-charcoal/5 dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-xs text-charcoal dark:text-dark-text placeholder:text-charcoal/40 font-medium focus:outline-none focus:border-olive-600 notranslate"
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
                  <div className="max-h-72 overflow-y-auto divide-y divide-charcoal/5 dark:divide-dark-border/40 pr-0.5">
                    {filteredLanguages.length === 0 ? (
                      <div className="py-4 text-center text-xs text-charcoal/50 dark:text-dark-muted">
                        No language found matching "{langSearch}".
                      </div>
                    ) : (
                      filteredLanguages.map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => {
                            handleSelectLang(lang.code);
                            setLangSearch("");
                          }}
                          className={`w-full px-2.5 py-2 text-left flex items-center justify-between rounded-xl hover:bg-charcoal/5 dark:hover:bg-dark-bg cursor-pointer text-charcoal dark:text-dark-text notranslate ${
                            currentLang === lang.code ? "bg-olive-50 dark:bg-olive-950/40 font-bold text-olive-800 dark:text-olive-300" : ""
                          }`}
                          translate="no"
                        >
                          <div className="flex flex-col">
                            <span className="notranslate">{lang.label}</span>
                            {lang.region && (
                              <span className="text-[10px] text-charcoal/45 dark:text-dark-muted notranslate">
                                {lang.region}
                              </span>
                            )}
                          </div>
                          {currentLang === lang.code && <Check size={14} className="text-olive-700 shrink-0" />}
                        </button>
                      ))
                    )}
                  </div>

                  <div className="px-2 py-1.5 border-t border-charcoal/5 dark:border-dark-border mt-2 text-[9px] text-charcoal/50 dark:text-dark-muted flex items-center justify-between">
                    <span>{filteredLanguages.length} of 23 languages</span>
                    <span>8th Schedule &amp; English</span>
                  </div>
                </div>
              )}
            </div>

            {/* Dark / Light Mode Toggle */}
            <ThemeToggle />

            {/* Super Admin User Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-charcoal/10 dark:border-dark-border">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                alt="Super Admin"
                className="w-8 h-8 rounded-full object-cover border-2 border-olive-600/40"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-charcoal dark:text-dark-text leading-tight">
                  {user?.name || "Vikramaditya Solanki"}
                </div>
                <div className="text-[10px] text-olive-800 dark:text-olive-300 font-semibold">
                  Super Admin
                </div>
              </div>
            </div>

            {/* Logout Button in Right Corner */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-300/40 hover:bg-rose-100 transition-colors cursor-pointer"
              title="Logout from Admin Console"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Main Content Router Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
