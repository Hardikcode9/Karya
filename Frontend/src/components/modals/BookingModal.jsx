import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
import Button from "../ui/Button";
import { useOffline } from "../../hooks/useOffline";
import { useAuth } from "../../hooks/useAuth";
import api from "../../utils/api";

export default function BookingModal({ isOpen, onClose, targetItem }) {
  const { queueAction, isOnline } = useOffline();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState("Today, Immediate");
  const [selectedSlot, setSelectedSlot] = useState("Morning (9-12)");
  const [units, setUnits] = useState(1);
  const [notes, setNotes] = useState("");
  const [address, setAddress] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !targetItem) return null;

  const basePrice = targetItem.price || 350;
  const priceUnit = targetItem.priceUnit || "day";
  const totalAmount = basePrice * units;
  const serviceFee = 25;
  const grandTotal = totalAmount + serviceFee;

  // Convert the UI date/slot selections into a real ISO scheduledDate
  const computeScheduledDate = () => {
    const now = new Date();
    const date = new Date(now);

    if (selectedDate === "Tomorrow") {
      date.setDate(date.getDate() + 1);
    } else if (selectedDate === "Within 3 Days") {
      date.setDate(date.getDate() + 3);
    } else if (selectedDate === "Choose Custom") {
      date.setDate(date.getDate() + 2);
    }
    // "Today, Immediate" → keep today

    // Set time based on slot
    if (selectedSlot.includes("9") || selectedSlot.toLowerCase().includes("morning")) {
      date.setHours(9, 0, 0, 0);
    } else if (selectedSlot.includes("1") || selectedSlot.toLowerCase().includes("afternoon")) {
      date.setHours(13, 0, 0, 0);
    } else if (selectedSlot.includes("4") || selectedSlot.toLowerCase().includes("evening")) {
      date.setHours(16, 0, 0, 0);
    } else {
      date.setHours(10, 0, 0, 0);
    }

    // If the computed date/time is in the past, push to tomorrow
    if (date <= now) {
      date.setDate(date.getDate() + 1);
    }

    return date.toISOString();
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const scheduledDate = computeScheduledDate();
    const duration = Math.max(units * 60, 15); // minutes, min 15
    const bookingAddress = address.trim() || notes.trim() || targetItem.village || "Local Area";

    // Build the backend-compatible payload
    const backendPayload = {
      worker: targetItem.id,
      service: targetItem.serviceId,
      scheduledDate,
      duration,
      address: bookingAddress,
      notes: notes.trim() || `Booking for ${targetItem.name} - ${targetItem.role}`,
    };

    if (isOnline && user) {
      try {
        // Directly call the backend API
        await api.post("/bookings", backendPayload);
        setConfirmed(true);
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to create booking. Please try again.";
        console.error("Booking API Error:", err.response?.data || err.message);
        setError(msg);
      }
    } else {
      // Offline fallback: queue for later sync with the correct payload shape
      await queueAction({
        type: "BOOKING_CREATED",
        ...backendPayload,
      });
      setConfirmed(true);
    }

    setLoading(false);
  };

  const resetAndClose = () => {
    setConfirmed(false);
    setError("");
    setAddress("");
    setNotes("");
    setUnits(1);
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
          className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-lg bg-cream rounded-[2.5rem] shadow-2xl border border-charcoal/10 overflow-hidden flex flex-col z-10 my-8"
        >
          {/* Header */}
          <div className="bg-olive-950 text-cream p-5 sm:p-6 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-olive-300">
                Direct Booking & Request
              </span>
              <h3 className="font-display text-xl text-cream mt-0.5">
                {targetItem.name}
              </h3>
              <p className="text-xs text-cream/70 flex items-center gap-1 mt-0.5">
                <MapPin size={12} /> {targetItem.village || "Local Area"} · {targetItem.role || "Specialist"}
              </p>
            </div>
            <button
              onClick={resetAndClose}
              className="p-2 text-cream/70 hover:text-cream rounded-full hover:bg-cream/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {confirmed ? (
            <div className="p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-olive-100 text-olive-700 flex items-center justify-center mb-4 animate-bounce">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="font-display text-2xl text-charcoal mb-2">Booking Confirmed!</h3>
              <p className="text-sm text-charcoal/70 max-w-sm mb-6">
                Your request has been shared with <strong className="text-charcoal">{targetItem.name}</strong>.
                {!isOnline && " You are currently offline, so this booking is saved safely on your device and will sync automatically."}
              </p>
              <div className="w-full bg-cream-card rounded-2xl p-4 border border-charcoal/10 text-left text-xs space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Date & Slot:</span>
                  <span className="font-semibold text-charcoal">{selectedDate} ({selectedSlot})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Estimated Total:</span>
                  <span className="font-semibold text-olive-800">₹{grandTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Payment Mode:</span>
                  <span className="font-semibold uppercase text-charcoal">Pay on Completion (Cash/UPI)</span>
                </div>
              </div>
              <Button onClick={resetAndClose} className="w-full">
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleConfirmBooking} className="p-5 sm:p-6 space-y-5">
              {/* Error display */}
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-xs">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Date & Slot selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-2">
                  Select Preferred Day
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["Today, Immediate", "Tomorrow", "Within 3 Days", "Choose Custom"].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDate(d)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition-all ${
                        selectedDate === d
                          ? "bg-olive-700 text-cream border-olive-700 shadow-sm"
                          : "bg-cream-card border-charcoal/10 text-charcoal/80 hover:border-olive-400"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slot */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-2">
                  Time Slot
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    "Morning (9-12)",
                    "Afternoon (1-4)",
                    "Evening (4-7)",
                  ].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSlot(s)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                        selectedSlot === s
                          ? "bg-olive-700 text-cream border-olive-700 shadow-sm"
                          : "bg-cream-card border-charcoal/10 text-charcoal/80 hover:border-olive-400"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity / Duration */}
              <div className="flex items-center justify-between bg-cream-card p-3.5 rounded-2xl border border-charcoal/10">
                <div>
                  <h4 className="text-sm font-semibold text-charcoal">Duration / Quantity</h4>
                  <p className="text-xs text-charcoal/60">Billed per {priceUnit}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setUnits(Math.max(1, units - 1))}
                    className="w-8 h-8 rounded-full bg-ivory border border-charcoal/15 flex items-center justify-center font-bold text-charcoal hover:bg-olive-100"
                  >
                    -
                  </button>
                  <span className="font-semibold text-sm w-4 text-center">{units}</span>
                  <button
                    type="button"
                    onClick={() => setUnits(units + 1)}
                    className="w-8 h-8 rounded-full bg-ivory border border-charcoal/15 flex items-center justify-center font-bold text-charcoal hover:bg-olive-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Address input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-1.5">
                  Service Address
                </label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. House #42, Rampur Village, Near Temple..."
                  className="w-full bg-cream-card border border-charcoal/15 rounded-2xl p-3 text-xs outline-none focus:border-olive-600 transition-colors"
                />
              </div>

              {/* Notes input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-1.5">
                  Job Description / Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Need wiring check in kitchen, leaking tap in bathroom..."
                  rows={2}
                  className="w-full bg-cream-card border border-charcoal/15 rounded-2xl p-3 text-xs outline-none focus:border-olive-600 transition-colors"
                />
              </div>

              {/* Price Breakdown */}
              <div className="bg-ivory/60 rounded-2xl p-3.5 space-y-1.5 text-xs">
                <div className="flex justify-between text-charcoal/70">
                  <span>Base Rate (₹{basePrice} × {units} {priceUnit})</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-charcoal/70">
                  <span>Platform & Verification Fee</span>
                  <span>₹{serviceFee}</span>
                </div>
                <div className="border-t border-charcoal/10 pt-1.5 flex justify-between font-bold text-sm text-charcoal">
                  <span>Total Payable</span>
                  <span className="text-olive-800">₹{grandTotal}</span>
                </div>
              </div>

              {/* Action button */}
              <Button type="submit" className="w-full py-3 text-sm" loading={loading}>
                Confirm & Request Booking
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
