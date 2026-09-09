import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Search, User, ShoppingBag, ShieldAlert, HelpCircle, LogIn } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";

export default function BottomNav({ onOpenEmergency }) {
  const location = useLocation();
  const { user } = useAuth();
  const { totalCount, setIsCartOpen } = useCart();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  if (isAuthPage) return null;

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-3 left-3 right-3 z-40 md:hidden flex justify-center pointer-events-none"
    >
      <div className="w-full max-w-md bg-cream/95 dark:bg-dark-surface/95 backdrop-blur-xl border border-charcoal/10 dark:border-dark-border rounded-full shadow-2xl p-1.5 flex items-center justify-around pointer-events-auto transition-all">
        {/* Home Tab (Always available) */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center py-1.5 px-3 rounded-full text-xs font-medium transition-all ${
              isActive ? "text-olive-900 dark:text-olive-300 font-bold" : "text-charcoal/60 dark:text-dark-muted"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.div
                  layoutId="activeBottomTab"
                  className="absolute inset-0 bg-olive-100 dark:bg-olive-900/50 rounded-full -z-10 shadow-xs"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <Home size={18} className={isActive ? "text-olive-700 dark:text-olive-400" : "text-charcoal/60 dark:text-dark-muted"} />
              <span className="text-[10px] mt-0.5">Home</span>
            </>
          )}
        </NavLink>

        {/* Before Login: How It Works & Sign In */}
        {!user ? (
          <>
            <NavLink
              to="/how-it-works"
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center py-1.5 px-3 rounded-full text-xs font-medium transition-all ${
                  isActive ? "text-olive-900 dark:text-olive-300 font-bold" : "text-charcoal/60 dark:text-dark-muted"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeBottomTab"
                      className="absolute inset-0 bg-olive-100 dark:bg-olive-900/50 rounded-full -z-10 shadow-xs"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <HelpCircle size={18} className={isActive ? "text-olive-700 dark:text-olive-400" : "text-charcoal/60 dark:text-dark-muted"} />
                  <span className="text-[10px] mt-0.5">How it Works</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/login"
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center py-1.5 px-3 rounded-full text-xs font-medium transition-all ${
                  isActive ? "text-olive-900 dark:text-olive-300 font-bold" : "text-charcoal/60 dark:text-dark-muted"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeBottomTab"
                      className="absolute inset-0 bg-olive-100 dark:bg-olive-900/50 rounded-full -z-10 shadow-xs"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <LogIn size={18} className={isActive ? "text-olive-700 dark:text-olive-400" : "text-charcoal/60 dark:text-dark-muted"} />
                  <span className="text-[10px] mt-0.5">Sign In</span>
                </>
              )}
            </NavLink>
          </>
        ) : (
          /* After Login: Full Feature Set */
          <>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center py-1.5 px-3 rounded-full text-xs font-medium transition-all ${
                  isActive ? "text-olive-900 dark:text-olive-300 font-bold" : "text-charcoal/60 dark:text-dark-muted"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeBottomTab"
                      className="absolute inset-0 bg-olive-100 dark:bg-olive-900/50 rounded-full -z-10 shadow-xs"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <Search size={18} className={isActive ? "text-olive-700 dark:text-olive-400" : "text-charcoal/60 dark:text-dark-muted"} />
                  <span className="text-[10px] mt-0.5">Services</span>
                </>
              )}
            </NavLink>

            {/* Center Emergency SOS Button */}
            {onOpenEmergency && (
              <button
                onClick={onOpenEmergency}
                className="flex flex-col items-center justify-center -mt-4 p-2.5 rounded-full bg-rose-600 text-white shadow-lg ring-4 ring-cream dark:ring-dark-bg animate-pulse active:scale-95 transition-all"
                title="1-Click Emergency SOS"
              >
                <ShieldAlert size={20} />
                <span className="text-[9px] font-black uppercase tracking-tight">SOS</span>
              </button>
            )}

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex flex-col items-center justify-center py-1.5 px-3 rounded-full text-xs font-medium text-charcoal/60 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text transition-all"
            >
              <span className="relative">
                <ShoppingBag size={18} />
                {totalCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 rounded-full bg-olive-700 text-cream text-[9px] font-bold flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </span>
              <span className="text-[10px] mt-0.5">Cart</span>
            </button>

            {/* Account / Dashboard */}
            <NavLink
              to={`/${user.role}`}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center py-1.5 px-3 rounded-full text-xs font-medium transition-all ${
                  isActive ? "text-olive-900 dark:text-olive-300 font-bold" : "text-charcoal/60 dark:text-dark-muted"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeBottomTab"
                      className="absolute inset-0 bg-olive-100 dark:bg-olive-900/50 rounded-full -z-10 shadow-xs"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <User size={18} className={isActive ? "text-olive-700 dark:text-olive-400" : "text-charcoal/60 dark:text-dark-muted"} />
                  <span className="text-[10px] mt-0.5">Account</span>
                </>
              )}
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
