import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, Clock, IndianRupee, FileText, CheckCircle2 } from "lucide-react";
import Button from "../ui/Button";

export default function BookingDetailsModal({ isOpen, onClose, booking }) {
  if (!isOpen || !booking) return null;

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
          className="relative w-full max-w-lg bg-cream rounded-3xl shadow-xl border border-charcoal/10 overflow-hidden flex flex-col z-10 max-h-[90vh]"
        >
          <div className="bg-olive-950 text-cream p-5 flex items-center justify-between sticky top-0 z-10">
            <h3 className="font-display text-lg font-medium">Booking Details</h3>
            <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto">
            {/* Header Info */}
            <div className="flex items-start gap-4 mb-6 border-b border-charcoal/10 pb-6">
              <img
                src={booking.image || "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=200&q=80"}
                alt={booking.title}
                className="w-20 h-20 rounded-2xl object-cover border border-charcoal/10 shrink-0 shadow-xs"
              />
              <div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-olive-100 text-olive-800 mb-2 inline-block">
                  {booking.category}
                </span>
                <h2 className="text-xl font-display font-bold text-charcoal">{booking.title}</h2>
                <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full w-fit mt-1 text-xs font-bold">
                  <CheckCircle2 size={12} />
                  <span>Status: {booking.status}</span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-2xl border border-charcoal/5">
                <div className="flex items-center gap-2 text-charcoal/60 mb-1">
                  <Calendar size={14} />
                  <span className="text-xs font-bold uppercase tracking-wider">Scheduled For</span>
                </div>
                <p className="text-sm font-medium text-charcoal">{booking.dateTime}</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-charcoal/5">
                <div className="flex items-center gap-2 text-charcoal/60 mb-1">
                  <IndianRupee size={14} />
                  <span className="text-xs font-bold uppercase tracking-wider">Amount</span>
                </div>
                <p className="text-sm font-medium text-charcoal font-display">{booking.price || "N/A"}</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-charcoal/5 sm:col-span-2">
                <div className="flex items-center gap-2 text-charcoal/60 mb-1">
                  <MapPin size={14} />
                  <span className="text-xs font-bold uppercase tracking-wider">Location</span>
                </div>
                <p className="text-sm font-medium text-charcoal">{booking.address || booking.details}</p>
              </div>

              {booking.notes && (
                <div className="bg-white p-4 rounded-2xl border border-charcoal/5 sm:col-span-2">
                  <div className="flex items-center gap-2 text-charcoal/60 mb-1">
                    <FileText size={14} />
                    <span className="text-xs font-bold uppercase tracking-wider">Additional Notes</span>
                  </div>
                  <p className="text-sm font-medium text-charcoal">{booking.notes}</p>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              fullWidth
              onClick={onClose}
            >
              Close Details
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
