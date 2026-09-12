import { useState, useMemo, useEffect } from "react";
import {
  Lightbulb, Search, Filter, ThumbsUp, MessageSquare, CheckCircle2,
  Clock, XCircle, Eye, Trash2, X, Check, Send, Sparkles,
  MapPin, User, ChevronRight, CornerDownRight
} from "lucide-react";
import { useToast } from "../hooks/useToast";
import AdminModal from "../components/ui/AdminModal";

const STORAGE_KEY = "karya_admin_suggestions_v1";

const INITIAL_SUGGESTIONS = [
  {
    id: "sug-101",
    title: "Add offline voice booking in Marathi & Bhojpuri for elderly villagers",
    submittedBy: "Balu Shinde",
    userRole: "Customer / Farmer",
    village: "Devgaon Cluster",
    category: "Regional Languages",
    upvotes: 84,
    date: "10 Sep 2026",
    status: "planned", // "review" | "planned" | "implemented" | "declined"
    description:
      "Elderly farmers who cannot type easily on touchscreen phones want to hold a mic button and say 'Mala wireman hava aahe' to book an electrician.",
    adminReply: "Planned in Q4 2026 Karya Voice Engine update with regional whisper models.",
  },
  {
    id: "sug-102",
    title: "Tool subsidy linkage with District Rural Development Agency (DRDA)",
    submittedBy: "Ramesh Kumar",
    userRole: "Carpenter",
    village: "Sonipur Block",
    category: "Tool Subsidy",
    upvotes: 62,
    date: "05 Sep 2026",
    status: "review",
    description:
      "Can Karya partner with NABARD or DRDA to give 40% subsidy on portable electric planers and cordless drills for verified carpenters?",
    adminReply: "Meeting scheduled with District Collector rural cell next Tuesday.",
  },
  {
    id: "sug-103",
    title: "Add new trade category for Solar Pump & Inverter technicians",
    submittedBy: "Mahesh Patil",
    userRole: "Electrician",
    village: "Rampur East",
    category: "Trade Categories",
    upvotes: 51,
    date: "28 Aug 2026",
    status: "implemented",
    description:
      "Many farmers have PM-KUSUM solar pumps installed that stop working due to loose MC4 connectors. We need a dedicated Solar Technician filter.",
    adminReply: "Implemented! 'Solar & Borewell' category is now active on the Services page.",
  },
  {
    id: "sug-104",
    title: "Bulk Packaging box supply for SHG organic pickles",
    submittedBy: "Radha Devi",
    userRole: "SHG President (Maa Lakshmi)",
    village: "Rampura",
    category: "SHG Operations",
    upvotes: 39,
    date: "18 Aug 2026",
    status: "review",
    description:
      "Courier charges are high because we lack standard cardboard carton sizes. A shared block-level carton supplier would reduce shipment cost by 30%.",
    adminReply: "Evaluating rural logistics tie-up with India Post Parcel Hub.",
  },
  {
    id: "sug-105",
    title: "WhatsApp order receipt for customers who don't install app",
    submittedBy: "Anita Roy",
    userRole: "Customer",
    village: "Rampur Block 2",
    category: "App Feature",
    upvotes: 78,
    date: "12 Aug 2026",
    status: "implemented",
    description:
      "Whenever a worker completes a job, send a WhatsApp message with the verified bill slip so we can save it directly.",
    adminReply: "Implemented! WhatsApp notification gateway is now active on job completion.",
  },
  {
    id: "sug-106",
    title: "Allow 2-way barter trade between farm produce and carpentry work",
    submittedBy: "Govind Rathod",
    userRole: "Farmer",
    village: "Bhagwanpur",
    category: "Pricing & Trade",
    upvotes: 14,
    date: "02 Aug 2026",
    status: "declined",
    description:
      "Can we pay workers directly in grain or wheat sacks instead of rupees inside the app?",
    adminReply: "Declined: Tax compliance and zero-commission guarantees require Indian Rupee (INR) cash or digital audit records.",
  },
];

export default function AdminSuggestions() {
  const toast = useToast();

  const [suggestionsList, setSuggestionsList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_SUGGESTIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(suggestionsList));
    } catch {
      // ignore
    }
  }, [suggestionsList]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeModal, setActiveModal] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("review");

  // Filtered Suggestions
  const filteredSuggestions = useMemo(() => {
    return suggestionsList.filter((s) => {
      const matchesSearch =
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.submittedBy.toLowerCase().includes(search.toLowerCase()) ||
        s.village.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase());

      const matchesCat = categoryFilter === "all" || s.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [suggestionsList, search, categoryFilter, statusFilter]);

  // Aggregate Metrics
  const reviewCount = useMemo(() => suggestionsList.filter((s) => s.status === "review").length, [suggestionsList]);
  const plannedCount = useMemo(() => suggestionsList.filter((s) => s.status === "planned").length, [suggestionsList]);
  const implementedCount = useMemo(() => suggestionsList.filter((s) => s.status === "implemented").length, [suggestionsList]);

  // Handlers
  const openActionModal = (sug) => {
    setActiveModal(sug);
    setSelectedStatus(sug.status);
    setReplyText(sug.adminReply || "");
  };

  const handleSaveResolution = (e) => {
    e.preventDefault();
    setSuggestionsList((prev) =>
      prev.map((s) =>
        s.id === activeModal.id
          ? { ...s, status: selectedStatus, adminReply: replyText.trim() }
          : s
      )
    );
    toast.success(`Suggestion status updated to "${selectedStatus}"!`);
    setActiveModal(null);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete suggestion "${title}"?`)) {
      setSuggestionsList((prev) => prev.filter((s) => s.id !== id));
      toast.info("Suggestion removed.");
    }
  };

  const handleUpvote = (id) => {
    setSuggestionsList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, upvotes: s.upvotes + 1 } : s))
    );
    toast.success("Upvote recorded!");
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl sm:text-3xl text-charcoal dark:text-dark-text font-bold">
              Community Suggestions
            </h1>
            <span className="text-xs font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 px-3 py-0.5 rounded-full border border-amber-300/40">
              Grassroots Ideas
            </span>
          </div>
          <p className="text-charcoal/65 dark:text-dark-muted text-xs sm:text-sm mt-1">
            Proposals from rural workers, SHG leaders, and panchayat citizens for features, tool subsidies &amp; trades.
          </p>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Total Proposals</span>
            <Lightbulb size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-display text-charcoal dark:text-dark-text">
            {suggestionsList.length}
          </div>
          <div className="text-[11px] text-charcoal/50 dark:text-dark-muted mt-0.5">
            Submitted by community
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Under Review</span>
            <Clock size={16} className="text-olive-700 dark:text-olive-400" />
          </div>
          <div className="text-2xl font-bold font-display text-charcoal dark:text-dark-text">
            {reviewCount} Ideas
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
            Awaiting admin verdict
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Roadmap Planned</span>
            <Sparkles size={16} className="text-terracotta-600 dark:text-terracotta-400" />
          </div>
          <div className="text-2xl font-bold font-display text-charcoal dark:text-dark-text">
            {plannedCount} Planned
          </div>
          <div className="text-[11px] text-olive-800 dark:text-olive-300 font-semibold mt-0.5">
            In upcoming sprints
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Implemented</span>
            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400">
            {implementedCount}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
            Delivered to villages
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative w-full md:flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-dark-muted" />
            <input
              type="text"
              placeholder="Search suggestions, contributors, villages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal dark:hover:text-dark-text"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none"
            >
              <option value="all">All Idea Categories</option>
              <option value="App Feature">App Features</option>
              <option value="Trade Categories">New Trades</option>
              <option value="Tool Subsidy">Tool Subsidies</option>
              <option value="Regional Languages">Regional Languages</option>
              <option value="SHG Operations">SHG Operations</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="review">Under Review</option>
              <option value="planned">Planned</option>
              <option value="implemented">Implemented</option>
              <option value="declined">Declined</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Suggestions Feed / Table */}
      <div className="space-y-3">
        {filteredSuggestions.length === 0 ? (
          <div className="bg-cream-card dark:bg-dark-card rounded-2xl border border-charcoal/10 dark:border-dark-border p-10 text-center text-xs text-charcoal/50 dark:text-dark-muted">
            No suggestions match your filters.
          </div>
        ) : (
          filteredSuggestions.map((sug) => (
            <div
              key={sug.id}
              className="bg-cream-card dark:bg-dark-card rounded-2xl border border-charcoal/10 dark:border-dark-border p-4 sm:p-5 shadow-xs transition-all hover:border-olive-600/40"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border text-charcoal/80 dark:text-dark-muted">
                      {sug.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        sug.status === "implemented"
                          ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300"
                          : sug.status === "planned"
                          ? "bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300"
                          : sug.status === "declined"
                          ? "bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300"
                          : "bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300"
                      }`}
                    >
                      {sug.status === "review" ? "Under Review" : sug.status}
                    </span>
                    <span className="text-[10px] text-charcoal/45 dark:text-dark-muted">
                      {sug.date}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-sm sm:text-base text-charcoal dark:text-dark-text">
                    {sug.title}
                  </h3>

                  <p className="text-xs text-charcoal/70 dark:text-dark-muted leading-relaxed">
                    {sug.description}
                  </p>

                  {/* Admin official reply bubble */}
                  {sug.adminReply && (
                    <div className="p-3 rounded-xl bg-olive-50/70 dark:bg-olive-950/30 border border-olive-200/50 dark:border-olive-900/40 flex items-start gap-2 text-xs">
                      <CornerDownRight size={14} className="text-olive-700 dark:text-olive-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-olive-900 dark:text-olive-300 text-[11px] block">
                          Official Admin Response:
                        </span>
                        <p className="text-charcoal/80 dark:text-dark-muted mt-0.5">
                          {sug.adminReply}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-1 text-[11px] text-charcoal/55 dark:text-dark-muted flex-wrap">
                    <span className="flex items-center gap-1 font-medium text-charcoal dark:text-dark-text">
                      <User size={12} className="text-olive-700 dark:text-olive-400" />
                      {sug.submittedBy} ({sug.userRole})
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-olive-700 dark:text-olive-400" />
                      {sug.village}
                    </span>
                  </div>
                </div>

                {/* Right side Upvote & Action buttons */}
                <div className="flex items-center sm:flex-col sm:items-end gap-2 pt-2 sm:pt-0 shrink-0 border-t sm:border-t-0 border-charcoal/10 dark:border-dark-border">
                  <button
                    type="button"
                    onClick={() => handleUpvote(sug.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-xs font-bold hover:border-olive-600 transition-colors cursor-pointer"
                  >
                    <ThumbsUp size={13} className="text-amber-500" />
                    <span>{sug.upvotes} Upvotes</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openActionModal(sug)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-olive-700 hover:bg-olive-800 text-white cursor-pointer shadow-2xs"
                    >
                      Update Status
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(sug.id, sug.title)}
                      className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                      title="Delete suggestion"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 5. Update Status & Admin Reply Modal */}
      <AdminModal isOpen={!!activeModal} onClose={() => setActiveModal(null)}>
        {activeModal && (
          <>
            <div className="px-6 sm:px-8 py-5 border-b border-charcoal/10 dark:border-dark-border flex items-center justify-between shrink-0 bg-cream/40 dark:bg-dark-surface/50">
              <div>
                <h3 className="font-display font-bold text-xl text-charcoal dark:text-dark-text">
                  Manage Community Suggestion
                </h3>
                <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-0.5">
                  Update public roadmap milestone and send governance response to citizens.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-2 rounded-xl text-charcoal/50 hover:text-charcoal hover:bg-charcoal/10 dark:text-dark-muted dark:hover:text-dark-text dark:hover:bg-dark-border transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveResolution} className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-5">
                <div>
                  <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                    Proposal Title
                  </label>
                  <div className="p-4 rounded-xl bg-cream/60 dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border font-semibold text-charcoal dark:text-dark-text text-sm">
                    {activeModal.title}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                    Roadmap Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 font-semibold shadow-2xs"
                  >
                    <option value="review">Under Review</option>
                    <option value="planned">Planned for Development</option>
                    <option value="implemented">Implemented &amp; Live</option>
                    <option value="declined">Declined with Explanation</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                    Official Response to Community
                  </label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Explain the next steps or rationale behind this milestone..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                  />
                </div>
              </div>

              <div className="px-6 sm:px-8 py-4 border-t border-charcoal/10 dark:border-dark-border flex items-center justify-end gap-3 shrink-0 bg-cream/40 dark:bg-dark-surface/50">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-charcoal/10 hover:bg-charcoal/15 dark:bg-dark-border dark:hover:bg-dark-border/80 text-charcoal dark:text-dark-text transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-olive-700 hover:bg-olive-800 text-white shadow-xs transition-colors cursor-pointer"
                >
                  Save Decision
                </button>
              </div>
            </form>
          </>
        )}
      </AdminModal>
    </div>
  );
}
