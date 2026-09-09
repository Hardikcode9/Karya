import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Compass, Wallet, Users2, CheckCircle2, ChevronRight } from "lucide-react";

const flows = [
  {
    id: "emergency",
    title: "1-Click Village SOS",
    tagline: "Instant emergency help for electricity hazards, burst pipes, and tractor breakdowns",
    icon: ShieldAlert,
    badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    mockData: {
      header: "Emergency Dispatch Active",
      badge: "Priority #1",
      itemTitle: "Submersible Motor Short Circuit",
      location: "Farm Sector 4, Raipur",
      eta: "Arriving in 12 mins",
      provider: "Kailash Sharma (Master Electrician)",
      action: "Track GPS & Live Status",
    },
  },
  {
    id: "radar",
    title: "Smart Village Radar",
    tagline: "Pinpoint verified tradespeople within 5–15 km with real-time availability",
    icon: Compass,
    badgeColor: "bg-olive-500/10 text-olive-700 dark:text-olive-400 border-olive-500/20",
    mockData: {
      header: "Radar Radius: 10 KM",
      badge: "18 Online",
      itemTitle: "Carpentry & Furniture Joinery",
      location: "Bazaar Ward 2",
      eta: "Available Now",
      provider: "Suresh Mistri & 3 Apprentices",
      action: "Direct Voice Call / WhatsApp",
    },
  },
  {
    id: "payout",
    title: "Zero Broker Commission",
    tagline: "Direct UPI & cash settlements without middlemen cutting into rural daily wages",
    icon: Wallet,
    badgeColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    mockData: {
      header: "Daily Wage Settlement",
      badge: "100% Retained",
      itemTitle: "Full Day Field Tilling (4 Acres)",
      location: "East Panchayat Block",
      eta: "Direct Account Deposit",
      provider: "₹1,800 sent via Aadhaar UPI",
      action: "Download Official Karya Receipt",
    },
  },
  {
    id: "shg",
    title: "Women's SHG Catalog",
    tagline: "Bulk rural catering, handloom textiles, and organic farm harvest at cooperative rates",
    icon: Users2,
    badgeColor: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    mockData: {
      header: "Cooperative Federation Hub",
      badge: "24 Artisans",
      itemTitle: "50 kg Traditional Millet Snacks & Khakra",
      location: "Mahila Vikas SHG Cluster",
      eta: "Batch Dispatched",
      provider: "Tested for Food Safety & Purity",
      action: "Repeat Order with 1-Tap",
    },
  },
];

export default function AppScreenshotSection() {
  const [activeFlow, setActiveFlow] = useState(flows[0].id);
  const current = flows.find((f) => f.id === activeFlow) || flows[0];

  return (
    <section className="py-16 sm:py-24 bg-ivory/40 dark:bg-dark-surface/40 border-y border-charcoal/5 dark:border-dark-border">
      <div className="container-kare">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs uppercase font-bold tracking-wider text-olive-700 dark:text-olive-400 mb-2 block">
            Designed for Bharat
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-charcoal dark:text-dark-text tracking-tight">
            How Karya Runs in the Field
          </h2>
          <p className="text-sm sm:text-base text-charcoal/65 dark:text-dark-muted mt-3">
            Simple, tactile, and built to work effortlessly on mobile screens even with low connectivity.
          </p>
        </div>

        {/* Feature Tab Selector Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8 sm:mb-12">
          {flows.map((flow) => {
            const IconComponent = flow.icon;
            const isActive = flow.id === activeFlow;
            return (
              <button
                key={flow.id}
                type="button"
                onClick={() => setActiveFlow(flow.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 select-none ${
                  isActive
                    ? "bg-olive-800 text-cream shadow-elevation-2 dark:bg-olive-600"
                    : "bg-white dark:bg-dark-card text-charcoal/70 dark:text-dark-muted border border-charcoal/10 dark:border-dark-border hover:border-charcoal/30"
                }`}
              >
                <IconComponent size={16} />
                <span>{flow.title}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Feature Stage */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-[1fr_1.1fr] gap-8 items-center bg-cream-card dark:bg-dark-card rounded-3xl p-6 sm:p-10 border border-charcoal/5 dark:border-dark-border shadow-elevation-2"
            >
              {/* Left: Detail Pitch */}
              <div className="space-y-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${current.badgeColor}`}
                >
                  <current.icon size={14} />
                  <span>Feature Spotlight</span>
                </span>
                <h3 className="font-display text-2xl sm:text-3xl text-charcoal dark:text-dark-text leading-snug">
                  {current.title}
                </h3>
                <p className="text-sm sm:text-base text-charcoal/70 dark:text-dark-muted leading-relaxed">
                  {current.tagline}
                </p>

                <div className="pt-2 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-charcoal dark:text-dark-text">
                    <CheckCircle2 size={16} className="text-olive-700 dark:text-olive-400 shrink-0" />
                    <span>Works offline with automatic SMS queue backup</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-charcoal dark:text-dark-text">
                    <CheckCircle2 size={16} className="text-olive-700 dark:text-olive-400 shrink-0" />
                    <span>Localized voice instructions in 7 Indian languages</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-charcoal dark:text-dark-text">
                    <CheckCircle2 size={16} className="text-olive-700 dark:text-olive-400 shrink-0" />
                    <span>Direct phone or WhatsApp connect with zero commission</span>
                  </div>
                </div>
              </div>

              {/* Right: Modern Simulated Mobile View */}
              <div className="bg-cream dark:bg-dark-surface rounded-2xl p-5 border border-charcoal/10 dark:border-dark-border shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-charcoal/10 dark:border-dark-border pb-3">
                  <span className="text-xs font-bold text-charcoal dark:text-dark-text">
                    {current.mockData.header}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-olive-100 dark:bg-olive-900/50 text-olive-800 dark:text-olive-300 text-[10px] font-bold">
                    {current.mockData.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-charcoal/45 dark:text-dark-muted">Service Description</span>
                  <p className="text-sm font-bold text-charcoal dark:text-dark-text">
                    {current.mockData.itemTitle}
                  </p>
                  <p className="text-xs text-charcoal/60 dark:text-dark-muted">
                    📍 {current.mockData.location} • <span className="text-olive-700 dark:text-olive-400 font-semibold">{current.mockData.eta}</span>
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-dark-card border border-charcoal/5 dark:border-dark-border text-xs">
                  <p className="text-charcoal/50 dark:text-dark-muted text-[10px]">Verified Worker / Cluster</p>
                  <p className="font-semibold text-charcoal dark:text-dark-text mt-0.5">{current.mockData.provider}</p>
                </div>

                <button
                  type="button"
                  className="w-full mt-1 py-2.5 px-4 rounded-xl bg-olive-700 hover:bg-olive-800 text-cream dark:bg-olive-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>{current.mockData.action}</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
