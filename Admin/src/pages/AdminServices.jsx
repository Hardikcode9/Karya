import { useState, useMemo, useEffect } from "react";
import {
  Settings2, Search, Filter, Plus, Edit3, Trash2, CheckCircle2,
  XCircle, IndianRupee, Wrench, Zap, Hammer, Sparkles, HardHat,
  Wheat, Truck, Home, Scissors, Palette, ChefHat, Soup, Cookie,
  Package, ShoppingBag, Sprout, CalendarDays, X, Check, Eye
} from "lucide-react";
import { useToast } from "../hooks/useToast";
import { allServices as mockAllServices } from "../data/mockData";
import AdminModal from "../components/ui/AdminModal";

const STORAGE_KEY = "karya_admin_services_v1";

const INITIAL_SERVICES = mockAllServices.map((s, idx) => ({
  id: s.id,
  name: s.name,
  category: s.category || "individual",
  categoryTitle: s.categoryTitle || "Individual services",
  count: s.count || 120,
  basePrice: 350 + (idx * 40),
  priceUnit: idx % 3 === 0 ? "day" : idx % 3 === 1 ? "hour" : "job",
  completedJobs: 400 + (idx * 65),
  status: "active", // "active" | "paused"
  zeroCommission: true,
  description: `Professional verified ${s.name.toLowerCase()} for rural households and panchayat blocks.`,
}));

export default function AdminServices() {
  const toast = useToast();

  const [servicesList, setServicesList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_SERVICES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(servicesList));
    } catch {
      // ignore
    }
  }, [servicesList]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editModal, setEditModal] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newService, setNewService] = useState({
    name: "",
    category: "individual",
    basePrice: 400,
    priceUnit: "day",
    description: "",
  });

  // Filtered Services
  const filteredServices = useMemo(() => {
    return servicesList.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.categoryTitle?.toLowerCase().includes(search.toLowerCase());

      const matchesCat = categoryFilter === "all" || s.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [servicesList, search, categoryFilter, statusFilter]);

  // Aggregate Metrics
  const totalProviders = useMemo(() => {
    return servicesList.reduce((acc, s) => acc + (Number(s.count) || 0), 0);
  }, [servicesList]);

  const totalCompleted = useMemo(() => {
    return servicesList.reduce((acc, s) => acc + (Number(s.completedJobs) || 0), 0);
  }, [servicesList]);

  // Handlers
  const handleToggleStatus = (id, currentStatus, name) => {
    const next = currentStatus === "active" ? "paused" : "active";
    setServicesList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: next } : s))
    );
    if (next === "paused") {
      toast.warning(`Service "${name}" paused.`);
    } else {
      toast.success(`Service "${name}" activated!`);
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the active service catalog?`)) {
      setServicesList((prev) => prev.filter((s) => s.id !== id));
      toast.info(`Service "${name}" removed.`);
    }
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    setServicesList((prev) =>
      prev.map((s) => (s.id === editModal.id ? editModal : s))
    );
    toast.success(`Service "${editModal.name}" updated successfully!`);
    setEditModal(null);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newService.name.trim()) {
      toast.error("Please enter a service name");
      return;
    }

    const catTitle =
      newService.category === "individual"
        ? "Individual services"
        : newService.category === "shg"
        ? "SHG services"
        : "Community services";

    const created = {
      id: `svc-${Date.now()}`,
      name: newService.name.trim(),
      category: newService.category,
      categoryTitle: catTitle,
      count: 1,
      basePrice: Number(newService.basePrice) || 350,
      priceUnit: newService.priceUnit,
      completedJobs: 0,
      status: "active",
      zeroCommission: true,
      description: newService.description.trim() || `Verified rural ${newService.name.toLowerCase()} service on Karya.`,
    };

    setServicesList((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewService({
      name: "",
      category: "individual",
      basePrice: 400,
      priceUnit: "day",
      description: "",
    });
    toast.success(`New service "${created.name}" created!`);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl sm:text-3xl text-charcoal dark:text-dark-text font-bold">
              Services Catalog
            </h1>
            <span className="text-xs font-bold uppercase tracking-wider bg-olive-100 dark:bg-olive-900/40 text-olive-800 dark:text-olive-300 px-3 py-0.5 rounded-full border border-olive-300/40">
              Zero-Commission
            </span>
          </div>
          <p className="text-charcoal/65 dark:text-dark-muted text-xs sm:text-sm mt-1">
            Standardized trades, price benchmarks, category taxonomy &amp; provider allocation across blocks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-olive-700 hover:bg-olive-800 text-white shadow-xs transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Add New Service</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Total Services</span>
            <Settings2 size={16} className="text-olive-700 dark:text-olive-400" />
          </div>
          <div className="text-2xl font-bold font-display text-charcoal dark:text-dark-text">
            {servicesList.length} Trades
          </div>
          <div className="text-[11px] text-charcoal/50 dark:text-dark-muted mt-0.5">
            Across 3 main sectors
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Active Specialists</span>
            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-display text-charcoal dark:text-dark-text">
            {totalProviders} Providers
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
            100% Direct Village Bookings
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Jobs Delivered</span>
            <Hammer size={16} className="text-terracotta-600 dark:text-terracotta-400" />
          </div>
          <div className="text-2xl font-bold font-display text-charcoal dark:text-dark-text">
            {totalCompleted.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-charcoal/50 dark:text-dark-muted mt-0.5">
            Cumulative completed
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Platform Commission</span>
            <IndianRupee size={16} className="text-olive-700 dark:text-olive-400" />
          </div>
          <div className="text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400">
            0% (Zero)
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
            100% Payout to rural artisans
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative w-full md:flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-dark-muted" />
            <input
              type="text"
              placeholder="Search service name, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal dark:hover:text-dark-text"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none"
            >
              <option value="all">All Sectors</option>
              <option value="individual">Individual Services</option>
              <option value="shg">SHG Services</option>
              <option value="community">Community Services</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Service Catalog Table */}
      <div className="bg-cream-card dark:bg-dark-card rounded-2xl border border-charcoal/10 dark:border-dark-border overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-charcoal/5 dark:bg-dark-bg/60 border-b border-charcoal/10 dark:border-dark-border text-charcoal/70 dark:text-dark-muted font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Service &amp; Trade</th>
                <th className="py-3.5 px-4">Sector Category</th>
                <th className="py-3.5 px-4">Base Rate</th>
                <th className="py-3.5 px-4">Active Providers</th>
                <th className="py-3.5 px-4">Jobs Completed</th>
                <th className="py-3.5 px-4">Platform Cut</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5 dark:divide-dark-border">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-charcoal/50 dark:text-dark-muted">
                    No services found matching filters.
                  </td>
                </tr>
              ) : (
                filteredServices.map((s) => (
                  <tr key={s.id} className="hover:bg-charcoal/2 dark:hover:bg-dark-bg/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-charcoal dark:text-dark-text">
                        {s.name}
                      </div>
                      <div className="text-[10px] text-charcoal/50 dark:text-dark-muted line-clamp-1 max-w-[220px]">
                        {s.description}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border text-charcoal/80 dark:text-dark-muted">
                        {s.categoryTitle}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-charcoal dark:text-dark-text flex items-center gap-0.5">
                        <IndianRupee size={12} />
                        <span>{s.basePrice}</span>
                        <span className="text-[10px] font-normal text-charcoal/55 dark:text-dark-muted">
                          /{s.priceUnit}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-charcoal dark:text-dark-text">
                        {s.count}
                      </span>
                      <span className="text-[10px] text-charcoal/50 dark:text-dark-muted ml-1">
                        workers
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-charcoal dark:text-dark-text">
                        {s.completedJobs}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40">
                        0% (Direct)
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          s.status === "active"
                            ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300"
                            : "bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditModal({ ...s })}
                          title="Edit Service"
                          className="p-1.5 rounded-lg text-charcoal/60 dark:text-dark-muted hover:text-olive-800 dark:hover:text-olive-300 hover:bg-charcoal/5 dark:hover:bg-dark-bg cursor-pointer"
                        >
                          <Edit3 size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(s.id, s.status, s.name)}
                          title={s.status === "active" ? "Pause Service" : "Activate Service"}
                          className={`p-1.5 rounded-lg cursor-pointer ${
                            s.status === "active"
                              ? "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50"
                              : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                          }`}
                        >
                          {s.status === "active" ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(s.id, s.name)}
                          title="Delete Service"
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Edit Service Modal */}
      <AdminModal isOpen={!!editModal} onClose={() => setEditModal(null)}>
        {editModal && (
          <>
            <div className="px-6 sm:px-8 py-5 border-b border-charcoal/10 dark:border-dark-border flex items-center justify-between shrink-0 bg-cream/40 dark:bg-dark-surface/50">
              <div>
                <h3 className="font-display font-bold text-xl text-charcoal dark:text-dark-text">
                  Edit Service Details
                </h3>
                <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-0.5">
                  Update benchmark rates, billing unit and service scope.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditModal(null)}
                className="p-2 rounded-xl text-charcoal/50 hover:text-charcoal hover:bg-charcoal/10 dark:text-dark-muted dark:hover:text-dark-text dark:hover:bg-dark-border transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSave} className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                      Service Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editModal.name}
                      onChange={(e) => setEditModal({ ...editModal, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                      Base Benchmark Rate (₹)
                    </label>
                    <input
                      type="number"
                      value={editModal.basePrice}
                      onChange={(e) => setEditModal({ ...editModal, basePrice: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                      Billing Unit
                    </label>
                    <select
                      value={editModal.priceUnit}
                      onChange={(e) => setEditModal({ ...editModal, priceUnit: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                    >
                      <option value="hour">per hour</option>
                      <option value="day">per day</option>
                      <option value="job">per job</option>
                      <option value="piece">per piece</option>
                      <option value="visit">per visit</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                      Description
                    </label>
                    <textarea
                      rows={5}
                      value={editModal.description}
                      onChange={(e) => setEditModal({ ...editModal, description: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 sm:px-8 py-4 border-t border-charcoal/10 dark:border-dark-border flex items-center justify-end gap-3 shrink-0 bg-cream/40 dark:bg-dark-surface/50">
                <button
                  type="button"
                  onClick={() => setEditModal(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-charcoal/10 hover:bg-charcoal/15 dark:bg-dark-border dark:hover:bg-dark-border/80 text-charcoal dark:text-dark-text transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-olive-700 hover:bg-olive-800 text-white shadow-xs transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </>
        )}
      </AdminModal>

      {/* 6. Add Service Modal */}
      <AdminModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <div className="px-6 sm:px-8 py-5 border-b border-charcoal/10 dark:border-dark-border flex items-center justify-between shrink-0 bg-cream/40 dark:bg-dark-surface/50">
          <div>
            <h3 className="font-display font-bold text-xl text-charcoal dark:text-dark-text">
              Add New Service Trade
            </h3>
            <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-0.5">
              Register a new verified vocational service with standard benchmark rates.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(false)}
            className="p-2 rounded-xl text-charcoal/50 hover:text-charcoal hover:bg-charcoal/10 dark:text-dark-muted dark:hover:text-dark-text dark:hover:bg-dark-border transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleAddSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solar Pump Maintenance"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                  Sector Category
                </label>
                <select
                  value={newService.category}
                  onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                >
                  <option value="individual">Individual Services</option>
                  <option value="shg">SHG Services</option>
                  <option value="community">Community Services</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                  Benchmark Price (₹)
                </label>
                <input
                  type="number"
                  value={newService.basePrice}
                  onChange={(e) => setNewService({ ...newService, basePrice: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                  Billing Unit
                </label>
                <select
                  value={newService.priceUnit}
                  onChange={(e) => setNewService({ ...newService, priceUnit: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                >
                  <option value="day">per day</option>
                  <option value="hour">per hour</option>
                  <option value="job">per job</option>
                  <option value="piece">per piece</option>
                  <option value="visit">per visit</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                  Description
                </label>
                <textarea
                  rows={5}
                  placeholder="Describe scope of work and tools required..."
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                />
              </div>
            </div>
          </div>

          <div className="px-6 sm:px-8 py-4 border-t border-charcoal/10 dark:border-dark-border flex items-center justify-end gap-3 shrink-0 bg-cream/40 dark:bg-dark-surface/50">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-charcoal/10 hover:bg-charcoal/15 dark:bg-dark-border dark:hover:bg-dark-border/80 text-charcoal dark:text-dark-text transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-olive-700 hover:bg-olive-800 text-white shadow-xs transition-colors cursor-pointer"
            >
              Publish Service
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
