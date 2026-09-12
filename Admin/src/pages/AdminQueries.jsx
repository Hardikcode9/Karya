import { useState, useMemo, useEffect } from "react";
import {
  HelpCircle, Search, Filter, AlertTriangle, CheckCircle2, Clock,
  MessageSquare, User, Eye, Trash2, X, Send, ShieldAlert,
  Phone, MapPin, Check, ArrowRight
} from "lucide-react";
import { useToast } from "../hooks/useToast";
import AdminModal from "../components/ui/AdminModal";

const STORAGE_KEY = "karya_admin_queries_v1";

const INITIAL_QUERIES = [
  {
    id: "TKT-2026-901",
    subject: "Customer disputed final bill after 3 hours extra borewell repair",
    raisedBy: "Mahesh Patil",
    role: "Electrician / Wireman",
    phone: "+91 98765 43211",
    village: "Rampur East",
    category: "Payment Dispute",
    priority: "urgent", // "urgent" | "high" | "normal" | "low"
    status: "open", // "open" | "in_progress" | "resolved"
    date: "Today, 10:15 AM",
    description: "Customer agreed to pay ₹400 for emergency MCB capacitor replacement, but at job completion claimed government subsidy covers it and gave only ₹200 cash.",
    assignedTo: "Kavita (District Grievance Officer)",
    resolutionNotes: "",
  },
  {
    id: "TKT-2026-894",
    subject: "NRLM Certificate scan rejected twice during SHG onboarding",
    raisedBy: "Radha Devi",
    role: "SHG President (Maa Lakshmi)",
    phone: "+91 94230 81000",
    village: "Rampura",
    category: "Verification Delay",
    priority: "high",
    status: "in_progress",
    date: "Yesterday, 04:30 PM",
    description: "Camera snapshot in village post office has slight glare over district seal. Need manual admin review to unlock bulk order feature.",
    assignedTo: "Suresh Patil",
    resolutionNotes: "Manual verification underway with block development officer.",
  },
  {
    id: "TKT-2026-880",
    subject: "Customer phone switched off when worker reached remote farm site",
    raisedBy: "Ramesh Kumar",
    role: "Carpenter",
    phone: "+91 98765 43210",
    village: "Sonipur Block",
    category: "No-Show Report",
    priority: "normal",
    status: "resolved",
    date: "08 Sep 2026",
    description: "Traveled 6km on bicycle with wood tools. Customer was unavailable for 2 hours.",
    assignedTo: "Admin System",
    resolutionNotes: "Customer contacted via emergency SMS; compensation travel allowance of ₹150 credited to worker.",
  },
  {
    id: "TKT-2026-872",
    subject: "Tailoring delivery delay due to village power cut",
    raisedBy: "Vikram Deshmukh",
    role: "Customer",
    phone: "+91 98220 44512",
    village: "Devgaon Main",
    category: "Service Delay",
    priority: "normal",
    status: "resolved",
    date: "04 Sep 2026",
    description: "School uniforms were scheduled for Monday delivery but received on Wednesday afternoon.",
    assignedTo: "Admin System",
    resolutionNotes: "Resolved amicably. Tailor Sunita Devi provided complimentary alteration service.",
  },
  {
    id: "TKT-2026-861",
    subject: "Offline sync did not update earnings ledger after cell tower failure",
    raisedBy: "Irfan Ali",
    role: "Plumber",
    phone: "+91 98765 43212",
    village: "Bhagwanpur",
    category: "App Sync Issue",
    priority: "high",
    status: "resolved",
    date: "01 Sep 2026",
    description: "Cash payment of ₹550 recorded offline was not reflecting on the main earnings screen after tower reconnection.",
    assignedTo: "Tech Support Desk",
    resolutionNotes: "IndexedDB cache forced sync to central MongoDB ledger. Balance reconciled.",
  },
];

export default function AdminQueries() {
  const toast = useToast();

  const [queriesList, setQueriesList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_QUERIES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queriesList));
    } catch {
      // ignore
    }
  }, [queriesList]);

  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewTicketModal, setViewTicketModal] = useState(null);
  const [resolveText, setResolveText] = useState("");

  // Filtered Queries
  const filteredQueries = useMemo(() => {
    return queriesList.filter((q) => {
      const matchesSearch =
        q.subject.toLowerCase().includes(search.toLowerCase()) ||
        q.id.toLowerCase().includes(search.toLowerCase()) ||
        q.raisedBy.toLowerCase().includes(search.toLowerCase()) ||
        q.village.toLowerCase().includes(search.toLowerCase()) ||
        q.category.toLowerCase().includes(search.toLowerCase());

      const matchesPriority = priorityFilter === "all" || q.priority === priorityFilter;
      const matchesStatus = statusFilter === "all" || q.status === statusFilter;

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [queriesList, search, priorityFilter, statusFilter]);

  // Aggregate Metrics
  const openCount = useMemo(() => queriesList.filter((q) => q.status === "open").length, [queriesList]);
  const urgentCount = useMemo(() => queriesList.filter((q) => q.priority === "urgent" && q.status !== "resolved").length, [queriesList]);
  const resolvedCount = useMemo(() => queriesList.filter((q) => q.status === "resolved").length, [queriesList]);

  // Handlers
  const handleOpenTicket = (ticket) => {
    setViewTicketModal(ticket);
    setResolveText(ticket.resolutionNotes || "");
  };

  const handleUpdateStatus = (id, newStatus) => {
    setQueriesList((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
    );
    if (viewTicketModal && viewTicketModal.id === id) {
      setViewTicketModal({ ...viewTicketModal, status: newStatus });
    }
    toast.success(`Ticket ${id} marked as ${newStatus}!`);
  };

  const handleSaveResolutionNotes = (e) => {
    e.preventDefault();
    if (!resolveText.trim()) {
      toast.error("Please enter resolution notes");
      return;
    }
    setQueriesList((prev) =>
      prev.map((q) =>
        q.id === viewTicketModal.id
          ? { ...q, resolutionNotes: resolveText.trim(), status: "resolved" }
          : q
      )
    );
    toast.success(`Ticket ${viewTicketModal.id} resolved and saved!`);
    setViewTicketModal(null);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Delete query ticket ${id}?`)) {
      setQueriesList((prev) => prev.filter((q) => q.id !== id));
      toast.info(`Ticket ${id} deleted.`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl sm:text-3xl text-charcoal dark:text-dark-text font-bold">
              Grievance &amp; Query Desk
            </h1>
            <span className="text-xs font-bold uppercase tracking-wider bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 px-3 py-0.5 rounded-full border border-rose-300/40">
              Resolution Desk
            </span>
          </div>
          <p className="text-charcoal/65 dark:text-dark-muted text-xs sm:text-sm mt-1">
            Fast resolution for payment disputes, village connectivity issues, no-shows &amp; verification questions.
          </p>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Total Tickets</span>
            <HelpCircle size={16} className="text-olive-700 dark:text-olive-400" />
          </div>
          <div className="text-2xl font-bold font-display text-charcoal dark:text-dark-text">
            {queriesList.length}
          </div>
          <div className="text-[11px] text-charcoal/50 dark:text-dark-muted mt-0.5">
            Village platform inquiries
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Urgent Attention</span>
            <AlertTriangle size={16} className="text-rose-600" />
          </div>
          <div className="text-2xl font-bold font-display text-rose-600">
            {urgentCount} Urgent
          </div>
          <div className="text-[11px] text-rose-600 font-semibold mt-0.5">
            Requires immediate mediation
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Open Tickets</span>
            <Clock size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-display text-charcoal dark:text-dark-text">
            {openCount}
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-0.5">
            Under active review
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Resolved Tickets</span>
            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400">
            {resolvedCount}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
            96.2% SLA closure rate
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
              placeholder="Search ticket ID, subject, person, village or category..."
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
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Query Table */}
      <div className="bg-cream-card dark:bg-dark-card rounded-2xl border border-charcoal/10 dark:border-dark-border overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-charcoal/5 dark:bg-dark-bg/60 border-b border-charcoal/10 dark:border-dark-border text-charcoal/70 dark:text-dark-muted font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Ticket &amp; Issue</th>
                <th className="py-3.5 px-4">Raised By</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5 dark:divide-dark-border">
              {filteredQueries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-charcoal/50 dark:text-dark-muted">
                    No query tickets match your search.
                  </td>
                </tr>
              ) : (
                filteredQueries.map((q) => (
                  <tr key={q.id} className="hover:bg-charcoal/2 dark:hover:bg-dark-bg/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-mono text-[10px] text-charcoal/50 dark:text-dark-muted">
                          {q.id}
                        </span>
                        <div className="font-bold text-charcoal dark:text-dark-text max-w-[240px] truncate">
                          {q.subject}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-charcoal dark:text-dark-text">
                        {q.raisedBy}
                      </div>
                      <div className="text-[10px] text-charcoal/50 dark:text-dark-muted">
                        {q.role}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border text-charcoal/80 dark:text-dark-muted">
                        {q.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-charcoal dark:text-dark-text">
                        {q.village}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          q.priority === "urgent"
                            ? "bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300"
                            : q.priority === "high"
                            ? "bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300"
                            : "bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300"
                        }`}
                      >
                        {q.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          q.status === "resolved"
                            ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300"
                            : q.status === "in_progress"
                            ? "bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300"
                            : "bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300"
                        }`}
                      >
                        {q.status === "in_progress" ? "In Progress" : q.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-charcoal/50 dark:text-dark-muted text-[11px] whitespace-nowrap">
                      {q.date}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenTicket(q)}
                          title="View Ticket & Mediate"
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-olive-700 hover:bg-olive-800 text-white cursor-pointer shadow-2xs"
                        >
                          Resolve
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(q.id)}
                          title="Delete Ticket"
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Ticket Details & Resolution Modal */}
      <AdminModal isOpen={!!viewTicketModal} onClose={() => setViewTicketModal(null)}>
        {viewTicketModal && (
          <>
            <div className="px-6 sm:px-8 py-5 border-b border-charcoal/10 dark:border-dark-border flex items-center justify-between shrink-0 bg-cream/40 dark:bg-dark-surface/50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-charcoal/60 dark:text-dark-muted font-bold">
                    {viewTicketModal.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      viewTicketModal.priority === "urgent"
                        ? "bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300"
                        : "bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300"
                    }`}
                  >
                    {viewTicketModal.priority}
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl text-charcoal dark:text-dark-text">
                  {viewTicketModal.subject}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewTicketModal(null)}
                className="p-2 rounded-xl text-charcoal/50 hover:text-charcoal hover:bg-charcoal/10 dark:text-dark-muted dark:hover:text-dark-text dark:hover:bg-dark-border transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-5">
              <div className="p-5 rounded-2xl bg-cream/60 dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-charcoal/60 dark:text-dark-muted">
                  <span>Initiated by: <strong className="text-charcoal dark:text-dark-text">{viewTicketModal.raisedBy}</strong> ({viewTicketModal.role})</span>
                  <span className="font-mono font-bold text-olive-700 dark:text-olive-400">{viewTicketModal.phone}</span>
                </div>
                <p className="text-charcoal dark:text-dark-text leading-relaxed text-sm bg-white dark:bg-dark-surface p-4 rounded-xl border border-charcoal/10 dark:border-dark-border">
                  "{viewTicketModal.description}"
                </p>
                <div className="text-xs text-charcoal/50 dark:text-dark-muted">
                  Location: {viewTicketModal.village} · Filed: {viewTicketModal.date}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-cream/40 dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border">
                <span className="font-semibold text-charcoal dark:text-dark-text text-sm">Quick Status:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(viewTicketModal.id, "open")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      viewTicketModal.status === "open"
                        ? "bg-amber-500 text-white shadow-xs"
                        : "bg-charcoal/10 dark:bg-dark-surface text-charcoal/70 dark:text-dark-muted hover:bg-charcoal/15"
                    }`}
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(viewTicketModal.id, "in_progress")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      viewTicketModal.status === "in_progress"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-charcoal/10 dark:bg-dark-surface text-charcoal/70 dark:text-dark-muted hover:bg-charcoal/15"
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(viewTicketModal.id, "resolved")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      viewTicketModal.status === "resolved"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-charcoal/10 dark:bg-dark-surface text-charcoal/70 dark:text-dark-muted hover:bg-charcoal/15"
                    }`}
                  >
                    Resolved
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveResolutionNotes} className="space-y-4">
                <div>
                  <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                    Mediation Log &amp; Resolution Notes
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Enter resolution actions, settlement agreement or mediation outcome..."
                    value={resolveText}
                    onChange={(e) => setResolveText(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setViewTicketModal(null)}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-charcoal/10 hover:bg-charcoal/15 dark:bg-dark-border dark:hover:bg-dark-border/80 text-charcoal dark:text-dark-text transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors cursor-pointer"
                  >
                    Save &amp; Resolve Ticket
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </AdminModal>
    </div>
  );
}
