import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Search, Map, List, ShoppingBag } from "lucide-react";
import SectionHeading from "../components/ui/SectionHeading";
import ServiceCard from "../components/ui/ServiceCard";
import GeolocationMap from "../components/map/GeolocationMap";
import { serviceCategories } from "../data/mockData";
import { useCart } from "../hooks/useCart";

export default function Services() {
  const [active, setActive] = useState("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("list"); // 'list' | 'map'
  const { addItem } = useCart();
  const outletContext = useOutletContext();

  const categories =
    active === "all" ? serviceCategories : serviceCategories.filter((c) => c.id === active);

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
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-dark-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services (e.g. Electrician, Carpentry, Food)..."
              className="w-full bg-cream dark:bg-dark-bg rounded-xl pl-9 pr-4 py-2 text-xs outline-none border border-charcoal/10 dark:border-dark-border focus:border-olive-600 dark:text-dark-text transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setActive("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                active === "all"
                  ? "bg-charcoal dark:bg-olive-700 text-cream"
                  : "border border-charcoal/15 dark:border-dark-border text-charcoal/70 dark:text-dark-muted hover:bg-ivory dark:hover:bg-dark-surface"
              }`}
            >
              All Trades
            </button>
            {serviceCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  active === c.id
                    ? "bg-charcoal dark:bg-olive-700 text-cream"
                    : "border border-charcoal/15 dark:border-dark-border text-charcoal/70 dark:text-dark-muted hover:bg-ivory dark:hover:bg-dark-surface"
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* View Mode: Map or Categorized List */}
      {viewMode === "map" ? (
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
        categories.map((cat) => {
          const matchingServices = cat.services.filter((s) =>
            s.name.toLowerCase().includes(search.toLowerCase())
          );
          if (matchingServices.length === 0) return null;

          return (
            <section key={cat.id} className="container-kare mt-14">
              <div className="mb-5">
                <h2 className="font-display text-2xl text-charcoal dark:text-dark-text">{cat.title}</h2>
                <p className="text-charcoal/55 dark:text-dark-muted text-sm mt-1">{cat.blurb}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {matchingServices.map((s) => (
                  <div key={s.id} className="relative group">
                    <ServiceCard service={s} />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addItem({
                          id: s.id,
                          name: s.name,
                          price: 400,
                          priceUnit: "service",
                          category: cat.title,
                        });
                      }}
                      className="absolute top-4 right-4 z-10 p-2 bg-cream dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border rounded-xl text-charcoal/70 dark:text-dark-muted hover:text-olive-700 dark:hover:text-olive-400 hover:bg-olive-50 dark:hover:bg-olive-900/40 opacity-0 group-hover:opacity-100 transition-all shadow-xs"
                      title="Add to Cart"
                    >
                      <ShoppingBag size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
