import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Banknote, ShieldCheck } from "lucide-react";
import Button from "../ui/Button";
import api from "../../utils/api";
import { useToast } from "../../hooks/useToast";

export default function PaymentModal({ isOpen, onClose, bookingId, amount, onSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [loading, setLoading] = useState(false);
  const [qrStep, setQrStep] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState(null);
  const [pendingPaymentId, setPendingPaymentId] = useState(null);
  const toast = useToast();

  if (!isOpen) return null;

  const handlePayment = async () => {
    if (paymentMethod === "cash") {
      setLoading(true);
      try {
        await api.post("/payments", {
          bookingId,
          paymentMethod
        });
        toast.success("Cash payment scheduled! Booking confirmed.");
        onSuccess();
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Payment initialization failed");
      } finally {
        setLoading(false);
      }
    } else {
      // Custom UPI Flow: Show QR immediately
      setQrStep(true);
    }
  };

  const handleVerifyQR = async () => {
    setLoading(true);
    try {
      const verifyRes = await api.post("/payments", {
        bookingId,
        paymentMethod: "upi"
      });
      
      if (verifyRes.data.success) {
        toast.success("Payment verified! Booking confirmed.");
        onSuccess();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to verify payment");
    } finally {
      setLoading(false);
    }
  };

  if (qrStep) {
    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm bg-cream rounded-3xl shadow-xl border border-charcoal/10 overflow-hidden flex flex-col z-10"
          >
            <div className="bg-olive-950 text-cream p-5 flex items-center justify-between">
              <h3 className="font-display text-lg font-medium">Scan to Pay</h3>
              <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-8 flex flex-col items-center text-center">
              <h2 className="text-3xl font-display font-bold text-olive-900 mb-2">₹{amount}</h2>
              <p className="text-xs text-charcoal/60 mb-6">Scan with any UPI App</p>
              
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-charcoal/10 mb-4 inline-block">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=karya@ybl&pn=Karya%20Services&am=${amount}`} 
                  alt="UPI QR Code" 
                  className="w-48 h-48"
                />
              </div>

              <div className="bg-olive-50 text-olive-800 px-4 py-2 rounded-lg border border-olive-200 mb-6 font-mono text-sm font-bold">
                karya@ybl
              </div>

              <Button
                variant="primary"
                fullWidth
                loading={loading}
                onClick={handleVerifyQR}
              >
                <ShieldCheck size={18} className="mr-2" />
                I have paid (Verify)
              </Button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm bg-cream rounded-3xl shadow-xl border border-charcoal/10 overflow-hidden flex flex-col z-10"
        >
          <div className="bg-olive-950 text-cream p-5 flex items-center justify-between">
            <h3 className="font-display text-lg font-medium">Complete Payment</h3>
            <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="p-6">
            <div className="text-center mb-6">
              <p className="text-xs text-charcoal/60 uppercase font-bold tracking-wider mb-1">Total Amount</p>
              <h2 className="text-3xl font-display font-bold text-olive-900">₹{amount}</h2>
            </div>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => setPaymentMethod("upi")}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-colors ${paymentMethod === "upi" ? "border-olive-600 bg-olive-50" : "border-charcoal/10 bg-white"}`}
              >
                <div className="w-10 h-10 rounded-full bg-olive-100 flex items-center justify-center text-olive-700">
                  <CreditCard size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-charcoal">UPI / QR Code</p>
                  <p className="text-xs text-charcoal/60">Instant transfer</p>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod("cash")}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-colors ${paymentMethod === "cash" ? "border-olive-600 bg-olive-50" : "border-charcoal/10 bg-white"}`}
              >
                <div className="w-10 h-10 rounded-full bg-olive-100 flex items-center justify-center text-olive-700">
                  <Banknote size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-charcoal">Cash on Completion</p>
                  <p className="text-xs text-charcoal/60">Pay directly to worker</p>
                </div>
              </button>
            </div>

            <Button
              variant="primary"
              fullWidth
              loading={loading}
              onClick={handlePayment}
            >
              <ShieldCheck size={18} className="mr-2" />
              Confirm Booking
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
