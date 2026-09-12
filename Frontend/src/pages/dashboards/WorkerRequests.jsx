import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Inbox, Phone, MapPin, CheckCircle2, Clock, AlertCircle,
  XCircle, IndianRupee, Navigation, Search, Filter, Check,
  X, Sparkles, ChevronRight, ShieldCheck, Calendar, User,
  RefreshCw, Volume2, ArrowRight, HelpCircle, Briefcase,
  Copy, ExternalLink, MessageCircle, Star, FileText, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/useToast";
import api from "../../utils/api";

const STORAGE_KEY = "karya_worker_requests_v1";

const INITIAL_REQUESTS = [];

// Map backend booking status to the UI status used by the cards
const mapBackendStatus = (status) => {
  switch (status) {
    case "pending": return "pending";
    case "accepted":
    case "in_progress": return "active";
    case "completed": return "completed";
    case "rejected":
    case "cancelled": return "declined";
    default: return "pending";
  }
};

// Map a backend booking object to the UI card shape
const mapBookingToRequest = (b) => {
  const scheduledDate = b.scheduledDate ? new Date(b.scheduledDate) : null;
  let timing = "Scheduled";
  if (scheduledDate) {
    const now = new Date();
    const diffMs = scheduledDate - now;
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) timing = `Today, ${scheduledDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
    else if (diffDays === 1) timing = `Tomorrow, ${scheduledDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
    else if (diffDays === -1) timing = "Yesterday";
    else if (diffDays < -1) timing = `${Math.abs(diffDays)} days ago`;
    else timing = scheduledDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  return {
    id: b._id,
    rawStatus: b.status,
    jobTitle: `${b.service?.name || "Service"} Request`,
    jobTitleHi: "",
    category: b.service?.category || "Service",
    categoryHi: "",
    customerName: b.customer?.name || "Customer",
    customerPhone: b.customer?.phone ? `+91 ${b.customer.phone}` : "",
    villageName: b.address || "Local Area",
    villageNameHi: "",
    distance: "Nearby",
    timing,
    timingHi: "",
    amount: b.price || 0,
    paymentMode: "Cash or UPI on Completion",
    paymentModeHi: "काम पूरा होने पर नकद या UPI",
    status: mapBackendStatus(b.status),
    isUrgent: false,
    description: b.notes || `${b.service?.name || "Service"} booking - Duration: ${b.duration || 60} minutes`,
    descriptionHi: "",
    acceptedAt: b.status === "accepted" || b.status === "in_progress" ? new Date(b.updatedAt).toLocaleString("en-IN") : null,
    completedAt: b.status === "completed" ? new Date(b.updatedAt).toLocaleString("en-IN") : null,
    rating: null,
    reviewText: null,
  };
};

export default function WorkerRequests() {
  const toast = useToast();
  const [requests, setRequests] = useState([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  // Fetch real bookings from backend
  const fetchBookings = useCallback(async () => {
    setApiLoading(true);
    setApiError("");
    try {
      const response = await api.get("/bookings/worker");
      if (response.data?.bookings?.length > 0) {
        setRequests(response.data.bookings.map(mapBookingToRequest));
      } else {
        // No bookings from backend, show empty state (NOT dummy data)
        setRequests([]);
      }
    } catch (err) {
      console.error("Failed to fetch worker bookings:", err);
      // Fallback to INITIAL_REQUESTS only if API is unreachable
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setRequests(JSON.parse(saved));
        } else {
          setRequests([]);
        }
      } catch {
        setRequests([]);
      }
      setApiError("Could not reach backend. Showing cached data.");
    } finally {
      setApiLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Save to localStorage as cache
  useEffect(() => {
    if (requests.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
      } catch {
        // ignore
      }
    }
  }, [requests]);

  // View settings
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "pending" | "active" | "completed"
  const [searchQuery, setSearchQuery] = useState("");
  const [showHindi, setShowHindi] = useState(true); // Default true for Tier 3 & Villagers

  // Modals state
  const [activeCallModal, setActiveCallModal] = useState(null);
  const [activeDetailModal, setActiveDetailModal] = useState(null);
  const [confirmCompleteModal, setConfirmCompleteModal] = useState(null);

  // Summary counts
  const counts = useMemo(() => {
    const pending = requests.filter((r) => r.status === "pending").length;
    const active = requests.filter((r) => r.status === "active").length;
    const completed = requests.filter((r) => r.status === "completed").length;
    const totalEarned = requests
      .filter((r) => r.status === "completed")
      .reduce((sum, r) => sum + r.amount, 0);

    return { pending, active, completed, totalEarned };
  }, [requests]);

  // Filtered list
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Status filter
      if (activeFilter !== "all" && req.status !== activeFilter) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = req.customerName.toLowerCase().includes(q);
        const matchesJob = req.jobTitle.toLowerCase().includes(q) || (req.jobTitleHi && req.jobTitleHi.includes(q));
        const matchesVillage = req.villageName.toLowerCase().includes(q) || (req.villageNameHi && req.villageNameHi.includes(q));
        return matchesName || matchesJob || matchesVillage;
      }
      return true;
    });
  }, [requests, activeFilter, searchQuery]);

  // Action: Accept Request — calls backend API
  const handleAccept = async (id) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status: "accepted" });
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id
            ? { ...req, status: "active", rawStatus: "accepted", acceptedAt: "Just now (अभी)" }
            : req
        )
      );
      toast.success("काम स्वीकार कर लिया गया! (Job Accepted!) Customer notified.");
    } catch (err) {
      console.error("Accept error:", err);
      toast.error(err.response?.data?.message || "Failed to accept. Please try again.");
    }
  };

  // Action: Decline Request — calls backend API
  const handleDecline = async (id) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status: "rejected" });
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id
            ? { ...req, status: "declined", rawStatus: "rejected" }
            : req
        )
      );
      toast.info("अनुरोध अस्वीकार कर दिया गया (Request Declined).");
    } catch (err) {
      console.error("Decline error:", err);
      toast.error(err.response?.data?.message || "Failed to decline. Please try again.");
    }
  };

  // Action: Mark as Completed — calls backend API
  const handleComplete = async (id) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status: "completed" });
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id
            ? {
                ...req,
                status: "completed",
                rawStatus: "completed",
                completedAt: "Just now (अभी)",
              }
            : req
        )
      );
      setConfirmCompleteModal(null);
      toast.success("बधाई! काम पूरा हुआ (Work Marked Done!)");
    } catch (err) {
      console.error("Complete error:", err);
      toast.error(err.response?.data?.message || "Failed to complete. Please try again.");
    }
  };

  // Copy phone number to clipboard
  const copyPhoneNumber = (phone) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(phone);
      toast.success(`नंबर कॉपी हो गया: ${phone}`);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-16">
      {/* 1. Header with Language Toggle & Refresh */}
      <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-5 sm:p-6 border border-charcoal/10 dark:border-dark-border shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="w-9 h-9 rounded-2xl bg-olive-700 text-white flex items-center justify-center shadow-xs">
                <Inbox size={20} />
              </span>
              <h1 className="font-display text-2xl sm:text-3xl text-charcoal dark:text-dark-text font-bold">
                Customer Work Requests
              </h1>
              <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-300/40 dark:border-emerald-700/50">
                गांव में 10 किमी दायरा (10km Radius)
              </span>
            </div>
            <p className="text-charcoal/70 dark:text-dark-muted text-xs sm:text-sm mt-1.5 leading-relaxed max-w-2xl">
              Nearby villagers & families seeking your services. Direct contact, 1-click accept, and 100% direct village payment (Zero commission).
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap self-start lg:self-auto">
            {/* Bilingual Easy Toggle for Tier 3 & Villagers */}
            <button
              type="button"
              onClick={() => setShowHindi((v) => !v)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                showHindi
                  ? "bg-olive-800 text-white border-olive-900 shadow-xs"
                  : "bg-white dark:bg-dark-surface text-charcoal/70 dark:text-dark-text border-charcoal/15 dark:border-dark-border"
              }`}
            >
              <Volume2 size={15} />
              <span>{showHindi ? "हिंदी + English (चालू है)" : "Show Hindi Labels"}</span>
            </button>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={() => {
                fetchBookings();
                toast.success("नए अनुरोध ताज़ा किए गए (Radius Refreshed!)");
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-dark-surface text-charcoal dark:text-dark-text border border-charcoal/15 dark:border-dark-border hover:bg-charcoal/5 dark:hover:bg-dark-card transition-colors cursor-pointer"
            >
              <RefreshCw size={14} className="text-olive-700 dark:text-olive-400" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Tier-3 Friendly Stat Cards (Simple Tag + Value) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: New Requests */}
        <div
          onClick={() => setActiveFilter("pending")}
          className={`bg-cream-card dark:bg-dark-card rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer ${
            activeFilter === "pending"
              ? "border-amber-500 ring-2 ring-amber-400/30 shadow-sm"
              : "border-charcoal/10 dark:border-dark-border hover:border-amber-400/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
              New Requests {showHindi && <span className="font-normal">(नए काम)</span>}
            </span>
            {counts.pending > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            )}
          </div>
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-charcoal dark:text-dark-text mt-1">
            {counts.pending}
          </div>
          <span className="text-[11px] text-charcoal/55 dark:text-dark-muted font-medium mt-0.5 block">
            Needs your response
          </span>
        </div>

        {/* Card 2: Ongoing Jobs */}
        <div
          onClick={() => setActiveFilter("active")}
          className={`bg-cream-card dark:bg-dark-card rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer ${
            activeFilter === "active"
              ? "border-blue-500 ring-2 ring-blue-400/30 shadow-sm"
              : "border-charcoal/10 dark:border-dark-border hover:border-blue-400/50"
          }`}
        >
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-400 block">
            Ongoing {showHindi && <span className="font-normal">(चालू काम)</span>}
          </span>
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-charcoal dark:text-dark-text mt-1">
            {counts.active}
          </div>
          <span className="text-[11px] text-charcoal/55 dark:text-dark-muted font-medium mt-0.5 block">
            Work in progress
          </span>
        </div>

        {/* Card 3: Completed */}
        <div
          onClick={() => setActiveFilter("completed")}
          className={`bg-cream-card dark:bg-dark-card rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer ${
            activeFilter === "completed"
              ? "border-emerald-500 ring-2 ring-emerald-400/30 shadow-sm"
              : "border-charcoal/10 dark:border-dark-border hover:border-emerald-400/50"
          }`}
        >
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block">
            Completed {showHindi && <span className="font-normal">(पूरे हुए)</span>}
          </span>
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-charcoal dark:text-dark-text mt-1">
            {counts.completed}
          </div>
          <span className="text-[11px] text-charcoal/55 dark:text-dark-muted font-medium mt-0.5 block">
            Delivered & satisfied
          </span>
        </div>

        {/* Card 4: Total Earned */}
        <div className="bg-cream-card dark:bg-dark-card rounded-2xl p-4 sm:p-5 border border-charcoal/10 dark:border-dark-border shadow-xs">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-olive-800 dark:text-olive-400 block">
            Earned from Jobs {showHindi && <span className="font-normal">(कुल कमाई)</span>}
          </span>
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-charcoal dark:text-dark-text mt-1 text-olive-900 dark:text-olive-300">
            ₹{counts.totalEarned.toLocaleString("en-IN")}
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mt-0.5 block">
            0% Fee · 100% Direct Payout
          </span>
        </div>
      </div>

      {/* 3. Simple Search & Filter Bar */}
      <div className="bg-cream-card dark:bg-dark-card rounded-2xl p-3 sm:p-4 border border-charcoal/10 dark:border-dark-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search input with villager-friendly placeholder */}
        <div className="relative w-full sm:max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/50 dark:text-dark-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              showHindi
                ? "ग्राहक, गांव या काम का नाम खोजें..."
                : "Search by customer, village, or job..."
            }
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-surface text-charcoal dark:text-dark-text border border-charcoal/15 dark:border-dark-border rounded-xl text-xs sm:text-sm font-medium outline-none focus:border-olive-600 transition-colors shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status Filter Buttons with Count Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { key: "all", label: "All Jobs", labelHi: "सभी काम", count: requests.length },
            { key: "pending", label: "New", labelHi: "नए", count: counts.pending, highlight: true },
            { key: "active", label: "Ongoing", labelHi: "चालू", count: counts.active },
            { key: "completed", label: "Done", labelHi: "पूरा हुआ", count: counts.completed }
          ].map((tab) => {
            const isSelected = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveFilter(tab.key)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? "bg-olive-800 text-white shadow-xs"
                    : "bg-white dark:bg-dark-surface text-charcoal/70 dark:text-dark-text border border-charcoal/15 dark:border-dark-border hover:bg-charcoal/5"
                }`}
              >
                <span>{showHindi ? tab.labelHi : tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : tab.highlight && tab.count > 0
                      ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                      : "bg-charcoal/10 dark:bg-dark-card text-charcoal/60 dark:text-dark-muted"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. The Clean, Simple Work Request Cards List */}
      <div className="space-y-3.5">
        {filteredRequests.length === 0 ? (
          <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-8 sm:p-12 text-center border border-charcoal/10 dark:border-dark-border">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-charcoal/5 dark:bg-dark-surface flex items-center justify-center text-charcoal/40 dark:text-dark-muted mb-3">
              <Inbox size={26} />
            </div>
            <h3 className="font-display text-lg font-bold text-charcoal dark:text-dark-text">
              {showHindi ? "कोई अनुरोध नहीं मिला" : "No requests found"}
            </h3>
            <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-1 max-w-sm mx-auto">
              {showHindi
                ? "इस फिल्टर में कोई काम नहीं है। 'सभी काम' पर क्लिक करें या नया काम देखने के लिए रिफ्रेश करें।"
                : "No job matches the selected filter. Try switching filters or check back soon."}
            </p>
            <button
              onClick={() => {
                setActiveFilter("all");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-2 bg-olive-800 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-olive-900 transition-colors"
            >
              {showHindi ? "सभी काम देखें (View All)" : "View All Requests"}
            </button>
          </div>
        ) : (
          filteredRequests.map((req) => {
            const isPending = req.status === "pending";
            const isActive = req.status === "active";
            const isCompleted = req.status === "completed";
            const isDeclined = req.status === "declined";
            const isAccepted = req.rawStatus === "accepted";
            const isInProgress = req.rawStatus === "in_progress";

            return (
              <motion.div
                key={req.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`bg-cream-card dark:bg-dark-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 border transition-all ${
                  req.isUrgent && isPending
                    ? "border-rose-400 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/10 shadow-xs"
                    : isPending
                    ? "border-amber-300 dark:border-amber-800/60 shadow-xs"
                    : "border-charcoal/10 dark:border-dark-border shadow-xs"
                }`}
              >
                {/* Header Row: Category Badge + Status Badge + Big Price */}
                <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-charcoal/10 dark:border-dark-border">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Category */}
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-charcoal/5 dark:bg-dark-surface text-charcoal/75 dark:text-dark-muted border border-charcoal/10 dark:border-dark-border">
                      {showHindi ? req.categoryHi : req.category}
                    </span>

                    {/* Urgent Tag if applicable */}
                    {req.isUrgent && (
                      <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 animate-pulse border border-rose-300/60">
                        ⚡ {showHindi ? "तत्काल काम (SOS Urgent)" : "SOS Urgent"}
                      </span>
                    )}

                    {/* Status Pill */}
                    {isPending && (
                      <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/60">
                        <Clock size={12} />
                        <span>{showHindi ? "नया अनुरोध (Awaiting Decision)" : "New Request"}</span>
                      </span>
                    )}
                    {isActive && (
                      <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300/60">
                        <Clock size={12} />
                        <span>{showHindi ? "चालू काम (In Progress)" : "In Progress"}</span>
                      </span>
                    )}
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60">
                        <CheckCircle2 size={12} />
                        <span>{showHindi ? "पूरा हुआ व भुगतान मिला (Paid)" : "Completed & Paid"}</span>
                      </span>
                    )}
                    {isDeclined && (
                      <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-charcoal/10 dark:bg-dark-surface text-charcoal/50 dark:text-dark-muted">
                        <XCircle size={12} />
                        <span>{showHindi ? "अस्वीकृत (Declined)" : "Declined"}</span>
                      </span>
                    )}
                  </div>

                  {/* Big Price Tag */}
                  <div className="text-right ml-auto">
                    <div className="font-display text-2xl sm:text-3xl font-extrabold text-olive-900 dark:text-olive-300 leading-none">
                      ₹{req.amount}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block mt-0.5">
                      {showHindi ? "100% आपका पैसा (0% शुल्क)" : "100% Direct Payout"}
                    </span>
                  </div>
                </div>

                {/* Main Job Title & Description */}
                <div className="pt-3 pb-2">
                  <h2 className="font-display text-lg sm:text-xl font-bold text-charcoal dark:text-dark-text">
                    {req.jobTitle}
                  </h2>
                  {showHindi && req.jobTitleHi && (
                    <p className="text-xs sm:text-sm font-semibold text-olive-800 dark:text-olive-300 mt-0.5">
                      {req.jobTitleHi}
                    </p>
                  )}
                  <p className="text-xs sm:text-sm text-charcoal/70 dark:text-dark-muted mt-1.5 line-clamp-2">
                    {showHindi && req.descriptionHi ? req.descriptionHi : req.description}
                  </p>
                </div>

                {/* Key Customer & Location Details Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 py-3 my-2 bg-white/70 dark:bg-dark-surface/60 rounded-xl px-3 sm:px-4 border border-charcoal/5 dark:border-dark-border text-xs">
                  {/* Customer */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-olive-100 dark:bg-olive-950/60 text-olive-800 dark:text-olive-300 flex items-center justify-center shrink-0">
                      <User size={14} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted block">
                        {showHindi ? "ग्राहक (Customer)" : "Customer"}
                      </span>
                      <span className="font-bold text-charcoal dark:text-dark-text truncate block">
                        {req.customerName}
                      </span>
                    </div>
                  </div>

                  {/* Village / Location */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
                      <MapPin size={14} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted block">
                        {showHindi ? "गांव का पता (Village)" : "Location"} ({req.distance})
                      </span>
                      <span className="font-bold text-charcoal dark:text-dark-text truncate block">
                        {showHindi && req.villageNameHi ? req.villageNameHi : req.villageName}
                      </span>
                    </div>
                  </div>

                  {/* Timing */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
                      <Calendar size={14} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted block">
                        {showHindi ? "समय (Time)" : "Timing"}
                      </span>
                      <span className="font-bold text-charcoal dark:text-dark-text truncate block">
                        {showHindi && req.timingHi ? req.timingHi : req.timing}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rating / Review if Completed */}
                {isCompleted && req.rating && (
                  <div className="mb-3 px-3.5 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-amber-500 font-bold">
                        <Star size={14} className="fill-amber-400" />
                        <span className="ml-1 text-charcoal dark:text-dark-text">{req.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-charcoal/70 dark:text-dark-muted italic">
                        "{req.reviewText}"
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 whitespace-nowrap">
                      ✓ Cash/UPI Settled
                    </span>
                  </div>
                )}

                {/* Bottom Action Buttons (Tier-3 Friendly: Big, Clear, High-Contrast) */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2">
                  {/* Left Action: Quick Call Customer */}
                  <button
                    type="button"
                    onClick={() => setActiveCallModal(req)}
                    className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-dark-surface text-charcoal dark:text-dark-text border border-charcoal/20 dark:border-dark-border hover:border-olive-600 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Phone size={14} className="text-emerald-600 dark:text-emerald-400" />
                    <span>
                      {showHindi ? `ग्राहक को फोन करें (${req.customerPhone})` : `Call Customer (${req.customerPhone})`}
                    </span>
                  </button>

                  {/* Right Actions depending on Status */}
                  <div className="flex items-center gap-2 ml-auto flex-wrap">
                    {/* If PENDING: Accept or Decline */}
                    {isPending && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleDecline(req.id)}
                          className="px-3 py-2 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                        >
                          {showHindi ? "मना करें (Decline)" : "Decline"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAccept(req.id)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition-all shadow-xs cursor-pointer"
                        >
                          <Check size={16} />
                          <span>{showHindi ? "काम स्वीकार करें (Accept Job)" : "Accept Job"}</span>
                        </button>
                      </>
                    )}

                    {/* If ACTIVE: Mark Complete or Navigate */}
                    {isActive && (
                      <>
                        <button
                          type="button"
                          onClick={() => setActiveDetailModal(req)}
                          className="px-3 py-2 rounded-xl text-xs font-bold text-charcoal/70 dark:text-dark-muted hover:bg-charcoal/5 dark:hover:bg-dark-surface cursor-pointer"
                        >
                          {showHindi ? "विवरण देखें (Details)" : "View Details"}
                        </button>

                        {isAccepted ? (
                          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] sm:text-xs font-bold bg-charcoal/5 dark:bg-dark-surface text-charcoal/70 dark:text-dark-muted border border-charcoal/10 dark:border-dark-border cursor-not-allowed">
                            <Clock size={16} className="text-amber-500" />
                            <span>{showHindi ? "भुगतान की प्रतीक्षा (Waiting for Payment)" : "Waiting for Customer Payment"}</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmCompleteModal(req)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition-all shadow-xs cursor-pointer"
                          >
                            <CheckCircle2 size={16} />
                            <span>
                              {showHindi ? `काम पूरा हुआ - ₹${req.amount} प्राप्त (Mark Done)` : `Mark Done & Paid (₹${req.amount})`}
                            </span>
                          </button>
                        )}
                      </>
                    )}

                    {/* If COMPLETED: View Receipt / Done badge */}
                    {isCompleted && (
                      <button
                        type="button"
                        onClick={() => setActiveDetailModal(req)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-dark-surface text-charcoal/80 dark:text-dark-text border border-charcoal/15 dark:border-dark-border hover:bg-charcoal/5 cursor-pointer"
                      >
                        <FileText size={13} className="text-olive-700 dark:text-olive-400" />
                        <span>{showHindi ? "रसीद व विवरण देखें (Receipt)" : "View Receipt & Log"}</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* 5. Village Assistance & Help Desk Banner */}
      <div className="bg-olive-900 text-white rounded-3xl p-5 sm:p-6 border border-olive-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Phone size={22} className="text-olive-300" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold">
                {showHindi
                  ? "काम समझने में कोई परेशानी है? (Karya Gram Help)"
                  : "Need help with any customer request?"}
              </h3>
              <p className="text-xs text-white/80 mt-0.5">
                {showHindi
                  ? "हमारे टोल-फ्री नंबर 1800-KARYA-HELP (1800-52792-4357) पर कभी भी कॉल करें।"
                  : "Call 24x7 toll-free worker support desk or contact your local Panchayat Mitra."}
              </p>
            </div>
          </div>

          <a
            href="tel:1800527924357"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-olive-900 rounded-xl text-xs font-bold hover:bg-olive-50 transition-colors shadow-xs shrink-0 self-start sm:self-auto"
          >
            <Phone size={14} />
            <span>1800-KARYA-HELP</span>
          </a>
        </div>
      </div>

      {/* MODAL 1: Quick Call Customer Modal */}
      <AnimatePresence>
        {activeCallModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-dark-card rounded-3xl p-6 max-w-md w-full border border-charcoal/10 dark:border-dark-border shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-charcoal/10 dark:border-dark-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Phone size={16} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-charcoal dark:text-dark-text">
                    {showHindi ? "ग्राहक को फोन करें" : "Contact Customer"}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveCallModal(null)}
                  className="p-1 rounded-lg text-charcoal/50 hover:text-charcoal cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-cream-card dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border space-y-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted block">
                      {showHindi ? "ग्राहक का नाम" : "Customer Name"}
                    </span>
                    <span className="text-base font-bold text-charcoal dark:text-dark-text">
                      {activeCallModal.customerName}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted block">
                      {showHindi ? "गांव का पता" : "Village Address"}
                    </span>
                    <span className="text-xs font-semibold text-charcoal/80 dark:text-dark-text">
                      {showHindi && activeCallModal.villageNameHi ? activeCallModal.villageNameHi : activeCallModal.villageName}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted block">
                      {showHindi ? "फोन नंबर" : "Phone Number"}
                    </span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-lg font-mono font-bold text-olive-800 dark:text-olive-300">
                        {activeCallModal.customerPhone}
                      </span>
                      <button
                        onClick={() => copyPhoneNumber(activeCallModal.customerPhone)}
                        className="flex items-center gap-1 text-xs font-bold text-charcoal/70 dark:text-dark-muted hover:text-olive-800 px-2 py-1 bg-white dark:bg-dark-card rounded-lg border border-charcoal/10 cursor-pointer"
                      >
                        <Copy size={13} />
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-charcoal/60 dark:text-dark-muted text-center">
                  {showHindi
                    ? "ग्राहक से बात करके काम का समय और सही जगह निश्चित कर लें।"
                    : "Confirm job timing and directions directly with the customer."}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveCallModal(null)}
                  className="w-1/2 py-2.5 rounded-xl text-xs font-bold border border-charcoal/15 text-charcoal/70 cursor-pointer"
                >
                  {showHindi ? "बंद करें (Close)" : "Close"}
                </button>
                <a
                  href={`tel:${activeCallModal.customerPhone.replace(/\s+/g, "")}`}
                  className="w-1/2 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Phone size={14} />
                  <span>{showHindi ? "अभी कॉल लगाएं" : "Call Now"}</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Confirm Mark Done & Collected Payment */}
      <AnimatePresence>
        {confirmCompleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-dark-card rounded-3xl p-6 max-w-md w-full border border-charcoal/10 dark:border-dark-border shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-charcoal/10 dark:border-dark-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <CheckCircle2 size={18} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-charcoal dark:text-dark-text">
                    {showHindi ? "काम पूरा होने की पुष्टि" : "Confirm Completion"}
                  </h3>
                </div>
                <button
                  onClick={() => setConfirmCompleteModal(null)}
                  className="p-1 rounded-lg text-charcoal/50 hover:text-charcoal cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-charcoal/80 dark:text-dark-text leading-relaxed">
                  {showHindi ? (
                    <>
                      क्या आपने <strong>{confirmCompleteModal.customerName}</strong> का काम पूरा कर लिया है और तय राशि{" "}
                      <span className="font-bold text-olive-800 text-base">₹{confirmCompleteModal.amount}</span> नकद अथवा UPI द्वारा प्राप्त कर ली है?
                    </>
                  ) : (
                    <>
                      Have you completed the work for <strong>{confirmCompleteModal.customerName}</strong> and collected the payout of{" "}
                      <strong>₹{confirmCompleteModal.amount}</strong>?
                    </>
                  )}
                </p>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300">
                  {showHindi
                    ? "✓ 'हाँ, पूरा हुआ' दबाते ही यह काम आपकी कमाई में जुड़ जाएगा। (0% कमीशन)"
                    : "✓ This amount will be added to your verified earnings ledger immediately."}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmCompleteModal(null)}
                  className="w-1/2 py-2.5 rounded-xl text-xs font-bold border border-charcoal/15 text-charcoal/70 cursor-pointer"
                >
                  {showHindi ? "अभी नहीं (Cancel)" : "Cancel"}
                </button>
                <button
                  type="button"
                  onClick={() => handleComplete(confirmCompleteModal.id)}
                  className="w-1/2 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Check size={16} />
                  <span>{showHindi ? "हाँ, पूरा हुआ (Yes Done)" : "Yes, Completed"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Job Details Modal */}
      <AnimatePresence>
        {activeDetailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-dark-card rounded-3xl p-6 max-w-lg w-full border border-charcoal/10 dark:border-dark-border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-charcoal/10 dark:border-dark-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-olive-100 text-olive-800 flex items-center justify-center">
                    <Briefcase size={16} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-charcoal dark:text-dark-text">
                    {showHindi ? "काम का पूरा विवरण (Job Details)" : "Job Receipt & Information"}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveDetailModal(null)}
                  className="p-1 rounded-lg text-charcoal/50 hover:text-charcoal cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-4 rounded-2xl bg-cream-card dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border space-y-2">
                  <div className="font-bold text-base text-charcoal dark:text-dark-text">
                    {activeDetailModal.jobTitle}
                  </div>
                  {showHindi && activeDetailModal.jobTitleHi && (
                    <div className="text-xs font-semibold text-olive-800 dark:text-olive-300">
                      {activeDetailModal.jobTitleHi}
                    </div>
                  )}
                  <p className="text-xs text-charcoal/70 dark:text-dark-muted mt-1 leading-relaxed">
                    {showHindi && activeDetailModal.descriptionHi ? activeDetailModal.descriptionHi : activeDetailModal.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-white dark:bg-dark-card border border-charcoal/10 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Customer</span>
                    <span className="font-bold text-charcoal dark:text-dark-text">{activeDetailModal.customerName}</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-dark-card border border-charcoal/10 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Payout Amount</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 text-base">₹{activeDetailModal.amount}</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-dark-card border border-charcoal/10 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Village & Distance</span>
                    <span className="font-bold text-charcoal dark:text-dark-text">{activeDetailModal.villageName}</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-dark-card border border-charcoal/10 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Payment Mode</span>
                    <span className="font-bold text-charcoal dark:text-dark-text">{activeDetailModal.paymentMode}</span>
                  </div>
                </div>

                {activeDetailModal.rating && (
                  <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/40 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                      <Star size={14} className="fill-amber-400" />
                      <span>Verified Customer Rating: {activeDetailModal.rating} / 5.0</span>
                    </div>
                    <p className="text-charcoal/70 dark:text-dark-muted mt-1 italic">
                      "{activeDetailModal.reviewText}"
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveDetailModal(null)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-olive-800 text-white cursor-pointer hover:bg-olive-900 transition-colors"
                >
                  {showHindi ? "ठीक है (Done)" : "Close"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
