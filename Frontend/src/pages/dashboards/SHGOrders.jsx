import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ShoppingBag, Search, CheckCircle2, Clock, Truck,
  Check, X, FileText, AlertCircle
} from "lucide-react";
import { useToast } from "../../hooks/useToast";
import api from "../../utils/api";

export default function SHGOrders() {
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get("filter");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(
    filterParam === "pending" ? "pending" : "all"
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/shg/orders");
      setOrders(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch SHG orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filterParam === "pending") {
      setActiveTab("pending");
    }
  }, [filterParam]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesTab = activeTab === "all" || o.status === activeTab;
      
      const title = o.product?.title || o.service?.name || "";
      const customer = o.customer?.name || "";

      const matchesSearch =
        title.toLowerCase().includes(search.toLowerCase()) ||
        customer.toLowerCase().includes(search.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, search]);

  const handleUpdateStatus = async (orderId, nextStatus) => {
    try {
      // Assuming a booking status update route exists
      await api.patch(`/bookings/${orderId}/status`, { status: nextStatus });
      toast.success(`Order status updated to ${nextStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal dark:text-dark-text flex items-center gap-2">
            <ShoppingBag size={28} className="text-olive-700 dark:text-olive-500" />
            Order Management
          </h2>
          <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted mt-1">
            Track and fulfill incoming collective orders.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border rounded-2xl shadow-xs p-4 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex bg-charcoal/5 dark:bg-dark-surface p-1 rounded-xl w-full sm:w-auto">
          {["all", "pending", "in_progress", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[11px] font-bold capitalize transition-all ${
                activeTab === tab
                  ? "bg-white dark:bg-dark-card text-charcoal dark:text-dark-text shadow-sm"
                  : "text-charcoal/50 hover:text-charcoal"
              }`}
            >
              {tab.replace("_", " ")}
            </button>
          ))}
        </div>
        
        <div className="relative w-full sm:w-64 shrink-0">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-charcoal/5 dark:bg-dark-surface rounded-xl text-xs outline-none focus:ring-2 focus:ring-olive-500/20"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-3xl border border-charcoal/10 dark:border-dark-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-charcoal/50">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-charcoal/5 flex items-center justify-center mb-3">
                <ShoppingBag size={24} className="text-charcoal/20" />
              </div>
              <p className="font-bold text-charcoal dark:text-dark-text">No orders found</p>
              <p className="text-xs text-charcoal/50 mt-1">Try adjusting your filters.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal/5 dark:bg-dark-surface border-b border-charcoal/10 dark:border-dark-border text-[11px] uppercase font-bold text-charcoal/60 dark:text-dark-muted tracking-wider">
                <tr>
                  <th className="py-4 px-5">Item / Service</th>
                  <th className="py-4 px-5">Customer</th>
                  <th className="py-4 px-5">Amount</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5 dark:divide-dark-border">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-charcoal/2 dark:hover:bg-dark-surface/50 transition-colors">
                    <td className="py-4 px-5">
                      <p className="font-bold text-charcoal dark:text-dark-text">
                        {order.product?.title || order.service?.name || "Order"}
                      </p>
                      <p className="text-[10px] text-charcoal/50">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-4 px-5">
                      <p className="font-bold text-charcoal dark:text-dark-text">{order.customer?.name}</p>
                      <p className="text-[10px] text-charcoal/50">{order.customer?.phone}</p>
                    </td>
                    <td className="py-4 px-5 font-bold text-olive-700 dark:text-olive-400">
                      ₹{order.totalAmount}
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        order.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                        order.status === 'in_progress' ? 'bg-blue-50 text-blue-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {order.status === 'completed' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                        {order.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right space-x-2">
                      {order.status === "pending" && (
                        <button onClick={() => handleUpdateStatus(order._id, "in_progress")} className="px-3 py-1.5 bg-charcoal text-cream rounded-lg font-bold hover:bg-charcoal/90">
                          Accept
                        </button>
                      )}
                      {order.status === "in_progress" && (
                        <button onClick={() => handleUpdateStatus(order._id, "completed")} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700">
                          Mark Done
                        </button>
                      )}
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
