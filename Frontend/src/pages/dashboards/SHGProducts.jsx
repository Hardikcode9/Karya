import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Package, Plus, Search, Filter, CheckCircle2, IndianRupee,
  Edit3, Trash2, X, Camera, Upload, Sparkles, Tag, Eye,
  AlertTriangle, ShieldCheck, Star, Layers, Check
} from "lucide-react";
import Button from "../../components/ui/Button";

// Initial Catalog of Products for the SHG
const INITIAL_PRODUCTS_LIST = [
  {
    id: "PROD-01",
    title: "Handloom Chanderi Pure Cotton Saree",
    sku: "CHN-COT-01",
    category: "Handloom",
    price: 1450,
    priceFormatted: "₹1,450",
    stock: 18,
    artisan: "Sunita Devi (Master Weaver)",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=80",
    certification: "GI Certified Style · Handloom Mark",
    description: "Traditional pit-loom woven pure cotton Chanderi saree with gold-toned zari borders. Dyed using non-toxic natural azo-free pigments.",
    status: "in-stock",
    salesCount: 48,
  },
  {
    id: "PROD-02",
    title: "Raw Wild Forest Multi-Flora Honey (500g Jar)",
    sku: "HNY-FOR-02",
    category: "Forest Honey",
    price: 420,
    priceFormatted: "₹420",
    stock: 45,
    artisan: "Radha Kol (Van Dhan Lead)",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=80",
    certification: "FSSAI Organic Lab Tested",
    description: "Unheated, unfiltered multi-flora raw forest honey sustainably gathered by tribal women from deep satna forests.",
    status: "in-stock",
    salesCount: 114,
  },
  {
    id: "PROD-03",
    title: "Natural Terracotta Mitti Cooking Handi & Curd Set",
    sku: "MIT-CLY-03",
    category: "Terracotta",
    price: 650,
    priceFormatted: "₹650",
    stock: 24,
    artisan: "Geeta Prajapati (Potter Lead)",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500&auto=format&fit=crop&q=80",
    certification: "100% Porous Alkaline Clay",
    description: "Woodfire kiln-baked earthen cooking handi with matching lid. Retains 98% food nutrition and imparts natural sweetness to slow-cooked curries.",
    status: "in-stock",
    salesCount: 51,
  },
  {
    id: "PROD-04",
    title: "Traditional Madhubani Canvas Scroll (Tree of Life)",
    sku: "ART-MAD-04",
    category: "Folk Art",
    price: 890,
    priceFormatted: "₹890",
    stock: 8,
    artisan: "Urmila Devi (Folk Artist)",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80",
    certification: "Authentic Mithila GI Motif",
    description: "Intricate line-work folk art hand-painted on handmade unbleached canvas with natural mineral pigments and bamboo scroll hanger.",
    status: "low-stock",
    salesCount: 21,
  },
  {
    id: "PROD-05",
    title: "Braided Golden Bamboo Storage Baskets (Set of 2)",
    sku: "BAM-BSK-05",
    category: "Bamboo",
    price: 480,
    priceFormatted: "₹480",
    stock: 30,
    artisan: "Malati Barman (Bamboo Lead)",
    image: "https://images.unsplash.com/photo-1590736969955-71cc94801759?w=500&auto=format&fit=crop&q=80",
    certification: "Zero-Plastic Eco-Treated",
    description: "Set of 2 stackable golden cane storage baskets woven from local bamboo with moisture-resistant organic herbal finish.",
    status: "in-stock",
    salesCount: 31,
  },
  {
    id: "PROD-06",
    title: "Lakadong Stone-Ground Turmeric Powder (250g)",
    sku: "AGR-TUR-06",
    category: "Forest Honey",
    price: 260,
    priceFormatted: "₹260",
    stock: 60,
    artisan: "Baphira Shullai (Agro Lead)",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80",
    certification: "7.5% High Curcumin Certified",
    description: "Indigenous organic Lakadong turmeric slowly stone ground on watermills to retain natural essential oils and vibrant golden purity.",
    status: "in-stock",
    salesCount: 78,
  },
  {
    id: "PROD-07",
    title: "Solar Charkha Khadi Cotton Yardage (2.5m Kurta Cut)",
    sku: "KHD-FAB-08",
    category: "Handloom",
    price: 780,
    priceFormatted: "₹780",
    stock: 14,
    artisan: "Kamlesh Kumari (Spinning Cell)",
    image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=500&auto=format&fit=crop&q=80",
    certification: "Zero-Carbon Solar Khadi",
    description: "Ultra-breathable handspun organic cotton fabric in natural unbleached ivory. Perfect for summer shirts and traditional kurtas.",
    status: "in-stock",
    salesCount: 19,
  },
  {
    id: "PROD-08",
    title: "Gramin Woodfire Millet Catering (Per Thali)",
    sku: "CAT-GRAM-07",
    category: "Village Catering",
    price: 180,
    priceFormatted: "₹180 / Thali",
    stock: 120,
    artisan: "Kanti Bai (Kitchen Lead)",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80",
    certification: "FSSAI Clean Cooking Certified",
    description: "Traditional feast including hot bajra/jowar rotis, organic dal tadka, seasonal village subzi, wild pickle, and kheer served on Sal leaf pattals.",
    status: "in-stock",
    salesCount: 210,
  },
];

export default function SHGProducts() {
  const [searchParams] = useSearchParams();
  const actionParam = searchParams.get("action");

  const [products, setProducts] = useState(() => INITIAL_PRODUCTS_LIST);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  const [showAddModal, setShowAddModal] = useState(actionParam === "add-product");
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    title: "",
    category: "Handloom",
    price: "",
    stock: "",
    artisan: "Sunita Devi (Master Weaver)",
    sku: "",
    description: "",
    certification: "Handmade by SHG Artisans",
    image: "",
    status: "in-stock",
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (actionParam === "add-product") {
      setShowAddModal(true);
    }
  }, [actionParam]);

  // Handle Photo Upload with FileReader
  const handlePhotoUpload = (file, isEdit = true) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      if (isEdit) {
        setEditingProduct((prev) => ({ ...prev, image: dataUrl }));
      } else {
        setNewProduct((prev) => ({ ...prev, image: dataUrl }));
      }
      showToast("Product image uploaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price) {
      showToast("Please enter product title and price");
      return;
    }

    const created = {
      id: `PROD-${String(products.length + 1).padStart(2, "0")}`,
      title: newProduct.title,
      sku: newProduct.sku || `SKU-SHG-${String(products.length + 1).padStart(2, "0")}`,
      category: newProduct.category || "Handloom",
      price: Number(newProduct.price) || 500,
      priceFormatted: `₹${Number(newProduct.price).toLocaleString()}`,
      stock: Number(newProduct.stock) || 10,
      artisan: newProduct.artisan || "Village Artisan Collective",
      image: newProduct.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=80",
      certification: newProduct.certification || "Handmade SHG Certified",
      description: newProduct.description || "Authentic handcrafted village product.",
      status: Number(newProduct.stock) <= 5 ? "low-stock" : "in-stock",
      salesCount: 0,
    };

    setProducts((prev) => [created, ...prev]);
    setShowAddModal(false);
    setNewProduct({
      title: "",
      category: "Handloom",
      price: "",
      stock: "",
      artisan: "Sunita Devi (Master Weaver)",
      sku: "",
      description: "",
      certification: "Handmade by SHG Artisans",
      image: "",
      status: "in-stock",
    });
    showToast(`New product "${created.title}" added to your catalog!`);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              ...editingProduct,
              price: Number(editingProduct.price) || p.price,
              priceFormatted: `₹${Number(editingProduct.price).toLocaleString()}`,
              stock: Number(editingProduct.stock) || p.stock,
              status: Number(editingProduct.stock) <= 5 ? "low-stock" : "in-stock",
            }
          : p
      )
    );
    showToast(`Updated product "${editingProduct.title}"`);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast("Product removed from catalog");
    setProductToDelete(null);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchCat =
        categoryFilter === "all" ||
        prod.category.toLowerCase().includes(categoryFilter.toLowerCase());

      const matchStock =
        stockFilter === "all" || prod.status === stockFilter;

      const query = search.toLowerCase();
      const matchSearch =
        prod.title.toLowerCase().includes(query) ||
        prod.sku.toLowerCase().includes(query) ||
        prod.artisan.toLowerCase().includes(query) ||
        prod.description.toLowerCase().includes(query);

      return matchCat && matchStock && matchSearch;
    });
  }, [products, categoryFilter, stockFilter, search]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-charcoal text-cream text-xs font-bold shadow-elevation-3 border border-charcoal/20 flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <CheckCircle2 size={14} className="text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-charcoal/10 dark:border-dark-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-olive-100 dark:bg-olive-950/60 text-olive-800 dark:text-olive-300 text-[11px] font-bold mb-1.5">
            <Package size={12} />
            <span>SHG Artisan Inventory &amp; Catalog</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal dark:text-dark-text">
            Your Products &amp; Handcrafted Items
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted mt-0.5">
            Manage your village group's products, add new crafts, track stock availability, and update pricing.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Your Product</span>
          </Button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs">
          <p className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted">Total Products</p>
          <p className="font-display text-2xl font-bold text-charcoal dark:text-dark-text mt-0.5">
            {products.length} Items
          </p>
          <span className="text-[10px] text-emerald-600 font-bold">Catalog Active</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs">
          <p className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted">Total In-Stock</p>
          <p className="font-display text-2xl font-bold text-olive-800 dark:text-olive-300 mt-0.5">
            {products.reduce((acc, p) => acc + Number(p.stock || 0), 0)} Units
          </p>
          <span className="text-[10px] text-olive-600 font-bold">Ready to Dispatch</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs">
          <p className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted">Top Category</p>
          <p className="font-display text-lg font-bold text-charcoal dark:text-dark-text mt-1 truncate">
            Chanderi Handloom
          </p>
          <span className="text-[10px] text-sky-600 font-bold">Highest Demand</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs">
          <p className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted">Fair-Trade Mark</p>
          <p className="font-display text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            100% Direct
          </p>
          <span className="text-[10px] text-charcoal/50 dark:text-dark-muted">Zero Middlemen</span>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="p-3 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: "all", label: "All Products" },
            { id: "handloom", label: "Handloom" },
            { id: "honey", label: "Forest Honey" },
            { id: "terracotta", label: "Terracotta" },
            { id: "art", label: "Folk Art" },
            { id: "bamboo", label: "Bamboo" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                categoryFilter === cat.id
                  ? "bg-olive-800 text-cream shadow-xs"
                  : "bg-cream/60 dark:bg-dark-surface text-charcoal/70 dark:text-dark-text hover:bg-cream"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title, SKU, artisan..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-xs text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-3xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border">
            <Package size={36} className="mx-auto text-charcoal/30 dark:text-dark-muted mb-2" />
            <h3 className="font-display text-base font-bold text-charcoal dark:text-dark-text">
              No products found
            </h3>
            <p className="text-xs text-charcoal/50 dark:text-dark-muted mt-1">
              Try adjusting your search query or category filter, or click "Add Your Product" to create one.
            </p>
          </div>
        ) : (
          filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="rounded-3xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-elevation-1 overflow-hidden flex flex-col justify-between hover:shadow-elevation-2 transition-all group"
            >
              <div>
                {/* Product Image Banner */}
                <div className="relative h-44 w-full bg-cream/40 dark:bg-dark-surface overflow-hidden">
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=80";
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-xl bg-charcoal/70 backdrop-blur-xs text-cream text-[10px] font-bold">
                    {prod.category}
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <span
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border backdrop-blur-xs ${
                        prod.status === "in-stock"
                          ? "bg-emerald-500/90 text-white border-emerald-400"
                          : "bg-amber-500/90 text-white border-amber-400"
                      }`}
                    >
                      {prod.stock} in stock
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between gap-1 text-[11px] text-charcoal/50 dark:text-dark-muted">
                    <span className="font-mono">{prod.sku}</span>
                    <span className="text-[10px] text-olive-700 dark:text-olive-400 font-semibold truncate">
                      {prod.certification}
                    </span>
                  </div>

                  <h3 className="font-display text-sm font-bold text-charcoal dark:text-dark-text line-clamp-2 leading-snug">
                    {prod.title}
                  </h3>

                  <div className="pt-1 flex items-center gap-1.5 text-[11px] text-olive-800 dark:text-olive-300 font-semibold">
                    <Sparkles size={12} className="text-amber-500 shrink-0" />
                    <span className="truncate">Artisan: {prod.artisan}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Price & Actions */}
              <div className="p-4 pt-2 border-t border-charcoal/10 dark:border-dark-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-charcoal/50 dark:text-dark-muted block">Direct Price</span>
                  <span className="font-display text-base font-bold text-emerald-600 dark:text-emerald-400">
                    {prod.priceFormatted}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setViewingProduct(prod)}
                    className="p-2 rounded-xl bg-charcoal/5 dark:bg-dark-surface hover:bg-blue-50 dark:hover:bg-blue-950/40 text-charcoal/70 dark:text-dark-text hover:text-blue-600 border border-charcoal/10 dark:border-dark-border transition-all cursor-pointer"
                    title="View Product Details"
                  >
                    <Eye size={14} />
                  </button>

                  <button
                    onClick={() => setEditingProduct({ ...prod })}
                    className="p-2 rounded-xl bg-charcoal/5 dark:bg-dark-surface hover:bg-olive-50 dark:hover:bg-olive-950 text-charcoal/70 dark:text-dark-text hover:text-olive-700 border border-charcoal/10 dark:border-dark-border transition-all cursor-pointer"
                    title="Edit Product Details"
                  >
                    <Edit3 size={14} />
                  </button>

                  <button
                    onClick={() => setProductToDelete(prod)}
                    className="p-2 rounded-xl bg-charcoal/5 dark:bg-dark-surface hover:bg-rose-50 dark:hover:bg-rose-950/40 text-charcoal/70 dark:text-dark-text hover:text-rose-600 border border-charcoal/10 dark:border-dark-border transition-all cursor-pointer"
                    title="Delete Product"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ADD YOUR PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden">
          <div className="w-full max-w-lg max-h-[92vh] bg-white dark:bg-dark-card rounded-3xl shadow-elevation-3 border border-charcoal/10 dark:border-dark-border flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Header (Fixed at top) */}
            <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-charcoal/10 dark:border-dark-border shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-olive-100 dark:bg-olive-950 text-olive-800 dark:text-olive-300 flex items-center justify-center">
                  <Plus size={16} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-charcoal dark:text-dark-text leading-tight">
                    Add Your Product to Catalog
                  </h3>
                  <p className="text-xs text-charcoal/50 dark:text-dark-muted mt-0.5">
                    Publish a new handcrafted village item with photo, price &amp; artisan details
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl hover:bg-cream dark:hover:bg-dark-surface text-charcoal/50 hover:text-charcoal cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="add-prod-form" onSubmit={handleCreateProduct} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
              {/* Product Photo Upload */}
              <div className="p-4 rounded-2xl bg-cream/40 dark:bg-dark-surface/60 border border-charcoal/10 dark:border-dark-border space-y-3">
                <label className="block font-bold text-charcoal/90 dark:text-dark-text flex items-center gap-1.5">
                  <Camera size={14} className="text-olive-700 dark:text-olive-400" />
                  <span>Upload Product Photo *</span>
                </label>

                <div className="flex items-center gap-4">
                  {newProduct.image ? (
                    <img
                      src={newProduct.image}
                      alt="Product Preview"
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-olive-600 shadow-xs"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-olive-700/15 text-olive-800 dark:text-olive-300 font-display font-bold text-xl flex items-center justify-center border border-olive-500/30">
                      <Package size={24} />
                    </div>
                  )}

                  <div className="space-y-1.5 flex-1">
                    <label
                      htmlFor="new-prod-photo"
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-olive-800 text-cream hover:bg-olive-900 text-xs font-bold transition-all active:scale-95 shadow-xs"
                    >
                      <Upload size={12} />
                      <span>Choose Photo</span>
                    </label>
                    <input
                      id="new-prod-photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e.target.files?.[0], false)}
                      className="hidden"
                    />
                    <p className="text-[10px] text-charcoal/50 dark:text-dark-muted">
                      JPG, PNG, WebP up to 5MB. Clear product photo on neutral backdrop recommended.
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Title */}
              <div>
                <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  placeholder="e.g. Chanderi Handloom Cotton Dupatta with Zari"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600"
                />
              </div>

              {/* Category & Price Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1">
                    Craft Category *
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600 cursor-pointer"
                  >
                    <option value="Handloom">Handloom &amp; Khadi</option>
                    <option value="Forest Honey">Forest Produce &amp; Honey</option>
                    <option value="Terracotta">Terracotta Pottery</option>
                    <option value="Folk Art">Madhubani &amp; Folk Art</option>
                    <option value="Bamboo">Bamboo &amp; Cane Craft</option>
                    <option value="Village Catering">Village Food &amp; Spices</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="e.g. 1250"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600 font-mono"
                  />
                </div>
              </div>

              {/* Stock Quantity & Lead Artisan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    placeholder="e.g. 25"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1">
                    Artisan / Maker Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.artisan}
                    onChange={(e) => setNewProduct({ ...newProduct, artisan: e.target.value })}
                    placeholder="e.g. Sunita Devi (Master Weaver)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600"
                  />
                </div>
              </div>

              {/* Certification / Seal */}
              <div>
                <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1">
                  Certification / Seal Tag
                </label>
                <input
                  type="text"
                  value={newProduct.certification}
                  onChange={(e) => setNewProduct({ ...newProduct, certification: e.target.value })}
                  placeholder="e.g. GI Certified Style, FSSAI Organic Tested, Handloom Mark"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1">
                  Product Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Describe material, traditional technique, dimensions, and craftsmanship..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600 resize-none leading-relaxed"
                />
              </div>
            </form>

            {/* Footer Buttons (Fixed at bottom) */}
            <div className="p-4 px-6 border-t border-charcoal/10 dark:border-dark-border flex items-center justify-end gap-3 shrink-0 bg-cream/20 dark:bg-dark-surface/40">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="add-prod-form"
                size="sm"
                className="bg-olive-800 text-cream cursor-pointer"
              >
                Publish Your Product
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden">
          <div className="w-full max-w-lg max-h-[92vh] bg-white dark:bg-dark-card rounded-3xl shadow-elevation-3 border border-charcoal/10 dark:border-dark-border flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Header (Fixed at top) */}
            <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-charcoal/10 dark:border-dark-border shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-olive-100 dark:bg-olive-950 text-olive-800 dark:text-olive-300 flex items-center justify-center">
                  <Edit3 size={16} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-charcoal dark:text-dark-text leading-tight">
                    Edit Product Details
                  </h3>
                  <p className="text-xs text-charcoal/50 dark:text-dark-muted mt-0.5">
                    Update {editingProduct.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 rounded-xl hover:bg-cream dark:hover:bg-dark-surface text-charcoal/50 hover:text-charcoal cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="edit-prod-form" onSubmit={handleSaveEdit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
              {/* Product Photo Upload */}
              <div className="p-4 rounded-2xl bg-cream/40 dark:bg-dark-surface/60 border border-charcoal/10 dark:border-dark-border space-y-3">
                <label className="block font-bold text-charcoal/90 dark:text-dark-text flex items-center gap-1.5">
                  <Camera size={14} className="text-olive-700 dark:text-olive-400" />
                  <span>Update Product Photo</span>
                </label>

                <div className="flex items-center gap-4">
                  <img
                    src={editingProduct.image}
                    alt={editingProduct.title}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-olive-600 shadow-xs"
                  />

                  <div className="space-y-1.5 flex-1">
                    <label
                      htmlFor="edit-prod-photo"
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-olive-800 text-cream hover:bg-olive-900 text-xs font-bold transition-all active:scale-95 shadow-xs"
                    >
                      <Upload size={12} />
                      <span>Change Photo</span>
                    </label>
                    <input
                      id="edit-prod-photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e.target.files?.[0], true)}
                      className="hidden"
                    />
                    <p className="text-[10px] text-charcoal/50 dark:text-dark-muted">
                      JPG, PNG, WebP up to 5MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Title */}
              <div>
                <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600"
                />
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600 font-mono"
                  />
                </div>
              </div>

              {/* Artisan Creator */}
              <div>
                <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1">
                  Artisan / Lead Maker *
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.artisan}
                  onChange={(e) => setEditingProduct({ ...editingProduct, artisan: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1">
                  Product Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600 resize-none leading-relaxed"
                />
              </div>
            </form>

            {/* Footer Buttons (Fixed at bottom) */}
            <div className="p-4 px-6 border-t border-charcoal/10 dark:border-dark-border flex items-center justify-end gap-3 shrink-0 bg-cream/20 dark:bg-dark-surface/40">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditingProduct(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="edit-prod-form"
                size="sm"
                className="bg-olive-800 text-cream cursor-pointer"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-dark-card rounded-3xl p-6 shadow-elevation-3 border border-charcoal/10 dark:border-dark-border space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <span className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center">
                <AlertTriangle size={20} />
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-charcoal dark:text-dark-text">
                  Delete "{productToDelete.title}"?
                </h3>
                <p className="text-xs text-charcoal/50 dark:text-dark-muted">
                  This will remove the product from your live catalog and inventory.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button size="sm" variant="outline" onClick={() => setProductToDelete(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => handleDeleteProduct(productToDelete.id)}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW PRODUCT DETAILS MODAL (Eye Button) */}
      {viewingProduct && (
        <div className="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden">
          <div className="w-full max-w-lg max-h-[92vh] bg-white dark:bg-dark-card rounded-3xl shadow-elevation-3 border border-charcoal/10 dark:border-dark-border flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-charcoal/10 dark:border-dark-border shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-olive-100 dark:bg-olive-950 text-olive-800 dark:text-olive-300 flex items-center justify-center">
                  <Eye size={16} />
                </span>
                <div>
                  <h2 className="font-display text-lg font-bold text-charcoal dark:text-dark-text">
                    Product Details
                  </h2>
                  <p className="text-xs text-charcoal/50 dark:text-dark-muted font-mono">
                    {viewingProduct.sku} · {viewingProduct.category}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingProduct(null)}
                className="p-1.5 rounded-xl hover:bg-cream dark:hover:bg-dark-surface text-charcoal/50 hover:text-charcoal cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {/* Image Preview */}
              <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-cream/40 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border">
                <img
                  src={viewingProduct.image}
                  alt={viewingProduct.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 right-2.5">
                  <span
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border backdrop-blur-xs ${
                      viewingProduct.status === "in-stock"
                        ? "bg-emerald-500/90 text-white border-emerald-400"
                        : "bg-amber-500/90 text-white border-amber-400"
                    }`}
                  >
                    {viewingProduct.stock} in stock
                  </span>
                </div>
              </div>

              {/* Title & Price */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-base font-bold text-charcoal dark:text-dark-text">
                    {viewingProduct.title}
                  </h3>
                  <p className="text-xs text-olive-800 dark:text-olive-300 font-semibold mt-0.5">
                    Artisan: {viewingProduct.artisan}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-charcoal/50 dark:text-dark-muted block">Direct Price</span>
                  <span className="font-display text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {viewingProduct.priceFormatted}
                  </span>
                </div>
              </div>

              {/* Full Description */}
              <div className="p-3.5 rounded-2xl bg-cream/40 dark:bg-dark-surface/50 border border-charcoal/10 dark:border-dark-border space-y-1">
                <p className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted tracking-wider">
                  Description
                </p>
                <p className="text-xs text-charcoal/80 dark:text-dark-text leading-relaxed">
                  {viewingProduct.description}
                </p>
              </div>

              {/* Certifications & Inventory Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-cream/40 dark:bg-dark-surface/50 border border-charcoal/10 dark:border-dark-border">
                  <p className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted tracking-wider">
                    Certification
                  </p>
                  <p className="font-semibold text-xs text-charcoal dark:text-dark-text mt-0.5">
                    {viewingProduct.certification}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-cream/40 dark:bg-dark-surface/50 border border-charcoal/10 dark:border-dark-border">
                  <p className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted tracking-wider">
                    Catalog Status
                  </p>
                  <p className="font-semibold text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 capitalize">
                    {viewingProduct.status?.replace("-", " ")}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 px-6 border-t border-charcoal/10 dark:border-dark-border flex items-center justify-between shrink-0 bg-cream/20 dark:bg-dark-surface/40">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setViewingProduct(null)}
              >
                Close
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  const prodToEdit = viewingProduct;
                  setViewingProduct(null);
                  setEditingProduct({ ...prodToEdit });
                }}
                className="bg-olive-800 text-cream cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 size={13} />
                <span>Edit Product</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
