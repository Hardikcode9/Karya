import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShieldCheck, MapPin, Star, Zap, CheckCircle2, ArrowRight, PhoneCall, Sparkles } from "lucide-react";
import Button from "../ui/Button";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden pt-28 sm:pt-36 pb-16 sm:pb-24 min-h-[90vh] flex items-center">
      {/* Ambient Gradient Orbs (Herlyy aesthetic) */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-olive-400/20 via-olive-200/10 to-amber-200/15 rounded-full blur-3xl pointer-events-none -z-10 dark:from-olive-900/30 dark:via-olive-800/10 dark:to-transparent" />
      <div className="absolute top-40 right-[-100px] w-[350px] h-[350px] bg-gradient-to-br from-amber-300/15 to-transparent rounded-full blur-2xl pointer-events-none -z-10 dark:from-olive-700/20" />

      <div className="container-kare w-full">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-14 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="flex flex-col gap-6 max-w-xl">
            {/* Pill Badge */}
            <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-olive-100/90 dark:bg-olive-900/50 border border-olive-300/30 text-olive-800 dark:text-olive-300 w-fit text-xs font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t("hero.eyebrow") || "Hyperlocal Village Services Ecosystem"}</span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.6rem] leading-[1.08] text-charcoal dark:text-dark-text tracking-tight text-balance">
              <motion.span {...fadeUp(0.08)} className="block">
                {t("hero.titleLine1") || "Trusted Village Hands."}
              </motion.span>
              <motion.span {...fadeUp(0.16)} className="block italic text-olive-700 dark:text-olive-400 font-normal">
                {t("hero.titleLine2") || "Direct to Your Doorstep."}
              </motion.span>
            </h1>

            {/* Subtitle */}
            <motion.p {...fadeUp(0.24)} className="text-base sm:text-lg text-charcoal/70 dark:text-dark-muted leading-relaxed">
              {t("hero.subtitle") || "Connect instantly with verified local plumbers, electricians, tractor operators, and women's self-help groups within 15 km with zero broker fees."}
            </motion.p>

            {/* Trust Badges */}
            <motion.div {...fadeUp(0.32)} className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-charcoal/75 dark:text-dark-muted">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>100% Aadhaar Verified</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>15-Min Emergency SOS</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-olive-600 dark:text-olive-400" />
                <span>Zero Middleman Payouts</span>
              </span>
            </motion.div>

            {/* Action Buttons */}
            <motion.div {...fadeUp(0.4)} className="flex flex-wrap items-center gap-3 pt-2">
              <Button as={Link} to="/services" size="lg" icon className="shadow-elevation-2">
                {t("hero.ctaPrimary") || "Find Nearby Services"}
              </Button>
              <Button as={Link} to="/register" variant="outline" size="lg">
                {t("hero.ctaSecondary") || "Join as Worker / SHG"}
              </Button>
            </motion.div>
          </div>

          {/* Right Column: Floating App Mockup (Herlyy Style) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Realistic Phone Container */}
            <div className="relative w-full max-w-[340px] sm:max-w-[360px] rounded-[44px] p-3 bg-charcoal/90 dark:bg-black/80 shadow-2xl border-4 border-charcoal/15 dark:border-white/10 ring-1 ring-white/20">
              {/* Phone Speaker Notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-charcoal dark:bg-black rounded-full z-30 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-charcoal-soft mr-2" />
                <div className="w-10 h-1.5 rounded-full bg-white/20" />
              </div>

              {/* Phone Screen Glass */}
              <div className="relative rounded-[36px] bg-cream dark:bg-dark-surface overflow-hidden border border-charcoal/5 dark:border-white/5 pt-10 pb-6 px-4 flex flex-col gap-3.5">
                {/* Mock App Header */}
                <div className="flex items-center justify-between px-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal/40 dark:text-dark-muted">Current Village</span>
                    <p className="text-xs font-bold text-charcoal dark:text-dark-text flex items-center gap-1">
                      <MapPin size={12} className="text-olive-700 dark:text-olive-400" />
                      Rampur Kalan, Ward 4
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                    ● Live Radar
                  </span>
                </div>

                {/* Hero Feature Banner inside phone */}
                <div className="rounded-2xl bg-gradient-to-br from-olive-800 to-olive-950 text-cream p-4 shadow-sm relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-olive-600/30 rounded-full blur-xl" />
                  <div className="flex items-center gap-1.5 text-olive-300 text-[11px] font-semibold mb-1">
                    <Sparkles size={13} />
                    <span>Smart Match Radar</span>
                  </div>
                  <h4 className="font-display font-medium text-sm leading-tight text-white">
                    42 Verified Helpers in 8 km Radius
                  </h4>
                  <p className="text-[10px] text-cream/70 mt-1">Average response time: 6 mins</p>
                </div>

                {/* Live Worker Card inside phone */}
                <div className="rounded-2xl bg-white dark:bg-dark-card p-3 border border-charcoal/5 dark:border-dark-border shadow-xs flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-olive-100 dark:bg-olive-900/60 text-olive-700 dark:text-olive-300 font-bold flex items-center justify-center shrink-0 text-sm">
                    RK
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-charcoal dark:text-dark-text truncate">Ramesh Kumar</p>
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                        <Star size={10} className="fill-amber-500 text-amber-500" /> 4.9
                      </span>
                    </div>
                    <p className="text-[11px] text-charcoal/55 dark:text-dark-muted">Electrician • 1.8 km away</p>
                  </div>
                  <button className="p-2 rounded-xl bg-olive-100 dark:bg-olive-900/50 text-olive-800 dark:text-olive-300">
                    <PhoneCall size={14} />
                  </button>
                </div>

                {/* Live SHG Card inside phone */}
                <div className="rounded-2xl bg-white dark:bg-dark-card p-3 border border-charcoal/5 dark:border-dark-border shadow-xs flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center shrink-0 text-sm">
                    MS
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-charcoal dark:text-dark-text truncate">Mahila Shakti SHG</p>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Verified</span>
                    </div>
                    <p className="text-[11px] text-charcoal/55 dark:text-dark-muted">Organic Grains & Catering</p>
                  </div>
                  <span className="text-xs font-bold text-olive-800 dark:text-olive-300">₹320</span>
                </div>

                {/* Fast Action inside phone */}
                <div className="pt-1 flex items-center justify-between text-xs font-semibold text-olive-800 dark:text-olive-300">
                  <span>Instant Booking Ready</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>

            {/* Floating Live Badge 1 */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-4 sm:-left-8 top-16 bg-cream/95 dark:bg-dark-card/95 backdrop-blur rounded-2xl px-4 py-3 shadow-elevation-2 border border-charcoal/5 dark:border-white/10 max-w-[190px] hidden xs:block"
            >
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <div>
                  <p className="text-xs font-bold text-charcoal dark:text-dark-text">Zero Commission</p>
                  <p className="text-[10px] text-charcoal/55 dark:text-dark-muted">100% direct to workers</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Live Badge 2 */}
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -right-3 sm:-right-6 bottom-12 bg-charcoal text-cream rounded-2xl px-4 py-3 shadow-elevation-3 max-w-[200px] border border-white/10 hidden xs:block"
            >
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-amber-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white">Emergency SOS</p>
                  <p className="text-[10px] text-cream/70">1-click village dispatch</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
