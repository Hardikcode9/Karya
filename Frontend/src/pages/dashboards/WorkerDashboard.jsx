import { useState } from "react";
import { Inbox, CalendarDays, IndianRupee, Star, CheckCircle, XCircle, Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import DashStat from "../../components/ui/DashStat";
import Button from "../../components/ui/Button";

const earningsByMonth = [3200, 4100, 3800, 5200, 4700, 6100];
const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
const maxEarning = Math.max(...earningsByMonth);

export default function WorkerDashboard() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [requests, setRequests] = useState([
    { id: "r1", title: "Wiring Installation & Switch Repair", customer: "Sanjay Verma", location: "Rampur, East Gate", time: "Today, 4:00 PM", fee: "₹550" },
    { id: "r2", title: "Emergency Water Motor Bypass", customer: "Anjali Devi", location: "Greenfields Ward 3", time: "Immediate", fee: "₹750", emergency: true },
    { id: "r3", title: "General Fuse Box Inspection", customer: "Gram Panchayat Office", location: "Block B, Room 2", time: "Tomorrow, 10:00 AM", fee: "₹400" },
  ]);
  const [withdrawn, setWithdrawn] = useState(false);

  const handleAction = (id, _action) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header with Live Availability Switch */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl text-charcoal dark:text-dark-text">
              Worker Operations Desk
            </h1>
            <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full uppercase">
              <ShieldCheck size={12} /> Aadhaar Verified
            </span>
          </div>
          <p className="text-charcoal/55 dark:text-dark-muted text-sm mt-1">
            {requests.length} incoming customer leads waiting for your response.
          </p>
        </div>

        <button
          onClick={() => setIsAvailable((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs ${
            isAvailable
              ? "bg-emerald-600 text-white shadow-emerald-500/20"
              : "bg-charcoal/10 dark:bg-dark-surface text-charcoal/60 dark:text-dark-muted"
          }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${isAvailable ? "bg-white animate-pulse" : "bg-charcoal/40"}`} />
          {isAvailable ? "On-Duty (Instant Dispatch Ready)" : "Off-Duty (Paused)"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashStat label="Pending Requests" value={requests.length.toString()} icon={Inbox} />
        <DashStat label="Today's Jobs" value="2" icon={CalendarDays} />
        <DashStat label="Monthly Earnings" value="₹6,100" sub="+22% vs last month" icon={IndianRupee} />
        <DashStat label="Client Rating" value="4.9 / 5.0" icon={Star} />
      </div>

      {/* Incoming Requests Lead Queue */}
      <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-6 border border-charcoal/10 dark:border-dark-border space-y-4 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-charcoal dark:text-dark-text flex items-center gap-2">
            Incoming Job Dispatches
            <span className="text-xs font-sans font-bold bg-olive-100 dark:bg-olive-900/50 text-olive-800 dark:text-olive-300 px-2 py-0.5 rounded-full">
              Live
            </span>
          </h2>
        </div>

        {requests.length === 0 ? (
          <p className="text-sm text-charcoal/50 dark:text-dark-muted py-6 text-center">
            No pending requests. Your profile is active for new leads!
          </p>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => (
              <motion.div
                layout
                key={r.id}
                className="bg-cream dark:bg-dark-surface rounded-2xl p-4 border border-charcoal/10 dark:border-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-charcoal dark:text-dark-text">{r.title}</h3>
                    {r.emergency && (
                      <span className="text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Zap size={11} /> SOS Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-0.5">
                    Customer: <strong>{r.customer}</strong> · {r.location} · {r.time}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-charcoal/5 dark:border-dark-border">
                  <span className="font-display font-bold text-base text-olive-800 dark:text-olive-300">
                    {r.fee}
                  </span>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      onClick={() => handleAction(r.id, "accept")}
                      className="text-xs py-1.5 px-3 bg-olive-700 text-cream"
                    >
                      <CheckCircle size={14} /> Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(r.id, "decline")}
                      className="text-xs py-1.5 px-3"
                    >
                      <XCircle size={14} /> Decline
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Earnings & Instant Payout card */}
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6">
        <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-6 border border-charcoal/10 dark:border-dark-border">
          <h2 className="font-display text-xl text-charcoal dark:text-dark-text mb-6">
            Income Trend (Last 6 Months)
          </h2>
          <div className="flex items-end gap-4 h-40">
            {earningsByMonth.map((val, i) => (
              <div key={months[i]} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(val / maxEarning) * 100}%` }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full rounded-t-lg bg-olive-600 dark:bg-olive-500"
                  style={{ minHeight: 4 }}
                />
                <span className="text-xs text-charcoal/50 dark:text-dark-muted">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-6 border border-charcoal/10 dark:border-dark-border flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-olive-800 dark:text-olive-300">
              Direct Payout Ledger
            </span>
            <h3 className="font-display text-2xl text-charcoal dark:text-dark-text mt-1">₹4,250.00</h3>
            <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-1">
              Available balance ready for instant transfer to Bank / UPI (Aadhaar Seeded).
            </p>
          </div>

          <div className="bg-cream dark:bg-dark-surface p-3 rounded-2xl border border-charcoal/10 dark:border-dark-border text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-charcoal/60 dark:text-dark-muted">Linked Account:</span>
              <span className="font-semibold text-charcoal dark:text-dark-text">SBI ···· 4821</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal/60 dark:text-dark-muted">Transfer Fee:</span>
              <span className="font-bold text-emerald-600">₹0 (Free)</span>
            </div>
          </div>

          <Button
            onClick={() => setWithdrawn(true)}
            disabled={withdrawn}
            className="w-full text-xs py-3"
          >
            {withdrawn ? "✓ Withdrawal Queued to Bank" : "Withdraw Payout Now"}
          </Button>
        </div>
      </div>
    </div>
  );
}
