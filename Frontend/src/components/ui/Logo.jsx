export default function Logo({ light = false, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 select-none ${className}`}>
      <span
        className={`w-8 h-8 rounded-full flex items-center justify-center font-display text-base ${
          light ? "bg-cream text-olive-900" : "bg-olive-700 text-cream"
        }`}
      >
        K
      </span>
      <span className={`font-display text-xl tracking-tight ${light ? "text-cream" : "text-charcoal"}`}>
        Karya
      </span>
    </span>
  );
}
