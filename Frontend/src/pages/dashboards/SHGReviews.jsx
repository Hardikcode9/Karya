import { useState, useMemo } from "react";
import {
  Star, Search, Filter, CheckCircle2, ThumbsUp, MessageSquare,
  Sparkles, ShieldCheck, Heart, User, MapPin, Calendar, Award,
  ShoppingBag, X, MessageCircle
} from "lucide-react";
import Button from "../../components/ui/Button";

// Comprehensive Customer Reviews Data
const CUSTOMER_REVIEWS_LIST = [
  {
    id: "REV-101",
    customerName: "Anjali Sharma",
    customerCity: "New Delhi",
    avatarBg: "bg-purple-600/20 text-purple-700 dark:text-purple-300 border-purple-500/30",
    rating: 5,
    date: "12 Sep 2026",
    productPurchased: "Handloom Chanderi Pure Cotton Sarees (Batch of 10)",
    productCategory: "Handloom Sarees",
    reviewTitle: "Pure Handloom Perfection — Truly Authentic Chanderi Weave",
    reviewText:
      "We ordered a batch of 10 Chanderi pure cotton sarees for our Delhi Khadi Emporium exhibition. The weave quality, intricate zari border, and natural vegetable dyes surpassed all expectations. Knowing that 100% of our payment goes directly into the women weavers' joint bank account makes it even more meaningful.",
    verifiedPurchase: true,
    helpfulCount: 34,
    artisanLead: "Sunita Devi (Master Weaver)",
    shgReply:
      "Dhanyawad Anjali ji! Our 24 village artisans poured their heart into this pit-loom weave. We are deeply grateful for supporting our rural livelihood mission.",
  },
  {
    id: "REV-102",
    customerName: "Dr. Anita Sen",
    customerCity: "Gurugram, Haryana",
    avatarBg: "bg-amber-600/20 text-amber-700 dark:text-amber-300 border-amber-500/30",
    rating: 5,
    date: "11 Sep 2026",
    productPurchased: "Raw Wild Forest Honey (35 Jars × 500g)",
    productCategory: "Wild Honey",
    reviewTitle: "Pure, Unheated Raw Multi-Flora Forest Honey",
    reviewText:
      "Our organic supermart tested this batch in our laboratory. Curcumin, enzyme activity, and zero sugar adulteration confirmed 100% genuine multi-flora forest nectar. The Van Dhan tribal women collective has done an outstanding job with clean glass jar packing.",
    verifiedPurchase: true,
    helpfulCount: 28,
    artisanLead: "Radha Kol (Van Dhan Lead)",
    shgReply:
      "Pranam Anita ji! Our tribal gatherers safely extract this from deep satna forests. We thank NatureBounty for championing indigenous forest produce.",
  },
  {
    id: "REV-103",
    customerName: "Chef Vikramaditya",
    customerCity: "Noida, UP",
    avatarBg: "bg-orange-600/20 text-orange-700 dark:text-orange-300 border-orange-500/30",
    rating: 5,
    date: "09 Sep 2026",
    productPurchased: "Natural Terracotta Mitti Handi & Curd Pots (25 Sets)",
    productCategory: "Terracotta Pots",
    reviewTitle: "Slow-Cooking Clay Cookware with Nutritious Alkaline Retaining",
    reviewText:
      "We use these unglazed mitti handis in our heritage restaurant for slow woodfire dal makhani and curd setting. The earthen flavor is remarkable. Zero breakage during transit because of excellent straw cushioning. Highly recommended!",
    verifiedPurchase: true,
    helpfulCount: 19,
    artisanLead: "Geeta Prajapati (Ceramic Lead)",
    shgReply:
      "Shukriya Chef Vikramaditya! Our Kumhar Basti artisans take immense pride in traditional kiln curing. Looking forward to our next consignment.",
  },
  {
    id: "REV-104",
    customerName: "Siddhartha Mukherjee",
    customerCity: "Bengaluru, Karnataka",
    avatarBg: "bg-blue-600/20 text-blue-700 dark:text-blue-300 border-blue-500/30",
    rating: 5,
    date: "07 Sep 2026",
    productPurchased: "Traditional Madhubani Canvas Scroll (Tree of Life)",
    productCategory: "Madhubani Art",
    reviewTitle: "Stunning Folk Art with Natural Plant Pigments",
    reviewText:
      "Commissioned 15 custom Madhubani Tree of Life scrolls for our corporate tech firm's annual CSR awards. The handmade paper and mineral dye line-work by Urmila Devi received standing ovations from international delegates.",
    verifiedPurchase: true,
    helpfulCount: 22,
    artisanLead: "Urmila Devi (Folk Artist)",
    shgReply:
      "Heartfelt thanks Siddhartha ji! Every brushstroke celebrates our ancestral Mithila folklore. Happy to serve TechServe CSR.",
  },
  {
    id: "REV-105",
    customerName: "Meenakshi Iyer",
    customerCity: "Pune, Maharashtra",
    avatarBg: "bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    rating: 4,
    date: "04 Sep 2026",
    productPurchased: "Braided Golden Bamboo Fruit & Storage Baskets (Set of 2)",
    productCategory: "Bamboo Baskets",
    reviewTitle: "Sturdy and Eco-Friendly Golden Cane Weave",
    reviewText:
      "The cane baskets are lightweight, durable, and look fabulous on our kitchen island. Eco-friendly varnish ensures no smell. Delivery took 4 days via Speed Post which was very reasonable for remote village dispatch.",
    verifiedPurchase: true,
    helpfulCount: 14,
    artisanLead: "Malati Barman (Bamboo Lead)",
    shgReply:
      "Thank you Meenakshi ji! We source sustainable bamboo from our community grove and weave without harmful plastics.",
  },
  {
    id: "REV-106",
    customerName: "Devendra Singh (Sarpanch)",
    customerCity: "Rampura Kalan, MP",
    avatarBg: "bg-rose-600/20 text-rose-700 dark:text-rose-300 border-rose-500/30",
    rating: 5,
    date: "26 Aug 2026",
    productPurchased: "Woodfire Village Catering (120 Thalis)",
    productCategory: "Village Catering",
    reviewTitle: "Delicious Traditional Bajra Roti & Millet Feast",
    reviewText:
      "The SHG catered our Gram Sabha gathering of 120 guests. Hot bajra rotis, organic dal tadka, spicy wild chutney, and kheer served on traditional Sal leaf pattals. Not a single person had a complaint. Clean, hygienic, and authentic taste of our soil.",
    verifiedPurchase: true,
    helpfulCount: 41,
    artisanLead: "Kanti Bai (Kitchen Lead)",
    shgReply:
      "Pranam Sarpanch ji! Serving our own Gram Panchayat is our greatest honor. Thank you for entrusting the women of Samman SHG.",
  },
  {
    id: "REV-107",
    customerName: "Praveen Rao",
    customerCity: "Hyderabad, Telangana",
    avatarBg: "bg-teal-600/20 text-teal-700 dark:text-teal-300 border-teal-500/30",
    rating: 5,
    date: "22 Aug 2026",
    productPurchased: "Raw Wild Forest Honey (500g Jar)",
    productCategory: "Wild Honey",
    reviewTitle: "Best Honey I Have Ever Tasted",
    reviewText:
      "Has a distinctive floral forest fragrance with mild crystalline texture at the base. You can immediately tell it hasn't been heated or ultra-filtered in factory machines. Re-ordered 3 more jars for my parents.",
    verifiedPurchase: true,
    helpfulCount: 17,
    artisanLead: "Radha Kol (Van Dhan Lead)",
    shgReply:
      "Thank you Praveen ji! Our wild bee colonies forage on medicinal forest herbs like neem, mahua, and wild tulsi.",
  },
  {
    id: "REV-108",
    customerName: "Swasthya Ayurved Labs",
    customerCity: "Indore, MP",
    avatarBg: "bg-cyan-600/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/30",
    rating: 4,
    date: "18 Aug 2026",
    productPurchased: "Lakadong Stone-Ground Turmeric Powder (250g)",
    productCategory: "Agro Products",
    reviewTitle: "High Curcumin Quality 7.5% Tested",
    reviewText:
      "Lab batch #409 verified 7.4% curcumin content. The stone mill grinding method preserved the volatile essential oils. Excellent batch consistency.",
    verifiedPurchase: true,
    helpfulCount: 12,
    artisanLead: "Baphira Shullai (Agro Lead)",
    shgReply:
      "Thank you Swasthya Labs! We ensure slow watermill stone grinding to keep the natural medicinal potency intact.",
  },
];

export default function SHGReviews() {
  const [reviews, setReviews] = useState(() => CUSTOMER_REVIEWS_LIST);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all"); // "all", "5", "4", "3"
  const [productFilter, setProductFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent"); // "recent", "highest", "helpful"
  const [helpfulVotes, setHelpfulVotes] = useState({});

  const handleHelpfulClick = (reviewId) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
  };

  // Filter & Search Logic
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((rev) => {
        const matchesRating =
          ratingFilter === "all" || String(rev.rating) === ratingFilter;

        const matchesProduct =
          productFilter === "all" ||
          rev.productCategory.toLowerCase() === productFilter.toLowerCase();

        const query = search.toLowerCase();
        const matchesSearch =
          rev.customerName.toLowerCase().includes(query) ||
          rev.customerCity.toLowerCase().includes(query) ||
          rev.reviewTitle.toLowerCase().includes(query) ||
          rev.reviewText.toLowerCase().includes(query) ||
          rev.productPurchased.toLowerCase().includes(query);

        return matchesRating && matchesProduct && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "highest") return b.rating - a.rating;
        if (sortBy === "helpful") {
          const aVotes = a.helpfulCount + (helpfulVotes[a.id] || 0);
          const bVotes = b.helpfulCount + (helpfulVotes[b.id] || 0);
          return bVotes - aVotes;
        }
        return new Date(b.date) - new Date(a.date);
      });
  }, [reviews, search, ratingFilter, productFilter, sortBy, helpfulVotes]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-charcoal/10 dark:border-dark-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-olive-100 dark:bg-olive-950/60 text-olive-800 dark:text-olive-300 text-[11px] font-bold mb-1.5">
            <MessageCircle size={12} />
            <span>Verified Customer Feedback &amp; Ratings</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal dark:text-dark-text">
            Customer Reviews &amp; Testimonials
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted mt-0.5">
            All reviews submitted by genuine buyers across handloom, forest honey, pottery, and catering orders.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs">
            <Star size={18} className="text-amber-500 fill-amber-500" />
            <div>
              <p className="font-display text-lg font-bold text-charcoal dark:text-dark-text leading-none">
                4.9 / 5.0
              </p>
              <span className="text-[10px] text-charcoal/50 dark:text-dark-muted">86 verified reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ratings Overview Hero Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-elevation-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Rating Metric */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-charcoal/10 dark:border-dark-border">
          <p className="font-display text-5xl font-bold text-charcoal dark:text-dark-text">4.9</p>
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={18} className="text-amber-500 fill-amber-500" />
            ))}
          </div>
          <p className="text-xs font-semibold text-charcoal/70 dark:text-dark-muted">
            Based on 86 verified purchase reviews
          </p>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            <CheckCircle2 size={13} />
            <span>100% Genuine Rural Artisan Orders</span>
          </span>
        </div>

        {/* Right Distribution Bars */}
        <div className="md:col-span-8 space-y-2 text-xs">
          {[
            { stars: "5 Star", count: 72, percent: 84 },
            { stars: "4 Star", count: 10, percent: 12 },
            { stars: "3 Star", count: 4, percent: 4 },
            { stars: "2 Star", count: 0, percent: 0 },
            { stars: "1 Star", count: 0, percent: 0 },
          ].map((row) => (
            <div key={row.stars} className="flex items-center gap-3">
              <span className="w-12 font-bold text-charcoal/70 dark:text-dark-muted">{row.stars}</span>
              <div className="flex-1 h-2.5 rounded-full bg-cream/70 dark:bg-dark-surface overflow-hidden">
                <div
                  style={{ width: `${row.percent}%` }}
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                />
              </div>
              <span className="w-10 text-right font-mono text-[11px] text-charcoal/60 dark:text-dark-muted">
                {row.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* FILTER SYSTEM BAR */}
      <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-charcoal/10 dark:border-dark-border">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal/70 dark:text-dark-muted">
            <Filter size={13} className="text-olive-700 dark:text-olive-400" />
            <span>Filter Customer Reviews</span>
          </div>
          <span className="text-[11px] text-charcoal/50 dark:text-dark-muted">
            Showing {filteredReviews.length} of {reviews.length} reviews
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Star Rating Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-charcoal/60 dark:text-dark-muted font-bold mr-1">Rating:</span>
            {[
              { id: "all", label: "All Reviews" },
              { id: "5", label: "5 Stars (72)" },
              { id: "4", label: "4 Stars (10)" },
              { id: "3", label: "3 Stars (4)" },
            ].map((rf) => (
              <button
                key={rf.id}
                onClick={() => setRatingFilter(rf.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  ratingFilter === rf.id
                    ? "bg-olive-800 text-cream shadow-xs"
                    : "bg-cream/60 dark:bg-dark-surface text-charcoal/70 dark:text-dark-text hover:bg-cream"
                }`}
              >
                {rf.label}
              </button>
            ))}
          </div>

          {/* Product Category & Sort Dropdowns */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Product Filter */}
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-xs font-bold text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600 cursor-pointer"
            >
              <option value="all">All Products</option>
              <option value="handloom sarees">Chanderi Sarees</option>
              <option value="wild honey">Wild Forest Honey</option>
              <option value="terracotta pots">Terracotta Cookware</option>
              <option value="madhubani art">Madhubani Folk Art</option>
              <option value="bamboo baskets">Bamboo Baskets</option>
              <option value="village catering">Village Catering</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-xs font-bold text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600 cursor-pointer"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews by customer name, city, keywords, or products..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-cream/40 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-xs text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* CUSTOMER REVIEWS FEED */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border">
            <MessageSquare size={32} className="mx-auto text-charcoal/30 dark:text-dark-muted mb-2" />
            <h3 className="font-display text-base font-bold text-charcoal dark:text-dark-text">
              No matching reviews found
            </h3>
            <p className="text-xs text-charcoal/50 dark:text-dark-muted mt-1">
              Try adjusting your star rating or product filter criteria.
            </p>
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const extraVotes = helpfulVotes[rev.id] || 0;
            const totalHelpful = rev.helpfulCount + extraVotes;

            return (
              <div
                key={rev.id}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-elevation-1 space-y-3 hover:shadow-elevation-2 transition-all group"
              >
                {/* ROW 1: PROFILE NAME (LEFT) ---------------- TOTAL STARS (RIGHT) */}
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-charcoal/10 dark:border-dark-border">
                  {/* Left: Profile Name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl font-display font-bold text-sm flex items-center justify-center shrink-0 border ${rev.avatarBg}`}
                    >
                      {rev.customerName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-display text-sm sm:text-base font-bold text-charcoal dark:text-dark-text truncate">
                          {rev.customerName}
                        </h4>
                        {rev.verifiedPurchase && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold shrink-0">
                            <CheckCircle2 size={11} />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-charcoal/50 dark:text-dark-muted flex items-center gap-1 truncate mt-0.5">
                        <MapPin size={10} className="text-amber-500 shrink-0" />
                        <span className="truncate">{rev.customerCity}</span>
                        <span>•</span>
                        <span className="font-mono">{rev.date}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right: Total Stars */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={15}
                          className={
                            s <= rev.rating
                              ? "text-amber-500 fill-amber-500"
                              : "text-charcoal/20 dark:text-white/20"
                          }
                        />
                      ))}
                    </div>
                    <span className="font-display font-bold text-xs sm:text-sm text-charcoal dark:text-dark-text bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-300/40 text-amber-700 dark:text-amber-300">
                      {rev.rating}.0 ({rev.rating} Stars)
                    </span>
                  </div>
                </div>

                {/* ROW 2: REVIEWS */}
                <div className="space-y-1 text-xs sm:text-sm">
                  {rev.reviewTitle && (
                    <h5 className="font-display text-sm font-bold text-charcoal dark:text-dark-text">
                      "{rev.reviewTitle}"
                    </h5>
                  )}
                  <p className="text-charcoal/80 dark:text-dark-muted leading-relaxed">
                    {rev.reviewText}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
