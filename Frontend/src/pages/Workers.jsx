import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  Search, MapPin, ShieldCheck, SlidersHorizontal,
  Map, List, ShoppingBag, Star, AlertCircle
} from "lucide-react";
import SectionHeading from "../components/ui/SectionHeading";
import Rating from "../components/ui/Rating";
import Button from "../components/ui/Button";
import ImageTile from "../components/ui/ImageTile";
import GeolocationMap from "../components/map/GeolocationMap";
import { workers as mockWorkers } from "../data/mockData";
import { useCart } from "../hooks/useCart";
import api from "../utils/api";

const mapWorkerData = (w) => ({
  id: w._id || w.id,
  name: w.user?.name || w.name || "Specialist Worker",
  role: w.service?.name || w.role || "Technician",
  village: w.village || "Local District",
  distanceKm: w.distanceInKm ?? w.distanceKm ?? 3.5,
  rating: w.rating || 4.5,
  skills: w.skills && w.skills.length > 0 ? w.skills : [w.service?.name || "Maintenance"],
  price: w.pricePerService || w.price || 400,
  priceUnit: w.priceUnit || "visit",
  matchPercent: w.matchScore ? Math.round(w.matchScore) : (w.matchPercent || 92),
  verified: w.verified || { skill: true, phone: true, shg: false },
  completedJobs: w.totalReviews || w.completedJobs || 18,
  experienceYears: w.experience || w.experienceYears || 4,
  bio: w.bio || "Experienced local trade specialist available for house visits.",
  phone: w.user?.phone || w.phone || "",
});

export default function Workers() {
  const [workersList, setWorkersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [maxDistance, setMaxDistance] = useState(25);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("match"); // 'match' | 'priceAsc' | 'rating'
  const [viewMode, setViewMode] = useState("list");

  const { addItem } = useCart();
  const outletContext = useOutletContext();

  useEffect(() => {
    const fetchWorkers = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/workers");
        if (response.data && response.data.workers && response.data.workers.length > 0) {
          setWorkersList(response.data.workers.map(mapWorkerData));
        } else {
          // Fallback to mock data if DB has no worker profiles yet
          setWorkersList(mockWorkers.map(mapWorkerData));
        }
      } catch (err) {
        console.error("Error fetching workers from backend:", err);
        // Fallback to mock data on connection failure
        setWorkersList(mockWorkers.map(mapWorkerData));
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  const filtered = workersList
    .filter((w) => {
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        w.role.toLowerCase().includes(q) ||
        w.name.toLowerCase().includes(q) ||
        w.village.toLowerCase().includes(q);
      const matchesDistance = w.distanceKm <= maxDistance;
      const matchesVerified = !verifiedOnly || (w.verified?.skill && w.verified?.phone);
      const matchesRating = w.rating >= minRating;
      return matchesQuery && matchesDistance && matchesVerified && matchesRating;
    })
    .sort((a, b) => {
      if (sortBy === "priceAsc") return a.price - b.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return (b.matchPercent || 90) - (a.matchPercent || 90);
    });

  return (
    <div className="pt-32 sm:pt-40 pb-20">
      <section className="container-kare">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Specialists Directory"
            title="Find trusted workers near you."
            description="Verified village technicians, carpenters, electricians, and mechanics with transparent pricing and live booking."
          />

          <div className="flex items-center bg-cream-card dark:bg-dark-card border border-charcoal/10 dark:border-dark-border rounded-2xl p-1 shadow-xs self-start md:self-auto">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                viewMode === "list"
                  ? "bg-olive-700 text-cream shadow-xs"
                  : "text-charcoal/60 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text"
              }`}
            >
              <List size={15} /> Card View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                viewMode === "map"
                  ? "bg-olive-700 text-cream shadow-xs"
                  : "text-charcoal/60 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text"
              }`}
            >
              <Map size={15} /> Cluster Map
            </button>
          </div>
        </div>

        {/* Multi-Filter Bar */}
        <div className="mt-8 bg-cream-card dark:bg-dark-card border border-charcoal/10 dark:border-dark-border rounded-3xl p-4 sm:p-5 space-y-4 shadow-card">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-96">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-dark-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by specialist name, skill, or village..."
                className="w-full bg-cream dark:bg-dark-bg rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none border border-charcoal/10 dark:border-dark-border focus:border-olive-600 dark:text-dark-text transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end text-xs">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-cream dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border rounded-xl px-3 py-2 text-xs font-medium text-charcoal dark:text-dark-text outline-none focus:border-olive-600"
              >
                <option value="match">Sort: Best Match</option>
                <option value="priceAsc">Sort: Price (Low to High)</option>
                <option value="rating">Sort: Top Rated</option>
              </select>

              <button
                type="button"
                onClick={() => setVerifiedOnly((v) => !v)}
                className={`px-3 py-2 rounded-xl border flex items-center gap-1.5 transition-all ${
                  verifiedOnly
                    ? "bg-olive-700 text-cream border-olive-700"
                    : "bg-cream dark:bg-dark-bg border-charcoal/15 dark:border-dark-border text-charcoal/70 dark:text-dark-muted"
                }`}
              >
                <ShieldCheck size={14} /> Verified Only
              </button>

              <button
                type="button"
                onClick={() => setMinRating((v) => (v === 4.5 ? 0 : 4.5))}
                className={`px-3 py-2 rounded-xl border flex items-center gap-1.5 transition-all ${
                  minRating === 4.5
                    ? "bg-amber-500 text-cream border-amber-500"
                    : "bg-cream dark:bg-dark-bg border-charcoal/15 dark:border-dark-border text-charcoal/70 dark:text-dark-muted"
                }`}
              >
                <Star size={14} /> 4.5+ Stars
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-charcoal/5 dark:border-dark-border text-xs text-charcoal/70 dark:text-dark-muted">
            <SlidersHorizontal size={14} />
            <span>Max Radius: <strong>{maxDistance} km</strong></span>
            <input
              type="range"
              min={2}
              max={30}
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-32 accent-olive-700 h-1.5 bg-charcoal/10 dark:bg-dark-border rounded-lg cursor-pointer"
            />
            <span className="ml-auto text-[11px] font-semibold text-olive-800 dark:text-olive-300">
              Showing {filtered.length} specialists
            </span>
          </div>
        </div>
      </section>

      {/* View Mode: Map or Cards */}
      {loading ? (
        <section className="container-kare mt-12 text-center py-12">
          <div className="inline-block w-8 h-8 border-3 border-olive-700 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-charcoal/60 dark:text-dark-muted">Loading specialists from backend...</p>
        </section>
      ) : viewMode === "map" ? (
        <section className="container-kare mt-10">
          <GeolocationMap
            onSelectWorker={(w) => {
              if (outletContext?.openBooking) outletContext.openBooking(w);
            }}
            onAddToCart={(item) => addItem(item)}
          />
        </section>
      ) : (
        <section className="container-kare mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((w) => (
            <div
              key={w.id}
              className="bg-cream-card dark:bg-dark-card rounded-[2rem] overflow-hidden border border-charcoal/10 dark:border-dark-border hover:border-olive-300 dark:hover:border-olive-600 transition-all flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="aspect-[16/10] relative overflow-hidden">
                  <ImageTile keywords={`${w.role} india portrait`} alt={w.name} seed="500x320" className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 bg-cream/90 dark:bg-dark-card/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold text-olive-800 dark:text-olive-300 shadow-sm">
                    {w.matchPercent}% Match
                  </span>
                </div>
                <div className="p-5 flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display text-lg text-charcoal dark:text-dark-text">{w.name}</h3>
                      <p className="text-xs text-charcoal/60 dark:text-dark-muted">{w.role}</p>
                    </div>
                    <Rating value={w.rating} />
                  </div>
                  <p className="text-xs text-charcoal/60 dark:text-dark-muted flex items-center gap-1">
                    <MapPin size={13} /> {w.village} · {w.distanceKm} km · ₹{w.price}/{w.priceUnit}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {w.skills.slice(0, 2).map((s) => (
                      <span key={s} className="text-xs bg-olive-100 dark:bg-olive-900/40 text-olive-800 dark:text-olive-300 rounded-full px-2.5 py-1">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    if (outletContext?.openBooking) outletContext.openBooking(w);
                  }}
                  className="flex-1 text-xs py-2"
                >
                  Book Specialist
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  as={Link}
                  to={`/workers/${w.id}`}
                  className="text-xs py-2"
                >
                  Profile
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    addItem({
                      id: w.id,
                      name: `${w.name} (${w.role})`,
                      price: w.price,
                      priceUnit: w.priceUnit,
                      category: w.role,
                    });
                  }}
                  className="p-2"
                  title="Add to Cart"
                >
                  <ShoppingBag size={14} />
                </Button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full bg-cream-card dark:bg-dark-card rounded-3xl p-16 text-center border border-charcoal/10 dark:border-dark-border">
              <p className="text-charcoal/50 dark:text-dark-muted">No specialists match the selected filters or radius.</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

