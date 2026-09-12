import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "../components/ui/SectionHeading";
import ImageTile from "../components/ui/ImageTile";

const resources = [];
const categories = ["All"];

export default function Resources() {
  const [active, setActive] = useState("All");
  const filtered = [];

  return (
    <div className="pt-32 sm:pt-40">
      <section className="container-kare">
        <SectionHeading
          eyebrow="Resources"
          title="Practical reading for local workers and SHGs."
          description="Short, plain-language guides on the topics that come up most."
        />
        <div className="flex flex-wrap gap-2 mt-8">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`px-4 py-2 rounded-full text-sm border ${
                active === c ? "bg-charcoal text-cream border-charcoal" : "border-charcoal/15 text-charcoal/60"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="container-kare mt-10">
        {filtered.length === 0 ? (
          <div className="bg-cream-card rounded-2xl p-8 text-center border border-charcoal/10">
            <p className="text-charcoal/60 dark:text-dark-muted">No resources available at this time.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((r) => (
              <Link key={r.id} to={`/resources/${r.id}`} className="group bg-cream-card rounded-3xl overflow-hidden border border-charcoal/5 flex flex-col">
                <div className="aspect-[16/10]">
                  <ImageTile keywords={r.image} alt={r.title} seed="500x320" className="w-full h-full" />
                </div>
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <span className="text-xs text-olive-700 font-medium">{r.category}</span>
                  <h3 className="font-display text-lg leading-snug">{r.title}</h3>
                  <p className="text-sm text-charcoal/55 flex-1">{r.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm text-charcoal/60 group-hover:text-charcoal">
                    Read more <ArrowUpRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
