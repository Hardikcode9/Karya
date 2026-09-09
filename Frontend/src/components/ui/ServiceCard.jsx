import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Plus, Check } from "lucide-react";
import { useState } from "react";
import Icon from "./Icon";
import { useCart } from "../../hooks/useCart";
import { useToast } from "../../hooks/useToast";

const gradients = [
  "from-olive-600/15 to-olive-500/5 text-olive-700 dark:text-olive-400",
  "from-amber-600/15 to-amber-500/5 text-amber-700 dark:text-amber-400",
  "from-emerald-600/15 to-emerald-500/5 text-emerald-700 dark:text-emerald-400",
  "from-sky-600/15 to-sky-500/5 text-sky-700 dark:text-sky-400",
  "from-clay-600/15 to-clay-500/5 text-clay-700 dark:text-clay-400",
];

export default function ServiceCard({ service, index = 0 }) {
  const { addItem } = useCart();
  const toast = useToast();
  const [added, setAdded] = useState(false);

  const grad = gradients[index % gradients.length];
  const price = service.price || service.rate || 350;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: service.id,
      name: service.name,
      price: price,
      icon: service.icon || "Briefcase",
      category: service.category || "General Service",
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
      className="group relative flex flex-col justify-between rounded-3xl p-5 sm:p-6 bg-cream-card dark:bg-dark-card border border-charcoal/5 dark:border-dark-border hover:border-olive-400/50 dark:hover:border-olive-500/50 hover:shadow-elevation-2 dark:hover:shadow-darkGlow transition-all duration-300"
    >
      <Link to={`/services/${service.id}`} className="flex-1 flex flex-col">
        {/* Card Header: Icon & Top Badge */}
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center border border-charcoal/5 dark:border-white/5 shadow-xs`}
          >
            <Icon name={service.icon} size={22} />
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-charcoal/40 dark:text-dark-muted group-hover:text-olive-700 dark:group-hover:text-olive-400 transition-colors">
            <span>Explore</span>
            <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="font-display font-medium text-lg sm:text-xl text-charcoal dark:text-dark-text leading-snug group-hover:text-olive-800 dark:group-hover:text-olive-300 transition-colors">
            {service.name}
          </h3>
          <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted mt-1.5 line-clamp-2">
            {service.description || `${service.count || 12}+ verified village experts available`}
          </p>
        </div>
      </Link>

      {/* Card Footer: Price & Quick Action */}
      <div className="pt-4 mt-3 border-t border-charcoal/5 dark:border-dark-border flex items-center justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-charcoal/45 dark:text-dark-muted font-medium">Starting</span>
          <p className="text-base font-bold text-charcoal dark:text-dark-text font-display">
            ₹{price}<span className="text-xs font-normal text-charcoal/50 dark:text-dark-muted">/visit</span>
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 shadow-xs ${
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
