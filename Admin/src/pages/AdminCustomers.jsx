import { useState, useMemo, useEffect } from "react";
import {
  UserCheck, Search, Filter, ShieldCheck, CheckCircle2, XCircle,
  Plus, Edit3, Trash2, Eye, Phone, MapPin, Star,
  IndianRupee, X, Check, FileText, AlertCircle, ShoppingBag,
  Clock, Mail, MessageSquare, Send, RefreshCw
} from "lucide-react";
import { useToast } from "../hooks/useToast";
import AdminModal from "../components/ui/AdminModal";

const STORAGE_KEY = "karya_admin_customers_v1";

const INITIAL_CUSTOMERS = [
  {
    id: "cust-101",
    name: "Vikram Deshmukh",
    phone: "+91 98220 44512",
    email: "vikram.deshmukh@gmail.com",
    village: "Devgaon Main",
    type: "Individual Resident",
    totalBookings: 14,
    totalSpent: 12450,
    preferredMode: "UPI / PhonePe",
    status: "active",
    joinedDate: "14 Jan 2026",
    lastActive: "Today, 11:20 AM",
    recentOrders: [
      { id: "ord-881", title: "Solar Pump Wiring & Inverter Setup", date: "08 Sep 2026", amount: 1200, worker: "Mahesh Patil", status: "Completed" },
      { id: "ord-852", title: "Handloom Cotton Saree x2", date: "24 Aug 2026", amount: 2400, worker: "Maa Lakshmi SHG", status: "Delivered" },
    ],
  },
  {
    id: "cust-102",
    name: "Anita Kumari Roy",
    phone: "+91 97110 33490",
    email: "anita.roy@villagepost.in",
    village: "Rampur Block 2",
    type: "Individual Resident",
    totalBookings: 8,
    totalSpent: 4800,
    preferredMode: "Direct Cash",
    status: "active",
    joinedDate: "02 Feb 2026",
    lastActive: "Yesterday",
    recentOrders: [
      { id: "ord-810", title: "School Uniform Stitching (4 Sets)", date: "15 Aug 2026", amount: 1400, worker: "Sunita Devi", status: "Completed" },
    ],
  },
  {
    id: "cust-103",
    name: "Gramin Shala Vidyalaya (Headmaster Sharma)",
    phone: "+91 94140 22001",
    email: "shala.devgaon@edu.gov.in",
    village: "Devgaon School Road",
    type: "Institutional Buyer",
    totalBookings: 26,
    totalSpent: 48200,
    preferredMode: "Bank NEFT / DBT",
    status: "active",
    joinedDate: "20 Dec 2025",
    lastActive: "Today, 09:05 AM",
    recentOrders: [
      { id: "ord-910", title: "Mid-Day Meal Ragi Laddus & Pickles (50kg)", date: "02 Sep 2026", amount: 8500, worker: "Annapurna Kitchen SHG", status: "Delivered" },
      { id: "ord-874", title: "Classroom Desk Woodwork & Repair", date: "18 Aug 2026", amount: 3500, worker: "Ramesh Kumar", status: "Completed" },
    ],
  },
  {
    id: "cust-104",
    name: "Sanjay Borse",
    phone: "+91 98901 77218",
    email: "borse.agri@outlook.com",
    village: "Sonipur Farm Belt",
    type: "Farmer / Agriculturalist",
    totalBookings: 19,
    totalSpent: 16800,
    preferredMode: "Aadhaar AEPS Pay",
    status: "active",
    joinedDate: "10 Nov 2025",
    lastActive: "3 days ago",
    recentOrders: [
      { id: "ord-790", title: "Drip Irrigation Pipe Fitting & Filter Flush", date: "28 Aug 2026", amount: 1800, worker: "Ramesh Carpenter & Team", status: "Completed" },
    ],
  },
  {
    id: "cust-105",
    name: "Karan Johar Patel",
    phone: "+91 93210 11990",
    email: "karan.patel@yahoo.com",
    village: "Greenfields Township",
    type: "Urban / Semi-Urban Buyer",
    totalBookings: 5,
    totalSpent: 3200,
    preferredMode: "UPI / GooglePay",
    status: "suspended",
    joinedDate: "18 Jul 2026",
    lastActive: "1 week ago",
    recentOrders: [
      { id: "ord-710", title: "Terracotta Flower Pots (Pack of 6)", date: "10 Aug 2026", amount: 1200, worker: "Surya Handicrafts", status: "Cancelled" },
    ],
  },
  {
    id: "cust-106",
    name: "Priyanka Solanki",
    phone: "+91 99201 88402",
    email: "priyanka.solanki@gmail.com",
    village: "Rampura Market",
    type: "Individual Resident",
    totalBookings: 11,
    totalSpent: 9150,
    preferredMode: "UPI / Paytm",
    status: "active",
    joinedDate: "05 Mar 2026",
    lastActive: "Today, 02:45 PM",
    recentOrders: [
      { id: "ord-922", title: "Festive Blouse Designing & Zari Work", date: "09 Sep 2026", amount: 1100, worker: "Sunita Devi", status: "Completed" },
    ],
  },
];

export default function AdminCustomers() {
  const toast = useToast();

  const [customersList, setCustomersList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_CUSTOMERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customersList));
    } catch {
      // ignore
    }
  }, [customersList]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewHistoryModal, setViewHistoryModal] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [smsModal, setSmsModal] = useState(null);
  const [smsMessage, setSmsMessage] = useState("");

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    village: "Devgaon Main",
    type: "Individual Resident",
    preferredMode: "UPI / PhonePe",
  });

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customersList.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search) ||
        c.village.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      const matchesType = typeFilter === "all" || c.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [customersList, search, statusFilter, typeFilter]);

  // Aggregate Metrics
  const totalSpendAll = useMemo(() => {
    return customersList.reduce((acc, c) => acc + (Number(c.totalSpent) || 0), 0);
  }, [customersList]);

  const totalBookingsAll = useMemo(() => {
    return customersList.reduce((acc, c) => acc + (Number(c.totalBookings) || 0), 0);
  }, [customersList]);

  // Handlers
  const handleToggleStatus = (id, currentStatus, name) => {
    const next = currentStatus === "active" ? "suspended" : "active";
    setCustomersList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: next } : c))
    );
    if (next === "suspended") {
      toast.warning(`Account for ${name} suspended.`);
    } else {
      toast.success(`Account for ${name} restored to Active.`);
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete customer account for "${name}"?`)) {
      setCustomersList((prev) => prev.filter((c) => c.id !== id));
      toast.info(`Account "${name}" deleted.`);
    }
  };

  const handleSendSMS = (e) => {
    e.preventDefault();
    if (!smsMessage.trim()) {
      toast.error("Please enter message body");
      return;
    }
    toast.success(`Emergency / Service SMS dispatched to ${smsModal.name} (${smsModal.phone})!`);
    setSmsModal(null);
    setSmsMessage("");
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newCustomer.name.trim() || !newCustomer.phone.trim()) {
      toast.error("Please provide Customer name and phone number");
      return;
    }

    const created = {
      id: `cust-${Date.now()}`,
      name: newCustomer.name.trim(),
      phone: newCustomer.phone.trim(),
      email: newCustomer.email.trim() || `${newCustomer.name.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
      village: newCustomer.village,
      type: newCustomer.type,
      totalBookings: 0,
      totalSpent: 0,
      preferredMode: newCustomer.preferredMode,
      status: "active",
      joinedDate: "Just now",
      lastActive: "Online now",
      recentOrders: [],
    };

    setCustomersList((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewCustomer({
      name: "",
      phone: "",
      email: "",
      village: "Devgaon Main",
      type: "Individual Resident",
      preferredMode: "UPI / PhonePe",
    });
    toast.success(`Customer "${created.name}" created successfully!`);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl sm:text-3xl text-charcoal dark:text-dark-text font-bold">
              Customer Directory
            </h1>
            <span className="text-xs font-bold uppercase tracking-wider bg-olive-100 dark:bg-olive-900/40 text-olive-800 dark:text-olive-300 px-3 py-0.5 rounded-full border border-olive-300/40">
              Users &amp; Buyers
            </span>
          </div>
          <p className="text-charcoal/65 dark:text-dark-muted text-xs sm:text-sm mt-1">
            Manage village households, semi-urban clients, institutional buyers &amp; order activity logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-olive-700 hover:bg-olive-800 text-white shadow-xs transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Create Customer Account</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Total Customers</span>
            <UserCheck size={16} className="text-olive-700 dark:text-olive-400" />
          </div>
          <div className="text-2xl font-bold font-display text-charcoal dark:text-dark-text">
            {customersList.length} Accounts
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
            Active in 24 villages
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Total Bookings</span>
            <ShoppingBag size={16} className="text-olive-700 dark:text-olive-400" />
          </div>
          <div className="text-2xl font-bold font-display text-charcoal dark:text-dark-text">
            {totalBookingsAll}
          </div>
          <div className="text-[11px] text-charcoal/50 dark:text-dark-muted mt-0.5">
            Avg 12 orders / client
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Customer Spend</span>
            <IndianRupee size={16} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-display text-charcoal dark:text-dark-text">
            ₹{totalSpendAll.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
            100% Payout to Villages
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Customer Retention</span>
            <Star size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-display text-charcoal dark:text-dark-text">
            87.4%
          </div>
          <div className="text-[11px] text-olive-800 dark:text-olive-300 font-semibold mt-0.5">
            High village repeat rate
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
              placeholder="Search by customer name, phone, village or email..."
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
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none"
            >
              <option value="all">All Buyer Types</option>
              <option value="Individual Resident">Individual Resident</option>
              <option value="Institutional Buyer">Institutional Buyer</option>
              <option value="Farmer / Agriculturalist">Farmer / Agriculturalist</option>
              <option value="Urban / Semi-Urban Buyer">Urban / Semi-Urban</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Customer Table */}
      <div className="bg-cream-card dark:bg-dark-card rounded-2xl border border-charcoal/10 dark:border-dark-border overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-charcoal/5 dark:bg-dark-bg/60 border-b border-charcoal/10 dark:border-dark-border text-charcoal/70 dark:text-dark-muted font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Village / Location</th>
                <th className="py-3.5 px-4">Category Type</th>
                <th className="py-3.5 px-4">Bookings &amp; Orders</th>
                <th className="py-3.5 px-4">Total Spend</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5 dark:divide-dark-border">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-charcoal/50 dark:text-dark-muted">
                    No customers match your search filters.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-charcoal/2 dark:hover:bg-dark-bg/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-charcoal dark:text-dark-text">
                        {c.name}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-charcoal/55 dark:text-dark-muted mt-0.5">
                        <Phone size={10} />
                        <span>{c.phone}</span>
                      </div>
                      <div className="text-[10px] text-charcoal/45 dark:text-dark-muted">
                        {c.email}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 font-medium text-charcoal dark:text-dark-text">
                        <MapPin size={12} className="text-olive-700 dark:text-olive-400" />
                        <span>{c.village}</span>
                      </div>
                      <div className="text-[10px] text-charcoal/45 dark:text-dark-muted mt-0.5">
                        Joined {c.joinedDate}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border text-charcoal/80 dark:text-dark-muted">
                        {c.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-charcoal dark:text-dark-text">
                        {c.totalBookings} orders
                      </div>
                      <div className="text-[10px] text-charcoal/50 dark:text-dark-muted flex items-center gap-1">
                        <Clock size={10} />
                        <span>{c.lastActive}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-charcoal dark:text-dark-text flex items-center gap-0.5">
                        <IndianRupee size={12} />
                        <span>{c.totalSpent.toLocaleString("en-IN")}</span>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-medium">Direct to Artisans</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-semibold text-charcoal/70 dark:text-dark-muted px-2 py-0.5 rounded bg-charcoal/5 dark:bg-dark-bg">
                        {c.preferredMode}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          c.status === "active"
                            ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300"
                            : "bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewHistoryModal(c)}
                          title="View Order History"
                          className="p-1.5 rounded-lg text-charcoal/60 dark:text-dark-muted hover:text-olive-800 dark:hover:text-olive-300 hover:bg-charcoal/5 dark:hover:bg-dark-bg cursor-pointer"
                        >
                          <Eye size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSmsModal(c);
                            setSmsMessage(`Namaste ${c.name}, thank you for choosing Karya Rural Platform! Your feedback keeps rural artisans thriving.`);
                          }}
                          title="Send SMS notification"
                          className="p-1.5 rounded-lg text-olive-700 hover:bg-olive-50 dark:hover:bg-olive-950/40 cursor-pointer"
                        >
                          <MessageSquare size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(c.id, c.status, c.name)}
                          title={c.status === "active" ? "Suspend Account" : "Activate Account"}
                          className={`p-1.5 rounded-lg cursor-pointer ${
                            c.status === "active"
                              ? "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50"
                              : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                          }`}
                        >
                          {c.status === "active" ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(c.id, c.name)}
                          title="Delete Customer"
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

      {/* 5. View Order History Modal */}
      <AdminModal isOpen={!!viewHistoryModal} onClose={() => setViewHistoryModal(null)}>
        {viewHistoryModal && (
          <>
            <div className="px-6 sm:px-8 py-5 border-b border-charcoal/10 dark:border-dark-border flex items-center justify-between shrink-0 bg-cream/40 dark:bg-dark-surface/50">
              <div>
                <h3 className="font-display font-bold text-xl text-charcoal dark:text-dark-text">
                  Customer Profile &amp; Bookings
                </h3>
                <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-0.5">
                  {viewHistoryModal.name} · {viewHistoryModal.village} · Registered Buyer
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewHistoryModal(null)}
                className="p-2 rounded-xl text-charcoal/50 hover:text-charcoal hover:bg-charcoal/10 dark:text-dark-muted dark:hover:text-dark-text dark:hover:bg-dark-border transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-cream/60 dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border">
                  <span className="text-xs text-charcoal/50 dark:text-dark-muted block">Total Spend</span>
                  <span className="font-bold text-charcoal dark:text-dark-text text-xl sm:text-2xl mt-1 block">₹{viewHistoryModal.totalSpent}</span>
                </div>
                <div className="p-4 rounded-2xl bg-cream/60 dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border">
                  <span className="text-xs text-charcoal/50 dark:text-dark-muted block">Total Orders</span>
                  <span className="font-bold text-charcoal dark:text-dark-text text-xl sm:text-2xl mt-1 block">{viewHistoryModal.totalBookings}</span>
                </div>
                <div className="p-4 rounded-2xl bg-cream/60 dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border">
                  <span className="text-xs text-charcoal/50 dark:text-dark-muted block">Account Status</span>
                  <span className="font-bold text-emerald-600 capitalize text-xl sm:text-2xl mt-1 block">{viewHistoryModal.status}</span>
                </div>
              </div>

              <div>
                <h4 className="font-display font-bold text-charcoal dark:text-dark-text mb-3 text-sm">
                  Recent Verified Work &amp; Product Orders
                </h4>
                {viewHistoryModal.recentOrders?.length > 0 ? (
                  <div className="space-y-3">
                    {viewHistoryModal.recentOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-2xl bg-cream/40 dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-sm text-charcoal dark:text-dark-text">{ord.title}</div>
                          <div className="text-xs text-charcoal/50 dark:text-dark-muted mt-0.5">
                            Provider: {ord.worker} · {ord.date}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-base text-charcoal dark:text-dark-text">₹{ord.amount}</div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 inline-block mt-0.5">
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-charcoal/50 dark:text-dark-muted py-8 text-center bg-cream/30 dark:bg-dark-bg rounded-2xl border border-charcoal/10 dark:border-dark-border">
                    No orders recorded yet.
                  </p>
                )}
              </div>
            </div>

            <div className="px-6 sm:px-8 py-4 border-t border-charcoal/10 dark:border-dark-border flex items-center justify-end shrink-0 bg-cream/40 dark:bg-dark-surface/50">
              <button
                type="button"
                onClick={() => setViewHistoryModal(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-charcoal/10 hover:bg-charcoal/15 dark:bg-dark-border dark:hover:bg-dark-border/80 text-charcoal dark:text-dark-text transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </>
        )}
      </AdminModal>

      {/* 6. Send SMS Modal */}
      <AdminModal isOpen={!!smsModal} onClose={() => setSmsModal(null)}>
        {smsModal && (
          <>
            <div className="px-6 sm:px-8 py-5 border-b border-charcoal/10 dark:border-dark-border flex items-center justify-between shrink-0 bg-cream/40 dark:bg-dark-surface/50">
              <div>
                <h3 className="font-display font-bold text-xl text-charcoal dark:text-dark-text">
                  Dispatch Direct SMS / Notification
                </h3>
                <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-0.5">
                  Recipient: {smsModal.name} ({smsModal.phone})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSmsModal(null)}
                className="p-2 rounded-xl text-charcoal/50 hover:text-charcoal hover:bg-charcoal/10 dark:text-dark-muted dark:hover:text-dark-text dark:hover:bg-dark-border transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSendSMS} className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-4">
                <div>
                  <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                    SMS Text Message (Rural Gateway)
                  </label>
                  <textarea
                    rows={8}
                    required
                    placeholder="Type broadcast or direct notification message..."
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                  />
                  <span className="text-xs text-charcoal/50 dark:text-dark-muted block mt-2">
                    Supports GSM Indian language fallback with zero cost to the villager.
                  </span>
                </div>
              </div>

              <div className="px-6 sm:px-8 py-4 border-t border-charcoal/10 dark:border-dark-border flex items-center justify-end gap-3 shrink-0 bg-cream/40 dark:bg-dark-surface/50">
                <button
                  type="button"
                  onClick={() => setSmsModal(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-charcoal/10 hover:bg-charcoal/15 dark:bg-dark-border dark:hover:bg-dark-border/80 text-charcoal dark:text-dark-text transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-olive-700 hover:bg-olive-800 text-white cursor-pointer shadow-xs transition-colors"
                >
                  <Send size={15} />
                  <span>Send SMS Now</span>
                </button>
              </div>
            </form>
          </>
        )}
      </AdminModal>

      {/* 7. Create Customer Modal */}
      <AdminModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <div className="px-6 sm:px-8 py-5 border-b border-charcoal/10 dark:border-dark-border flex items-center justify-between shrink-0 bg-cream/40 dark:bg-dark-surface/50">
          <div>
            <h3 className="font-display font-bold text-xl text-charcoal dark:text-dark-text">
              Create Customer Account
            </h3>
            <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-0.5">
              Register a direct local resident or institutional buyer.
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
              <div className="md:col-span-2">
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                  Customer / Entity Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rameshwar Solanke"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98220 12345"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                  Village / Block
                </label>
                <input
                  type="text"
                  value={newCustomer.village}
                  onChange={(e) => setNewCustomer({ ...newCustomer, village: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="customer@villagepost.in"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                  Buyer Category
                </label>
                <select
                  value={newCustomer.type}
                  onChange={(e) => setNewCustomer({ ...newCustomer, type: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                >
                  <option value="Individual Resident">Individual Resident</option>
                  <option value="Institutional Buyer">Institutional Buyer</option>
                  <option value="Farmer / Agriculturalist">Farmer</option>
                  <option value="Urban / Semi-Urban Buyer">Urban Buyer</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                  Preferred Payment Mode
                </label>
                <select
                  value={newCustomer.preferredMode}
                  onChange={(e) => setNewCustomer({ ...newCustomer, preferredMode: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                >
                  <option value="UPI / PhonePe">UPI / PhonePe</option>
                  <option value="Direct Cash">Direct Cash</option>
                  <option value="Aadhaar AEPS Pay">Aadhaar AEPS</option>
                  <option value="Bank NEFT / DBT">Bank NEFT</option>
                </select>
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
              Create Customer
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
