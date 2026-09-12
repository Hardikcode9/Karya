import { useState, useMemo, useEffect } from "react";
import {
  Users, Search, Filter, ShieldCheck, CheckCircle2, XCircle,
  Plus, Edit3, Trash2, Eye, Phone, MapPin, Award, Star,
  IndianRupee, X, Check, FileText, AlertCircle, RefreshCw
} from "lucide-react";
import { useToast } from "../hooks/useToast";
import { workers as mockWorkers } from "../data/mockData";
import AdminModal from "../components/ui/AdminModal";

const STORAGE_KEY = "karya_admin_workers_v1";

const INITIAL_WORKERS = mockWorkers.map((w, idx) => ({
  id: w.id || `wrk-${idx + 1}`,
  name: w.name,
  role: w.role,
  village: w.village,
  phone: "+91 98765 " + (43210 + idx),
  rating: w.rating || 4.8,
  completedJobs: w.completedJobs || 45,
  price: w.price || 350,
  priceUnit: w.priceUnit || "piece",
  isVerified: w.verified?.skill ?? true,
  status: "active", // "active" | "pending" | "suspended"
  docType: idx % 2 === 0 ? "NSDC Skill Certificate Level-3" : "ITI Trade Certification",
  docId: `CERT-2026-${8800 + idx}`,
  experienceYears: w.experienceYears || 5,
  joinedDate: "12 Jan 2026",
}));

export default function AdminWorkers() {
  const toast = useToast();

  const [workersList, setWorkersList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_WORKERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workersList));
    } catch {
      // ignore
    }
  }, [workersList]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewDocModal, setViewDocModal] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newWorker, setNewWorker] = useState({
    name: "",
    role: "Tailor",
    village: "Rampur",
    phone: "",
    price: 350,
    priceUnit: "piece",
    experienceYears: 5,
    docType: "Aadhaar e-KYC & Trade Certificate",
    docId: "",
  });

  const filteredWorkers = useMemo(() => {
    return workersList.filter((w) => {
      const matchesSearch =
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.role.toLowerCase().includes(search.toLowerCase()) ||
        w.village.toLowerCase().includes(search.toLowerCase()) ||
        w.phone.includes(search);

      const matchesRole = roleFilter === "all" || w.role.toLowerCase() === roleFilter.toLowerCase();
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "verified"
          ? w.isVerified
          : statusFilter === "pending"
          ? !w.isVerified
          : w.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [workersList, search, roleFilter, statusFilter]);

  const toggleWorkerStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === "active" ? "suspended" : "active";
    setWorkersList((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: nextStatus } : w))
    );
    toast.info(`Worker status changed to ${nextStatus.toUpperCase()}`);
  };

  const toggleVerification = (id, currentVerified, name) => {
    setWorkersList((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isVerified: !currentVerified } : w))
    );
    toast.success(
      !currentVerified
        ? `${name} has been verified with Aadhaar badge!`
        : `${name} verification badge removed.`
    );
  };

  const handleAddWorker = (e) => {
    e.preventDefault();
    if (!newWorker.name.trim()) return;

    const workerObj = {
      id: `wrk-${Date.now()}`,
      name: newWorker.name.trim(),
      role: newWorker.role,
      village: newWorker.village.trim() || "District Gram",
      phone: newWorker.phone.trim() || "+91 98000 00000",
      rating: 5.0,
      completedJobs: 0,
      price: Number(newWorker.price),
      priceUnit: newWorker.priceUnit,
      isVerified: true,
      status: "active",
      docType: newWorker.docType,
      docId: newWorker.docId.trim() || `KYC-${Math.floor(1000 + Math.random() * 9000)}`,
      experienceYears: Number(newWorker.experienceYears),
      joinedDate: "Today",
    };

    setWorkersList((prev) => [workerObj, ...prev]);
    setIsAddModalOpen(false);
    toast.success(`New worker ${workerObj.name} onboarded successfully!`);
    setNewWorker({
      name: "",
      role: "Tailor",
      village: "Rampur",
      phone: "",
      price: 350,
      priceUnit: "piece",
      experienceYears: 5,
      docType: "Aadhaar e-KYC & Trade Certificate",
      docId: "",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Users size={18} />
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal dark:text-dark-text">
              Worker Management Desk
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted mt-1">
            Directory of all registered rural specialists, trade certifications, Aadhaar KYC compliance, and booking availability.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-olive-700 hover:bg-olive-800 text-white shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Onboard New Worker</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-cream-card dark:bg-dark-card rounded-2xl p-4 border border-charcoal/10 dark:border-dark-border shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-dark-muted" />
            <input
              type="text"
              placeholder="Search by worker name, trade skill, village, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-surface rounded-xl text-xs sm:text-sm text-charcoal dark:text-dark-text border border-charcoal/15 dark:border-dark-border outline-none focus:border-olive-600 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-dark-surface rounded-xl text-xs font-bold text-charcoal dark:text-dark-text border border-charcoal/15 dark:border-dark-border outline-none"
            >
              <option value="all">All Trades</option>
              <option value="tailor">Tailors</option>
              <option value="carpenter">Carpenters</option>
              <option value="electrician">Electricians</option>
              <option value="plumber">Plumbers</option>
              <option value="mason">Masons</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-dark-surface rounded-xl text-xs font-bold text-charcoal dark:text-dark-text border border-charcoal/15 dark:border-dark-border outline-none"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified Only</option>
              <option value="pending">Pending KYC</option>
              <option value="active">Active Only</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Workers Table View */}
      <div className="bg-cream-card dark:bg-dark-card rounded-3xl border border-charcoal/10 dark:border-dark-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-charcoal/5 dark:bg-dark-surface border-b border-charcoal/10 dark:border-dark-border text-[11px] uppercase font-bold text-charcoal/60 dark:text-dark-muted tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Worker Name &amp; Trade</th>
                <th className="py-3.5 px-4">Village &amp; Distance</th>
                <th className="py-3.5 px-4">Standard Rate</th>
                <th className="py-3.5 px-4">Rating &amp; Orders</th>
                <th className="py-3.5 px-4">KYC Compliance</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5 dark:divide-dark-border font-medium">
              {filteredWorkers.map((worker) => (
                <tr key={worker.id} className="hover:bg-charcoal/2 dark:hover:bg-dark-surface/50 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-olive-100 dark:bg-olive-950 text-olive-800 dark:text-olive-300 font-bold flex items-center justify-center shrink-0">
                        {worker.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-charcoal dark:text-dark-text block">
                          {worker.name}
                        </span>
                        <span className="text-[11px] text-olive-800 dark:text-olive-300 font-semibold">
                          {worker.role} • {worker.phone}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-charcoal/80 dark:text-dark-text">
                      <MapPin size={12} className="text-olive-700" />
                      <span>{worker.village}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-charcoal dark:text-dark-text">
                      ₹{worker.price}
                    </span>
                    <span className="text-[10px] text-charcoal/50">/{worker.priceUnit}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 font-bold text-amber-500">
                      <Star size={13} className="fill-amber-400" />
                      <span>{worker.rating}</span>
                      <span className="text-charcoal/50 font-normal ml-1">({worker.completedJobs} jobs)</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => setViewDocModal(worker)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                        worker.isVerified
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200"
                          : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 hover:bg-amber-200"
                      }`}
                    >
                      <ShieldCheck size={12} />
                      <span>{worker.isVerified ? "Aadhaar Verified" : "Pending Audit"}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        worker.status === "active"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${worker.status === "active" ? "bg-emerald-600 animate-pulse" : "bg-rose-600"}`} />
                      <span className="capitalize">{worker.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleVerification(worker.id, worker.isVerified, worker.name)}
                        title={worker.isVerified ? "Revoke Verification" : "Approve Verification"}
                        className="p-1.5 rounded-lg border border-charcoal/15 dark:border-dark-border text-charcoal/70 hover:text-emerald-700 cursor-pointer"
                      >
                        <ShieldCheck size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleWorkerStatus(worker.id, worker.status)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                          worker.status === "active"
                            ? "border border-charcoal/15 text-charcoal/60 hover:text-rose-600"
                            : "bg-emerald-700 text-white"
                        }`}
                      >
                        {worker.status === "active" ? "Suspend" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: VIEW WORKER CERTIFICATE & AUDIT */}
      <AdminModal isOpen={!!viewDocModal} onClose={() => setViewDocModal(null)}>
        {viewDocModal && (
          <>
            <div className="px-6 sm:px-8 py-5 border-b border-charcoal/10 dark:border-dark-border flex items-center justify-between shrink-0 bg-cream/40 dark:bg-dark-surface/50">
              <div className="flex items-center gap-2.5">
                <Award size={22} className="text-olive-700 dark:text-olive-400" />
                <div>
                  <h3 className="font-display text-xl font-bold text-charcoal dark:text-dark-text">
                    Worker KYC &amp; Trade Proof
                  </h3>
                  <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-0.5">
                    Verified vocational documentation and credentials review.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewDocModal(null)}
                className="p-2 rounded-xl text-charcoal/50 hover:text-charcoal hover:bg-charcoal/10 dark:text-dark-muted dark:hover:text-dark-text dark:hover:bg-dark-border transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-4 rounded-2xl bg-cream/60 dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border">
                  <span className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted block">Worker Full Name</span>
                  <span className="font-bold text-base text-charcoal dark:text-dark-text mt-0.5 block">{viewDocModal.name}</span>
                </div>
                <div className="p-4 rounded-2xl bg-cream/60 dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border">
                  <span className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted block">Specialized Trade</span>
                  <span className="font-bold text-base text-olive-800 dark:text-olive-300 mt-0.5 block">{viewDocModal.role}</span>
                </div>
                <div className="p-4 rounded-2xl bg-cream/60 dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border">
                  <span className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted block">Document Submitted</span>
                  <span className="font-semibold text-charcoal dark:text-dark-text flex items-center gap-2 mt-1 text-sm">
                    <FileText size={16} className="text-olive-700 dark:text-olive-400" />
                    {viewDocModal.docType}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-cream/60 dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border">
                  <span className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted block">Registration ID</span>
                  <span className="font-mono font-bold text-charcoal dark:text-dark-text text-sm mt-1 block">{viewDocModal.docId}</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-olive-50 dark:bg-olive-950/30 border border-olive-200/50 dark:border-olive-800/40 space-y-2">
                <div className="font-bold text-olive-900 dark:text-olive-200 text-sm">Panchayat Physical Verification Status</div>
                <p className="text-xs text-olive-800/80 dark:text-olive-300/80 leading-relaxed">
                  Worker has completed in-person trade skill vetting with the Sarpanch and local technical committee. Aadhaar UIDAI fingerprint authenticated.
                </p>
              </div>
            </div>

            <div className="px-6 sm:px-8 py-4 border-t border-charcoal/10 dark:border-dark-border flex items-center justify-end gap-3 shrink-0 bg-cream/40 dark:bg-dark-surface/50">
              <button
                type="button"
                onClick={() => setViewDocModal(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-charcoal/10 hover:bg-charcoal/15 dark:bg-dark-border dark:hover:bg-dark-border/80 text-charcoal dark:text-dark-text transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  toggleVerification(viewDocModal.id, viewDocModal.isVerified, viewDocModal.name);
                  setViewDocModal(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-olive-800 hover:bg-olive-900 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {viewDocModal.isVerified ? "Revoke Badge" : "Verify & Approve Badge"}
              </button>
            </div>
          </>
        )}
      </AdminModal>

      {/* MODAL 2: ONBOARD NEW WORKER */}
      <AdminModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <div className="px-6 sm:px-8 py-5 border-b border-charcoal/10 dark:border-dark-border flex items-center justify-between shrink-0 bg-cream/40 dark:bg-dark-surface/50">
          <div className="flex items-center gap-2.5">
            <Users size={22} className="text-olive-700 dark:text-olive-400" />
            <div>
              <h3 className="font-display text-xl font-bold text-charcoal dark:text-dark-text">
                Direct Worker Registration
              </h3>
              <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-0.5">
                Enroll a verified village artisan or skilled tradesperson.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(false)}
            className="p-2 rounded-xl text-charcoal/50 hover:text-charcoal hover:bg-charcoal/10 dark:text-dark-muted dark:hover:text-dark-text dark:hover:bg-dark-border transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleAddWorker} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                  Worker Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Shinde"
                  value={newWorker.name}
                  onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                  Trade Specialization
                </label>
                <select
                  value={newWorker.role}
                  onChange={(e) => setNewWorker({ ...newWorker, role: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                >
                  <option value="Tailor">Tailor</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Mason">Mason / Construction</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                  Village / Cluster *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rampur East"
                  value={newWorker.village}
                  onChange={(e) => setNewWorker({ ...newWorker, village: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 00000"
                  value={newWorker.phone}
                  onChange={(e) => setNewWorker({ ...newWorker, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                  Standard Rate (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="50"
                  value={newWorker.price}
                  onChange={(e) => setNewWorker({ ...newWorker, price: Number(e.target.value) })}
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
              className="px-6 py-2.5 rounded-xl bg-olive-800 hover:bg-olive-900 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              Confirm &amp; Register Worker
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
