import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Filter, TrendingUp, Calendar, ChevronDown, ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../utils/api";

// Dynamic Filter Datasets for Overview (Today, Yesterday, Last Week, Last 15 Days, Last Month)
const OVERVIEW_FILTER_DATA = {
  today: {
    label: "Today",
    totalRequests: 7,
    totalAccepted: 6,
    totalEarning: 1850,
    rating: "5.0",
    dataPoints: [
      { label: "08 AM", value: 0, jobs: 0 },
      { label: "10 AM", value: 350, jobs: 1 },
      { label: "12 PM", value: 450, jobs: 1 },
      { label: "02 PM", value: 0, jobs: 0 },
      { label: "04 PM", value: 650, jobs: 2 },
      { label: "06 PM", value: 400, jobs: 1 },
      { label: "08 PM", value: 0, jobs: 0 }
    ]
  },
  yesterday: {
    label: "Yesterday",
    totalRequests: 9,
    totalAccepted: 8,
    totalEarning: 2400,
    rating: "4.9",
    dataPoints: [
      { label: "08 AM", value: 200, jobs: 1 },
      { label: "10 AM", value: 450, jobs: 1 },
      { label: "12 PM", value: 300, jobs: 1 },
      { label: "02 PM", value: 850, jobs: 3 },
      { label: "04 PM", value: 400, jobs: 1 },
      { label: "06 PM", value: 200, jobs: 1 },
      { label: "08 PM", value: 0, jobs: 0 }
    ]
  },
  lastWeek: {
    label: "Last Week",
    totalRequests: 34,
    totalAccepted: 31,
    totalEarning: 9650,
    rating: "4.9",
    dataPoints: [
      { label: "Mon", value: 1200, jobs: 4 },
      { label: "Tue", value: 950, jobs: 3 },
      { label: "Wed", value: 1450, jobs: 5 },
      { label: "Thu", value: 1100, jobs: 3 },
      { label: "Fri", value: 1750, jobs: 6 },
      { label: "Sat", value: 2100, jobs: 7 },
      { label: "Sun", value: 1100, jobs: 3 }
    ]
  },
  last15Days: {
    label: "Last 15 Days",
    totalRequests: 62,
    totalAccepted: 57,
    totalEarning: 17800,
    rating: "4.9",
    dataPoints: [
      { label: "Day 1-2", value: 1800, jobs: 6 },
      { label: "Day 3-4", value: 2100, jobs: 7 },
      { label: "Day 5-6", value: 1650, jobs: 5 },
      { label: "Day 7-8", value: 2450, jobs: 8 },
      { label: "Day 9-10", value: 1950, jobs: 6 },
      { label: "Day 11-12", value: 2800, jobs: 9 },
      { label: "Day 13-14", value: 3100, jobs: 10 },
      { label: "Day 15", value: 1950, jobs: 6 }
    ]
  },
  lastMonth: {
    label: "Last Month",
    totalRequests: 118,
    totalAccepted: 108,
    totalEarning: 32450,
    rating: "4.9",
    dataPoints: [
      { label: "Week 1", value: 7200, jobs: 24 },
      { label: "Week 2", value: 8100, jobs: 27 },
      { label: "Week 3", value: 9200, jobs: 31 },
      { label: "Week 4", value: 7950, jobs: 26 }
    ]
  }
};

const FILTER_KEYS = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "lastWeek", label: "Last Week" },
  { key: "last15Days", label: "Last 15 Days" },
  { key: "lastMonth", label: "Last Month" }
];

export default function WorkerDashboard() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const [bookings, setBookings] = useState([]);

  const fetchBookings = useCallback(async () => {
    try {
      const response = await api.get("/bookings/worker");
      if (response.data?.bookings) {
        setBookings(response.data.bookings);
      }
    } catch (err) {
      console.error("Failed to fetch worker bookings:", err);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Active period dataset
  const activeData = useMemo(() => {
    const now = new Date();
    let filteredBookings = bookings;
    
    if (selectedPeriod === "today") {
      filteredBookings = bookings.filter(b => new Date(b.createdAt).toDateString() === now.toDateString());
    } else if (selectedPeriod === "yesterday") {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      filteredBookings = bookings.filter(b => new Date(b.createdAt).toDateString() === yesterday.toDateString());
    } else if (selectedPeriod === "lastWeek") {
      const lastWeek = new Date(now);
      lastWeek.setDate(lastWeek.getDate() - 7);
      filteredBookings = bookings.filter(b => new Date(b.createdAt) >= lastWeek);
    } else if (selectedPeriod === "last15Days") {
      const last15 = new Date(now);
      last15.setDate(last15.getDate() - 15);
      filteredBookings = bookings.filter(b => new Date(b.createdAt) >= last15);
    } else if (selectedPeriod === "lastMonth") {
      const lastMonth = new Date(now);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      filteredBookings = bookings.filter(b => new Date(b.createdAt) >= lastMonth);
    }

    const totalRequests = filteredBookings.length;
    const totalAccepted = filteredBookings.filter(b => ["accepted", "in_progress", "completed"].includes(b.status)).length;
    const completedBookings = filteredBookings.filter(b => b.status === "completed");
    const totalEarning = completedBookings.reduce((sum, b) => sum + (b.price || 0), 0);
    
    // Fallback to static trend shape for now
    const dataPoints = OVERVIEW_FILTER_DATA[selectedPeriod]?.dataPoints || [
      { label: "Start", value: 0, jobs: 0 },
      { label: "End", value: totalEarning, jobs: completedBookings.length }
    ];

    return {
      label: selectedPeriod,
      totalRequests,
      totalAccepted,
      totalEarning,
      rating: "5.0",
      dataPoints
    };
  }, [selectedPeriod, bookings]);

  // SVG Chart Geometry Calculations
  const chartGeometry = useMemo(() => {
    const points = activeData.dataPoints;
    const width = 740;
    const height = 240;
    const paddingLeft = 70;
    const paddingRight = 30;
    const paddingTop = 30;
    const paddingBottom = 45;

    const plotWidth = width - paddingLeft - paddingRight;
    const plotHeight = height - paddingTop - paddingBottom;

    const values = points.map((p) => p.amount ?? p.value);
    const rawMax = Math.max(...values, 100);
    const maxVal = Math.ceil(rawMax * 1.15);

    const stepX = points.length > 1 ? plotWidth / (points.length - 1) : plotWidth;

    const coords = points.map((p, index) => {
      const val = p.amount ?? p.value;
      const x = paddingLeft + index * stepX;
      const y = paddingTop + plotHeight - (val / maxVal) * plotHeight;
      return { ...p, value: val, x, y, index };
    });

    // Build SVG Path with smooth cubic bezier curve
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

    // Build Area Path for smooth gradient fill
    const areaPath = coords.length > 0
      ? `${linePath} L ${coords[coords.length - 1].x} ${paddingTop + plotHeight} L ${coords[0].x} ${paddingTop + plotHeight} Z`
      : "";

    // Grid tick lines (4 ticks: 0%, 33%, 66%, 100%)
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
      ticks
    };
  }, [activeData]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      {/* 1. Header with Live Availability Switch */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl text-charcoal dark:text-dark-text font-bold">
              Worker Operations Desk
            </h1>
            <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              <ShieldCheck size={12} /> Aadhaar Verified
            </span>
          </div>
          <p className="text-charcoal/60 dark:text-dark-muted text-xs sm:text-sm mt-1">
            Real-time operations summary, performance indicators, and earnings trend.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => {
                setSelectedPeriod(e.target.value);
                setHoveredPoint(null);
              }}
              className="appearance-none bg-white dark:bg-dark-surface text-charcoal dark:text-dark-text border border-charcoal/15 dark:border-dark-border rounded-full pl-3.5 pr-8 py-2 text-xs font-bold shadow-2xs outline-none focus:border-olive-600 cursor-pointer transition-colors"
            >
              {FILTER_KEYS.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal/50 dark:text-dark-muted pointer-events-none"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsAvailable((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
              isAvailable
                ? "bg-emerald-600 text-white shadow-emerald-500/20"
                : "bg-charcoal/10 dark:bg-dark-surface text-charcoal/60 dark:text-dark-muted"
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${isAvailable ? "bg-white animate-pulse" : "bg-charcoal/40"}`} />
            {isAvailable ? "On-Duty" : "Off-Duty"}
          </button>
        </div>
      </div>

      {/* 2. THE 4 CORE METRIC CARDS (Small Card with Tag and Value Only, No Subtext, No Img) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Requests */}
        <motion.div
          key={`req-${selectedPeriod}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-cream-card dark:bg-dark-card rounded-2xl p-4 sm:p-5 border border-charcoal/10 dark:border-dark-border shadow-xs flex flex-col justify-center"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal/55 dark:text-dark-muted block">
            Total Requests
          </span>
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-charcoal dark:text-dark-text mt-1">
            {activeData.totalRequests}
          </div>
        </motion.div>

        {/* Card 2: Total Accepted */}
        <motion.div
          key={`acc-${selectedPeriod}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.03 }}
          className="bg-cream-card dark:bg-dark-card rounded-2xl p-4 sm:p-5 border border-charcoal/10 dark:border-dark-border shadow-xs flex flex-col justify-center"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal/55 dark:text-dark-muted block">
            Total Accepted
          </span>
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-charcoal dark:text-dark-text mt-1">
            {activeData.totalAccepted}
          </div>
        </motion.div>

        {/* Card 3: Total Earning */}
        <motion.div
          key={`earn-${selectedPeriod}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.06 }}
          className="bg-cream-card dark:bg-dark-card rounded-2xl p-4 sm:p-5 border border-charcoal/10 dark:border-dark-border shadow-xs flex flex-col justify-center"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal/55 dark:text-dark-muted block">
            Total Earning
          </span>
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-charcoal dark:text-dark-text mt-1">
            ₹{activeData.totalEarning.toLocaleString("en-IN")}
          </div>
        </motion.div>

        {/* Card 4: My Rating */}
        <motion.div
          key={`rate-${selectedPeriod}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.09 }}
          className="bg-cream-card dark:bg-dark-card rounded-2xl p-4 sm:p-5 border border-charcoal/10 dark:border-dark-border shadow-xs flex flex-col justify-center"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal/55 dark:text-dark-muted block">
            My Rating
          </span>
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-charcoal dark:text-dark-text mt-1">
            {activeData.rating}
          </div>
        </motion.div>
      </div>

      {/* 4. THEN BELOW: FULL INTERACTIVE TREND GRAPH */}
      <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-5 sm:p-7 border border-charcoal/10 dark:border-dark-border shadow-xs space-y-4">
        {/* Earning Trend Header */}
        <div className="flex items-center justify-between pb-3 border-b border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-olive-700 dark:text-olive-400" />
            <h2 className="font-display text-xl sm:text-2xl font-bold text-charcoal dark:text-dark-text">
              Earning Trend
            </h2>
          </div>

          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => {
                setSelectedPeriod(e.target.value);
                setHoveredPoint(null);
              }}
              className="appearance-none bg-white dark:bg-dark-surface text-charcoal dark:text-dark-text border border-charcoal/15 dark:border-dark-border rounded-xl pl-3.5 pr-8 py-1.5 text-xs font-bold shadow-2xs outline-none focus:border-olive-600 cursor-pointer transition-colors"
            >
              {FILTER_KEYS.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal/50 dark:text-dark-muted pointer-events-none"
            />
          </div>
        </div>

        {/* The SVG Earning Trend Graph */}
        <div className="relative w-full overflow-hidden bg-white/70 dark:bg-dark-surface/60 rounded-2xl p-2 sm:p-4 border border-charcoal/5 dark:border-dark-border">
          <svg
            viewBox={`0 0 ${chartGeometry.width} ${chartGeometry.height}`}
            className="w-full h-auto max-h-[320px] select-none"
          >
            <defs>
              <linearGradient id="workerEarningGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#556B2F" stopOpacity="0.4" />
                <stop offset="60%" stopColor="#556B2F" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#556B2F" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines and Y-Axis Ticks */}
            {chartGeometry.ticks.map((tick, idx) => (
              <g key={idx}>
                <line
                  x1={chartGeometry.paddingLeft}
                  y1={tick.y}
                  x2={chartGeometry.width - 25}
                  y2={tick.y}
                  stroke="currentColor"
                  strokeOpacity={idx === 0 ? "0.2" : "0.08"}
                  strokeDasharray={idx === 0 ? "" : "4 4"}
                  className="text-charcoal dark:text-dark-border"
                />
                <text
                  x={chartGeometry.paddingLeft - 10}
                  y={tick.y + 4}
                  textAnchor="end"
                  fontSize="11"
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
              x1={chartGeometry.paddingLeft}
              y1={chartGeometry.paddingTop - 10}
              x2={chartGeometry.paddingLeft}
              y2={chartGeometry.height - 45}
              stroke="currentColor"
              strokeOpacity="0.25"
              strokeWidth="1.5"
              className="text-charcoal dark:text-dark-border"
            />

            {/* X-Axis Base Line */}
            <line
              x1={chartGeometry.paddingLeft}
              y1={chartGeometry.height - 45}
              x2={chartGeometry.width - 25}
              y2={chartGeometry.height - 45}
              stroke="currentColor"
              strokeOpacity="0.25"
              strokeWidth="1.5"
              className="text-charcoal dark:text-dark-border"
            />

            {/* Area Fill */}
            {chartGeometry.areaPath && (
              <path
                d={chartGeometry.areaPath}
                fill="url(#workerEarningGrad)"
                className="transition-all duration-300"
              />
            )}

            {/* Main Trend Bezier Curve */}
            {chartGeometry.linePath && (
              <path
                d={chartGeometry.linePath}
                fill="none"
                stroke="#556B2F"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300"
              />
            )}

            {/* Interactive Coordinate Points & X-Axis Labels */}
            {chartGeometry.coords.map((coord, idx) => {
              const isHovered = hoveredPoint?.index === idx;
              return (
                <g key={idx}>
                  {/* Vertical Guide on hover */}
                  {isHovered && (
                    <line
                      x1={coord.x}
                      y1={chartGeometry.paddingTop}
                      x2={coord.x}
                      y2={chartGeometry.height - 45}
                      stroke="#556B2F"
                      strokeDasharray="3 3"
                      strokeWidth="1.5"
                      strokeOpacity="0.6"
                    />
                  )}

                  {/* Outer Pulsing Ring when hovered */}
                  {isHovered && (
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r="11"
                      fill="#556B2F"
                      fillOpacity="0.2"
                      className="animate-pulse"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r={isHovered ? "6" : "4.5"}
                    fill="#FFFFFF"
                    stroke="#556B2F"
                    strokeWidth="2.5"
                    className="cursor-pointer transition-all duration-150 shadow-sm"
                    onMouseEnter={() => setHoveredPoint(coord)}
                    onClick={() => setHoveredPoint(coord)}
                  />

                  {/* X-Axis Tick Mark */}
                  <line
                    x1={coord.x}
                    y1={chartGeometry.height - 45}
                    x2={coord.x}
                    y2={chartGeometry.height - 40}
                    stroke="currentColor"
                    strokeOpacity="0.4"
                    className="text-charcoal dark:text-dark-border"
                  />

                  {/* X-Axis Label */}
                  <text
                    x={coord.x}
                    y={chartGeometry.height - 24}
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
          </svg>

          {/* Interactive Tooltip Card Overlay */}
          <AnimatePresence>
            {hoveredPoint && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute top-4 right-4 bg-charcoal/95 dark:bg-dark-card text-white rounded-2xl p-3 sm:p-3.5 shadow-xl border border-white/10 text-xs space-y-1 backdrop-blur-md pointer-events-none z-10"
              >
                <div className="flex items-center gap-1.5 text-olive-300 font-bold uppercase tracking-wider text-[10px]">
                  <Calendar size={12} />
                  <span>{hoveredPoint.label}</span>
                </div>
                <div className="font-display text-lg font-bold text-white">
                  ₹{hoveredPoint.value.toLocaleString("en-IN")}
                </div>
                <div className="text-[11px] text-white/70">
                  {hoveredPoint.jobs} order(s) fulfilled on this date
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
