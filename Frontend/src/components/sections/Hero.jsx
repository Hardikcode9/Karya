import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Zap, CheckCircle2 } from "lucide-react";
import Button from "../ui/Button";
import heroArtisansImg from "../../assets/hero-artisans.jpg";

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

          {/* Right Column: Hero Artwork Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Box Container with Artwork (Image 1) - 15% Increased Width */}
            <div className="relative w-full max-w-[485px] sm:max-w-[530px] lg:max-w-[565px] rounded-[32px] sm:rounded-[36px] p-2.5 sm:p-3 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md shadow-2xl border-2 border-charcoal/10 dark:border-white/10 ring-1 ring-charcoal/5">
              <div className="relative aspect-square w-full rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-inner bg-cream-soft dark:bg-dark-surface group">
                <img
                  src={heroArtisansImg}
                  alt="Karya - Local skills. Better opportunities."
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="eager"
                />
              </div>
            </div>

            {/* Floating Live Badge 1 */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-4 sm:-left-8 top-12 sm:top-16 bg-cream/95 dark:bg-dark-card/95 backdrop-blur rounded-2xl px-4 py-3 shadow-elevation-2 border border-charcoal/5 dark:border-white/10 max-w-[190px] hidden xs:block z-10"
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
              className="absolute -right-3 sm:-right-6 -bottom-3 sm:bottom-4 bg-charcoal text-cream rounded-2xl px-4 py-3 shadow-elevation-3 max-w-[200px] border border-white/10 hidden xs:block z-10"
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
