import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag, Star, Search, Filter, ArrowLeft, ArrowRight, Check,
  Plus, Minus, Trash2, Heart, Sparkles, ShieldCheck, Truck, RotateCcw,
  Users, MapPin, Tag, Award, ExternalLink, ChevronRight, CheckCircle2,
  Package, DollarSign, BarChart3, Clock, Share2, Grid, List
} from "lucide-react";
import { useCart } from "../hooks/useCart";

const CATEGORIES = [
  "All",
  "Handloom & Textiles",
  "Organic & Farm Produce",
  "Pottery & Clay Decor",
  "Bamboo & Grass Crafts",
  "Traditional Paintings",
];

const PRODUCTS = [
  {
    id: "prod-1",
    name: "Handloom Chanderi Pure Cotton Saree",
    category: "Handloom & Textiles",
    price: 1450,
    originalPrice: 2200,
    rating: 4.9,
    reviews: 38,
    shgName: "Mahila Pragati SHG",
    village: "Chanderi, Dist. Ashoknagar",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    description: "Authentic handwoven pure cotton saree with delicate zari border crafted on traditional rural pit-looms. Breathable, lightweight, and colored using non-toxic natural dye extracts.",
    artisanStory: "Woven over 4 days by Sunita Bai and her 8-member women cooperative in Chanderi. Every rupee goes directly to funding their children's secondary schooling.",
    variants: ["Standard Pack", "Gift Box Pack"],
    inStock: true,
    tags: ["Best Seller", "GI Tagged"],
  },
  {
    id: "prod-2",
    name: "Raw Wild Forest Honey (500g)",
    category: "Organic & Farm Produce",
    price: 420,
    originalPrice: 580,
    rating: 4.9,
    reviews: 76,
    shgName: "Van Dhan Vikas Kendra",
    village: "Maihar Forest Block, Satna",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
    description: "Unfiltered, unpasteurized multi-flora honey gathered sustainably from deep forest rock bee hives. Retains 100% natural pollen, royal jelly nutrients, and enzymes.",
    artisanStory: "Harvested by indigenous Gond and Baiga tribal women trained in non-destructive scientific honey harvesting methods under the Gram Panchayat initiative.",
    variants: ["500g Glass Jar", "1kg Tin Canister"],
    inStock: true,
    tags: ["Organic", "Direct Tribal Payout"],
  },
  {
    id: "prod-3",
    name: "Natural Terracotta Curd Handi & Cooking Pot",
    category: "Pottery & Clay Decor",
    price: 650,
    originalPrice: 890,
    rating: 4.8,
    reviews: 44,
    shgName: "Mati Kala Mahila Samiti",
    village: "Khorabar, Gorakhpur",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
    description: "100% organic unglazed terracotta clay pot cured with buttermilk. Imparts natural minerals, neutralizes food acidity, and enhances rich authentic village flavor.",
    artisanStory: "Shaped on manual potter wheels and wood-fired kiln pits by families who have preserved this clay heritage for five generations.",
    variants: ["2.0 Litres", "3.5 Litres Family"],
    inStock: true,
    tags: ["Lead Free", "Eco-Friendly"],
  },
  {
    id: "prod-4",
    name: "Madhubani Canvas Scroll — Tree of Life",
    category: "Traditional Paintings",
    price: 890,
    originalPrice: 1350,
    rating: 4.9,
    reviews: 52,
    shgName: "Kalyani Folk Art Collective",
    village: "Ranti Village, Madhubani",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
    description: "Hand-painted fine nib scroll depicting the sacred Tree of Life and mating peacocks. Painted with natural mineral pigments and plant resins on handmade cotton paper.",
    artisanStory: "Crafted by master artist Manjula Devi and her apprentice guild. This artwork symbolizes fertility, harmony with mother earth, and prosperity.",
    variants: ["Standard Canvas", "Teakwood Framed"],
    inStock: true,
    tags: ["Master Artisan", "GI Tagged"],
  },
  {
    id: "prod-5",
    name: "Braided Golden Bamboo Planters & Basket Set",
    category: "Bamboo & Grass Crafts",
    price: 480,
    originalPrice: 720,
    rating: 4.7,
    reviews: 31,
    shgName: "Tripura Bamboo Sakhi Sangha",
    village: "Melaghar, Sepahijala",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    description: "Hand-woven from treated indigenous muli bamboo cane. Extremely sturdy, pest-resistant, and perfect for indoor plant pots, fruit trays, or living room storage.",
    artisanStory: "Produced by a 14-member all-women cluster utilizing sustainably thinned forest bamboo, generating year-round wages during lean monsoon months.",
    variants: ["Set of 2 Pots", "Set of 4 Nesting"],
    inStock: true,
    tags: ["Biodegradable", "Fair Trade"],
  },
  {
    id: "prod-6",
    name: "Lakadong Stone-Ground Pure Turmeric (400g)",
    category: "Organic & Farm Produce",
    price: 260,
    originalPrice: 380,
    rating: 5.0,
    reviews: 89,
    shgName: "Annapurna Krishi Sakhi Group",
    village: "Shangpung, Jaintia Hills",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
    description: "Famous Lakadong turmeric with an extraordinary 7.5% natural curcumin content. Sun-dried and cold stone-pulverized without chemical processing or fillers.",
    artisanStory: "Cultivated on chemical-free rain-fed terrace hill farms by matriarchal farming collectives, directly packaged at farm gate.",
    variants: ["400g Pouch", "1kg Bulk Pack"],
    inStock: true,
    tags: ["High Curcumin 7.5%", "Single Origin"],
  },
  {
    id: "prod-7",
    name: "Lost-Wax Cast Brass Dhokra Peacock Diya",
    category: "Pottery & Clay Decor",
    price: 920,
    originalPrice: 1400,
    rating: 4.8,
    reviews: 28,
    shgName: "Dhokra Kala Vikas Mandal",
    village: "Kondagaon, Bastar",
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80",
    description: "Handcrafted using the ancient 4,000-year-old non-ferrous lost-wax metal casting technique. Features detailed tribal motifs and antique brass luster.",
    artisanStory: "Cast by indigenous Bastar metal craftsmen preserving one of humanity's oldest continuous metallurgic traditions with modern fair-trade backing.",
    variants: ["Single Diya (6 inch)", "Pair (Twin Diyas)"],
    inStock: true,
    tags: ["4000-Yr Heritage", "Solid Brass"],
  },
  {
    id: "prod-8",
    name: "Organic Khadi Cotton Handloom Fabric (2.5m)",
    category: "Handloom & Textiles",
    price: 780,
    originalPrice: 1100,
    rating: 4.7,
    reviews: 19,
    shgName: "Gramodaya Swaraj Sangha",
    village: "Sevagram, Wardha",
    image: "https://images.unsplash.com/photo-1596464716127-f2a829822391?auto=format&fit=crop&w=800&q=80",
    description: "Handspun on traditional solar charkhas and hand-loomed with natural unbleached cotton yarns. Super soft, cooling in Indian summers, and naturally textured.",
    artisanStory: "Promotes rural self-reliance rooted in Gandhiji's Sevagram spinning community. Provides steady monthly honorariums to 40 elderly rural weavers.",
    variants: ["2.5 Metres (Kurta)", "5 Metres (Full Set)"],
    inStock: true,
    tags: ["Pure Khadi", "Zero Carbon"],
  },
];

const BLOG_POSTS = [
  {
    id: 1,
    title: "How 45 Tribal Women in Satna Reclaimed Fair Wild Honey Prices",
    author: "Radha Kol (SHG Leader)",
    date: "August 28, 2026",
    readTime: "4 min read",
    excerpt: "Before digital marketplace direct orders, middlemen paid us ₹90 per kg. Today, our Van Dhan Kendra earns ₹380 per kg directly to our bank accounts.",
    tag: "Artisan Direct Impact",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    title: "Reviving Pit-Loom Weaving: The Resilient Artisans of Ashoknagar",
    author: "Kavita Sen (Handloom Researcher)",
    date: "September 02, 2026",
    readTime: "6 min read",
    excerpt: "Why pure Chanderi hand-cotton remains unmatched by power looms, and how young village women are returning to generational weaving crafts.",
    tag: "Heritage Craft",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    title: "The Zero-Commission Guarantee: Every Rupee to the Rural Collective",
    author: "Gyaanshrot Trust Initiative",
    date: "September 05, 2026",
    readTime: "3 min read",
    excerpt: "How Karya platform mechanics bypass platform cuts, using UPI Direct Merchant routing straight into Self-Help Group collective bank accounts.",
    tag: "Fair Trade Transparency",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
  },
];

export default function SHGs() {
  const [page, setPage] = useState("home"); // 'home', 'shop', 'pdp', 'about', 'blog', 'admin'
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceLimit, setPriceLimit] = useState(2500);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [productQuantity, setProductQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState("Standard Pack");
  const [activeTab, setActiveTab] = useState("Description");
  const [adminTab, setAdminTab] = useState("orders");
  const [toast, setToast] = useState(null);

  const { addItem, setIsCartOpen, totalCount } = useCart();

  const showToast = (icon, message) => {
    setToast({ icon, message });
    setTimeout(() => setToast(null), 3200);
  };

  const openProduct = (product) => {
    setSelectedProduct(product);
    setProductQuantity(1);
    setSelectedVariant(product.variants?.[0] || "Standard Pack");
    setActiveTab("Description");
    setPage("pdp");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openCategory = (category) => {
    setSelectedCategory(category);
    setPage("shop");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (product, qty = 1, variant = null) => {
    const chosenVariant = variant || product.variants?.[0] || "Standard Pack";
    addItem({
      id: `${product.id}-${chosenVariant}`,
      name: `${product.name} (${chosenVariant})`,
      price: product.price,
      priceUnit: "unit",
      category: product.category,
      image: product.image,
      shgName: product.shgName,
      village: product.village,
      quantity: qty,
    });
    showToast("🛒", `${product.name} added to cart!`);
  };

  // Filtered products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat = selectedCategory === "All" || p.category === selectedCategory;
      const matchPrice = p.price <= priceLimit;
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shgName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.village.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchPrice && matchSearch;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });
  }, [selectedCategory, priceLimit, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-cream dark:bg-dark-bg text-charcoal dark:text-dark-text pt-24 sm:pt-28 pb-20 transition-colors">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-charcoal text-cream dark:bg-dark-surface dark:text-dark-text border border-white/10 shadow-elevation-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <span className="text-xl">{toast.icon}</span>
          <p className="text-xs sm:text-sm font-semibold">{toast.message}</p>
        </div>
      )}

      {/* Internal Store Sub-Header */}
      <div className="container-kare mb-8">
        <div className="rounded-3xl p-4 sm:p-6 bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-elevation-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-olive-700 text-cream flex items-center justify-center font-display font-bold text-xl shadow-xs">
              ग
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-charcoal dark:text-dark-text">
                  Gyaanshrot SHG Collective Store
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                  <ShieldCheck size={11} />
                  <span>0% Commission</span>
                </span>
              </div>
              <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-0.5">
                Connecting rural Self-Help Groups, women federations & artisans directly with conscious buyers.
              </p>
            </div>
          </div>

          {/* Internal Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto bg-cream dark:bg-dark-surface p-1 rounded-2xl border border-charcoal/5 dark:border-dark-border">
            {[
              { id: "home", label: "Featured" },
              { id: "shop", label: "Artisan Catalog" },
              { id: "about", label: "Mission" },
              { id: "blog", label: "Artisan Stories" },
              { id: "admin", label: "Seller Hub" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setPage(tab.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  page === tab.id
                    ? "bg-olive-700 text-cream shadow-xs"
                    : "text-charcoal/70 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text"
                }`}
              >
                {tab.label}
              </button>
            ))}

            {/* Open Navbar Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-olive-100 dark:bg-olive-900/60 text-olive-900 dark:text-olive-300 hover:bg-olive-200 transition-all shadow-xs"
              title="Open Navbar Cart"
            >
              <ShoppingBag size={14} />
              <span>Cart</span>
              {totalCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-olive-700 text-cream text-[10px] font-black flex items-center justify-center animate-bounce">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* VIEW: HOME / FEATURED */}
      {page === "home" && (
        <div className="container-kare space-y-12">
          {/* Hero Banner */}
          <div className="relative rounded-[2.5rem] overflow-hidden p-8 sm:p-14 bg-gradient-to-br from-olive-950 via-olive-900 to-charcoal text-cream shadow-elevation-2">
            <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-olive-600/20 blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-olive-300 text-xs font-semibold backdrop-blur">
                <Sparkles size={13} />
                <span>Zero-Middleman Direct Handicraft Channel</span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-light leading-tight text-white">
                Treasures from Bharat's rural soil, crafted with generational pride.
              </h2>
              <p className="text-cream/75 text-sm sm:text-base leading-relaxed">
                Every purchase sends 100% of fair value directly to village Self-Help Group bank accounts. Zero corporate margins, zero deductions.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => openCategory("All")}
                  className="px-6 py-3 rounded-full bg-olive-600 hover:bg-olive-500 text-cream text-xs sm:text-sm font-bold shadow-sm transition-transform active:scale-95"
                >
                  Explore All Products ({PRODUCTS.length})
                </button>
                <button
                  onClick={() => openCategory("Organic & Farm Produce")}
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-cream text-xs sm:text-sm font-bold backdrop-blur transition-colors"
                >
                  Organic Farm Goods →
                </button>
              </div>
            </div>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: ShieldCheck, title: "100% Direct Payout", desc: "No middleman cut" },
              { icon: Award, title: "Aadhaar Verified", desc: "Government NRLM registered" },
              { icon: Truck, title: "Rural Village Dispatch", desc: "Direct from gram panchayat" },
              { icon: RotateCcw, title: "Authenticity Pledge", desc: "Handloom & Organic tested" },
            ].map((b, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/5 dark:border-dark-border flex items-center gap-3 shadow-xs">
                <div className="p-2.5 rounded-xl bg-olive-100 dark:bg-olive-900/60 text-olive-800 dark:text-olive-300 shrink-0">
                  <b.icon size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-charcoal dark:text-dark-text">{b.title}</h3>
                  <p className="text-[11px] text-charcoal/55 dark:text-dark-muted">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Category Chips Bar */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-medium text-charcoal dark:text-dark-text">
                Browse by Specialty
              </h3>
              <button
                onClick={() => openCategory("All")}
                className="text-xs font-bold text-olive-700 dark:text-olive-400 hover:underline"
              >
                View Full Catalog →
              </button>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => openCategory(cat)}
                  className="px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border hover:border-olive-600 dark:hover:border-olive-500 text-charcoal dark:text-dark-text transition-all hover:shadow-xs"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-2xl font-medium text-charcoal dark:text-dark-text">
                  Featured Artisan Creations
                </h3>
                <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-0.5">
                  Top-rated goods straight from village women cooperatives.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {PRODUCTS.slice(0, 8).map((product) => (
                <div
                  key={product.id}
                  className="group rounded-3xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border overflow-hidden flex flex-col shadow-xs hover:shadow-elevation-2 transition-all duration-300"
                >
                  <div
                    onClick={() => openProduct(product)}
                    className="relative aspect-square overflow-hidden bg-charcoal/5 dark:bg-dark-surface cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {product.tags?.[0] && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-olive-900/80 backdrop-blur text-cream text-[10px] font-bold">
                        {product.tags[0]}
                      </span>
                    )}
                    <div className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur text-charcoal dark:text-dark-text">
                      <div className="flex items-center gap-0.5 text-[11px] font-bold">
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold text-olive-800 dark:text-olive-400">
                        {product.shgName}
                      </p>
                      <h4
                        onClick={() => openProduct(product)}
                        className="font-bold text-sm text-charcoal dark:text-dark-text mt-0.5 hover:text-olive-700 transition-colors cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-charcoal/50 dark:text-dark-muted flex items-center gap-1 mt-1">
                        <MapPin size={11} />
                        <span>{product.village}</span>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-charcoal/5 dark:border-dark-border flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-display font-bold text-base text-charcoal dark:text-dark-text">
                            ₹{product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-charcoal/40 line-through">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart(product, 1)}
                        className="p-2 rounded-xl bg-olive-700 hover:bg-olive-800 text-cream transition-transform active:scale-90 shadow-xs"
                        title="Add to Cart"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: SHOP / CATALOG */}
      {page === "shop" && (
        <div className="container-kare space-y-8">
          {/* Header Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-charcoal/10 dark:border-dark-border">
            <div>
              <h2 className="font-display text-3xl font-medium text-charcoal dark:text-dark-text">
                Rural Artisan Catalog
              </h2>
              <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-1">
                Showing {filteredProducts.length} verified products from women collectives.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search saree, honey, pottery, SHG..."
                className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border text-xs text-charcoal dark:text-dark-text placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-olive-500"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-[260px_1fr] gap-8 items-start">
            {/* Sidebar Filters */}
            <div className="p-5 rounded-3xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-charcoal/5 dark:border-dark-border">
                <span className="font-bold text-xs uppercase tracking-wider text-charcoal/60 dark:text-dark-muted flex items-center gap-1.5">
                  <Filter size={13} /> Filters
                </span>
                {(selectedCategory !== "All" || priceLimit < 2500 || searchQuery) && (
                  <button
                    onClick={() => { setSelectedCategory("All"); setPriceLimit(2500); setSearchQuery(""); }}
                    className="text-[11px] text-rose-600 font-bold hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-charcoal dark:text-dark-text">Categories</p>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                        selectedCategory === cat
                          ? "bg-olive-700 text-cream font-bold"
                          : "text-charcoal/70 dark:text-dark-muted hover:bg-cream dark:hover:bg-dark-surface"
                      }`}
                    >
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-3 pt-4 border-t border-charcoal/5 dark:border-dark-border">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Max Price</span>
                  <span className="text-olive-700 dark:text-olive-400">₹{priceLimit}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="2500"
                  step="50"
                  value={priceLimit}
                  onChange={(e) => setPriceLimit(Number(e.target.value))}
                  className="w-full accent-olive-700 cursor-pointer"
                />
              </div>

              {/* Sort By */}
              <div className="space-y-2 pt-4 border-t border-charcoal/5 dark:border-dark-border">
                <p className="text-xs font-bold text-charcoal dark:text-dark-text">Sort By</p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-cream dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-xs text-charcoal dark:text-dark-text font-semibold focus:outline-none"
                >
                  <option value="default">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 pt-4 border-t border-charcoal/5 dark:border-dark-border">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-xl border ${viewMode === "grid" ? "bg-olive-700 text-cream border-olive-700" : "text-charcoal/60 border-charcoal/10"}`}
                  title="Grid View"
                >
                  <Grid size={15} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-xl border ${viewMode === "list" ? "bg-olive-700 text-cream border-olive-700" : "text-charcoal/60 border-charcoal/10"}`}
                  title="List View"
                >
                  <List size={15} />
                </button>
              </div>
            </div>

            {/* Products Listing */}
            <div>
              {filteredProducts.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border">
                  <p className="text-base font-bold text-charcoal dark:text-dark-text">No products match your filters.</p>
                  <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-1">Try relaxing price or category filters.</p>
                  <button
                    onClick={() => { setSelectedCategory("All"); setPriceLimit(2500); setSearchQuery(""); }}
                    className="mt-4 px-4 py-2 rounded-full bg-olive-700 text-cream text-xs font-bold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group rounded-3xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border overflow-hidden flex flex-col shadow-xs hover:shadow-elevation-2 transition-all duration-300"
                    >
                      <div
                        onClick={() => openProduct(product)}
                        className="relative aspect-square overflow-hidden bg-charcoal/5 dark:bg-dark-surface cursor-pointer"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur text-charcoal dark:text-dark-text">
                          <div className="flex items-center gap-0.5 text-[11px] font-bold">
                            <Star size={11} className="fill-amber-400 text-amber-400" />
                            <span>{product.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-semibold text-olive-800 dark:text-olive-400">
                            {product.shgName}
                          </p>
                          <h4
                            onClick={() => openProduct(product)}
                            className="font-bold text-sm text-charcoal dark:text-dark-text mt-0.5 hover:text-olive-700 transition-colors cursor-pointer line-clamp-1"
                          >
                            {product.name}
                          </h4>
                          <p className="text-[11px] text-charcoal/50 dark:text-dark-muted flex items-center gap-1 mt-1">
                            <MapPin size={11} />
                            <span>{product.village}</span>
                          </p>
                        </div>

                        <div className="pt-2 border-t border-charcoal/5 dark:border-dark-border flex items-center justify-between">
                          <div>
                            <span className="font-display font-bold text-base text-charcoal dark:text-dark-text">
                              ₹{product.price}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => openProduct(product)}
                              className="px-3 py-1.5 rounded-xl border border-charcoal/15 dark:border-dark-border text-xs font-bold hover:bg-cream dark:hover:bg-dark-surface transition-colors"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => addToCart(product, 1)}
                              className="p-2 rounded-xl bg-olive-700 hover:bg-olive-800 text-cream transition-transform active:scale-90"
                              title="Add to Cart"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="p-4 rounded-3xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border flex flex-col sm:flex-row items-center gap-4 shadow-xs"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        onClick={() => openProduct(product)}
                        className="w-24 h-24 rounded-2xl object-cover cursor-pointer shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-olive-100 dark:bg-olive-900/60 text-olive-800 dark:text-olive-300">
                            {product.category}
                          </span>
                          <span className="text-xs text-charcoal/50 dark:text-dark-muted flex items-center gap-1">
                            <MapPin size={11} /> {product.village}
                          </span>
                        </div>
                        <h4
                          onClick={() => openProduct(product)}
                          className="font-bold text-base text-charcoal dark:text-dark-text mt-1 cursor-pointer hover:text-olive-700"
                        >
                          {product.name}
                        </h4>
                        <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-1 line-clamp-1">
                          {product.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <p className="font-display font-bold text-lg text-charcoal dark:text-dark-text">
                            ₹{product.price}
                          </p>
                          <div className="flex items-center gap-0.5 text-xs text-amber-500 font-bold justify-end">
                            <Star size={12} className="fill-amber-400" />
                            <span>{product.rating}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => addToCart(product, 1)}
                          className="px-4 py-2 rounded-xl bg-olive-700 hover:bg-olive-800 text-cream text-xs font-bold"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: PDP (PRODUCT DETAIL PAGE) */}
      {page === "pdp" && selectedProduct && (
        <div className="container-kare space-y-10">
          <button
            onClick={() => setPage("shop")}
            className="inline-flex items-center gap-2 text-xs font-bold text-charcoal/60 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text"
          >
            <ArrowLeft size={14} /> Back to Catalog
          </button>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Product Image */}
            <div className="rounded-3xl overflow-hidden bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border aspect-square relative shadow-elevation-1">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="px-3 py-1 rounded-full bg-olive-900/90 backdrop-blur text-cream text-xs font-bold">
                  {selectedProduct.category}
                </span>
                {selectedProduct.tags?.map((t, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-amber-500/90 backdrop-blur text-charcoal text-xs font-bold">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Product Details & Actions */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-olive-800 dark:text-olive-300 text-xs font-bold">
                  <span>Crafted by {selectedProduct.shgName}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {selectedProduct.village}
                  </span>
                </div>
                <h2 className="font-display text-2xl sm:text-4xl text-charcoal dark:text-dark-text font-medium mt-2">
                  {selectedProduct.name}
                </h2>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                    <Star size={16} className="fill-amber-400 text-amber-400" />
                    <span>{selectedProduct.rating}</span>
                  </div>
                  <span className="text-xs text-charcoal/40">|</span>
                  <span className="text-xs text-charcoal/60 dark:text-dark-muted">
                    {selectedProduct.reviews} verified village customer reviews
                  </span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border flex items-baseline gap-3">
                <span className="font-display text-3xl font-bold text-charcoal dark:text-dark-text">
                  ₹{selectedProduct.price}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="text-sm text-charcoal/40 line-through">
                    ₹{selectedProduct.originalPrice}
                  </span>
                )}
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ml-auto">
                  100% Direct to Artisan
                </span>
              </div>

              {/* Variant Selector */}
              {selectedProduct.variants && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-charcoal dark:text-dark-text">Select Package Option:</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.variants.map((v) => (
                      <button
                        key={v}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          selectedVariant === v
                            ? "bg-olive-700 text-cream shadow-xs"
                            : "bg-white dark:bg-dark-card border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text hover:border-olive-600"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-charcoal/15 dark:border-dark-border rounded-2xl bg-white dark:bg-dark-card p-1">
                    <button
                      onClick={() => setProductQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-charcoal/60 hover:text-charcoal hover:bg-cream dark:hover:bg-dark-surface"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="w-10 text-center font-display font-bold text-sm">
                      {productQuantity}
                    </span>
                    <button
                      onClick={() => setProductQuantity((q) => q + 1)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-charcoal/60 hover:text-charcoal hover:bg-cream dark:hover:bg-dark-surface"
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  <button
                    onClick={() => addToCart(selectedProduct, productQuantity, selectedVariant)}
                    className="flex-1 py-3.5 px-6 rounded-2xl bg-olive-700 hover:bg-olive-800 text-cream text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
                  >
                    <ShoppingBag size={17} />
                    <span>Add to Cart • ₹{selectedProduct.price * productQuantity}</span>
                  </button>
                </div>
              </div>

              {/* Tabs Section */}
              <div className="pt-6 border-t border-charcoal/10 dark:border-dark-border">
                <div className="flex items-center gap-4 border-b border-charcoal/10 dark:border-dark-border pb-3 mb-4 text-xs font-bold">
                  {["Description", "Artisan Collective", "Zero-Middleman Pledge"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-1 transition-colors border-b-2 ${
                        activeTab === tab
                          ? "border-olive-700 text-olive-800 dark:text-olive-300"
                          : "border-transparent text-charcoal/50 dark:text-dark-muted hover:text-charcoal"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="text-xs sm:text-sm text-charcoal/70 dark:text-dark-muted leading-relaxed">
                  {activeTab === "Description" && <p>{selectedProduct.description}</p>}
                  {activeTab === "Artisan Collective" && (
                    <div className="space-y-2">
                      <p className="font-bold text-charcoal dark:text-dark-text">About {selectedProduct.shgName}:</p>
                      <p>{selectedProduct.artisanStory}</p>
                    </div>
                  )}
                  {activeTab === "Zero-Middleman Pledge" && (
                    <div className="space-y-2">
                      <p>
                        This transaction is directly recorded under Karya’s Fair Digital Ledger. The product price of ₹{selectedProduct.price} is directly settled to {selectedProduct.shgName}'s Jan Dhan bank account with no commission or gateway penalty.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: ABOUT / MISSION */}
      {page === "about" && (
        <div className="container-kare max-w-4xl space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-olive-700 dark:text-olive-400">
              The Gyaanshrot Trust & Karya Model
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-light text-charcoal dark:text-dark-text">
              Transforming village artisans into proud digital entrepreneurs.
            </h2>
            <p className="text-xs sm:text-sm text-charcoal/70 dark:text-dark-muted leading-relaxed">
              India has over 8.5 million Self-Help Groups (SHGs) comprising over 90 million rural women. Traditional retail intermediaries skim off 60-80% of product value. Karya eliminates every intermediary.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border space-y-2">
              <p className="font-display text-3xl font-bold text-olive-700 dark:text-olive-400">₹0 Fee</p>
              <h4 className="font-bold text-sm text-charcoal dark:text-dark-text">Zero Platform Deduction</h4>
              <p className="text-xs text-charcoal/60 dark:text-dark-muted">100% of the customer's payment hits the SHG bank account directly via UPI Auto-Routing.</p>
            </div>
            <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border space-y-2">
              <p className="font-display text-3xl font-bold text-amber-600">140+ Blocks</p>
              <h4 className="font-bold text-sm text-charcoal dark:text-dark-text">Hyperlocal Verification</h4>
              <p className="text-xs text-charcoal/60 dark:text-dark-muted">Verified by Gram Panchayat secretaries under NRLM (National Rural Livelihood Mission) guidelines.</p>
            </div>
            <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border space-y-2">
              <p className="font-display text-3xl font-bold text-emerald-600">5% Fund</p>
              <h4 className="font-bold text-sm text-charcoal dark:text-dark-text">Artisan Child Education</h4>
              <p className="text-xs text-charcoal/60 dark:text-dark-muted">Every order allocates an optional 5% grant towards community sewing tools and school scholarships.</p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: BLOG */}
      {page === "blog" && (
        <div className="container-kare max-w-4xl space-y-8">
          <div>
            <h2 className="font-display text-3xl font-medium text-charcoal dark:text-dark-text">
              Grassroots Chronicles & Field Notes
            </h2>
            <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-1">
              Read true stories of financial independence and cultural preservation from rural India.
            </p>
          </div>

          <div className="space-y-6">
            {BLOG_POSTS.map((post) => (
              <div
                key={post.id}
                className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border grid sm:grid-cols-[1.5fr_1fr] gap-6 items-center shadow-xs"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-olive-100 dark:bg-olive-900/60 text-olive-800 dark:text-olive-300">
                    {post.tag}
                  </span>
                  <h3 className="font-display text-xl font-bold text-charcoal dark:text-dark-text hover:text-olive-700 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-charcoal/65 dark:text-dark-muted leading-relaxed">
                    {post.excerpt}
                  </p>
                  <p className="text-[11px] text-charcoal/45 dark:text-dark-muted pt-1">
                    By {post.author} • {post.date} • {post.readTime}
                  </p>
                </div>
                <img
                  src={post.image}
                  alt={post.title}
                  className="rounded-2xl w-full h-44 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: ADMIN / SELLER HUB */}
      {page === "admin" && (
        <div className="container-kare max-w-4xl space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-charcoal/10 dark:border-dark-border">
            <div>
              <h2 className="font-display text-3xl font-medium text-charcoal dark:text-dark-text">
                SHG Artisan Collective Portal
              </h2>
              <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-0.5">
                Dashboard for registered federations to monitor orders, village dispatches, and inventory.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAdminTab("orders")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                  adminTab === "orders" ? "bg-olive-700 text-cream" : "bg-cream dark:bg-dark-surface text-charcoal/60"
                }`}
              >
                Recent Orders
              </button>
              <button
                onClick={() => setAdminTab("inventory")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                  adminTab === "inventory" ? "bg-olive-700 text-cream" : "bg-cream dark:bg-dark-surface text-charcoal/60"
                }`}
              >
                Inventory ({PRODUCTS.length})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border">
              <p className="text-xs text-charcoal/50">Total Collective Sales</p>
              <p className="font-display text-2xl font-bold text-olive-700 dark:text-olive-400 mt-1">₹48,250</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border">
              <p className="text-xs text-charcoal/50">Dispatched Orders</p>
              <p className="font-display text-2xl font-bold text-charcoal dark:text-dark-text mt-1">32</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border">
              <p className="text-xs text-charcoal/50">Direct Village Payout</p>
              <p className="font-display text-2xl font-bold text-emerald-600 mt-1">100%</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border">
              <p className="text-xs text-charcoal/50">Registered Artisans</p>
              <p className="font-display text-2xl font-bold text-amber-600 mt-1">54 Women</p>
            </div>
          </div>

          {adminTab === "orders" ? (
            <div className="rounded-3xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border overflow-hidden">
              <div className="p-4 font-bold text-xs border-b border-charcoal/5 uppercase tracking-wider text-charcoal/60">
                Recent Direct Dispatches
              </div>
              <div className="divide-y divide-charcoal/5 text-xs">
                {[
                  { id: "ORD-941", customer: "Anjali Sharma (Delhi)", item: "Handloom Chanderi Saree", amount: "₹1,450", status: "En Route via India Post", date: "Today" },
                  { id: "ORD-940", customer: "Praveen Rao (Bengaluru)", item: "Raw Wild Forest Honey x 2", amount: "₹840", status: "Delivered", date: "Yesterday" },
                  { id: "ORD-939", customer: "Meenakshi Iyer (Pune)", item: "Terracotta Cooking Handi", amount: "₹650", status: "Delivered", date: "Sep 06, 2026" },
                ].map((ord) => (
                  <div key={ord.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-charcoal dark:text-dark-text">{ord.item}</p>
                      <p className="text-charcoal/50 dark:text-dark-muted">{ord.customer} • {ord.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-charcoal dark:text-dark-text">{ord.amount}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border overflow-hidden">
              <div className="p-4 font-bold text-xs border-b border-charcoal/5 uppercase tracking-wider text-charcoal/60">
                Active Catalog Inventory
              </div>
              <div className="divide-y divide-charcoal/5 text-xs">
                {PRODUCTS.map((p) => (
                  <div key={p.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold text-charcoal dark:text-dark-text">{p.name}</p>
                        <p className="text-charcoal/50">{p.shgName} • {p.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-charcoal dark:text-dark-text">₹{p.price}</p>
                      <span className="text-[10px] text-emerald-600 font-bold">In Stock</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
