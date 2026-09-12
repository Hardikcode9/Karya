import { useState, useMemo } from "react";
import {
  Star, Phone, Mail, Clock, User, Calendar, MapPin, IndianRupee,
  Search, Filter, ShieldCheck, CheckCircle2, MessageSquare, ThumbsUp,
  Share2, ArrowUpDown, Tag, Sparkles, Send, X, RefreshCw
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

const INITIAL_WORKER_REVIEWS = [
  {
    id: "w-rev-1",
    customerName: "Aarav Sharma",
    customerPhone: "+91 98765 23412",
    customerEmail: "aarav.sharma24@gmail.com",
    customerVillage: "Rampur Gram Panchayat, Ward 3",
    toWorkerName: "Sunita Devi",
    toWorkerTrade: "Master Tailor & Embroidery Specialist",
    serviceName: "4 Sets School Uniforms & Zari Blouse Alteration",
    bookingId: "BKG-9201",
    jobEarning: 1200,
    paymentMode: "UPI Instant Payout",
    rating: 5,
    dateTime: "11 Sep 2026, 02:45 PM",
    reviewText: "Outstanding stitching craftsmanship! Completed 4 sets of school uniforms with durable double-seams well before the school reopen date. Very respectful, honest pricing, and prompt delivery.",
    verified: true,
    workerReply: "Dhanyavaad Aarav ji! Glad the uniform measurements were accurate. Always happy to assist your family.",
    helpfulCount: 9,
  },
  {
    id: "w-rev-2",
    customerName: "Meera Devi",
    customerPhone: "+91 94150 87342",
    customerEmail: "meera.devi.k@yahoo.com",
    customerVillage: "Sonipur Village, Sadar Block",
    toWorkerName: "Sunita Devi",
    toWorkerTrade: "Master Tailor & Embroidery Specialist",
    serviceName: "Traditional Chanderi Cotton Saree Fall & Pico",
    bookingId: "BKG-8845",
    jobEarning: 450,
    paymentMode: "Cash Settlement",
    rating: 5,
    dateTime: "09 Sep 2026, 11:20 AM",
    reviewText: "Flawless fall and pico work on delicate silk and pure cotton sarees. Did not damage the golden zari border. Sunita did the entire batch in just 4 hours at our village doorstep.",
    verified: true,
    workerReply: null,
    helpfulCount: 6,
  },
  {
    id: "w-rev-3",
    customerName: "Rajeshwar Singh",
    customerPhone: "+91 91200 45892",
    customerEmail: "rajeshwar.singh@graminmail.in",
    customerVillage: "Pipraich Block, Ward 7",
    toWorkerName: "Sunita Devi",
    toWorkerTrade: "Master Tailor & Embroidery Specialist",
    serviceName: "Kurta Pajama & Nehru Jacket Custom Stitching",
    bookingId: "BKG-8419",
    jobEarning: 1450,
    paymentMode: "UPI Instant Payout",
    rating: 5,
    dateTime: "05 Sep 2026, 04:15 PM",
    reviewText: "Stitched two festive Kurta sets for Panchayat Mahotsav. The collar fit and pocket finish are better than city boutiques. Fair rate and no hidden charges.",
    verified: true,
    workerReply: "Thank you Pradhan ji! It was our pleasure to serve for the village function.",
    helpfulCount: 14,
  },
  {
    id: "w-rev-4",
    customerName: "Pooja Verma",
    customerPhone: "+91 97890 34112",
    customerEmail: "pooja.verma92@gmail.com",
    customerVillage: "Khorabar Cluster, Dist. Gorakhpur",
    toWorkerName: "Sunita Devi",
    toWorkerTrade: "Master Tailor & Embroidery Specialist",
    serviceName: "Designer Blouse Cutting & Machine Embroidery",
    bookingId: "BKG-8022",
    jobEarning: 850,
    paymentMode: "UPI Instant Payout",
    rating: 4.5,
    dateTime: "28 Aug 2026, 05:30 PM",
    reviewText: "Great finishing and lovely neck design pattern. Slight 30-minute delay due to village power cut, but she informed in advance and finished the work with high precision.",
    verified: true,
    workerReply: null,
    helpfulCount: 4,
  },
  {
    id: "w-rev-5",
    customerName: "Mohit Tiwari",
    customerPhone: "+91 99180 67234",
    customerEmail: "mohit.tiwari.edu@outlook.com",
    customerVillage: "Rampur Gram Panchayat, Ward 1",
    toWorkerName: "Sunita Devi",
    toWorkerTrade: "Master Tailor & Embroidery Specialist",
    serviceName: "Emergency Uniform Repair & Zip Replacement",
    bookingId: "BKG-7650",
    jobEarning: 350,
    paymentMode: "Cash Settlement",
    rating: 5,
    dateTime: "21 Aug 2026, 09:10 AM",
    reviewText: "Fixed two broken backpack zippers and school trousers on emergency notice early morning. Extremely polite and life saver for our kid's exam day!",
    verified: true,
    workerReply: "Always glad to help in emergency hours Mohit ji!",
    helpfulCount: 8,
  },
  {
    id: "w-rev-6",
    customerName: "Dinesh Patel",
    customerPhone: "+91 93350 11984",
    customerEmail: "dinesh.patel@patelfarms.in",
    customerVillage: "Sahjanwa Industrial Area",
    toWorkerName: "Sunita Devi",
    toWorkerTrade: "Master Tailor & Embroidery Specialist",
    serviceName: "Heavy Cotton Canvas Tool Bag Stitching",
    bookingId: "BKG-7119",
    jobEarning: 900,
    paymentMode: "UPI Instant Payout",
    rating: 4,
    dateTime: "14 Aug 2026, 03:00 PM",
    reviewText: "Stitched heavy nylon and canvas storage bags for farm machinery tools. Strong thread work and heavy-duty buckles attached properly.",
    verified: true,
    workerReply: null,
    helpfulCount: 3,
  },
];

export default function WorkerReviews() {
  const { user } = useAuth();
  const toast = useToast();

  const [reviews, setReviews] = useState(INITIAL_WORKER_REVIEWS);
  const [searchQuery, setSearchQuery] = useState("");
  const [starFilter, setStarFilter] = useState("all"); // 'all', '5', '4', '3'
  const [dateFilter, setDateFilter] = useState("all"); // 'all', 'month', 'week'
  const [earningFilter, setEarningFilter] = useState("all"); // 'all', 'high', 'mid', 'low'
  const [replyModalReview, setReplyModalReview] = useState(null);
  const [replyText, setReplyText] = useState("");

  // Statistics Calculations
  const stats = useMemo(() => {
    const totalCount = reviews.length;
    const totalEarnings = reviews.reduce((sum, r) => sum + (r.jobEarning || 0), 0);
    const avgScore = totalCount > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1) : "5.0";
    const fiveStarCount = reviews.filter((r) => r.rating >= 4.8).length;
    const fourStarCount = reviews.filter((r) => r.rating >= 3.8 && r.rating < 4.8).length;
    return {
      totalCount,
      totalEarnings,
      avgScore,
      fiveStarCount,
      fourStarCount,
      fiveStarPct: Math.round((fiveStarCount / totalCount) * 100),
    };
  }, [reviews]);

  // Filtered List
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      // Search matching customer name, phone, email, village, or text
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        r.customerName.toLowerCase().includes(q) ||
        r.customerPhone.toLowerCase().includes(q) ||
        r.customerEmail.toLowerCase().includes(q) ||
        r.customerVillage.toLowerCase().includes(q) ||
        r.serviceName.toLowerCase().includes(q) ||
        r.reviewText.toLowerCase().includes(q);

      // Star filter
      let matchStar = true;
      if (starFilter === "5") matchStar = r.rating >= 4.8;
      else if (starFilter === "4") matchStar = r.rating >= 3.8 && r.rating < 4.8;
      else if (starFilter === "3") matchStar = r.rating < 3.8;

      // Earning filter
      let matchEarning = true;
      if (earningFilter === "high") matchEarning = r.jobEarning >= 1000;
      else if (earningFilter === "mid") matchEarning = r.jobEarning >= 500 && r.jobEarning < 1000;
      else if (earningFilter === "low") matchEarning = r.jobEarning < 500;

      // Date filter
      let matchDate = true;
      if (dateFilter === "month") {
        matchDate = r.dateTime.includes("Sep 2026");
      } else if (dateFilter === "week") {
        matchDate = r.dateTime.includes("11 Sep") || r.dateTime.includes("09 Sep");
      }

      return matchSearch && matchStar && matchEarning && matchDate;
    });
  }, [reviews, searchQuery, starFilter, dateFilter, earningFilter]);

  // Handle helpful upvote
  const handleHelpful = (id) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r))
    );
    toast.show("Thank you for your feedback!", "info");
  };

  // Submit Worker Reply
  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setReviews((prev) =>
      prev.map((r) => (r.id === replyModalReview.id ? { ...r, workerReply: replyText.trim() } : r))
    );
    toast.show(`Reply sent to ${replyModalReview.customerName}!`, "success");
    setReplyModalReview(null);
    setReplyText("");
  };

  const handleShareProfile = () => {
    navigator.clipboard?.writeText(window.location.origin + "/workers/sunita_devi");
    toast.show("Your public verified worker profile link copied to clipboard!", "success");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with Title and Unified Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-charcoal dark:text-dark-text font-bold">
            Customer Ratings &amp; Reviews
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted mt-1">
            Verified ratings, detailed customer contacts, and direct job earnings breakdown.
          </p>
        </div>

        <button
          type="button"
          onClick={handleShareProfile}
          className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-olive-700 hover:bg-olive-800 text-white shadow-sm border border-olive-800/20 active:scale-[0.98] transition-all self-start sm:self-auto cursor-pointer"
        >
          <Share2 size={16} />
          <span>Share Public Profile</span>
        </button>
      </div>

      {/* EARNINGS & RATINGS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Overall Rating */}
        <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-5 border border-charcoal/10 dark:border-dark-border shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60 dark:text-dark-muted">
              Average Score
            </span>
            <span className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
              <Star size={16} className="fill-amber-400 text-amber-500" />
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-charcoal dark:text-dark-text">
                {stats.avgScore}
              </span>
              <span className="text-xs text-charcoal/40 font-bold">/ 5.0</span>
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mt-1 flex items-center gap-1">
              <ShieldCheck size={12} />
              <span>{stats.fiveStarPct}% 5-Star Satisfaction</span>
            </p>
          </div>
        </div>

        {/* Card 2: Total Reviewed Earnings */}
        <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-5 border border-charcoal/10 dark:border-dark-border shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60 dark:text-dark-muted">
              Earned from Reviews
            </span>
            <span className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <IndianRupee size={16} />
            </span>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-bold text-charcoal dark:text-dark-text">
              ₹{stats.totalEarnings.toLocaleString("en-IN")}
            </span>
            <p className="text-[11px] text-charcoal/60 dark:text-dark-muted mt-1">
              From {stats.totalCount} completed customer jobs
            </p>
          </div>
        </div>

        {/* Card 3: Total Verified Reviews */}
        <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-5 border border-charcoal/10 dark:border-dark-border shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60 dark:text-dark-muted">
              Total Reviews
            </span>
            <span className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
              <MessageSquare size={16} />
            </span>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-bold text-charcoal dark:text-dark-text">
              {stats.totalCount}
            </span>
            <p className="text-[11px] text-blue-700 dark:text-blue-400 font-bold mt-1">
              100% Aadhaar-Verified Customers
            </p>
          </div>
        </div>

        {/* Card 4: Avg Earning Per Review */}
        <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-5 border border-charcoal/10 dark:border-dark-border shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60 dark:text-dark-muted">
              Avg Job Ticket
            </span>
            <span className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
              <Tag size={16} />
            </span>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-bold text-charcoal dark:text-dark-text">
              ₹{Math.round(stats.totalEarnings / (stats.totalCount || 1))}
            </span>
            <p className="text-[11px] text-charcoal/60 dark:text-dark-muted mt-1">
              Zero platform commissions deducted
            </p>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE FILTER SYSTEM */}
      <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-5 border border-charcoal/10 dark:border-dark-border space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-olive-700 dark:text-olive-400" />
            <h3 className="font-display text-base font-bold text-charcoal dark:text-dark-text">
              Filter Customer Reviews &amp; Earnings
            </h3>
          </div>

          {(searchQuery || starFilter !== "all" || dateFilter !== "all" || earningFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStarFilter("all");
                setDateFilter("all");
                setEarningFilter("all");
              }}
              className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={12} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search by Customer Name, Phone, Email */}
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer, phone, email..."
              className="w-full bg-white dark:bg-dark-surface rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-charcoal dark:text-dark-text font-medium outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600"
            />
          </div>

          {/* Filter by Star Rating */}
          <div>
            <select
              value={starFilter}
              onChange={(e) => setStarFilter(e.target.value)}
              className="w-full bg-white dark:bg-dark-surface rounded-xl px-3.5 py-2.5 text-xs text-charcoal dark:text-dark-text font-semibold outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 cursor-pointer"
            >
              <option value="all">All Star Ratings ({reviews.length})</option>
              <option value="5">5-Star Ratings ({stats.fiveStarCount})</option>
              <option value="4">4-Star Ratings ({stats.fourStarCount})</option>
              <option value="3">3-Star &amp; Below</option>
            </select>
          </div>

          {/* Filter by Earnings Range */}
          <div>
            <select
              value={earningFilter}
              onChange={(e) => setEarningFilter(e.target.value)}
              className="w-full bg-white dark:bg-dark-surface rounded-xl px-3.5 py-2.5 text-xs text-charcoal dark:text-dark-text font-semibold outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 cursor-pointer"
            >
              <option value="all">All Earning Levels</option>
              <option value="high">High Ticket (₹1,000+)</option>
              <option value="mid">Standard Ticket (₹500 - ₹1,000)</option>
              <option value="low">Quick Service (&lt; ₹500)</option>
            </select>
          </div>

          {/* Filter by Date Range */}
          <div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-white dark:bg-dark-surface rounded-xl px-3.5 py-2.5 text-xs text-charcoal dark:text-dark-text font-semibold outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 cursor-pointer"
            >
              <option value="all">All Time History</option>
              <option value="week">Recent (This Week)</option>
              <option value="month">September 2026</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Pill Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-charcoal/50 dark:text-dark-muted font-bold text-[11px] uppercase">
            Quick Stars:
          </span>
          {[
            { id: "all", label: "All" },
            { id: "5", label: "5 ★ Only" },
            { id: "4", label: "4 ★ Only" },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setStarFilter(pill.id)}
              className={`px-3 py-1 rounded-xl font-bold transition-all border cursor-pointer ${
                starFilter === pill.id
                  ? "bg-olive-700 text-white border-olive-700 shadow-2xs"
                  : "bg-white dark:bg-dark-surface border-charcoal/15 dark:border-dark-border text-charcoal/70 dark:text-dark-muted hover:border-olive-600"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* DETAILED REVIEWS FEED (Showing all customer details) */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-charcoal dark:text-dark-text">
            Customer Reviews ({filteredReviews.length})
          </h3>
          <span className="text-xs text-charcoal/50 dark:text-dark-muted font-mono">
            Showing matching verified entries
          </span>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-cream-card dark:bg-dark-card border border-charcoal/10 dark:border-dark-border space-y-2">
            <p className="font-bold text-charcoal dark:text-dark-text">No reviews matched your filters.</p>
            <p className="text-xs text-charcoal/60 dark:text-dark-muted">Try resetting search query or star filter.</p>
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-cream-card dark:bg-dark-card rounded-3xl p-6 sm:p-7 border border-charcoal/10 dark:border-dark-border shadow-xs hover:shadow-elevation-1 transition-all space-y-5"
            >
              {/* Top Row: Customer Info + Rating + Job Price */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b border-charcoal/10 dark:border-dark-border">
                {/* Customer Identity Badge */}
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-olive-600 to-olive-800 text-white font-display font-bold text-lg flex items-center justify-center shrink-0 shadow-2xs">
                    {rev.customerName.charAt(0)}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-display text-base font-bold text-charcoal dark:text-dark-text">
                        {rev.customerName}
                      </h4>
                      {rev.verified && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-500/20">
                          <CheckCircle2 size={11} className="text-emerald-600" />
                          <span>Verified Customer</span>
                        </span>
                      )}
                      <span className="text-xs font-mono text-charcoal/40 dark:text-dark-muted">
                        • {rev.bookingId}
                      </span>
                    </div>

                    {/* Customer Phone & Email (Requested by User) */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-charcoal/70 dark:text-dark-muted mt-1.5 font-medium">
                      <a
                        href={`tel:${rev.customerPhone}`}
                        className="inline-flex items-center gap-1 text-olive-800 dark:text-olive-300 hover:underline font-mono"
                      >
                        <Phone size={12} />
                        <span>{rev.customerPhone}</span>
                      </a>
                      <a
                        href={`mailto:${rev.customerEmail}`}
                        className="inline-flex items-center gap-1 text-olive-800 dark:text-olive-300 hover:underline"
                      >
                        <Mail size={12} />
                        <span>{rev.customerEmail}</span>
                      </a>
                      <span className="inline-flex items-center gap-1 text-charcoal/60 dark:text-dark-muted">
                        <MapPin size={12} />
                        <span>{rev.customerVillage}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Stars, Earning & Date */}
                <div className="flex flex-row lg:flex-col items-end justify-between lg:justify-start gap-2 shrink-0">
                  <div className="flex items-center gap-2">
                    {/* Star Rating Badge */}
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-xs font-bold">
                      <Star size={14} className="fill-amber-400 text-amber-500" />
                      <span>{rev.rating} / 5</span>
                    </div>

                    {/* Job Earnings Pill */}
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-500/20">
                      <IndianRupee size={12} />
                      <span>₹{rev.jobEarning}</span>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <span className="text-xs text-charcoal/50 dark:text-dark-muted flex items-center gap-1 font-mono">
                    <Clock size={12} />
                    <span>{rev.dateTime}</span>
                  </span>
                </div>
              </div>

              {/* To Whom Given Section (Requested by User) */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-charcoal/40">
                    Review Given To:
                  </span>
                  <span className="font-bold text-charcoal dark:text-dark-text">
                    {rev.toWorkerName}
                  </span>
                  <span className="text-charcoal/40">•</span>
                  <span className="text-olive-700 dark:text-olive-400 font-semibold">
                    {rev.toWorkerTrade}
                  </span>
                </div>

                <div className="text-[11px] font-medium text-charcoal/60 dark:text-dark-muted">
                  Service: <strong>{rev.serviceName}</strong>
                </div>
              </div>

              {/* Review Text Body */}
              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-charcoal/85 dark:text-dark-text leading-relaxed font-normal">
                  "{rev.reviewText}"
                </p>
              </div>

              {/* Worker Reply Block if Exists */}
              {rev.workerReply && (
                <div className="ml-4 sm:ml-8 p-3.5 rounded-2xl bg-olive-50 dark:bg-olive-950/40 border border-olive-600/20 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-olive-900 dark:text-olive-300">
                    <MessageSquare size={13} />
                    <span>Your Direct Response:</span>
                  </div>
                  <p className="text-xs text-charcoal/70 dark:text-dark-muted leading-relaxed">
                    "{rev.workerReply}"
                  </p>
                </div>
              )}

              {/* Action Buttons: Reply to Customer & Helpful */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleHelpful(rev.id)}
                  className="inline-flex items-center gap-1.5 text-xs text-charcoal/60 dark:text-dark-muted hover:text-olive-700 dark:hover:text-olive-400 transition-colors cursor-pointer"
                >
                  <ThumbsUp size={13} />
                  <span>Helpful ({rev.helpfulCount})</span>
                </button>

                {!rev.workerReply && (
                  <button
                    type="button"
                    onClick={() => {
                      setReplyModalReview(rev);
                      setReplyText("");
                    }}
                    className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl border border-charcoal/15 dark:border-dark-border text-xs font-bold text-charcoal dark:text-dark-text hover:bg-white dark:hover:bg-dark-surface transition-all cursor-pointer"
                  >
                    <MessageSquare size={13} />
                    <span>Reply to {rev.customerName.split(" ")[0]}</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* WORKER REPLY MODAL */}
      {replyModalReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-cream dark:bg-dark-card rounded-3xl p-6 border border-charcoal/10 dark:border-dark-border shadow-elevation-3 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-charcoal/10 dark:border-dark-border">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-olive-700 dark:text-olive-400" />
                <h3 className="font-display text-lg font-bold text-charcoal dark:text-dark-text">
                  Reply to {replyModalReview.customerName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReplyModalReview(null)}
                className="p-1 rounded-xl text-charcoal/50 hover:text-charcoal cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-dark-surface text-xs text-charcoal/70 dark:text-dark-muted italic border border-charcoal/10">
              "{replyModalReview.reviewText}"
            </div>

            <form onSubmit={handleSendReply} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1.5">
                  Your Response (Publicly displayed on your profile)
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Thank the customer, provide extra assistance, or clarify details..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full bg-white dark:bg-dark-surface rounded-xl p-3 text-xs outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyModalReview(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal/60 hover:text-charcoal cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 py-2 px-5 rounded-xl font-bold text-xs bg-olive-700 hover:bg-olive-800 text-white shadow-sm border border-olive-800/20 cursor-pointer"
                >
                  <Send size={14} />
                  <span>Send Response</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
