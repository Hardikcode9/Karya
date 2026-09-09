import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, MapPin, Star } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import { rankWorkers } from "../../utils/matching";
import { workers, matchingWeights } from "../../data/mockData";

const request = { skill: "carpentry", budget: 550, distanceOverride: null };
const topMatch = rankWorkers(workers, request)[0];

const weightRows = [
  { label: "Location", value: matchingWeights.location },
  { label: "Skill match", value: matchingWeights.skill },
  { label: "Availability", value: matchingWeights.availability },
  { label: "Rating", value: matchingWeights.rating },
  { label: "Price", value: matchingWeights.price },
];

export default function SmartMatchingSection() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStage((s) => (s + 1) % 3), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="container-kare mt-24 sm:mt-32">
      <div className="grid lg:grid-cols-[1fr_1fr] gap-14 items-center">
        <div className="flex flex-col gap-6">
          <SectionHeading
            eyebrow="Smart matching"
            title="The right person, right when you need them."
            description="Karya ranks nearby workers using a weighted score, so the first result is usually the best fit — not just the closest one."
          />
          <div className="flex flex-col gap-3">
            {weightRows.map((row) => (
              <div key={row.label} className="flex items-center gap-4">
                <span className="text-sm text-charcoal/60 w-28 shrink-0">{row.label}</span>
                <div className="flex-1 h-2 rounded-full bg-ivory overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${row.value * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full bg-olive-600 rounded-full"
                  />
                </div>
                <span className="text-sm text-charcoal/50 w-10 text-right">{Math.round(row.value * 100)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <AnimatePresence mode="wait">
            {stage === 0 && (
              <motion.div
                key="request"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full max-w-xs bg-cream-card rounded-3xl border border-charcoal/5 p-6"
              >
                <span className="text-xs text-olive-700 font-medium">Customer request</span>
                <h4 className="font-display text-xl mt-1">Carpenter</h4>
                <p className="text-sm text-charcoal/60 mt-1">Furniture repair · Tomorrow · ₹550</p>
              </motion.div>
            )}
            {stage === 1 && (
              <motion.div
                key="engine"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full max-w-xs bg-charcoal text-cream rounded-3xl p-6 flex flex-col items-center text-center gap-2"
              >
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 rounded-full border-2 border-cream/30 border-t-cream"
                />
                <p className="text-sm text-cream/80 mt-1">Karya matching engine</p>
                <p className="text-xs text-cream/50">Weighing location, skill, availability, rating &amp; price</p>
              </motion.div>
            )}
            {stage === 2 && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full max-w-xs bg-cream-card rounded-3xl border border-olive-300 p-6"
              >
                <span className="inline-block text-xs font-medium bg-olive-100 text-olive-800 rounded-full px-2.5 py-1">
                  {topMatch.matchPercent}% match
                </span>
                <h4 className="font-display text-xl mt-3">{topMatch.name}</h4>
                <div className="flex items-center gap-3 text-sm text-charcoal/60 mt-1">
                  <span className="flex items-center gap-1"><MapPin size={14} />{topMatch.distanceKm} km</span>
                  <span className="flex items-center gap-1"><Star size={14} className="fill-clay-300 text-clay-300" />{topMatch.rating}</span>
                </div>
                <span className="text-xs text-olive-700 font-medium block mt-2">Available</span>
              </motion.div>
            )}
          </AnimatePresence>
          <ArrowDown size={18} className="text-charcoal/25" />
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`w-1.5 h-1.5 rounded-full ${stage === i ? "bg-olive-700" : "bg-charcoal/15"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
