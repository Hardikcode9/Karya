import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, ShieldCheck, ChevronRight } from "lucide-react";
import Logo from "../ui/Logo";
import OfflineIndicator from "./OfflineIndicator";
import ThemeToggle from "../ui/ThemeToggle";
import { useAuth } from "../../hooks/useAuth";

export default function DashboardLayout({ navItems, roleLabel }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
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

        {/* User Card Pill */}
        <div className="px-5 py-4 border-b border-charcoal/5 dark:border-dark-border bg-white/40 dark:bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-olive-200 dark:bg-olive-900/60 text-olive-800 dark:text-olive-300 flex items-center justify-center font-display font-bold text-sm">
              {user?.name?.charAt(0) || roleLabel?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-charcoal dark:text-dark-text truncate">
                {user?.name || `${roleLabel} Account`}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck size={12} />
                <span>Verified • {roleLabel}</span>
              </div>
            </div>
          </div>
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
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
          <ThemeToggle />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Sticky Mobile Dashboard Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-cream/95 dark:bg-dark-surface/95 backdrop-blur border-b border-charcoal/10 dark:border-dark-border px-4 py-3 flex items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setOpen(true)}
              className="p-2 rounded-xl border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text"
              aria-label="Open menu"
            >
              <Menu size={18} />
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
