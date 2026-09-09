import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, CheckCircle2 } from "lucide-react";
import Button from "../ui/Button";

const tagOptions = [
  "Punctual & On Time",
  "Transparent Pricing",
  "Clean Workmanship",
  "Polite & Respectful",
  "Proper Safety Equipment",
  "High Quality Craft",
];

export default function ReviewModal({ isOpen, onClose, targetItem }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState(["Punctual & On Time"]);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !targetItem) return null;

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={resetAndClose}
          className="fixed inset-0 bg-charcoal/40 dark:bg-black/60 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-cream dark:bg-dark-bg rounded-[2.5rem] p-6 shadow-2xl border border-charcoal/10 dark:border-dark-border z-10 space-y-4 my-8"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-olive-800 dark:text-olive-300 bg-olive-100 dark:bg-olive-900/40 px-2.5 py-0.5 rounded-full">
                Rate & Review
              </span>
              <h3 className="font-display text-xl text-charcoal dark:text-dark-text mt-1">
                {targetItem.name}
              </h3>
              <p className="text-xs text-charcoal/60 dark:text-dark-muted">
                {targetItem.role || "Local Specialist"}
              </p>
            </div>
            <button
              onClick={resetAndClose}
              className="p-1 text-charcoal/40 dark:text-dark-muted hover:text-charcoal rounded-full"
            >
              <X size={18} />
            </button>
          </div>

          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center animate-bounce">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="font-display text-xl text-charcoal dark:text-dark-text">
                Thank You for Your Feedback!
              </h4>
              <p className="text-xs text-charcoal/70 dark:text-dark-muted max-w-xs mx-auto">
                Your verified review empowers rural workers and helps your local community choose trusted skills.
              </p>
              <Button onClick={resetAndClose} className="w-full text-xs">
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating Picker */}
              <div className="flex flex-col items-center justify-center py-2 bg-cream-card dark:bg-dark-card rounded-2xl border border-charcoal/5 dark:border-dark-border">
                <span className="text-xs text-charcoal/60 dark:text-dark-muted mb-1.5 font-medium">
                  Overall Rating
                </span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-125 transition-transform"
                    >
                      <Star
                        size={26}
                        className={
                          (hoverRating || rating) >= star
                            ? "fill-amber-400 text-amber-400"
                            : "text-charcoal/20 dark:text-dark-border"
                        }
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-olive-800 dark:text-olive-300 mt-1">
                  {rating === 5 ? "Exceptional (5/5)" : rating === 4 ? "Great (4/5)" : rating === 3 ? "Good (3/5)" : "Needs Improvement"}
                </span>
              </div>

              {/* Tag Highlights */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 dark:text-dark-muted mb-1.5">
                  What went well?
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {tagOptions.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                        selectedTags.includes(tag)
                          ? "bg-olive-700 text-cream border-olive-700 font-medium"
                          : "bg-cream-card dark:bg-dark-card border-charcoal/10 dark:border-dark-border text-charcoal/70 dark:text-dark-muted"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 dark:text-dark-muted mb-1">
                  Write a review
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details of your experience..."
                  rows={3}
                  className="w-full bg-cream-card dark:bg-dark-card border border-charcoal/15 dark:border-dark-border rounded-2xl p-3 text-xs outline-none focus:border-olive-600 dark:text-dark-text"
                />
              </div>

              <Button type="submit" className="w-full text-xs py-3">
                Submit Verified Review
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
