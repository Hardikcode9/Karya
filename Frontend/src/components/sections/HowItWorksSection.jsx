import { motion } from "framer-motion";
import { Search, Sparkles, MessageCircle, CheckCircle2 } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

const steps = [
  { icon: Search, title: "Discover", desc: "Find workers, SHGs and services near you." },
  { icon: Sparkles, title: "Match", desc: "Karya recommends providers by location, skill, availability, rating and price." },
  { icon: MessageCircle, title: "Connect", desc: "Send a service request and talk directly with the provider." },
  { icon: CheckCircle2, title: "Complete & grow", desc: "Finish the work, pay, leave a rating and help local workers grow." },
];

export default function HowItWorksSection({ tone = "dark" }) {
  return (
    <section className="container-kare mt-24 sm:mt-32">
      <SectionHeading eyebrow="How it works" title="From a search to a finished job." align="center" tone={tone} />
      <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        <div className="hidden lg:block absolute top-8 left-[12%] right-[12%] h-px bg-charcoal/15 dark:bg-white/20" />
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative flex flex-col items-center text-center gap-3"
          >
            <span className="relative z-10 w-16 h-16 rounded-full bg-cream-card dark:bg-dark-card border border-charcoal/15 dark:border-dark-border flex items-center justify-center backdrop-blur-xs shadow-xs text-charcoal dark:text-dark-text">
              <step.icon size={22} className="text-olive-700 dark:text-emerald-400" />
            </span>
            <h3 className="font-display text-lg font-bold text-charcoal dark:text-dark-text">{step.title}</h3>
            <p className="text-sm text-charcoal/70 dark:text-dark-muted max-w-[220px] leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
