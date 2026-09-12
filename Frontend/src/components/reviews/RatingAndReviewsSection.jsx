import { useState } from "react";
import {
  Star, MessageSquare, HelpCircle, AlertCircle, ThumbsUp,
  CheckCircle2, X, Clock, User, Plus, Sparkles, Lightbulb,
  Upload, ShieldCheck, ArrowRight, Check
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

export default function RatingAndReviewsSection({
  targetType = "worker", // 'worker' | 'service' | 'product' | 'shg'
  targetId,
  targetName,
  targetImage,
  targetCategory,
  initialRating = 4.8,
  initialReviewsCount = 24,
  initialReviews = [],
}) {
  const { user } = useAuth();
  const toast = useToast();

  // Default seed reviews if none passed
  const defaultInitialList = [
    {
      id: "rev-1",
      author: "Rajeshwar Singh",
      village: "Sonipur Ward 2",
      rating: 5,
      dateTime: "10 Sep 2026, 03:40 PM",
      text: `Outstanding craftsmanship and honest behavior. Arrived right on scheduled time and completed the ${targetType === "product" ? "product delivery" : "job"} with pure professionalism.`,
      verified: true,
      helpful: 8,
    },
    {
      id: "rev-2",
      author: "Meera Devi",
      village: "Rampura Gram Panchayat",
      rating: 5,
      dateTime: "06 Sep 2026, 11:15 AM",
      text: `Very reliable quality and fair transparent village pricing. We always recommend ${targetName} to everyone in our village block.`,
      verified: true,
      helpful: 5,
    },
    {
      id: "rev-3",
      author: "Dinesh Verma",
      village: "Pipraich Block",
      rating: 4,
      dateTime: "28 Aug 2026, 05:20 PM",
      text: `Great work ethic. Finished everything smoothly and cleaned up the area afterwards. Will book again whenever needed.`,
      verified: true,
      helpful: 3,
    },
  ];

  const [reviewsList, setReviewsList] = useState(
    initialReviews.length > 0 ? initialReviews : defaultInitialList
  );

  // Modals
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showQueryModal, setShowQueryModal] = useState(false);

  // Rating Form State
  const [ratingStars, setRatingStars] = useState(5);
  const [hoverStars, setHoverStars] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewerName, setReviewerName] = useState(user?.name || "");

  // Query / Suggestion Form State
  const [queryTab, setQueryTab] = useState("query"); // 'query' | 'suggestion'
  const [queryCategory, setQueryCategory] = useState("General Question");
  const [queryUrgency, setQueryUrgency] = useState("Normal");
  const [querySubject, setQuerySubject] = useState("");
  const [queryDescription, setQueryDescription] = useState("");

  // Calculate dynamic average
  const totalReviews = reviewsList.length;
  const avgRating =
    totalReviews > 0
      ? (reviewsList.reduce((acc, r) => acc + (r.rating || 5), 0) / totalReviews).toFixed(1)
      : initialRating;

  // Star Labels
  const starLabels = {
    1: "Poor experience",
    2: "Fair, needs improvement",
    3: "Good, satisfactory",
    4: "Very good, pleased",
    5: "Excellent, highly recommended!",
  };

  // Submit Rating & Review
  const handleSubmitRating = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast.show("Please write a short review comment", "error");
      return;
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      author: reviewerName.trim() || user?.name || "Verified Customer",
      village: user?.village || "Rampur Village",
      rating: ratingStars,
      dateTime: "Just now • Today",
      title: reviewTitle.trim() || undefined,
      text: reviewComment.trim(),
      verified: true,
      helpful: 0,
    };

    setReviewsList([newReview, ...reviewsList]);
    setShowRatingModal(false);
    setReviewTitle("");
    setReviewComment("");
    setRatingStars(5);
    toast.show(`Your rating & review for ${targetName} was published!`, "success");
  };

  // Submit Query / Suggestion
  const handleSubmitQuery = (e) => {
    e.preventDefault();
    if (!querySubject.trim() || !queryDescription.trim()) {
      toast.show("Please enter subject and detailed description", "error");
      return;
    }

    const ticketId = `${queryTab === "query" ? "CMP" : "SUG"}-${Math.floor(1000 + Math.random() * 9000)}`;
    setShowQueryModal(false);
    setQuerySubject("");
    setQueryDescription("");

    toast.show(
      `${queryTab === "query" ? "Query Ticket" : "Suggestion"} #${ticketId} submitted successfully for ${targetName}!`,
      "success"
    );
  };

  const handleHelpful = (id) => {
    setReviewsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpful: (r.helpful || 0) + 1 } : r))
    );
    toast.show("Thank you for your feedback!", "info");
  };

  return (
    <section className="mt-14 pt-10 border-t border-charcoal/10 dark:border-dark-border">
      {/* Section Header & Main Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Star size={17} className="fill-amber-400 text-amber-500" />
            </span>
            <h3 className="font-display text-2xl text-charcoal dark:text-dark-text font-bold">
              Ratings & Customer Reviews
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted ml-10">
            Verified village feedback for {targetName} ({targetCategory || targetType})
          </p>
        </div>

        {/* Both Required Buttons matching the exact unified structure */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Button 1: Rate & Review */}
          <button
            type="button"
            onClick={() => setShowRatingModal(true)}
            className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-olive-700 hover:bg-olive-800 active:scale-[0.98] text-white shadow-sm transition-all border border-olive-800/20 cursor-pointer"
          >
            <Star size={16} className="shrink-0 fill-amber-300 text-amber-300" />
            <span>Rate & Review</span>
          </button>

          {/* Button 2: Query or Suggestion */}
          <button
            type="button"
            onClick={() => setShowQueryModal(true)}
            className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-white dark:bg-dark-card hover:bg-charcoal/5 dark:hover:bg-dark-border active:scale-[0.98] text-charcoal dark:text-dark-text shadow-sm border border-charcoal/15 dark:border-dark-border transition-all cursor-pointer"
          >
            <HelpCircle size={16} className="shrink-0 text-olive-700 dark:text-olive-400" />
            <span>Ask Query or Suggestion</span>
          </button>
        </div>
      </div>

      {/* Ratings Scorecard Overview Card */}
      <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-6 border border-charcoal/5 dark:border-dark-border mb-8 shadow-elevation-1">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Big Rating Number */}
          <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-charcoal/10 dark:border-dark-border pb-6 md:pb-0 md:pr-6">
            <div className="flex items-baseline justify-center md:justify-start gap-2">
              <span className="font-display text-5xl font-bold text-charcoal dark:text-dark-text">
                {avgRating}
              </span>
              <span className="text-charcoal/40 text-lg font-bold">/ 5.0</span>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-1 text-amber-500 my-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={18}
                  className={`${s <= Math.round(Number(avgRating)) ? "fill-amber-400 text-amber-500" : "text-charcoal/20"}`}
                />
              ))}
            </div>

            <p className="text-xs text-charcoal/60 dark:text-dark-muted font-medium">
              Based on <strong>{totalReviews}</strong> authentic village reviews
            </p>

            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold border border-emerald-500/20">
              <ShieldCheck size={13} className="text-emerald-600" />
              <span>100% Verified Community Feedback</span>
            </div>
          </div>

          {/* Rating Distribution Progress Bars */}
          <div className="md:col-span-8 space-y-2">
            {[
              { stars: 5, pct: 85 },
              { stars: 4, pct: 12 },
              { stars: 3, pct: 3 },
              { stars: 2, pct: 0 },
              { stars: 1, pct: 0 },
            ].map(({ stars, pct }) => (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-8 font-bold text-charcoal/70 dark:text-dark-muted text-right flex items-center justify-end gap-1">
                  <span>{stars}</span>
                  <Star size={11} className="fill-amber-400 text-amber-500" />
                </span>
                <div className="flex-1 h-2 rounded-full bg-charcoal/10 dark:bg-dark-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 text-[11px] text-charcoal/50 dark:text-dark-muted text-right font-mono">
                  {pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List Feed */}
      <div className="space-y-4">
        <h4 className="font-bold text-sm text-charcoal dark:text-dark-text flex items-center justify-between">
          <span>Customer Feedback ({reviewsList.length})</span>
          <span className="text-xs font-normal text-charcoal/50 dark:text-dark-muted">Sorted by most recent</span>
        </h4>

        {reviewsList.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-3xl bg-cream-card dark:bg-dark-card border border-charcoal/5 dark:border-dark-border shadow-elevation-1 space-y-3"
          >
            {/* Reviewer Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-olive-200 dark:bg-olive-900/60 text-olive-800 dark:text-olive-300 font-bold flex items-center justify-center font-display text-sm">
                  {rev.author.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-xs sm:text-sm text-charcoal dark:text-dark-text">
                      {rev.author}
                    </h5>
                    {rev.verified && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 text-[10px] font-bold">
                        <CheckCircle2 size={10} /> Verified Booking
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-charcoal/50 dark:text-dark-muted">
                    {rev.village || "Local Panchayat Area"}
                  </p>
                </div>
              </div>

              {/* Star Rating and Date */}
              <div className="text-right shrink-0">
                <div className="flex items-center gap-0.5 text-amber-500 justify-end">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={13}
                      className={`${s <= rev.rating ? "fill-amber-400 text-amber-500" : "text-charcoal/20"}`}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-charcoal/45 dark:text-dark-muted mt-0.5 flex items-center gap-1 justify-end">
                  <Clock size={10} />
                  <span>{rev.dateTime}</span>
                </p>
              </div>
            </div>

            {/* Review Text */}
            <p className="text-xs sm:text-sm text-charcoal/80 dark:text-dark-text leading-relaxed">
              "{rev.text}"
            </p>

            {/* Helpful feedback button */}
            <div className="pt-2 border-t border-charcoal/5 dark:border-dark-border flex items-center justify-between">
              <span className="text-[11px] text-charcoal/50 dark:text-dark-muted">Was this review helpful?</span>
              <button
                type="button"
                onClick={() => handleHelpful(rev.id)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-charcoal/60 dark:text-dark-muted hover:bg-charcoal/5 dark:hover:bg-dark-border transition-colors cursor-pointer"
              >
                <ThumbsUp size={12} />
                <span>Helpful ({rev.helpful || 0})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: Rate & Review Form */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-charcoal/10 dark:border-dark-border shadow-elevation-3 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-charcoal/10 dark:border-dark-border">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                  <Star size={17} className="fill-amber-400 text-amber-500" />
                </span>
                <div>
                  <h3 className="font-display font-medium text-lg text-charcoal dark:text-dark-text">
                    Rate & Review {targetName}
                  </h3>
                  <p className="text-xs text-charcoal/55 dark:text-dark-muted">
                    Share your experience to guide fellow village citizens
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRatingModal(false)}
                className="p-1.5 rounded-xl hover:bg-charcoal/10 dark:hover:bg-dark-border text-charcoal/60 dark:text-dark-muted transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitRating} className="mt-5 space-y-4">
              {/* Star Rating Picker */}
              <div className="p-4 rounded-2xl bg-white dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-center space-y-2">
                <label className="block text-xs font-bold text-charcoal/70 dark:text-dark-muted">
                  Overall Rating *
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverStars(star)}
                      onMouseLeave={() => setHoverStars(0)}
                      onClick={() => setRatingStars(star)}
                      className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                    >
                      <Star
                        size={28}
                        className={`${
                          (hoverStars || ratingStars) >= star
                            ? "fill-amber-400 text-amber-500 drop-shadow-xs"
                            : "text-charcoal/20"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs font-bold text-olive-800 dark:text-olive-300">
                  {starLabels[hoverStars || ratingStars]}
                </p>
              </div>

              {/* Reviewer Name */}
              <div>
                <label className="block text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full bg-white dark:bg-dark-surface rounded-xl px-3.5 py-2 text-xs sm:text-sm outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text"
                />
              </div>

              {/* Review Text Area */}
              <div>
                <label className="block text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1">
                  Your Review & Experience *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={`Describe how ${targetName} performed, timeliness, quality of work, and value...`}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-white dark:bg-dark-surface rounded-xl p-3 text-xs sm:text-sm outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text leading-relaxed"
                />
              </div>

              {/* Photo Upload Simulation */}
              <div className="p-3 rounded-xl bg-white dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-charcoal/60 dark:text-dark-muted">
                  <Upload size={14} className="text-olive-700 dark:text-olive-400" />
                  <span>Attach finished job photo (optional)</span>
                </div>
                <button
                  type="button"
                  onClick={() => toast.show("Photo attached to review", "info")}
                  className="text-xs font-bold text-olive-700 dark:text-olive-400 hover:underline cursor-pointer"
                >
                  Upload Photo
                </button>
              </div>

              {/* Action Buttons with exact button structure */}
              <div className="pt-3 border-t border-charcoal/10 dark:border-dark-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRatingModal(false)}
                  className="px-4 py-2.5 rounded-xl font-semibold text-xs text-charcoal/70 dark:text-dark-muted hover:bg-charcoal/5 dark:hover:bg-dark-border transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-olive-700 hover:bg-olive-800 active:scale-[0.98] text-white shadow-sm border border-olive-800/20 transition-all cursor-pointer"
                >
                  <Star size={16} className="shrink-0 fill-amber-300 text-amber-300" />
                  <span>Submit Verified Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Query / Suggestion Form */}
      {showQueryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-charcoal/10 dark:border-dark-border shadow-elevation-3 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-charcoal/10 dark:border-dark-border">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-olive-100 dark:bg-olive-900/60 text-olive-800 dark:text-olive-300 flex items-center justify-center">
                  <MessageSquare size={17} />
                </span>
                <div>
                  <h3 className="font-display font-medium text-lg text-charcoal dark:text-dark-text">
                    Ask Query or Suggestion
                  </h3>
                  <p className="text-xs text-charcoal/55 dark:text-dark-muted">
                    Regarding {targetName} ({targetCategory || targetType})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowQueryModal(false)}
                className="p-1.5 rounded-xl hover:bg-charcoal/10 dark:hover:bg-dark-border text-charcoal/60 dark:text-dark-muted transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mode Switch: Query vs Suggestion */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-charcoal/5 dark:bg-dark-surface mt-4">
              <button
                type="button"
                onClick={() => setQueryTab("query")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  queryTab === "query"
                    ? "bg-white dark:bg-dark-card text-charcoal dark:text-dark-text shadow-xs"
                    : "text-charcoal/60 dark:text-dark-muted hover:text-charcoal"
                }`}
              >
                <HelpCircle size={14} className="text-rose-600" />
                <span>Query / Report Issue</span>
              </button>
              <button
                type="button"
                onClick={() => setQueryTab("suggestion")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  queryTab === "suggestion"
                    ? "bg-white dark:bg-dark-card text-charcoal dark:text-dark-text shadow-xs"
                    : "text-charcoal/60 dark:text-dark-muted hover:text-charcoal"
                }`}
              >
                <Lightbulb size={14} className="text-amber-500" />
                <span>Community Suggestion</span>
              </button>
            </div>

            <form onSubmit={handleSubmitQuery} className="mt-4 space-y-4">
              {/* Category & Urgency */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1">
                    Category
                  </label>
                  <select
                    value={queryCategory}
                    onChange={(e) => setQueryCategory(e.target.value)}
                    className="w-full bg-white dark:bg-dark-surface rounded-xl px-3 py-2 text-xs outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text"
                  >
                    <option value="Service Quality">Service Quality & Skills</option>
                    <option value="Pricing & Billing">Pricing & Tariff Clarification</option>
                    <option value="Schedule & Timing">Availability & Scheduling</option>
                    <option value="Product Packaging">Product Delivery & Condition</option>
                    <option value="General Question">General Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1">
                    Urgency
                  </label>
                  <select
                    value={queryUrgency}
                    onChange={(e) => setQueryUrgency(e.target.value)}
                    className="w-full bg-white dark:bg-dark-surface rounded-xl px-3 py-2 text-xs outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text"
                  >
                    <option value="Normal">Normal Inquiry</option>
                    <option value="Urgent">Urgent / Action Needed</option>
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    queryTab === "query"
                      ? "e.g. Question regarding warranty visit or extra tools"
                      : "e.g. Suggestion to provide 5L bulk packaging"
                  }
                  value={querySubject}
                  onChange={(e) => setQuerySubject(e.target.value)}
                  className="w-full bg-white dark:bg-dark-surface rounded-xl px-3.5 py-2 text-xs sm:text-sm outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text"
                />
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1">
                  Detailed Message *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={
                    queryTab === "query"
                      ? "Describe your query or dispute clearly. Karya Gram Panchayat support desk will reply promptly."
                      : "Share your improvement suggestion to help this artisan or specialist serve better."
                  }
                  value={queryDescription}
                  onChange={(e) => setQueryDescription(e.target.value)}
                  className="w-full bg-white dark:bg-dark-surface rounded-xl p-3 text-xs sm:text-sm outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text leading-relaxed"
                />
              </div>

              {/* Action Buttons with exact button structure */}
              <div className="pt-3 border-t border-charcoal/10 dark:border-dark-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowQueryModal(false)}
                  className="px-4 py-2.5 rounded-xl font-semibold text-xs text-charcoal/70 dark:text-dark-muted hover:bg-charcoal/5 dark:hover:bg-dark-border transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-olive-700 hover:bg-olive-800 active:scale-[0.98] text-white shadow-sm border border-olive-800/20 transition-all cursor-pointer"
                >
                  {queryTab === "query" ? (
                    <HelpCircle size={16} className="shrink-0" />
                  ) : (
                    <Lightbulb size={16} className="shrink-0" />
                  )}
                  <span>
                    {queryTab === "query" ? "Submit Query Ticket" : "Submit Suggestion"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
