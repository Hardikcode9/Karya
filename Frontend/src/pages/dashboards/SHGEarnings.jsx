import { useState, useMemo } from "react";
import {
  IndianRupee, TrendingUp, Calendar, ArrowUpRight, CheckCircle2,
  PieChart as PieChartIcon, BarChart3, SlidersHorizontal, Download,
  Filter, Sparkles, ShoppingBag, ShieldCheck, ArrowDownRight, Clock,
  ChevronRight, RefreshCw, Layers
} from "lucide-react";
import { SHG_PROFILE_DATA } from "../../data/shgDashboardData";
import Button from "../../components/ui/Button";

// Day-wise revenue data for September 2026
const DAILY_REVENUE_DATA = [
  { day: "Sep 01", date: "01 Sep", revenue: 12400, orders: 4, topProduct: "Handloom Sarees" },
  { day: "Sep 02", date: "02 Sep", revenue: 8500, orders: 3, topProduct: "Forest Honey" },
  { day: "Sep 03", date: "03 Sep", revenue: 16800, orders: 6, topProduct: "Terracotta Handi" },
  { day: "Sep 04", date: "04 Sep", revenue: 9200, orders: 3, topProduct: "Handloom Sarees" },
  { day: "Sep 05", date: "05 Sep", revenue: 14000, orders: 5, topProduct: "Madhubani Art" },
  { day: "Sep 06", date: "06 Sep", revenue: 11300, orders: 4, topProduct: "Bamboo Baskets" },
  { day: "Sep 07", date: "07 Sep", revenue: 18900, orders: 7, topProduct: "Forest Honey" },
  { day: "Sep 08", date: "08 Sep", revenue: 13500, orders: 5, topProduct: "Handloom Sarees" },
  { day: "Sep 09", date: "09 Sep", revenue: 10200, orders: 4, topProduct: "Terracotta Handi" },
  { day: "Sep 10", date: "10 Sep", revenue: 24500, orders: 9, topProduct: "Handloom Sarees" }, // Peak Day
  { day: "Sep 11", date: "11 Sep", revenue: 15700, orders: 6, topProduct: "Forest Honey" },
  { day: "Sep 12", date: "12 Sep", revenue: 19800, orders: 7, topProduct: "Handloom Sarees" },
  { day: "Sep 13", date: "13 Sep", revenue: 14200, orders: 5, topProduct: "Handloom Sarees" },
];

// Month-wise revenue data for 2026
const MONTHLY_REVENUE_DATA = [
  { month: "Jan", revenue: 14200, orders: 8, label: "Jan 2026" },
  { month: "Feb", revenue: 18500, orders: 11, label: "Feb 2026" },
  { month: "Mar", revenue: 22400, orders: 14, label: "Mar 2026" },
  { month: "Apr", revenue: 19800, orders: 12, label: "Apr 2026" },
  { month: "May", revenue: 25600, orders: 16, label: "May 2026" },
  { month: "Jun", revenue: 29400, orders: 18, label: "Jun 2026" },
  { month: "Jul", revenue: 34100, orders: 21, label: "Jul 2026" },
  { month: "Aug", revenue: 38200, orders: 24, label: "Aug 2026" },
  { month: "Sep", revenue: 47650, orders: 29, label: "Sep 2026 (Active)" },
];

// Circular Graph: Product Demand Breakdown (High Demands to Low)
const PRODUCT_DEMAND_DATA = [
  {
    id: "prod-1",
    name: "Handloom Chanderi Pure Cotton Sarees",
    category: "Handloom",
    demandLevel: "High Demand",
    demandBadge: "🔥 #1 Top Seller",
    percent: 38,
    amount: "₹70,110",
    unitsSold: 48,
    color: "#38bdf8", // Sky Blue
    trackColor: "stroke-sky-400",
    bgColor: "bg-sky-500/20",
    textColor: "text-sky-300",
  },
  {
    id: "prod-2",
    name: "Raw Wild Forest Honey (500g Jars)",
    category: "Forest Honey",
    demandLevel: "High Demand",
    demandBadge: "⚡ Viral Demand",
    percent: 26,
    amount: "₹47,970",
    unitsSold: 114,
    color: "#fbbf24", // Amber
    trackColor: "stroke-amber-400",
    bgColor: "bg-amber-500/20",
    textColor: "text-amber-300",
  },
  {
    id: "prod-3",
    name: "Natural Terracotta Mitti Handi & Cookware",
    category: "Terracotta",
    demandLevel: "Steady Demand",
    demandBadge: "✨ High Repeat",
    percent: 18,
    amount: "₹33,210",
    unitsSold: 51,
    color: "#fb923c", // Orange
    trackColor: "stroke-orange-400",
    bgColor: "bg-orange-500/20",
    textColor: "text-orange-300",
  },
  {
    id: "prod-4",
    name: "Traditional Madhubani Canvas Folk Art",
    category: "Folk Art",
    demandLevel: "Premiumlot",
    demandBadge: "🎨 Corporate Gifts",
    percent: 10,
    amount: "₹18,450",
    unitsSold: 21,
    color: "#c084fc", // Purple
    trackColor: "stroke-purple-400",
    bgColor: "bg-purple-500/20",
    textColor: "text-purple-300",
  },
  {
    id: "prod-5",
    name: "Braided Golden Bamboo Baskets & Craft",
    category: "Bamboo",
    demandLevel: "Regular Demand",
    demandBadge: "🌿 Eco Favorite",
    percent: 8,
    amount: "₹14,760",
    unitsSold: 31,
    color: "#34d399", // Emerald
    trackColor: "stroke-emerald-400",
    bgColor: "bg-emerald-500/20",
    textColor: "text-emerald-300",
  },
];

// Transaction History Records
const TRANSACTIONS_DATA = [
  {
    id: "TXN-884102",
    date: "13 Sep 2026, 09:15 AM",
    title: "Handloom Chanderi Pure Cotton Sarees (Batch of 10)",
    customer: "Anjali Sharma (Delhi Khadi Emporium)",
    productCategory: "Handloom",
    amount: "₹14,500",
    status: "completed",
    mode: "Direct UPI Merchant (0% Fee)",
  },
  {
    id: "TXN-884091",
    date: "12 Sep 2026, 04:30 PM",
    title: "Raw Wild Forest Honey (35 Jars × 500g)",
    customer: "Dr. Anita Sen (NatureBounty Gurugram)",
    productCategory: "Forest Honey",
    amount: "₹14,700",
    status: "completed",
    mode: "NEFT Bank Transfer",
  },
  {
    id: "TXN-884080",
    date: "11 Sep 2026, 11:20 AM",
    title: "Terracotta Cooking Handi & Curd Pots (25 Sets)",
    customer: "Gramin Rasoi Dhaba (Noida)",
    productCategory: "Terracotta",
    amount: "₹8,750",
    status: "completed",
    mode: "Instant UPI Merchant",
  },
  {
    id: "TXN-884069",
    date: "10 Sep 2026, 02:45 PM",
    title: "Chanderi Handloom Wedding Consignment",
    customer: "FabVillage Boutiques (Jaipur)",
    productCategory: "Handloom",
    amount: "₹24,500",
    status: "completed",
    mode: "Direct RTGS Corporate Settlement",
  },
  {
    id: "TXN-884058",
    date: "08 Sep 2026, 10:15 AM",
    title: "Madhubani Tree of Life Canvas Scroll (15 Pieces)",
    customer: "TechServe India CSR Foundation",
    productCategory: "Folk Art",
    amount: "₹13,350",
    status: "completed",
    mode: "IMPS Payout Settlement",
  },
  {
    id: "TXN-884047",
    date: "05 Sep 2026, 03:00 PM",
    title: "Braided Golden Bamboo Storage Baskets (20 Sets)",
    customer: "EcoLiving Lifestyle Superstore",
    productCategory: "Bamboo",
    amount: "₹9,600",
    status: "completed",
    mode: "UPI Direct Merchant",
  },
  {
    id: "TXN-884036",
    date: "02 Sep 2026, 05:20 PM",
    title: "Monthly Collective Direct Benefit Transfer Payout",
    customer: "24 Village Women Artisan Accounts",
    productCategory: "Handloom",
    amount: "₹1,12,400",
    status: "completed",
    mode: "PFMS DBT Direct Account Deposit",
  },
];

export default function SHGEarnings() {
  // Filter States
  const [timeRange, setTimeRange] = useState("this-month"); // "all", "this-month", "last-month", "last-7-days"
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [selectedProductSlice, setSelectedProductSlice] = useState(null);

  // Earning / Day Data
  const dailyEarningData = useMemo(() => {
    if (timeRange === "last-7-days") {
      return DAILY_REVENUE_DATA.slice(-7);
    }
    return DAILY_REVENUE_DATA;
  }, [timeRange]);

  // Earning / Day Statistics
  const dailyStats = useMemo(() => {
    const total = dailyEarningData.reduce((acc, d) => acc + d.revenue, 0);
    const avg = Math.round(total / (dailyEarningData.length || 1));
    const peak = dailyEarningData.reduce(
      (max, d) => (d.revenue > max.revenue ? d : max),
      dailyEarningData[0] || { revenue: 0 }
    );
    const lowest = dailyEarningData.reduce(
      (min, d) => (d.revenue < min.revenue ? d : min),
      dailyEarningData[0] || { revenue: 0 }
    );
    return { total, avg, peak, lowest };
  }, [dailyEarningData]);

  // SVG Curve Coordinates for Earning / Day Graph
  const svgConfig = { width: 660, height: 210, padLeft: 55, padRight: 25, padTop: 24, padBottom: 30 };
  const minScale = 5000;
  const maxScale = 26000;
  const plotW = svgConfig.width - svgConfig.padLeft - svgConfig.padRight;
  const plotH = svgConfig.height - svgConfig.padTop - svgConfig.padBottom;

  const curvePoints = useMemo(() => {
    return dailyEarningData.map((d, i) => {
      const x = svgConfig.padLeft + (i / Math.max(dailyEarningData.length - 1, 1)) * plotW;
      const y = svgConfig.padTop + plotH - ((d.revenue - minScale) / (maxScale - minScale)) * plotH;
      return { ...d, x, y };
    });
  }, [dailyEarningData, plotW, plotH, svgConfig.padLeft, svgConfig.padTop]);

  const { linePath, areaPath } = useMemo(() => {
    if (curvePoints.length === 0) return { linePath: "", areaPath: "" };
    if (curvePoints.length === 1) {
      const p = curvePoints[0];
      return { linePath: `M ${p.x} ${p.y}`, areaPath: "" };
    }

    let line = `M ${curvePoints[0].x.toFixed(1)} ${curvePoints[0].y.toFixed(1)}`;
    for (let i = 0; i < curvePoints.length - 1; i++) {
      const p0 = curvePoints[i];
      const p1 = curvePoints[i + 1];
      const cx1 = p0.x + (p1.x - p0.x) / 2;
      const cy1 = p0.y;
      const cx2 = p0.x + (p1.x - p0.x) / 2;
      const cy2 = p1.y;
      line += ` C ${cx1.toFixed(1)} ${cy1.toFixed(1)}, ${cx2.toFixed(1)} ${cy2.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
    }

    const baselineY = svgConfig.padTop + plotH;
    const lastX = curvePoints[curvePoints.length - 1].x;
    const firstX = curvePoints[0].x;
    const area = `${line} L ${lastX.toFixed(1)} ${baselineY.toFixed(1)} L ${firstX.toFixed(1)} ${baselineY.toFixed(1)} Z`;

    return { linePath: line, areaPath: area };
  }, [curvePoints, plotH, svgConfig.padTop]);

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return TRANSACTIONS_DATA.filter((txn) => {
      const matchCategory = categoryFilter === "all" || txn.productCategory.toLowerCase() === categoryFilter.toLowerCase();
      const matchStatus = statusFilter === "all" || txn.status.toLowerCase() === statusFilter.toLowerCase();
      return matchCategory && matchStatus;
    });
  }, [categoryFilter, statusFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner - Matches Website Theme */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal/10 dark:border-dark-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-olive-100 dark:bg-olive-950/60 text-olive-800 dark:text-olive-300 text-xs font-bold mb-2 border border-olive-200/60 dark:border-olive-800/40">
            <IndianRupee size={13} className="text-olive-700 dark:text-olive-400" />
            <span>SHG Revenue Analytics &amp; High-Demand Products</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal dark:text-dark-text tracking-tight">
            Revenue &amp; Product Sales Analytics
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted mt-1">
            Day-wise revenue histogram, high-demand circular sales distribution, and settlement ledger.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Only a Filter Button with dropdown popover */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer shadow-xs ${
                showFilterMenu || categoryFilter !== "all" || timeRange !== "this-month"
                  ? "bg-olive-800 text-cream border-olive-800"
                  : "bg-white dark:bg-dark-card border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text hover:bg-cream dark:hover:bg-dark-surface"
              }`}
              title="Filter Analytics"
            >
              <Filter size={14} className={showFilterMenu || categoryFilter !== "all" || timeRange !== "this-month" ? "text-cream" : "text-olive-700 dark:text-olive-400"} />
              <span>Filter</span>
              {(categoryFilter !== "all" || timeRange !== "this-month") && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              )}
            </button>

            {/* Filter Dropdown Popover */}
            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-72 p-4 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-elevation-2 z-30 space-y-3 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-charcoal/10 dark:border-dark-border">
                  <span className="text-xs font-bold text-charcoal dark:text-dark-text flex items-center gap-1.5">
                    <Filter size={13} className="text-olive-700 dark:text-olive-400" />
                    <span>Filter Analytics</span>
                  </span>
                  <button
                    onClick={() => {
                      setTimeRange("this-month");
                      setCategoryFilter("all");
                      setShowFilterMenu(false);
                    }}
                    className="text-[11px] text-olive-700 dark:text-olive-400 font-semibold hover:underline cursor-pointer"
                  >
                    Reset
                  </button>
                </div>

                {/* Time Range */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-charcoal/60 dark:text-dark-muted block">Time Period</label>
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-cream/50 dark:bg-dark-surface text-charcoal dark:text-dark-text border border-charcoal/10 dark:border-dark-border text-xs font-semibold focus:outline-none focus:border-olive-600 cursor-pointer"
                  >
                    <option value="this-month">This Month (Sep 2026)</option>
                    <option value="last-7-days">Last 7 Days</option>
                    <option value="last-month">Last Month (Aug 2026)</option>
                    <option value="all">All Time (2026)</option>
                  </select>
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-charcoal/60 dark:text-dark-muted block">Product Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-cream/50 dark:bg-dark-surface text-charcoal dark:text-dark-text border border-charcoal/10 dark:border-dark-border text-xs font-semibold focus:outline-none focus:border-olive-600 cursor-pointer"
                  >
                    <option value="all">All Products</option>
                    <option value="handloom">Handloom Sarees</option>
                    <option value="forest honey">Wild Forest Honey</option>
                    <option value="terracotta">Terracotta Cookware</option>
                    <option value="folk art">Madhubani Art</option>
                    <option value="bamboo">Bamboo Baskets</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-charcoal/10 dark:border-dark-border flex justify-end">
                  <button
                    onClick={() => setShowFilterMenu(false)}
                    className="px-3 py-1.5 rounded-xl bg-olive-800 text-cream text-xs font-bold hover:bg-olive-900 transition-all cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs text-right">
            <p className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted tracking-wider">Total Group Revenue</p>
            <p className="font-display text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {SHG_PROFILE_DATA.totalEarnings}
            </p>
          </div>
        </div>
      </div>

      {/* 3 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs relative overflow-hidden">
          <p className="text-[11px] uppercase font-bold text-charcoal/50 dark:text-dark-muted tracking-wider">Total Revenue</p>
          <p className="font-display text-2xl sm:text-3xl font-bold text-charcoal dark:text-dark-text mt-1">₹1,84,500</p>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            <ArrowUpRight size={14} />
            <span>+28.4% this quarter</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs relative overflow-hidden">
          <p className="text-[11px] uppercase font-bold text-charcoal/50 dark:text-dark-muted tracking-wider">September Revenue</p>
          <p className="font-display text-2xl sm:text-3xl font-bold text-charcoal dark:text-dark-text mt-1">₹47,650</p>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            <CheckCircle2 size={13} />
            <span>Active Month Record</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs relative overflow-hidden">
          <p className="text-[11px] uppercase font-bold text-charcoal/50 dark:text-dark-muted tracking-wider">Top Selling Item</p>
          <p className="font-display text-lg sm:text-xl font-bold text-charcoal dark:text-dark-text mt-1 truncate">Chanderi Sarees</p>
          <div className="flex items-center gap-1 text-xs font-bold text-olive-700 dark:text-olive-400 mt-2">
            <Sparkles size={13} />
            <span>38% of total sales</span>
          </div>
        </div>
      </div>

      {/* 2 MAIN GRAPHS GRID (HISTOGRAM + CIRCULAR GRAPH) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* GRAPH 1: EARNING / DAY GRAPH - 7 cols */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-3xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-elevation-1 space-y-4 flex flex-col justify-between">
          <div>
            {/* Header: Title, Description, and Range Toggles */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-charcoal/10 dark:border-dark-border">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <TrendingUp size={16} />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-lg font-bold text-charcoal dark:text-dark-text">
                      Earning / Day
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                      ₹ / Day Trend
                    </span>
                  </div>
                  <p className="text-xs text-charcoal/60 dark:text-dark-muted">
                    Daily revenue earned per day for September 2026 (Avg: ₹{dailyStats.avg.toLocaleString()} / day)
                  </p>
                </div>
              </div>

              {/* View Period Toggle */}
              <div className="flex items-center p-1 rounded-xl bg-cream/60 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border shrink-0">
                <button
                  onClick={() => setTimeRange("this-month")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    timeRange !== "last-7-days"
                      ? "bg-olive-800 text-cream shadow-xs"
                      : "text-charcoal/70 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text"
                  }`}
                >
                  All Days (Sep 01–13)
                </button>
                <button
                  onClick={() => setTimeRange("last-7-days")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    timeRange === "last-7-days"
                      ? "bg-olive-800 text-cream shadow-xs"
                      : "text-charcoal/70 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text"
                  }`}
                >
                  Last 7 Days
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar: Avg / Day, Peak Day, Lowest Day */}
            <div className="grid grid-cols-3 gap-2 my-3">
              <div className="p-2 rounded-xl bg-cream/30 dark:bg-dark-surface/50 border border-charcoal/10 dark:border-dark-border text-center">
                <p className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted">Daily Average</p>
                <p className="font-mono font-bold text-xs sm:text-sm text-charcoal dark:text-dark-text">
                  ₹{dailyStats.avg.toLocaleString()} <span className="text-[10px] font-normal text-charcoal/60">/ day</span>
                </p>
              </div>

              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-center">
                <p className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300">Peak Earning</p>
                <p className="font-mono font-bold text-xs sm:text-sm text-emerald-700 dark:text-emerald-400">
                  ₹{dailyStats.peak.revenue?.toLocaleString()} <span className="text-[10px] font-normal">({dailyStats.peak.day})</span>
                </p>
              </div>

              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-center">
                <p className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300">Minimum Day</p>
                <p className="font-mono font-bold text-xs sm:text-sm text-amber-700 dark:text-amber-400">
                  ₹{dailyStats.lowest.revenue?.toLocaleString()} <span className="text-[10px] font-normal">({dailyStats.lowest.day})</span>
                </p>
              </div>
            </div>

            {/* Active Hover / Inspection Callout */}
            <div className="mb-2 px-4 py-2 rounded-2xl bg-cream/40 dark:bg-dark-surface/60 border border-charcoal/10 dark:border-dark-border flex items-center justify-between text-xs">
              {hoveredPoint ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="font-bold text-charcoal dark:text-dark-text">
                      {hoveredPoint.day} ({hoveredPoint.date}):
                    </span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                      ₹{hoveredPoint.revenue.toLocaleString()} / day
                    </span>
                  </div>
                  <span className="text-charcoal/60 dark:text-dark-muted font-semibold">
                    {hoveredPoint.orders} consignments · Top: {hoveredPoint.topProduct}
                  </span>
                </>
              ) : (
                <div className="flex items-center justify-between w-full text-charcoal/50 dark:text-dark-muted">
                  <span>Hover along the curve points to inspect exact earning/day</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Peak Day: Sep 10 (₹24,500/day)</span>
                </div>
              )}
            </div>

            {/* SVG EARNING / DAY CURVE GRAPH */}
            <div className="relative pt-2 pb-1">
              <svg
                viewBox="0 0 660 210"
                className="w-full h-56 overflow-visible select-none"
              >
                <defs>
                  {/* Area Gradient */}
                  <linearGradient id="earningDayAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
                    <stop offset="60%" stopColor="#10b981" stopOpacity="0.10" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid Guidelines and Y-Axis Labels */}
                {[
                  { val: 25000, label: "₹25k/d" },
                  { val: 20000, label: "₹20k/d" },
                  { val: 15000, label: "₹15k/d" },
                  { val: 10000, label: "₹10k/d" },
                ].map((g) => {
                  const y = svgConfig.padTop + plotH - ((g.val - minScale) / (maxScale - minScale)) * plotH;
                  return (
                    <g key={g.val}>
                      <line
                        x1={svgConfig.padLeft}
                        y1={y}
                        x2={svgConfig.width - svgConfig.padRight}
                        y2={y}
                        stroke="currentColor"
                        className="text-charcoal/10 dark:text-dark-border"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                      />
                      <text
                        x={svgConfig.padLeft - 8}
                        y={y + 3.5}
                        textAnchor="end"
                        className="text-[10px] font-mono fill-charcoal/50 dark:fill-dark-muted"
                      >
                        {g.label}
                      </text>
                    </g>
                  );
                })}

                {/* Daily Average Reference Line */}
                {(() => {
                  const avgY = svgConfig.padTop + plotH - ((dailyStats.avg - minScale) / (maxScale - minScale)) * plotH;
                  return (
                    <g>
                      <line
                        x1={svgConfig.padLeft}
                        y1={avgY}
                        x2={svgConfig.width - svgConfig.padRight}
                        y2={avgY}
                        stroke="#f59e0b"
                        strokeDasharray="2 3"
                        strokeWidth="1.2"
                        opacity="0.8"
                      />
                      <text
                        x={svgConfig.width - svgConfig.padRight}
                        y={avgY - 4}
                        textAnchor="end"
                        className="text-[9px] font-bold fill-amber-600 dark:fill-amber-400 font-mono"
                      >
                        Avg: ₹{Math.round(dailyStats.avg / 1000)}k/d
                      </text>
                    </g>
                  );
                })()}

                {/* Area Fill Under Curve */}
                {areaPath && (
                  <path
                    d={areaPath}
                    fill="url(#earningDayAreaGrad)"
                  />
                )}

                {/* Spline Line Path */}
                {linePath && (
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Interactive Data Points */}
                {curvePoints.map((pt, idx) => {
                  const isPeak = pt.revenue === dailyStats.peak.revenue;
                  const isHovered = hoveredPoint?.day === pt.day;

                  return (
                    <g
                      key={pt.day || idx}
                      className="cursor-pointer group"
                      onMouseEnter={() => setHoveredPoint(pt)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    >
                      {/* Vertical Indicator Bar on Hover */}
                      {isHovered && (
                        <line
                          x1={pt.x}
                          y1={pt.y}
                          x2={pt.x}
                          y2={svgConfig.padTop + plotH}
                          stroke="#10b981"
                          strokeDasharray="2 2"
                          strokeWidth="1.5"
                          opacity="0.7"
                        />
                      )}

                      {/* Static Halo Ring for Peak Day (No ping, no moving hover circle) */}
                      {isPeak && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={8}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2"
                          opacity="0.4"
                        />
                      )}

                      {/* Center Data Dot (Static, fixed position) */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isPeak ? 5 : 3.5}
                        fill={isPeak ? "#10b981" : "#059669"}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />

                      {/* Earning / day label on top of peak or hovered point */}
                      {(isHovered || isPeak) && (
                        <g>
                          <rect
                            x={pt.x - 28}
                            y={pt.y - 24}
                            width="56"
                            height="18"
                            rx="5"
                            className="fill-charcoal dark:fill-dark-card shadow-xs"
                          />
                          <text
                            x={pt.x}
                            y={pt.y - 12}
                            textAnchor="middle"
                            className="text-[10px] font-mono font-bold fill-white"
                          >
                            ₹{Math.round(pt.revenue / 1000)}k/d
                          </text>
                        </g>
                      )}

                      {/* Invisible Larger Touch Area */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="18"
                        fill="transparent"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* X-Axis Dates Labels */}
              <div className="flex items-center justify-between pl-14 pr-4 pt-1">
                {curvePoints.map((pt, i) => {
                  const isHovered = hoveredPoint?.day === pt.day;
                  const isPeak = pt.revenue === dailyStats.peak.revenue;
                  return (
                    <button
                      key={i}
                      onClick={() => setHoveredPoint(pt)}
                      onMouseEnter={() => setHoveredPoint(pt)}
                      className={`text-[10px] font-mono font-semibold transition-all px-1 py-0.5 rounded cursor-pointer ${
                        isHovered
                          ? "bg-olive-800 text-cream font-bold scale-105"
                          : isPeak
                          ? "text-emerald-600 dark:text-emerald-400 font-bold"
                          : "text-charcoal/50 dark:text-dark-muted hover:text-charcoal"
                      }`}
                    >
                      {pt.date}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="pt-3 border-t border-charcoal/10 dark:border-dark-border flex items-center justify-between text-xs text-charcoal/60 dark:text-dark-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Continuous Day-to-Day Earning Ledger (Peak: Sep 10 at ₹24,500/day)</span>
            </span>
            <span className="font-mono text-charcoal dark:text-dark-text font-bold">
              Total: ₹{dailyStats.total.toLocaleString()}
            </span>
          </div>

          {/* 3 Important Performance Highlights Below Graph */}
          <div className="pt-3 border-t border-charcoal/10 dark:border-dark-border grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">Peak Single Day</span>
              </div>
              <p className="font-mono font-bold text-sm text-emerald-700 dark:text-emerald-400">
                ₹24,500 <span className="text-[10px] font-sans font-normal text-charcoal/60 dark:text-dark-muted">(Sep 10)</span>
              </p>
              <p className="text-[10px] text-charcoal/60 dark:text-dark-muted mt-1 leading-tight">
                Festive Chanderi saree bulk orders drove month's highest daily turnover.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-olive-500/10 border border-olive-500/20 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles size={13} className="text-olive-700 dark:text-olive-300 shrink-0" />
                <span className="text-[11px] font-bold text-olive-800 dark:text-olive-300">Daily Average Run-Rate</span>
              </div>
              <p className="font-mono font-bold text-sm text-olive-800 dark:text-olive-300">
                ₹14,538 <span className="text-[10px] font-sans font-normal text-charcoal/60 dark:text-dark-muted">/ day</span>
              </p>
              <p className="text-[10px] text-charcoal/60 dark:text-dark-muted mt-1 leading-tight">
                Consistent volume maintained across all 13 active days above ₹8.5k/d floor.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 mb-1">
                <CheckCircle2 size={13} className="text-amber-700 dark:text-amber-400 shrink-0" />
                <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300">Direct DBT Settlement</span>
              </div>
              <p className="font-mono font-bold text-sm text-amber-800 dark:text-amber-300">
                ₹1,89,000 <span className="text-[10px] font-sans font-normal text-charcoal/60 dark:text-dark-muted">100% direct</span>
              </p>
              <p className="text-[10px] text-charcoal/60 dark:text-dark-muted mt-1 leading-tight">
                Zero middleman fees. Entire turnover transferred directly into artisan accounts.
              </p>
            </div>
          </div>
        </div>

        {/* GRAPH 2: CIRCULAR GRAPH (WHICH PRODUCT MAINLY SELLS / HIGH DEMANDS) - 5 cols */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-3xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-elevation-1 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-charcoal/10 dark:border-dark-border">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-olive-100 dark:bg-olive-950/60 text-olive-800 dark:text-olive-300 flex items-center justify-center border border-olive-200/60 dark:border-olive-800/40">
                  <PieChartIcon size={16} />
                </span>
                <div>
                  <h2 className="font-display text-lg font-bold text-charcoal dark:text-dark-text">
                    Product Demand Graph
                  </h2>
                  <p className="text-xs text-charcoal/60 dark:text-dark-muted">
                    Highest selling &amp; in-demand artisan products
                  </p>
                </div>
              </div>
            </div>

            {/* CIRCULAR / DONUT GRAPH SVG */}
            <div className="relative flex items-center justify-center py-4">
              <svg className="w-52 h-52 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-charcoal/10 dark:stroke-dark-border"
                  strokeWidth="13"
                  fill="transparent"
                />

                {/* Slices calculated by cumulative percentage */}
                {/* 1. Sarees (38%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#38bdf8"
                  strokeWidth="13"
                  strokeDasharray="90.7 238.76"
                  strokeDashoffset="0"
                  fill="transparent"
                  className="hover:stroke-sky-400 transition-all cursor-pointer"
                  onMouseEnter={() => setSelectedProductSlice(PRODUCT_DEMAND_DATA[0])}
                  onMouseLeave={() => setSelectedProductSlice(null)}
                />

                {/* 2. Honey (26%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#f59e0b"
                  strokeWidth="13"
                  strokeDasharray="62.1 238.76"
                  strokeDashoffset="-90.7"
                  fill="transparent"
                  className="hover:stroke-amber-400 transition-all cursor-pointer"
                  onMouseEnter={() => setSelectedProductSlice(PRODUCT_DEMAND_DATA[1])}
                  onMouseLeave={() => setSelectedProductSlice(null)}
                />

                {/* 3. Terracotta (18%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#f97316"
                  strokeWidth="13"
                  strokeDasharray="43.0 238.76"
                  strokeDashoffset="-152.8"
                  fill="transparent"
                  className="hover:stroke-orange-400 transition-all cursor-pointer"
                  onMouseEnter={() => setSelectedProductSlice(PRODUCT_DEMAND_DATA[2])}
                  onMouseLeave={() => setSelectedProductSlice(null)}
                />

                {/* 4. Madhubani (10%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#a855f7"
                  strokeWidth="13"
                  strokeDasharray="23.9 238.76"
                  strokeDashoffset="-195.8"
                  fill="transparent"
                  className="hover:stroke-purple-400 transition-all cursor-pointer"
                  onMouseEnter={() => setSelectedProductSlice(PRODUCT_DEMAND_DATA[3])}
                  onMouseLeave={() => setSelectedProductSlice(null)}
                />

                {/* 5. Bamboo (8%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#10b981"
                  strokeWidth="13"
                  strokeDasharray="19.1 238.76"
                  strokeDashoffset="-219.7"
                  fill="transparent"
                  className="hover:stroke-emerald-400 transition-all cursor-pointer"
                  onMouseEnter={() => setSelectedProductSlice(PRODUCT_DEMAND_DATA[4])}
                  onMouseLeave={() => setSelectedProductSlice(null)}
                />
              </svg>

              {/* Center Donut Hub Details */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
                <span className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted tracking-wider">
                  {selectedProductSlice ? "Selected Product" : "Top Demand"}
                </span>
                <p className="font-display text-xl font-bold text-charcoal dark:text-dark-text leading-tight">
                  {selectedProductSlice ? `${selectedProductSlice.percent}%` : "38%"}
                </p>
                <p className="text-[11px] font-bold text-olive-700 dark:text-olive-400 truncate max-w-[120px]">
                  {selectedProductSlice ? selectedProductSlice.category : "Chanderi Sarees"}
                </p>
              </div>
            </div>

            {/* HIGH-DEMAND PRODUCT BREAKDOWN LIST */}
            <div className="space-y-2 text-xs">
              {PRODUCT_DEMAND_DATA.map((item) => (
                <div
                  key={item.id}
                  onMouseEnter={() => setSelectedProductSlice(item)}
                  onMouseLeave={() => setSelectedProductSlice(null)}
                  className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    selectedProductSlice?.id === item.id
                      ? "bg-olive-50 dark:bg-olive-950/40 border-olive-500/40 shadow-xs scale-[1.01]"
                      : "bg-cream/30 dark:bg-dark-surface/50 border-charcoal/10 dark:border-dark-border hover:bg-cream/60 dark:hover:bg-dark-surface"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      style={{ backgroundColor: item.color }}
                      className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-charcoal dark:text-dark-text truncate text-xs">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-charcoal/50 dark:text-dark-muted">
                        {item.unitsSold} units sold · {item.demandBadge}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-2">
                    <p className="font-bold text-charcoal dark:text-dark-text font-mono text-xs">{item.percent}%</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold font-mono">{item.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-charcoal/10 dark:border-dark-border text-center">
            <p className="text-[11px] text-charcoal/60 dark:text-dark-muted">
              ⚡ High-demand handloom &amp; wild honey comprise <span className="text-charcoal dark:text-dark-text font-bold">64% of total sales</span>
            </p>
          </div>
        </div>
      </div>

      {/* DETAILED SETTLEMENT TRANSACTIONS TABLE */}
      <div className="rounded-3xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-elevation-1 overflow-hidden">
        <div className="p-5 border-b border-charcoal/10 dark:border-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-bold text-charcoal dark:text-dark-text">
              Direct Settlement Ledger
            </h3>
            <p className="text-xs text-charcoal/60 dark:text-dark-muted">
              Showing {filteredTransactions.length} verified consignments credited to SHG joint account
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-charcoal/60 dark:text-dark-muted font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-cream/50 dark:bg-dark-surface text-charcoal dark:text-dark-text border border-charcoal/10 dark:border-dark-border text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed &amp; Settled</option>
              <option value="active">In Process</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-charcoal/10 dark:border-dark-border bg-cream/50 dark:bg-dark-surface/80 text-[11px] uppercase tracking-wider text-charcoal/60 dark:text-dark-muted">
                <th className="px-5 py-3.5 font-bold">Consignment / Item</th>
                <th className="px-5 py-3.5 font-bold">Customer / Client</th>
                <th className="px-5 py-3.5 font-bold">Date &amp; Time</th>
                <th className="px-5 py-3.5 font-bold">Payment Method</th>
                <th className="px-5 py-3.5 font-bold">Settlement Status</th>
                <th className="px-5 py-3.5 font-bold text-right">Net Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5 dark:divide-dark-border text-xs">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-charcoal/50 dark:text-dark-muted">
                    No transactions matching current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-cream/25 dark:hover:bg-dark-surface/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-bold text-charcoal dark:text-dark-text text-sm">{txn.title}</p>
                      <p className="font-mono text-[10px] text-charcoal/50 dark:text-dark-muted">{txn.id}</p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-charcoal dark:text-dark-text">{txn.customer}</p>
                    </td>

                    <td className="px-5 py-4 text-charcoal/60 dark:text-dark-muted font-mono text-[11px]">
                      {txn.date}
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-charcoal/80 dark:text-dark-text">
                        <ShieldCheck size={12} className="text-emerald-600 dark:text-emerald-400" />
                        <span>{txn.mode}</span>
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                        Settled
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                        {txn.amount}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
