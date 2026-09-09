import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, CheckCircle, Clock, AlertCircle,
  Download, Check, X
} from "lucide-react";
import Button from "../ui/Button";

export default function DashboardSubpage({
  title,
  subtitle,
  category,
  initialData = [],
  actionLabel = "New Entry",
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [items, setItems] = useState(() => {
    if (initialData.length > 0) return initialData;
    return [
      {
        id: "1",
        title: `${category || "Service"} Order #892`,
        subtitle: "Rampur Cluster · Priority Assignment",
        date: "Today, 10:30 AM",
        amount: "₹650",
        status: "active",
        user: "Aarav Sharma",
      },
      {
        id: "2",
        title: `${category || "Maintenance"} Task #841`,
        subtitle: "Verified Worker Scheduled",
        date: "Yesterday",
        amount: "₹1,200",
        status: "completed",
        user: "Sunita Devi (SHG)",
      },
      {
        id: "3",
        title: `${category || "Verification"} Submission #779`,
        subtitle: "Aadhaar & Skill Checklist Verified",
        date: "Sep 04, 2026",
        amount: "₹450",
        status: "pending",
        user: "Ramesh Kumar",
      },
    ];
  });

  const [selectedItem, setSelectedItem] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleStatusChange = (id, newStatus) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    showToast(`Status updated to ${newStatus.toUpperCase()}`);
    setSelectedItem(null);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(search.toLowerCase()) ||
      (item.user && item.user.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filter === "all" || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-charcoal">{title}</h1>
          <p className="text-sm text-charcoal/60 mt-1">{subtitle}</p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            const newItem = {
              id: `${Date.now()}`,
              title: `New ${title.slice(0, -1) || "Item"} #${Math.floor(100 + Math.random() * 900)}`,
              subtitle: "Created via App Action",
              date: "Just now",
              amount: "₹800",
              status: "active",
              user: "Current User",
            };
            setItems((prev) => [newItem, ...prev]);
            showToast("New item created successfully!");
          }}
          className="self-start sm:self-auto"
        >
          <Plus size={16} /> {actionLabel}
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-cream-card rounded-2xl p-3 border border-charcoal/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search records or users..."
            className="w-full bg-cream rounded-xl pl-9 pr-4 py-2 text-xs outline-none border border-charcoal/10 focus:border-olive-600 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["all", "active", "completed", "pending"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                filter === f
                  ? "bg-olive-700 text-cream shadow-xs"
                  : "bg-cream text-charcoal/60 border border-charcoal/10 hover:text-charcoal"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-cream-card rounded-3xl p-10 text-center border border-charcoal/5">
            <p className="text-sm text-charcoal/50">No records found matching your filters.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              className="bg-cream-card rounded-2xl p-4 sm:p-5 border border-charcoal/5 hover:border-olive-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
            >
              <div className="flex items-start gap-3.5">
                <span
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                    item.status === "completed"
                      ? "bg-emerald-100 text-emerald-800"
                      : item.status === "active"
                      ? "bg-olive-100 text-olive-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {item.status === "completed" ? (
                    <CheckCircle size={18} />
                  ) : item.status === "active" ? (
                    <Clock size={18} />
                  ) : (
                    <AlertCircle size={18} />
                  )}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-charcoal">{item.title}</h3>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        item.status === "completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "active"
                          ? "bg-olive-100 text-olive-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal/60 mt-0.5">{item.subtitle}</p>
                  <p className="text-[11px] text-charcoal/40 mt-1">
                    {item.date} {item.user && `· By ${item.user}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-charcoal/5">
                <span className="font-display font-semibold text-base text-charcoal">
                  {item.amount}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="px-3 py-1.5 rounded-xl bg-cream border border-charcoal/15 hover:border-olive-600 text-xs text-charcoal font-medium transition-colors"
                  >
                    Manage
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Item Action Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-charcoal/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-cream rounded-3xl p-6 shadow-2xl border border-charcoal/10 z-10 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-display text-lg text-charcoal">{selectedItem.title}</h3>
                  <p className="text-xs text-charcoal/60">{selectedItem.subtitle}</p>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1 rounded-full text-charcoal/50 hover:text-charcoal"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="bg-cream-card rounded-2xl p-3.5 text-xs space-y-1.5 border border-charcoal/5">
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Amount:</span>
                  <span className="font-bold text-charcoal">{selectedItem.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Timestamp:</span>
                  <span>{selectedItem.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Current Status:</span>
                  <span className="uppercase font-semibold text-olive-800">{selectedItem.status}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  onClick={() => handleStatusChange(selectedItem.id, "completed")}
                  className="w-full text-xs py-2.5"
                >
                  <Check size={14} /> Mark as Completed
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange(selectedItem.id, "active")}
                  className="w-full text-xs py-2.5"
                >
                  <Clock size={14} /> Set In-Progress
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => showToast("Receipt downloaded")}
                  className="w-full text-xs py-2"
                >
                  <Download size={14} /> Download Summary
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-olive-950 text-cream px-4 py-2.5 rounded-full text-xs font-semibold shadow-xl border border-olive-700 flex items-center gap-2"
          >
            <CheckCircle size={14} className="text-emerald-400" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
