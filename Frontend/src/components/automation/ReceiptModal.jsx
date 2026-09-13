import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Printer, CheckCircle2, Mail,
  Heart, X, PhoneCall, Calendar, MapPin, User
} from "lucide-react";

export default function ReceiptModal({
  isOpen,
  onClose,
  receipt,
  emailDelivery,
  arrivalDetails,
  onTriggerCall,
}) {
  const printRef = useRef(null);

  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const items = receipt.items || [
    {
      name: "Submersible Pump Wiring & Motor Overhaul",
      category: "Home Electrical",
      quantity: 1,
      price: receipt.amountPaid || 650,
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-cream-card dark:bg-dark-surface rounded-3xl shadow-2xl border border-charcoal/10 dark:border-dark-border overflow-hidden my-8"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-olive-800 to-olive-900 text-cream p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 text-cream/70 hover:text-cream rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-cream/15 flex items-center justify-center font-display text-xl font-bold text-cream">
                क
              </div>
              <div>
                <h3 className="font-display text-xl font-bold tracking-tight text-cream">
                  KARYA OFFICIAL RECEIPT
                </h3>
                <p className="text-xs text-cream/75">
                  Rural Crafts & Verified Specialist Network
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-cream/15 text-xs text-cream/80">
              <div>
                Receipt #: <span className="font-mono font-bold text-cream">{receipt.receiptNumber}</span>
              </div>
              <div>
                Date: <span className="font-medium text-cream">{receipt.date ? new Date(receipt.date).toLocaleDateString("en-IN") : "Today"}</span>
              </div>
            </div>
          </div>

          {/* Email Delivery Confirmation Pill */}
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-800/40 px-6 py-2.5 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
            <div className="flex items-center gap-2">
              <Mail size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                Delivered to customer email: <strong>{emailDelivery?.recipient || receipt.customerEmail || "customer@example.com"}</strong>
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full">
              {emailDelivery?.status === "sent" ? "Delivered" : "Simulated"}
            </span>
          </div>

          {/* Body */}
          <div ref={printRef} className="p-6 space-y-6">
            {/* Itemized Table */}
            <div className="border border-charcoal/10 dark:border-dark-border rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream dark:bg-dark-bg text-charcoal/60 dark:text-dark-muted font-bold uppercase tracking-wider border-b border-charcoal/10 dark:border-dark-border">
                  <tr>
                    <th className="p-3">Item / Service</th>
                    <th className="p-3 text-center">Category</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal/5 dark:divide-dark-border text-charcoal dark:text-dark-text">
                  {items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-charcoal/2 dark:hover:bg-white/2">
                      <td className="p-3 font-semibold">{item.name}</td>
                      <td className="p-3 text-center text-charcoal/60 dark:text-dark-muted">{item.category || "Service"}</td>
                      <td className="p-3 text-center">{item.quantity || 1}</td>
                      <td className="p-3 text-right font-bold text-olive-800 dark:text-olive-400">
                        ₹{item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-cream/50 dark:bg-dark-bg/60 border-t border-charcoal/10 dark:border-dark-border font-bold">
                  <tr>
                    <td colSpan={3} className="p-3 text-sm text-charcoal dark:text-dark-text">
                      Total Amount Paid
                    </td>
                    <td className="p-3 text-right text-base text-olive-800 dark:text-olive-300">
                      ₹{receipt.amountPaid}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Payment Meta */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-cream dark:bg-dark-bg rounded-2xl border border-charcoal/5 dark:border-dark-border text-xs text-charcoal/70 dark:text-dark-muted">
              <div>
                <span className="font-semibold text-charcoal dark:text-dark-text">Payment Mode: </span>
                <span className="uppercase font-mono">{receipt.paymentMethod || "UPI"}</span>
              </div>
              <div>
                <span className="font-semibold text-charcoal dark:text-dark-text">Status: </span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">VERIFIED & PAID</span>
              </div>
              <div className="col-span-2">
                <span className="font-semibold text-charcoal dark:text-dark-text">Ref ID: </span>
                <span className="font-mono text-[11px] text-charcoal/60 dark:text-dark-muted">
                  {receipt.transactionId || "TXN-VERIFIED"}
                </span>
              </div>
            </div>

            {/* Service Provider Arrival Card */}
            {arrivalDetails && arrivalDetails.providerName && (
              <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
                    Service Provider Arrival Notice
                  </h4>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                    Dispatched
                  </span>
                </div>
                <div className="text-xs text-charcoal/80 dark:text-dark-text space-y-1">
                  <div className="flex items-center gap-2">
                    <User size={13} className="text-emerald-700 dark:text-emerald-400" />
                    <span>Specialist: <strong>{arrivalDetails.providerName}</strong> ({arrivalDetails.providerPhone || "Verified Specialist"})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-emerald-700 dark:text-emerald-400" />
                    <span>Scheduled Arrival: <strong>{arrivalDetails.arrivalWindow || "Today within 45-60 mins"}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-charcoal/60 dark:text-dark-muted">
                    <MapPin size={13} className="text-emerald-700 dark:text-emerald-400" />
                    <span>Destination: {arrivalDetails.address || "Registered Service Address"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Thank You Note */}
            <div className="p-4 bg-olive-50/80 dark:bg-olive-950/30 rounded-2xl border border-olive-500/20 space-y-1">
              <h4 className="text-xs font-bold text-olive-900 dark:text-olive-300 flex items-center gap-1.5">
                <Heart size={13} className="text-rose-500 fill-rose-500" />
                Thank You Note from Karya
              </h4>
              <p className="text-xs text-charcoal/80 dark:text-dark-text/90 italic leading-relaxed">
                "{receipt.thankYouNote || "Thank you for empowering rural artisans and verified local tradespeople with your booking!"}"
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-5 bg-cream dark:bg-dark-bg border-t border-charcoal/10 dark:border-dark-border flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="py-2 px-3.5 bg-cream-card dark:bg-dark-surface border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text hover:bg-olive-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Printer size={14} /> Print Receipt
              </button>
              {emailDelivery?.previewUrl && (
                <a
                  href={emailDelivery.previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3.5 bg-cream-card dark:bg-dark-surface border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text hover:bg-olive-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Mail size={14} /> View Email Inbox
                </a>
              )}
            </div>

            <div className="flex items-center gap-2">
              {onTriggerCall && (
                <button
                  onClick={onTriggerCall}
                  className="py-2 px-4 bg-olive-700 hover:bg-olive-800 text-cream rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <PhoneCall size={14} /> Replay Confirmation Call
                </button>
              )}
              <button
                onClick={onClose}
                className="py-2 px-3 text-xs text-charcoal/60 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
