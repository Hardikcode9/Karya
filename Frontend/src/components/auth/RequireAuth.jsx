import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, UserCheck, ShieldAlert } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";

export default function RequireAuth({ children, roleRequired }) {
  const { user, login } = useAuth();

  if (user) {
    if (roleRequired && user.role !== roleRequired && user.role !== "admin") {
      return (
        <div className="min-h-[70vh] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-cream-card dark:bg-dark-card border border-charcoal/10 dark:border-dark-border rounded-3xl p-6 sm:p-8 text-center shadow-elevation-2 space-y-4"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 flex items-center justify-center">
              <ShieldAlert size={26} />
            </div>
            <h2 className="font-display text-2xl text-charcoal dark:text-dark-text">
              Role Mismatch
            </h2>
            <p className="text-xs text-charcoal/65 dark:text-dark-muted">
              You are currently logged in as <span className="font-bold uppercase">{user.role}</span>, but this area is restricted to <span className="font-bold uppercase">{roleRequired}</span>.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <Button onClick={() => login({ role: roleRequired })} size="md">
                Switch to {roleRequired.toUpperCase()} Profile
              </Button>
              <Button as={Link} to={`/${user.role}`} variant="outline" size="md">
                Go to My Dashboard
              </Button>
            </div>
          </motion.div>
        </div>
      );
    }
    return children;
  }

  const handleDemoLogin = async (role) => {
    await login({ role });
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-cream-card dark:bg-dark-card border border-charcoal/10 dark:border-dark-border rounded-3xl p-6 sm:p-8 text-center shadow-elevation-2 space-y-5"
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 flex items-center justify-center shadow-xs">
          <Lock size={28} />
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-olive-800 dark:text-olive-300 bg-olive-100 dark:bg-olive-900/40 px-3 py-1 rounded-full">
            Protected Tab • Login Required
          </span>
          <h2 className="font-display text-2xl sm:text-3xl text-charcoal dark:text-dark-text mt-2.5 font-medium">
            Member Access Only
          </h2>
          <p className="text-xs text-charcoal/65 dark:text-dark-muted mt-1.5 leading-relaxed">
            Village service directories, live bookings, emergency dispatch, and specialist dashboards require a verified Karya account.
          </p>
        </div>

        <div className="space-y-2 pt-1">
          <Button as={Link} to="/login" fullWidth size="lg" icon>
            Sign In with Phone
          </Button>
          <Button as={Link} to="/register" variant="outline" fullWidth size="lg">
            Create Free Account
          </Button>
        </div>

        <div className="pt-4 border-t border-charcoal/10 dark:border-dark-border">
          <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50 dark:text-dark-muted mb-2.5">
            Quick 1-Click Demo Login
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "customer", label: "Customer" },
              { id: "worker", label: "Worker" },
              { id: "shg", label: "SHG Group" },
              { id: "admin", label: "Super Admin" },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => handleDemoLogin(r.id)}
                className="px-3 py-2 bg-white dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border hover:border-olive-500 rounded-xl text-xs font-semibold text-charcoal dark:text-dark-text transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <UserCheck size={13} className="text-olive-700 dark:text-olive-400" />
                <span>{r.label}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
