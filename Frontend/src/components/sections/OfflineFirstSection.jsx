import { motion } from "framer-motion";
import { WifiOff, Database, RefreshCw, Cloud, CheckCircle2 } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

const flow = [
  { icon: WifiOff, label: "No internet" },
  { icon: Database, label: "Local app data" },
  { icon: RefreshCw, label: "Connection returns" },
  { icon: Cloud, label: "Karya cloud" },
];

const features = [
  "Cached profiles & services",
  "Offline job requests",
  "Local profile editing",
  "Background synchronization",
  "Installable, PWA-ready",
  "Built for low-data connections",
];

export default function OfflineFirstSection() {
  return (
    <section className="mt-24 sm:mt-32 bg-charcoal text-cream rounded-[2.5rem] sm:rounded-[3rem] mx-3 sm:mx-5">
      <div className="container-kare py-16 sm:py-24">
        <SectionHeading
          eyebrow="Offline-first"
          title="Works even when the internet doesn't."
          description="Rural connectivity can be inconsistent, so Karya is built around a local-first architecture that keeps working through the gaps."
          tone="light"
        />

        <div className="mt-12 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div className="flex items-center justify-between overflow-x-auto gap-2 sm:gap-4 pb-2">
            {flow.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2 sm:gap-4 shrink-0">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.4 }}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <span className="w-14 h-14 rounded-2xl bg-cream/10 flex items-center justify-center">
                    <step.icon size={20} className="text-olive-300" />
                  </span>
                  <span className="text-xs text-cream/60 w-20">{step.label}</span>
                </motion.div>
                {i < flow.length - 1 && <div className="w-6 sm:w-10 h-px bg-cream/20" />}
              </div>
            ))}
          </div>

          <ul className="grid sm:grid-cols-2 gap-3">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-cream/85">
                <CheckCircle2 size={16} className="text-olive-300 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
