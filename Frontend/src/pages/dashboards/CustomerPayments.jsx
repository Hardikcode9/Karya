import { useState, useEffect } from "react";
import {
  Wallet, CreditCard, Banknote, Smartphone, Clock,
  CheckCircle2, XCircle, AlertCircle, RefreshCw,
  Sparkles, ArrowRight, Search, Download, ShieldCheck
} from "lucide-react";
import api from "../../utils/api";
import { useAuth } from "../../hooks/useAuth";

const STATUS_CONFIG = {
  paid: {
    label: "Paid",
    icon: CheckCircle2,
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-800 dark:text-emerald-300",
    border: "border-emerald-500/20",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-800 dark:text-amber-300",
    border: "border-amber-500/20",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-800 dark:text-rose-300",
    border: "border-rose-500/20",
  },
  refunded: {
    label: "Refunded",
    icon: RefreshCw,
    bg: "bg-purple-50 dark:bg-purple-950/40",
    text: "text-purple-800 dark:text-purple-300",
    border: "border-purple-500/20",
  },
};

const METHOD_ICONS = {
  upi: Smartphone,
  cash: Banknote,
  card: CreditCard,
};

export default function CustomerPayments() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const res = await api.get("/payments/customer");
        setPayments(res.data?.payments || []);
      } catch (err) {
        console.error("Failed to fetch payments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const filtered = payments.filter((p) => {
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const searchLower = search.toLowerCase();
    const serviceName = p.booking?.service?.name || "";
    const workerName = p.booking?.worker?.user?.name || "";
    const txnId = p.transactionId || "";
    const matchesSearch =
      serviceName.toLowerCase().includes(searchLower) ||
      workerName.toLowerCase().includes(searchLower) ||
      txnId.toLowerCase().includes(searchLower);
    return matchesStatus && matchesSearch;
  });

  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-olive-900 via-olive-950 to-charcoal text-cream shadow-elevation-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-olive-700/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-olive-300 text-xs font-semibold mb-3">
              <Sparkles size={12} />
              <span>Payment Records</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl text-white font-medium">
              Payment History
            </h1>
            <p className="text-xs sm:text-sm text-cream/70 mt-1 max-w-lg">
              All your digital and cash payment transactions for village services and SHG products.
            </p>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <span className="text-xs text-cream/60">Total Paid</span>
            <span className="font-display text-3xl font-bold text-white">
              ₹{totalPaid.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-cream/50 mt-0.5">
              {payments.filter((p) => p.status === "paid").length} transactions
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-cream-card dark:bg-dark-card rounded-2xl p-3 border border-charcoal/10 dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-dark-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by service, worker, or transaction ID..."
            className="w-full bg-cream dark:bg-dark-bg rounded-xl pl-9 pr-4 py-2 text-xs outline-none border border-charcoal/10 dark:border-dark-border focus:border-olive-600 dark:text-dark-text transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {["all", "paid", "pending", "failed", "refunded"].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                statusFilter === f
                  ? "bg-olive-700 text-cream shadow-xs"
                  : "border border-charcoal/15 dark:border-dark-border text-charcoal/70 dark:text-dark-muted hover:bg-ivory dark:hover:bg-dark-surface"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Payments List */}
      {loading ? (
        <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-12 text-center border border-charcoal/10 dark:border-dark-border">
          <div className="inline-block w-8 h-8 border-3 border-olive-700 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-charcoal/60 dark:text-dark-muted">Loading payment history...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-12 text-center border border-charcoal/10 dark:border-dark-border">
          <Wallet size={36} className="mx-auto text-charcoal/20 dark:text-dark-muted mb-3" />
          <p className="text-sm text-charcoal/60 dark:text-dark-muted font-medium">
            {payments.length === 0
              ? "No payments yet. Complete a booking to see your payment history."
              : "No payments match your search criteria."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((payment) => {
            const statusCfg = STATUS_CONFIG[payment.status] || STATUS_CONFIG.pending;
            const StatusIcon = statusCfg.icon;
            const MethodIcon = METHOD_ICONS[payment.paymentMethod] || CreditCard;
            const serviceName = payment.booking?.service?.name || "Service";
            const workerName = payment.booking?.worker?.user?.name || "Worker";
            const dateStr = payment.createdAt
              ? new Date(payment.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "—";

            return (
              <div
                key={payment._id}
                className="bg-cream-card dark:bg-dark-card rounded-2xl p-4 sm:p-5 border border-charcoal/5 dark:border-dark-border hover:border-olive-200 dark:hover:border-olive-800/40 transition-all shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Info */}
                  <div className="flex items-start gap-3.5">
                    <span className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${statusCfg.bg} ${statusCfg.text}`}>
                      <StatusIcon size={20} />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm text-charcoal dark:text-dark-text truncate">
                          {serviceName}
                        </h3>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${statusCfg.bg} ${statusCfg.text} border ${statusCfg.border}`}>
                          {statusCfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-0.5">
                        Worker: <span className="font-semibold text-charcoal dark:text-dark-text">{workerName}</span>
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-charcoal/50 dark:text-dark-muted">
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {dateStr}
                        </span>
                        <span className="flex items-center gap-1 capitalize">
                          <MethodIcon size={11} />
                          {payment.paymentMethod}
                        </span>
                        {payment.transactionId && (
                          <span className="font-mono text-[10px] truncate max-w-[120px]" title={payment.transactionId}>
                            TXN: {payment.transactionId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-charcoal/5 dark:border-dark-border">
                    <span className="font-display font-bold text-lg text-charcoal dark:text-dark-text">
                      ₹{(payment.amount || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Footer */}
      {payments.length > 0 && (
        <div className="bg-cream-card dark:bg-dark-card rounded-2xl p-4 border border-charcoal/5 dark:border-dark-border flex items-center justify-between text-xs text-charcoal/60 dark:text-dark-muted">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>All transactions verified and securely recorded</span>
          </div>
          <span className="font-mono">{payments.length} total records</span>
        </div>
      )}
    </div>
  );
}
