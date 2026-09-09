export default function Badge({ children, tone = "olive", className = "" }) {
  const tones = {
    olive: "bg-olive-100 text-olive-800",
    clay: "bg-clay-100 text-clay-800",
    charcoal: "bg-charcoal text-cream",
    outline: "border border-charcoal/20 text-charcoal",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
