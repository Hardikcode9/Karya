import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Search, Map, List, AlertCircle } from "lucide-react";
import SectionHeading from "../components/ui/SectionHeading";
import ServiceCard from "../components/ui/ServiceCard";
import GeolocationMap from "../components/map/GeolocationMap";
import api from "../utils/api";
import { useCart } from "../hooks/useCart";
import { allServices } from "../data/mockData";

export default function Services() {
  const [active, setActive] = useState("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("list"); // 'list' | 'map'
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/services");
        const backendList = (response.data && response.data.services) || [];

        // Build a map of backend services by lowercase name
        const bMap = new Map();
        backendList.forEach((s) => {
          if (s && s.name) bMap.set(s.name.toLowerCase().trim(), s);
        });

        // Merge: Include backend services and any catalogue services (SHG, Community) not in DB
        const merged = [...backendList];
        allServices.forEach((ms) => {
          const key = ms.name.toLowerCase().trim();
          if (!bMap.has(key)) {
            merged.push(ms);
          }
        });

        setServices(merged.length > 0 ? merged : allServices);
      } catch (err) {
        console.error("Error fetching services:", err);
        // Fallback gracefully to allServices
        setServices(allServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const { addItem } = useCart();
  const outletContext = useOutletContext();

  const categories = [...new Set(services.map((s) => s.category).filter(Boolean))];

  const filteredServices = services
    .filter((s) => active === "all" || s.category?.toLowerCase() === active.toLowerCase())
    .filter((s) => s.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="pt-32 sm:pt-40 pb-20">
      <section className="container-kare">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Local Services & Map"
            title="Services built around local needs."
            description="Browse verified trade specialists, emergency helpers, and SHG community products with real-time location radius."
          />

          {/* Map vs List View Mode Toggle */}
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
              <List size={15} /> List View
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
              <Map size={15} /> Geolocation Map
            </button>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-3 bg-cream-card dark:bg-dark-card border border-charcoal/10 dark:border-dark-border rounded-2xl p-3">
          <div className="relative w-full md:w-80">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-dark-muted"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services (e.g. Electrician, Plumbing)..."
              className="w-full bg-cream dark:bg-dark-bg rounded-xl pl-9 pr-4 py-2 text-xs outline-none border border-charcoal/10 dark:border-dark-border focus:border-olive-600 dark:text-dark-text transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 w-full md:w-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => setActive("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                active === "all"
                  ? "bg-charcoal dark:bg-olive-700 text-cream"
                  : "border border-charcoal/15 dark:border-dark-border text-charcoal/70 dark:text-dark-muted hover:bg-ivory dark:hover:bg-dark-surface"
              }`}
            >
              All Trades
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActive(category)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  active === category
                    ? "bg-charcoal dark:bg-olive-700 text-cream"
                    : "border border-charcoal/15 dark:border-dark-border text-charcoal/70 dark:text-dark-muted hover:bg-ivory dark:hover:bg-dark-surface"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* View Mode: Map or Categorized List */}
      {loading ? (
        <section className="container-kare mt-12 text-center py-12">
          <div className="inline-block w-8 h-8 border-3 border-olive-700 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-charcoal/60 dark:text-dark-muted">
            Loading live services from backend...
          </p>
        </section>
      ) : error ? (
        <section className="container-kare mt-10">
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-center gap-3 text-red-700 dark:text-red-400 text-sm">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        </section>
      ) : viewMode === "map" ? (
        <section className="container-kare mt-10">
          <GeolocationMap
            onSelectWorker={(worker) => {
              if (outletContext?.openBooking) outletContext.openBooking(worker);
            }}
            onSelectSHG={(shg) => {
              if (outletContext?.openBooking) {
                outletContext.openBooking({
                  id: shg.id,
                  name: shg.name,
                  role: "Self-Help Group Batch Order",
                  village: shg.village,
                  price: 1200,
                  priceUnit: "bulk order",
                });
              }
            }}
            onAddToCart={(item) => addItem(item)}
          />
        </section>
      ) : (
        <section className="container-kare mt-14">
          {filteredServices.length === 0 ? (
            <div className="text-center py-12 bg-cream-card dark:bg-dark-card rounded-3xl border border-charcoal/10 dark:border-dark-border p-8">
              <p className="text-charcoal/60 dark:text-dark-muted text-sm font-medium">
                No services found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {filteredServices.map((s, index) => (
                <ServiceCard key={s._id || s.id} service={{ ...s, id: s._id || s.id }} index={index} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

