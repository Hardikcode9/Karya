import { useState, useMemo, useEffect } from "react";
import {
  Package, Search, Filter, Plus, Edit3, Trash2, CheckCircle2,
  XCircle, IndianRupee, ShoppingBag, Star, Sparkles, Tag,
  AlertTriangle, Eye, X, Check, ArrowUpDown, Layers
} from "lucide-react";
import { useToast } from "../hooks/useToast";
import AdminModal from "../components/ui/AdminModal";

const STORAGE_KEY = "karya_admin_products_v1";

const INITIAL_PRODUCTS = [
  {
    id: "prod-101",
    name: "Handloom Chanderi Cotton Saree",
    sku: "HL-SAR-01",
    shgName: "Maa Lakshmi Women SHG",
    category: "Handloom & Textiles",
    price: 1850,
    unit: "piece",
    stock: 24,
    status: "in_stock",
    featured: true,
    rating: 4.9,
    certBadge: "Handloom Mark Verified",
    village: "Rampura",
    description: "Pure cotton natural dyed traditional chanderi border saree woven on village pit looms.",
  },
  {
    id: "prod-102",
    name: "Wild Forest Raw Honey (500g)",
    sku: "ORG-HNY-500",
    shgName: "Annapurna Organic Millet SHG",
    category: "Organic Food & Honey",
    price: 340,
    unit: "jar",
    stock: 58,
    status: "in_stock",
    featured: true,
    rating: 4.8,
    certBadge: "FSSAI Rural Organic",
    village: "Sonipur Block",
    description: "Unpasteurized multi-flora honey sustainably harvested by tribal women collectives.",
  },
  {
    id: "prod-103",
    name: "Terracotta Handcrafted Water Pitcher (Matka)",
    sku: "POT-MAT-04",
    shgName: "Surya Handicrafts Mahila Mandal",
    category: "Pottery & Terracotta",
    price: 260,
    unit: "piece",
    stock: 6,
    status: "low_stock",
    featured: false,
    rating: 4.7,
    certBadge: "Natural Clay Lead-Free",
    village: "Devgaon Cluster",
    description: "Natural cooling porous terracotta clay pot with hand-painted floral motifs.",
  },
  {
    id: "prod-104",
    name: "Traditional Spicy Mango Pickle (1kg)",
    sku: "PKL-MNG-01",
    shgName: "Maa Lakshmi Women SHG",
    category: "Organic Food & Honey",
    price: 220,
    unit: "kg",
    stock: 42,
    status: "in_stock",
    featured: false,
    rating: 4.9,
    certBadge: "FSSAI Cottage Certified",
    village: "Rampura",
    description: "Sun-cured raw mango with cold-pressed mustard oil and stone-ground spices.",
  },
  {
    id: "prod-105",
    name: "Handwoven Bamboo Storage Baskets (Set of 3)",
    sku: "BAM-BSK-03",
    shgName: "Surya Handicrafts Mahila Mandal",
    category: "Bamboo & Cane Craft",
    price: 490,
    unit: "set",
    stock: 0,
    status: "out_of_stock",
    featured: false,
    rating: 4.6,
    certBadge: "100% Biodegradable",
    village: "Devgaon Cluster",
    description: "Sturdy bamboo utility baskets ideal for kitchen storage and sustainable gifting.",
  },
  {
    id: "prod-106",
    name: "Stone-Ground Ragi & Multi-Millet Flour (2kg)",
    sku: "MLT-RAG-02",
    shgName: "Annapurna Organic Millet SHG",
    category: "Organic Food & Honey",
    price: 180,
    unit: "pack",
    stock: 35,
    status: "in_stock",
    featured: true,
    rating: 4.8,
    certBadge: "NRLM Millet Mission",
    village: "Sonipur Block",
    description: "Nutritious farm-direct organic finger millet flour with zero preservatives.",
  },
];

export default function AdminProducts() {
  const toast = useToast();

  const [productsList, setProductsList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(productsList));
    } catch {
      // ignore
    }
  }, [productsList]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [editModal, setEditModal] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    shgName: "Maa Lakshmi Women SHG",
    category: "Handloom & Textiles",
    price: 450,
    unit: "piece",
    stock: 20,
    certBadge: "NRLM Verified",
    village: "Rampura",
    description: "",
  });

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.shgName.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.village.toLowerCase().includes(search.toLowerCase());

      const matchesCat = categoryFilter === "all" || p.category === categoryFilter;

      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in_stock" && p.stock > 10) ||
        (stockFilter === "low_stock" && p.stock > 0 && p.stock <= 10) ||
        (stockFilter === "out_of_stock" && p.stock === 0);

      return matchesSearch && matchesCat && matchesStock;
    });
  }, [productsList, search, categoryFilter, stockFilter]);

  // Aggregate Metrics
  const totalStockUnits = useMemo(() => {
    return productsList.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
  }, [productsList]);

  const totalValue = useMemo(() => {
    return productsList.reduce((acc, p) => acc + (Number(p.stock) || 0) * (Number(p.price) || 0), 0);
  }, [productsList]);

  // Handlers
  const handleToggleFeatured = (id, name, current) => {
    setProductsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !current } : p))
    );
    if (!current) {
      toast.success(`"${name}" is now featured on the Karya Storefront!`);
    } else {
      toast.info(`"${name}" removed from featured list.`);
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove product "${name}"?`)) {
      setProductsList((prev) => prev.filter((p) => p.id !== id));
      toast.info(`Product "${name}" deleted.`);
    }
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    const updatedStatus =
      editModal.stock === 0
        ? "out_of_stock"
        : editModal.stock <= 10
        ? "low_stock"
        : "in_stock";

    setProductsList((prev) =>
      prev.map((p) =>
        p.id === editModal.id ? { ...editModal, status: updatedStatus } : p
      )
    );
    toast.success(`Product "${editModal.name}" updated!`);
    setEditModal(null);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newProduct.name.trim()) {
      toast.error("Please enter product name");
      return;
    }

    const stockNum = Number(newProduct.stock) || 0;
    const prodStatus =
      stockNum === 0
        ? "out_of_stock"
        : stockNum <= 10
        ? "low_stock"
        : "in_stock";

    const created = {
      id: `prod-${Date.now()}`,
      name: newProduct.name.trim(),
      sku: `ART-${Math.floor(100 + Math.random() * 900)}`,
      shgName: newProduct.shgName,
      category: newProduct.category,
      price: Number(newProduct.price) || 250,
      unit: newProduct.unit,
      stock: stockNum,
      status: prodStatus,
      featured: false,
      rating: 5.0,
      certBadge: newProduct.certBadge || "Rural Craft Verified",
      village: newProduct.village,
      description: newProduct.description.trim() || "Authentic handcrafted village product.",
    };

    setProductsList((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewProduct({
      name: "",
      shgName: "Maa Lakshmi Women SHG",
      category: "Handloom & Textiles",
      price: 450,
      unit: "piece",
      stock: 20,
      certBadge: "NRLM Verified",
      village: "Rampura",
      description: "",
    });
    toast.success(`Product "${created.name}" published to catalog!`);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl sm:text-3xl text-charcoal dark:text-dark-text font-bold">
              SHG Artisan Products
            </h1>
            <span className="text-xs font-bold uppercase tracking-wider bg-terracotta-100 dark:bg-terracotta-900/40 text-terracotta-800 dark:text-terracotta-300 px-3 py-0.5 rounded-full border border-terracotta-300/40">
              Village Catalog
            </span>
          </div>
          <p className="text-charcoal/65 dark:text-dark-muted text-xs sm:text-sm mt-1">
            Handlooms, organic harvests, terracotta pots, bamboo crafts &amp; regional GI-tagged items.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-olive-700 hover:bg-olive-800 text-white shadow-xs transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Artisan Product</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Catalog Items</span>
            <ShoppingBag size={16} className="text-olive-700 dark:text-olive-400" />
          </div>
          <div className="text-2xl font-bold font-display text-charcoal dark:text-dark-text">
            {productsList.length} SKUs
          </div>
          <div className="text-[11px] text-charcoal/50 dark:text-dark-muted mt-0.5">
            Across 4 craft categories
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Available Inventory</span>
            <Layers size={16} className="text-olive-700 dark:text-olive-400" />
          </div>
          <div className="text-2xl font-bold font-display text-charcoal dark:text-dark-text">
            {totalStockUnits} Units
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
            Stored in village hubs
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Inventory Value</span>
            <IndianRupee size={16} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-display text-charcoal dark:text-dark-text">
            ₹{totalValue.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
            100% direct artisan margin
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 rounded-2xl border border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-semibold mb-1">
            <span>Storefront Featured</span>
            <Star size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-display text-charcoal dark:text-dark-text">
            {productsList.filter((p) => p.featured).length} Items
          </div>
          <div className="text-[11px] text-olive-800 dark:text-olive-300 font-semibold mt-0.5">
            Highlighted for buyers
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
              placeholder="Search product, SHG producer, SKU or village..."
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
              <option value="all">All Craft Categories</option>
              <option value="Handloom & Textiles">Handloom &amp; Textiles</option>
              <option value="Organic Food & Honey">Organic Food &amp; Honey</option>
              <option value="Pottery & Terracotta">Pottery &amp; Terracotta</option>
              <option value="Bamboo & Cane Craft">Bamboo &amp; Cane Craft</option>
            </select>

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none"
            >
              <option value="all">All Stock Levels</option>
              <option value="in_stock">In Stock (&gt;10)</option>
              <option value="low_stock">Low Stock (1-10)</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Product Catalog Table */}
      <div className="bg-cream-card dark:bg-dark-card rounded-2xl border border-charcoal/10 dark:border-dark-border overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-charcoal/5 dark:bg-dark-bg/60 border-b border-charcoal/10 dark:border-dark-border text-charcoal/70 dark:text-dark-muted font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Product Name &amp; SKU</th>
                <th className="py-3.5 px-4">SHG Producer Group</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Certification</th>
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5 dark:divide-dark-border">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-charcoal/50 dark:text-dark-muted">
                    No products match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-charcoal/2 dark:hover:bg-dark-bg/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-bold text-charcoal dark:text-dark-text">
                          {p.name}
                        </div>
                        <span className="text-[10px] text-charcoal/50 dark:text-dark-muted font-mono">
                          {p.sku}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-charcoal dark:text-dark-text">
                        {p.shgName}
                      </div>
                      <div className="text-[10px] text-charcoal/50 dark:text-dark-muted">
                        {p.village}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border text-charcoal/80 dark:text-dark-muted">
                        {p.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-charcoal dark:text-dark-text flex items-center gap-0.5">
                        <IndianRupee size={12} />
                        <span>{p.price}</span>
                        <span className="text-[10px] font-normal text-charcoal/55 dark:text-dark-muted">
                          /{p.unit}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-charcoal dark:text-dark-text">
                          {p.stock} {p.unit}s
                        </span>
                        {p.stock === 0 ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300">
                            Out
                          </span>
                        ) : p.stock <= 10 ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300">
                            Low
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
                            Ready
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40">
                        {p.certBadge}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(p.id, p.name, p.featured)}
                        className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                          p.featured
                            ? "text-amber-500 bg-amber-50 dark:bg-amber-950/40"
                            : "text-charcoal/30 hover:text-amber-400"
                        }`}
                        title={p.featured ? "Remove from Featured" : "Mark as Featured"}
                      >
                        <Star size={15} fill={p.featured ? "currentColor" : "none"} />
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditModal({ ...p })}
                          title="Edit Product & Stock"
                          className="p-1.5 rounded-lg text-charcoal/60 dark:text-dark-muted hover:text-olive-800 dark:hover:text-olive-300 hover:bg-charcoal/5 dark:hover:bg-dark-bg cursor-pointer"
                        >
                          <Edit3 size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.name)}
                          title="Delete Product"
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

      {/* 5. Edit Product Modal */}
      <AdminModal isOpen={!!editModal} onClose={() => setEditModal(null)}>
        {editModal && (
          <>
            <div className="px-6 sm:px-8 py-5 border-b border-charcoal/10 dark:border-dark-border flex items-center justify-between shrink-0 bg-cream/40 dark:bg-dark-surface/50">
              <div>
                <h3 className="font-display font-bold text-xl text-charcoal dark:text-dark-text">
                  Edit Product &amp; Inventory
                </h3>
                <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-0.5">
                  Update price benchmarks, stock reserves and certification badges.
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
                      Product Name *
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
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      value={editModal.price}
                      onChange={(e) => setEditModal({ ...editModal, price: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                      Units in Village Stock
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editModal.stock}
                      onChange={(e) => setEditModal({ ...editModal, stock: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                      Certification / Trust Badge
                    </label>
                    <input
                      type="text"
                      value={editModal.certBadge}
                      onChange={(e) => setEditModal({ ...editModal, certBadge: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                      Product Description
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
                  Save Product
                </button>
              </div>
            </form>
          </>
        )}
      </AdminModal>

      {/* 6. Add Product Modal */}
      <AdminModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <div className="px-6 sm:px-8 py-5 border-b border-charcoal/10 dark:border-dark-border flex items-center justify-between shrink-0 bg-cream/40 dark:bg-dark-surface/50">
          <div>
            <h3 className="font-display font-bold text-xl text-charcoal dark:text-dark-text">
              Add New Artisan Product
            </h3>
            <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-0.5">
              Publish a genuine rural handicraft, farm-produce or SHG creation.
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
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pure Desi Ghee (Bilona Method)"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                  SHG Producer
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mahila Shakti Samuh"
                  value={newProduct.shgName}
                  onChange={(e) => setNewProduct({ ...newProduct, shgName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                  Village / Block
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sonbhadra"
                  value={newProduct.village}
                  onChange={(e) => setNewProduct({ ...newProduct, village: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                  Category
                </label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                >
                  <option value="Handloom & Textiles">Handloom &amp; Textiles</option>
                  <option value="Organic Food & Honey">Organic Food &amp; Honey</option>
                  <option value="Pottery & Terracotta">Pottery &amp; Terracotta</option>
                  <option value="Bamboo & Cane Craft">Bamboo &amp; Cane Craft</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                  Unit
                </label>
                <select
                  value={newProduct.unit}
                  onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                >
                  <option value="piece">piece</option>
                  <option value="jar">jar</option>
                  <option value="kg">kg</option>
                  <option value="set">set</option>
                  <option value="pack">pack</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                  Initial Stock
                </label>
                <input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text text-sm focus:outline-none focus:border-olive-600 shadow-2xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-charcoal dark:text-dark-text mb-1.5 text-xs">
                  Certification Badge
                </label>
                <input
                  type="text"
                  placeholder="e.g. FSSAI Certified / NRLM Craft"
                  value={newProduct.certBadge}
                  onChange={(e) => setNewProduct({ ...newProduct, certBadge: e.target.value })}
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
              Publish Product
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
