import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User, Wrench, Users, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, MapPin, Mail
} from "lucide-react";
import Logo from "../components/ui/Logo";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

const roleCards = [
  {
    id: "customer",
    title: "Household / Consumer",
    subtitle: "I need reliable repairs, harvest help, or SHG goods for my family or farm",
    icon: User,
    color: "from-olive-600/10 to-olive-500/5 text-olive-700 dark:text-olive-400",
    pill: "Quick 2-min Setup",
  },
  {
    id: "worker",
    title: "Technician / Worker",
    subtitle: "I am a skilled electrician, plumber, driver, or artisan seeking local work with 0% fee",
    icon: Wrench,
    color: "from-amber-600/10 to-amber-500/5 text-amber-700 dark:text-amber-400",
    pill: "Earn Daily Wages",
  },
  {
    id: "shg",
    title: "Self-Help Group (SHG)",
    subtitle: "We are a women's collective or federation selling crafts, organic food & group services",
    icon: Users,
    color: "from-emerald-600/10 to-emerald-500/5 text-emerald-700 dark:text-emerald-400",
    pill: "Cooperative Hub",
  },
];

export default function Register() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("customer");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    village: "",
    skillOrCatalog: "",
    aadhaarOrReg: "",
  });
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 2) {
      if (!formData.name || !formData.email || !formData.phone || !formData.password) {
        toast.error("Please provide name, email, phone and password");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error("Please provide a valid email address");
        return;
      }
    }
    setStep((s) => s + 1);
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await register({ role, ...formData });
      setRegistered(true);
      toast.success("Account created! Please log in.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-dark-bg flex flex-col justify-between py-8 px-4 sm:px-6">
      {/* Top Bar */}
      <div className="container-app w-full flex items-center justify-between">
        <Link to="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-charcoal/50 dark:text-dark-muted hidden xs:inline">Already registered?</span>
          <Link
            to="/login"
            className="px-3.5 py-1.5 rounded-full border border-charcoal/15 dark:border-dark-border text-xs font-semibold text-charcoal dark:text-dark-text hover:bg-charcoal/5 dark:hover:bg-white/5 transition-colors"
          >
            Log in
          </Link>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="container-app w-full my-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-card rounded-3xl p-6 sm:p-10 border border-charcoal/10 dark:border-dark-border shadow-elevation-2"
        >
          {/* Progress Step Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-olive-700 dark:text-olive-400">
                Step {step} of 3
              </span>
              <span className="text-xs text-charcoal/50 dark:text-dark-muted font-medium">
                {step === 1 ? "Select Account Role" : step === 2 ? "Basic Profile" : "Instant Verification"}
              </span>
            </div>
            {/* Step Pills */}
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    s <= step ? "bg-olive-700 dark:bg-olive-500" : "bg-charcoal/10 dark:bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step 1: Role Selection */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="mb-6">
                <h2 className="font-display text-2xl sm:text-3xl text-charcoal dark:text-dark-text font-medium">
                  How will you use Karya?
                </h2>
                <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted mt-1">
                  Choose your account profile to customize your dashboard experience.
                </p>
              </div>

              <div className="space-y-3">
                {roleCards.map((rc) => {
                  const IconComp = rc.icon;
                  const isSelected = role === rc.id;
                  return (
                    <div
                      key={rc.id}
                      onClick={() => setRole(rc.id)}
                      className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start gap-4 select-none ${
                        isSelected
                          ? "border-olive-600 bg-olive-50/50 dark:bg-olive-950/40 ring-2 ring-olive-500/20 shadow-sm"
                          : "border-charcoal/10 dark:border-dark-border hover:border-charcoal/25 dark:hover:border-olive-800"
                      }`}
                    >
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${rc.color} shrink-0`}>
                        <IconComp size={22} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-sm sm:text-base text-charcoal dark:text-dark-text">
                            {rc.title}
                          </h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-charcoal/5 dark:bg-white/10 text-charcoal/70 dark:text-dark-muted">
                            {rc.pill}
                          </span>
                        </div>
                        <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-1 leading-relaxed">
                          {rc.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-end">
                <Button size="lg" onClick={() => setStep(2)} rightIcon={ArrowRight}>
                  Continue with {roleCards.find((r) => r.id === role)?.title.split("/")[0]}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Personal & Village Details */}
          {step === 2 && (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleNextStep}
              className="space-y-4"
            >
              <div className="mb-6">
                <h2 className="font-display text-2xl sm:text-3xl text-charcoal dark:text-dark-text font-medium">
                  {role === "shg" ? "Group Information" : "Your Details"}
                </h2>
                <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted mt-1">
                  Tell us where you are located so local neighbors can find you.
                </p>
              </div>

              <Input
                label={role === "shg" ? "SHG Collective Name" : "Full Name"}
                placeholder={role === "shg" ? "e.g. Mahila Pragati SHG" : "e.g. Rajesh Patil"}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <Input
                label={role === "shg" ? "Official Contact Email" : "Email Address"}
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                leftIcon={Mail}
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />

              <Input
                label="Village / Gram Panchayat & District"
                placeholder="e.g. Rampur Kalan, District Satna"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                leftIcon={MapPin}
                required
              />

              {role !== "customer" && (
                <Input
                  label={role === "worker" ? "Primary Trade / Skills" : "Specialty Products / Services"}
                  placeholder={role === "worker" ? "e.g. Electrician, Motor Rewinding" : "e.g. Organic Pickles, Handloom Sarees"}
                  value={formData.skillOrCatalog}
                  onChange={(e) => setFormData({ ...formData, skillOrCatalog: e.target.value })}
                  required
                />
              )}

              <div className="pt-4 flex items-center justify-between">
                <Button variant="ghost" size="md" onClick={() => setStep(1)} leftIcon={ArrowLeft}>
                  Back
                </Button>
                <Button type="submit" size="lg" rightIcon={ArrowRight}>
                  Next: Verification
                </Button>
              </div>
            </motion.form>
          )}

          {/* Step 3: Verification & Finish */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="mb-4">
                <h2 className="font-display text-2xl sm:text-3xl text-charcoal dark:text-dark-text font-medium">
                  Instant Verification
                </h2>
                <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted mt-1">
                  Karya uses zero-trust safety to ensure every village connection is authentic.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-cream dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border space-y-3">
                <div className="flex items-center gap-2 text-olive-800 dark:text-olive-300 font-bold text-xs">
                  <ShieldCheck size={16} />
                  <span>Aadhaar KYC & Trust Shield</span>
                </div>
                <Input
                  label={role === "shg" ? "NRLM / SHG Registration ID (Optional)" : "Aadhaar Number (Last 4 digits for demo)"}
                  placeholder="XXXX-XXXX-1234"
                  value={formData.aadhaarOrReg}
                  onChange={(e) => setFormData({ ...formData, aadhaarOrReg: e.target.value })}
                  helperText="Data encrypted according to Digital Personal Data Protection guidelines."
                />
              </div>

              {/* Summary Pill Preview */}
              <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border space-y-2 text-xs">
                <p className="font-bold text-charcoal dark:text-dark-text">Account Preview:</p>
                <p className="text-charcoal/70 dark:text-dark-muted">
                  • Role: <span className="font-semibold text-charcoal dark:text-dark-text">{role.toUpperCase()}</span>
                </p>
                <p className="text-charcoal/70 dark:text-dark-muted">
                  • Name: <span className="font-semibold text-charcoal dark:text-dark-text">{formData.name || "Test User"}</span>
                </p>
                <p className="text-charcoal/70 dark:text-dark-muted">
                  • Email: <span className="font-semibold text-charcoal dark:text-dark-text">{formData.email || "name@example.com"}</span>
                </p>
                <p className="text-charcoal/70 dark:text-dark-muted">
                  • Location: <span className="font-semibold text-charcoal dark:text-dark-text">{formData.village || "Local Village Block"}</span>
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Button variant="ghost" size="md" onClick={() => setStep(2)} leftIcon={ArrowLeft}>
                  Back
                </Button>
                <Button size="lg" loading={loading} onClick={handleFinish} rightIcon={CheckCircle2}>
                  {registered ? "Redirecting..." : "Complete Registration"}
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Bottom Footer */}
      <div className="container-app w-full text-center text-xs text-charcoal/50 dark:text-dark-muted">
        By registering, you agree to Karya's Village Fair Trade & Direct Payout Charter.
      </div>
    </div>
  );
}
