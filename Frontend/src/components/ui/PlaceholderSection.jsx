export default function PlaceholderSection({ title, description }) {
  return (
    <div className="bg-cream-card rounded-3xl border border-dashed border-charcoal/15 p-12 text-center">
      <h2 className="font-display text-xl mb-2">{title}</h2>
      <p className="text-charcoal/55 text-sm max-w-sm mx-auto">{description}</p>
    </div>
  );
}
