import { useState, useMemo, useEffect } from "react";
import {
  PhoneCall, Search, Filter, Mail, Phone, MessageSquare, CheckCircle2,
  Clock, Eye, Trash2, X, Send, MapPin, Building, Globe
} from "lucide-react";
import { useToast } from "../hooks/useToast";
import AdminModal from "../components/ui/AdminModal";

const STORAGE_KEY = "karya_admin_contacts_v1";

const INITIAL_CONTACTS = [
  {
    id: "CNT-2026-101",
    name: "Sarpanch Dinkar Rao (Devgaon Gram Panchayat)",
    email: "sarpanch.devgaon@maha.gov.in",
    phone: "+91 94220 55120",
    subject: "MOU for onboarding all 40 village electrical & plumbing workers",
    channel: "Gram Panchayat Desk",
    village: "Devgaon Gram Panchayat",
    date: "Today, 09:30 AM",
    status: "new", // "new" | "contacted" | "resolved"
    message:
      "Our Gram Panchayat passed a resolution in the Gram Sabha to integrate all youth electricians and plumbers with the Karya app. We request an official Karya field trainer to conduct a 2-day session at the Panchayat hall.",
    replyHistory: "",
  },
  {
    id: "CNT-2026-102",
    name: "Deepak Shinde (District Skill Officer, NSDC)",
    email: "deepak.shinde@nsdcindia.org",
    phone: "+91 98190 22100",
    subject: "PMKVY Level 3 certification API integration for auto-verification",
    channel: "Web Form",
    village: "District HQ",
    date: "Yesterday, 03:15 PM",
    status: "in_progress",
    message:
      "We want to provide an API endpoint directly from our NSDC state portal so when workers enter their Skill Card ID, it instantly verifies their badge on Karya without manual document upload.",
    replyHistory: "API docs shared with engineering team. Technical call scheduled Friday.",
  },
  {
    id: "CNT-2026-103",
    name: "Sunita Wankhede",
    email: "sunita.w@gmail.com",
    phone: "+91 97650 33412",
    subject: "Bulk corporate order inquiry for Diwali handloom gifting (150 sarees)",
    channel: "WhatsApp Bot",
    village: "Pune / Semi-Urban",
    date: "10 Sep 2026, 05:40 PM",
    status: "contacted",
    message:
      "Our NGO wants to procure 150 handloom cotton sarees crafted by Maa Lakshmi SHG for employee gifting. Please share catalog quotation and delivery timelines.",
    replyHistory: "Quotation sent by Radha Devi (SHG President). Advance 50% processed.",
  },
  {
    id: "CNT-2026-104",
    name: "Anand Mhatre (Farmer)",
    email: "anand.farmer@yahoo.co.in",
    phone: "+91 94030 88123",
    subject: "Need agricultural spray drone operator contact for 12 acres",
    channel: "Toll-Free Helpline (1800-KARYA)",
    village: "Sonipur Block",
    date: "08 Sep 2026, 11:10 AM",
    status: "resolved",
    message:
      "Caller requested phone number of nearby certified drone crop sprayer in Sonipur or adjacent Devgaon block to prevent cotton bollworm pest attack.",
    replyHistory: "Connected with certified agro-drone operator Ramesh Patil.",
  },
  {
    id: "CNT-2026-105",
    name: "Pooja Hegde (CSR Foundation Lead)",
    email: "pooja.hegde@reliancefoundation.org",
    phone: "+91 98200 77410",
    subject: "Grant support for setting up 3 solar micro-tool banks for artisans",
    channel: "Web Form",
    village: "Mumbai / Regional Desk",
    date: "05 Sep 2026, 02:00 PM",
    status: "contacted",
    message:
      "We are interested in sponsoring portable power equipment banks for village women carpenters and tailors in drought-prone blocks of Maharashtra.",
    replyHistory: "Project proposal shared with foundation CSR committee.",
  },
];

export default function AdminContact() {
  const toast = useToast();

  const [contactsList, setContactsList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_CONTACTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contactsList));
    } catch {
      // ignore
    }
  }, [contactsList]);

  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeModal, setActiveModal] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  // Filtered Contacts
  const filteredContacts = useMemo(() => {
    return contactsList.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.subject.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search) ||
        c.village.toLowerCase().includes(search.toLowerCase()) ||
        c.message.toLowerCase().includes(search.toLowerCase());

      const matchesChannel = channelFilter === "all" || c.channel === channelFilter;
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;

      return matchesSearch && matchesChannel && matchesStatus;
    });
  }, [contactsList, search, channelFilter, statusFilter]);

  // Aggregate Metrics
  const newCount = useMemo(() => contactsList.filter((c) => c.status === "new").length, [contactsList]);
  const contactedCount = useMemo(() => contactsList.filter((c) => c.status === "contacted").length, [contactsList]);
  const resolvedCount = useMemo(() => contactsList.filter((c) => c.status === "resolved").length, [contactsList]);

  // Handlers
  const handleOpenModal = (contact) => {
    setActiveModal(contact);
    setReplyMessage(contact.replyHistory || "");
  };

  const handleUpdateStatus = (id, newStatus) => {
    setContactsList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    if (activeModal && activeModal.id === id) {
      setActiveModal({ ...activeModal, status: newStatus });
    }
    toast.success(`Inquiry status updated to ${newStatus}!`);
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) {
      toast.error("Please enter a reply message");
      return;
    }

    setContactsList((prev) =>
      prev.map((c) =>
        c.id === activeModal.id
          ? { ...c, replyHistory: replyMessage.trim(), status: "contacted" }
          : c
      )
    );
    toast.success(`Reply recorded & dispatched to ${activeModal.name} (${activeModal.phone})!`);
    setActiveModal(null);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete inquiry from ${name}?`)) {
      setContactsList((prev) => prev.filter((c) => c.id !== id));
      toast.info("Inquiry deleted.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl sm:text-3xl text-charcoal dark:text-dark-text font-bold">
              Inquiries &amp; Helpline Logs
            </h1>
            <span className="text-xs font-bold uppercase tracking-wider bg-olive-100 dark:bg-olive-900/40 text-olive-800 dark:text-olive-300 px-3 py-0.5 rounded-full border border-olive-300/40">
              Inbound Comms
            </span>
          </div>
          <p className="text-charcoal/65 dark:text-dark-muted text-xs sm:text-sm mt-1">
            Gram Panchayat partnerships, toll-free 1800 calls, CSR requests &amp; institutional bulk buyers.
          </p>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Total Inquiries</span>
            <PhoneCall size={16} className="text-olive-700 dark:text-olive-400" />
          </div>
          <div className="text-2xl font-bold font-display text-charcoal dark:text-dark-text">
            {contactsList.length}
          </div>
          <div className="text-[11px] text-charcoal/50 dark:text-dark-muted mt-0.5">
            Across 4 inbound channels
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>New Unread</span>
            <Mail size={16} className="text-rose-600" />
          </div>
          <div className="text-2xl font-bold font-display text-rose-600">
            {newCount} New
          </div>
          <div className="text-[11px] text-rose-600 font-semibold mt-0.5">
            Pending initial response
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Contacted</span>
            <Clock size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-display text-charcoal dark:text-dark-text">
            {contactedCount}
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-0.5">
            In active communication
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Resolved</span>
            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400">
            {resolvedCount}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
            Successfully concluded
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
              placeholder="Search contact, phone, subject, Gram Panchayat or message..."
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
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none"
            >
              <option value="all">All Channels</option>
              <option value="Gram Panchayat Desk">Gram Panchayat Desk</option>
              <option value="Web Form">Web Form</option>
              <option value="Toll-Free Helpline (1800-KARYA)">Toll-Free 1800</option>
              <option value="WhatsApp Bot">WhatsApp Bot</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="new">New Inquiries</option>
              <option value="contacted">Contacted</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Contact Inquiries Table */}
      <div className="bg-cream-card dark:bg-dark-card rounded-2xl border border-charcoal/10 dark:border-dark-border overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-charcoal/5 dark:bg-dark-bg/60 border-b border-charcoal/10 dark:border-dark-border text-charcoal/70 dark:text-dark-muted font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Sender &amp; Contact</th>
                <th className="py-3.5 px-4">Inbound Channel</th>
                <th className="py-3.5 px-4">Subject &amp; Message</th>
                <th className="py-3.5 px-4">Location / Org</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5 dark:divide-dark-border">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-charcoal/50 dark:text-dark-muted">
                    No inquiries found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((c) => (
                  <tr key={c.id} className="hover:bg-charcoal/2 dark:hover:bg-dark-bg/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-charcoal dark:text-dark-text">
                        {c.name}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-charcoal/55 dark:text-dark-muted mt-0.5">
                        <Phone size={10} />
                        <span>{c.phone}</span>
                      </div>
                      <div className="text-[10px] text-charcoal/45 dark:text-dark-muted">
                        {c.email}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border text-charcoal/80 dark:text-dark-muted">
                        {c.channel}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-charcoal dark:text-dark-text max-w-[260px] truncate">
                        {c.subject}
                      </div>
                      <p className="text-[10px] text-charcoal/50 dark:text-dark-muted line-clamp-1 max-w-[260px] mt-0.5">
                        {c.message}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-charcoal dark:text-dark-text">
                        <MapPin size={11} className="text-olive-700 dark:text-olive-400" />
                        <span>{c.village}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-charcoal/50 dark:text-dark-muted text-[11px] whitespace-nowrap">
                      {c.date}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          c.status === "new"
                            ? "bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300"
                            : c.status === "contacted"
                            ? "bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300"
                            : "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenModal(c)}
                          title="View & Reply"
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-olive-700 hover:bg-olive-800 text-white cursor-pointer shadow-2xs"
                        >
                          Respond
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(c.id, c.name)}
                          title="Delete"
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

      {/* 5. View Message & Send Response Modal */}
      <AdminModal isOpen={!!activeModal} onClose={() => setActiveModal(null)}>
        {activeModal && (
          <>
            <div className="px-6 sm:px-8 py-5 border-b border-charcoal/10 dark:border-dark-border flex items-center justify-between shrink-0 bg-cream/40 dark:bg-dark-surface/50">
              <div>
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-olive-100 dark:bg-olive-950/50 text-olive-800 dark:text-olive-300">
                  {activeModal.channel}
                </span>
                <h3 className="font-display font-bold text-xl text-charcoal dark:text-dark-text mt-1">
                  {activeModal.subject}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-2 rounded-xl text-charcoal/50 hover:text-charcoal hover:bg-charcoal/10 dark:text-dark-muted dark:hover:text-dark-text dark:hover:bg-dark-border transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-5">
              <div className="p-5 rounded-2xl bg-cream/60 dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-charcoal dark:text-dark-text">
                  <span className="text-sm">{activeModal.name}</span>
                  <span className="text-olive-700 dark:text-olive-400 font-mono text-xs">{activeModal.phone}</span>
                </div>
                <div className="text-xs text-charcoal/50 dark:text-dark-muted">
                  Email: {activeModal.email} · Location: {activeModal.village} · Received: {activeModal.date}
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text text-sm leading-relaxed">
                  "{activeModal.message}"
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-cream/40 dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border">
                <span className="font-semibold text-charcoal dark:text-dark-text text-sm">Status:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(activeModal.id, "new")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      activeModal.status === "new"
                        ? "bg-rose-600 text-white shadow-xs"
                        : "bg-charcoal/10 dark:bg-dark-surface text-charcoal/70 dark:text-dark-muted hover:bg-charcoal/15"
                    }`}
                  >
                    New
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(activeModal.id, "contacted")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      activeModal.status === "contacted"
                        ? "bg-amber-600 text-white shadow-xs"
                        : "bg-charcoal/10 dark:bg-dark-surface text-charcoal/70 dark:text-dark-muted hover:bg-charcoal/15"
                    }`}
                  >
                    Contacted
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(activeModal.id, "resolved")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      activeModal.status === "resolved"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-charcoal/10 dark:bg-dark-surface text-charcoal/70 dark:text-dark-muted hover:bg-charcoal/15"
                    }`}
                  >
                    Resolved
                  </button>
                </div>
              </div>

              <form onSubmit={handleSendReply} className="space-y-4">
                <div>
                  <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                    Send Reply / Action Log
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Type official response or action notes taken with the citizen..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-charcoal/10 hover:bg-charcoal/15 dark:bg-dark-border dark:hover:bg-dark-border/80 text-charcoal dark:text-dark-text transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-olive-700 hover:bg-olive-800 text-white shadow-xs transition-colors cursor-pointer"
                  >
                    <Send size={15} />
                    <span>Send Response</span>
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
