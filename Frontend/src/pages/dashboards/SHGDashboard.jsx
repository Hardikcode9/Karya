import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users, IndianRupee, Star, Package, CheckCircle2, Clock,
  MapPin, Building2, Plus
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../utils/api";

export default function SHGDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/shg/dashboard");
      setDashboardData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch SHG dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-charcoal/50">Loading dashboard...</div>;

  const shgName = user?.name || "Your SHG";
  const profile = dashboardData?.shgProfile || {};
  const stats = dashboardData?.statistics || {};

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-olive-900 via-olive-800 to-charcoal text-cream shadow-elevation-2 relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs font-bold text-cream/90 border border-white/15">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{profile.cluster || "Cluster"} · NRLM Verified Federation</span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-medium tracking-tight">
              {shgName}
            </h1>
            <p className="text-xs sm:text-sm text-cream/75 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="flex items-center gap-1.5">
                <MapPin size={13} className="text-amber-400" />
                <span>{user?.village || "Village"}, {user?.district || "District"}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Building2 size={13} className="text-emerald-400" />
                <span>{stats.totalMembers || 0} Registered Women Artisans</span>
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
        <Link
          to="/shg/members"
          className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs flex items-center justify-between hover:border-olive-600/30 transition-all group"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-charcoal/50 dark:text-dark-muted">
              Total Members
            </p>
            <p className="font-display text-2xl sm:text-3xl font-bold text-charcoal dark:text-dark-text mt-1">
              {stats.totalMembers || 0}
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
              100% Aadhaar &amp; Bank linked
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-olive-500/10 text-olive-700 dark:text-olive-400 shrink-0 group-hover:scale-105 transition-transform">
            <Users size={24} />
          </div>
        </Link>

        <Link
          to="/shg/earnings"
          className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs flex items-center justify-between hover:border-olive-600/30 transition-all group"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-charcoal/50 dark:text-dark-muted">
              Total Earning
            </p>
            <p className="font-display text-2xl sm:text-3xl font-bold text-olive-700 dark:text-olive-400 mt-1">
              ₹{stats.totalEarnings || 0}
            </p>
            <p className="text-[11px] text-charcoal/50 dark:text-dark-muted mt-0.5">
              100% Zero-Cut Village Payout
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
            <IndianRupee size={24} />
          </div>
        </Link>

        <Link
          to="/shg/products"
          className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs flex items-center justify-between hover:border-olive-600/30 transition-all group"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-charcoal/50 dark:text-dark-muted">
              Total Products
            </p>
            <p className="font-display text-2xl sm:text-3xl font-bold text-charcoal dark:text-dark-text mt-1">
              {stats.totalProducts || 0}
            </p>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
              Active Handloom &amp; Agro Catalog
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
            <Package size={24} />
          </div>
        </Link>

        <Link
          to="/shg/reviews"
          className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs flex items-center justify-between hover:border-olive-600/30 transition-all group"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-charcoal/50 dark:text-dark-muted">
              Your Reviews
            </p>
            <p className="font-display text-2xl sm:text-3xl font-bold text-charcoal dark:text-dark-text mt-1 flex items-baseline gap-1">
              {profile.rating || 5.0} <span className="text-sm font-medium text-charcoal/50">/ 5</span>
            </p>
            <p className="text-[11px] text-charcoal/50 dark:text-dark-muted mt-0.5">
              Based on {profile.totalReviews || 0} reviews
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
            <Star size={24} className="fill-amber-700 dark:fill-amber-400" />
          </div>
        </Link>
      </div>

      {/* 3. Recent Orders Summary */}
      <div className="bg-white dark:bg-dark-card rounded-3xl border border-charcoal/10 dark:border-dark-border shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-charcoal/10 dark:border-dark-border flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-charcoal dark:text-dark-text">Recent Orders</h3>
            <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-0.5">Track latest incoming product orders &amp; services</p>
          </div>
          <Link
            to="/shg/orders"
            className="text-xs font-bold text-olive-700 dark:text-olive-400 hover:text-olive-800 flex items-center gap-1"
          >
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-charcoal/5 dark:bg-dark-surface text-[10px] uppercase tracking-wider font-bold text-charcoal/50 dark:text-dark-muted">
              <tr>
                <th className="px-5 py-3">Order Details</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5 dark:divide-dark-border font-medium">
              {dashboardData?.recentOrders?.length > 0 ? (
                dashboardData.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-charcoal/2 dark:hover:bg-dark-surface/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-charcoal dark:text-dark-text font-bold">
                        {order.product?.title || order.service?.name || "Order"}
                      </p>
                      <p className="text-[10px] text-charcoal/50">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-5 py-3.5 text-charcoal dark:text-dark-text">
                      {order.customer?.name}
                    </td>
                    <td className="px-5 py-3.5 text-charcoal dark:text-dark-text font-bold">
                      ₹{order.totalAmount}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        order.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {order.status === 'completed' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                        <span className="capitalize">{order.status}</span>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-5 py-8 text-center text-charcoal/50">No recent orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
