import { useState, useMemo } from "react";
import {
  IndianRupee, TrendingUp, Wallet, ArrowDownLeft, ArrowUpRight,
  Filter, Search, Download, Calendar, CheckCircle2, Clock,
  AlertCircle, ShieldCheck, RefreshCw, Sparkles, Building, Phone,
  BarChart3, Layers, Zap
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

const INITIAL_EARNINGS_RECORDS = [
  {
    id: "TXN-9812",
    bookingId: "BKG-9201",
    customerName: "Aarav Sharma",
    customerPhone: "+91 98765 23412",
    serviceName: "4 Sets School Uniforms Stitching",
    date: "11 Sep 2026",
    time: "02:45 PM",
    amount: 1200,
    platformFee: 0,
    netPayout: 1200,
    paymentMode: "UPI Instant Pay",
    status: "Completed",
    upiRef: "UPI-RRR-9281048",
  },
  {
    id: "TXN-9745",
    bookingId: "BKG-8845",
    customerName: "Meera Devi",
    customerPhone: "+91 94150 87342",
    serviceName: "Chanderi Cotton Saree Fall & Pico",
    date: "09 Sep 2026",
    time: "11:20 AM",
    amount: 450,
    platformFee: 0,
    netPayout: 450,
    paymentMode: "Cash Collected",
    status: "Completed",
    upiRef: "Cash Handover Slip #44",
  },
  {
    id: "TXN-9689",
    bookingId: "BKG-8419",
    customerName: "Rajeshwar Singh",
    customerPhone: "+91 91200 45892",
    serviceName: "Kurta Pajama Festive Stitching",
    date: "05 Sep 2026",
    time: "04:15 PM",
    amount: 1450,
    platformFee: 0,
    netPayout: 1450,
    paymentMode: "UPI Instant Pay",
    status: "Completed",
    upiRef: "UPI-RRR-8419201",
  },
  {
    id: "TXN-9512",
    bookingId: "BKG-8022",
    customerName: "Pooja Verma",
    customerPhone: "+91 97890 34112",
    serviceName: "Designer Zari Blouse Cutting",
    date: "28 Aug 2026",
    time: "05:30 PM",
    amount: 850,
    platformFee: 0,
    netPayout: 850,
    paymentMode: "UPI Instant Pay",
    status: "Completed",
    upiRef: "UPI-RRR-8022194",
  },
  {
    id: "TXN-9420",
    bookingId: "BKG-7650",
    customerName: "Mohit Tiwari",
    customerPhone: "+91 99180 67234",
    serviceName: "Emergency Backpack & Uniform Repair",
    date: "21 Aug 2026",
    time: "09:10 AM",
    amount: 350,
    platformFee: 0,
    netPayout: 350,
    paymentMode: "Cash Collected",
    status: "Completed",
    upiRef: "Cash Handover Slip #39",
  },
  {
    id: "TXN-9380",
    bookingId: "BKG-7119",
    customerName: "Dinesh Patel",
    customerPhone: "+91 93350 11984",
    serviceName: "Canvas Tool Bag Stitching",
    date: "14 Aug 2026",
    time: "03:00 PM",
    amount: 900,
    platformFee: 0,
    netPayout: 900,
    paymentMode: "Direct Bank Transfer",
    status: "Completed",
    upiRef: "NEFT-SBI-711928",
  },
  {
    id: "TXN-9201",
    bookingId: "BKG-6890",
    customerName: "Sanjay Mishra",
    customerPhone: "+91 94500 66120",
    serviceName: "Village School Batch Uniforms (Partial)",
    date: "04 Aug 2026",
    time: "01:15 PM",
    amount: 2800,
    platformFee: 0,
    netPayout: 2800,
    paymentMode: "UPI Instant Pay",
    status: "Completed",
    upiRef: "UPI-RRR-6890412",
  },
  {
    id: "TXN-9110",
    bookingId: "BKG-6450",
    customerName: "Kalyani Devi",
    customerPhone: "+91 98390 44219",
    serviceName: "Panchayat Banner & Fabric Embroidery",
    date: "29 Jul 2026",
    time: "04:40 PM",
    amount: 1600,
    platformFee: 0,
    netPayout: 1600,
    paymentMode: "Direct Bank Transfer",
    status: "Completed",
    upiRef: "NEFT-SBI-645019",
  },
];

export default function WorkerEarnings() {
  const { user } = useAuth();
  const toast = useToast();

  const [records] = useState(INITIAL_EARNINGS_RECORDS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'Completed', 'Pending'
  const [modeFilter, setModeFilter] = useState("all"); // 'all', 'UPI', 'Cash', 'Bank'
  const [dateFilter, setDateFilter] = useState("all"); // 'all', 'sep26', 'aug26', 'jul26'

  // Graphs Mode & Geometry
  const [graphMode, setGraphMode] = useState("monthly"); // 'monthly' | 'weekly'
  const [hoveredGraphPoint, setHoveredGraphPoint] = useState(null);

  const activeGraphSeries = useMemo(() => {
    if (graphMode === "weekly") {
      return [
        { label: "Week 1", amount: 6800, jobs: 22, growth: "+12%" },
        { label: "Week 2", amount: 7400, jobs: 24, growth: "+9%" },
        { label: "Week 3", amount: 6100, jobs: 20, growth: "-17%" },
        { label: "Week 4", amount: 4200, jobs: 14, growth: "-31%" },
        { label: "Week 5", amount: 1800, jobs: 6, growth: "Current" },
      ];
    }
    return [
      { label: "Apr", amount: 18400, jobs: 62, growth: "+15%" },
      { label: "May", amount: 21600, jobs: 72, growth: "+17%" },
      { label: "Jun", amount: 24200, jobs: 80, growth: "+12%" },
      { label: "Jul", amount: 22400, jobs: 74, growth: "-7%" },
      { label: "Aug", amount: 25800, jobs: 85, growth: "+15%" },
      { label: "Sep", amount: 26300, jobs: 86, growth: "+2%" },
    ];
  }, [graphMode]);

  const earningsChartGeom = useMemo(() => {
    const points = activeGraphSeries;
    const width = 680;
    const height = 220;
    const paddingLeft = 65;
    const paddingRight = 25;
    const paddingTop = 25;
    const paddingBottom = 40;

    const plotWidth = width - paddingLeft - paddingRight;
    const plotHeight = height - paddingTop - paddingBottom;

    const values = points.map((p) => p.amount);
    const maxVal = Math.ceil(Math.max(...values, 1000) * 1.15);
    const stepX = points.length > 1 ? plotWidth / (points.length - 1) : plotWidth;

    const coords = points.map((p, index) => {
      const x = paddingLeft + index * stepX;
      const y = paddingTop + plotHeight - (p.amount / maxVal) * plotHeight;
      return { ...p, x, y, index };
    });

    let linePath = "";
    if (coords.length > 0) {
      linePath = `M ${coords[0].x} ${coords[0].y}`;
      for (let i = 0; i < coords.length - 1; i++) {
        const p0 = coords[i];
        const p1 = coords[i + 1];
        const cpX1 = p0.x + (p1.x - p0.x) / 2;
        const cpY1 = p0.y;
        const cpX2 = p0.x + (p1.x - p0.x) / 2;
        const cpY2 = p1.y;
        linePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
      }
    }

    const areaPath = coords.length > 0
      ? `${linePath} L ${coords[coords.length - 1].x} ${paddingTop + plotHeight} L ${coords[0].x} ${paddingTop + plotHeight} Z`
      : "";

    const ticks = [0, 0.33, 0.66, 1].map((ratio) => {
      const tickValue = Math.round(maxVal * ratio);
      const y = paddingTop + plotHeight - ratio * plotHeight;
      return { tickValue, y };
    });

    return {
      width,
      height,
      paddingLeft,
      paddingTop,
      plotWidth,
      plotHeight,
      maxVal,
      coords,
      linePath,
      areaPath,
      ticks,
    };
  }, [activeGraphSeries]);

  // Summary Metrics
  const summary = useMemo(() => {
    const totalEarnings = records.reduce((acc, r) => acc + r.netPayout, 0);
    const thisMonth = records
      .filter((r) => r.date.includes("Sep 2026"))
      .reduce((acc, r) => acc + r.netPayout, 0);
    const upiEarnings = records
      .filter((r) => r.paymentMode.includes("UPI"))
      .reduce((acc, r) => acc + r.netPayout, 0);
    const cashEarnings = records
      .filter((r) => r.paymentMode.includes("Cash"))
      .reduce((acc, r) => acc + r.netPayout, 0);

    return { totalEarnings, thisMonth, upiEarnings, cashEarnings, count: records.length };
  }, [records]);

  // Filtered Ledger
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        r.customerName.toLowerCase().includes(q) ||
        r.customerPhone.toLowerCase().includes(q) ||
        r.serviceName.toLowerCase().includes(q) ||
        r.bookingId.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q);

      let matchStatus = true;
      if (statusFilter !== "all") matchStatus = r.status === statusFilter;

      let matchMode = true;
      if (modeFilter === "UPI") matchMode = r.paymentMode.includes("UPI");
      else if (modeFilter === "Cash") matchMode = r.paymentMode.includes("Cash");
      else if (modeFilter === "Bank") matchMode = r.paymentMode.includes("Bank");

      let matchDate = true;
      if (dateFilter === "sep26") matchDate = r.date.includes("Sep 2026");
      else if (dateFilter === "aug26") matchDate = r.date.includes("Aug 2026");
      else if (dateFilter === "jul26") matchDate = r.date.includes("Jul 2026");

      return matchSearch && matchStatus && matchMode && matchDate;
    });
  }, [records, searchQuery, statusFilter, modeFilter, dateFilter]);

  const handleExportStatement = () => {
    toast.show("Downloading official earnings statement (PDF/CSV)...", "info");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-charcoal dark:text-dark-text font-bold">
            Direct Income &amp; Earnings Ledger
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted mt-1">
            Transparent weekly payouts, cash collections, and zero-commission guarantees.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportStatement}
          className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-olive-700 hover:bg-olive-800 text-white shadow-sm border border-olive-800/20 active:scale-[0.98] transition-all self-start sm:self-auto cursor-pointer"
        >
          <Download size={16} />
          <span>Export Statement</span>
        </button>
      </div>

      {/* SUMMARY METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Lifetime Earnings */}
        <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-5 border border-charcoal/10 dark:border-dark-border shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60 dark:text-dark-muted">
              Lifetime Earned
            </span>
            <span className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <IndianRupee size={16} />
            </span>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-bold text-charcoal dark:text-dark-text">
              ₹{summary.totalEarnings.toLocaleString("en-IN")}
            </span>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mt-1 flex items-center gap-1">
              <ShieldCheck size={12} />
              <span>100% Direct Payouts Received</span>
            </p>
          </div>
        </div>

        {/* This Month's Income */}
        <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-5 border border-charcoal/10 dark:border-dark-border shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60 dark:text-dark-muted">
              This Month (Sep)
            </span>
            <span className="w-8 h-8 rounded-xl bg-olive-100 dark:bg-olive-950 text-olive-700 flex items-center justify-center">
              <TrendingUp size={16} />
            </span>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-bold text-charcoal dark:text-dark-text">
              ₹{summary.thisMonth.toLocaleString("en-IN")}
            </span>
            <p className="text-[11px] text-charcoal/60 dark:text-dark-muted mt-1">
              From 3 completed jobs this week
            </p>
          </div>
        </div>

        {/* Settled via UPI */}
        <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-5 border border-charcoal/10 dark:border-dark-border shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60 dark:text-dark-muted">
              UPI Direct Routing
            </span>
            <span className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
              <Wallet size={16} />
            </span>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-bold text-charcoal dark:text-dark-text">
              ₹{summary.upiEarnings.toLocaleString("en-IN")}
            </span>
            <p className="text-[11px] text-blue-700 dark:text-blue-400 font-bold mt-1">
              Instant Bank Settlement
            </p>
          </div>
        </div>

        {/* Cash in Hand */}
        <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-5 border border-charcoal/10 dark:border-dark-border shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60 dark:text-dark-muted">
              Cash Collected
            </span>
            <span className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 flex items-center justify-center">
              <Building size={16} />
            </span>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-bold text-charcoal dark:text-dark-text">
              ₹{summary.cashEarnings.toLocaleString("en-IN")}
            </span>
            <p className="text-[11px] text-charcoal/60 dark:text-dark-muted mt-1">
              Customer doorstep handovers
            </p>
          </div>
        </div>
      </div>

      {/* INTERACTIVE GRAPHS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
        {/* Graph 1: Interactive XY Earnings Trajectory Curve */}
        <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-5 sm:p-6 border border-charcoal/10 dark:border-dark-border shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-charcoal/10 dark:border-dark-border">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-olive-700 dark:text-olive-400" />
                <h2 className="font-display text-lg sm:text-xl font-bold text-charcoal dark:text-dark-text">
                  Income Trajectory (X-Y Trend Graph)
                </h2>
              </div>
              <p className="text-[11px] text-charcoal/60 dark:text-dark-muted mt-0.5">
                X-Axis: Time Interval · Y-Axis: Verified Earnings in Rupees (₹)
              </p>
            </div>

            {/* View Switcher: Monthly vs Weekly */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-cream dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  setGraphMode("monthly");
                  setHoveredGraphPoint(null);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  graphMode === "monthly"
                    ? "bg-olive-700 text-white shadow-2xs"
                    : "text-charcoal/60 dark:text-dark-muted hover:text-charcoal"
                }`}
              >
                Monthly (6 Mos)
              </button>
              <button
                type="button"
                onClick={() => {
                  setGraphMode("weekly");
                  setHoveredGraphPoint(null);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  graphMode === "weekly"
                    ? "bg-olive-700 text-white shadow-2xs"
                    : "text-charcoal/60 dark:text-dark-muted hover:text-charcoal"
                }`}
              >
                Weekly (Sep)
              </button>
            </div>
          </div>

          {/* SVG Coordinate Graph */}
          <div className="relative w-full overflow-hidden bg-white/70 dark:bg-dark-surface/60 rounded-2xl p-2 sm:p-4 border border-charcoal/5 dark:border-dark-border">
            <svg
              viewBox={`0 0 ${earningsChartGeom.width} ${earningsChartGeom.height}`}
              className="w-full h-auto max-h-[280px] select-none"
            >
              <defs>
                <linearGradient id="earningsAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#556B2F" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#556B2F" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#556B2F" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Y-Axis Label */}
              <text
                x="15"
                y="16"
                fontSize="10"
                fontWeight="bold"
                fill="currentColor"
                className="text-charcoal/50 dark:text-dark-muted uppercase tracking-wider"
              >
                Y: Payout (₹)
              </text>

              {/* Grid Lines & Y-Axis Ticks */}
              {earningsChartGeom.ticks.map((tick, idx) => (
                <g key={idx}>
                  <line
                    x1={earningsChartGeom.paddingLeft}
                    y1={tick.y}
                    x2={earningsChartGeom.width - 20}
                    y2={tick.y}
                    stroke="currentColor"
                    strokeOpacity={idx === 0 ? "0.2" : "0.08"}
                    strokeDasharray={idx === 0 ? "" : "4 4"}
                    className="text-charcoal dark:text-dark-border"
                  />
                  <text
                    x={earningsChartGeom.paddingLeft - 8}
                    y={tick.y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fontWeight="600"
                    fill="currentColor"
                    className="text-charcoal/60 dark:text-dark-muted font-mono"
                  >
                    ₹{tick.tickValue >= 1000 ? `${(tick.tickValue / 1000).toFixed(tick.tickValue % 1000 === 0 ? 0 : 1)}k` : tick.tickValue}
                  </text>
                </g>
              ))}

              {/* Y-Axis Line */}
              <line
                x1={earningsChartGeom.paddingLeft}
                y1={earningsChartGeom.paddingTop - 5}
                x2={earningsChartGeom.paddingLeft}
                y2={earningsChartGeom.height - 40}
                stroke="currentColor"
                strokeOpacity="0.25"
                strokeWidth="1.5"
                className="text-charcoal dark:text-dark-border"
              />

              {/* X-Axis Line */}
              <line
                x1={earningsChartGeom.paddingLeft}
                y1={earningsChartGeom.height - 40}
                x2={earningsChartGeom.width - 20}
                y2={earningsChartGeom.height - 40}
                stroke="currentColor"
                strokeOpacity="0.25"
                strokeWidth="1.5"
                className="text-charcoal dark:text-dark-border"
              />

              {/* Area Polygon */}
              {earningsChartGeom.areaPath && (
                <path
                  d={earningsChartGeom.areaPath}
                  fill="url(#earningsAreaGrad)"
                  className="transition-all duration-300"
                />
              )}

              {/* Trend Curve */}
              {earningsChartGeom.linePath && (
                <path
                  d={earningsChartGeom.linePath}
                  fill="none"
                  stroke="#556B2F"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-300"
                />
              )}

              {/* Coordinate Nodes & X-Axis Labels */}
              {earningsChartGeom.coords.map((coord, idx) => {
                const isHovered = hoveredGraphPoint?.index === idx;
                return (
                  <g key={idx}>
                    {/* Vertical guide on hover */}
                    {isHovered && (
                      <line
                        x1={coord.x}
                        y1={earningsChartGeom.paddingTop}
                        x2={coord.x}
                        y2={earningsChartGeom.height - 40}
                        stroke="#556B2F"
                        strokeDasharray="3 3"
                        strokeWidth="1.5"
                        strokeOpacity="0.6"
                      />
                    )}

                    {/* Outer pulse circle on hover */}
                    {isHovered && (
                      <circle
                        cx={coord.x}
                        cy={coord.y}
                        r="10"
                        fill="#556B2F"
                        fillOpacity="0.2"
                        className="animate-pulse"
                      />
                    )}

                    {/* Node circle */}
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r={isHovered ? "5.5" : "4"}
                      fill="#FFFFFF"
                      stroke="#556B2F"
                      strokeWidth="2.5"
                      className="cursor-pointer transition-all shadow-xs"
                      onMouseEnter={() => setHoveredGraphPoint(coord)}
                      onClick={() => setHoveredGraphPoint(coord)}
                    />

                    {/* X-Axis Tick */}
                    <line
                      x1={coord.x}
                      y1={earningsChartGeom.height - 40}
                      x2={coord.x}
                      y2={earningsChartGeom.height - 35}
                      stroke="currentColor"
                      strokeOpacity="0.4"
                      className="text-charcoal dark:text-dark-border"
                    />

                    {/* X-Axis Label */}
                    <text
                      x={coord.x}
                      y={earningsChartGeom.height - 20}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight={isHovered ? "bold" : "600"}
                      fill="currentColor"
                      className={`transition-colors font-sans ${
                        isHovered
                          ? "text-olive-800 dark:text-olive-300"
                          : "text-charcoal/60 dark:text-dark-muted"
                      }`}
                    >
                      {coord.label}
                    </text>
                  </g>
                );
              })}

              {/* X-Axis Label End */}
              <text
                x={earningsChartGeom.width - 20}
                y={earningsChartGeom.height - 6}
                textAnchor="end"
                fontSize="10"
                fontWeight="bold"
                fill="currentColor"
                className="text-charcoal/50 dark:text-dark-muted uppercase tracking-wider"
              >
                X: Timeline
              </text>
            </svg>

            {/* Interactive Tooltip Card Overlay */}
            {hoveredGraphPoint && (
              <div className="absolute top-3 right-3 bg-charcoal/95 dark:bg-dark-card text-white rounded-2xl p-3 shadow-xl border border-white/10 text-xs space-y-1 backdrop-blur-md pointer-events-none z-10">
                <div className="flex items-center gap-1 text-olive-300 font-bold uppercase tracking-wider text-[10px]">
                  <Calendar size={11} />
                  <span>{hoveredGraphPoint.label}</span>
                </div>
                <div className="font-display text-base font-bold text-white">
                  ₹{hoveredGraphPoint.amount.toLocaleString("en-IN")}
                </div>
                <div className="text-[11px] text-white/70">
                  {hoveredGraphPoint.jobs} trade jobs · {hoveredGraphPoint.growth} growth
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Graph 2: Payment Channels Breakdown & Settlement Flow */}
        <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-5 sm:p-6 border border-charcoal/10 dark:border-dark-border shadow-xs flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-charcoal/10 dark:border-dark-border">
              <Wallet size={18} className="text-olive-700 dark:text-olive-400" />
              <h3 className="font-display text-lg font-bold text-charcoal dark:text-dark-text">
                Payment Channel Distribution
              </h3>
            </div>

            {/* Visual Channel Stacked Bar */}
            <div className="mt-4 space-y-3">
              <div className="h-4 rounded-full overflow-hidden flex bg-charcoal/10 dark:bg-dark-surface">
                <div style={{ width: "68%" }} className="bg-blue-600 h-full" title="UPI (68%)" />
                <div style={{ width: "22%" }} className="bg-amber-500 h-full" title="Cash (22%)" />
                <div style={{ width: "10%" }} className="bg-emerald-600 h-full" title="Bank (10%)" />
              </div>

              {/* Channels Legend Cards */}
              <div className="space-y-2 pt-1">
                <div className="p-3 rounded-2xl bg-white dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-blue-600 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-charcoal dark:text-dark-text block">
                        UPI Instant Routing (68%)
                      </span>
                      <span className="text-[10px] text-charcoal/50">Direct to SBI Jan Dhan</span>
                    </div>
                  </div>
                  <span className="font-display text-sm font-bold text-charcoal dark:text-dark-text">
                    ₹18,500
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-charcoal dark:text-dark-text block">
                        Doorstep Cash Handover (22%)
                      </span>
                      <span className="text-[10px] text-charcoal/50">Direct from customers</span>
                    </div>
                  </div>
                  <span className="font-display text-sm font-bold text-charcoal dark:text-dark-text">
                    ₹5,600
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-charcoal dark:text-dark-text block">
                        Bank NEFT Transfer (10%)
                      </span>
                      <span className="text-[10px] text-charcoal/50">Panchayat &amp; SHG batches</span>
                    </div>
                  </div>
                  <span className="font-display text-sm font-bold text-charcoal dark:text-dark-text">
                    ₹2,200
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Target Gauge Card */}
          <div className="p-4 rounded-2xl bg-olive-50 dark:bg-olive-950/40 border border-olive-200/80 dark:border-olive-800/80">
            <div className="flex items-center justify-between text-xs font-bold text-olive-900 dark:text-olive-200 mb-1.5">
              <span>Monthly Target Benchmark</span>
              <span>87.6% Achieved</span>
            </div>
            <div className="h-2 rounded-full bg-olive-200/80 dark:bg-olive-900 overflow-hidden mb-2">
              <div className="h-full bg-olive-700 dark:bg-olive-400 rounded-full" style={{ width: "87.6%" }} />
            </div>
            <p className="text-[11px] text-olive-800 dark:text-olive-300">
              ₹26,300 earned of ₹30,000 monthly target · Projected to reach 100% by month end.
            </p>
          </div>
        </div>
      </div>

      {/* FILTER SYSTEM FOR EARNINGS */}
      <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-5 border border-charcoal/10 dark:border-dark-border space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-olive-700 dark:text-olive-400" />
            <h3 className="font-display text-base font-bold text-charcoal dark:text-dark-text">
              Filter Earnings by Mode, Month &amp; Customer
            </h3>
          </div>

          {(searchQuery || statusFilter !== "all" || modeFilter !== "all" || dateFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setModeFilter("all");
                setDateFilter("all");
              }}
              className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={12} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search by Customer Name / Transaction ID */}
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer, ID, service..."
              className="w-full bg-white dark:bg-dark-surface rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-charcoal dark:text-dark-text font-medium outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600"
            />
          </div>

          {/* Payment Mode Filter */}
          <div>
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="w-full bg-white dark:bg-dark-surface rounded-xl px-3.5 py-2.5 text-xs text-charcoal dark:text-dark-text font-semibold outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 cursor-pointer"
            >
              <option value="all">All Payment Methods</option>
              <option value="UPI">UPI Instant Pay</option>
              <option value="Cash">Cash Handover</option>
              <option value="Bank">Direct Bank Transfer</option>
            </select>
          </div>

          {/* Date Range / Month Filter */}
          <div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-white dark:bg-dark-surface rounded-xl px-3.5 py-2.5 text-xs text-charcoal dark:text-dark-text font-semibold outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 cursor-pointer"
            >
              <option value="all">All Months</option>
              <option value="sep26">September 2026 (₹3,100)</option>
              <option value="aug26">August 2026 (₹4,900)</option>
              <option value="jul26">July 2026 (₹1,600)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-white dark:bg-dark-surface rounded-xl px-3.5 py-2.5 text-xs text-charcoal dark:text-dark-text font-semibold outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Completed">Completed &amp; Settled</option>
              <option value="Pending">Pending Clearance</option>
            </select>
          </div>
        </div>

        {/* Quick Pill Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-charcoal/50 dark:text-dark-muted font-bold text-[11px] uppercase">
            Quick Modes:
          </span>
          {[
            { id: "all", label: "All Modes" },
            { id: "UPI", label: "⚡ UPI Direct" },
            { id: "Cash", label: "💵 Cash" },
            { id: "Bank", label: "🏦 Bank NEFT" },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setModeFilter(pill.id)}
              className={`px-3 py-1 rounded-xl font-bold transition-all border cursor-pointer ${
                modeFilter === pill.id
                  ? "bg-olive-700 text-white border-olive-700 shadow-2xs"
                  : "bg-white dark:bg-dark-surface border-charcoal/15 dark:border-dark-border text-charcoal/70 dark:text-dark-muted hover:border-olive-600"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* EARNINGS TRANSACTIONS TABLE */}
      <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-6 border border-charcoal/10 dark:border-dark-border shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base sm:text-lg font-bold text-charcoal dark:text-dark-text">
            Transaction History ({filteredRecords.length})
          </h3>
          <span className="text-xs text-charcoal/50 dark:text-dark-muted font-mono">
            Zero Platform Deductions Applied
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-charcoal/10 dark:border-dark-border text-charcoal/50 dark:text-dark-muted uppercase font-mono text-[10px]">
                <th className="pb-3 font-semibold">Transaction / Booking</th>
                <th className="pb-3 font-semibold">Customer Details</th>
                <th className="pb-3 font-semibold">Service</th>
                <th className="pb-3 font-semibold">Date &amp; Time</th>
                <th className="pb-3 font-semibold">Payment Mode</th>
                <th className="pb-3 font-semibold text-right">Net Payout</th>
                <th className="pb-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5 dark:divide-dark-border">
              {filteredRecords.map((item) => (
                <tr key={item.id} className="hover:bg-white/50 dark:hover:bg-dark-surface/50 transition-colors">
                  <td className="py-3.5 pr-3">
                    <span className="font-mono font-bold text-charcoal dark:text-dark-text block">
                      {item.id}
                    </span>
                    <span className="text-[11px] text-charcoal/40 font-mono">
                      {item.bookingId}
                    </span>
                  </td>

                  <td className="py-3.5 pr-3">
                    <span className="font-bold text-charcoal dark:text-dark-text block">
                      {item.customerName}
                    </span>
                    <a
                      href={`tel:${item.customerPhone}`}
                      className="text-[11px] text-olive-800 dark:text-olive-300 hover:underline font-mono"
                    >
                      {item.customerPhone}
                    </a>
                  </td>

                  <td className="py-3.5 pr-3 font-medium text-charcoal/80 dark:text-dark-muted max-w-[180px] truncate">
                    {item.serviceName}
                  </td>

                  <td className="py-3.5 pr-3 text-charcoal/60 dark:text-dark-muted whitespace-nowrap font-mono text-[11px]">
                    {item.date}, {item.time}
                  </td>

                  <td className="py-3.5 pr-3">
                    <span className="font-semibold text-charcoal dark:text-dark-text block">
                      {item.paymentMode}
                    </span>
                    <span className="text-[10px] text-charcoal/40 font-mono block truncate max-w-[120px]">
                      {item.upiRef}
                    </span>
                  </td>

                  <td className="py-3.5 pr-3 text-right">
                    <span className="font-display font-bold text-sm text-emerald-700 dark:text-emerald-400">
                      +₹{item.netPayout}
                    </span>
                    <span className="text-[10px] text-charcoal/40 block">₹0 Fee</span>
                  </td>

                  <td className="py-3.5 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                      <CheckCircle2 size={10} className="text-emerald-600" />
                      <span>{item.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
