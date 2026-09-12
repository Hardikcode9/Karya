import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin, Compass, Navigation, Wrench, ShoppingBag,
  ShieldCheck, ArrowRight, Sparkles, Filter, Info
} from "lucide-react";
import GeolocationMap from "../../components/map/GeolocationMap";
import { useToast } from "../../hooks/useToast";

export default function CustomerMap() {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const toast = useToast();

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-olive-900 via-olive-950 to-charcoal text-cream shadow-elevation-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold mb-3">
              <Compass size={14} />
              <span>Real-Time OpenStreetMap Radar</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white font-medium">
              Nearby Service Providers Map
            </h1>
            <p className="text-xs sm:text-sm text-cream/70 mt-1 max-w-xl leading-relaxed">
              Powered by OpenStreetMap & Leaflet.js. Pinpoints verified village electricians, carpenters, tailors, plumbers, and SHG units around your GPS location with interactive distance filtering.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-olive-600 hover:bg-olive-700 text-white shadow-sm border border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Wrench size={16} className="shrink-0" />
              <span>Book Service Now</span>
            </Link>
            <Link
              to="/shgs"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 text-white shadow-sm border border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShoppingBag size={16} className="shrink-0" />
              <span>Buy Items Now</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Embedded OpenStreetMap Leaflet Component */}
      <GeolocationMap
        onSelectWorker={(worker) => {
          setSelectedProvider(worker);
          toast.show(`Selected ${worker.name} (${worker.role}) · ${worker.distanceKm} km away. Click Book Service Now to proceed.`, "info");
        }}
        onSelectSHG={(shg) => {
          setSelectedProvider(shg);
          toast.show(`Selected ${shg.name} · ${shg.distanceKm} km away.`, "info");
        }}
        onAddToCart={(item) => {
          toast.show(`Added ${item.name} to cart!`, "success");
        }}
      />

      {/* Location Tips & Safety Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-cream-card dark:bg-dark-card rounded-2xl p-4 border border-charcoal/5 dark:border-dark-border flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Navigation size={16} />
          </div>
          <div>
            <h4 className="font-bold text-xs text-charcoal dark:text-dark-text">Live GPS Detection</h4>
            <p className="text-[11px] text-charcoal/60 dark:text-dark-muted mt-0.5 leading-relaxed">
              Click "Fetch Current Location" to center the radar around your exact device GPS coordinates with instant accuracy circles.
            </p>
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card rounded-2xl p-4 border border-charcoal/5 dark:border-dark-border flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-olive-100 dark:bg-olive-900/60 text-olive-700 dark:text-olive-400 flex items-center justify-center shrink-0">
            <ShieldCheck size={16} />
          </div>
          <div>
            <h4 className="font-bold text-xs text-charcoal dark:text-dark-text">Verified Distance Radius</h4>
            <p className="text-[11px] text-charcoal/60 dark:text-dark-muted mt-0.5 leading-relaxed">
              Adjust the slider from 1 km to 25 km. Leaflet dynamically recalculates Haversine distances to nearby specialists.
            </p>
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card rounded-2xl p-4 border border-charcoal/5 dark:border-dark-border flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Wrench size={16} />
          </div>
          <div>
            <h4 className="font-bold text-xs text-charcoal dark:text-dark-text">Direct Map Booking</h4>
            <p className="text-[11px] text-charcoal/60 dark:text-dark-muted mt-0.5 leading-relaxed">
              Click any provider pin or list card to open their profile popup and book them on-site with transparent rates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
