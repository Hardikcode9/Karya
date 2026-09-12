import { useState, useMemo, useEffect } from "react";
import {
  Plus, Settings2, IndianRupee, Clock, CheckCircle2, AlertCircle,
  Wrench, Sparkles, Search, Filter, Edit3, Trash2, Power,
  ShieldCheck, Tag, X, Check, Zap, RefreshCw, Star, Layers,
  FileText, Upload, Image, Award, CheckCircle, ExternalLink,
  Briefcase, Eye
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

// Initial Catalog with ONLY 1 Service Created as requested
const DEFAULT_WORKER_SERVICES = [
  {
    id: "ws-1",
    name: "School Uniform Stitching & Custom Sizing",
    category: "Tailoring & Garments",
    price: 320,
    priceUnit: "piece",
    duration: "24 - 48 Hours",
    description: "Complete stitching for boys and girls school uniforms (shirts, skirts, pants). Includes durable double-seamed stitching, reinforced collars, and 2 free fitting adjustments after trial.",
    inclusions: ["Free measurement pickup", "Double-stitch thread", "2 free fitting adjustments", "Nametag stitching"],
    isActive: true,
    emergencyAvailable: true,
    emergencyFee: 100,
    ordersCompleted: 86,
    rating: 4.9,
    createdAt: "10 Jan 2026",
    // Related Docs & Info Mention
    certificateName: "National Skill Development Council (NSDC) Tailoring Level-3",
    certificateNumber: "NSDC-TLR-2024-8921",
    issuingAuthority: "Ministry of Skill Development & Entrepreneurship",
    docFileName: "NSDC_Tailoring_Certificate.pdf",
    experienceYears: "6 Years",
    toolsEquipment: "Usha Industrial Single Needle Machine, Steam Iron, Interlock Overedge Machine",
    workSampleName: "school_uniform_sample.jpg",
    workSampleUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=60",
    isAadhaarVerified: true,
  }
];

const CATEGORIES = [
  "All",
  "Tailoring & Garments",
  "Alterations & Repairs",
  "Embroidery & Zari",
  "Handloom & Finishing",
  "Electrical & Solar",
  "Plumbing & Sanitation",
  "Carpentry & Woodwork",
  "Bulk Orders"
];

const STORAGE_KEY = "karya_worker_services_catalog_v3";

export default function WorkerServices() {
  const { user } = useAuth();
  const toast = useToast();

  // Load services with local persistence (defaults to exactly 1 service)
  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Failed to read stored services", e);
    }
    return DEFAULT_WORKER_SERVICES;
  });

  // Persist whenever services change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
    } catch (e) {
      console.error("Failed to persist services", e);
    }
  }, [services]);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'active' | 'paused'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [docPreviewModal, setDocPreviewModal] = useState(null);

  // Form State with Docs & Info fields
  const [formData, setFormData] = useState({
    name: "",
    category: "Tailoring & Garments",
    price: "",
    priceUnit: "piece",
    duration: "24 - 48 Hours",
    description: "",
    inclusions: "",
    emergencyAvailable: false,
    emergencyFee: 100,
    isActive: true,
    // Docs & info fields:
    certificateName: "",
    certificateNumber: "",
    issuingAuthority: "",
    docFileName: "",
    experienceYears: "",
    toolsEquipment: "",
    workSampleName: "",
    workSampleUrl: "",
    isAadhaarVerified: true,
  });

  // Filtered Services List
  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      const matchesSearch =
        srv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        srv.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        srv.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || srv.category === selectedCategory;

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
          ? srv.isActive
          : !srv.isActive;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [services, searchTerm, selectedCategory, statusFilter]);

  // Metrics
  const metrics = useMemo(() => {
    const total = services.length;
    const activeCount = services.filter((s) => s.isActive).length;
    const totalCompleted = services.reduce((acc, s) => acc + (s.ordersCompleted || 0), 0);
    const avgPrice =
      total > 0
        ? Math.round(services.reduce((acc, s) => acc + Number(s.price || 0), 0) / total)
        : 0;
    return { total, activeCount, totalCompleted, avgPrice };
  }, [services]);

  // Open modal for creating a new service
  const handleOpenAddModal = () => {
    setEditingServiceId(null);
    setFormData({
      name: "",
      category: "Tailoring & Garments",
      price: "",
      priceUnit: "piece",
      duration: "24 - 48 Hours",
      description: "",
      inclusions: "Free measurement pickup, Double-stitch thread, 1-week free adjustment",
      emergencyAvailable: false,
      emergencyFee: 100,
      isActive: true,
      certificateName: "",
      certificateNumber: "",
      issuingAuthority: "",
      docFileName: "",
      experienceYears: "5 Years",
      toolsEquipment: "Standard trade tools & safety gear",
      workSampleName: "",
      workSampleUrl: "",
      isAadhaarVerified: true,
    });
    setIsModalOpen(true);
  };

  // Open modal for editing an existing service
  const handleOpenEditModal = (service) => {
    setEditingServiceId(service.id);
    setFormData({
      name: service.name,
      category: service.category,
      price: service.price,
      priceUnit: service.priceUnit || "piece",
      duration: service.duration,
      description: service.description,
      inclusions: Array.isArray(service.inclusions) ? service.inclusions.join(", ") : service.inclusions || "",
      emergencyAvailable: !!service.emergencyAvailable,
      emergencyFee: service.emergencyFee || 100,
      isActive: service.isActive !== false,
      certificateName: service.certificateName || "",
      certificateNumber: service.certificateNumber || "",
      issuingAuthority: service.issuingAuthority || "",
      docFileName: service.docFileName || "",
      experienceYears: service.experienceYears || "",
      toolsEquipment: service.toolsEquipment || "",
      workSampleName: service.workSampleName || "",
      workSampleUrl: service.workSampleUrl || "",
      isAadhaarVerified: service.isAadhaarVerified !== false,
    });
    setIsModalOpen(true);
  };

  // Handle Certificate File Upload simulation
  const handleDocFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        docFileName: file.name,
        certificateName: prev.certificateName || file.name.replace(/\.[^/.]+$/, ""),
      }));
      toast.success(`दस्तावेज़ संलग्न किया गया: ${file.name}`);
    }
  };

  // Handle Work Sample Photo Upload simulation
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        workSampleName: file.name,
        workSampleUrl: fakeUrl,
      }));
      toast.success(`कार्य फ़ोटो जोड़ी गई: ${file.name}`);
    }
  };

  // Save (Create or Update)
  const handleSaveService = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("कृपया सेवा का नाम दर्ज करें (Please enter a valid service title)");
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      toast.error("कृपया सही मूल्य दर्ज करें (Please provide a valid price in ₹)");
      return;
    }

    const inclusionList = formData.inclusions
      ? formData.inclusions
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : ["Verified quality workmanship", "Panchayat certified rate"];

    if (editingServiceId) {
      // Update
      setServices((prev) =>
        prev.map((srv) => {
          if (srv.id === editingServiceId) {
            return {
              ...srv,
              name: formData.name.trim(),
              category: formData.category,
              price: Number(formData.price),
              priceUnit: formData.priceUnit,
              duration: formData.duration.trim() || "24 - 48 Hours",
              description: formData.description.trim() || "Quality craftsmanship tailored to customer specifications.",
              inclusions: inclusionList,
              emergencyAvailable: formData.emergencyAvailable,
              emergencyFee: formData.emergencyAvailable ? Number(formData.emergencyFee || 0) : 0,
              isActive: formData.isActive,
              certificateName: formData.certificateName.trim(),
              certificateNumber: formData.certificateNumber.trim(),
              issuingAuthority: formData.issuingAuthority.trim(),
              docFileName: formData.docFileName,
              experienceYears: formData.experienceYears.trim(),
              toolsEquipment: formData.toolsEquipment.trim(),
              workSampleName: formData.workSampleName,
              workSampleUrl: formData.workSampleUrl,
              isAadhaarVerified: formData.isAadhaarVerified,
            };
          }
          return srv;
        })
      );
      toast.success(`सेवा "${formData.name.trim()}" सफलतापूर्वक अपडेट की गई!`);
    } else {
      // Create new
      const newService = {
        id: `ws-${Date.now()}`,
        name: formData.name.trim(),
        category: formData.category,
        price: Number(formData.price),
        priceUnit: formData.priceUnit,
        duration: formData.duration.trim() || "24 - 48 Hours",
        description: formData.description.trim() || "High quality service provided at verified standard village rates.",
        inclusions: inclusionList,
        emergencyAvailable: formData.emergencyAvailable,
        emergencyFee: formData.emergencyAvailable ? Number(formData.emergencyFee || 0) : 0,
        isActive: true,
        ordersCompleted: 0,
        rating: 5.0,
        createdAt: "Today",
        certificateName: formData.certificateName.trim() || "Trade Skill Verification Self-Attested",
        certificateNumber: formData.certificateNumber.trim() || `KRY-TRD-${Math.floor(1000 + Math.random() * 9000)}`,
        issuingAuthority: formData.issuingAuthority.trim() || "Gram Panchayat / Karya Verification Hub",
        docFileName: formData.docFileName || "Verified_Trade_Form.pdf",
        experienceYears: formData.experienceYears.trim() || "5 Years",
        toolsEquipment: formData.toolsEquipment.trim() || "Standard trade tools & workshop kit",
        workSampleName: formData.workSampleName || "sample_work.jpg",
        workSampleUrl: formData.workSampleUrl || "",
        isAadhaarVerified: formData.isAadhaarVerified,
      };

      setServices((prev) => [newService, ...prev]);
      toast.success(`नई सेवा "${newService.name}" आपके कैटलॉग में जुड़ गई!`);
    }

    setIsModalOpen(false);
  };

  // Toggle active status
  const handleToggleStatus = (id) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextState = !s.isActive;
          if (nextState) {
            toast.success(`सेवा "${s.name}" अब सक्रिय है (Active)`);
          } else {
            toast.info(`सेवा "${s.name}" को रोक दिया गया है (Paused)`);
          }
          return { ...s, isActive: nextState };
        }
        return s;
      })
    );
  };

  // Delete service
  const handleDeleteService = (id, name) => {
    if (window.confirm(`Are you sure you want to remove the service "${name}"?`)) {
      setServices((prev) => prev.filter((s) => s.id !== id));
      toast.info(`सेवा "${name}" हटा दी गई`);
    }
  };

  // Reset to default 1 service
  const handleResetDefaults = () => {
    setServices(DEFAULT_WORKER_SERVICES);
    toast.info("सेवा कैटलॉग प्रारंभिक स्थिति (1 सेवा) पर सेट किया गया");
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* 1. PAGE HEADER WITH ADD NEW SERVICE BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl text-charcoal dark:text-dark-text font-bold">
              My Services &amp; Trade Offerings
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-olive-100 dark:bg-olive-900/50 text-olive-800 dark:text-olive-300 text-xs font-bold">
              <Sparkles size={12} /> Live Trade Catalog
            </span>
          </div>
          <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted mt-1">
            Displaying the specialized services you offer to rural &amp; district clients. Set your rates, turnaround time, and accept instant bookings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            title="Reset to 1 default service"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-dark-card border border-charcoal/15 dark:border-dark-border text-charcoal/70 dark:text-dark-muted hover:text-charcoal hover:border-olive-600 transition-all cursor-pointer shadow-2xs"
          >
            <RefreshCw size={14} />
            <span className="hidden md:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-olive-700 hover:bg-olive-800 text-white shadow-xs border border-olive-800/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Add New Service</span>
          </button>
        </div>
      </div>

      {/* 2. EXTRA ACTION CALLOUT BANNER TO ADD NEW SERVICES (Prominent & Village-Friendly) */}
      <div className="bg-gradient-to-r from-olive-800 to-olive-900 text-white rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md border border-olive-700">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
            <Wrench size={22} className="text-olive-300" />
          </div>
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold">
              Want to offer a new service? (नया काम या सेवा जोड़ें)
            </h3>
            <p className="text-xs text-white/80 mt-0.5 max-w-xl">
              Upload your trade certifications, mention your tools & experience, set village rates, and accept direct bookings with 0% commission.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white text-olive-900 hover:bg-olive-50 shadow-sm transition-all shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add My New Service</span>
        </button>
      </div>

      {/* 3. METRIC SUMMARY STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-cream-card dark:bg-dark-card p-4 sm:p-5 rounded-2xl border border-charcoal/10 dark:border-dark-border shadow-xs">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Total Offerings</span>
            <Layers size={16} className="text-olive-700 dark:text-olive-400" />
          </div>
          <div className="text-2xl font-display font-bold text-charcoal dark:text-dark-text">
            {metrics.total} Service{metrics.total > 1 ? "s" : ""}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            {metrics.activeCount} active for instant booking
          </p>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 sm:p-5 rounded-2xl border border-charcoal/10 dark:border-dark-border shadow-xs">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Average Rate</span>
            <IndianRupee size={16} className="text-olive-700 dark:text-olive-400" />
          </div>
          <div className="text-2xl font-display font-bold text-charcoal dark:text-dark-text">
            ₹{metrics.avgPrice}
          </div>
          <p className="text-[11px] text-charcoal/50 dark:text-dark-muted font-medium mt-1">
            Standard village benchmark
          </p>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 sm:p-5 rounded-2xl border border-charcoal/10 dark:border-dark-border shadow-xs">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Jobs Fulfilled</span>
            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-display font-bold text-charcoal dark:text-dark-text">
            {metrics.totalCompleted} Completed
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            100% verified customer delivery
          </p>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 sm:p-5 rounded-2xl border border-charcoal/10 dark:border-dark-border shadow-xs">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Satisfaction Score</span>
            <Star size={16} className="text-amber-500 fill-amber-400" />
          </div>
          <div className="text-2xl font-display font-bold text-charcoal dark:text-dark-text">
            4.9 / 5.0
          </div>
          <p className="text-[11px] text-charcoal/50 dark:text-dark-muted font-medium mt-1">
            Based on recent customer reviews
          </p>
        </div>
      </div>

      {/* 4. SEARCH AND CATEGORY FILTERS */}
      <div className="bg-cream-card dark:bg-dark-card rounded-2xl p-4 border border-charcoal/10 dark:border-dark-border shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-dark-muted" />
            <input
              type="text"
              placeholder="Search services, repairs, tailoring, alterations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-dark-surface rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-charcoal dark:text-dark-text outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 transition-colors shadow-2xs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            {["all", "active", "paused"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  statusFilter === st
                    ? "bg-olive-800 text-white shadow-xs"
                    : "bg-white dark:bg-dark-surface text-charcoal/70 dark:text-dark-muted border border-charcoal/15 dark:border-dark-border hover:bg-charcoal/5"
                }`}
              >
                {st === "all" ? `All (${services.length})` : st}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
          <span className="text-xs font-bold text-charcoal/50 dark:text-dark-muted mr-1 shrink-0">
            Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-olive-800 text-white shadow-xs"
                  : "bg-white dark:bg-dark-surface text-charcoal/70 dark:text-dark-muted border border-charcoal/15 dark:border-dark-border hover:border-olive-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 5. SERVICES GRID WITH THE CREATED JOBS & DASHED ADD BUTTON */}
      <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className={`bg-cream-card dark:bg-dark-card rounded-3xl p-5 sm:p-6 border transition-all flex flex-col justify-between ${
              service.isActive
                ? "border-charcoal/10 dark:border-dark-border shadow-xs hover:border-olive-600/50"
                : "border-charcoal/10 dark:border-dark-border opacity-70 bg-charcoal/5 dark:bg-dark-surface"
            }`}
          >
            <div className="space-y-3.5">
              {/* Top Tag Row */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-olive-100 dark:bg-olive-950/60 text-olive-800 dark:text-olive-300 border border-olive-200 dark:border-olive-800/40">
                  {service.category}
                </span>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      service.isActive
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        service.isActive ? "bg-emerald-600 animate-pulse" : "bg-amber-500"
                      }`}
                    />
                    {service.isActive ? "Active" : "Paused"}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-charcoal dark:text-dark-text leading-snug">
                  {service.name}
                </h3>
                <p className="text-xs sm:text-sm text-charcoal/70 dark:text-dark-muted mt-1.5 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Price & Turnaround Time */}
              <div className="flex items-center justify-between py-2 border-y border-charcoal/10 dark:border-dark-border">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-2xl sm:text-3xl font-extrabold text-olive-900 dark:text-olive-300">
                    ₹{service.price}
                  </span>
                  <span className="text-xs text-charcoal/60 dark:text-dark-muted font-semibold">
                    / {service.priceUnit}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-charcoal/70 dark:text-dark-muted">
                  <Clock size={13} className="text-olive-700 dark:text-olive-400" />
                  <span>{service.duration}</span>
                </div>
              </div>

              {/* Inclusions */}
              {service.inclusions && service.inclusions.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted block">
                    What's Included:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {service.inclusions.map((inc, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-white dark:bg-dark-surface text-charcoal/80 dark:text-dark-text border border-charcoal/10 dark:border-dark-border"
                      >
                        <Check size={11} className="text-emerald-600" />
                        <span>{inc}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* VERIFIED RELATED DOCS & CREDENTIALS SECTION */}
              <div className="p-3 bg-white/70 dark:bg-dark-surface/60 rounded-2xl border border-charcoal/10 dark:border-dark-border space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-olive-800 dark:text-olive-400 flex items-center gap-1">
                    <ShieldCheck size={13} />
                    <span>Attached Docs &amp; Info (प्रमाणित विवरण)</span>
                  </span>
                  {service.docFileName && (
                    <button
                      type="button"
                      onClick={() => setDocPreviewModal(service)}
                      className="text-[11px] font-bold text-olive-700 hover:text-olive-900 dark:text-olive-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Eye size={12} />
                      <span>View Doc</span>
                    </button>
                  )}
                </div>

                {/* Certificate */}
                {service.certificateName && (
                  <div className="flex items-start gap-1.5 text-[11px]">
                    <Award size={13} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-charcoal dark:text-dark-text">
                        {service.certificateName}
                      </span>
                      {service.certificateNumber && (
                        <span className="text-charcoal/50 dark:text-dark-muted ml-1 font-mono">
                          (Reg: {service.certificateNumber})
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Equipment & Experience */}
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-charcoal/5 dark:border-dark-border">
                  {service.experienceYears && (
                    <div>
                      <span className="text-charcoal/50 dark:text-dark-muted block text-[10px]">Experience:</span>
                      <span className="font-semibold text-charcoal dark:text-dark-text">
                        {service.experienceYears}
                      </span>
                    </div>
                  )}

                  {service.toolsEquipment && (
                    <div>
                      <span className="text-charcoal/50 dark:text-dark-muted block text-[10px]">Tools/Gear:</span>
                      <span className="font-semibold text-charcoal dark:text-dark-text truncate block">
                        {service.toolsEquipment}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Emergency SOS Tag */}
              {service.emergencyAvailable && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-500/20">
                  <Zap size={13} className="fill-rose-500 text-rose-500" />
                  <span>Urgent SOS Ready (+₹{service.emergencyFee} express fee)</span>
                </div>
              )}
            </div>

            {/* Card Footer Actions */}
            <div className="pt-4 mt-4 border-t border-charcoal/10 dark:border-dark-border flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-charcoal/60 dark:text-dark-muted">
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star size={13} className="fill-amber-400" /> {service.rating || "4.9"}
                </span>
                <span>•</span>
                <span>{service.ordersCompleted || 0} orders</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(service.id)}
                  title={service.isActive ? "Pause Bookings" : "Activate Bookings"}
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    service.isActive
                      ? "bg-white dark:bg-dark-surface border-charcoal/15 dark:border-dark-border text-charcoal/80 hover:text-charcoal"
                      : "bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-700"
                  }`}
                >
                  <Power size={12} />
                  <span>{service.isActive ? "Pause" : "Activate"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEditModal(service)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-dark-surface border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text hover:border-olive-600 transition-all cursor-pointer"
                >
                  <Edit3 size={12} />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteService(service.id, service.name)}
                  className="p-1.5 rounded-xl bg-white dark:bg-dark-surface border border-charcoal/15 dark:border-dark-border text-charcoal/40 hover:text-rose-600 transition-all cursor-pointer"
                  title="Delete service"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* 6. EXTRA DASHED "ADD ANOTHER SERVICE" CARD IN THE GRID */}
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="border-2 border-dashed border-charcoal/20 dark:border-dark-border hover:border-olive-600 dark:hover:border-olive-400 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-3 transition-all hover:bg-olive-50/50 dark:hover:bg-olive-950/20 group cursor-pointer min-h-[340px]"
        >
          <div className="w-14 h-14 rounded-2xl bg-olive-100 dark:bg-olive-950 text-olive-700 dark:text-olive-300 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
            <Plus size={26} />
          </div>
          <div>
            <h4 className="font-display text-base sm:text-lg font-bold text-charcoal dark:text-dark-text group-hover:text-olive-800 dark:group-hover:text-olive-300 transition-colors">
              + Add My New Service (नया काम जोड़ें)
            </h4>
            <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-1.5 max-w-xs mx-auto leading-relaxed">
              Upload certificates, mention work equipment &amp; turnaround time, and publish for instant bookings.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-olive-800 dark:text-olive-300 bg-white dark:bg-dark-card px-4 py-1.5 rounded-xl border border-charcoal/10 shadow-2xs">
            Open Service &amp; Docs Form →
          </span>
        </button>
      </div>

      {/* 7. ADD / EDIT SERVICE & DOCUMENT UPLOAD FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="w-full max-w-2xl bg-cream dark:bg-dark-card rounded-3xl border border-charcoal/15 dark:border-dark-border shadow-2xl p-6 sm:p-7 space-y-5 my-8 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-charcoal/10 dark:border-dark-border">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-olive-700 text-white shadow-xs">
                  <Wrench size={20} />
                </div>
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-charcoal dark:text-dark-text">
                    {editingServiceId ? "Edit Service & Document Info" : "Add New Trade Service & Upload Docs"}
                  </h3>
                  <p className="text-[11px] text-charcoal/60 dark:text-dark-muted">
                    Set trade pricing, turnaround time, and upload related skill certificates or work samples.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-charcoal/50 hover:text-charcoal hover:bg-charcoal/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveService} className="space-y-4 text-xs sm:text-sm">
              {/* SECTION A: BASIC TRADE INFO */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-olive-800 dark:text-olive-400 flex items-center gap-1.5">
                  <Briefcase size={14} />
                  <span>1. Basic Service Information (सेवा की बुनियादी जानकारी)</span>
                </h4>

                {/* Service Title */}
                <div>
                  <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1 block">
                    Service Title / Trade Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Designer Blouse Stitching, Solar Inverter Setup, Pipe Leakage Fix"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white dark:bg-dark-surface rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal dark:text-dark-text outline-none border border-charcoal/20 dark:border-dark-border focus:border-olive-600 shadow-2xs"
                  />
                </div>

                {/* Category & Duration Row */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1 block">
                      Trade Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-white dark:bg-dark-surface rounded-xl px-3 py-2.5 text-xs text-charcoal dark:text-dark-text font-semibold outline-none border border-charcoal/20 dark:border-dark-border focus:border-olive-600 shadow-2xs"
                    >
                      {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1 block">
                      Turnaround / Completion Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 24 - 48 Hours, Same Day, 3 Days"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full bg-white dark:bg-dark-surface rounded-xl px-3.5 py-2.5 text-xs text-charcoal dark:text-dark-text outline-none border border-charcoal/20 dark:border-dark-border focus:border-olive-600 shadow-2xs"
                    />
                  </div>
                </div>

                {/* Price & Unit */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1 block">
                      Base Rate (in ₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/50 text-xs font-bold">₹</span>
                      <input
                        type="number"
                        required
                        min="10"
                        placeholder="350"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full bg-white dark:bg-dark-surface rounded-xl pl-8 pr-3 py-2.5 text-xs sm:text-sm text-charcoal dark:text-dark-text font-bold outline-none border border-charcoal/20 dark:border-dark-border focus:border-olive-600 shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1 block">
                      Pricing Unit
                    </label>
                    <select
                      value={formData.priceUnit}
                      onChange={(e) => setFormData({ ...formData, priceUnit: e.target.value })}
                      className="w-full bg-white dark:bg-dark-surface rounded-xl px-3 py-2.5 text-xs text-charcoal dark:text-dark-text font-semibold outline-none border border-charcoal/20 dark:border-dark-border focus:border-olive-600 shadow-2xs"
                    >
                      <option value="piece">Per Piece / Item</option>
                      <option value="set">Per Set / Suit</option>
                      <option value="visit">Per Service Visit</option>
                      <option value="hour">Per Hour</option>
                      <option value="day">Per Full Day</option>
                      <option value="meter">Per Meter</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1 block">
                    Detailed Service Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe what you will do, materials handled, fitting guarantees, etc."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white dark:bg-dark-surface rounded-xl p-3 text-xs text-charcoal dark:text-dark-text leading-relaxed outline-none border border-charcoal/20 dark:border-dark-border focus:border-olive-600 shadow-2xs"
                  />
                </div>

                {/* Inclusions */}
                <div>
                  <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1 block">
                    Key Inclusions (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Free measurements, Double-stitch thread, 1-week free adjustment"
                    value={formData.inclusions}
                    onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
                    className="w-full bg-white dark:bg-dark-surface rounded-xl px-3.5 py-2 text-xs text-charcoal dark:text-dark-text outline-none border border-charcoal/20 dark:border-dark-border focus:border-olive-600 shadow-2xs"
                  />
                </div>
              </div>

              {/* SECTION B: UPLOAD / MENTION RELATED DOCS & VERIFICATION INFO */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-dark-surface border border-olive-200 dark:border-olive-900/60 space-y-3.5 shadow-2xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-olive-800 dark:text-olive-400 flex items-center gap-1.5">
                  <ShieldCheck size={16} />
                  <span>2. Upload / Mention Related Documents &amp; Info (दस्तावेज़ और प्रमाण पत्र)</span>
                </h4>

                {/* Certificate Details */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1 block">
                      Trade Certificate / License Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NSDC Tailoring L3, ITI Wireman, PMKVY"
                      value={formData.certificateName}
                      onChange={(e) => setFormData({ ...formData, certificateName: e.target.value })}
                      className="w-full bg-cream dark:bg-dark-card rounded-xl px-3 py-2 text-xs text-charcoal dark:text-dark-text outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1 block">
                      Certificate / Registration Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NSDC-2024-8921 or Trade Reg #"
                      value={formData.certificateNumber}
                      onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value })}
                      className="w-full bg-cream dark:bg-dark-card rounded-xl px-3 py-2 text-xs text-charcoal dark:text-dark-text outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600"
                    />
                  </div>
                </div>

                {/* Upload Certificate Document File */}
                <div>
                  <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1 block">
                    Upload Skill Certificate (PDF / Image)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 border-2 border-dashed border-charcoal/20 dark:border-dark-border hover:border-olive-600 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer bg-cream/50 dark:bg-dark-card transition-colors">
                      <Upload size={16} className="text-olive-700 dark:text-olive-400 shrink-0" />
                      <span className="text-xs font-medium text-charcoal/70 dark:text-dark-muted truncate">
                        {formData.docFileName ? formData.docFileName : "Click to browse Certificate Document..."}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleDocFileUpload}
                        className="hidden"
                      />
                    </label>
                    {formData.docFileName && (
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 shrink-0 flex items-center gap-1">
                        <CheckCircle size={14} /> Attached
                      </span>
                    )}
                  </div>
                </div>

                {/* Work Sample / Tool Photo Upload */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1 block">
                      Upload Work Sample / Workshop Photo
                    </label>
                    <label className="border border-charcoal/20 dark:border-dark-border hover:border-olive-600 rounded-xl p-2.5 flex items-center gap-2 cursor-pointer bg-cream/50 dark:bg-dark-card transition-colors">
                      <Image size={15} className="text-olive-700 dark:text-olive-400 shrink-0" />
                      <span className="text-xs text-charcoal/70 dark:text-dark-muted truncate">
                        {formData.workSampleName ? formData.workSampleName : "Choose photo..."}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1 block">
                      Years of Trade Experience
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 5 Years, 8+ Years"
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                      className="w-full bg-cream dark:bg-dark-card rounded-xl px-3 py-2 text-xs text-charcoal dark:text-dark-text outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600"
                    />
                  </div>
                </div>

                {/* Equipment & Tools Used */}
                <div>
                  <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1 block">
                    Tools &amp; Equipment Owned / Used
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Usha Single Needle Industrial Machine, Pipe Wrenches, Multimeter, Soldering Iron"
                    value={formData.toolsEquipment}
                    onChange={(e) => setFormData({ ...formData, toolsEquipment: e.target.value })}
                    className="w-full bg-cream dark:bg-dark-card rounded-xl px-3.5 py-2 text-xs text-charcoal dark:text-dark-text outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600"
                  />
                </div>

                {/* Aadhaar Verification declaration */}
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={formData.isAadhaarVerified}
                    onChange={(e) => setFormData({ ...formData, isAadhaarVerified: e.target.checked })}
                    className="rounded text-olive-700 focus:ring-olive-600"
                  />
                  <span className="text-[11px] font-semibold text-charcoal/80 dark:text-dark-text">
                    I declare that this service meets rural safety norms and is linked to my verified worker Aadhaar KYC.
                  </span>
                </label>
              </div>

              {/* SECTION C: EMERGENCY DISPATCH */}
              <div className="p-3.5 rounded-2xl bg-cream dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-amber-600" />
                  <div>
                    <span className="text-xs font-bold text-charcoal dark:text-dark-text block">
                      Emergency SOS Dispatch Available?
                    </span>
                    <span className="text-[10px] text-charcoal/60 dark:text-dark-muted">
                      Customers can request urgent 2-hour doorstep response
                    </span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.emergencyAvailable}
                    onChange={(e) => setFormData({ ...formData, emergencyAvailable: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-charcoal/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-olive-700"></div>
                </label>
              </div>

              {formData.emergencyAvailable && (
                <div>
                  <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1 block">
                    Express Emergency Extra Charge (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.emergencyFee}
                    onChange={(e) => setFormData({ ...formData, emergencyFee: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-dark-surface rounded-xl px-3.5 py-2 text-xs text-charcoal dark:text-dark-text font-bold outline-none border border-charcoal/20 dark:border-dark-border focus:border-olive-600"
                  />
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-charcoal/10 dark:border-dark-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal/70 hover:text-charcoal cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-olive-700 hover:bg-olive-800 text-white shadow-xs border border-olive-800/20 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Plus size={15} />
                  <span>{editingServiceId ? "Save & Update Service" : "Publish New Service"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. DOCUMENT PREVIEW MODAL */}
      {docPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-dark-card rounded-3xl p-6 border border-charcoal/15 dark:border-dark-border shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-charcoal/10 dark:border-dark-border">
              <div className="flex items-center gap-2 text-olive-800 dark:text-olive-300 font-bold">
                <Award size={18} />
                <h3 className="font-display text-base font-bold text-charcoal dark:text-dark-text">
                  Trade Certificate Proof
                </h3>
              </div>
              <button
                onClick={() => setDocPreviewModal(null)}
                className="p-1 text-charcoal/50 hover:text-charcoal cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-cream dark:bg-dark-surface border border-charcoal/10 space-y-2.5 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Certificate Name</span>
                <span className="font-bold text-sm text-charcoal dark:text-dark-text">
                  {docPreviewModal.certificateName || "Trade Qualification Certificate"}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Registration Number</span>
                <span className="font-mono font-bold text-olive-800 dark:text-olive-300">
                  {docPreviewModal.certificateNumber || "KRY-VERIFIED-2026"}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Attached Document File</span>
                <span className="font-medium text-charcoal/80 flex items-center gap-1.5 mt-0.5">
                  <FileText size={14} className="text-olive-700" />
                  {docPreviewModal.docFileName || "certificate_record.pdf"}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Equipment Mentioned</span>
                <span className="font-medium text-charcoal/80">
                  {docPreviewModal.toolsEquipment || "Standard workshop kit"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setDocPreviewModal(null)}
              className="w-full py-2.5 bg-olive-800 text-white rounded-xl text-xs font-bold hover:bg-olive-900 transition-colors cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
