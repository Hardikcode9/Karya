import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, AlertTriangle, Zap, Droplets, Tractor, HeartPulse,
  PhoneCall, CheckCircle2, ShieldAlert
} from "lucide-react";
import Button from "../ui/Button";
import { useOffline } from "../../hooks/useOffline";

const emergencyCategories = [
  { id: "electric", label: "Electrical Short / Spark", icon: Zap, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-950/40" },
  { id: "plumbing", label: "Water Pipe Burst / Leak", icon: Droplets, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-950/40" },
  { id: "agri", label: "Tractor / Pump Stall", icon: Tractor, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-950/40" },
  { id: "elderly", label: "Elderly / Urgent Assistance", icon: HeartPulse, color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-950/40" },
];

export default function EmergencyModal({ isOpen, onClose }) {
  const { queueAction } = useOffline();
  const [selectedType, setSelectedType] = useState("electric");
  const [addressNote, setAddressNote] = useState("");
  const [dispatched, setDispatched] = useState(false);
  const [dispatchETA, setDispatchETA] = useState("7 mins");

  if (!isOpen) return null;

  const handleDispatch = async (e) => {
    e.preventDefault();
    const sosPayload = {
      type: "EMERGENCY_SOS",
      category: selectedType,
      note: addressNote,
      timestamp: new Date().toISOString(),
      priority: "CRITICAL",
    };
    await queueAction(sosPayload);
    setDispatchETA(`${Math.floor(5 + Math.random() * 8)} mins`);
    setDispatched(true);
  };

  const resetAndClose = () => {
    setDispatched(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={resetAndClose}
          className="fixed inset-0 bg-rose-950/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-lg bg-cream dark:bg-dark-bg rounded-[2.5rem] shadow-2xl border-2 border-rose-500/40 overflow-hidden flex flex-col z-10 my-8"
        >
          {/* Siren Header */}
          <div className="bg-rose-900 text-white p-5 sm:p-6 flex items-center justify-between relative overflow-hidden">
            <div className="flex items-center gap-3 relative z-10">
              <span className="w-12 h-12 rounded-2xl bg-rose-700 flex items-center justify-center animate-pulse">
                <ShieldAlert size={24} className="text-white" />
              </span>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-rose-800 px-2 py-0.5 rounded-full">
                  Priority SOS
                </span>
                <h3 className="font-display text-xl sm:text-2xl mt-0.5">
                  1-Click Emergency Dispatch
                </h3>
              </div>
            </div>
            <button
              onClick={resetAndClose}
              className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors z-10"
            >
              <X size={20} />
            </button>
          </div>

          {dispatched ? (
            <div className="p-8 text-center flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center animate-bounce">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="font-display text-2xl text-charcoal dark:text-dark-text">
                SOS Dispatched!
              </h3>
              <p className="text-sm text-charcoal/70 dark:text-dark-muted max-w-sm">
                The nearest verified rapid-response specialist has been alerted and is navigating to your location.
              </p>

              <div className="w-full bg-rose-50 dark:bg-dark-card border border-rose-200 dark:border-rose-900/40 rounded-2xl p-4 text-left space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-charcoal/60 dark:text-dark-muted">Estimated Arrival:</span>
                  <span className="font-bold text-rose-700 dark:text-rose-400 text-sm">{dispatchETA}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-charcoal/60 dark:text-dark-muted">Assigned Specialist:</span>
                  <span className="font-semibold text-charcoal dark:text-dark-text">Ramesh Kumar (Electrician)</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-charcoal/60 dark:text-dark-muted">Helpline Hotline:</span>
                  <span className="font-semibold text-olive-800 dark:text-olive-300">1800-KARYA-SOS</span>
                </div>
              </div>

              <div className="flex gap-2 w-full pt-2">
                <Button variant="outline" className="flex-1 text-xs">
                  <PhoneCall size={14} /> Call Specialist
                </Button>
                <Button onClick={resetAndClose} className="flex-1 text-xs">
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleDispatch} className="p-5 sm:p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 dark:text-dark-muted mb-2">
                  Select Emergency Type
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {emergencyCategories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedType(cat.id)}
                        className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                          selectedType === cat.id
                            ? "bg-rose-500 text-white border-rose-500 shadow-md scale-[1.02]"
                            : "bg-cream-card dark:bg-dark-card border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text hover:border-rose-400"
                        }`}
                      >
                        <span className={`p-2 rounded-xl shrink-0 ${selectedType === cat.id ? "bg-white/20 text-white" : cat.bg + " " + cat.color}`}>
                          <Icon size={16} />
                        </span>
                        <div>
                          <h4 className="font-semibold text-xs leading-tight">{cat.label}</h4>
                          <span className="text-[10px] opacity-75">Priority response</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 dark:text-dark-muted mb-1.5">
                  Location / Specific Hazard Notes
                </label>
                <textarea
                  value={addressNote}
                  onChange={(e) => setAddressNote(e.target.value)}
                  placeholder="e.g. Main switch sparking behind grain warehouse..."
                  rows={2}
                  className="w-full bg-cream-card dark:bg-dark-card border border-charcoal/15 dark:border-dark-border rounded-2xl p-3 text-xs outline-none focus:border-rose-500 transition-colors dark:text-dark-text"
                />
              </div>

              <div className="bg-rose-100/70 dark:bg-rose-950/40 rounded-2xl p-3.5 flex items-center gap-3 border border-rose-300 dark:border-rose-900/50">
                <AlertTriangle size={20} className="text-rose-600 shrink-0" />
                <p className="text-xs text-rose-950 dark:text-rose-200 leading-snug">
                  Emergency dispatch triggers instant SMS & WhatsApp notifications to verified on-duty workers within 5km.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white border-none shadow-lg text-sm font-bold"
              >
                🚨 Trigger Immediate SOS Dispatch
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
