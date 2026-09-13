import { useState, useEffect } from "react";
import {
  Sliders, Globe2, ShieldCheck, Database, Radio, BellRing,
  Cpu, HardDrive, RefreshCw, Download, CheckCircle2, AlertTriangle,
  ToggleLeft, ToggleRight, Sparkles, Send, Layers, Check
} from "lucide-react";
import { useToast } from "../hooks/useToast";

const STORAGE_KEY = "karya_admin_others_v1";

const INITIAL_SETTINGS = {
  emergencySMS: true,
  autoMatching: true,
  offlineCache: true,
  zeroCommissionPledge: true,
  weatherAlerts: true,
  maxRadiusKm: 25,
  minReviewScoreToAutoApprove: 4.5,
  defaultLanguage: "hi",
};

const LANGUAGES = [
  { code: "hi", name: "Hindi (हिंदी)", coverage: "100%", status: "Active Primary" },
  { code: "mr", name: "Marathi (मराठी)", coverage: "98%", status: "Active Primary" },
  { code: "gu", name: "Gujarati (ગુજરાતી)", coverage: "95%", status: "Active" },
  { code: "bn", name: "Bengali (বাংলা)", coverage: "94%", status: "Active" },
  { code: "te", name: "Telugu (తెలుగు)", coverage: "92%", status: "Active" },
  { code: "ta", name: "Tamil (தமிழ்)", coverage: "91%", status: "Active" },
  { code: "en", name: "English", coverage: "100%", status: "Active Fallback" },
];

export default function AdminOthers() {
  const toast = useToast();

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastTarget, setBroadcastTarget] = useState("all_workers");
  const [broadcastVillage, setBroadcastVillage] = useState("all_villages");

  const toggleSwitch = (key) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      toast.info(`Setting "${key}" updated.`);
      return next;
    });
  };

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) {
      toast.error("Please enter broadcast alert text");
      return;
    }
    toast.success(`District broadcast sent to ${broadcastTarget.replace("_", " ")} in ${broadcastVillage}!`);
    setBroadcastMessage("");
  };

  const handleBackupDatabase = () => {
    toast.info("Preparing platform snapshot...");
    setTimeout(() => {
      const snapshot = {
        exportedAt: new Date().toISOString(),
        system: "Karya Rural Platform Admin Console",
        settings,
        languages: LANGUAGES,
      };
      const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `karya_backup_${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Database configuration backup downloaded!");
    }, 600);
  };

  const handleFlushCache = () => {
    toast.info("Flushing offline caching layer...");
    setTimeout(() => {
      toast.success("Redis & IndexedDB local caches synchronized with central cloud ledger!");
    }, 700);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl sm:text-3xl text-charcoal dark:text-dark-text font-bold">
              System Configuration &amp; Others
            </h1>
            <span className="text-xs font-bold uppercase tracking-wider bg-olive-100 dark:bg-olive-900/40 text-olive-800 dark:text-olive-300 px-3 py-0.5 rounded-full border border-olive-300/40">
              Platform Controls
            </span>
          </div>
          <p className="text-charcoal/65 dark:text-dark-muted text-xs sm:text-sm mt-1">
            Regional language dictionaries, SMS broadcasts, algorithmic matching radius &amp; cloud data sync.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleFlushCache}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-dark-card border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text hover:border-olive-600 transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Flush Cache</span>
          </button>
          <button
            type="button"
            onClick={handleBackupDatabase}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-olive-700 hover:bg-olive-800 text-white transition-colors shadow-xs cursor-pointer"
          >
            <Download size={14} />
            <span>Export Snapshot</span>
          </button>
        </div>
      </div>

      {/* 2. Platform Gateway Toggles */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-cream-card dark:bg-dark-card p-5 rounded-2xl border border-charcoal/10 dark:border-dark-border space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-charcoal/10 dark:border-dark-border">
            <Cpu size={18} className="text-olive-700 dark:text-olive-400" />
            <h2 className="font-display font-bold text-base text-charcoal dark:text-dark-text">
              Platform Gateways &amp; Policies
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border">
              <div>
                <p className="font-bold text-charcoal dark:text-dark-text">Emergency SMS Failover</p>
                <p className="text-[11px] text-charcoal/55 dark:text-dark-muted mt-0.5">
                  Fallback to GSM SMS when village 4G connectivity drops below 2G
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleSwitch("emergencySMS")}
                className="text-olive-700 dark:text-olive-400 cursor-pointer text-xl"
              >
                {settings.emergencySMS ? <ToggleRight size={32} className="text-olive-700" /> : <ToggleLeft size={32} className="text-charcoal/40" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border">
              <div>
                <p className="font-bold text-charcoal dark:text-dark-text">AI Proximity Match Engine</p>
                <p className="text-[11px] text-charcoal/55 dark:text-dark-muted mt-0.5">
                  Route customer jobs to verified specialists within 15-25km radius
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleSwitch("autoMatching")}
                className="text-olive-700 dark:text-olive-400 cursor-pointer text-xl"
              >
                {settings.autoMatching ? <ToggleRight size={32} className="text-olive-700" /> : <ToggleLeft size={32} className="text-charcoal/40" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border">
              <div>
                <p className="font-bold text-charcoal dark:text-dark-text">IndexedDB Offline Cache</p>
                <p className="text-[11px] text-charcoal/55 dark:text-dark-muted mt-0.5">
                  Keep service catalog and customer contacts browsable offline
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleSwitch("offlineCache")}
                className="text-olive-700 dark:text-olive-400 cursor-pointer text-xl"
              >
                {settings.offlineCache ? <ToggleRight size={32} className="text-olive-700" /> : <ToggleLeft size={32} className="text-charcoal/40" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/40">
              <div>
                <p className="font-bold text-emerald-900 dark:text-emerald-200">Zero Commission Policy Lock</p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                  Guarantees 100% direct payouts with zero platform take rate
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-600 text-white">
                Locked 0%
              </span>
            </div>
          </div>
        </div>

        {/* 3. Emergency Village Broadcast Radio */}
        <div className="bg-cream-card dark:bg-dark-card p-5 rounded-2xl border border-charcoal/10 dark:border-dark-border space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-charcoal/10 dark:border-dark-border">
            <Radio size={18} className="text-terracotta-600 dark:text-terracotta-400" />
            <h2 className="font-display font-bold text-base text-charcoal dark:text-dark-text">
              Emergency District Broadcast
            </h2>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-3 text-xs">
            <p className="text-[11px] text-charcoal/60 dark:text-dark-muted">
              Dispatch immediate SMS alerts to registered artisans regarding extreme weather, grid failures, or government subsidy drives.
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1">
                  Target Audience
                </label>
                <select
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none"
                >
                  <option value="all_workers">All Rural Workers (2,548)</option>
                  <option value="shg_leaders">SHG Leaders (354)</option>
                  <option value="all_customers">All Customers (18,420)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1">
                  Geographic Block
                </label>
                <select
                  value={broadcastVillage}
                  onChange={(e) => setBroadcastVillage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none"
                >
                  <option value="all_villages">Entire District (All Blocks)</option>
                  <option value="Devgaon Cluster">Devgaon Cluster</option>
                  <option value="Rampura Block">Rampura Block</option>
                  <option value="Sonipur Block">Sonipur Block</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-charcoal dark:text-dark-text mb-1">
                Alert Message Body (Multilingual Gateway)
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Weather Alert: Heavy rains expected in Sonipur block. Farm electrical repair calls marked non-urgent until Friday."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-terracotta-700 hover:bg-terracotta-800 text-white shadow-xs cursor-pointer"
              >
                <Send size={13} />
                <span>Broadcast Alert Now</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 4. Supported Indian Languages */}
      <div className="bg-cream-card dark:bg-dark-card p-5 rounded-2xl border border-charcoal/10 dark:border-dark-border space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center gap-2">
            <Globe2 size={18} className="text-olive-700 dark:text-olive-400" />
            <h2 className="font-display font-bold text-base text-charcoal dark:text-dark-text">
              Regional Language Coverage
            </h2>
          </div>
          <span className="text-xs font-semibold text-olive-800 dark:text-olive-300">
            7 Official Indian Locales Enabled
          </span>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {LANGUAGES.map((lang) => (
            <div
              key={lang.code}
              className="p-3.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-charcoal dark:text-dark-text">
                    {lang.name}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-charcoal/5 dark:bg-dark-card text-charcoal/60 dark:text-dark-muted">
                    {lang.code}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="w-full bg-charcoal/10 dark:bg-dark-border h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: lang.coverage }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-charcoal/60 dark:text-dark-muted">
                    {lang.coverage}
                  </span>
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[10px]">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={10} />
                  <span>{lang.status}</span>
                </span>
                <span className="text-charcoal/40 dark:text-dark-muted">Synced</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
