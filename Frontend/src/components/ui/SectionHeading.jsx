import { motion } from "framer-motion";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  className = "",
}) {
  const alignment = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";
  const titleColor =
    tone === "white"
      ? "text-white"
      : tone === "light"
      ? "text-cream"
      : "text-charcoal dark:text-white";
  const descColor =
    tone === "white"
      ? "text-white/85"
      : tone === "light"
      ? "text-cream/75"
      : "text-charcoal/65 dark:text-white/75";
  const eyebrowColor =
    tone === "white"
      ? "text-emerald-400 font-bold"
      : tone === "light"
      ? "text-olive-300 font-semibold"
      : "text-olive-600 dark:text-emerald-400 font-semibold";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col gap-4 max-w-2xl ${alignment} ${className}`}
    >
      {eyebrow && (
        <span className={`text-sm uppercase tracking-wider ${eyebrowColor}`}>
          {eyebrow}
        </span>
      )}
      <h2 className={`font-display text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-balance ${titleColor}`}>
        {title}
      </h2>
      {description && <p className={`text-base sm:text-lg leading-relaxed ${descColor}`}>{description}</p>}
    </motion.div>
  );
}
