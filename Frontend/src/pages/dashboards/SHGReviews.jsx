import { useState, useMemo, useEffect } from "react";
import { Star, MessageSquare, Search } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import api from "../../utils/api";

export default function SHGReviews() {
  const toast = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get("/shg/reviews");
      setReviews(response.data.reviews || response.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const [search, setSearch] = useState("");

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const customer = r.customer?.name || "";
      const text = r.review || r.comment || "";
      const product = r.booking?.product?.title || r.booking?.service?.name || "";

      return (
        customer.toLowerCase().includes(search.toLowerCase()) ||
        text.toLowerCase().includes(search.toLowerCase()) ||
        product.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [reviews, search]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal dark:text-dark-text flex items-center gap-2">
            <MessageSquare size={28} className="text-olive-700 dark:text-olive-500" />
            Customer Reviews
          </h2>
          <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted mt-1">
            Feedback from buyers and service clients.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border rounded-3xl p-6 shadow-xs flex flex-col justify-center items-center text-center">
          <p className="text-sm font-bold text-charcoal/50 dark:text-dark-muted uppercase tracking-wider mb-2">Overall Rating</p>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display text-5xl font-bold text-charcoal dark:text-dark-text">{averageRating}</h3>
            <Star size={32} className="fill-amber-400 text-amber-400" />
          </div>
          <p className="text-xs text-charcoal/60 dark:text-dark-muted">Based on {reviews.length} reviews</p>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-3xl border border-charcoal/10 dark:border-dark-border overflow-hidden shadow-xs mt-8">
        <div className="p-5 sm:p-6 border-b border-charcoal/10 dark:border-dark-border flex items-center justify-between">
          <div className="relative w-full sm:w-64 shrink-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-charcoal/5 dark:bg-dark-surface rounded-lg text-xs outline-none focus:ring-2 focus:ring-olive-500/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-charcoal/50">Loading reviews...</div>
          ) : filteredReviews.length === 0 ? (
            <div className="p-12 text-center text-charcoal/50">No reviews found.</div>
          ) : (
            <div className="divide-y divide-charcoal/5 dark:divide-dark-border">
              {filteredReviews.map((review) => (
                <div key={review._id} className="p-5 hover:bg-charcoal/2 dark:hover:bg-dark-surface/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-charcoal dark:text-dark-text">{review.customer?.name || "Customer"}</p>
                      <p className="text-[10px] text-charcoal/50">
                        {review.booking?.product?.title || review.booking?.service?.name || "Order"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={12} className={s <= review.rating ? "fill-amber-400 text-amber-400" : "fill-charcoal/10 text-transparent"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-charcoal/80 dark:text-dark-muted mt-2">
                    "{review.review || review.comment}"
                  </p>
                  <p className="text-[10px] text-charcoal/40 mt-3 text-right">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
