import { Link } from "react-router-dom";
import {
  ClipboardList, CalendarCheck, CheckCircle2, Wallet, MapPin,
  Search, Sparkles, Phone, ArrowRight, Clock
} from "lucide-react";
import DashStat from "../../components/ui/DashStat";
import Rating from "../../components/ui/Rating";
import Button from "../../components/ui/Button";
import { workers } from "../../data/mockData";
import { useAuth } from "../../hooks/useAuth";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const recent = workers.slice(0, 3);

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner Card (Herlyy Style) */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-olive-900 via-olive-950 to-charcoal text-cream shadow-elevation-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-olive-700/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-olive-300 text-xs font-semibold mb-3">
              <Sparkles size={12} />
              <span>Village Customer Hub</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white font-medium">
              Namaste, {user?.name || "Customer"}!
            </h1>
            <p className="text-xs sm:text-sm text-cream/70 mt-1 max-w-lg">
              You have 1 technician scheduled for tomorrow at 10:00 AM and 0 pending emergency issues.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button as={Link} to="/services" size="md" icon>
              Book New Service
            </Button>
            <Button as={Link} to="/services" variant="dark" size="md">
              <Search size={15} />
              <span>Browse Services</span>
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <DashStat label="Active Requests" value="2" icon={ClipboardList} />
        <DashStat label="Upcoming Jobs" value="1" sub="Tomorrow, 10 AM" icon={CalendarCheck} />
        <DashStat label="Completed Jobs" value="14" icon={CheckCircle2} />
        <DashStat label="Total Saved / Spent" value="₹8,450" icon={Wallet} />
      </div>

      {/* Active Live Booking Card */}
      <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-5 sm:p-6 border border-charcoal/5 dark:border-dark-border shadow-elevation-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="font-display font-medium text-lg text-charcoal dark:text-dark-text">
              Active Job in Progress
            </h2>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
            En Route
          </span>
        </div>

        <div className="grid sm:grid-cols-[1.5fr_1fr] gap-4 items-center p-4 rounded-2xl bg-white dark:bg-dark-surface border border-charcoal/5 dark:border-dark-border">
          <div>
            <p className="text-xs font-semibold text-charcoal/50 dark:text-dark-muted">Job Title</p>
            <h3 className="font-bold text-sm sm:text-base text-charcoal dark:text-dark-text mt-0.5">
              Submersible Pump Wiring & Fuse Overhaul
            </h3>
            <div className="flex items-center gap-4 mt-2 text-xs text-charcoal/65 dark:text-dark-muted">
              <span className="flex items-center gap-1">
                <Clock size={13} className="text-olive-700 dark:text-olive-400" />
                <span>Today, ETA: 35 mins</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-olive-700 dark:text-olive-400" />
                <span>Rampur Field #2</span>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-charcoal/10 dark:border-dark-border">
            <div className="text-right">
              <p className="text-xs font-bold text-charcoal dark:text-dark-text">Ramesh Kumar</p>
              <p className="text-[11px] text-charcoal/50 dark:text-dark-muted">Verified Electrician</p>
            </div>
            <a
              href="tel:9876543210"
              className="p-2.5 rounded-full bg-olive-700 hover:bg-olive-800 text-cream transition-colors shadow-xs"
              title="Call Worker Directly"
            >
              <Phone size={15} />
            </a>
          </div>
        </div>
      </div>

      {/* Frequently Viewed / Recommended Workers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-medium text-xl text-charcoal dark:text-dark-text">
              Verified Village Specialists
            </h2>
            <p className="text-xs text-charcoal/55 dark:text-dark-muted mt-0.5">
              Highest rated by your neighboring village blocks
            </p>
          </div>
          <Link
            to="/services"
            className="text-xs font-bold text-olive-700 dark:text-olive-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recent.map((w) => (
            <div
              key={w.id}
              className="bg-cream-card dark:bg-dark-card rounded-2xl p-4 border border-charcoal/5 dark:border-dark-border flex items-center gap-3 hover:shadow-elevation-1 transition-all"
            >
              <span className="w-12 h-12 rounded-2xl bg-olive-100 dark:bg-olive-900/50 text-olive-800 dark:text-olive-300 flex items-center justify-center font-display font-bold text-sm shrink-0">
                {w.name.charAt(0)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-charcoal dark:text-dark-text truncate">{w.name}</p>
                <p className="text-xs text-charcoal/55 dark:text-dark-muted">{w.role}</p>
                <p className="text-[11px] text-olive-700 dark:text-olive-400 flex items-center gap-1 mt-0.5">
                  <MapPin size={10} />
                  <span>{w.distanceKm} km away</span>
                </p>
              </div>
              <div className="text-right shrink-0">
                <Rating value={w.rating} showValue={false} />
                <p className="text-xs font-bold text-charcoal dark:text-dark-text mt-1">₹{w.price}/day</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
