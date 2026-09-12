import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle, HelpCircle, CheckCircle2, Clock, Plus, X, Search,
  Filter, Wrench, ShoppingBag, Wallet, MessageSquare, ShieldAlert,
  ArrowRight, Sparkles, Upload, FileText, ChevronDown, Check, Info, Phone
} from "lucide-react";
import { useToast } from "../../hooks/useToast";

const INITIAL_QUERIES = [
  {
    id: "CMP-1048",
    type: "service",
    category: "Service Quality & Defect",
    priority: "Urgent",
    status: "Under Investigation",
    title: "Submersible Motor Tripping & Whistling Noise After Overhaul",
    targetItem: "Submersible Pump Wiring & Overhaul",
    targetParty: "Ramesh Kumar (Verified Electrician)",
    associatedId: "SRV-3810",
    dateTime: "Today, 11 Sep 2026 • 01:15 PM",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=200&q=80",
    description:
      "The motor was serviced yesterday, but after 2 hours of running in the paddy field, the starter box tripped with sparks. A continuous whistling noise is coming from the capacitor unit. Irrigation is currently stalled.",
    officialResponse: {
      responder: "Sanjay Verma (Gram Panchayat Service Officer)",
      role: "Karya Village Grievance Desk",
      time: "Today, 11 Sep 2026 • 02:00 PM",
      text: "Complaint escalated to priority red. Technician Ramesh Kumar has been ordered for an emergency free warranty inspection today before 04:30 PM. No extra visit fee will be charged.",
    },
    actionLabel: "View Technician Dispatch",
    actionTo: "/services",
    icon: Wrench,
  },
  {
    id: "CMP-1044",
    type: "product",
    category: "Damaged Delivery / Defect",
    priority: "High",
    status: "Replacement Dispatched",
    title: "Hairline Crack and Water Seepage in Base of 10L Mitti Matka",
    targetItem: "Terracotta Handcrafted Mitti Matka (10L)",
    targetParty: "Pragati Mahila SHG (Gorakhpur)",
    associatedId: "ORD-9201",
    dateTime: "10 Sep 2026 • 11:30 AM",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=200&q=80",
    description:
      "The 10L terracotta matka delivered yesterday evening has a micro-crack running along the bottom rim. Water continuously seeps out onto the floor. The cardboard outer box was pressed in transit.",
    officialResponse: {
      responder: "Sunita Devi (Cluster SHG Coordinator)",
      role: "Village SHG Federation",
      time: "10 Sep 2026 • 01:15 PM",
      text: "Verified through uploaded photo. Pragati SHG has dispatched a brand-new replacement matka with reinforced dry straw cushioning via express runner (Tracking #ORD-9201-R).",
    },
    actionLabel: "Track Replacement Item",
    actionTo: "/shgs",
    icon: ShoppingBag,
  },
  {
    id: "CMP-1039",
    type: "service",
    category: "Overcharging / Price Dispute",
    priority: "Normal",
    status: "Resolved & Refunded",
    title: "Labor Charge Collected Exceeded Listed Platform Tariff",
    targetItem: "Teakwood Grain Storage Box Hinge Repair",
    targetParty: "Sunita Devi (Carpentry & Woodcraft)",
    associatedId: "SRV-2941",
    dateTime: "29 Aug 2026 • 04:15 PM",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=200&q=80",
    description:
      "Customer was charged ₹850 in cash on-site, whereas the Karya transparent village price chart specified ₹650 for storage box hinge overhaul. ₹200 excess was billed without receipt.",
    officialResponse: {
      responder: "Karya Audit & Reconciliation Cell",
      role: "Platform Operations",
      time: "30 Aug 2026 • 10:00 AM",
      text: "Overcharge verified against standard tariff card. Excess ₹200 has been credited directly to your Karya Wallet (#TXN-8812). Specialist was cautioned on tariff compliance.",
    },
    actionLabel: "View Wallet Credit Slip",
    actionTo: "/customer/payments",
    icon: Wallet,
  },
  {
    id: "CMP-1031",
    type: "product",
    category: "Packaging & Seal Leakage",
    priority: "Medium",
    status: "Resolved & Closed",
    title: "Broken Outer Plastic Seal on Mustard Oil Canister",
    targetItem: "Cold-Pressed Kachi Ghani Mustard Oil (2L)",
    targetParty: "Gramodaya SHG Federation",
    associatedId: "ORD-8942",
    dateTime: "24 Aug 2026 • 02:20 PM",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=200&q=80",
    description:
      "The seal ring on the 2L mustard oil container was snapped upon opening the parcel bag, and approximately 150ml had leaked inside the packaging.",
    officialResponse: {
      responder: "Rameshwar Patel (SHG Distribution Lead)",
      role: "Gramodaya Quality Cell",
      time: "25 Aug 2026 • 09:30 AM",
      text: "Replaced with fresh unbroken factory-sealed 2L canister on next-day village supply van. Issue logged with rural courier partner.",
    },
    actionLabel: "View Reorder Details",
    actionTo: "/shgs",
    icon: ShoppingBag,
  },
  {
    id: "CMP-1025",
    type: "service",
    category: "Delay & Scheduling Issue",
    priority: "High",
    status: "Resolved & Closed",
    title: "Unnotified 4-Hour Delay in Field Irrigation Pipe Fitting",
    targetItem: "Drip Irrigation Pipe Fitting & Filter Flush",
    targetParty: "Irfan Ali (Plumbing & Irrigation)",
    associatedId: "SRV-2104",
    dateTime: "18 Aug 2026 • 09:45 AM",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=200&q=80",
    description:
      "Slot was scheduled for morning 8:00 AM before crop watering, but specialist arrived at 12:45 PM without advance phone notification due to preceding village breakdown.",
    officialResponse: {
      responder: "Panchayat Coordination Committee",
      role: "Karya District Helpdesk",
      time: "18 Aug 2026 • 03:00 PM",
      text: "Specialist Irfan Ali reported severe water valve jam at previous farm. Offered 15% discount on total labor charges as per Karya on-time guarantee policy.",
    },
    actionLabel: "Book Service Now",
    actionTo: "/services",
    icon: Wrench,
  },
  {
    id: "CMP-1018",
    type: "billing",
    category: "Payment & Gateway Failure",
    priority: "Urgent",
    status: "Resolved & Closed",
    title: "Double Deduction on UPI During Network Timeout",
    targetItem: "Natural Bamboo Storage Baskets (Set of 2)",
    targetParty: "Aarunya Weaver Collective",
    associatedId: "ORD-8519",
    dateTime: "05 Aug 2026 • 05:00 PM",
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=200&q=80",
    description:
      "UPI transaction failed on first attempt due to tower signal drop, but ₹620 was debited twice from bank account for a single order.",
    officialResponse: {
      responder: "Karya Digital Payment Desk",
      role: "State Bank Rural Gateway",
      time: "06 Aug 2026 • 11:30 AM",
      text: "Duplicate deduction of ₹620 confirmed via Bank UTR #982341. Automatically reversed and returned to customer SBI account within 24 hours.",
    },
    actionLabel: "View Payment History",
    actionTo: "/customer/payments",
    icon: Wallet,
  },
];

export default function CustomerQueries() {
  const [queries, setQueries] = useState(INITIAL_QUERIES);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();

  // Form State for New Complaint / Query
  const [formData, setFormData] = useState({
    title: "",
    category: "Service Quality & Defect",
    type: "service",
    priority: "High",
    targetItem: "",
    targetParty: "",
    associatedId: "",
    description: "",
  });

  const counts = {
    all: queries.length,
    active: queries.filter((q) => q.status !== "Resolved & Closed" && q.status !== "Resolved & Refunded").length,
    resolved: queries.filter((q) => q.status === "Resolved & Closed" || q.status === "Resolved & Refunded").length,
    service: queries.filter((q) => q.type === "service").length,
    product: queries.filter((q) => q.type === "product").length,
    billing: queries.filter((q) => q.type === "billing").length,
  };

  const filtered = queries.filter((item) => {
    if (activeTab === "active") {
      if (item.status === "Resolved & Closed" || item.status === "Resolved & Refunded") return false;
    } else if (activeTab === "resolved") {
      if (item.status !== "Resolved & Closed" && item.status !== "Resolved & Refunded") return false;
    } else if (activeTab === "service") {
      if (item.type !== "service") return false;
    } else if (activeTab === "product") {
      if (item.type !== "product") return false;
    } else if (activeTab === "billing") {
      if (item.type !== "billing") return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchId = item.id.toLowerCase().includes(q);
      const matchTarget = item.targetItem.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchId || matchTarget;
    }
    return true;
  });

  const handleCreateComplaint = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.show("Please enter complaint title and detailed description", "error");
      return;
    }

    const newTicketId = `CMP-${Math.floor(1050 + Math.random() * 850)}`;
    const newEntry = {
      id: newTicketId,
      type: formData.type,
      category: formData.category,
      priority: formData.priority,
      status: "Under Investigation",
      title: formData.title,
      targetItem: formData.targetItem || "Recent Village Booking / Purchase",
      targetParty: formData.targetParty || "Assigned Service Provider / SHG",
      associatedId: formData.associatedId || `REF-${Math.floor(1000 + Math.random() * 9000)}`,
      dateTime: "Just now • Today",
      image:
        formData.type === "product"
          ? "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=200&q=80"
          : formData.type === "billing"
          ? "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=200&q=80"
          : "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=200&q=80",
      description: formData.description,
      officialResponse: {
        responder: "Gram Panchayat Helpdesk",
        role: "Karya Grievance Officer",
        time: "Just now",
        text: "Complaint ticket registered successfully. An assigned officer will review the dispute and initiate verification within 4 business hours.",
      },
      actionLabel: formData.type === "product" ? "Buy Product Now" : formData.type === "service" ? "Book Service Now" : "View Payment History",
      actionTo: formData.type === "product" ? "/shgs" : formData.type === "service" ? "/services" : "/customer/payments",
      icon: formData.type === "product" ? ShoppingBag : formData.type === "service" ? Wrench : Wallet,
    };

    setQueries([newEntry, ...queries]);
    setShowModal(false);
    setFormData({
      title: "",
      category: "Service Quality & Defect",
      type: "service",
      priority: "High",
      targetItem: "",
      targetParty: "",
      associatedId: "",
      description: "",
    });
    toast.show(`Complaint ticket #${newTicketId} raised successfully. Tracking started!`, "success");
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      {/* Header Banner Card */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-olive-900 via-olive-950 to-charcoal text-cream shadow-elevation-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-rose-300 text-xs font-semibold mb-3">
              <ShieldAlert size={14} />
              <span>Grievance & Redressal Desk</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white font-medium">
              Customer Queries & Complaints
            </h1>
            <p className="text-xs sm:text-sm text-cream/70 mt-1 max-w-xl leading-relaxed">
              Track and raise complaints regarding service quality, damaged SHG crafts, overcharging, or payment disputes. All tickets are actively monitored by the local Gram Panchayat Helpdesk.
            </p>
          </div>

          {/* Quick Action Button - Same Structure */}
          <button
            onClick={() => setShowModal(true)}
            type="button"
            className="self-start sm:self-center shrink-0 inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white shadow-sm border border-rose-500/30 transition-all cursor-pointer"
          >
            <AlertCircle size={17} className="shrink-0" />
            <span>Raise New Complaint</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => setActiveTab("all")}
          className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all ${
            activeTab === "all"
              ? "bg-olive-800 text-white border-olive-700 shadow-elevation-1"
              : "bg-cream-card dark:bg-dark-card border-charcoal/5 dark:border-dark-border hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className={`text-xs ${activeTab === "all" ? "text-cream/80" : "text-charcoal/55 dark:text-dark-muted"}`}>
              Total Queries Filed
            </p>
            <HelpCircle size={16} className={activeTab === "all" ? "text-olive-300" : "text-olive-700 dark:text-olive-400"} />
          </div>
          <p className="font-display text-2xl font-bold mt-2">{counts.all}</p>
          <p className={`text-[11px] mt-0.5 ${activeTab === "all" ? "text-cream/70" : "text-olive-700 dark:text-olive-400"}`}>
            All time registered
          </p>
        </div>

        <div
          onClick={() => setActiveTab("active")}
          className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all ${
            activeTab === "active"
              ? "bg-rose-900 text-white border-rose-700 shadow-elevation-1"
              : "bg-cream-card dark:bg-dark-card border-charcoal/5 dark:border-dark-border hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className={`text-xs ${activeTab === "active" ? "text-cream/80" : "text-charcoal/55 dark:text-dark-muted"}`}>
              Active Complaints
            </p>
            <AlertCircle size={16} className={activeTab === "active" ? "text-rose-300" : "text-rose-600 dark:text-rose-400"} />
          </div>
          <p className="font-display text-2xl font-bold mt-2 text-rose-600 dark:text-rose-400">{counts.active}</p>
          <p className={`text-[11px] mt-0.5 ${activeTab === "active" ? "text-cream/70" : "text-rose-600 dark:text-rose-400"}`}>
            Under active review
          </p>
        </div>

        <div
          onClick={() => setActiveTab("resolved")}
          className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all ${
            activeTab === "resolved"
              ? "bg-emerald-900 text-white border-emerald-700 shadow-elevation-1"
              : "bg-cream-card dark:bg-dark-card border-charcoal/5 dark:border-dark-border hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className={`text-xs ${activeTab === "resolved" ? "text-cream/80" : "text-charcoal/55 dark:text-dark-muted"}`}>
              Resolved & Settled
            </p>
            <CheckCircle2 size={16} className={activeTab === "resolved" ? "text-emerald-300" : "text-emerald-600 dark:text-emerald-400"} />
          </div>
          <p className="font-display text-2xl font-bold mt-2 text-emerald-600 dark:text-emerald-400">{counts.resolved}</p>
          <p className={`text-[11px] mt-0.5 ${activeTab === "resolved" ? "text-cream/70" : "text-emerald-600 dark:text-emerald-400"}`}>
            100% resolution rate
          </p>
        </div>

        <div className="rounded-2xl p-4 sm:p-5 bg-cream-card dark:bg-dark-card border border-charcoal/5 dark:border-dark-border flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-xs text-charcoal/55 dark:text-dark-muted">Avg. Resolution Time</p>
            <Clock size={16} className="text-olive-700 dark:text-olive-400" />
          </div>
          <p className="font-display text-2xl font-bold mt-2 text-charcoal dark:text-dark-text">18.4 Hrs</p>
          <p className="text-[11px] mt-0.5 text-emerald-600 dark:text-emerald-400 font-semibold">
            Panchayat SLA: Under 24h
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: "all", label: `All Queries (${counts.all})` },
            { id: "active", label: `Active (${counts.active})` },
            { id: "resolved", label: `Resolved (${counts.resolved})` },
            { id: "service", label: `Services (${counts.service})` },
            { id: "product", label: `Products (${counts.product})` },
            { id: "billing", label: `Payments (${counts.billing})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-olive-700 text-cream shadow-xs font-bold"
                  : "bg-cream-card dark:bg-dark-card text-charcoal/70 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text border border-charcoal/5 dark:border-dark-border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-dark-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search complaints by ID, title, item..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-white dark:bg-dark-surface border border-charcoal/15 dark:border-dark-border outline-none focus:border-olive-600 transition-colors dark:text-dark-text"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Complaints Feed List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 rounded-3xl bg-cream-card dark:bg-dark-card border border-charcoal/5 dark:border-dark-border">
            <CheckCircle2 size={36} className="mx-auto text-emerald-600 mb-2 opacity-80" />
            <p className="font-bold text-sm text-charcoal dark:text-dark-text">No complaints found</p>
            <p className="text-xs text-charcoal/50 dark:text-dark-muted mt-0.5">
              All your requests and orders are currently in good standing.
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const isResolved = item.status === "Resolved & Closed" || item.status === "Resolved & Refunded";
            const ItemIcon = item.icon || AlertCircle;

            return (
              <div
                key={item.id}
                className="bg-cream-card dark:bg-dark-card rounded-3xl p-5 sm:p-6 border border-charcoal/5 dark:border-dark-border shadow-elevation-1 hover:shadow-elevation-2 transition-all flex flex-col gap-4"
              >
                {/* 1. Header Row: Ticket ID, Category, Priority, Status & Timestamp */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-charcoal/5 dark:border-dark-border">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-charcoal/80 dark:text-dark-text bg-white dark:bg-dark-surface px-2.5 py-1 rounded-lg border border-charcoal/10 dark:border-dark-border">
                      {item.id}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-olive-100 dark:bg-olive-900/50 text-olive-800 dark:text-olive-300">
                      {item.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                        item.priority === "Urgent"
                          ? "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300"
                          : item.priority === "High"
                          ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                          : "bg-charcoal/5 dark:bg-dark-border/60 text-charcoal/70 dark:text-dark-muted"
                      }`}
                    >
                      <AlertCircle size={10} />
                      <span>{item.priority} Priority</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                        isResolved
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                          : "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 animate-pulse"
                      }`}
                    >
                      {isResolved ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                      <span>{item.status}</span>
                    </span>
                    <span className="text-[11px] text-charcoal/50 dark:text-dark-muted flex items-center gap-1">
                      <Clock size={11} />
                      <span>{item.dateTime}</span>
                    </span>
                  </div>
                </div>

                {/* 2. Embedded Target Info Box (Product or Service associated with the complaint) */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-dark-surface border border-charcoal/5 dark:border-dark-border flex items-center gap-3.5">
                  <img
                    src={item.image}
                    alt={item.targetItem}
                    className="w-14 h-14 rounded-xl object-cover border border-charcoal/10 shrink-0 shadow-xs"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-olive-700 dark:text-olive-400 uppercase tracking-wide">
                      <ItemIcon size={12} />
                      <span>Disputed Item / Service</span>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-charcoal dark:text-dark-text truncate mt-0.5">
                      {item.targetItem}
                    </h4>
                    <p className="text-[11px] text-charcoal/60 dark:text-dark-muted truncate mt-0.5">
                      Provider: <strong>{item.targetParty}</strong> • Reference: <span className="font-mono">{item.associatedId}</span>
                    </p>
                  </div>
                </div>

                {/* 3. Detailed Issue Statement */}
                <div className="space-y-1.5">
                  <h3 className="font-bold text-sm text-charcoal dark:text-dark-text">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal/80 dark:text-dark-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* 4. Official Resolution & Redressal Box */}
                {item.officialResponse && (
                  <div className="p-3.5 rounded-2xl bg-olive-50/70 dark:bg-olive-950/40 border border-olive-200 dark:border-olive-800/40 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-olive-900 dark:text-olive-300">
                        <ShieldAlert size={14} className="text-olive-700 dark:text-olive-400" />
                        <span>Official Action from {item.officialResponse.responder}</span>
                      </div>
                      <span className="text-[10px] text-charcoal/50 dark:text-dark-muted">
                        {item.officialResponse.time}
                      </span>
                    </div>
                    <p className="text-charcoal/75 dark:text-dark-text italic leading-relaxed">
                      "{item.officialResponse.text}"
                    </p>
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-olive-700 dark:text-olive-400 pt-1">
                      <Check size={12} className="text-emerald-600" />
                      <span>Authorized by {item.officialResponse.role}</span>
                    </div>
                  </div>
                )}

                {/* 5. Bottom Action Bar with Same Button Structure */}
                <div className="pt-3 border-t border-charcoal/5 dark:border-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-charcoal/55 dark:text-dark-muted">
                    <Info size={13} className="text-olive-700 dark:text-olive-400 shrink-0" />
                    <span>Resolution is protected by Karya Gram Panchayat Guarantee</span>
                  </div>

                  {/* Button with exact requested structure: [iconlogo  action text] */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Link
                      to={item.actionTo}
                      className="inline-flex items-center justify-center gap-2.5 py-2 px-4 rounded-xl font-bold text-xs sm:text-sm bg-olive-700 hover:bg-olive-800 active:scale-[0.98] text-white shadow-sm transition-all border border-olive-800/20"
                    >
                      <ItemIcon size={15} className="shrink-0" />
                      <span>{item.actionLabel}</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Raise New Complaint / Query */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-charcoal/10 dark:border-dark-border shadow-elevation-3 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-charcoal/10 dark:border-dark-border">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center">
                  <AlertCircle size={17} />
                </span>
                <div>
                  <h3 className="font-display font-medium text-lg text-charcoal dark:text-dark-text">
                    File Complaint or Query
                  </h3>
                  <p className="text-xs text-charcoal/55 dark:text-dark-muted">
                    Grievance ticket will be assigned to local Panchayat officer
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl hover:bg-charcoal/10 dark:hover:bg-dark-border text-charcoal/60 dark:text-dark-muted transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateComplaint} className="mt-5 space-y-4">
              {/* Type and Priority Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1">
                    Dispute Category
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      const t = e.target.value;
                      setFormData({
                        ...formData,
                        type: t,
                        category:
                          t === "service"
                            ? "Service Quality & Defect"
                            : t === "product"
                            ? "Damaged Delivery / Defect"
                            : "Payment & Gateway Failure",
                      });
                    }}
                    className="w-full bg-white dark:bg-dark-surface rounded-xl px-3 py-2 text-xs outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text"
                  >
                    <option value="service">Service Issue / Defect</option>
                    <option value="product">Damaged / Missing Product</option>
                    <option value="billing">Payment & Billing Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1">
                    Urgency Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-white dark:bg-dark-surface rounded-xl px-3 py-2 text-xs outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text"
                  >
                    <option value="Urgent">Urgent (Emergency Action)</option>
                    <option value="High">High Priority</option>
                    <option value="Normal">Normal Priority</option>
                  </select>
                </div>
              </div>

              {/* Title / Subject */}
              <div>
                <label className="block text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1">
                  Complaint Subject / Summary *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Starter box sparks after pump repair"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-white dark:bg-dark-surface rounded-xl px-3.5 py-2 text-xs sm:text-sm outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text"
                />
              </div>

              {/* Target Item & Reference */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1">
                    Item or Service Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Submersible Pump Repair"
                    value={formData.targetItem}
                    onChange={(e) => setFormData({ ...formData, targetItem: e.target.value })}
                    className="w-full bg-white dark:bg-dark-surface rounded-xl px-3 py-2 text-xs outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1">
                    Order / Booking ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SRV-3810 or ORD-9201"
                    value={formData.associatedId}
                    onChange={(e) => setFormData({ ...formData, associatedId: e.target.value })}
                    className="w-full bg-white dark:bg-dark-surface rounded-xl px-3 py-2 text-xs outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text"
                  />
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1">
                  Detailed Explanation of the Issue *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe what occurred, what defect or overcharge happened, and what resolution you expect..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white dark:bg-dark-surface rounded-xl p-3 text-xs sm:text-sm outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text leading-relaxed"
                />
              </div>

              {/* Photo Upload Hint */}
              <div className="p-3 rounded-xl bg-white dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-charcoal/60 dark:text-dark-muted">
                  <Upload size={14} className="text-olive-700 dark:text-olive-400" />
                  <span>Attach photo evidence or bill receipt</span>
                </div>
                <button
                  type="button"
                  onClick={() => toast.show("Photo slip attached to grievance ticket", "info")}
                  className="text-xs font-bold text-olive-700 dark:text-olive-400 hover:underline cursor-pointer"
                >
                  Choose File
                </button>
              </div>

              {/* Action Buttons - Same Button Structure */}
              <div className="pt-3 border-t border-charcoal/10 dark:border-dark-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl font-semibold text-xs text-charcoal/70 dark:text-dark-muted hover:bg-charcoal/5 dark:hover:bg-dark-border transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white shadow-sm border border-rose-500/30 transition-all cursor-pointer"
                >
                  <AlertCircle size={16} className="shrink-0" />
                  <span>Submit Complaint Ticket</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
