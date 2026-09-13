import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ShoppingBag, Search, Plus, CheckCircle2, Clock, Truck,
  Phone, Mail, MapPin, CreditCard, ShieldCheck, Copy, Check,
  ChevronDown, ChevronUp, Package, X, Sparkles, ExternalLink,
  Printer, ArrowUpRight, FileText, AlertCircle
} from "lucide-react";
import { SHG_ORDERS_DATA } from "../../data/shgDashboardData";
import Button from "../../components/ui/Button";

export default function SHGOrders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterParam = searchParams.get("filter");
  const actionParam = searchParams.get("action");

  const [orders, setOrders] = useState(() => SHG_ORDERS_DATA);
  const [activeTab, setActiveTab] = useState(
    filterParam === "pending" ? "pending" : "all"
  );
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [toast, setToast] = useState(null);

  // Modals
  const [showAddProductModal, setShowAddProductModal] = useState(actionParam === "add-product");
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [viewingOrderDetails, setViewingOrderDetails] = useState(null);

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    title: "",
    category: "Handloom & Textiles",
    price: "",
    stock: "",
    sku: "",
    artisanLead: "Sunita Devi (Master Weaver)",
    description: "",
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (filterParam === "pending") {
      setActiveTab("pending");
    }
  }, [filterParam]);

  useEffect(() => {
    if (actionParam === "add-product") {
      setShowAddProductModal(true);
    }
  }, [actionParam]);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast(`Copied ${text} to clipboard`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUpdateStatus = (orderId, nextStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const nowFormatted = "Just now, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return {
            ...ord,
            status: nextStatus,
            deliveredDate: nextStatus === "completed" ? nowFormatted : ord.deliveredDate,
            paymentStatus: nextStatus === "completed" ? "Paid & Settled · Collective Account" : ord.paymentStatus,
          };
        }
        return ord;
      })
    );
    if (viewingOrderDetails && viewingOrderDetails.id === orderId) {
      setViewingOrderDetails((prev) => ({
        ...prev,
        status: nextStatus,
        deliveredDate: nextStatus === "completed" ? "Just now" : prev.deliveredDate,
      }));
    }
    showToast(`Order #${orderId} marked as ${nextStatus.toUpperCase()}`);
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price) {
      showToast("Please enter product name and price");
      return;
    }

    const newOrd = {
      id: `SHG-ORD-${Math.floor(1090 + Math.random() * 90)}`,
      title: `${newProduct.title} (Batch of 5)`,
      productName: newProduct.title,
      subtitle: `${newProduct.category} · Assigned to ${newProduct.artisanLead}`,
      date: "Just now",
      dateTime: "Today, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amount: `₹${newProduct.price}`,
      quantity: `${newProduct.stock || 5} Listed Units`,
      status: "active",
      user: "Karya Regional Hub Inventory",
      customerName: "Karya Regional Warehouse",
      customerPhone: "+91 89205 75456",
      customerEmail: "warehouse.mp@karya.org",
      deliveryLocation: "Karya Hub Logistics Center, Chanderi Road, Ashoknagar - 473331",
      landmark: "Opposite Zila Panchayat Gate 2",
      paymentStatus: "Catalog Listed · Ready for Dispatch",
      transactionId: `TXN-CAT-${Date.now().toString().slice(-8)}`,
      deliveredDate: "Ready for orders",
      dispatchMode: "Local Hub Consignment",
      trackingNumber: "HUB-STOCK-ACTIVE",
      packagingNotes: newProduct.description || "Fresh collective handcrafted production",
      artisanLead: newProduct.artisanLead,
    };

    setOrders((prev) => [newOrd, ...prev]);
    setShowAddProductModal(false);
    setNewProduct({
      title: "",
      category: "Handloom & Textiles",
      price: "",
      stock: "",
      sku: "",
      artisanLead: "Sunita Devi (Master Weaver)",
      description: "",
    });
    showToast("New Product listed into SHG catalog & orders pipeline!");
  };

  const filteredOrders = orders.filter((ord) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && ord.status === "pending") ||
      (activeTab === "active" && ord.status === "active") ||
      (activeTab === "completed" && ord.status === "completed");

    const query = search.toLowerCase();
    const matchesSearch =
      ord.id.toLowerCase().includes(query) ||
      (ord.productName && ord.productName.toLowerCase().includes(query)) ||
      (ord.customerName && ord.customerName.toLowerCase().includes(query)) ||
      (ord.customerPhone && ord.customerPhone.toLowerCase().includes(query)) ||
      (ord.customerEmail && ord.customerEmail.toLowerCase().includes(query)) ||
      (ord.transactionId && ord.transactionId.toLowerCase().includes(query)) ||
      (ord.deliveryLocation && ord.deliveryLocation.toLowerCase().includes(query));

    return matchesTab && matchesSearch;
  });

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const activeCount = orders.filter((o) => o.status === "active").length;
  const completedCount = orders.filter((o) => o.status === "completed").length;

  const getAvatarBg = (idx) => {
    const colors = [
      "bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
      "bg-purple-600/20 text-purple-700 dark:text-purple-300 border-purple-500/30",
      "bg-amber-600/20 text-amber-700 dark:text-amber-300 border-amber-500/30",
      "bg-blue-600/20 text-blue-700 dark:text-blue-300 border-blue-500/30",
      "bg-olive-600/20 text-olive-700 dark:text-olive-300 border-olive-500/30",
    ];
    return colors[idx % colors.length];
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-charcoal text-cream text-xs font-bold shadow-elevation-3 border border-charcoal/20 flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <CheckCircle2 size={14} className="text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Banner & Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-charcoal/10 dark:border-dark-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-olive-100 dark:bg-olive-950/60 text-olive-800 dark:text-olive-300 text-[11px] font-bold mb-1.5">
            <ShoppingBag size={12} />
            <span>Customer Consignments &amp; Orders Roster</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal dark:text-dark-text">
            Customer Product Orders
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted mt-0.5">
            Monitor incoming customer product orders, customer profiles, payment statuses, and shipment logistics.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            size="sm"
            onClick={() => setShowAddProductModal(true)}
            className="flex items-center gap-1.5"
          >
            <Plus size={15} />
            <span>Add Product</span>
          </Button>
        </div>
      </div>

      {/* Quick Summary Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setActiveTab("all")}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            activeTab === "all"
              ? "bg-cream dark:bg-dark-surface border-olive-600 dark:border-olive-400 shadow-xs"
              : "bg-white dark:bg-dark-card border-charcoal/10 dark:border-dark-border hover:border-charcoal/20"
          }`}
        >
          <p className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted">Total Orders</p>
          <p className="font-display text-xl sm:text-2xl font-bold text-charcoal dark:text-dark-text mt-0.5">
            {orders.length}
          </p>
          <span className="text-[10px] text-olive-700 dark:text-olive-400 font-bold">All Lifecycles</span>
        </div>

        <div
          onClick={() => setActiveTab("pending")}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            activeTab === "pending"
              ? "bg-amber-50 dark:bg-amber-950/40 border-amber-500 shadow-xs"
              : "bg-white dark:bg-dark-card border-charcoal/10 dark:border-dark-border hover:border-amber-400/40"
          }`}
        >
          <p className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400">Pending Approval</p>
          <p className="font-display text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
            {pendingCount}
          </p>
          <span className="text-[10px] text-amber-600 font-bold">Action Needed</span>
        </div>

        <div
          onClick={() => setActiveTab("active")}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            activeTab === "active"
              ? "bg-olive-50 dark:bg-olive-950/40 border-olive-500 shadow-xs"
              : "bg-white dark:bg-dark-card border-charcoal/10 dark:border-dark-border hover:border-olive-400/40"
          }`}
        >
          <p className="text-[10px] uppercase font-bold text-olive-700 dark:text-olive-400">Active / In Transit</p>
          <p className="font-display text-xl sm:text-2xl font-bold text-olive-700 dark:text-olive-300 mt-0.5">
            {activeCount}
          </p>
          <span className="text-[10px] text-olive-600 font-bold">En Route</span>
        </div>

        <div
          onClick={() => setActiveTab("completed")}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            activeTab === "completed"
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-xs"
              : "bg-white dark:bg-dark-card border-charcoal/10 dark:border-dark-border hover:border-emerald-400/40"
          }`}
        >
          <p className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">Completed</p>
          <p className="font-display text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {completedCount}
          </p>
          <span className="text-[10px] text-emerald-600 font-bold">Delivered &amp; Settled</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="p-3 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "all", label: `All (${orders.length})` },
            { id: "pending", label: `Pending (${pendingCount})` },
            { id: "active", label: `In Transit (${activeCount})` },
            { id: "completed", label: `Completed (${completedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchParams({});
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-olive-800 text-cream shadow-xs"
                  : "bg-cream/60 dark:bg-dark-surface text-charcoal/70 dark:text-dark-text hover:bg-cream"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:flex-1 sm:max-w-md md:max-w-lg lg:max-w-2xl">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer, ID, phone, city..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-sm text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600 shadow-xs placeholder:text-charcoal/40 dark:placeholder:text-dark-muted"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Orders Table Structure (Compact Order Size) */}
      <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-elevation-1 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[960px]">
            <thead>
              <tr className="border-b border-charcoal/10 dark:border-dark-border bg-cream/50 dark:bg-dark-surface/80">
                <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-charcoal/60 dark:text-dark-muted">
                  PRODUCT / CONSIGNMENT
                </th>
                <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-charcoal/60 dark:text-dark-muted">
                  CUSTOMER
                </th>
                <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-charcoal/60 dark:text-dark-muted">
                  DELIVERY LOCATION
                </th>
                <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-charcoal/60 dark:text-dark-muted">
                  AMOUNT &amp; TXN
                </th>
                <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-charcoal/60 dark:text-dark-muted">
                  STATUS
                </th>
                <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-charcoal/60 dark:text-dark-muted text-right">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5 dark:divide-dark-border text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-charcoal/50 dark:text-dark-muted">
                    No matching orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord, idx) => (
                  <tr
                    key={ord.id}
                    className="hover:bg-cream/25 dark:hover:bg-dark-surface/50 transition-colors group"
                  >
                    {/* Column 1: Order & Product with Avatar Initial (Compact Size) */}
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg font-display font-bold text-xs flex items-center justify-center shrink-0 border ${getAvatarBg(idx)}`}>
                          {(ord.productName || ord.title).charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 max-w-[200px] sm:max-w-xs">
                          <p className="font-bold text-xs sm:text-sm text-charcoal dark:text-dark-text truncate">
                            {ord.productName || ord.title}
                          </p>
                          <p className="text-[10px] text-charcoal/50 dark:text-dark-muted flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono font-bold text-charcoal/70 dark:text-dark-text">#{ord.id}</span>
                            <span>•</span>
                            <span>{ord.dateTime || ord.date}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Customer Contact Info */}
                    <td className="px-4 py-2.5">
                      <p className="font-semibold text-xs text-charcoal dark:text-dark-text">
                        {ord.customerName || ord.user}
                      </p>
                      <p className="font-mono text-[10px] text-charcoal/50 dark:text-dark-muted mt-0.5 flex items-center gap-1">
                        <Phone size={10} className="text-olive-600 shrink-0" />
                        <span>{ord.customerPhone || "+91 98112 44921"}</span>
                      </p>
                    </td>

                    {/* Column 3: Delivery Location */}
                    <td className="px-4 py-2.5 max-w-[220px]">
                      <p className="font-semibold text-xs text-charcoal dark:text-dark-text truncate flex items-center gap-1">
                        <MapPin size={10} className="text-amber-500 shrink-0" />
                        <span className="truncate">{ord.deliveryLocation || "New Delhi - 110001"}</span>
                      </p>
                      {ord.landmark && (
                        <p className="text-[10px] text-charcoal/50 dark:text-dark-muted truncate mt-0.5">
                          Near: {ord.landmark}
                        </p>
                      )}
                    </td>

                    {/* Column 4: Amount & Transaction ID (Pill styled) */}
                    <td className="px-4 py-2.5">
                      <div className="space-y-0.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-charcoal/5 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border font-mono font-bold text-olive-800 dark:text-olive-300 text-[11px]">
                          <span>{ord.amount}</span>
                        </span>
                        <div className="flex items-center gap-1 font-mono text-[10px] text-charcoal/50 dark:text-dark-muted">
                          <span className="truncate max-w-[85px]">{ord.transactionId || "TXN-UPI"}</span>
                          <button
                            onClick={() => handleCopy(ord.transactionId || "TXN-UPI-9841289410", ord.id)}
                            title="Copy Transaction ID"
                            className="hover:text-charcoal cursor-pointer"
                          >
                            {copiedId === ord.id ? <Check size={10} className="text-emerald-600" /> : <Copy size={10} />}
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Column 5: Status Badge */}
                    <td className="px-4 py-2.5">
                      <div className="space-y-0.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          ord.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25"
                            : ord.status === "active"
                            ? "bg-olive-500/10 text-olive-700 dark:text-olive-400 border-olive-500/25"
                            : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1 ${
                            ord.status === "completed"
                              ? "bg-emerald-500"
                              : ord.status === "active"
                              ? "bg-olive-500 animate-pulse"
                              : "bg-amber-500"
                          }`} />
                          {ord.status === "completed" ? "Completed" : ord.status === "active" ? "In Transit" : "Pending"}
                        </span>
                        <p className="text-[10px] text-charcoal/50 dark:text-dark-muted">
                          {ord.deliveredDate}
                        </p>
                      </div>
                    </td>

                    {/* Column 6: Actions Toolbar (Compact Buttons) */}
                    <td className="px-4 py-2.5 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => setSelectedInvoiceOrder(ord)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25 text-[11px] font-bold transition-all active:scale-95 cursor-pointer"
                          title="Print / View Dispatch Slip"
                        >
                          <Printer size={11} />
                          <span>Slip</span>
                        </button>

                        <button
                          onClick={() => setViewingOrderDetails(ord)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-500/25 text-[11px] font-bold transition-all active:scale-95 cursor-pointer"
                          title="View Full Customer &amp; Order Details"
                        >
                          <ExternalLink size={11} />
                          <span>Details</span>
                        </button>

                        <a
                          href={`https://wa.me/${(ord.customerPhone || "").replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/25 text-[11px] font-bold transition-all active:scale-95 cursor-pointer"
                          title="WhatsApp / Contact Customer"
                        >
                          <Phone size={11} />
                          <span>Contact</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Full Order Details Modal */}
      {viewingOrderDetails && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white dark:bg-dark-card rounded-3xl p-6 sm:p-7 shadow-elevation-3 border border-charcoal/10 dark:border-dark-border space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-charcoal/10 dark:border-dark-border">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-olive-700 text-cream flex items-center justify-center font-mono font-bold text-xs">
                  ORD
                </span>
                <div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-charcoal dark:text-dark-text">
                    Order #{viewingOrderDetails.id}
                  </h3>
                  <p className="text-xs text-charcoal/50 dark:text-dark-muted">
                    Placed: {viewingOrderDetails.dateTime || viewingOrderDetails.date}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingOrderDetails(null)}
                className="p-1.5 rounded-xl hover:bg-cream dark:hover:bg-dark-surface text-charcoal/50 hover:text-charcoal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Product Info Banner */}
              <div className="p-4 rounded-2xl bg-cream/40 dark:bg-dark-surface/50 border border-charcoal/5 dark:border-dark-border space-y-1">
                <p className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted">Product Ordered</p>
                <h4 className="font-bold text-sm text-charcoal dark:text-dark-text">
                  {viewingOrderDetails.productName || viewingOrderDetails.title}
                </h4>
                <div className="flex flex-wrap items-center justify-between pt-2 border-t border-charcoal/5 dark:border-dark-border text-xs">
                  <span className="text-charcoal/60 dark:text-dark-muted">
                    Quantity: <strong className="text-charcoal dark:text-dark-text">{viewingOrderDetails.quantity || "10 Units"}</strong>
                  </span>
                  <span className="font-display font-bold text-base text-olive-800 dark:text-olive-300">
                    {viewingOrderDetails.amount}
                  </span>
                </div>
              </div>

              {/* Customer Contact Card */}
              <div className="p-4 rounded-2xl bg-cream/40 dark:bg-dark-surface/50 border border-charcoal/5 dark:border-dark-border space-y-2.5">
                <p className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted flex items-center gap-1.5">
                  <Phone size={11} className="text-olive-600" />
                  <span>Customer Profile &amp; Delivery Address</span>
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-charcoal/50 dark:text-dark-muted">Name:</span>
                    <p className="font-bold text-charcoal dark:text-dark-text">{viewingOrderDetails.customerName || viewingOrderDetails.user}</p>
                  </div>
                  <div>
                    <span className="text-charcoal/50 dark:text-dark-muted">Phone:</span>
                    <p className="font-mono font-bold text-olive-800 dark:text-olive-300">{viewingOrderDetails.customerPhone}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-charcoal/50 dark:text-dark-muted">Email:</span>
                    <p className="font-mono text-charcoal dark:text-dark-text">{viewingOrderDetails.customerEmail}</p>
                  </div>
                  <div className="col-span-2 p-2.5 rounded-xl bg-white dark:bg-dark-card border border-charcoal/5 dark:border-dark-border">
                    <span className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted">Delivery Address:</span>
                    <p className="font-medium text-charcoal dark:text-dark-text mt-0.5 leading-relaxed">
                      {viewingOrderDetails.deliveryLocation}
                    </p>
                    {viewingOrderDetails.landmark && (
                      <p className="text-[11px] text-charcoal/60 dark:text-dark-muted mt-0.5">
                        Landmark: {viewingOrderDetails.landmark}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment & Tracking Details */}
              <div className="p-4 rounded-2xl bg-olive-50 dark:bg-olive-950/40 border border-olive-200 dark:border-olive-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-olive-900 dark:text-olive-200 flex items-center gap-1">
                    <ShieldCheck size={13} className="text-emerald-600" />
                    <span>Payment Status: {viewingOrderDetails.paymentStatus}</span>
                  </span>
                  <span className="font-mono font-bold text-olive-800 dark:text-olive-300">
                    {viewingOrderDetails.transactionId}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-charcoal/70 dark:text-dark-muted">
                  <span>Dispatch Carrier: {viewingOrderDetails.dispatchMode || "India Post"}</span>
                  <span className="font-mono">Tracking: {viewingOrderDetails.trackingNumber || "N/A"}</span>
                </div>
                <p className="text-[11px] text-charcoal/60 dark:text-dark-muted">
                  Packaging: {viewingOrderDetails.packagingNotes || "NRLM certified tamper-proof packaging"}
                </p>
              </div>
            </div>

            {/* Lifecycle Status Updater in Modal */}
            <div className="pt-3 border-t border-charcoal/10 dark:border-dark-border flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-charcoal/60">Status:</span>
                {viewingOrderDetails.status !== "active" && (
                  <button
                    onClick={() => handleUpdateStatus(viewingOrderDetails.id, "active")}
                    className="px-2.5 py-1 rounded-xl bg-olive-100 hover:bg-olive-200 text-olive-900 text-xs font-bold"
                  >
                    Mark In-Transit
                  </button>
                )}
                {viewingOrderDetails.status !== "completed" && (
                  <button
                    onClick={() => handleUpdateStatus(viewingOrderDetails.id, "completed")}
                    className="px-2.5 py-1 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold"
                  >
                    Mark Delivered
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setViewingOrderDetails(null)}>
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedInvoiceOrder(viewingOrderDetails);
                    setViewingOrderDetails(null);
                  }}
                  className="flex items-center gap-1"
                >
                  <Printer size={13} />
                  <span>Print Slip</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable Dispatch Slip Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-dark-card rounded-3xl p-6 sm:p-8 shadow-elevation-3 border border-charcoal/10 dark:border-dark-border space-y-6">
            <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-charcoal dark:text-dark-text">Official Consignment Dispatch Slip</h3>
                <p className="text-xs text-charcoal/50 dark:text-dark-muted">Karya Fair-Trade NRLM Rural Collective</p>
              </div>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="p-1 rounded-lg hover:bg-cream dark:hover:bg-dark-surface"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-cream/50 dark:bg-dark-surface/60 border border-charcoal/10 dark:border-dark-border space-y-3 text-xs">
              <div className="flex justify-between font-mono">
                <span className="text-charcoal/50 dark:text-dark-muted">Order Reference:</span>
                <span className="font-bold text-charcoal dark:text-dark-text">#{selectedInvoiceOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/50 dark:text-dark-muted">Product:</span>
                <span className="font-semibold text-charcoal dark:text-dark-text">{selectedInvoiceOrder.productName || selectedInvoiceOrder.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/50 dark:text-dark-muted">Customer Name:</span>
                <span className="font-bold text-charcoal dark:text-dark-text">{selectedInvoiceOrder.customerName || selectedInvoiceOrder.user}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/50 dark:text-dark-muted">Contact Phone:</span>
                <span className="font-mono text-charcoal dark:text-dark-text">{selectedInvoiceOrder.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/50 dark:text-dark-muted">Delivery Location:</span>
                <span className="text-right max-w-xs text-charcoal dark:text-dark-text">{selectedInvoiceOrder.deliveryLocation}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-charcoal/50 dark:text-dark-muted">Transaction ID:</span>
                <span className="font-bold text-charcoal dark:text-dark-text">{selectedInvoiceOrder.transactionId}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-charcoal/10 dark:border-dark-border font-bold text-sm">
                <span className="text-charcoal dark:text-dark-text">Amount Settled:</span>
                <span className="text-olive-800 dark:text-olive-300">{selectedInvoiceOrder.amount}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button size="sm" variant="outline" onClick={() => setSelectedInvoiceOrder(null)}>
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  window.print();
                }}
                className="flex items-center gap-1.5"
              >
                <Printer size={14} />
                <span>Print Slip</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-dark-card rounded-3xl p-6 sm:p-7 shadow-elevation-3 border border-charcoal/10 dark:border-dark-border space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-charcoal/10 dark:border-dark-border">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-olive-100 dark:bg-olive-950 text-olive-800 dark:text-olive-300 flex items-center justify-center">
                  <Package size={16} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-charcoal dark:text-dark-text">
                    Add New Product to Catalog
                  </h3>
                  <p className="text-xs text-charcoal/50 dark:text-dark-muted">
                    List handcrafted items for regional buyers &amp; direct consignments
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="p-1.5 rounded-xl hover:bg-cream dark:hover:bg-dark-surface text-charcoal/50 hover:text-charcoal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1">
                  Product / Craft Title *
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  placeholder="e.g. Chanderi Handloom Cotton Silk Saree"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1">
                    Craft Category
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600"
                  >
                    <option value="Handloom & Textiles">Handloom &amp; Textiles</option>
                    <option value="Forest Produce & Honey">Forest Produce &amp; Honey</option>
                    <option value="Terracotta & Pottery">Terracotta &amp; Pottery</option>
                    <option value="Folk Art & Canvas">Folk Art &amp; Canvas</option>
                    <option value="Bamboo & Cane Craft">Bamboo &amp; Cane Craft</option>
                    <option value="Organic Agro Spices">Organic Agro Spices</option>
                    <option value="Traditional Village Catering">Village Catering</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1">
                    Unit Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="e.g. 1450"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1">
                    Initial Village Stock Quantity
                  </label>
                  <input
                    type="text"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    placeholder="e.g. 20 Pieces"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1">
                    Assigned Master Artisan Lead
                  </label>
                  <select
                    value={newProduct.artisanLead}
                    onChange={(e) => setNewProduct({ ...newProduct, artisanLead: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600"
                  >
                    <option value="Sunita Devi (Master Weaver)">Sunita Devi (Master Weaver)</option>
                    <option value="Radha Kol (Forest Produce Lead)">Radha Kol (Forest Produce Lead)</option>
                    <option value="Geeta Prajapati (Ceramic Kiln Lead)">Geeta Prajapati (Pottery Lead)</option>
                    <option value="Urmila Devi (Folk Art Coordinator)">Urmila Devi (Folk Art)</option>
                    <option value="Kanti Bai (Kitchen Lead)">Kanti Bai (Catering)</option>
                    <option value="Malati Barman (Bamboo Cell)">Malati Barman (Bamboo)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1">
                  Product Description &amp; Material Guarantee
                </label>
                <textarea
                  rows={2}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="e.g. 100% natural cotton handloom with vegetable dyes, woven on traditional pit looms."
                  className="w-full px-3.5 py-2 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddProductModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-olive-800 text-cream">
                  Add to Catalog &amp; Pipeline
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
