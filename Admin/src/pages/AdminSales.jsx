import { useState, useMemo, useEffect } from "react";
import {
  IndianRupee, Search, Filter, Download, ArrowUpRight, TrendingUp,
  ShieldCheck, CheckCircle2, Clock, Calendar, FileText, ShoppingBag,
  Wrench, Users2, X, RefreshCw
} from "lucide-react";
import { useToast } from "../hooks/useToast";

const STORAGE_KEY = "karya_admin_sales_v1";

const INITIAL_SALES = [
  {
    id: "TXN-2026-9810",
    orderType: "Worker Service",
    description: "Solar Inverter Wiring & Panel Inspection",
    payer: "Vikram Deshmukh",
    payerVillage: "Devgaon Main",
    payee: "Mahesh Patil (Electrician)",
    payeeVillage: "Rampur East",
    amount: 1200,
    platformFee: 0,
    netPayeeAmount: 1200,
    mode: "UPI / PhonePe",
    date: "12 Sep 2026, 11:20 AM",
    status: "settled",
  },
  {
    id: "TXN-2026-9809",
    orderType: "SHG Bulk Order",
    description: "Mid-Day Meal Organic Pickles (50kg batch)",
    payer: "Gramin Shala Vidyalaya",
    payerVillage: "Devgaon School Road",
    payee: "Annapurna Organic Millet SHG",
    payeeVillage: "Sonipur Block",
    amount: 8500,
    platformFee: 0,
    netPayeeAmount: 8500,
    mode: "Bank NEFT / DBT",
    date: "11 Sep 2026, 04:45 PM",
    status: "settled",
  },
  {
    id: "TXN-2026-9808",
    orderType: "Artisan Product",
    description: "Handloom Chanderi Cotton Saree x2",
    payer: "Priyanka Solanki",
    payerVillage: "Rampura Market",
    payee: "Maa Lakshmi Women SHG",
    payeeVillage: "Rampura",
    amount: 3700,
    platformFee: 0,
    netPayeeAmount: 3700,
    mode: "UPI / GooglePay",
    date: "11 Sep 2026, 02:10 PM",
    status: "settled",
  },
  {
    id: "TXN-2026-9807",
    orderType: "Worker Service",
    description: "Teakwood Door & Wardrobe Fitting",
    payer: "Sanjay Borse",
    payerVillage: "Sonipur Farm Belt",
    payee: "Ramesh Kumar (Carpenter)",
    payeeVillage: "Sonipur",
    amount: 2100,
    platformFee: 0,
    netPayeeAmount: 2100,
    mode: "Direct Cash (Verified)",
    date: "10 Sep 2026, 06:15 PM",
    status: "settled",
  },
  {
    id: "TXN-2026-9806",
    orderType: "Artisan Product",
    description: "Wild Forest Raw Honey (500g) x4 Jars",
    payer: "Anita Kumari Roy",
    payerVillage: "Rampur Block 2",
    payee: "Annapurna Organic Millet SHG",
    payeeVillage: "Sonipur Block",
    amount: 1360,
    platformFee: 0,
    netPayeeAmount: 1360,
    mode: "UPI / Paytm",
    date: "09 Sep 2026, 10:30 AM",
    status: "settled",
  },
  {
    id: "TXN-2026-9805",
    orderType: "Worker Service",
    description: "Submersible Borewell Pump Cleaning",
    payer: "Harish Patil",
    payerVillage: "Devgaon West",
    payee: "Irfan Ali (Plumber)",
    payeeVillage: "Bhagwanpur",
    amount: 850,
    platformFee: 0,
    netPayeeAmount: 850,
    mode: "Aadhaar AEPS Pay",
    date: "08 Sep 2026, 03:20 PM",
    status: "settled",
  },
  {
    id: "TXN-2026-9804",
    orderType: "Worker Service",
    description: "Blouse Stitching & Embroidery (2 Sets)",
    payer: "Kavita Rao",
    payerVillage: "Rampur East",
    payee: "Sunita Devi (Tailor)",
    payeeVillage: "Rampura",
    amount: 700,
    platformFee: 0,
    netPayeeAmount: 700,
    mode: "Direct Cash (Verified)",
    date: "07 Sep 2026, 01:15 PM",
    status: "settled",
  },
];

export default function AdminSales() {
  const toast = useToast();

  const [salesList, setSalesList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_SALES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(salesList));
    } catch {
      // ignore
    }
  }, [salesList]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");

  // Filtered Sales
  const filteredSales = useMemo(() => {
    return salesList.filter((s) => {
      const matchesSearch =
        s.id.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase()) ||
        s.payer.toLowerCase().includes(search.toLowerCase()) ||
        s.payee.toLowerCase().includes(search.toLowerCase()) ||
        s.payerVillage.toLowerCase().includes(search.toLowerCase());

      const matchesType = typeFilter === "all" || s.orderType === typeFilter;
      const matchesMode = modeFilter === "all" || s.mode.toLowerCase().includes(modeFilter.toLowerCase());

      return matchesSearch && matchesType && matchesMode;
    });
  }, [salesList, search, typeFilter, modeFilter]);

  // Aggregate Metrics
  const totalVolume = useMemo(() => {
    return salesList.reduce((acc, s) => acc + (Number(s.amount) || 0), 0);
  }, [salesList]);

  const workerVolume = useMemo(() => {
    return salesList
      .filter((s) => s.orderType === "Worker Service")
      .reduce((acc, s) => acc + (Number(s.amount) || 0), 0);
  }, [salesList]);

  const shgVolume = useMemo(() => {
    return salesList
      .filter((s) => s.orderType.includes("SHG") || s.orderType === "Artisan Product")
      .reduce((acc, s) => acc + (Number(s.amount) || 0), 0);
  }, [salesList]);

  const handleExportCSV = () => {
    const headers = "TransactionID,Type,Description,Payer,Payee,Amount,PlatformFee,Mode,Date,Status\n";
    const rows = salesList
      .map((s) => `"${s.id}","${s.orderType}","${s.description}","${s.payer}","${s.payee}","${s.amount}","0","${s.mode}","${s.date}","${s.status}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `karya_sales_ledger_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Zero-Commission Sales Ledger CSV exported successfully!");
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* 1. Header & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl sm:text-3xl text-charcoal dark:text-dark-text font-bold">
              Sales &amp; Village Disbursals
            </h1>
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 px-3 py-0.5 rounded-full border border-emerald-300/40">
              100% Direct Disbursed
            </span>
          </div>
          <p className="text-charcoal/65 dark:text-dark-muted text-xs sm:text-sm mt-1">
            Real-time financial ledgers verifying 0% platform commission cuts and 100% direct village payouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-dark-card border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text hover:border-olive-600 shadow-2xs transition-all cursor-pointer"
          >
            <Download size={15} />
            <span>Download Ledger CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Total Sales GMV</span>
            <IndianRupee size={16} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-display text-charcoal dark:text-dark-text">
            ₹{totalVolume.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
            100% Paid directly to rural folks
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Worker Service Revenue</span>
            <Wrench size={16} className="text-olive-700 dark:text-olive-400" />
          </div>
          <div className="text-2xl font-bold font-display text-charcoal dark:text-dark-text">
            ₹{workerVolume.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-charcoal/50 dark:text-dark-muted mt-0.5">
            Electricians, plumbers, carpenters
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>SHG Product Sales</span>
            <ShoppingBag size={16} className="text-terracotta-600 dark:text-terracotta-400" />
          </div>
          <div className="text-2xl font-bold font-display text-charcoal dark:text-dark-text">
            ₹{shgVolume.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-terracotta-700 dark:text-terracotta-400 font-semibold mt-0.5">
            Handlooms, honey &amp; crafts
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Platform Cut</span>
            <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400">
            ₹0.00 (0%)
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
            Zero commission rural pledge
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
              placeholder="Search transaction ID, payer, payee, or village..."
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
              <option value="all">All Order Streams</option>
              <option value="Worker Service">Worker Services</option>
              <option value="SHG Bulk Order">SHG Bulk Orders</option>
              <option value="Artisan Product">Artisan Products</option>
            </select>

            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none"
            >
              <option value="all">All Payment Modes</option>
              <option value="UPI">UPI (GPay / PhonePe)</option>
              <option value="Cash">Direct Cash (Verified)</option>
              <option value="Aadhaar">Aadhaar AEPS Pay</option>
              <option value="Bank">Bank NEFT / DBT</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Sales Ledger Table */}
      <div className="bg-cream-card dark:bg-dark-card rounded-2xl border border-charcoal/10 dark:border-dark-border overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-charcoal/5 dark:bg-dark-bg/60 border-b border-charcoal/10 dark:border-dark-border text-charcoal/70 dark:text-dark-muted font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Txn ID &amp; Date</th>
                <th className="py-3.5 px-4">Order Description</th>
                <th className="py-3.5 px-4">Payer (Customer)</th>
                <th className="py-3.5 px-4">Payee (Rural Beneficiary)</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Platform Fee</th>
                <th className="py-3.5 px-4">Disbursed (100%)</th>
                <th className="py-3.5 px-4">Payment Mode</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5 dark:divide-dark-border">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-charcoal/50 dark:text-dark-muted">
                    No transactions match your search filters.
                  </td>
                </tr>
              ) : (
                filteredSales.map((s) => (
                  <tr key={s.id} className="hover:bg-charcoal/2 dark:hover:bg-dark-bg/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-charcoal dark:text-dark-text text-[11px]">
                        {s.id}
                      </div>
                      <div className="text-[10px] text-charcoal/45 dark:text-dark-muted whitespace-nowrap">
                        {s.date}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-charcoal dark:text-dark-text max-w-[200px] truncate">
                        {s.description}
                      </div>
                      <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-charcoal/5 dark:bg-dark-bg text-charcoal/70 dark:text-dark-muted">
                        {s.orderType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-charcoal dark:text-dark-text">
                        {s.payer}
                      </div>
                      <div className="text-[10px] text-charcoal/50 dark:text-dark-muted">
                        {s.payerVillage}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-charcoal dark:text-dark-text">
                        {s.payee}
                      </div>
                      <div className="text-[10px] text-charcoal/50 dark:text-dark-muted">
                        {s.payeeVillage}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-charcoal dark:text-dark-text flex items-center gap-0.5">
                        <IndianRupee size={12} />
                        <span>{s.amount.toLocaleString("en-IN")}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        ₹0 (0%)
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-0.5">
                        <IndianRupee size={12} />
                        <span>{s.netPayeeAmount.toLocaleString("en-IN")}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-white dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border text-charcoal/80 dark:text-dark-muted">
                        {s.mode}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 size={10} />
                        <span>Settled</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
