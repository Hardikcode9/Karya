import { heroStats } from "../../data/mockData";
import StatCard from "../ui/StatCard";

export default function StatsBar() {
  return (
    <section className="container-kare">
      <div className="rounded-[2rem] bg-cream-card border border-charcoal/5 px-6 sm:px-10 py-8 sm:py-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {heroStats.map((s) => (
          <StatCard key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
        ))}
      </div>
    </section>
  );
}
