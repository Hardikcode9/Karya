import { forwardRef } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-olive-700 text-cream hover:bg-olive-800 active:bg-olive-900 shadow-sm dark:bg-olive-600 dark:hover:bg-olive-500",
  dark:
    "bg-charcoal text-cream hover:bg-olive-950 active:bg-black dark:bg-dark-card dark:text-dark-text dark:border dark:border-dark-border dark:hover:bg-dark-cardHover",
  outline:
    "bg-transparent text-charcoal border border-charcoal/25 hover:border-charcoal/70 hover:bg-charcoal/5 dark:text-dark-text dark:border-dark-border dark:hover:border-olive-400 dark:hover:bg-white/5",
  ghost:
    "bg-cream-card text-charcoal hover:bg-ivory active:bg-cream-warm dark:bg-dark-card dark:text-dark-text dark:hover:bg-dark-cardHover",
  clay:
    "bg-clay-500 text-cream hover:bg-clay-600 active:bg-clay-700 shadow-sm",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm",
};

const sizes = {
  sm: "text-xs px-3.5 py-2 min-h-[36px]",
  md: "text-sm sm:text-[0.95rem] px-5 py-2.5 min-h-[44px]",
  lg: "text-base px-6 sm:px-7 py-3.5 min-h-[48px]",
  xl: "text-base sm:text-lg px-8 py-4 min-h-[52px]",
};

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      icon = false,
      leftIcon: LeftIcon = null,
      rightIcon: RightIcon = null,
      loading = false,
      disabled = false,
      fullWidth = false,
      as: Component = "button",
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 ease-kare active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none ${
          fullWidth ? "w-full" : ""
        } ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          LeftIcon && <LeftIcon className="w-4 h-4" />
        )}
        <span>{children}</span>
        {!loading && (
          RightIcon ? (
            <RightIcon className="w-4 h-4" />
          ) : icon ? (
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          ) : null
        )}
      </Component>
    );
  }
);
Button.displayName = "Button";

export default Button;
