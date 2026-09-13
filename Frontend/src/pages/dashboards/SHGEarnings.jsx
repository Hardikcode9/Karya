import { useState, useEffect } from "react";
import {
  IndianRupee, TrendingUp, Calendar, 
  BarChart3, Clock, CheckCircle2, Search
} from "lucide-react";
import { useToast } from "../../hooks/useToast";
import api from "../../utils/api";

export default function SHGEarnings() {
  const toast = useToast();
  const [earningsData, setEarningsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const response = await api.get("/shg/earnings");
      setEarningsData(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch earnings data");
    } finally {
      setLoading(false);
    }
  };

  const [search, setSearch] = useState("");

  const transactions = earningsData?.transactions || [];
  
  const filteredTransactions = transactions.filter(t => {
    const booking = t.booking?.service?.name || t.booking?.product?.title || "Order";
    return booking.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal dark:text-dark-text flex items-center gap-2">
            <IndianRupee size={28} className="text-olive-700 dark:text-olive-500" />
            Collective Earnings
          </h2>
          <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted mt-1">
            Track payouts and transparent revenue.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-olive-800 to-olive-900 rounded-3xl p-6 sm:p-8 text-cream shadow-elevation-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <p className="text-sm font-bold text-cream/70 uppercase tracking-wider mb-2">Total Earnings</p>
            <h3 className="font-display text-4xl sm:text-5xl font-bold">
              ₹{earningsData?.totalEarnings || 0}
            </h3>
            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <TrendingUp size={14} />
              <span>100% Zero-Commission Guarantee</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border rounded-3xl p-6 shadow-xs flex flex-col justify-center">
          <p className="text-sm font-bold text-charcoal/50 dark:text-dark-muted uppercase tracking-wider mb-2">Total Transactions</p>
          <h3 className="font-display text-3xl font-bold text-charcoal dark:text-dark-text">
            {earningsData?.transactionCount || 0}
          </h3>
          <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-2">
            Completed orders and services via Karya platform.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-3xl border border-charcoal/10 dark:border-dark-border shadow-xs overflow-hidden mt-8">
        <div className="p-5 sm:p-6 border-b border-charcoal/10 dark:border-dark-border flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-charcoal dark:text-dark-text">Transaction History</h3>
          <div className="relative w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-charcoal/5 dark:bg-dark-surface rounded-lg text-xs outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-charcoal/50">Loading transactions...</div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-12 text-center text-charcoal/50">No transactions found.</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal/5 dark:bg-dark-surface border-b border-charcoal/10 dark:border-dark-border text-[11px] uppercase font-bold text-charcoal/60 dark:text-dark-muted tracking-wider">
                <tr>
                  <th className="py-4 px-5">Date</th>
                  <th className="py-4 px-5">Booking Details</th>
                  <th className="py-4 px-5">Amount</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5 dark:divide-dark-border font-medium">
                {filteredTransactions.map((t) => (
                  <tr key={t._id} className="hover:bg-charcoal/2 dark:hover:bg-dark-surface/50 transition-colors">
                    <td className="py-4 px-5 text-charcoal/70">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-5 font-bold text-charcoal dark:text-dark-text">
                      {t.booking?.service?.name || t.booking?.product?.title || "Booking"}
                    </td>
                    <td className="py-4 px-5 font-bold text-olive-700 dark:text-olive-400">
                      ₹{t.amount}
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        t.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {t.status === 'paid' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                        {t.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right text-charcoal/60 uppercase text-[10px] font-bold">
                      {t.paymentMethod}
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
