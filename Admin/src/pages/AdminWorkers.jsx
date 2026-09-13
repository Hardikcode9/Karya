import { useState, useMemo, useEffect } from "react";
import {
  Users, Search, ShieldCheck, Star,
  MapPin, IndianRupee, X, FileText, Award
} from "lucide-react";
import { useToast } from "../hooks/useToast";
import AdminModal from "../components/ui/AdminModal";
import api from "../utils/api";

export default function AdminWorkers() {
  const toast = useToast();
  const [workersList, setWorkersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const response = await api.get("/admin/workers");
      setWorkersList(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch workers list.");
    } finally {
      setLoading(false);
    }
  };

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewDocModal, setViewDocModal] = useState(null);

  const filteredWorkers = useMemo(() => {
    return workersList.filter((w) => {
      const name = w.user?.name || "";
      const role = w.service?.name || "";
      const village = w.user?.village || "";
      const phone = w.user?.phone || "";

      const matchesSearch =
        name.toLowerCase().includes(search.toLowerCase()) ||
        role.toLowerCase().includes(search.toLowerCase()) ||
        village.toLowerCase().includes(search.toLowerCase()) ||
        phone.includes(search);

      const isVerified = w.user?.isVerified;
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "verified"
          ? isVerified
          : statusFilter === "pending"
          ? !isVerified
          : true;

      return matchesSearch && matchesStatus;
    });
  }, [workersList, search, statusFilter]);

  const toggleWorkerStatus = (id, currentStatus) => {
    // In a real app this would hit the API to suspend/activate
    toast.info(`Worker status change functionality to be implemented.`);
  };

  const toggleVerification = async (userId, currentVerified, name) => {
    // We could hit an API here to toggle verify status
    toast.info(`Worker verification toggle API to be implemented for ${name}`);
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
            Directory of all registered rural specialists, trade certifications, and Aadhaar KYC compliance.
          </p>
        </div>
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-dark-surface rounded-xl text-xs font-bold text-charcoal dark:text-dark-text border border-charcoal/15 dark:border-dark-border outline-none"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified Only</option>
              <option value="pending">Pending KYC</option>
            </select>
          </div>
        </div>
      </div>

      {/* Workers Table View */}
      <div className="bg-cream-card dark:bg-dark-card rounded-3xl border border-charcoal/10 dark:border-dark-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-sm text-charcoal/50">Loading workers...</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal/5 dark:bg-dark-surface border-b border-charcoal/10 dark:border-dark-border text-[11px] uppercase font-bold text-charcoal/60 dark:text-dark-muted tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Worker Name &amp; Trade</th>
                  <th className="py-3.5 px-4">Village</th>
                  <th className="py-3.5 px-4">Standard Rate</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">KYC Compliance</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5 dark:divide-dark-border font-medium">
                {filteredWorkers.map((worker) => {
                  const user = worker.user || {};
                  const service = worker.service || {};
                  const isVerified = user.isVerified || false;

                  return (
                    <tr key={worker._id} className="hover:bg-charcoal/2 dark:hover:bg-dark-surface/50 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-olive-100 dark:bg-olive-950 text-olive-800 dark:text-olive-300 font-bold flex items-center justify-center shrink-0">
                            {user.name ? user.name.charAt(0) : "W"}
                          </div>
                          <div>
                            <span className="font-bold text-charcoal dark:text-dark-text block">
                              {user.name || "Unknown Worker"}
                            </span>
                            <span className="text-[11px] text-olive-800 dark:text-olive-300 font-semibold">
                              {service.name || "N/A"} • {user.phone || "No phone"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-charcoal/80 dark:text-dark-text">
                          <MapPin size={12} className="text-olive-700" />
                          <span>{user.village || user.district || "Not specified"}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-charcoal dark:text-dark-text">
                          ₹{worker.price || 0}
                        </span>
                        <span className="text-[10px] text-charcoal/50">/{worker.priceUnit || "unit"}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 font-bold text-amber-500">
                          <Star size={13} className="fill-amber-400" />
                          <span>{worker.rating || 0}</span>
                          <span className="text-charcoal/50 font-normal ml-1">({worker.completedJobs || 0} jobs)</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => setViewDocModal(worker)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                            isVerified
                              ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200"
                              : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 hover:bg-amber-200"
                          }`}
                        >
                          <ShieldCheck size={12} />
                          <span>{isVerified ? "Aadhaar Verified" : "Pending Audit"}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          <span className="capitalize">Active</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => toggleVerification(user._id, isVerified, user.name)}
                            title={isVerified ? "Revoke Verification" : "Approve Verification"}
                            className="p-1.5 rounded-lg border border-charcoal/15 dark:border-dark-border text-charcoal/70 hover:text-emerald-700 cursor-pointer"
                          >
                            <ShieldCheck size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleWorkerStatus(worker._id, "active")}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors border border-charcoal/15 text-charcoal/60 hover:text-rose-600"
                          >
                            Suspend
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
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
                  <span className="font-bold text-base text-charcoal dark:text-dark-text mt-0.5 block">{viewDocModal.user?.name}</span>
                </div>
                <div className="p-4 rounded-2xl bg-cream/60 dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border">
                  <span className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted block">Specialized Trade</span>
                  <span className="font-bold text-base text-olive-800 dark:text-olive-300 mt-0.5 block">{viewDocModal.service?.name}</span>
                </div>
                <div className="p-4 rounded-2xl bg-cream/60 dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border">
                  <span className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted block">Document Submitted</span>
                  <span className="font-semibold text-charcoal dark:text-dark-text flex items-center gap-2 mt-1 text-sm">
                    <FileText size={16} className="text-olive-700 dark:text-olive-400" />
                    ID Proof / Certificate
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-cream/60 dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border">
                  <span className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted block">Experience</span>
                  <span className="font-mono font-bold text-charcoal dark:text-dark-text text-sm mt-1 block">{viewDocModal.experienceYears || 0} Years</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-olive-50 dark:bg-olive-950/30 border border-olive-200/50 dark:border-olive-800/40 space-y-2">
                <div className="font-bold text-olive-900 dark:text-olive-200 text-sm">Panchayat Physical Verification Status</div>
                <p className="text-xs text-olive-800/80 dark:text-olive-300/80 leading-relaxed">
                  Worker has {viewDocModal.user?.isVerified ? "completed" : "not completed"} in-person trade skill vetting with the Sarpanch and local technical committee. Aadhaar UIDAI fingerprint authenticated.
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
                  toggleVerification(viewDocModal.user?._id, viewDocModal.user?.isVerified, viewDocModal.user?.name);
                  setViewDocModal(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-olive-800 hover:bg-olive-900 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {viewDocModal.user?.isVerified ? "Revoke Verification" : "Approve Certificate"}
              </button>
            </div>
          </>
        )}
      </AdminModal>
    </div>
  );
}
