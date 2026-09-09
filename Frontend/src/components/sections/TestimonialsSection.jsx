import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import { testimonials } from "../../data/mockData";

export default function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const t = testimonials[index] || testimonials[0];

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [paused]);

  const go = (dir) => setIndex((i) => (i + dir + testimonials.length) % testimonials.length);

  return (
    <section className="container-kare mt-20 sm:mt-28">
      <SectionHeading
        eyebrow="Community Trust"
        title="Real Voices from the Ground"
        description="How village households and local trade specialists rely on Karya daily."
        align="center"
      />

      <div
        className="max-w-2xl mx-auto mt-10 flex items-center gap-3 sm:gap-6"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <button
          onClick={() => go(-1)}
          aria-label="Previous testimonial"
          className="w-10 h-10 rounded-full border border-charcoal/15 dark:border-dark-border bg-cream dark:bg-dark-card flex items-center justify-center text-charcoal dark:text-dark-text hover:bg-ivory dark:hover:bg-dark-surface shrink-0 shadow-xs transition-colors"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex-1 min-h-[240px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="bg-cream-card dark:bg-dark-card rounded-3xl p-6 sm:p-9 text-center flex flex-col items-center gap-4 border border-charcoal/5 dark:border-dark-border shadow-elevation-1"
            >
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              <Quote size={24} className="text-olive-500 dark:text-olive-400 opacity-60" />

              <p className="text-base sm:text-lg text-charcoal/85 dark:text-dark-text leading-relaxed font-serif italic">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-3 mt-2">
                <span className="w-10 h-10 rounded-full bg-olive-200 dark:bg-olive-900/70 flex items-center justify-center font-display text-sm font-bold text-olive-800 dark:text-olive-300">
                  {t.name.charAt(0)}
                </span>
                <div className="text-left">
                  <p className="text-sm font-bold text-charcoal dark:text-dark-text">{t.name}</p>
                  <p className="text-xs text-charcoal/55 dark:text-dark-muted">{t.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={() => go(1)}
          aria-label="Next testimonial"
          className="w-10 h-10 rounded-full border border-charcoal/15 dark:border-dark-border bg-cream dark:bg-dark-card flex items-center justify-center text-charcoal dark:text-dark-text hover:bg-ivory dark:hover:bg-dark-surface shrink-0 shadow-xs transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to testimonial ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-olive-700 dark:bg-olive-400" : "w-1.5 bg-charcoal/20 dark:bg-white/20"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
