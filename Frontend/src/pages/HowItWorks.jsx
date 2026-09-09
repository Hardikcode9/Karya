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
    <div className="pt-32 sm:pt-40">
      <section className="container-kare text-center">
        <h1 className="font-display text-4xl sm:text-5xl leading-[1.1] max-w-2xl mx-auto text-balance">
          How Karya works, from search to finished job.
        </h1>
      </section>

      <HowItWorksSection />

      <section className="container-kare mt-24 sm:mt-32">
        <SectionHeading eyebrow="The full journey" title="A closer look at a customer's request." align="center" />
        <div className="mt-10 flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
          {flowSteps.map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.03 }}
              className="flex items-center gap-2"
            >
              <span className="px-3.5 py-2 rounded-full bg-cream-card border border-charcoal/10 text-sm text-charcoal/70">
                {step}
              </span>
              {i < flowSteps.length - 1 && <span className="text-charcoal/25">→</span>}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
