export default function Logo({ light = false, className = "", imgClassName = "" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <img
        src="/icons/logo.png"
        alt="Karya Logo"
        className={`w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-full shadow-2xs ${imgClassName}`}
        onError={(e) => {
          if (!e.currentTarget.dataset.fallback) {
            e.currentTarget.dataset.fallback = "true";
            e.currentTarget.src = "/icons/logo.jpeg";
          }
        }}
      />
      <span
        translate="no"
        className={`font-display text-xl sm:text-2xl font-bold tracking-tight notranslate ${
          light ? "text-cream" : "text-charcoal dark:text-dark-text"
        }`}
      >
        Karya
      </span>
    </span>
  );
}
