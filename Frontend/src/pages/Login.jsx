import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Sparkles, ShieldCheck } from "lucide-react";
import Logo from "../components/ui/Logo";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

const roles = [
  { id: "customer", label: "Customer", path: "/customer", badge: "Household" },
  { id: "worker", label: "Worker", path: "/worker", badge: "Technician" },
  { id: "shg", label: "SHG Group", path: "/shg", badge: "Artisan Hub" },
];

export default function Login() {
  const [role, setRole] = useState("customer");
  const [loginMethod, setLoginMethod] = useState("otp"); // 'otp' or 'password'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      toast.success(`OTP code sent to ${email}`);
    }, 600);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loginMethod === "password" && (!email || !password)) {
      toast.error("Please enter both email and password");
      return;
    }
    setLoading(true);
    setTimeout(async () => {
      await login({ role, email: email || "user@example.com" });
      setLoading(false);
      toast.success(`Logged in as ${role.toUpperCase()}`);
      navigate(roles.find((r) => r.id === role).path);
    }, 600);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_1fr] bg-cream dark:bg-dark-bg">
      {/* Left Brand Panel (Desktop only - Herlyy aesthetic) */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-olive-950 via-olive-900 to-charcoal text-cream relative overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-olive-700/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Top brand header */}
        <div className="relative z-10">
          <Link to="/" className="inline-block">
            <Logo />
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-olive-300 text-xs font-semibold ml-4">
            <Sparkles size={13} />
            <span>Hyperlocal Portal</span>
          </div>
        </div>

        {/* Middle storytelling pitch */}
        <div className="relative z-10 max-w-lg space-y-6">
          <h2 className="font-display text-4xl xl:text-5xl leading-tight font-light text-white">
            Connecting rural artisans, technicians, and households across Bharat.
          </h2>
          <p className="text-cream/70 text-base leading-relaxed">
            Zero platform deductions, instant Aadhaar verification, and 100% direct payouts straight to village bank accounts.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div>
              <p className="font-display text-2xl font-bold text-olive-300">15,000+</p>
              <p className="text-xs text-cream/60 mt-0.5">Verified local workers</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-amber-300">₹0 Fee</p>
              <p className="text-xs text-cream/60 mt-0.5">Middleman commission</p>
            </div>
          </div>
        </div>

        {/* Bottom trust footer */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-cream/60">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span>Secured by Bharat Digital Public Infrastructure Standards</span>
        </div>
      </div>

      {/* Right Login Container */}
      <div className="flex flex-col justify-center items-center px-4 sm:px-8 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile Header Logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-dark-card rounded-3xl p-6 sm:p-8 border border-charcoal/10 dark:border-dark-border shadow-elevation-2">
            <div className="mb-6">
              <h1 className="font-display text-2xl sm:text-3xl text-charcoal dark:text-dark-text font-medium">
                Sign in to Karya
              </h1>
              <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted mt-1">
                Select your account type and access your dashboard.
              </p>
            </div>

            {/* Role Switcher Pills */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-cream dark:bg-dark-surface border border-charcoal/5 dark:border-dark-border mb-6">
              {roles.map((r) => {
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isSelected
                        ? "bg-white dark:bg-dark-card text-olive-900 dark:text-olive-300 shadow-xs font-bold"
                        : "text-charcoal/60 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text"
                    }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>

            {/* Login Method Toggle */}
            <div className="flex items-center gap-4 border-b border-charcoal/10 dark:border-dark-border pb-3 mb-5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setLoginMethod("otp"); setOtpSent(false); }}
                className={`transition-colors pb-1 border-b-2 ${
                  loginMethod === "otp"
                    ? "border-olive-700 text-olive-800 dark:text-olive-300 font-bold"
                    : "border-transparent text-charcoal/50 dark:text-dark-muted"
                }`}
              >
                1-Click Email OTP
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod("password")}
                className={`transition-colors pb-1 border-b-2 ${
                  loginMethod === "password"
                    ? "border-olive-700 text-olive-800 dark:text-olive-300 font-bold"
                    : "border-transparent text-charcoal/50 dark:text-dark-muted"
                }`}
              >
                Password Login
              </button>
            </div>

            {/* Form */}
            <form onSubmit={otpSent || loginMethod === "password" ? handleSubmit : handleSendOtp} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={Mail}
                required
              />

              {loginMethod === "otp" && otpSent && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    label="Enter 6-Digit Email OTP"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    helperText="Demo test: Any 6 digits will work"
                    required
                  />
                </motion.div>
              )}

              {loginMethod === "password" && (
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={Lock}
                  required
                />
              )}

              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={loading}
                className="mt-2"
              >
                {loginMethod === "otp" && !otpSent ? (
                  "Send Instant OTP"
                ) : (
                  `Sign in as ${roles.find((r) => r.id === role)?.label}`
                )}
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-charcoal/10 dark:border-dark-border text-center">
              <p className="text-xs text-charcoal/60 dark:text-dark-muted">
                Don't have an account yet?{" "}
                <Link to="/register" className="text-olive-700 dark:text-olive-400 font-bold hover:underline">
                  Create Account →
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
