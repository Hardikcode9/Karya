import { useState } from "react";
import {
  Users, ShieldCheck, AlertTriangle, Activity, CheckCircle,
  XCircle, ToggleLeft, ToggleRight, Download, Cpu
} from "lucide-react";
import DashStat from "../../components/ui/DashStat";
import Button from "../../components/ui/Button";

export default function AdminDashboard() {
  const [verifications, setVerifications] = useState([
    { id: "v1", name: "Surya Handicrafts SHG", type: "SHG Group", village: "Devgaon", doc: "Cluster Registration #MH-881", status: "pending" },
    { id: "v2", name: "Mahesh Patil", type: "Electrician", village: "Devgaon", doc: "ITI Wireman Certificate", status: "pending" },
    { id: "v3", name: "Pooja Sharma", type: "Stitching Artisan", village: "Rampur", doc: "Aadhaar e-KYC", status: "pending" },
  ]);

  const [toggles, setToggles] = useState({
    emergencySMS: true,
    autoMatching: true,
    offlineCache: true,
  });

  const handleVerify = (id, newStatus) => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v))
    );
  };

  const toggleSwitch = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const verifiedWorkersCount = 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl text-charcoal dark:text-dark-text">
              Super Admin Console
            </h1>
            <span className="text-[10px] font-bold uppercase bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 px-2.5 py-0.5 rounded-full">
              Platform Level 1
            </span>
          </div>
          <p className="text-charcoal/55 dark:text-dark-muted text-sm mt-1">
            District governance, security compliance & KYC approvals.
          </p>
        </div>

        <Button size="sm" variant="outline" className="text-xs">
          <Download size={14} /> Export Governance Audit
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashStat label="Registered Users" value="2,850+" icon={Users} />
        <DashStat label="Verified Specialists" value={`${verifiedWorkersCount}/0`} icon={ShieldCheck} />
        <DashStat label="Open Complaints" value="2" icon={AlertTriangle} />
        <DashStat label="Jobs Completed (WTD)" value="412" icon={Activity} />
      </div>

      {/* Verification Desk */}
      <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-6 border border-charcoal/10 dark:border-dark-border space-y-4 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-charcoal dark:text-dark-text">
            KYC & Trade Skill Verification Queue
          </h2>
          <span className="text-xs font-semibold text-olive-800 dark:text-olive-300">
            {verifications.filter((v) => v.status === "pending").length} Pending Review
          </span>
        </div>

        <div className="divide-y divide-charcoal/5 dark:divide-dark-border">
          {verifications.map((p) => (
            <div key={p.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-charcoal dark:text-dark-text">{p.name}</p>
                  <span className="text-[10px] uppercase font-bold bg-olive-100 dark:bg-olive-900/40 text-olive-800 dark:text-olive-300 px-2 py-0.5 rounded-full">
                    {p.type}
                  </span>
                </div>
                <p className="text-xs text-charcoal/55 dark:text-dark-muted mt-0.5">
                  {p.village} · Document: <strong>{p.doc}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                {p.status === "approved" ? (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle size={14} /> Approved
                  </span>
                ) : p.status === "rejected" ? (
                  <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                    <XCircle size={14} /> Rejected
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => handleVerify(p.id, "approved")}
                      className="text-xs px-3.5 py-1.5 rounded-xl bg-olive-700 text-cream hover:bg-olive-800 font-medium transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleVerify(p.id, "rejected")}
                      className="text-xs px-3.5 py-1.5 rounded-xl border border-charcoal/15 dark:border-dark-border text-charcoal/70 dark:text-dark-muted hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform System Switches & SHG Federation Snapshot */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* System Switches */}
        <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-6 border border-charcoal/10 dark:border-dark-border space-y-4">
          <div className="flex items-center gap-2">
            <Cpu size={18} className="text-olive-700 dark:text-olive-400" />
            <h2 className="font-display text-lg text-charcoal dark:text-dark-text">
              Platform Master Controls
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-cream dark:bg-dark-surface rounded-2xl border border-charcoal/10 dark:border-dark-border">
              <div>
                <h4 className="font-semibold text-charcoal dark:text-dark-text">Emergency SOS SMS Gateway</h4>
                <p className="text-[11px] text-charcoal/50 dark:text-dark-muted">Automated SMS dispatch to local panchayat units</p>
              </div>
              <button onClick={() => toggleSwitch("emergencySMS")} className="text-olive-700 dark:text-olive-400">
                {toggles.emergencySMS ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-charcoal/30" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-cream dark:bg-dark-surface rounded-2xl border border-charcoal/10 dark:border-dark-border">
              <div>
                <h4 className="font-semibold text-charcoal dark:text-dark-text">AI Voice & Smart Matching</h4>
                <p className="text-[11px] text-charcoal/50 dark:text-dark-muted">Weighted algorithm & multilingual voice agent</p>
              </div>
              <button onClick={() => toggleSwitch("autoMatching")} className="text-olive-700 dark:text-olive-400">
                {toggles.autoMatching ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-charcoal/30" />}
              </button>
            </div>
          </div>
        </div>

        {/* SHG Federation Overview */}
        <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-6 border border-charcoal/10 dark:border-dark-border space-y-4">
          <h2 className="font-display text-lg text-charcoal dark:text-dark-text">
            Active SHG Clusters
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {shgs.map((s) => (
              <div key={s.id} className="bg-cream dark:bg-dark-surface rounded-2xl p-3.5 border border-charcoal/10 dark:border-dark-border">
                <p className="text-xs font-semibold text-charcoal dark:text-dark-text truncate">{s.name}</p>
                <p className="text-[11px] text-charcoal/55 dark:text-dark-muted mt-0.5">{s.members} members · {s.orders} orders</p>
                <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-olive-100 dark:bg-olive-900/40 text-olive-800 dark:text-olive-300">
                  Verified Federation
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
