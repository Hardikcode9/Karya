import { useState, useMemo, useEffect } from "react";
import {
  Users2, Search, Filter, ShieldCheck, CheckCircle2, XCircle,
  Plus, Edit3, Trash2, Eye, Phone, MapPin, Award, Star,
  IndianRupee, X, Check, FileText, AlertCircle, Building2,
  ShoppingBag, Sparkles, ChevronRight
} from "lucide-react";
import { useToast } from "../hooks/useToast";
import { shgs as mockSHGs } from "../data/mockData";
import AdminModal from "../components/ui/AdminModal";

const STORAGE_KEY = "karya_admin_shgs_v1";

const INITIAL_SHGS = [
  ...mockSHGs.map((s, idx) => ({
    id: s.id || `shg-${idx + 1}`,
    name: s.name,
    regNumber: `SHG-NRLM-${2020 + idx}-${7840 + idx}`,
    leader: idx === 0 ? "Radha Devi (President)" : idx === 1 ? "Meena Bai" : idx === 2 ? "Kavita Rathore" : "Sunita Mahajan",
    phone: "+91 94230 " + (81000 + idx),
    village: s.village,
    members: s.members || 14,
    revenue: s.earnings || 180000,
    orders: s.orders || 112,
    rating: s.rating || 4.8,
    specializations: s.services || ["Tailoring", "Catering", "Handicrafts"],
    bankLinked: true,
    bankName: idx % 2 === 0 ? "State Bank of India (Rural Branch)" : "Bank of Maharashtra (Gramin)",
    kycStatus: s.verified ? "verified" : "pending",
    status: "active", // "active" | "suspended" | "review"
    formedYear: 2018 + (idx % 4),
    description: s.description || "Active rural women collective delivering local artisan products and catering.",
    dividendDistributed: Math.round((s.earnings || 180000) * 0.85),
  })),
  {
    id: "surya-handicrafts",
    name: "Surya Handicrafts Mahila Mandal",
    regNumber: "SHG-NRLM-2023-9912",
    leader: "Geeta Tai Gaikwad",
    phone: "+91 98812 34509",
    village: "Devgaon Cluster",
    members: 22,
    revenue: 245000,
    orders: 148,
    rating: 4.9,
    specializations: ["Terracotta", "Bamboo Craft", "Handloom Sarees"],
    bankLinked: true,
    bankName: "NABARD Regional Rural Bank",
    kycStatus: "pending",
    status: "active",
    formedYear: 2021,
    description: "Specialized in eco-friendly festival decorations and natural dyed handlooms.",
    dividendDistributed: 210000,
  },
  {
    id: "annapurna-foods",
    name: "Annapurna Organic Millet SHG",
    regNumber: "SHG-NRLM-2022-6120",
    leader: "Laxmi Bai Shinde",
    phone: "+91 97654 99012",
    village: "Sonipur Block",
    members: 16,
    revenue: 162000,
    orders: 95,
    rating: 4.7,
    specializations: ["Millet Snacks", "Amla Pickle", "Organic Honey"],
    bankLinked: true,
    bankName: "Union Bank of India",
    kycStatus: "verified",
    status: "active",
    formedYear: 2022,
    description: "Women-led organic processing unit certified under FSSAI rural cottage scheme.",
    dividendDistributed: 140000,
  }
];

export default function AdminSHGs() {
  const toast = useToast();

  const [shgsList, setSHGsList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_SHGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shgsList));
    } catch {
      // ignore
    }
  }, [shgsList]);

  const [search, setSearch] = useState("");
  const [tradeFilter, setTradeFilter] = useState("all");
  const [kycFilter, setKycFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewDetailsModal, setViewDetailsModal] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newSHG, setNewSHG] = useState({
    name: "",
    regNumber: "",
    leader: "",
    phone: "",
    village: "Rampura",
    members: 12,
    specializations: "Tailoring, Catering",
    bankName: "State Bank of India (Rural Branch)",
  });

  // Filtered SHGs
  const filteredSHGs = useMemo(() => {
    return shgsList.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.leader.toLowerCase().includes(search.toLowerCase()) ||
        s.village.toLowerCase().includes(search.toLowerCase()) ||
        s.regNumber.toLowerCase().includes(search.toLowerCase());

      const matchesTrade =
        tradeFilter === "all" ||
        s.specializations.some((spec) => spec.toLowerCase().includes(tradeFilter.toLowerCase()));

      const matchesKyc = kycFilter === "all" || s.kycStatus === kycFilter;
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;

      return matchesSearch && matchesTrade && matchesKyc && matchesStatus;
    });
  }, [shgsList, search, tradeFilter, kycFilter, statusFilter]);

  // Aggregate Metrics
  const totalArtisans = useMemo(() => {
    return shgsList.reduce((acc, s) => acc + (Number(s.members) || 0), 0);
  }, [shgsList]);

  const totalEarnings = useMemo(() => {
    return shgsList.reduce((acc, s) => acc + (Number(s.revenue) || 0), 0);
  }, [shgsList]);

  const verifiedCount = useMemo(() => {
    return shgsList.filter((s) => s.kycStatus === "verified").length;
  }, [shgsList]);

  // Action Handlers
  const handleToggleStatus = (id, currentStatus, name) => {
    const nextStatus = currentStatus === "active" ? "suspended" : "active";
    setSHGsList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: nextStatus } : s))
    );
    if (nextStatus === "suspended") {
      toast.warning(`${name} has been marked as Suspended.`);
    } else {
      toast.success(`${name} status restored to Active!`);
    }
  };

  const handleApproveKYC = (id, name) => {
    setSHGsList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, kycStatus: "verified" } : s))
    );
    toast.success(`Cluster KYC & NABARD Bank verification approved for ${name}!`);
  };

  const handleDeleteSHG = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the Karya registry?`)) {
      setSHGsList((prev) => prev.filter((s) => s.id !== id));
      toast.info(`${name} has been removed.`);
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newSHG.name.trim() || !newSHG.leader.trim()) {
      toast.error("Please enter the SHG name and leader name");
      return;
    }

    const created = {
      id: `shg-${Date.now()}`,
      name: newSHG.name.trim(),
      regNumber: newSHG.regNumber.trim() || `SHG-NRLM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      leader: newSHG.leader.trim(),
      phone: newSHG.phone.trim() || "+91 94230 11223",
      village: newSHG.village,
      members: Number(newSHG.members) || 10,
      revenue: 0,
      orders: 0,
      rating: 5.0,
      specializations: newSHG.specializations.split(",").map((s) => s.trim()).filter(Boolean),
      bankLinked: true,
      bankName: newSHG.bankName,
      kycStatus: "pending",
      status: "active",
      formedYear: 2026,
      description: "Newly onboarded women self-help collective on Karya Rural Network.",
      dividendDistributed: 0,
    };

    setSHGsList((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewSHG({
      name: "",
      regNumber: "",
      leader: "",
      phone: "",
      village: "Rampura",
      members: 12,
      specializations: "Tailoring, Catering",
      bankName: "State Bank of India (Rural Branch)",
    });
    toast.success(`SHG "${created.name}" registered successfully!`);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl sm:text-3xl text-charcoal dark:text-dark-text font-bold">
              Self-Help Groups (SHGs)
            </h1>
            <span className="text-xs font-bold uppercase tracking-wider bg-terracotta-100 dark:bg-terracotta-900/40 text-terracotta-800 dark:text-terracotta-300 px-3 py-0.5 rounded-full border border-terracotta-300/40">
              Women Collectives
            </span>
          </div>
          <p className="text-charcoal/65 dark:text-dark-muted text-xs sm:text-sm mt-1">
            Cluster federations, member rosters, shared production units &amp; direct zero-commission payouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-olive-700 hover:bg-olive-800 text-white shadow-xs transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Register New SHG</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Total SHG Clusters</span>
            <Users2 size={16} className="text-olive-700 dark:text-olive-400" />
          </div>
          <div className="text-2xl font-bold font-display text-charcoal dark:text-dark-text">
            {shgsList.length}
          </div>
          <div className="text-[11px] text-charcoal/50 dark:text-dark-muted mt-0.5">
            Across 14 Gram Panchayats
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Women Artisans</span>
            <Sparkles size={16} className="text-terracotta-600 dark:text-terracotta-400" />
          </div>
          <div className="text-2xl font-bold font-display text-charcoal dark:text-dark-text">
            {totalArtisans} Members
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
            100% Direct Bank Seeded
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Group Revenue</span>
            <IndianRupee size={16} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-display text-charcoal dark:text-dark-text">
            ₹{totalEarnings.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
            0% platform deduction
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>NRLM Verified</span>
            <ShieldCheck size={16} className="text-olive-700 dark:text-olive-400" />
          </div>
          <div className="text-2xl font-bold font-display text-charcoal dark:text-dark-text">
            {verifiedCount} / {shgsList.length}
          </div>
          <div className="text-[11px] text-olive-800 dark:text-olive-300 font-semibold mt-0.5">
            {shgsList.length - verifiedCount} Pending Audit
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
              placeholder="Search by SHG name, leader, village or NRLM reg..."
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
              value={tradeFilter}
              onChange={(e) => setTradeFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none"
            >
              <option value="all">All Specialties</option>
              <option value="Tailoring">Tailoring &amp; Stitching</option>
              <option value="Catering">Catering &amp; Food</option>
              <option value="Handicrafts">Handicrafts &amp; Decor</option>
              <option value="Pickles">Pickles &amp; Papads</option>
              <option value="Handloom">Handloom &amp; Sarees</option>
              <option value="Organic">Organic Farming</option>
            </select>

            <select
              value={kycFilter}
              onChange={(e) => setKycFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none"
            >
              <option value="all">All Verification</option>
              <option value="verified">Verified NRLM</option>
              <option value="pending">Pending KYC</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. SHG Registry Table */}
      <div className="bg-cream-card dark:bg-dark-card rounded-2xl border border-charcoal/10 dark:border-dark-border overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-charcoal/5 dark:bg-dark-bg/60 border-b border-charcoal/10 dark:border-dark-border text-charcoal/70 dark:text-dark-muted font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">SHG Group &amp; Reg</th>
                <th className="py-3.5 px-4">Leader &amp; Contact</th>
                <th className="py-3.5 px-4">Village / Block</th>
                <th className="py-3.5 px-4">Members</th>
                <th className="py-3.5 px-4">Trades &amp; Products</th>
                <th className="py-3.5 px-4">Revenue &amp; Orders</th>
                <th className="py-3.5 px-4">KYC / Bank</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5 dark:divide-dark-border">
              {filteredSHGs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-charcoal/50 dark:text-dark-muted">
                    No Self-Help Groups match your search or filter parameters.
                  </td>
                </tr>
              ) : (
                filteredSHGs.map((s) => (
                  <tr key={s.id} className="hover:bg-charcoal/2 dark:hover:bg-dark-bg/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-bold text-charcoal dark:text-dark-text flex items-center gap-1.5">
                          <span>{s.name}</span>
                          {s.kycStatus === "verified" && (
                            <ShieldCheck size={14} className="text-olive-700 dark:text-olive-400 shrink-0" title="NRLM Verified" />
                          )}
                        </div>
                        <span className="text-[10px] text-charcoal/50 dark:text-dark-muted font-mono">
                          {s.regNumber}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-charcoal dark:text-dark-text">
                        {s.leader}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-charcoal/55 dark:text-dark-muted mt-0.5">
                        <Phone size={10} />
                        <span>{s.phone}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-charcoal dark:text-dark-text font-medium">
                        <MapPin size={12} className="text-olive-700 dark:text-olive-400" />
                        <span>{s.village}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-charcoal dark:text-dark-text">
                          {s.members}
                        </span>
                        <span className="text-[10px] text-charcoal/50 dark:text-dark-muted">
                          women
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {s.specializations.map((spec, i) => (
                          <span
                            key={i}
                            className="text-[9px] px-1.5 py-0.5 rounded-md bg-white dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border text-charcoal/80 dark:text-dark-muted font-medium"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-charcoal dark:text-dark-text flex items-center gap-0.5">
                        <IndianRupee size={12} />
                        <span>{s.revenue.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="text-[10px] text-charcoal/50 dark:text-dark-muted">
                        {s.orders} bulk orders
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {s.kycStatus === "verified" ? (
                        <div className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40">
                          <CheckCircle2 size={10} />
                          <span>Bank Linked</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300/40">
                          <AlertCircle size={10} />
                          <span>Audit Pending</span>
                        </div>
                      )}
                      <div className="text-[9px] text-charcoal/45 dark:text-dark-muted mt-0.5 truncate max-w-[120px]" title={s.bankName}>
                        {s.bankName}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          s.status === "active"
                            ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300"
                            : "bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewDetailsModal(s)}
                          title="View Cluster Details"
                          className="p-1.5 rounded-lg text-charcoal/60 dark:text-dark-muted hover:text-olive-800 dark:hover:text-olive-300 hover:bg-charcoal/5 dark:hover:bg-dark-bg cursor-pointer"
                        >
                          <Eye size={14} />
                        </button>

                        {s.kycStatus === "pending" && (
                          <button
                            type="button"
                            onClick={() => handleApproveKYC(s.id, s.name)}
                            title="Approve NRLM KYC"
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 cursor-pointer"
                          >
                            <ShieldCheck size={14} />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(s.id, s.status, s.name)}
                          title={s.status === "active" ? "Suspend Group" : "Activate Group"}
                          className={`p-1.5 rounded-lg cursor-pointer ${
                            s.status === "active"
                              ? "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50"
                              : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                          }`}
                        >
                          {s.status === "active" ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteSHG(s.id, s.name)}
                          title="Delete from Registry"
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

      {/* 5. View SHG Details Modal */}
      <AdminModal isOpen={!!viewDetailsModal} onClose={() => setViewDetailsModal(null)}>
        {viewDetailsModal && (
          <>
            <div className="px-6 sm:px-8 py-5 border-b border-charcoal/10 dark:border-dark-border flex items-center justify-between shrink-0 bg-cream/40 dark:bg-dark-surface/50">
              <div className="flex items-center gap-2.5">
                <Building2 size={22} className="text-olive-700 dark:text-olive-400" />
                <div>
                  <h3 className="font-display font-bold text-xl text-charcoal dark:text-dark-text">
                    Cluster Profile &amp; Governance
                  </h3>
                  <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-0.5">
                    Self-Help Group verification, banking link and member records.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewDetailsModal(null)}
                className="p-2 rounded-xl text-charcoal/50 hover:text-charcoal hover:bg-charcoal/10 dark:text-dark-muted dark:hover:text-dark-text dark:hover:bg-dark-border transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
              <div className="p-5 rounded-2xl bg-cream/60 dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base text-charcoal dark:text-dark-text">{viewDetailsModal.name}</span>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-charcoal/10 dark:bg-dark-card text-charcoal/80 dark:text-dark-muted">
                    {viewDetailsModal.regNumber}
                  </span>
                </div>
                <p className="text-charcoal/70 dark:text-dark-muted text-xs leading-relaxed">
                  {viewDetailsModal.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-4 rounded-2xl bg-cream/60 dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border">
                  <span className="text-charcoal/50 dark:text-dark-muted text-xs block">Cluster President</span>
                  <span className="font-bold text-charcoal dark:text-dark-text text-sm block mt-0.5">{viewDetailsModal.leader}</span>
                  <span className="text-xs text-charcoal/60 dark:text-dark-muted block mt-1">{viewDetailsModal.phone}</span>
                </div>

                <div className="p-4 rounded-2xl bg-cream/60 dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border">
                  <span className="text-charcoal/50 dark:text-dark-muted text-xs block">Village / Panchayat</span>
                  <span className="font-bold text-charcoal dark:text-dark-text text-sm block mt-0.5">{viewDetailsModal.village}</span>
                  <span className="text-xs text-charcoal/60 dark:text-dark-muted block mt-1">Formed in {viewDetailsModal.formedYear}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cream/60 dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-charcoal/50 dark:text-dark-muted text-xs">Bank Disbursal Account</span>
                  <span className="text-xs text-emerald-600 font-bold">Jan Dhan / Direct DBT Ready</span>
                </div>
                <div className="font-bold text-charcoal dark:text-dark-text text-sm">
                  {viewDetailsModal.bankName}
                </div>
                <div className="text-xs text-charcoal/60 dark:text-dark-muted">
                  Member Dividends Settled: <strong className="text-charcoal dark:text-dark-text">₹{viewDetailsModal.dividendDistributed?.toLocaleString("en-IN")}</strong>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-olive-50 dark:bg-olive-950/40 border border-olive-200/50 dark:border-olive-800/40">
                <div>
                  <span className="font-bold text-olive-900 dark:text-olive-200 block text-sm">Total Artisans in Collective</span>
                  <span className="text-xs text-olive-700 dark:text-olive-300">Each woman receives 100% direct village payout</span>
                </div>
                <span className="text-2xl font-bold font-display text-olive-900 dark:text-olive-200">
                  {viewDetailsModal.members}
                </span>
              </div>
            </div>

            <div className="px-6 sm:px-8 py-4 border-t border-charcoal/10 dark:border-dark-border flex items-center justify-end shrink-0 bg-cream/40 dark:bg-dark-surface/50">
              <button
                type="button"
                onClick={() => setViewDetailsModal(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-charcoal/10 hover:bg-charcoal/15 dark:bg-dark-border dark:hover:bg-dark-border/80 text-charcoal dark:text-dark-text transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </>
        )}
      </AdminModal>

      {/* 6. Register New SHG Modal */}
      <AdminModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <div className="px-6 sm:px-8 py-5 border-b border-charcoal/10 dark:border-dark-border flex items-center justify-between shrink-0 bg-cream/40 dark:bg-dark-surface/50">
          <div>
            <h3 className="font-display font-bold text-xl text-charcoal dark:text-dark-text">
              Register Self-Help Group
            </h3>
            <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-0.5">
              Onboard a verified women's rural artisan collective or production unit.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(false)}
            className="p-2 rounded-xl text-charcoal/50 hover:text-charcoal hover:bg-charcoal/10 dark:text-dark-muted dark:hover:text-dark-text dark:hover:bg-dark-border transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleAddSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                  SHG Collective Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahila Shakti Swayam Sahayata Samuh"
                  value={newSHG.name}
                  onChange={(e) => setNewSHG({ ...newSHG, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                  Leader / President *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shakuntala Devi"
                  value={newSHG.leader}
                  onChange={(e) => setNewSHG({ ...newSHG, leader: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  placeholder="+91 94230 11223"
                  value={newSHG.phone}
                  onChange={(e) => setNewSHG({ ...newSHG, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                  Village / Cluster
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rampur"
                  value={newSHG.village}
                  onChange={(e) => setNewSHG({ ...newSHG, village: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                  Member Count
                </label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={newSHG.members}
                  onChange={(e) => setNewSHG({ ...newSHG, members: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                  Specialties (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Tailoring, Catering, Handicrafts, Honey"
                  value={newSHG.specializations}
                  onChange={(e) => setNewSHG({ ...newSHG, specializations: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                  Bank Branch Linkage
                </label>
                <input
                  type="text"
                  placeholder="State Bank of India (Rural Branch)"
                  value={newSHG.bankName}
                  onChange={(e) => setNewSHG({ ...newSHG, bankName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                />
              </div>
            </div>
          </div>

          <div className="px-6 sm:px-8 py-4 border-t border-charcoal/10 dark:border-dark-border flex items-center justify-end gap-3 shrink-0 bg-cream/40 dark:bg-dark-surface/50">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-charcoal/10 hover:bg-charcoal/15 dark:bg-dark-border dark:hover:bg-dark-border/80 text-charcoal dark:text-dark-text transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-olive-700 hover:bg-olive-800 text-white shadow-xs transition-colors cursor-pointer"
            >
              Save &amp; Onboard SHG
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
