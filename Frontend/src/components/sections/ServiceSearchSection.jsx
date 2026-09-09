import { useMemo, useState } from "react";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { workers } from "../../data/mockData";
import Rating from "../ui/Rating";
import Button from "../ui/Button";
import SectionHeading from "../ui/SectionHeading";
import ImageTile from "../ui/ImageTile";

export default function ServiceSearchSection() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return workers
      .filter((w) => {
        if (!q) return true;
        return (
          w.role.toLowerCase().includes(q) ||
          w.skills.some((s) => s.toLowerCase().includes(q))
        );
      })
      .slice(0, 3);
  }, [query]);

  return (
    <section className="container-kare mt-24 sm:mt-32">
      <SectionHeading
        eyebrow="Search"
        title="What do you need help with?"
        description="Tell us what you're looking for and where — we'll show workers and SHGs nearby."
      />

      <div className="mt-8 flex flex-col sm:flex-row gap-3 bg-cream-card rounded-2xl sm:rounded-full p-2.5 border border-charcoal/5">
        <div className="flex items-center gap-2.5 flex-1 px-3 py-2">
          <Search size={18} className="text-charcoal/40 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a service…"
            className="bg-transparent outline-none w-full text-sm placeholder:text-charcoal/40"
          />
        </div>
        <div className="hidden sm:block w-px bg-charcoal/10 my-1" />
        <div className="flex items-center gap-2.5 flex-1 px-3 py-2">
          <MapPin size={18} className="text-charcoal/40 shrink-0" />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Your village / location"
            className="bg-transparent outline-none w-full text-sm placeholder:text-charcoal/40"
          />
        </div>
        <Button size="sm" className="shrink-0">
          <SlidersHorizontal size={16} />
          Filters
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {results.map((w) => (
          <motion.div
            key={w.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-cream-card rounded-3xl overflow-hidden border border-charcoal/5"
          >
            <div className="aspect-[16/10]">
              <ImageTile keywords={`${w.role} india portrait`} alt={w.name} seed="500x320" className="w-full h-full" />
            </div>
            <div className="p-5 flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-lg text-charcoal">{w.name}</h3>
                  <p className="text-sm text-charcoal/55">{w.role}</p>
                </div>
                <Rating value={w.rating} />
              </div>
              <p className="text-sm text-charcoal/55">
                {w.distanceKm} km away · ₹{w.price}/{w.priceUnit}
              </p>
              <span className="text-xs text-olive-700 font-medium">Available today</span>
              <div className="flex gap-2 mt-2">
                <Button as={Link} to={`/workers/${w.id}`} size="sm" variant="outline" className="flex-1">
                  View profile
                </Button>
                <Button as={Link} to={`/workers/${w.id}`} size="sm" className="flex-1">
                  Request
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
        {results.length === 0 && (
          <p className="text-charcoal/50 text-sm col-span-full py-10 text-center">
            No matches yet — try a different word, like "plumber" or "tailor".
          </p>
        )}
      </div>
    </section>
  );
}
