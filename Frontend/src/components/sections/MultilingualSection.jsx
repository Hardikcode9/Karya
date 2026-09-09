import { useState } from "react";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import { languageOptions } from "../../constants/languages";

export default function MultilingualSection() {
  const [heard, setHeard] = useState(false);

  return (
    <section className="container-kare mt-24 sm:mt-32">
      <div className="grid lg:grid-cols-2 gap-14 items-center">
        <div className="flex flex-col gap-6">
          <SectionHeading
            eyebrow="Multilingual"
            title="Technology that speaks your language."
            description="Switch the whole interface to the language you're most comfortable in — with more languages added over time."
          />
          <div className="flex flex-wrap gap-2.5">
            {languageOptions.map((l) => (
              <span key={l.code} className="px-4 py-2 rounded-full bg-cream-card border border-charcoal/10 text-sm">
                {l.label}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-cream-card rounded-3xl p-8 border border-charcoal/5 flex flex-col items-center text-center gap-5">
          <button
            onClick={() => setHeard((v) => !v)}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
              heard ? "bg-olive-700 text-cream" : "bg-olive-100 text-olive-700"
            }`}
            aria-pressed={heard}
            aria-label="Try voice search demo"
          >
            <Mic size={24} />
          </button>
          <p className="text-charcoal/70 italic">"Mujhe kal ek plumber chahiye."</p>

          {heard && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full bg-cream rounded-2xl p-5 text-left border border-charcoal/5"
            >
              <span className="text-xs text-olive-700 font-medium">Service request</span>
              <dl className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between"><dt className="text-charcoal/50">Service</dt><dd>Plumber</dd></div>
                <div className="flex justify-between"><dt className="text-charcoal/50">Date</dt><dd>Tomorrow</dd></div>
                <div className="flex justify-between"><dt className="text-charcoal/50">Location</dt><dd>Current location</dd></div>
              </dl>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
