import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users, IndianRupee, Star, Package, CheckCircle2, Clock,
  ArrowRight, Award, MapPin, Building2, Plus, ShoppingBag, TrendingUp
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../utils/api";
import {
  SHG_PROFILE_DATA,
  SHG_ORDERS_DATA
} from "../../data/shgDashboardData";
import DashStat from "../../components/ui/DashStat";

export default function SHGDashboard() {
  const { user } = useAuth();

  const [shg, setShg] = useState({
    name: user?.name || SHG_PROFILE_DATA.name,
    village: SHG_PROFILE_DATA.village || "Your Village",
    members: SHG_PROFILE_DATA.totalMembers || 0,
    earnings: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/shg/dashboard");
        if (res.data?.success && res.data.dashboard) {
          setShg(prev => ({
            ...prev,
            name: res.data.dashboard.name || prev.name,
            village: res.data.dashboard.village || prev.village,
            members: res.data.dashboard.totalMembers || prev.members,
            earnings: res.data.dashboard.totalEarnings || prev.earnings
          }));
        }
      } catch (err) {
        console.error("Failed to fetch SHG dashboard", err);
      }
    };
    fetchDashboard();
  }, []);

  const shgName = shg.name;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-olive-900 via-olive-800 to-charcoal text-cream shadow-elevation-2 relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs font-bold text-cream/90 border border-white/15">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{SHG_PROFILE_DATA.nrlmId} · NRLM Verified Federation</span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-medium tracking-tight">
              {shgName}
            </h1>
            <p className="text-xs sm:text-sm text-cream/75 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="flex items-center gap-1.5">
                <MapPin size={13} className="text-amber-400" />
                <span>{SHG_PROFILE_DATA.cluster}, {SHG_PROFILE_DATA.district}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Building2 size={13} className="text-emerald-400" />
                <span>{SHG_PROFILE_DATA.totalMembers} Registered Women Artisans</span>
              </span>
            </p>
          </div>

          {/* 2x2 Quick Action Buttons Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5 w-full sm:w-auto shrink-0">
            <Link
              to="/shg/products?action=add-product"
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-cream text-charcoal text-xs font-bold shadow-xs hover:bg-white active:scale-95 transition-all text-center min-w-[130px]"
            >
              <Plus size={14} className="text-olive-800 shrink-0" />
              <span>Add Product</span>
            </Link>
            <Link
              to="/shg/members?action=add-member"
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-cream text-xs font-bold backdrop-blur border border-white/20 active:scale-95 transition-all text-center min-w-[130px]"
            >
              <Users size={14} className="shrink-0" />
              <span>Add Member</span>
            </Link>
            <Link
              to="/shg/reviews"
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-cream text-xs font-bold backdrop-blur border border-white/20 active:scale-95 transition-all text-center min-w-[130px]"
            >
              <Star size={14} className="text-amber-300 shrink-0" />
              <span>Your Reviews</span>
            </Link>
            <Link
              to="/shg/orders?filter=pending"
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-400 text-charcoal text-xs font-bold shadow-xs hover:bg-amber-300 active:scale-95 transition-all text-center min-w-[130px]"
            >
              <Clock size={14} className="shrink-0" />
              <span>Pending Orders</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Member (in your gp) */}
        <Link
          to="/shg/members"
          className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs flex items-center justify-between hover:border-olive-600/30 transition-all group"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-charcoal/50 dark:text-dark-muted">
              Total Member (in your GP)
            </p>
            <p className="font-display text-2xl sm:text-3xl font-bold text-charcoal dark:text-dark-text mt-1">
              {shg.members}
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
              100% Aadhaar &amp; Bank linked
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-olive-500/10 text-olive-700 dark:text-olive-400 shrink-0 group-hover:scale-105 transition-transform">
            <Users size={24} />
          </div>
        </Link>

        {/* Card 2: Total Earning */}
        <Link
          to="/shg/earnings"
          className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs flex items-center justify-between hover:border-olive-600/30 transition-all group"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-charcoal/50 dark:text-dark-muted">
              Total Earning
            </p>
            <p className="font-display text-2xl sm:text-3xl font-bold text-olive-700 dark:text-olive-400 mt-1">
              ₹{shg.earnings.toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] text-charcoal/50 dark:text-dark-muted mt-0.5">
              100% Zero-Cut Village Payout
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
            <IndianRupee size={24} />
          </div>
        </Link>

        {/* Card 3: Total Product */}
        <Link
          to="/shg/products"
          className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs flex items-center justify-between hover:border-olive-600/30 transition-all group"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-charcoal/50 dark:text-dark-muted">
              Total Product
            </p>
            <p className="font-display text-2xl sm:text-3xl font-bold text-charcoal dark:text-dark-text mt-1">
              8
            </p>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
              Active Handloom &amp; Agro Catalog
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
            <Package size={24} />
          </div>
        </Link>

        {/* Card 4: Your Reviews */}
        <Link
          to="/shg/reviews"
          className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs flex items-center justify-between hover:border-olive-600/30 transition-all group"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-charcoal/50 dark:text-dark-muted">
              Your Reviews
            </p>
            <p className="font-display text-2xl sm:text-3xl font-bold text-amber-500 mt-1 flex items-center gap-1.5">
              <span>4.9</span>
              <Star size={20} className="fill-amber-400 text-amber-400" />
            </p>
            <p className="text-[11px] text-charcoal/50 dark:text-dark-muted mt-0.5">
              86 Verified Customer Reviews
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-700 dark:text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
            <Award size={24} />
          </div>
        </Link>
      </div>

      {/* Dedicated Section: Previous Completed Orders (Last 5 Orders) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-charcoal/10 dark:border-dark-border">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold mb-1">
              <CheckCircle2 size={11} />
              <span>Delivered &amp; Paid Consignments</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-charcoal dark:text-dark-text">
              Previous Completed Orders
            </h2>
            <p className="text-xs text-charcoal/60 dark:text-dark-muted">
              Showing the last 5 completed consignments with customer delivery and settlement confirmation
            </p>
          </div>
          <Link
            to="/shg/orders?filter=completed"
            className="text-xs font-bold text-olive-700 dark:text-olive-400 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>View All Completed Orders</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="rounded-2xl sm:rounded-3xl border border-charcoal/10 dark:border-dark-border overflow-hidden bg-white dark:bg-dark-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[880px]">
              <thead>
                <tr className="border-b border-charcoal/10 dark:border-dark-border bg-cream/50 dark:bg-dark-surface/80">
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-charcoal/60 dark:text-dark-muted">
                    PRODUCT / CONSIGNMENT
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-charcoal/60 dark:text-dark-muted">
                    CUSTOMER
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-charcoal/60 dark:text-dark-muted">
                    DELIVERY LOCATION
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-charcoal/60 dark:text-dark-muted">
                    AMOUNT &amp; TXN
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-charcoal/60 dark:text-dark-muted">
                    STATUS
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-charcoal/60 dark:text-dark-muted text-right">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5 dark:divide-dark-border text-xs">
                {SHG_ORDERS_DATA.filter((o) => o.status === "completed").slice(0, 5).map((order, idx) => {
                  const avatarColors = [
                    "bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
                    "bg-purple-600/20 text-purple-700 dark:text-purple-300 border-purple-500/30",
                    "bg-amber-600/20 text-amber-700 dark:text-amber-300 border-amber-500/30",
                    "bg-blue-600/20 text-blue-700 dark:text-blue-300 border-blue-500/30",
                    "bg-rose-600/20 text-rose-700 dark:text-rose-300 border-rose-500/30",
                  ];
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-cream/25 dark:hover:bg-dark-surface/50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl font-display font-bold text-xs flex items-center justify-center shrink-0 border ${avatarColors[idx % avatarColors.length]}`}>
                            {(order.productName || order.title).charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 max-w-[200px] sm:max-w-xs">
                            <p className="font-bold text-sm text-charcoal dark:text-dark-text truncate">
                              {order.productName || order.title}
                            </p>
                            <p className="text-[11px] text-charcoal/50 dark:text-dark-muted flex items-center gap-1.5 mt-0.5">
                              <span className="font-mono font-bold text-charcoal/70 dark:text-dark-text">#{order.id}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-charcoal dark:text-dark-text">
                          {order.customerName || order.user}
                        </p>
                        <p className="text-[11px] text-charcoal/50 dark:text-dark-muted mt-0.5">
                          {order.customerPhone}
                        </p>
                      </td>

                      <td className="px-5 py-4 max-w-[200px]">
                        <p className="font-semibold text-charcoal dark:text-dark-text truncate flex items-center gap-1">
                          <MapPin size={11} className="text-amber-500 shrink-0" />
                          <span className="truncate">{order.deliveryLocation}</span>
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-charcoal/5 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border font-mono font-bold text-olive-800 dark:text-olive-300 text-xs">
                          <span>{order.amount}</span>
                        </span>
                        <p className="font-mono text-[10px] text-charcoal/50 dark:text-dark-muted mt-0.5">
                          {order.transactionId}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25">
                          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-emerald-500" />
                          Completed
                        </span>
                        <p className="text-[10px] text-charcoal/50 dark:text-dark-muted mt-0.5">
                          {order.deliveredDate}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Link
                          to="/shg/orders"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream hover:bg-cream-hover dark:bg-dark-surface text-charcoal dark:text-dark-text border border-charcoal/10 text-xs font-bold transition-all active:scale-95"
                        >
                          <span>Customer Slip</span>
                          <ArrowRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
