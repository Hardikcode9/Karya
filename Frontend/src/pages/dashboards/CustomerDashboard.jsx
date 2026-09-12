import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag, Wrench, Wallet, Star, MapPin,
  Sparkles, ArrowRight, Clock, Eye, CheckCircle2
} from "lucide-react";
import DashStat from "../../components/ui/DashStat";
import Rating from "../../components/ui/Rating";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import api from "../../utils/api";

const RECENT_PURCHASES = [];
const RECENT_SERVICES = [];
const RECENT_VIEWS = [];
const RECENT_REVIEWS = [];
const SPECIALIST_AVATARS = {};
const recentSpecialists = [];

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalServices: 0,
    totalExpenses: 0,
    totalReviews: 0,
    totalProducts: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const bookingsRes = await api.get("/bookings/customer");
        const bookings = bookingsRes.data?.bookings || [];
        
        const totalServices = bookings.length;
        const totalExpenses = bookings
          .filter(b => !["cancelled", "rejected"].includes(b.status))
          .reduce((sum, b) => sum + (b.price || 0), 0);

        setStats({
          totalServices,
          totalExpenses,
          totalReviews: 0,
          totalProducts: 0,
        });
      } catch (err) {
        console.error("Failed to fetch customer stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner Card */}
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
              Manage your village services, browse artisan handcrafts, and support self-help group products.
            </p>
          </div>

          {/* Quick Action Buttons - Same Button Structure */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/customer/map"
              className="inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm border border-emerald-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <MapPin size={18} className="shrink-0" />
              <span>View Nearby Map</span>
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-olive-600 hover:bg-olive-700 text-white shadow-sm border border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Wrench size={18} className="shrink-0" />
              <span>Book Service Now</span>
            </Link>
            <Link
              to="/shgs"
              className="inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 text-white shadow-sm border border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShoppingBag size={18} className="shrink-0" />
              <span>Buy Items Now</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <DashStat
          label="Total Purchased Products"
          value={String(stats.totalProducts)}
          sub="Village SHG Items"
          icon={ShoppingBag}
          to="/shgs"
        />
        <DashStat
          label="Total Services Used"
          value={String(stats.totalServices)}
          sub="Verified Specialists"
          icon={Wrench}
          to="/customer/activity"
        />
        <DashStat
          label="Total Expenses"
          value={`₹${stats.totalExpenses.toLocaleString("en-IN")}`}
          sub="Services & Crafts"
          icon={Wallet}
          to="/customer/payments"
        />
        <DashStat
          label="Total Reviews"
          value={String(stats.totalReviews)}
          sub="0 suggestions given"
          icon={Star}
          to="/customer/reviews"
        />
      </div>

      {/* Recent 3 Product Purchases */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 flex items-center justify-center">
                <ShoppingBag size={16} />
              </span>
              <h2 className="font-display font-medium text-xl text-charcoal dark:text-dark-text">
                Recent 3 Product Purchases
              </h2>
            </div>
            <p className="text-xs text-charcoal/55 dark:text-dark-muted mt-0.5 ml-10">
              Orders placed from village Self-Help Groups with verified receipts
            </p>
          </div>
          <Link
            to="/shgs"
            className="inline-flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl font-bold text-xs bg-olive-50 dark:bg-olive-900/40 hover:bg-olive-100 dark:hover:bg-olive-900/70 text-olive-800 dark:text-olive-300 border border-olive-200 dark:border-olive-800/50 shadow-xs transition-all active:scale-[0.98]"
          >
            <ShoppingBag size={14} className="shrink-0" />
            <span>Visit SHG Store</span>
          </Link>
        </div>

        {RECENT_PURCHASES.length === 0 ? (
          <div className="bg-cream-card dark:bg-dark-card rounded-2xl p-8 text-center border border-charcoal/10">
            <p className="text-charcoal/60 dark:text-dark-muted">No recent purchases found.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {RECENT_PURCHASES.map((p) => (
            <div
              key={p.id}
              className="bg-cream-card dark:bg-dark-card rounded-2xl p-4 sm:p-5 border border-charcoal/5 dark:border-dark-border flex flex-col justify-between hover:shadow-elevation-2 transition-all group min-h-[25.5rem]"
            >
              {/* Firstly Image at Top */}
              <div className="relative w-full h-[204px] sm:h-[225px] rounded-xl overflow-hidden shrink-0 border border-charcoal/10 shadow-xs">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-white/95 dark:bg-dark-card/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs border border-charcoal/5">
                  <CheckCircle2 size={11} className="text-emerald-600 dark:text-emerald-400" />
                  <span>{p.status}</span>
                </span>
                <span className="absolute top-2.5 right-2.5 font-bold text-xs sm:text-sm text-charcoal dark:text-dark-text bg-white/95 dark:bg-dark-card/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-xs border border-charcoal/5">
                  ₹{p.price}
                </span>
              </div>

              {/* Then Details Shown Vertically */}
              <div className="flex-1 flex flex-col justify-between py-2.5">
                <div>
                  <h3 className="text-sm font-bold text-charcoal dark:text-dark-text leading-snug line-clamp-2 group-hover:text-olive-800 dark:group-hover:text-olive-300 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-charcoal/60 dark:text-dark-muted truncate mt-1">
                    {p.seller}
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-semibold text-olive-700 dark:text-olive-400 bg-olive-50 dark:bg-olive-900/40 px-2.5 py-0.5 rounded-md">
                    Doorstep Delivered • Verified SHG
                  </span>
                </div>
              </div>

              {/* Bottom Row: Timestamp & Button */}
              <div className="pt-3 border-t border-charcoal/5 dark:border-dark-border flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-[11px] text-charcoal/55 dark:text-dark-muted">
                  <div className="flex items-center gap-1.5 font-medium truncate">
                    <Clock size={12} className="text-olive-700 dark:text-olive-400 shrink-0" />
                    <span className="truncate">{p.dateTime}</span>
                  </div>
                  <span className="font-bold text-xs text-charcoal dark:text-dark-text">₹{p.price}</span>
                </div>
                <Link
                  to="/shgs"
                  className="w-full inline-flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-olive-700 hover:bg-olive-800 active:scale-[0.98] text-white shadow-sm transition-all border border-olive-800/20"
                >
                  <ShoppingBag size={16} className="shrink-0" />
                  <span>Buy Product Now</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Recent Services Used */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-olive-100 dark:bg-olive-900/60 text-olive-800 dark:text-olive-300 flex items-center justify-center">
                <Wrench size={16} />
              </span>
              <h2 className="font-display font-medium text-xl text-charcoal dark:text-dark-text">
                Recent Services
              </h2>
            </div>
            <p className="text-xs text-charcoal/55 dark:text-dark-muted mt-0.5 ml-10">
              Verified local trade bookings fulfilled at your village residence
            </p>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl font-bold text-xs bg-olive-50 dark:bg-olive-900/40 hover:bg-olive-100 dark:hover:bg-olive-900/70 text-olive-800 dark:text-olive-300 border border-olive-200 dark:border-olive-800/50 shadow-xs transition-all active:scale-[0.98]"
          >
            <Wrench size={14} className="shrink-0" />
            <span>Book Service Now</span>
          </Link>
        </div>

        {RECENT_SERVICES.length === 0 ? (
          <div className="bg-cream-card dark:bg-dark-card rounded-2xl p-8 text-center border border-charcoal/10">
            <p className="text-charcoal/60 dark:text-dark-muted">No recent services used.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {RECENT_SERVICES.map((s) => (
            <div
              key={s.id}
              className="bg-cream-card dark:bg-dark-card rounded-2xl p-4 sm:p-5 border border-charcoal/5 dark:border-dark-border flex flex-col justify-between hover:shadow-elevation-2 transition-all group min-h-[25.5rem]"
            >
              {/* Firstly Image at Top */}
              <div className="relative w-full h-[204px] sm:h-[225px] rounded-xl overflow-hidden shrink-0 border border-charcoal/10 shadow-xs">
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 text-[10px] font-bold text-olive-800 dark:text-olive-300 bg-white/95 dark:bg-dark-card/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-xs border border-charcoal/5">
                  {s.trade}
                </span>
                <span className="absolute top-2.5 right-2.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-white/95 dark:bg-dark-card/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs border border-charcoal/5">
                  <CheckCircle2 size={11} className="text-emerald-600 dark:text-emerald-400" />
                  <span>{s.status}</span>
                </span>
              </div>

              {/* Then Details Shown Vertically */}
              <div className="flex-1 flex flex-col justify-between py-2.5">
                <div>
                  <h3 className="text-sm font-bold text-charcoal dark:text-dark-text leading-snug line-clamp-2 group-hover:text-olive-800 dark:group-hover:text-olive-300 transition-colors">
                    {s.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-charcoal/60 dark:text-dark-muted truncate">
                      Specialist: <span className="font-bold text-charcoal dark:text-dark-text">{s.specialist}</span>
                    </p>
                    <span className="font-bold text-sm text-charcoal dark:text-dark-text">
                      ₹{s.price}
                    </span>
                  </div>
                  <span className="inline-block mt-2 text-[10px] font-semibold text-olive-700 dark:text-olive-400 bg-olive-50 dark:bg-olive-900/40 px-2.5 py-0.5 rounded-md">
                    On-Site Fulfilled • Verified Specialist
                  </span>
                </div>
              </div>

              {/* Bottom Row: Timestamp & Button */}
              <div className="pt-3 border-t border-charcoal/5 dark:border-dark-border flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-[11px] text-charcoal/55 dark:text-dark-muted">
                  <div className="flex items-center gap-1.5 font-medium truncate">
                    <Clock size={12} className="text-olive-700 dark:text-olive-400 shrink-0" />
                    <span className="truncate">{s.dateTime}</span>
                  </div>
                  <span className="font-bold text-xs text-charcoal dark:text-dark-text">₹{s.price}</span>
                </div>
                <Link
                  to="/services"
                  className="w-full inline-flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-olive-700 hover:bg-olive-800 active:scale-[0.98] text-white shadow-sm transition-all border border-olive-800/20"
                >
                  <Wrench size={16} className="shrink-0" />
                  <span>Book Service Now</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Recent Reviews & Suggestions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 flex items-center justify-center">
                <Star size={16} />
              </span>
              <h2 className="font-display font-medium text-xl text-charcoal dark:text-dark-text">
                Recent Reviews & Suggestions
              </h2>
            </div>
            <p className="text-xs text-charcoal/55 dark:text-dark-muted mt-0.5 ml-10">
              Customer ratings and community improvement suggestions you submitted
            </p>
          </div>
          <Link
            to="/customer/reviews"
            className="inline-flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl font-bold text-xs bg-olive-50 dark:bg-olive-900/40 hover:bg-olive-100 dark:hover:bg-olive-900/70 text-olive-800 dark:text-olive-300 border border-olive-200 dark:border-olive-800/50 shadow-xs transition-all active:scale-[0.98]"
          >
            <Star size={14} className="shrink-0" />
            <span>View All Reviews (14)</span>
          </Link>
        </div>

        {RECENT_REVIEWS.length === 0 ? (
          <div className="bg-cream-card dark:bg-dark-card rounded-2xl p-8 text-center border border-charcoal/10">
            <p className="text-charcoal/60 dark:text-dark-muted">No reviews or suggestions given yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {RECENT_REVIEWS.map((r) => (
            <div
              key={r.id}
              className="bg-cream-card dark:bg-dark-card rounded-2xl p-4 sm:p-5 border border-charcoal/5 dark:border-dark-border flex flex-col justify-between hover:shadow-elevation-2 transition-all group min-h-[25.5rem]"
            >
              {/* Firstly Image at Top */}
              <div className="relative w-full h-[204px] sm:h-[225px] rounded-xl overflow-hidden shrink-0 border border-charcoal/10 shadow-xs">
                <img
                  src={r.image}
                  alt={r.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span
                  className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-xs border border-charcoal/5 ${
                    r.type === "product"
                      ? "bg-amber-100/95 dark:bg-amber-950/90 text-amber-800 dark:text-amber-300"
                      : r.type === "service"
                      ? "bg-olive-100/95 dark:bg-olive-900/90 text-olive-800 dark:text-olive-300"
                      : "bg-emerald-100/95 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300"
                  }`}
                >
                  {r.type === "product" ? "Product Review" : r.type === "service" ? "Service Review" : "Suggestion"}
                </span>
                {r.rating ? (
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-white/95 dark:bg-dark-card/95 backdrop-blur-sm text-amber-600 font-bold text-xs px-2.5 py-1 rounded-full shadow-xs border border-charcoal/5">
                    <Star size={12} fill="currentColor" />
                    <span>{r.rating}.0</span>
                  </div>
                ) : (
                  <span className="absolute top-2.5 right-2.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-white/95 dark:bg-dark-card/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-xs border border-charcoal/5">
                    {r.status}
                  </span>
                )}
              </div>

              {/* Then Details Shown Vertically */}
              <div className="flex-1 flex flex-col justify-between py-2.5">
                <div>
                  <h3 className="text-sm font-bold text-charcoal dark:text-dark-text leading-snug line-clamp-1">
                    {r.title}
                  </h3>
                  <p className="text-xs text-charcoal/70 dark:text-dark-muted mt-1.5 line-clamp-3 italic leading-relaxed">
                    "{r.text}"
                  </p>
                  <p className="text-[11px] text-olive-700 dark:text-olive-400 font-semibold mt-2 truncate">
                    For: {r.target}
                  </p>
                </div>
              </div>

              {/* Bottom Row: Timestamp & Button */}
              <div className="pt-3 border-t border-charcoal/5 dark:border-dark-border flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-[11px] text-charcoal/55 dark:text-dark-muted">
                  <div className="flex items-center gap-1.5 font-medium truncate">
                    <Clock size={12} className="text-olive-700 dark:text-olive-400 shrink-0" />
                    <span className="truncate">{r.dateTime}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-olive-700 dark:text-olive-400 truncate">
                    {r.target}
                  </span>
                </div>
                <Link
                  to="/customer/reviews"
                  className="w-full inline-flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-olive-700 hover:bg-olive-800 active:scale-[0.98] text-white shadow-sm transition-all border border-olive-800/20"
                >
                  <Star size={16} className="shrink-0" />
                  <span>View Review Now</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Recent Views with Date & Time */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-400 flex items-center justify-center">
                <Eye size={16} />
              </span>
              <h2 className="font-display font-medium text-xl text-charcoal dark:text-dark-text">
                Recent Views
              </h2>
            </div>
            <p className="text-xs text-charcoal/55 dark:text-dark-muted mt-0.5 ml-10">
              Artisan items and specialists you browsed with exact timestamps
            </p>
          </div>
          <Link
            to="/shgs"
            className="inline-flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl font-bold text-xs bg-olive-50 dark:bg-olive-900/40 hover:bg-olive-100 dark:hover:bg-olive-900/70 text-olive-800 dark:text-olive-300 border border-olive-200 dark:border-olive-800/50 shadow-xs transition-all active:scale-[0.98]"
          >
            <Eye size={14} className="shrink-0" />
            <span>Explore Catalog</span>
          </Link>
        </div>

        {RECENT_VIEWS.length === 0 ? (
          <div className="bg-cream-card dark:bg-dark-card rounded-2xl p-8 text-center border border-charcoal/10">
            <p className="text-charcoal/60 dark:text-dark-muted">No recently viewed items.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {RECENT_VIEWS.map((v) => (
            <div
              key={v.id}
              className="bg-cream-card dark:bg-dark-card rounded-2xl p-4 sm:p-5 border border-charcoal/5 dark:border-dark-border flex flex-col justify-between hover:shadow-elevation-2 transition-all group min-h-[25.5rem]"
            >
              {/* Firstly Image at Top */}
              <div className="relative w-full h-[204px] sm:h-[225px] rounded-xl overflow-hidden shrink-0 border border-charcoal/10 shadow-xs">
                <img
                  src={v.image}
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 text-[10px] font-bold text-charcoal/70 dark:text-dark-muted bg-white/95 dark:bg-dark-card/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-xs border border-charcoal/5">
                  {v.category}
                </span>
                <span className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/95 dark:bg-dark-card/95 backdrop-blur-sm flex items-center justify-center text-olive-700 dark:text-olive-400 shadow-xs border border-charcoal/5">
                  <Eye size={14} />
                </span>
              </div>

              {/* Then Details Shown Vertically */}
              <div className="flex-1 flex flex-col justify-between py-2.5">
                <div>
                  <h3 className="text-sm font-bold text-charcoal dark:text-dark-text group-hover:text-olive-800 dark:group-hover:text-olive-300 transition-colors line-clamp-2 leading-snug">
                    {v.title}
                  </h3>
                  <p className="text-xs text-charcoal/55 dark:text-dark-muted mt-1.5 truncate">
                    {v.subtitle}
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-semibold text-olive-700 dark:text-olive-400 bg-olive-50 dark:bg-olive-900/40 px-2.5 py-0.5 rounded-md">
                    Village Catalog • Click to View
                  </span>
                </div>
              </div>

              {/* Bottom Row: Timestamp & Button */}
              <div className="pt-3 border-t border-charcoal/5 dark:border-dark-border flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-[11px] text-charcoal/55 dark:text-dark-muted">
                  <div className="flex items-center gap-1.5 text-charcoal/55 dark:text-dark-muted truncate">
                    <Clock size={12} className="text-olive-700 dark:text-olive-400 shrink-0" />
                    <span className="truncate">{v.dateTime}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-olive-700 dark:text-olive-400 truncate">
                    {v.category}
                  </span>
                </div>
                <Link
                  to={v.to}
                  className="w-full inline-flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-olive-700 hover:bg-olive-800 active:scale-[0.98] text-white shadow-sm transition-all border border-olive-800/20"
                >
                  <Eye size={16} className="shrink-0" />
                  <span>Explore Item Now</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Frequently Viewed / Recommended Specialists */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-olive-100 dark:bg-olive-900/60 text-olive-800 dark:text-olive-300 flex items-center justify-center">
                <Wrench size={16} />
              </span>
              <h2 className="font-display font-medium text-xl text-charcoal dark:text-dark-text">
                Verified Village Specialists
              </h2>
            </div>
            <p className="text-xs text-charcoal/55 dark:text-dark-muted mt-0.5 ml-10">
              Highest rated by your neighboring village blocks
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/customer/map"
              className="inline-flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl font-bold text-xs bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 shadow-xs transition-all active:scale-[0.98]"
            >
              <MapPin size={14} className="shrink-0" />
              <span>Pinpoint on Map</span>
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl font-bold text-xs bg-olive-50 dark:bg-olive-900/40 hover:bg-olive-100 dark:hover:bg-olive-900/70 text-olive-800 dark:text-olive-300 border border-olive-200 dark:border-olive-800/50 shadow-xs transition-all active:scale-[0.98]"
            >
              <Wrench size={14} className="shrink-0" />
              <span>Book Service Now</span>
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentSpecialists.map((w) => (
            <div
              key={w.id}
              className="bg-cream-card dark:bg-dark-card rounded-2xl p-4 sm:p-5 border border-charcoal/5 dark:border-dark-border flex flex-col justify-between hover:shadow-elevation-2 transition-all group min-h-[25.5rem]"
            >
              {/* Firstly Image at Top */}
              <div className="relative w-full h-[204px] sm:h-[225px] rounded-xl overflow-hidden shrink-0 border border-charcoal/10 shadow-xs">
                <img
                  src={SPECIALIST_AVATARS[w.id] || "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80"}
                  alt={w.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 text-[10px] font-bold text-olive-800 dark:text-olive-300 bg-white/95 dark:bg-dark-card/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-xs border border-charcoal/5">
                  {w.role}
                </span>
                <div className="absolute top-2.5 right-2.5 bg-white/95 dark:bg-dark-card/95 backdrop-blur-sm px-2 py-1 rounded-full shadow-xs border border-charcoal/5">
                  <Rating value={w.rating} showValue={false} />
                </div>
              </div>

              {/* Then Details Shown Vertically */}
              <div className="flex-1 flex flex-col justify-between py-2.5">
                <div>
                  <p className="text-base font-bold text-charcoal dark:text-dark-text truncate">{w.name}</p>
                  <p className="text-xs text-olive-700 dark:text-olive-400 flex items-center gap-1 mt-1 truncate">
                    <MapPin size={12} />
                    <span>{w.distanceKm} km away • Verified</span>
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-medium text-charcoal/60 dark:text-dark-muted bg-charcoal/5 dark:bg-dark-border/40 px-2.5 py-0.5 rounded-md">
                    {w.completedJobs} jobs completed in village
                  </span>
                </div>
              </div>

              {/* Bottom Row: Price & Button */}
              <div className="pt-3 border-t border-charcoal/5 dark:border-dark-border flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-xs font-bold text-charcoal dark:text-dark-text">Rate: ₹{w.price}/day</span>
                  <span className="text-[10px] text-olive-700 dark:text-olive-400 font-semibold">{w.distanceKm} km away</span>
                </div>
                <Link
                  to="/services"
                  className="w-full inline-flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-olive-700 hover:bg-olive-800 active:scale-[0.98] text-white shadow-sm transition-all border border-olive-800/20"
                >
                  <Wrench size={16} className="shrink-0" />
                  <span>Book Service Now</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
