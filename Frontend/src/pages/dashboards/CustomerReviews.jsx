import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Star, ShoppingBag, Wrench, MessageSquareQuote, CheckCircle2,
  Clock, Plus, Sparkles, ThumbsUp, X, ArrowRight, MapPin, Tag,
  ExternalLink, PackageCheck, ShieldCheck
} from "lucide-react";
import Button from "../../components/ui/Button";
import { useToast } from "../../hooks/useToast";

const INITIAL_REVIEWS = [
  // Product Reviews
  {
    id: "rev-prod-1",
    type: "product",
    title: "Terracotta Handcrafted Mitti Matka (10L)",
    target: "Pragati Mahila SHG",
    category: "Clay & Pottery",
    price: "₹450",
    orderId: "ORD-9201",
    deliveryStatus: "Delivered to Rampur Village",
    paymentMethod: "UPI Instant Pay",
    rating: 5,
    dateTime: "11 Sep 2026, 03:15 PM",
    text: "The water stays naturally cool even in peak afternoon heat! Sturdy craftsmanship, zero leakage, and excellent traditional terracotta finish.",
    verified: true,
    sellerReply: "Thank you for supporting our women artisans! We are glad the water cooling works well for your family.",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=200&q=80",
    redirectUrl: "/shgs",
    redirectLabel: "Buy Product in Store",
  },
  {
    id: "rev-prod-2",
    type: "product",
    title: "Cold-Pressed Kachi Ghani Mustard Oil (2L)",
    target: "Gramodaya SHG Federation",
    category: "Organic Food & Oils",
    price: "₹380",
    orderId: "ORD-8942",
    deliveryStatus: "Delivered to Rampur Village",
    paymentMethod: "Cash on Delivery",
    rating: 5,
    dateTime: "09 Sep 2026, 02:40 PM",
    text: "Authentic pungent aroma and 100% natural pure cold-pressed quality. Far healthier and tastier than commercial refined oils.",
    verified: true,
    sellerReply: "Gramodaya farmers thank you! Our oil is pressed directly from village sarson harvest.",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=200&q=80",
    redirectUrl: "/shgs",
    redirectLabel: "Buy Product in Store",
  },
  {
    id: "rev-prod-3",
    type: "product",
    title: "Natural Bamboo Storage Baskets (Set of 2)",
    target: "Aarunya Weaver Collective",
    category: "Cane & Bamboo Crafts",
    price: "₹620",
    orderId: "ORD-8519",
    deliveryStatus: "Delivered to Rampur Village",
    paymentMethod: "UPI Instant Pay",
    rating: 4.5,
    dateTime: "06 Sep 2026, 10:20 AM",
    text: "Very durable, flexible and tightly woven. Perfect for storing farm seeds, garlic, and kitchen vegetables with natural airflow.",
    verified: true,
    sellerReply: "Glad to hear! The bamboo was seasoned traditionally to prevent any insect damage.",
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=200&q=80",
    redirectUrl: "/shgs",
    redirectLabel: "Buy Product in Store",
  },
  {
    id: "rev-prod-4",
    type: "product",
    title: "Neem & Haldi Herbal Bath Bars (Pack of 4)",
    target: "Gramin Gramodyog Mandir",
    category: "Natural Wellness",
    price: "₹180",
    orderId: "ORD-7910",
    deliveryStatus: "Delivered to Rampur Village",
    paymentMethod: "UPI Instant Pay",
    rating: 5,
    dateTime: "01 Sep 2026, 05:10 PM",
    text: "Gentle on skin, long-lasting lather, and completely chemical-free. Great relief during hot summer days.",
    verified: true,
    sellerReply: "Made by rural women using pure wild neem oil and farm-grown turmeric. Dhanyawaad!",
    image: "https://images.unsplash.com/photo-1607006314644-869265f4225b?auto=format&fit=crop&w=200&q=80",
    redirectUrl: "/shgs",
    redirectLabel: "Buy Product in Store",
  },
  {
    id: "rev-prod-5",
    type: "product",
    title: "Handspun Khadi Pure Cotton Towel Set",
    target: "Gandhi Ashram Charkha Sangh",
    category: "Textiles & Khadi",
    price: "₹340",
    orderId: "ORD-7204",
    deliveryStatus: "Delivered to Rampur Village",
    paymentMethod: "UPI Instant Pay",
    rating: 4,
    dateTime: "25 Aug 2026, 12:45 PM",
    text: "Authentic hand-loomed texture, lightweight, and dries very quickly in the sun. Softens after the first wash.",
    verified: true,
    sellerReply: "Thank you for keeping our heritage khadi charkha looms active in the village.",
    image: "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=200&q=80",
    redirectUrl: "/shgs",
    redirectLabel: "Buy Product in Store",
  },

  // Service Reviews
  {
    id: "rev-serv-1",
    type: "service",
    title: "Submersible Pump Wiring & Overhaul",
    target: "Ramesh Kumar",
    category: "Verified Electrician",
    price: "₹650",
    bookingId: "SRV-4102",
    jobStatus: "Fulfilled On-Site • Rampur Field #2",
    paymentMethod: "Cash on Completion",
    rating: 5,
    dateTime: "10 Sep 2026, 11:30 AM",
    text: "Arrived with digital multi-meter and spare coils within 35 minutes. Identified phase fault and repaired the motor starter reliably. Very humble and honest pricing.",
    verified: true,
    sellerReply: "Thank you! Regular fuse check-ups will keep your irrigation motor running smooth.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=200&q=80",
    redirectUrl: "/services",
    redirectLabel: "Book Service Again",
  },
  {
    id: "rev-serv-2",
    type: "service",
    title: "Drip Irrigation Pipe Fitting & Filter Flush",
    target: "Irfan Ali",
    category: "Plumbing & Irrigation",
    price: "₹480",
    bookingId: "SRV-3891",
    jobStatus: "Fulfilled On-Site • North Canal Farm",
    paymentMethod: "UPI Direct Pay",
    rating: 4.8,
    dateTime: "04 Sep 2026, 04:30 PM",
    text: "Replaced damaged pipeline joints and cleaned the silt mesh. Demonstrated proper backwashing technique to prevent future blockages.",
    verified: true,
    specialistReply: "Glad to help save water for your crops. Call anytime if pressure fluctuates.",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=200&q=80",
    redirectUrl: "/services",
    redirectLabel: "Book Service Again",
  },
  {
    id: "rev-serv-3",
    type: "service",
    title: "Teakwood Grain Storage Box Hinge Repair",
    target: "Sunita Devi",
    category: "Carpentry & Woodcraft",
    price: "₹850",
    bookingId: "SRV-3450",
    jobStatus: "Fulfilled On-Site • Village Residence",
    paymentMethod: "Cash on Completion",
    rating: 5,
    dateTime: "28 Aug 2026, 01:20 PM",
    text: "Master woodworker. Restored our heavy vintage teak grain storage chest with brass reinforcement brackets. Flawless craftsmanship.",
    verified: true,
    specialistReply: "A pleasure working on antique village woodcraft. May it serve your family for decades!",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=200&q=80",
    redirectUrl: "/services",
    redirectLabel: "Book Service Again",
  },
  {
    id: "rev-serv-4",
    type: "service",
    title: "Roof Leakage Waterproofing & Tile Seal",
    target: "Rajesh Mistri",
    category: "Masonry & Construction",
    price: "₹1,200",
    bookingId: "SRV-2980",
    jobStatus: "Fulfilled On-Site • Main House Roof",
    paymentMethod: "Cash on Completion",
    rating: 4.5,
    dateTime: "18 Aug 2026, 04:00 PM",
    text: "Applied polymer coat along roof valleys before the monsoon rains. No leakage experienced since the repair.",
    verified: true,
    specialistReply: "High-grade cement polymer was used. It will hold strong against heavy rains.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=200&q=80",
    redirectUrl: "/services",
    redirectLabel: "Book Service Again",
  },

  // Suggestions Given
  {
    id: "sug-1",
    type: "suggestion",
    title: "Protective Straw Cushioning for Fragile Terracotta",
    target: "Pragati Mahila SHG",
    category: "Craft Transport & Safety",
    status: "Implemented & Adopted",
    dateTime: "07 Sep 2026, 11:00 AM",
    text: "Suggested packing terracotta matkas and pots with dry paddy straw webbing inside transport cartons to prevent hairline cracks during bumpy village road transit.",
    impact: "Adopted for all deliveries across 8 nearby villages. Zero breakage reported since.",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=200&q=80",
    redirectUrl: "/shgs",
    redirectLabel: "View Pragati SHG Store",
  },
  {
    id: "sug-2",
    type: "suggestion",
    title: "Spare Ceramic Fuses in Mobile Tool Kits",
    target: "Village Electrician Guild",
    category: "Tool Kit Optimization",
    status: "Implemented & Adopted",
    dateTime: "02 Sep 2026, 09:30 AM",
    text: "Suggested technicians carry 10A and 16A ceramic replacement fuses so farmers do not have to travel 12km to the main market during breakdowns.",
    impact: "Distributed to 14 verified technicians on Karya platform.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=200&q=80",
    redirectUrl: "/services",
    redirectLabel: "View Village Technicians",
  },
  {
    id: "sug-3",
    type: "suggestion",
    title: "5-Litre Bulk Tin Canister for Harvest Season",
    target: "Gramodaya SHG Federation",
    category: "Product Packaging Variant",
    status: "In Production",
    dateTime: "29 Aug 2026, 03:15 PM",
    text: "Recommended offering larger 5-litre food-grade steel or tin containers for mustard oil during festive and harvest months.",
    impact: "Gramodaya committee approved tin packaging run for next month.",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=200&q=80",
    redirectUrl: "/shgs",
    redirectLabel: "View Gramodaya Store",
  },
  {
    id: "sug-4",
    type: "suggestion",
    title: "Voice Notes for Urgent Farm Equipment Repair",
    target: "Karya Product Team",
    category: "Platform Voice Feature",
    status: "Under Review",
    dateTime: "20 Aug 2026, 06:40 PM",
    text: "Suggested allowing farmers to speak or send a 15-second voice note describing strange pump noises when booking a specialist.",
    impact: "Sent to Karya Mobile Engineering team.",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=200&q=80",
    redirectUrl: "/services",
    redirectLabel: "Explore Services",
  },
  {
    id: "sug-5",
    type: "suggestion",
    title: "Natural Indigo Dye Variant for Table Runners",
    target: "Aarunya Weaver Collective",
    category: "Artisan Textile Dyeing",
    status: "Adopted by SHG",
    dateTime: "12 Aug 2026, 02:00 PM",
    text: "Suggested blending organic plant indigo dye with natural cotton yarns for export-quality geometric table runners.",
    impact: "First batch of 30 indigo runners woven and listed in SHG store.",
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=200&q=80",
    redirectUrl: "/shgs",
    redirectLabel: "View Aarunya Weaves",
  },
];

export default function CustomerReviews() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [activeTab, setActiveTab] = useState("all"); // all, product, service, suggestion
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();

  const [newEntry, setNewEntry] = useState({
    entryType: "product", // product, service, suggestion
    target: "",
    title: "",
    rating: 5,
    text: "",
  });

  const counts = {
    all: reviews.length,
    product: reviews.filter((r) => r.type === "product").length,
    service: reviews.filter((r) => r.type === "service").length,
    suggestion: reviews.filter((r) => r.type === "suggestion").length,
  };

  const filtered = reviews.filter((r) => {
    if (activeTab === "all") return true;
    return r.type === activeTab;
  });

  const handleCreateEntry = (e) => {
    e.preventDefault();
    if (!newEntry.title || !newEntry.text) {
      toast.error("Please fill in title and review details");
      return;
    }

    const isProd = newEntry.entryType === "product";
    const isServ = newEntry.entryType === "service";

    const created = {
      id: `custom-${Date.now()}`,
      type: newEntry.entryType,
      title: newEntry.title,
      target: newEntry.target || (isProd ? "SHG Collective" : isServ ? "Village Specialist" : "Community"),
      category: isProd ? "Handcrafted Product" : isServ ? "Village Trade Service" : "Community Improvement Idea",
      price: isProd ? "₹450" : isServ ? "₹500" : undefined,
      orderId: isProd ? `ORD-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
      bookingId: isServ ? `SRV-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
      rating: Number(newEntry.rating) || 5,
      dateTime: "Just now • Today",
      text: newEntry.text,
      verified: true,
      status: "Under Review",
      impact: "Shared with village community and verified provider.",
      redirectUrl: isProd ? "/shgs" : "/services",
      redirectLabel: isProd ? "View Product in Store" : "Book Service Again",
    };

    setReviews([created, ...reviews]);
    setShowModal(false);
    setNewEntry({ entryType: "product", target: "", title: "", rating: 5, text: "" });
    toast.success(`${newEntry.entryType === "suggestion" ? "Suggestion" : "Review"} submitted successfully!`);
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-olive-900 via-olive-950 to-charcoal text-cream shadow-elevation-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-olive-700/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-olive-300 text-xs font-semibold mb-3">
              <MessageSquareQuote size={13} />
              <span>Community Impact & Customer Voice</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white font-medium">
              Reviews & Suggestions
            </h1>
            <p className="text-xs sm:text-sm text-cream/70 mt-1 max-w-lg">
              Detailed reviews for purchased SHG products and booked services, each with full order information and quick redirect buttons to re-order or book again.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="self-start sm:self-center font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-olive-700 hover:bg-olive-800 text-white shadow-sm border border-olive-800/20 transition-all active:scale-[0.98]"
          >
            <Plus size={18} className="shrink-0" />
            <span>Write Review / Suggestion</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => setActiveTab("all")}
          className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all ${
            activeTab === "all"
              ? "bg-olive-800 text-white border-olive-700 shadow-elevation-1"
              : "bg-cream-card dark:bg-dark-card border-charcoal/5 dark:border-dark-border hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className={`text-xs ${activeTab === "all" ? "text-cream/80" : "text-charcoal/55 dark:text-dark-muted"}`}>
              All Activity
            </p>
            <Sparkles size={16} className={activeTab === "all" ? "text-olive-300" : "text-olive-700 dark:text-olive-400"} />
          </div>
          <p className="font-display text-2xl font-bold mt-2">{counts.all}</p>
          <p className={`text-[11px] mt-0.5 ${activeTab === "all" ? "text-cream/70" : "text-olive-700 dark:text-olive-400"}`}>
            Total contributions
          </p>
        </div>

        <div
          onClick={() => setActiveTab("product")}
          className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all ${
            activeTab === "product"
              ? "bg-olive-800 text-white border-olive-700 shadow-elevation-1"
              : "bg-cream-card dark:bg-dark-card border-charcoal/5 dark:border-dark-border hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className={`text-xs ${activeTab === "product" ? "text-cream/80" : "text-charcoal/55 dark:text-dark-muted"}`}>
              Product Reviews
            </p>
            <ShoppingBag size={16} className={activeTab === "product" ? "text-olive-300" : "text-olive-700 dark:text-olive-400"} />
          </div>
          <p className="font-display text-2xl font-bold mt-2">{counts.product}</p>
          <p className={`text-[11px] mt-0.5 ${activeTab === "product" ? "text-cream/70" : "text-olive-700 dark:text-olive-400"}`}>
            SHG item feedback
          </p>
        </div>

        <div
          onClick={() => setActiveTab("service")}
          className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all ${
            activeTab === "service"
              ? "bg-olive-800 text-white border-olive-700 shadow-elevation-1"
              : "bg-cream-card dark:bg-dark-card border-charcoal/5 dark:border-dark-border hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className={`text-xs ${activeTab === "service" ? "text-cream/80" : "text-charcoal/55 dark:text-dark-muted"}`}>
              Service Reviews
            </p>
            <Wrench size={16} className={activeTab === "service" ? "text-olive-300" : "text-olive-700 dark:text-olive-400"} />
          </div>
          <p className="font-display text-2xl font-bold mt-2">{counts.service}</p>
          <p className={`text-[11px] mt-0.5 ${activeTab === "service" ? "text-cream/70" : "text-olive-700 dark:text-olive-400"}`}>
            Technician feedback
          </p>
        </div>

        <div
          onClick={() => setActiveTab("suggestion")}
          className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all ${
            activeTab === "suggestion"
              ? "bg-olive-800 text-white border-olive-700 shadow-elevation-1"
              : "bg-cream-card dark:bg-dark-card border-charcoal/5 dark:border-dark-border hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className={`text-xs ${activeTab === "suggestion" ? "text-cream/80" : "text-charcoal/55 dark:text-dark-muted"}`}>
              Suggestions Given
            </p>
            <ThumbsUp size={16} className={activeTab === "suggestion" ? "text-olive-300" : "text-olive-700 dark:text-olive-400"} />
          </div>
          <p className="font-display text-2xl font-bold mt-2">{counts.suggestion}</p>
          <p className={`text-[11px] mt-0.5 ${activeTab === "suggestion" ? "text-cream/70" : "text-emerald-600 dark:text-emerald-400 font-semibold"}`}>
            Community ideas shared
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-charcoal/10 dark:border-dark-border">
        {[
          { id: "all", label: `All Reviews (${counts.all})` },
          { id: "product", label: `Product Reviews (${counts.product})` },
          { id: "service", label: `Service Reviews (${counts.service})` },
          { id: "suggestion", label: `Suggestions Given (${counts.suggestion})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-olive-700 text-cream shadow-xs font-bold"
                : "bg-cream-card dark:bg-dark-card text-charcoal/70 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reviews Shown as Detailed Cards with Product/Service Info & Direct Redirect Buttons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-cream-card dark:bg-dark-card rounded-3xl p-5 sm:p-6 border border-charcoal/5 dark:border-dark-border shadow-elevation-1 flex flex-col justify-between hover:shadow-elevation-2 transition-all gap-4"
          >
            {/* 1. Header Row */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-charcoal/5 dark:border-dark-border">
              <div className="flex items-center gap-2">
                <span
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    item.type === "product"
                      ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400"
                      : item.type === "service"
                      ? "bg-olive-100 dark:bg-olive-900/60 text-olive-800 dark:text-olive-300"
                      : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400"
                  }`}
                >
                  {item.type === "product" && <ShoppingBag size={15} />}
                  {item.type === "service" && <Wrench size={15} />}
                  {item.type === "suggestion" && <ThumbsUp size={15} />}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    item.type === "product"
                      ? "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50"
                      : item.type === "service"
                      ? "bg-olive-50 dark:bg-olive-900/40 text-olive-800 dark:text-olive-300 border border-olive-200 dark:border-olive-900/50"
                      : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50"
                  }`}
                >
                  {item.type === "product" ? "Product Review" : item.type === "service" ? "Service Review" : "Craft Suggestion"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {item.type !== "suggestion" ? (
                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-lg font-bold text-xs">
                    <Star size={12} fill="currentColor" />
                    <span>{item.rating}.0</span>
                  </div>
                ) : (
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                    {item.status}
                  </span>
                )}
                <span className="text-[11px] text-charcoal/45 dark:text-dark-muted flex items-center gap-1">
                  <Clock size={11} />
                  <span>{item.dateTime}</span>
                </span>
              </div>
            </div>

            {/* 2. Embedded Details Box (Product or Service Metadata) */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-dark-surface border border-charcoal/5 dark:border-dark-border flex items-center gap-3.5">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-14 h-14 rounded-xl object-cover border border-charcoal/10 shrink-0 shadow-xs"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-olive-100 dark:bg-olive-900/50 text-olive-800 dark:text-olive-300 flex items-center justify-center font-display font-bold text-lg shrink-0">
                  {item.type === "service" ? <Wrench size={20} /> : <ThumbsUp size={20} />}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-charcoal dark:text-dark-text truncate">
                  {item.title}
                </h4>
                <p className="text-[11px] text-charcoal/60 dark:text-dark-muted truncate mt-0.5">
                  {item.type === "product" ? `Producer: ${item.target}` : item.type === "service" ? `Specialist: ${item.target}` : `Target: ${item.target}`}
                </p>

                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {item.price && (
                    <span className="text-[11px] font-bold text-charcoal dark:text-dark-text bg-cream dark:bg-dark-bg px-2 py-0.5 rounded-md border border-charcoal/10 dark:border-dark-border">
                      {item.price}
                    </span>
                  )}
                  {item.orderId && (
                    <span className="text-[10px] text-charcoal/50 dark:text-dark-muted font-mono">
                      {item.orderId}
                    </span>
                  )}
                  {item.bookingId && (
                    <span className="text-[10px] text-charcoal/50 dark:text-dark-muted font-mono">
                      {item.bookingId}
                    </span>
                  )}
                  {item.deliveryStatus && (
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold truncate">
                      • {item.deliveryStatus}
                    </span>
                  )}
                  {item.jobStatus && (
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold truncate">
                      • {item.jobStatus}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Review Statement & Response */}
            <div className="space-y-2.5 flex-1">
              <p className="text-xs sm:text-sm text-charcoal/80 dark:text-dark-text leading-relaxed">
                "{item.text}"
              </p>

              {item.impact && (
                <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 size={13} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span><strong>Village Community Impact:</strong> {item.impact}</span>
                </div>
              )}

              {(item.sellerReply || item.specialistReply) && (
                <div className="p-2.5 rounded-xl bg-white/60 dark:bg-dark-surface/60 border border-charcoal/5 dark:border-dark-border text-xs">
                  <p className="font-bold text-olive-800 dark:text-olive-300 text-[10px] uppercase tracking-wider mb-0.5">
                    Response from {item.target}:
                  </p>
                  <p className="text-charcoal/70 dark:text-dark-muted text-[11px] italic">
                    "{item.sellerReply || item.specialistReply}"
                  </p>
                </div>
              )}
            </div>

            {/* 4. Footer with Verified Tag & Button to Redirect to Product/Service */}
            <div className="pt-3 border-t border-charcoal/5 dark:border-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-xs text-olive-700 dark:text-olive-400 font-semibold">
                <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>Verified Feedback</span>
              </span>

              {/* Redirect Button */}
              {item.redirectUrl && (
                <Link
                  to={item.redirectUrl}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-olive-700 hover:bg-olive-800 text-white text-xs font-bold transition-all shadow-xs border border-olive-800/20 active:scale-[0.98]"
                >
                  {item.type === "product" && <ShoppingBag size={14} className="shrink-0" />}
                  {item.type === "service" && <Wrench size={14} className="shrink-0" />}
                  {item.type === "suggestion" && <ExternalLink size={14} className="shrink-0" />}
                  <span>{item.redirectLabel || (item.type === "product" ? "Buy Product Now" : "Book Service Now")}</span>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal to write new review or suggestion */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-dark-card rounded-3xl p-6 border border-charcoal/10 dark:border-dark-border shadow-elevation-3 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-charcoal/10 dark:border-dark-border">
              <h3 className="font-display font-bold text-lg text-charcoal dark:text-dark-text">
                Add Review or Suggestion
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl hover:bg-cream dark:hover:bg-dark-surface text-charcoal/60 dark:text-dark-muted"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateEntry} className="space-y-4 text-xs">
              {/* Type Switcher */}
              <div>
                <label className="font-bold text-charcoal/70 dark:text-dark-muted block mb-1.5">
                  Select Feedback Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "product", label: "SHG Product", icon: ShoppingBag },
                    { id: "service", label: "Village Service", icon: Wrench },
                    { id: "suggestion", label: "Craft Suggestion", icon: ThumbsUp },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setNewEntry({ ...newEntry, entryType: t.id })}
                      className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                        newEntry.entryType === t.id
                          ? "border-olive-700 bg-olive-50 dark:bg-olive-950/40 text-olive-800 dark:text-olive-300 font-bold"
                          : "border-charcoal/15 dark:border-dark-border text-charcoal/70 dark:text-dark-muted"
                      }`}
                    >
                      <t.icon size={15} />
                      <span className="text-[11px]">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-charcoal/70 dark:text-dark-muted block mb-1">
                  {newEntry.entryType === "product"
                    ? "Product Title / Item Name"
                    : newEntry.entryType === "service"
                    ? "Service Title / Trade"
                    : "Suggestion Headline"}
                </label>
                <input
                  required
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                  placeholder={
                    newEntry.entryType === "product"
                      ? "e.g. Handmade Terracotta Water Jar"
                      : newEntry.entryType === "service"
                      ? "e.g. Electrician Motor Rewiring"
                      : "e.g. Use organic packaging for rural honey"
                  }
                  className="w-full bg-cream dark:bg-dark-surface rounded-xl p-2.5 text-xs outline-none border border-charcoal/15 dark:border-dark-border font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-charcoal/70 dark:text-dark-muted block mb-1">
                    Target SHG or Specialist Name
                  </label>
                  <input
                    value={newEntry.target}
                    onChange={(e) => setNewEntry({ ...newEntry, target: e.target.value })}
                    placeholder="e.g. Pragati SHG or Ramesh Electrician"
                    className="w-full bg-cream dark:bg-dark-surface rounded-xl p-2.5 text-xs outline-none border border-charcoal/15 dark:border-dark-border"
                  />
                </div>

                {newEntry.entryType !== "suggestion" && (
                  <div>
                    <label className="font-bold text-charcoal/70 dark:text-dark-muted block mb-1">
                      Rating (1 to 5 Stars)
                    </label>
                    <select
                      value={newEntry.rating}
                      onChange={(e) => setNewEntry({ ...newEntry, rating: e.target.value })}
                      className="w-full bg-cream dark:bg-dark-surface rounded-xl p-2.5 text-xs outline-none border border-charcoal/15 dark:border-dark-border font-bold"
                    >
                      <option value="5">★★★★★ (5.0 Excellent)</option>
                      <option value="4">★★★★☆ (4.0 Very Good)</option>
                      <option value="3">★★★☆☆ (3.0 Good)</option>
                      <option value="2">★★☆☆☆ (2.0 Fair)</option>
                      <option value="1">★☆☆☆☆ (1.0 Needs Improvement)</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold text-charcoal/70 dark:text-dark-muted block mb-1">
                  {newEntry.entryType === "suggestion"
                    ? "Explain your idea to improve village crafts or service:"
                    : "Detailed Review & Experience:"}
                </label>
                <textarea
                  required
                  rows={3}
                  value={newEntry.text}
                  onChange={(e) => setNewEntry({ ...newEntry, text: e.target.value })}
                  placeholder="Share details to help artisans and fellow village customers..."
                  className="w-full bg-cream dark:bg-dark-surface rounded-xl p-2.5 text-xs outline-none border border-charcoal/15 dark:border-dark-border resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-charcoal/10 dark:border-dark-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-charcoal/60 dark:text-dark-muted hover:text-charcoal"
                >
                  Cancel
                </button>
                <Button type="submit" size="md" className="font-bold">
                  Submit Feedback
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
