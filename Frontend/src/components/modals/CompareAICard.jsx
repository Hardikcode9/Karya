import { Star, MapPin, CheckCircle2, Award } from "lucide-react";
import Button from "../ui/Button";

export default function CompareAICard({ workers = [], onBook }) {
  if (!workers || workers.length === 0) return null;

  // Compute best value, fastest, highest rated
  const minPrice = Math.min(...workers.map((w) => w.price));
  const minDistance = Math.min(...workers.map((w) => w.distanceKm));
  const maxRating = Math.max(...workers.map((w) => w.rating));

  return (
    <div className="w-full my-3 rounded-2xl bg-cream dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border p-3 sm:p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between border-b border-charcoal/10 dark:border-dark-border pb-2">
        <div className="flex items-center gap-1.5">
          <Award size={16} className="text-olive-700 dark:text-olive-400" />
          <span className="text-xs font-bold text-charcoal dark:text-dark-text uppercase tracking-wider">
            AI Side-by-Side Comparison
          </span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-olive-100 dark:bg-olive-900/50 text-olive-800 dark:text-olive-300">
          {workers.length} Specialists Analyzed
        </span>
      </div>

      {/* Comparison Grid */}
      <div className={`grid grid-cols-1 ${workers.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"} gap-3`}>
        {workers.map((w) => {
          const isBestValue = w.price === minPrice;
          const isFastest = w.distanceKm === minDistance;
          const isTopRated = w.rating === maxRating;

          return (
            <div
              key={w.id}
              className="relative flex flex-col justify-between rounded-xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border p-3.5 shadow-xs space-y-3"
            >
              {/* Highlight Tag */}
              <div className="flex flex-wrap gap-1">
                {isBestValue && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    💰 Best Value
                  </span>
                )}
                {isFastest && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                    ⚡ Fastest ETA
                  </span>
                )}
                {isTopRated && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-olive-500/10 text-olive-700 dark:text-olive-400 border border-olive-500/20">
                    ⭐ Highest Rated
                  </span>
                )}
              </div>

              {/* Worker Profile Info */}
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-olive-100 dark:bg-olive-900/60 text-olive-800 dark:text-olive-300 font-bold text-xs flex items-center justify-center">
                    {w.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs sm:text-sm text-charcoal dark:text-dark-text truncate">
                      {w.name}
                    </h4>
                    <p className="text-[10px] text-charcoal/50 dark:text-dark-muted">{w.role}</p>
                  </div>
                </div>

                {/* Metric Comparisons */}
                <div className="mt-3 pt-2.5 border-t border-charcoal/5 dark:border-dark-border space-y-1.5 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-charcoal/50 dark:text-dark-muted">Rate</span>
                    <span className="font-bold text-charcoal dark:text-dark-text font-display">
                      ₹{w.price}/{w.priceUnit || "day"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-charcoal/50 dark:text-dark-muted">Distance</span>
                    <span className="font-semibold text-charcoal dark:text-dark-text flex items-center gap-0.5">
                      <MapPin size={10} className="text-olive-700 dark:text-olive-400" />
                      {w.distanceKm} km ({Math.round(w.distanceKm * 4)}m ETA)
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-charcoal/50 dark:text-dark-muted">Rating</span>
                    <span className="font-semibold text-charcoal dark:text-dark-text flex items-center gap-0.5">
                      <Star size={10} className="fill-amber-400 text-amber-400" />
                      {w.rating} ({w.reviewsCount || 42}+ jobs)
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-charcoal/50 dark:text-dark-muted">Aadhaar KYC</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5 text-[10px]">
                      <CheckCircle2 size={10} /> Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <Button
                size="sm"
                fullWidth
                onClick={() => onBook && onBook(w)}
                className="text-xs py-2"
              >
                Book {w.name.split(" ")[0]}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
