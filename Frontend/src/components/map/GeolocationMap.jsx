import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Navigation, Compass,
  ShoppingBag, X
} from "lucide-react";
import { workers, shgs } from "../../data/mockData";
import Rating from "../ui/Rating";
import Button from "../ui/Button";

// Simulated coordinates for visual map grid
const mapLocations = [
  { id: "w1", worker: workers[0], x: 30, y: 35, type: "worker" },
  { id: "w2", worker: workers[1], x: 65, y: 40, type: "worker" },
  { id: "w3", worker: workers[2], x: 45, y: 70, type: "worker" },
  { id: "w4", worker: workers[3], x: 75, y: 25, type: "worker" },
  { id: "s1", shg: shgs[0], x: 20, y: 60, type: "shg" },
  { id: "s2", shg: shgs[1], x: 55, y: 20, type: "shg" },
];

export default function GeolocationMap({ onSelectWorker, onSelectSHG, onAddToCart }) {
  const [radiusKm, setRadiusKm] = useState(12);
  const [activePin, setActivePin] = useState(null);
  const [filterType, setFilterType] = useState("all");

  const filteredLocations = mapLocations.filter((loc) => {
    if (filterType === "workers" && loc.type !== "worker") return false;
    if (filterType === "shgs" && loc.type !== "shg") return false;
    const distance = loc.worker ? loc.worker.distanceKm : 5.2;
    return distance <= radiusKm;
  });

  return (
    <div className="bg-cream-card dark:bg-dark-card rounded-[2.5rem] border border-charcoal/10 dark:border-dark-border overflow-hidden shadow-card">
      {/* Top Map Toolbar */}
      <div className="p-4 sm:p-5 bg-ivory/80 dark:bg-dark-surface border-b border-charcoal/10 dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-olive-100 dark:bg-olive-900/50 text-olive-800 dark:text-olive-300 flex items-center justify-center">
            <Compass size={18} />
          </span>
          <div>
            <h3 className="font-display text-sm font-semibold text-charcoal dark:text-dark-text">
              Live Cluster Geolocation Map
            </h3>
            <p className="text-[11px] text-charcoal/60 dark:text-dark-muted">
              Rampur Nodal Center · {filteredLocations.length} active nearby
            </p>
          </div>
        </div>

        {/* Radius Slider & Filters */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs text-charcoal/70 dark:text-dark-muted whitespace-nowrap">
              Radius: <strong>{radiusKm} km</strong>
            </span>
            <input
              type="range"
              min={2}
              max={25}
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-24 accent-olive-700 h-1.5 bg-charcoal/10 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex gap-1">
            {["all", "workers", "shgs"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 rounded-lg text-xs uppercase font-bold tracking-wider transition-all ${
                  filterType === t
                    ? "bg-olive-700 text-cream"
                    : "bg-cream dark:bg-dark-bg text-charcoal/60 dark:text-dark-muted border border-charcoal/10 dark:border-dark-border"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Canvas Visualizer */}
      <div className="relative w-full h-80 sm:h-96 bg-[#EBE4D5] dark:bg-[#141B13] overflow-hidden select-none">
        {/* Subtle Map Grid lines */}
        <div
          className="absolute inset-0 opacity-20 dark:opacity-10"
          style={{
            backgroundImage: "radial-gradient(#2A2620 1px, transparent 1px), linear-gradient(to right, #2A2620 1px, transparent 1px), linear-gradient(to bottom, #2A2620 1px, transparent 1px)",
            backgroundSize: "20px 20px, 60px 60px, 60px 60px",
          }}
        />

        {/* Radar Scanner Wave from Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <motion.div
            animate={{ scale: [0.8, 2.2, 3], opacity: [0.6, 0.2, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut" }}
            className="w-40 h-40 rounded-full border border-olive-500/40 bg-olive-400/5"
          />
        </div>

        {/* User Location Center Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
          <span className="w-5 h-5 rounded-full bg-olive-700 ring-4 ring-olive-400/40 animate-pulse flex items-center justify-center text-white">
            <Navigation size={10} className="fill-white" />
          </span>
          <span className="text-[10px] font-bold bg-cream dark:bg-dark-card text-charcoal dark:text-dark-text px-2 py-0.5 rounded-full shadow-md mt-1">
            You (Rampur)
          </span>
        </div>

        {/* Pins on Map */}
        {filteredLocations.map((loc) => {
          const item = loc.worker || loc.shg;
          const isSelected = activePin?.id === loc.id;

          return (
            <div
              key={loc.id}
              style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
            >
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActivePin(isSelected ? null : loc)}
                className={`p-2 rounded-2xl shadow-lg flex items-center gap-1.5 transition-all ${
                  loc.type === "worker"
                    ? "bg-olive-800 text-cream ring-2 ring-olive-400"
                    : "bg-clay-600 text-cream ring-2 ring-clay-300"
                }`}
              >
                <MapPin size={14} />
                <span className="text-xs font-semibold max-w-[80px] truncate">
                  {item.name.split(" ")[0]}
                </span>
              </motion.button>
            </div>
          );
        })}

        {/* Selected Pin Details Card Popup */}
        <AnimatePresence>
          {activePin && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-40 bg-cream dark:bg-dark-card border border-charcoal/15 dark:border-dark-border rounded-3xl p-4 shadow-2xl space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-bold text-olive-800 dark:text-olive-300 bg-olive-100 dark:bg-olive-900/40 px-2 py-0.5 rounded-full">
                    {activePin.type === "worker" ? "Verified Specialist" : "Self-Help Group"}
                  </span>
                  <h4 className="font-display text-base font-bold text-charcoal dark:text-dark-text mt-1">
                    {(activePin.worker || activePin.shg).name}
                  </h4>
                  <p className="text-xs text-charcoal/60 dark:text-dark-muted">
                    {(activePin.worker || activePin.shg).village} · {(activePin.worker || activePin.shg).role || "Artisans"}
                  </p>
                </div>
                <button
                  onClick={() => setActivePin(null)}
                  className="p-1 text-charcoal/40 dark:text-dark-muted hover:text-charcoal rounded-full"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-charcoal/5 dark:border-dark-border">
                <Rating value={(activePin.worker || activePin.shg).rating || 4.9} />
                <span className="font-bold text-charcoal dark:text-dark-text">
                  ₹{(activePin.worker || activePin.shg).price || 350}/{(activePin.worker || activePin.shg).priceUnit || "day"}
                </span>
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  onClick={() => {
                    if (activePin.worker && onSelectWorker) onSelectWorker(activePin.worker);
                    if (activePin.shg && onSelectSHG) onSelectSHG(activePin.shg);
                  }}
                  className="flex-1 text-xs py-2"
                >
                  Book Now
                </Button>
                {onAddToCart && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const target = activePin.worker || activePin.shg;
                      onAddToCart({
                        id: target.id,
                        name: target.name,
                        price: target.price || 350,
                        priceUnit: target.priceUnit || "day",
                        category: activePin.type === "worker" ? "Service" : "SHG",
                      });
                    }}
                    className="p-2"
                    title="Add to Cart"
                  >
                    <ShoppingBag size={14} />
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
