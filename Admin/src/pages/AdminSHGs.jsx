import { useState, useMemo, useEffect } from "react";
import {
  Users2, Search, ShieldCheck, X, Award, MapPin
} from "lucide-react";
import { useToast } from "../hooks/useToast";
import AdminModal from "../components/ui/AdminModal";
import api from "../utils/api";

export default function AdminSHGs() {
  const toast = useToast();
  const [shgsList, setSHGsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSHGs();
  }, []);

  const fetchSHGs = async () => {
    try {
      const response = await api.get("/admin/shgs");
      setSHGsList(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch SHGs list.");
    } finally {
      setLoading(false);
    }
  };

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewDetailsModal, setViewDetailsModal] = useState(null);

  // Filtered SHGs
  const filteredSHGs = useMemo(() => {
    return shgsList.filter((s) => {
      const name = s.user?.name || "";
      const cluster = s.cluster || "";

      const matchesSearch =
        name.toLowerCase().includes(search.toLowerCase()) ||
        cluster.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "all" || s.verificationStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [shgsList, search, statusFilter]);

  // Aggregate Metrics
  const verifiedCount = useMemo(() => {
    return shgsList.filter((s) => s.verificationStatus === "verified").length;
  }, [shgsList]);

  // Action Handlers
  const handleApproveKYC = (id, name) => {
    toast.info(`API to approve KYC for ${name} will be implemented here.`);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Users2 size={18} />
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal dark:text-dark-text">
              SHG Collectives
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted mt-1">
            Manage Self Help Groups, verify their rural collective status, and monitor trades.
          </p>
        </div>
      </div>

      {/* Aggregate Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-cream-card dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs">
          <span className="text-[11px] font-bold text-charcoal/50 dark:text-dark-muted uppercase tracking-wider block">Total SHGs</span>
          <span className="font-display font-bold text-2xl text-charcoal dark:text-dark-text mt-1 block">{shgsList.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-cream-card dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs">
          <span className="text-[11px] font-bold text-charcoal/50 dark:text-dark-muted uppercase tracking-wider block">Verified Collectives</span>
          <span className="font-display font-bold text-2xl text-emerald-600 mt-1 block">{verifiedCount}</span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-cream-card dark:bg-dark-card rounded-2xl p-4 border border-charcoal/10 dark:border-dark-border shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-dark-muted" />
            <input
              type="text"
              placeholder="Search by SHG name or cluster..."
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
              <option value="all">All Verification</option>
              <option value="verified">Verified Only</option>
              <option value="pending">Pending Audit</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table View */}
      <div className="bg-cream-card dark:bg-dark-card rounded-3xl border border-charcoal/10 dark:border-dark-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-sm text-charcoal/50">Loading SHGs...</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal/5 dark:bg-dark-surface border-b border-charcoal/10 dark:border-dark-border text-[11px] uppercase font-bold text-charcoal/60 dark:text-dark-muted tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">SHG Collective</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Bank Status</th>
                  <th className="py-3.5 px-4">KYC Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5 dark:divide-dark-border font-medium">
                {filteredSHGs.map((shg) => {
                  const user = shg.user || {};
                  return (
                    <tr key={shg._id} className="hover:bg-charcoal/2 dark:hover:bg-dark-surface/50 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0">
                            👥
                          </div>
                          <div>
                            <span className="font-bold text-charcoal dark:text-dark-text block">
                              {user.name || "Unknown SHG"}
                            </span>
                            <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold">
                              {shg.cluster || "Cluster N/A"} • {user.phone}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-charcoal/80 dark:text-dark-text">
                          <MapPin size={12} className="text-olive-700" />
                          <span>{shg.state || "Not specified"}, {shg.district || ""}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="text-charcoal dark:text-dark-text font-bold">{shg.bankName || "N/A"}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => setViewDetailsModal(shg)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                            shg.verificationStatus === "verified"
                              ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200"
                              : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 hover:bg-amber-200"
                          }`}
                        >
                          <ShieldCheck size={12} />
                          <span>{shg.verificationStatus === "verified" ? "Verified" : "Pending Audit"}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleApproveKYC(shg._id, user.name)}
                            className="p-1.5 rounded-lg border border-charcoal/15 dark:border-dark-border text-charcoal/70 hover:text-emerald-700 cursor-pointer"
                            title="Approve KYC"
                          >
                            <ShieldCheck size={14} />
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

      {/* SHG Details Modal */}
      <AdminModal isOpen={!!viewDetailsModal} onClose={() => setViewDetailsModal(null)}>
        {viewDetailsModal && (
          <>
            <div className="px-6 sm:px-8 py-5 border-b border-charcoal/10 dark:border-dark-border flex items-center justify-between shrink-0 bg-cream/40 dark:bg-dark-surface/50">
              <div className="flex items-center gap-2.5">
                <Award size={22} className="text-emerald-700 dark:text-emerald-400" />
                <div>
                  <h3 className="font-display text-xl font-bold text-charcoal dark:text-dark-text">
                    SHG Details
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewDetailsModal(null)}
                className="p-2 rounded-xl text-charcoal/50 hover:text-charcoal transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p>Name: {viewDetailsModal.user?.name}</p>
              <p>Cluster: {viewDetailsModal.cluster}</p>
              <p>Description: {viewDetailsModal.description}</p>
              <p>Bank Name: {viewDetailsModal.bankName}</p>
              <p>Verification Status: {viewDetailsModal.verificationStatus}</p>
            </div>
          </>
        )}
      </AdminModal>
    </div>
  );
}
