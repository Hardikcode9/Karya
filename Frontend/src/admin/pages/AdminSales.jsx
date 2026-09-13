import { useState, useMemo, useEffect } from "react";
import {
  IndianRupee, Search, TrendingUp, CheckCircle2, Clock
} from "lucide-react";
import { useToast } from "../hooks/useToast";
import api from "../utils/api";

export default function AdminSales() {
  const toast = useToast();
  const [salesList, setSalesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await api.get("/admin/transactions");
      setSalesList(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch transactions.");
    } finally {
      setLoading(false);
    }
  };

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredSales = useMemo(() => {
    return salesList.filter((s) => {
      const customerName = s.customer?.name || "";
      const workerName = s.worker?.user?.name || "";
      const bookingName = s.booking?.service?.name || "";

      const matchesSearch =
        customerName.toLowerCase().includes(search.toLowerCase()) ||
        workerName.toLowerCase().includes(search.toLowerCase()) ||
        bookingName.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "all" || s.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [salesList, search, statusFilter]);

  const totalVolume = useMemo(() => {
    return filteredSales.reduce((acc, s) => acc + (s.status === "paid" ? s.amount : 0), 0);
  }, [filteredSales]);

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <IndianRupee size={18} />
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal dark:text-dark-text">
              Sales &amp; Transaction Ledger
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted mt-1">
            Monitor rural direct payments and platform volume.
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-cream-card dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs">
          <span className="text-[11px] font-bold text-charcoal/50 dark:text-dark-muted uppercase tracking-wider block">Total Volume</span>
          <span className="font-display font-bold text-2xl text-emerald-600 mt-1 flex items-center gap-1">
            <TrendingUp size={16} /> ₹{totalVolume.toLocaleString()}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-cream-card dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs">
          <span className="text-[11px] font-bold text-charcoal/50 dark:text-dark-muted uppercase tracking-wider block">Platform Fee</span>
          <span className="font-display font-bold text-2xl text-charcoal mt-1 flex items-center gap-1">
            ₹0
          </span>
          <span className="text-[10px] text-charcoal/50 block mt-1">100% Zero Commission</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-cream-card dark:bg-dark-card rounded-2xl p-4 border border-charcoal/10 dark:border-dark-border shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-dark-muted" />
            <input
              type="text"
              placeholder="Search by payer, payee or service..."
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
              <option value="paid">Settled</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-cream-card dark:bg-dark-card rounded-3xl border border-charcoal/10 dark:border-dark-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-sm text-charcoal/50">Loading transactions...</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal/5 dark:bg-dark-surface border-b border-charcoal/10 dark:border-dark-border text-[11px] uppercase font-bold text-charcoal/60 dark:text-dark-muted tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Description</th>
                  <th className="py-3.5 px-4">Payer (Customer)</th>
                  <th className="py-3.5 px-4">Payee (Worker)</th>
                  <th className="py-3.5 px-4">Amount &amp; Mode</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5 dark:divide-dark-border font-medium">
                {filteredSales.map((txn) => (
                  <tr key={txn._id} className="hover:bg-charcoal/2 dark:hover:bg-dark-surface/50 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <span className="font-bold text-charcoal dark:text-dark-text block">
                        {txn.booking?.service?.name || "Booking Payment"}
                      </span>
                      <span className="text-[11px] text-charcoal/50 dark:text-dark-muted">
                        TXN: {txn.transactionId || txn._id}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-charcoal dark:text-dark-text block">
                        {txn.customer?.name}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-olive-800 dark:text-olive-300 block">
                        {txn.worker?.user?.name || "Provider"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-charcoal dark:text-dark-text block">
                        ₹{txn.amount}
                      </span>
                      <span className="text-[10px] text-charcoal/50">
                        {txn.paymentMethod || "Direct"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          txn.status === "paid"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                            : txn.status === "failed"
                            ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                        }`}
                      >
                        {txn.status === "paid" ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                        <span className="capitalize">{txn.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-charcoal/70 dark:text-dark-text">
                        {new Date(txn.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
