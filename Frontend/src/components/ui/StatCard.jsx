import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

export default function StatCard({ value, suffix = "", label, tone = "dark" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-1"
    >
      <span className={`font-display text-4xl sm:text-5xl ${tone === "light" ? "text-cream" : "text-charcoal"}`}>
        {display.toLocaleString("en-IN")}
        {suffix}
      </span>
      <span className={`text-sm ${tone === "light" ? "text-cream/70" : "text-charcoal/60"}`}>{label}</span>
    </motion.div>
  );
}
