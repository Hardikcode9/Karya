import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "../components/ui/SectionHeading";
import ImageTile from "../components/ui/ImageTile";

const projects = [];

export default function Work() {
  return (
    <div className="pt-32 sm:pt-40">
      <section className="container-kare">
        <SectionHeading
          eyebrow="Work"
          title="Real people. Real work. Real impact."
          description="A look at how communities have used Karya to find work and grow income."
        />
      </section>

      <section className="container-kare mt-10">
        {projects.length === 0 ? (
          <div className="bg-cream-card rounded-2xl p-8 text-center border border-charcoal/10">
            <p className="text-charcoal/60 dark:text-dark-muted">No recent projects found.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <Link key={p.id} to={`/work/${p.id}`} className="group bg-cream-card rounded-3xl overflow-hidden border border-charcoal/5 flex flex-col">
                <div className="aspect-[16/11]">
                  <ImageTile keywords={p.image} alt={p.title} seed="500x360" className="w-full h-full" />
                </div>
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <span className="text-xs text-olive-700 font-medium">{p.category} · {p.community}</span>
                  <h3 className="font-display text-lg leading-snug flex-1">{p.title}</h3>
                  <span className="inline-flex items-center gap-1 text-sm text-charcoal/60 group-hover:text-charcoal">
                    Read the story <ArrowUpRight size={14} />
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
