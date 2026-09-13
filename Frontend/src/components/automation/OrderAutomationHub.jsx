import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Sparkles, CheckCircle2, Loader2, Mail, PhoneCall,
  FileText, UserCheck, RefreshCw
} from "lucide-react";
import api from "../../utils/api";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { useLanguage } from "../../hooks/useLanguage";
import ConfirmationCallModal from "./ConfirmationCallModal";
import ReceiptModal from "./ReceiptModal";

export default function OrderAutomationHub({
  initialOrderId: _initialOrderId = null,
  initialOrderPayload = null,
  autoStart = false,
  onComplete,
}) {
  const { user } = useAuth();
  const toast = useToast();
  const { current: appLanguage } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0: Idle, 1: User Verified, 2: Receipt Formatted, 3: Email Delivered, 4: Call Triggered
  const [automationResult, setAutomationResult] = useState(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [sessionDetails, setSessionDetails] = useState(null);

  const fetchSession = useCallback(async () => {
    try {
      const res = await api.get("/automation/session");
      if (res.data?.success) {
        setSessionDetails(res.data);
      }
    } catch {
      setSessionDetails({
        user: {
          name: user?.name || "Valued Customer",
          email: user?.email || "customer@karya.in",
          phone: user?.phone || "+91 98765 43210",
        },
      });
    }
  }, [user]);

  // Fetch backend session details on mount
  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  useEffect(() => {
    if (autoStart && !automationResult && !loading) {
      runAutomation(initialOrderPayload);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  const runAutomation = async (customPayload = null) => {
    setLoading(true);
    setCurrentStep(1); // Step 1: User Detection

    try {
      // Allow realistic step animation delay
      await new Promise((r) => setTimeout(r, 600));

      const payload = customPayload || initialOrderPayload || {
        customerEmail: user?.email || sessionDetails?.user?.email || "customer@karya.in",
        customerName: user?.name || sessionDetails?.user?.name || "Valued Customer",
        customerPhone: user?.phone || sessionDetails?.user?.phone || "+91 98765 43210",
        items: [
          {
            name: "Submersible Pump Wiring & Motor Overhaul",
            category: "Electrical Maintenance",
            quantity: 1,
            price: 650,
          },
        ],
        amountPaid: 650,
        paymentMethod: "upi",
        isService: true,
        customArrivalDetails: {
          providerName: "Ramesh Kumar (Verified Electrician)",
          providerPhone: "+91 98234 56789",
          serviceName: "Submersible Pump Wiring & Overhaul",
          arrivalWindow: "Today at 03:30 PM (Within 45 mins)",
          address: "Ward #4, Near Panchayat Bhavan, Rampur",
        },
      };

      setCurrentStep(2); // Step 2: Receipt & Thank You generator
      await new Promise((r) => setTimeout(r, 700));

      // Reaching into backend /api/automation/trigger
      // The confirmation call speaks the user's app language by default.
      const response = await api.post("/automation/trigger", {
        ...payload,
        callLanguage: appLanguage,
      });

      if (response.data?.success) {
        setAutomationResult(response.data);
        setCurrentStep(3); // Step 3: Email delivered

        toast.success(`Receipt & Thank-You note emailed to ${response.data.stepSummary.userIdentified.email}`);
        await new Promise((r) => setTimeout(r, 800));

        setCurrentStep(4); // Step 4: Call triggered
        // Automatically pop open the incoming confirmation call
        setIsCallModalOpen(true);

        if (onComplete) onComplete(response.data);
      } else {
        throw new Error(response.data?.message || "Failed automation trigger");
      }
    } catch (err) {
      console.error("Automation error:", err);
      toast.error(err.response?.data?.message || "Automation process encountered an issue");
    } finally {
      setLoading(false);
    }
  };

  const activeEmail =
    automationResult?.stepSummary?.userIdentified?.email ||
    user?.email ||
    sessionDetails?.user?.email ||
    "customer@karya.in";

  const steps = [
    {
      id: 1,
      title: "Backend User Identified",
      desc: `Detected email: ${activeEmail}`,
      icon: UserCheck,
    },
    {
      id: 2,
      title: "Itemized Receipt & Thank You Note",
      desc: "Built digital slip with items, total, and gratitude note",
      icon: FileText,
    },
    {
      id: 3,
      title: "Thank You Note & Receipt Delivered",
      desc: `Dispatched directly to ${activeEmail}`,
      icon: Mail,
    },
    {
      id: 4,
      title: "Automated Confirmation Call",
      desc: "Phone verification with service arrival timing",
      icon: PhoneCall,
    },
  ];

  return (
    <div className="bg-cream-card dark:bg-dark-surface rounded-3xl p-6 sm:p-8 border border-charcoal/10 dark:border-dark-border shadow-md space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal/10 dark:border-dark-border pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-olive-100 dark:bg-olive-900/40 text-olive-700 dark:text-olive-300 flex items-center justify-center">
            <Sparkles size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-xl font-bold text-charcoal dark:text-dark-text">
                Order Automation & Dispatch System
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300">
                Live Engine
              </span>
            </div>
            <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-0.5">
              Reaches into backend session, emails digital receipt & thank-you note, and triggers arrival confirmation call.
            </p>
          </div>
        </div>

        <button
          onClick={() => runAutomation()}
          disabled={loading}
          className="py-2.5 px-4 bg-olive-700 hover:bg-olive-800 disabled:opacity-50 text-cream rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Processing Automation...
            </>
          ) : (
            <>
              <RefreshCw size={15} /> Run Automation Test
            </>
          )}
        </button>
      </div>

      {/* 4-Step Visual Automation Pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step) => {
          const Icon = step.icon;
          const isDone = currentStep >= step.id;
          const isCurrent = currentStep === step.id && loading;

          return (
            <motion.div
              key={step.id}
              layout
              className={`p-4 rounded-2xl border transition-all ${
                isDone
                  ? "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                  : isCurrent
                  ? "bg-olive-50 dark:bg-olive-950/30 border-olive-500/40 text-charcoal dark:text-dark-text animate-pulse"
                  : "bg-cream dark:bg-dark-bg border-charcoal/10 dark:border-dark-border text-charcoal/50 dark:text-dark-muted"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isDone
                      ? "bg-emerald-500 text-white"
                      : "bg-charcoal/10 dark:bg-white/10 text-charcoal/70 dark:text-dark-text"
                  }`}
                >
                  <Icon size={16} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Step {step.id}
                </span>
              </div>
              <h4 className="font-semibold text-xs text-charcoal dark:text-dark-text mb-1">
                {step.title}
              </h4>
              <p className="text-[11px] leading-relaxed opacity-80">
                {step.desc}
              </p>
              {isDone && (
                <div className="mt-2.5 flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 size={12} /> Complete
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Result Card & Action Buttons */}
      {automationResult && (
        <div className="p-5 bg-cream dark:bg-dark-bg rounded-2xl border border-charcoal/10 dark:border-dark-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h4 className="font-bold text-sm text-charcoal dark:text-dark-text">
                Receipt #{automationResult.receipt?.receiptNumber} Delivered
              </h4>
            </div>
            <p className="text-xs text-charcoal/60 dark:text-dark-muted">
              Thank you note delivered to <strong>{automationResult.stepSummary?.userIdentified?.email}</strong>. Service provider: <strong>{automationResult.voiceCall?.providerArrivalDetails?.providerName}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => setIsReceiptModalOpen(true)}
              className="flex-1 sm:flex-initial py-2 px-3.5 bg-cream-card dark:bg-dark-surface border border-charcoal/15 dark:border-dark-border rounded-xl text-xs font-semibold text-charcoal dark:text-dark-text hover:bg-olive-50 dark:hover:bg-white/5 flex items-center justify-center gap-1.5 transition-colors"
            >
              <FileText size={14} /> View Receipt Slip
            </button>
            <button
              onClick={() => setIsCallModalOpen(true)}
              className="flex-1 sm:flex-initial py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <PhoneCall size={14} /> Reopen Call
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <ConfirmationCallModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        callData={automationResult?.voiceCall}
        onCallCompleted={() => {
          toast.success("Confirmation call completed!");
        }}
      />

      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        receipt={automationResult?.receipt}
        emailDelivery={automationResult?.emailDelivery}
        arrivalDetails={automationResult?.voiceCall?.providerArrivalDetails}
        onTriggerCall={() => {
          setIsReceiptModalOpen(false);
          setIsCallModalOpen(true);
        }}
      />
    </div>
  );
}
