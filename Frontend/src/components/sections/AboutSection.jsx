import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import Button from "../ui/Button";
import ImageTile from "../ui/ImageTile";

const features = [
  "Local skill discovery",
  "Worker & SHG profiles",
  "Smart matching",
  "Multilingual access",
  "Offline-first experience",
  "Transparent payments",
];

export default function AboutSection() {
  return (
    <section className="mt-24 sm:mt-32 bg-olive-700 text-cream rounded-[2.5rem] sm:rounded-[3rem] mx-3 sm:mx-5">
      <div className="container-kare py-16 sm:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-[2rem] overflow-hidden aspect-[4/3]"
        >
          <ImageTile keywords="rural india self help group women" alt="A Self-Help Group meeting" seed="900x700" className="w-full h-full" />
        </motion.div>

        <div className="flex flex-col gap-6">
          <span className="text-sm font-medium text-olive-200">About Karya</span>
          <h2 className="font-display text-3xl sm:text-4xl leading-[1.1] text-balance">
            Technology that strengthens local communities.
          </h2>
          <p className="text-cream/75 leading-relaxed">
            Karya helps rural workers and SHGs discover meaningful opportunities, while helping
            customers find services they can actually trust.
          </p>
          <ul className="grid sm:grid-cols-2 gap-3">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-cream/90">
                <Check size={16} className="text-olive-300 shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          <div className="bg-cream/10 rounded-2xl p-5 mt-2 border border-cream/10">
            <p className="text-cream/90 text-sm leading-relaxed italic">
              "Our mission is simple: make local work easier to find, easier to trust, and easier
              to access."
            </p>
          </div>

          <Button as={Link} to="/about" variant="ghost" className="self-start" icon>
            Learn more about Karya
          </Button>
        </div>
      </div>
    </section>
  );
}
