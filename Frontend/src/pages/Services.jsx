import { useEffect, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { Search, Map as MapIcon, List, AlertCircle, ChevronDown } from "lucide-react";
import SectionHeading from "../components/ui/SectionHeading";
import ServiceCard from "../components/ui/ServiceCard";
import GeolocationMap from "../components/map/GeolocationMap";
import api from "../utils/api";
import { useCart } from "../hooks/useCart";

const DEFAULT_DROPDOWN_TRADES = [
  { id: "tailor", label: "Tailors" },
  { id: "carpenter", label: "Carpenters" },
  { id: "electrician", label: "Electricians" },
  { id: "plumber", label: "Plumbers" },
  { id: "mason", label: "Masons" },
];

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialView = searchParams.get("view") === "map" ? "map" : "list";
  const [active, setActive] = useState("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState(initialView); // 'list' | 'map'
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
        setServices(backendList);
      } catch (err) {
        console.error("Error fetching services:", err);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const { addItem } = useCart();
  const outletContext = useOutletContext();

  const categories = [...new Set(services.map((s) => s.category).filter(Boolean))];

  // Dynamic categories returned by backend excluding all and general
  const extraBackendCategories = categories
    .filter((cat) => {
      const c = cat.toLowerCase();
      return (
        c !== "all" &&
        c !== "general" &&
        !DEFAULT_DROPDOWN_TRADES.some((dt) => dt.id === c || dt.label.toLowerCase() === c)
      );
    })
    .map((cat) => ({ id: cat.toLowerCase(), label: cat.charAt(0).toUpperCase() + cat.slice(1) }));

  const dropdownTrades = [...DEFAULT_DROPDOWN_TRADES, ...extraBackendCategories];

  const isDropdownActive = active !== "all" && active.toLowerCase() !== "general";
  const matchedTrade = dropdownTrades.find(
    (t) => t.id === active.toLowerCase() || t.label.toLowerCase() === active.toLowerCase()
  );
  const dropdownSelectedLabel = matchedTrade ? matchedTrade.label : active;

  const filteredServices = services
    .filter((s) => {
      if (active === "all") return true;
      const cat = (s.category || "").toLowerCase();
      const name = (s.name || "").toLowerCase();
      const desc = (s.description || "").toLowerCase();
      const act = active.toLowerCase();
      return cat.includes(act) || act.includes(cat) || name.includes(act) || desc.includes(act);
    })
    .filter(
      (s) =>
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.description?.toLowerCase().includes(search.toLowerCase())
    );

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
              onClick={() => {
                setViewMode("list");
                setSearchParams({});
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-olive-700 text-cream shadow-xs"
                  : "text-charcoal/60 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text"
              }`}
            >
              <List size={15} /> List View
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode("map");
                setSearchParams({ view: "map" });
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "map"
                  ? "bg-olive-700 text-cream shadow-xs"
                  : "text-charcoal/60 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text"
              }`}
            >
              <MapIcon size={15} /> Geolocation Map
            </button>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-3 bg-cream-card dark:bg-dark-card border border-charcoal/10 dark:border-dark-border rounded-2xl p-3 shadow-xs">
          {/* Increased Search Bar Length */}
          <div className="relative flex-1 w-full md:min-w-[420px]">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-dark-muted"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services (e.g. Electrician, Plumbing, Carpentry, Mason)..."
              className="w-full bg-cream dark:bg-dark-bg rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm outline-none border border-charcoal/10 dark:border-dark-border focus:border-olive-600 dark:text-dark-text transition-colors shadow-2xs"
            />
          </div>

          {/* Buttons for All Trades & General + Dropdown for Other Trades */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
            {/* All Trades Button */}
            <button
              type="button"
              onClick={() => setActive("all")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                active === "all"
                  ? "bg-charcoal dark:bg-olive-700 text-cream shadow-xs"
                  : "border border-charcoal/15 dark:border-dark-border text-charcoal/70 dark:text-dark-muted hover:bg-ivory dark:hover:bg-dark-surface"
              }`}
            >
              All Trades
            </button>

            {/* General Button */}
            <button
              type="button"
              onClick={() => setActive("general")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                active.toLowerCase() === "general"
                  ? "bg-charcoal dark:bg-olive-700 text-cream shadow-xs"
                  : "border border-charcoal/15 dark:border-dark-border text-charcoal/70 dark:text-dark-muted hover:bg-ivory dark:hover:bg-dark-surface"
              }`}
            >
              General
            </button>

            {/* Dropdown for All Other Trades */}
            <div className="relative">
              <select
                value={isDropdownActive ? active.toLowerCase() : ""}
                onChange={(e) => setActive(e.target.value)}
                className={`appearance-none pl-3.5 pr-8 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border cursor-pointer outline-none transition-all ${
                  isDropdownActive
                    ? "bg-charcoal dark:bg-olive-700 text-cream border-charcoal dark:border-olive-700 shadow-xs"
                    : "bg-white dark:bg-dark-surface border-charcoal/15 dark:border-dark-border text-charcoal/80 dark:text-dark-text hover:bg-ivory dark:hover:bg-dark-card"
                }`}
              >
                <option value="" disabled className="text-charcoal/60 dark:bg-dark-card">
                  {isDropdownActive ? `Trade: ${dropdownSelectedLabel}` : "More Trades ▾"}
                </option>
                {dropdownTrades.map((t) => (
                  <option key={t.id} value={t.id} className="bg-white dark:bg-dark-card text-charcoal dark:text-dark-text py-1">
                    {t.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 ${
                  isDropdownActive ? "text-cream" : "text-charcoal/50 dark:text-dark-muted"
                }`}
              />
            </div>
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
            selectedTradeProp={active}
            searchQueryProp={search}
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

