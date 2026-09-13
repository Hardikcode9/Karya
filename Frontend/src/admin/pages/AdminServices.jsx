import { useState, useMemo, useEffect } from "react";
import {
  Settings2, Search, Wrench
} from "lucide-react";
import { useToast } from "../hooks/useToast";
import api from "../utils/api";

export default function AdminServices() {
  const toast = useToast();
  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get("/services");
      setServicesList(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch services.");
    } finally {
      setLoading(false);
    }
  };

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredServices = useMemo(() => {
    return servicesList.filter((s) => {
      const name = s.name || "";
      const category = s.category || "";

      const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
      const matchesCat = categoryFilter === "all" || category === categoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [servicesList, search, categoryFilter]);

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Settings2 size={18} />
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal dark:text-dark-text">
              Trade Services Master
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted mt-1">
            Global catalog of rural skills, trades, and standardized pricing models.
          </p>
        </div>
      </div>

      {/* Aggregate Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-cream-card dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs">
          <span className="text-[11px] font-bold text-charcoal/50 dark:text-dark-muted uppercase tracking-wider block">Total Services</span>
          <span className="font-display font-bold text-2xl text-charcoal dark:text-dark-text mt-1 block">{servicesList.length}</span>
        </div>
      </div>

      {/* Search Controls */}
      <div className="bg-cream-card dark:bg-dark-card rounded-2xl p-4 border border-charcoal/10 dark:border-dark-border shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-dark-muted" />
            <input
              type="text"
              placeholder="Search by service name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-surface rounded-xl text-xs sm:text-sm text-charcoal dark:text-dark-text border border-charcoal/15 dark:border-dark-border outline-none focus:border-olive-600 shadow-2xs"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-dark-surface rounded-xl text-xs font-bold text-charcoal dark:text-dark-text border border-charcoal/15 dark:border-dark-border outline-none"
            >
              <option value="all">All Categories</option>
              <option value="individual">Individual Trades</option>
              <option value="group">SHG Services</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table View */}
      <div className="bg-cream-card dark:bg-dark-card rounded-3xl border border-charcoal/10 dark:border-dark-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-sm text-charcoal/50">Loading services...</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal/5 dark:bg-dark-surface border-b border-charcoal/10 dark:border-dark-border text-[11px] uppercase font-bold text-charcoal/60 dark:text-dark-muted tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Service Area &amp; Name</th>
                  <th className="py-3.5 px-4">Base Rate</th>
                  <th className="py-3.5 px-4">Provider Mode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5 dark:divide-dark-border font-medium">
                {filteredServices.map((service) => (
                  <tr key={service._id} className="hover:bg-charcoal/2 dark:hover:bg-dark-surface/50 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-bold flex items-center justify-center shrink-0">
                          <Wrench size={16} />
                        </div>
                        <div>
                          <span className="font-bold text-charcoal dark:text-dark-text block">
                            {service.name}
                          </span>
                          <span className="text-[11px] text-charcoal/50">
                            {service.description || "Service Description"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-charcoal dark:text-dark-text block">
                        ₹{service.basePrice || "N/A"}
                      </span>
                      <span className="text-[10px] text-charcoal/50">per {service.priceUnit || "unit"}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-charcoal/5 dark:bg-dark-surface text-charcoal/70 dark:text-dark-muted">
                        {service.category === "group" ? "SHG Network" : "Individual Worker"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
