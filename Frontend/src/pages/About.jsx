import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import SectionHeading from "../components/ui/SectionHeading";
import Button from "../components/ui/Button";
import ImageTile from "../components/ui/ImageTile";
import StatCard from "../components/ui/StatCard";

const values = [
  { title: "Trust first", desc: "Every profile carries verification, so a decision to hire never has to be a guess." },
  { title: "Built for low connectivity", desc: "Karya works on slow networks and syncs quietly once you're back online." },
  { title: "Community-owned growth", desc: "SHGs and workers keep control of their pricing, availability and profile." },
];

export default function About() {
  return (
    <div className="pt-32 sm:pt-40">
      <section className="container-kare grid lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-5">
          <span className="text-sm font-medium text-olive-600">About Karya</span>
          <h1 className="font-display text-4xl sm:text-5xl leading-[1.1] text-balance">
            Local work, made easier to find, trust and access.
          </h1>
          <p className="text-lg text-charcoal/65 leading-relaxed">
            Karya began with a simple observation: skilled rural workers and Self-Help Groups
            often struggle to be found beyond word of mouth, while customers nearby have no easy
            way to discover them. We built a multilingual, offline-first platform to close that gap.
          </p>
          <Button as={Link} to="/services" icon className="self-start">
            Explore services
          </Button>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-[2.5rem] overflow-hidden aspect-[4/3]"
        >
          <ImageTile keywords="rural india community workers group" alt="Karya community" seed="900x680" className="w-full h-full" />
        </motion.div>
      </section>

      <section className="container-kare mt-24 sm:mt-32">
        <SectionHeading eyebrow="What we believe" title="Principles behind every decision we make." />
        <div className="grid sm:grid-cols-3 gap-5 mt-10">
          {values.map((v) => (
            <div key={v.title} className="bg-cream-card rounded-3xl p-6 border border-charcoal/5">
              <span className="w-9 h-9 rounded-full bg-olive-100 text-olive-700 flex items-center justify-center mb-4">
                <Check size={16} />
              </span>
              <h3 className="font-display text-lg mb-2">{v.title}</h3>
              <p className="text-sm text-charcoal/60 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
