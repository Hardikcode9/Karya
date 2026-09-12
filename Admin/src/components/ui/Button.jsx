export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  onClick,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-bold transition-all rounded-xl cursor-pointer select-none focus:outline-none";

  const variants = {
    primary:
      "bg-olive-700 hover:bg-olive-800 text-white shadow-xs active:scale-[0.98]",
    secondary:
      "bg-charcoal/10 dark:bg-dark-border text-charcoal dark:text-dark-text hover:bg-charcoal/15",
    outline:
      "border border-charcoal/20 dark:border-dark-border text-charcoal dark:text-dark-text hover:border-olive-600 bg-white dark:bg-dark-bg",
    danger:
      "bg-rose-700 hover:bg-rose-800 text-white shadow-xs active:scale-[0.98]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-xs sm:text-sm gap-2",
    lg: "px-5 py-2.5 text-sm sm:text-base gap-2.5",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
