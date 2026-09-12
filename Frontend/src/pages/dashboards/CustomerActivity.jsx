import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity, ShoppingBag, Wrench, Star, Clock, CheckCircle2,
  Calendar, ArrowRight, Filter, Sparkles, MapPin, ExternalLink
} from "lucide-react";
import Button from "../../components/ui/Button";

const ACTIVITY_ITEMS = [
  {
    id: "act-1",
    type: "product",
    title: "Terracotta Handcrafted Mitti Matka (10L)",
    subtitle: "Purchased from Pragati Mahila SHG",
    category: "SHG Order",
    status: "Delivered",
    price: "₹450",
    dateTime: "Today, 11 Sep 2026 • 02:30 PM",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=200&q=80",
    details: "Order #ORD-9201 paid via UPI. Delivered safely to Ward #4 with straw protective packaging.",
    to: "/shgs",
    actionLabel: "View in SHG Store",
  },
  {
    id: "act-2",
    type: "review",
    title: "Submitted 5-Star Review for Mitti Matka",
    subtitle: "Reviewed Pragati Mahila SHG",
    category: "Customer Review",
    status: "Published",
    dateTime: "Today, 11 Sep 2026 • 03:15 PM",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=200&q=80",
    details: "Verified review submitted: 'Water stays naturally cool even in peak heat! Sturdy craftsmanship.'",
    to: "/customer/reviews",
    actionLabel: "View All Reviews",
  },
  {
    id: "act-3",
    type: "service",
    title: "Submersible Pump Wiring & Motor Overhaul",
    subtitle: "Service by Ramesh Kumar (Electrician)",
    category: "Service Booking",
    status: "Completed",
    price: "₹650",
    dateTime: "Yesterday, 10 Sep 2026 • 09:30 AM",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=200&q=80",
    details: "Booking #SRV-4102 fulfilled on-site at Rampur Field #2. Starter phase fault repaired.",
    to: "/services",
    actionLabel: "Book Service Again",
  },
  {
    id: "act-4",
    type: "product",
    title: "Cold-Pressed Kachi Ghani Mustard Oil (2L)",
    subtitle: "Purchased from Gramodaya SHG Federation",
    category: "SHG Order",
    status: "Delivered",
    price: "₹380",
    dateTime: "09 Sep 2026 • 11:15 AM",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=200&q=80",
    details: "Order #ORD-8942 paid Cash on Delivery. 100% cold pressed village harvest mustard oil.",
    to: "/shgs",
    actionLabel: "Buy Product Again",
  },
  {
    id: "act-5",
    type: "review",
    title: "Craft Suggestion Submitted to Pragati SHG",
    subtitle: "Protective Straw Cushioning for Fragile Matkas",
    category: "Craft Suggestion",
    status: "Adopted by SHG",
    dateTime: "07 Sep 2026 • 11:00 AM",
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=200&q=80",
    details: "Pragati Mahila SHG accepted your packaging suggestion for 8 village delivery clusters.",
    to: "/customer/reviews",
    actionLabel: "View Suggestions",
  },
  {
    id: "act-6",
    type: "product",
    title: "Natural Bamboo Storage Baskets (Set of 2)",
    subtitle: "Purchased from Aarunya Weaver Collective",
    category: "SHG Order",
    status: "Delivered",
    price: "₹620",
    dateTime: "05 Sep 2026 • 04:45 PM",
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=200&q=80",
    details: "Order #ORD-8519 delivered with digital invoice. Handwoven seasoned cane storage baskets.",
    to: "/shgs",
    actionLabel: "View in Store",
  },
  {
    id: "act-7",
    type: "service",
    title: "Drip Irrigation Pipe Jointing & Filter Flush",
    subtitle: "Service by Irfan Ali (Plumbing Specialist)",
    category: "Service Booking",
    status: "Completed",
    price: "₹480",
    dateTime: "04 Sep 2026 • 03:00 PM",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=200&q=80",
    details: "Booking #SRV-3891 fulfilled at North Canal farm. Pipeline pressure tested and cleared.",
    to: "/services",
    actionLabel: "Book Service",
  },
  {
    id: "act-8",
    type: "service",
    title: "Teakwood Grain Storage Box Hinge Repair",
    subtitle: "Service by Sunita Devi (Carpentry)",
    category: "Service Booking",
    status: "Completed",
    price: "₹850",
    dateTime: "28 Aug 2026 • 10:15 AM",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=200&q=80",
    details: "Booking #SRV-3450 fulfilled on-site. Heavy teak chest brass hinge restoration.",
    to: "/services",
    actionLabel: "Book Specialist",
  },
];

export default function CustomerActivity() {
  const [filter, setFilter] = useState("all");

  const filtered = ACTIVITY_ITEMS.filter((item) => {
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
          { id: "all", label: `All Activity (${ACTIVITY_ITEMS.length})` },
          { id: "product", label: `SHG Purchases (${ACTIVITY_ITEMS.filter((i) => i.type === "product").length})` },
          { id: "service", label: `Service Bookings (${ACTIVITY_ITEMS.filter((i) => i.type === "service").length})` },
          { id: "review", label: `Reviews & Feedback (${ACTIVITY_ITEMS.filter((i) => i.type === "review").length})` },
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

              <Link
                to={item.to}
                className="inline-flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl bg-olive-700 hover:bg-olive-800 text-white text-xs font-bold transition-all shadow-xs border border-olive-800/20 active:scale-[0.98]"
              >
                {item.type === "product" && <ShoppingBag size={14} className="shrink-0" />}
                {item.type === "service" && <Wrench size={14} className="shrink-0" />}
                {item.type === "review" && <Star size={14} className="shrink-0" />}
                <span>{item.actionLabel}</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
