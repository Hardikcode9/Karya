import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users, Users2, UserCheck, Settings2, Package, Lightbulb,
  MessageSquare, IndianRupee, PhoneCall, ShieldCheck, Activity, Award, ArrowRight
} from "lucide-react";
import { useToast } from "../hooks/useToast";
import api from "../utils/api";

export default function AdminDashboard() {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // System Gateways
  const [toggles, setToggles] = useState({
    emergencySMS: true,
    autoMatching: true,
    offlineCache: true,
    zeroCommissionPledge: true,
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/admin/dashboard");
        setData(response.data.data);
      } catch (error) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [toast]);

  const toggleSwitch = (key) => {
    setToggles((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      toast.info(`System setting "${key}" updated`);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-charcoal/50 text-sm font-medium">Loading Dashboard Data...</div>
      </div>
    );
  }

  const { overview, recentBookings } = data;

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <div className="flex flex-col mb-8 gap-2">
        <h1 className="text-3xl font-bold font-display text-charcoal dark:text-dark-text">Admin Dashboard</h1>
        <p className="text-sm text-charcoal/60 dark:text-dark-muted">Platform-wide overview and operational metrics.</p>
      </div>

      {/* 3. Dynamic Location-Adjusted Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-cream-card dark:bg-dark-card p-4 sm:p-5 rounded-2xl border border-charcoal/10 dark:border-dark-border shadow-xs">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-bold mb-1">
            <span>Registered Workers</span>
            <Users size={16} className="text-olive-700 dark:text-olive-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-charcoal dark:text-dark-text">
            {overview.totalWorkers.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            <ShieldCheck size={12} />
            <span>Active on Platform</span>
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 sm:p-5 rounded-2xl border border-charcoal/10 dark:border-dark-border shadow-xs">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-bold mb-1">
            <span>SHG Collectives</span>
            <Users2 size={16} className="text-olive-700 dark:text-olive-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-charcoal dark:text-dark-text">
            {overview.totalSHGs.toLocaleString()}
          </div>
          <div className="text-[11px] text-olive-800 dark:text-olive-300 font-semibold mt-1 truncate">
            Registered groups
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 sm:p-5 rounded-2xl border border-charcoal/10 dark:border-dark-border shadow-xs">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-bold mb-1">
            <span>Customers</span>
            <UserCheck size={16} className="text-olive-700 dark:text-olive-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-charcoal dark:text-dark-text">
            {overview.totalCustomers.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            Active local buyers
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 sm:p-5 rounded-2xl border border-charcoal/10 dark:border-dark-border shadow-xs">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-bold mb-1">
            <span>Total Payouts</span>
            <IndianRupee size={16} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-olive-900 dark:text-olive-300">
            ₹{overview.totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mt-1">
            100% Direct (Zero Commission)
          </div>
        </div>
      </div>

      {/* 4. Quick Action Hub / Module Jump Grid */}
      <div className="space-y-3">
        <h2 className="font-display text-lg font-bold text-charcoal dark:text-dark-text">
          Management Modules
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { to: "/workers", label: "Workers", count: `${overview.totalWorkers} Profiles`, icon: Users, color: "text-blue-600" },
            { to: "/shgs", label: "SHG Groups", count: `${overview.totalSHGs} Collectives`, icon: Users2, color: "text-emerald-600" },
            { to: "/customers", label: "Customers", count: `${overview.totalCustomers} Users`, icon: UserCheck, color: "text-amber-600" },
            { to: "/services", label: "Services", count: `${overview.totalServices} Categories`, icon: Settings2, color: "text-purple-600" },
            { to: "/products", label: "Products", count: `${overview.totalProducts} Items`, icon: Package, color: "text-rose-600" },
            { to: "/suggestions", label: "Suggestions", count: "User feedback", icon: Lightbulb, color: "text-amber-500" },
            { to: "/queries", label: "Queries", count: "Support tickets", icon: MessageSquare, color: "text-red-500" },
            { to: "/sales", label: "Sales Ledger", count: `₹${overview.totalRevenue}`, icon: IndianRupee, color: "text-emerald-600" },
            { to: "/contact", label: "Contact", count: "Inquiries", icon: PhoneCall, color: "text-indigo-600" },
            { to: "/others", label: "System", count: "Settings", icon: Activity, color: "text-teal-600" },
          ].map((mod, idx) => (
            <Link
              key={idx}
              to={mod.to}
              className="bg-cream-card dark:bg-dark-card rounded-2xl p-4 border border-charcoal/10 dark:border-dark-border hover:border-olive-600 dark:hover:border-olive-400 shadow-2xs hover:shadow-xs transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-dark-surface flex items-center justify-center border border-charcoal/5 shadow-2xs">
                  <mod.icon size={16} className={mod.color} />
                </div>
                <ArrowRight size={13} className="text-charcoal/30 group-hover:text-olive-700 transition-colors" />
              </div>
              <div>
                <span className="font-bold text-xs sm:text-sm text-charcoal dark:text-dark-text block group-hover:text-olive-800 transition-colors">
                  {mod.label}
                </span>
                <span className="text-[11px] text-charcoal/55 dark:text-dark-muted font-medium block mt-0.5">
                  {mod.count}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 5. Two Column Operational Split: Recent Bookings & System Controls */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-cream-card dark:bg-dark-card rounded-3xl p-5 sm:p-6 border border-charcoal/10 dark:border-dark-border shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-charcoal/10 dark:border-dark-border">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-olive-700 dark:text-olive-400" />
              <h3 className="font-display text-base sm:text-lg font-bold text-charcoal dark:text-dark-text">
                Recent Bookings ({recentBookings.length})
              </h3>
            </div>
            <Link
              to="/sales"
              className="text-xs font-bold text-olive-800 dark:text-olive-300 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="divide-y divide-charcoal/5 dark:divide-dark-border">
            {recentBookings.length === 0 ? (
              <div className="py-8 text-center text-xs text-charcoal/50 dark:text-dark-muted">
                No recent bookings.
              </div>
            ) : (
              recentBookings.slice(0, 6).map((item) => (
                <div key={item._id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs sm:text-sm text-charcoal dark:text-dark-text">
                        {item.customer?.name || "Unknown Customer"}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-md ${
                        item.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                        item.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        item.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-[10px] text-charcoal/50 dark:text-dark-muted">
                        • {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal/65 dark:text-dark-muted mt-0.5">
                      Service: <span className="font-semibold">{item.service?.name}</span> • Provider: <span className="font-semibold">{item.providerType === 'worker' ? 'Worker' : 'SHG'}</span>
                    </p>
                  </div>
                  <div className="text-sm font-bold text-charcoal dark:text-dark-text">
                    ₹{item.price}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* System Policies & Platform Controls (1 Column) */}
        <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-5 sm:p-6 border border-charcoal/10 dark:border-dark-border shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-charcoal/10 dark:border-dark-border">
            <Activity size={18} className="text-olive-700 dark:text-olive-400" />
            <h3 className="font-display text-base sm:text-lg font-bold text-charcoal dark:text-dark-text">
              Platform Gateways
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-dark-surface border border-charcoal/5">
              <div>
                <span className="text-xs font-bold text-charcoal dark:text-dark-text block">
                  Emergency SOS SMS Dispatch
                </span>
                <span className="text-[11px] text-charcoal/60 dark:text-dark-muted">
                  SMS alerts to village workers
                </span>
              </div>
              <button
                type="button"
                onClick={() => toggleSwitch("emergencySMS")}
                className={`w-10 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  toggles.emergencySMS ? "bg-emerald-600" : "bg-charcoal/30"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    toggles.emergencySMS ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-dark-surface border border-charcoal/5">
              <div>
                <span className="text-xs font-bold text-charcoal dark:text-dark-text block">
                  AI Radius Proximity Matcher
                </span>
                <span className="text-[11px] text-charcoal/60 dark:text-dark-muted">
                  Automatic 10km worker dispatch
                </span>
              </div>
              <button
                type="button"
                onClick={() => toggleSwitch("autoMatching")}
                className={`w-10 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  toggles.autoMatching ? "bg-emerald-600" : "bg-charcoal/30"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    toggles.autoMatching ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-dark-surface border border-charcoal/5">
              <div>
                <span className="text-xs font-bold text-charcoal dark:text-dark-text block">
                  Offline Kiosk Cache Sync
                </span>
                <span className="text-[11px] text-charcoal/60 dark:text-dark-muted">
                  IndexedDB village caching
                </span>
              </div>
              <button
                type="button"
                onClick={() => toggleSwitch("offlineCache")}
                className={`w-10 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  toggles.offlineCache ? "bg-emerald-600" : "bg-charcoal/30"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    toggles.offlineCache ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 text-xs space-y-1">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                ✓ 100% Direct Payout Pledge
              </span>
              <p className="text-[11px] text-emerald-700/90 dark:text-emerald-400">
                0% platform commission actively enforced across all 780+ districts and villages.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
