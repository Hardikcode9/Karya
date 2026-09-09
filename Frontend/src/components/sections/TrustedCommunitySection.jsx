const items = ["Rural communities", "Self-help groups", "Local businesses", "Community centres", "Skill networks"];

export default function TrustedCommunitySection() {
  return (
    <section className="container-kare mt-20 sm:mt-28">
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-8 border-y border-charcoal/10">
        {items.map((item) => (
          <span key={item} className="text-sm sm:text-base text-charcoal/40 font-display italic">
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
