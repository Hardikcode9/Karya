import { motion } from "framer-motion";
import SectionHeading from "../ui/SectionHeading";
import { impactMetrics } from "../../data/mockData";

export default function ImpactSection() {
  return (
    <section className="mt-24 sm:mt-32 bg-olive-950 text-cream rounded-[2.5rem] sm:rounded-[3rem] mx-3 sm:mx-5">
      <div className="container-kare py-16 sm:py-24">
        <SectionHeading
          eyebrow="Impact"
          title="Real people. Real work. Real impact."
          description="Demo figures illustrating the kind of impact Karya is designed to track — to be replaced with live data as the platform grows."
          tone="light"
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {impactMetrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex flex-col gap-1"
            >
              <span className="font-display text-4xl sm:text-5xl text-olive-300">{m.value}</span>
              <span className="text-sm text-cream/65">{m.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
