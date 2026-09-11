import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Plus, Check } from "lucide-react";
import { useState } from "react";
import Icon from "./Icon";
import { useCart } from "../../hooks/useCart";
import { useToast } from "../../hooks/useToast";
import { getServiceImage, DEFAULT_SERVICE_IMAGE } from "../../utils/serviceImages";

export default function ServiceCard({ service, index = 0 }) {
  const { addItem } = useCart();
  const toast = useToast();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const price = service.price || service.basePrice || service.rate || 350;
  const serviceId = service.id || service._id;
  const imageUrl = getServiceImage(service);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: serviceId,
      name: service.name,
      price: price,
      icon: service.icon || "Briefcase",
      category: service.category || "General Service",
      image: imageUrl,
    });
    setAdded(true);
    toast.success(`Added "${service.name}" to cart`);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col justify-between rounded-3xl p-3.5 sm:p-4 bg-cream-card dark:bg-dark-card border border-charcoal/8 dark:border-dark-border hover:border-olive-400/60 dark:hover:border-olive-500/60 hover:shadow-elevation-2 dark:hover:shadow-darkGlow transition-all duration-300 overflow-hidden"
    >
      <Link to={`/services/${serviceId}`} className="flex-1 flex flex-col">
        {/* Service Image Container */}
        <div className="relative w-full h-36 sm:h-44 rounded-2xl overflow-hidden mb-3.5 bg-charcoal/5 dark:bg-dark-surface">
          <img
            src={imgError ? DEFAULT_SERVICE_IMAGE : imageUrl}
            alt={service.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          {/* Subtle Contrast Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/15 pointer-events-none" />

          {/* Floating Category / Count Badge (Top Left) */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
            <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold bg-black/55 text-white backdrop-blur-md border border-white/10 shadow-xs">
              {service.count ? `${service.count} pros` : service.category || "Service"}
            </span>
          </div>

          {/* Service Icon Badge (Top Right) */}
          <div className="absolute top-2.5 right-2.5 w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/90 dark:bg-dark-card/90 backdrop-blur-md flex items-center justify-center border border-white/20 dark:border-white/10 shadow-xs text-olive-800 dark:text-olive-400 group-hover:rotate-6 transition-transform">
            <Icon name={service.icon || "Briefcase"} size={17} />
          </div>

          {/* Floating Explore Cue (Bottom Right) */}
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-white/95 bg-black/40 px-2.5 py-0.5 rounded-full backdrop-blur-xs group-hover:bg-olive-700/90 transition-all pointer-events-none">
            <span>Explore</span>
            <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between px-1">
          <div>
            <h3 className="font-display font-semibold text-base sm:text-lg text-charcoal dark:text-dark-text leading-snug group-hover:text-olive-800 dark:group-hover:text-olive-300 transition-colors line-clamp-1">
              {service.name}
            </h3>
            <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-1 line-clamp-2 leading-relaxed">
              {service.description || `${service.count || 12}+ verified village experts available`}
            </p>
          </div>
        </div>
      </Link>

      {/* Card Footer: Starting Price & Quick Add to Cart */}
      <div className="pt-3 mt-3 px-1 border-t border-charcoal/8 dark:border-dark-border flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-charcoal/45 dark:text-dark-muted font-medium">Starting</span>
          <p className="text-sm sm:text-base font-bold text-charcoal dark:text-dark-text font-display">
            ₹{price}<span className="text-xs font-normal text-charcoal/50 dark:text-dark-muted">/{service.priceUnit || "visit"}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 shadow-xs ${
            added
              ? "bg-emerald-600 text-white"
              : "bg-olive-700 hover:bg-olive-800 text-cream dark:bg-olive-600 dark:hover:bg-olive-500"
          }`}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
