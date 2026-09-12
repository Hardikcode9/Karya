import { useState, useEffect } from "react";
import api from "../../utils/api";
import PaymentModal from "../../components/modals/PaymentModal";
import BookingDetailsModal from "../../components/modals/BookingDetailsModal";
import { Link } from "react-router-dom";
import {
  Activity, ShoppingBag, Wrench, Star, Clock, CheckCircle2,
  Calendar, ArrowRight, Filter, Sparkles, MapPin, ExternalLink
} from "lucide-react";
import Button from "../../components/ui/Button";

export default function CustomerActivity() {
  const [filter, setFilter] = useState("all");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaymentBooking, setSelectedPaymentBooking] = useState(null);
  const [selectedDetailsBooking, setSelectedDetailsBooking] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/bookings/customer');
      if (response.data?.bookings) {
        const formatted = response.data.bookings.map(b => ({
          id: b._id,
          type: "service",
          category: b.service?.category || "Service Booking",
          status: b.status,
          title: b.service?.name || "Service Booking",
          price: b.price ? `₹${b.price}` : "",
          rawPrice: b.price ? `₹${b.price}` : "",
          dateTime: new Date(b.scheduledDate).toLocaleString("en-IN"),
          image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=200&q=80",
          details: `Booking for ${new Date(b.scheduledDate).toLocaleDateString()} at ${b.address}`,
          address: b.address,
          notes: b.notes,
          to: "/services",
          actionLabel: b.status === "accepted" ? "Worker Approved - Pay Now" : "View Details",
        }));
        setActivities(formatted);
      }
    } catch (err) {
      console.error("Failed to fetch customer bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filtered = activities.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-olive-900 via-olive-950 to-charcoal text-cream shadow-elevation-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-olive-700/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-olive-300 text-xs font-semibold mb-3">
              <Activity size={13} />
              <span>Customer Activity Feed</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white font-medium">
              Recent Activity
            </h1>
            <p className="text-xs sm:text-sm text-cream/70 mt-1 max-w-lg">
              Chronological log of your SHG product purchases, village service bookings, community reviews, and suggestions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-white/10 text-cream border border-white/10 text-xs font-bold flex items-center gap-1.5">
              <Sparkles size={13} className="text-olive-300" />
              <span>Real-time Live Sync</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-charcoal/10 dark:border-dark-border">
        {[
          { id: "all", label: `All Activity (${activities.length})` },
          { id: "product", label: `SHG Purchases (${activities.filter((i) => i.type === "product").length})` },
          { id: "service", label: `Service Bookings (${activities.filter((i) => i.type === "service").length})` },
          { id: "review", label: `Reviews & Feedback (${activities.filter((i) => i.type === "review").length})` },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFilter(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filter === t.id
                ? "bg-olive-700 text-cream shadow-xs font-bold"
                : "bg-cream-card dark:bg-dark-card text-charcoal/70 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Timeline Items List with Images */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-cream-card dark:bg-dark-card rounded-3xl p-5 sm:p-6 border border-charcoal/5 dark:border-dark-border shadow-elevation-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-elevation-2 transition-all"
          >
            <div className="flex items-center gap-4 min-w-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-charcoal/10 shrink-0 shadow-xs"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      item.type === "product"
                        ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                        : item.type === "service"
                        ? "bg-olive-100 dark:bg-olive-900/60 text-olive-800 dark:text-olive-300"
                        : "bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300"
                    }`}
                  >
                    {item.category}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={10} />
                    <span>{item.status}</span>
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-charcoal dark:text-dark-text truncate">
                  {item.title}
                </h3>
                <p className="text-xs text-charcoal/60 dark:text-dark-muted truncate mt-0.5">
                  {item.subtitle}
                </p>
                <p className="text-[11px] text-charcoal/50 dark:text-dark-muted line-clamp-1 mt-1">
                  {item.details}
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-charcoal/5 dark:border-dark-border gap-2">
              <div className="text-left sm:text-right">
                {item.price && (
                  <p className="font-display font-bold text-sm sm:text-base text-charcoal dark:text-dark-text">
                    {item.price}
                  </p>
                )}
                <div className="flex items-center gap-1 text-[11px] text-charcoal/50 dark:text-dark-muted font-medium mt-0.5">
                  <Clock size={11} className="text-olive-700 dark:text-olive-400" />
                  <span>{item.dateTime}</span>
                </div>
              </div>

              {item.status === "accepted" ? (
                <button
                  onClick={() => setSelectedPaymentBooking({ id: item.id, price: item.rawPrice })}
                  className="inline-flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl bg-olive-700 hover:bg-olive-800 text-white text-xs font-bold transition-all shadow-xs border border-olive-800/20 active:scale-[0.98]"
                >
                  <Wrench size={14} className="shrink-0" />
                  <span>{item.actionLabel}</span>
                </button>
              ) : (
                <button
                  onClick={() => setSelectedDetailsBooking(item)}
                  className="inline-flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl bg-charcoal hover:bg-charcoal/90 text-white text-xs font-bold transition-all shadow-xs border border-charcoal/20 active:scale-[0.98]"
                >
                  {item.type === "product" && <ShoppingBag size={14} className="shrink-0" />}
                  {item.type === "service" && <Wrench size={14} className="shrink-0" />}
                  {item.type === "review" && <Star size={14} className="shrink-0" />}
                  <span>{item.actionLabel}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <PaymentModal
        isOpen={!!selectedPaymentBooking}
        onClose={() => setSelectedPaymentBooking(null)}
        bookingId={selectedPaymentBooking?.id}
        amount={selectedPaymentBooking?.price}
        onSuccess={() => {
          setSelectedPaymentBooking(null);
          fetchBookings();
        }}
      />

      <BookingDetailsModal
        isOpen={!!selectedDetailsBooking}
        onClose={() => setSelectedDetailsBooking(null)}
        booking={selectedDetailsBooking}
      />
    </div>
  );
}
