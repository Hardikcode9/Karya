import { motion } from "framer-motion";
import SectionHeading from "../components/ui/SectionHeading";
import HowItWorksSection from "../components/sections/HowItWorksSection";

const flowSteps = [
  "Select service", "Enter location", "Choose date", "Choose time",
  "Set budget", "Add description", "Find matches", "Select worker",
  "Send request", "Worker accepts", "Job active", "Job completed", "Pay", "Rate",
];

export default function HowItWorks() {
  return (
    <div className="pt-32 sm:pt-40 text-charcoal dark:text-dark-text min-h-screen">
      <section className="container-kare text-center">
        <span className="inline-block px-3.5 py-1 rounded-full bg-olive-100 dark:bg-olive-950/60 text-olive-800 dark:text-olive-300 border border-olive-200/60 dark:border-olive-800/40 text-xs font-bold uppercase tracking-wider mb-3">
          Step-by-Step Overview
        </span>
        <h1 className="font-display text-4xl sm:text-5xl leading-[1.1] max-w-2xl mx-auto text-balance text-charcoal dark:text-dark-text font-bold">
          How Karya works, from search to finished job.
        </h1>
        <p className="text-sm sm:text-base text-charcoal/70 dark:text-dark-muted max-w-xl mx-auto mt-3">
          A seamless local-first ecosystem connecting rural households, skilled tradespeople, and self-help group cooperatives.
        </p>
      </section>

      <HowItWorksSection tone="dark" />

      <section className="container-kare mt-24 sm:mt-32 pb-24">
        <SectionHeading
          eyebrow="The full journey"
          title="A closer look at a customer's request."
          align="center"
          tone="dark"
        />
        <div className="mt-10 flex flex-wrap justify-center gap-2.5 max-w-3xl mx-auto">
          {flowSteps.map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.03 }}
              className="flex items-center gap-2"
            >
              <span className="px-4 py-2 rounded-full bg-cream-card dark:bg-dark-card border border-charcoal/15 dark:border-dark-border text-sm font-semibold text-charcoal dark:text-dark-text backdrop-blur-xs shadow-xs hover:bg-ivory dark:hover:bg-dark-surface transition-all">
                {step}
              </span>
              {i < flowSteps.length - 1 && <span className="text-charcoal/40 dark:text-dark-muted font-bold">→</span>}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
