import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { serviceCategories } from "../../data/mockData";
import ServiceCard from "../ui/ServiceCard";
import SectionHeading from "../ui/SectionHeading";

export default function ServicesSection() {
  const [active, setActive] = useState(serviceCategories[0].id);
  const activeCategory = serviceCategories.find((c) => c.id === active) || serviceCategories[0];

  return (
    <section className="container-kare mt-20 sm:mt-28">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
        <SectionHeading
          eyebrow="Categorized Services"
          title="Essential Village Services on Demand"
          description="From urgent home and farm repairs to authentic women's cooperative crafts and catering."
        />
        <Link
          to="/services"
          className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-olive-700 dark:text-olive-400 hover:text-olive-900 transition-colors shrink-0"
        >
          <span>View All 24+ Services</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Horizontal Pill Scroller (Herlyy Style) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-8">
        {serviceCategories.map((c) => {
          const isActive = active === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setActive(c.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 select-none ${
                isActive
                  ? "bg-olive-800 text-cream shadow-sm dark:bg-olive-600"
                  : "bg-cream-card dark:bg-dark-card text-charcoal/70 dark:text-dark-muted border border-charcoal/10 dark:border-dark-border hover:border-charcoal/30 dark:hover:border-olive-500"
              }`}
            >
              {c.title}
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {activeCategory.services.map((s, idx) => (
            <ServiceCard key={s.id} service={s} index={idx} />
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 text-center md:hidden">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cream-card dark:bg-dark-card border border-charcoal/15 dark:border-dark-border text-xs font-bold text-charcoal dark:text-dark-text"
        >
          <span>Explore All 24+ Services</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
