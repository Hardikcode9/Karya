import { useState } from "react";
import { ShieldCheck, Eye, EyeOff, LogIn, AlertTriangle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
    } catch (err) {
      setError(
        err.message === "Access denied. Admin credentials required."
          ? err.message
          : err.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-charcoal via-charcoal/95 to-olive-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-olive-600/20 border border-olive-500/30 mb-4">
            <ShieldCheck size={32} className="text-olive-400" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Karya Admin</h1>
          <p className="text-white/50 text-sm mt-1">District Administrator Console</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 space-y-5"
        >
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs font-semibold">
              <AlertTriangle size={14} />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-white/70 text-xs font-bold uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@karya.in"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-olive-500/50 focus:ring-1 focus:ring-olive-500/30 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-white/70 text-xs font-bold uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-olive-500/50 focus:ring-1 focus:ring-olive-500/30 transition-all pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-olive-600 hover:bg-olive-500 text-white text-sm font-bold shadow-lg shadow-olive-900/40 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={16} />
                <span>Sign In to Admin Console</span>
              </>
            )}
          </button>

          <p className="text-center text-white/30 text-[11px]">
            Authorized district administrators only
          </p>
        </form>
      </div>
    </div>
  );
}
