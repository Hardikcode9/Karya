import { forwardRef, useState, useId } from "react";

const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      onRightIconClick,
      type = "text",
      className = "",
      containerClassName = "",
      id,
      value,
      onChange,
      placeholder = "",
      required = false,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const [focused, setFocused] = useState(false);

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold tracking-wide uppercase text-charcoal/70 dark:text-dark-muted mb-1.5"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div
          className={`relative flex items-center rounded-2xl transition-all duration-200 border bg-white dark:bg-dark-card ${
            error
              ? "border-red-500 ring-2 ring-red-500/20"
              : focused
              ? "border-olive-600 dark:border-olive-400 ring-2 ring-olive-500/20 shadow-sm"
              : "border-charcoal/15 dark:border-dark-border hover:border-charcoal/30 dark:hover:border-olive-700"
          }`}
        >
          {LeftIcon && (
            <div className="pl-3.5 pr-1 text-charcoal/40 dark:text-dark-muted flex items-center pointer-events-none">
              <LeftIcon className="w-4 h-4" />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            required={required}
            className={`w-full bg-transparent px-3.5 py-3 text-sm text-charcoal dark:text-dark-text placeholder:text-charcoal/35 dark:placeholder:text-dark-muted/60 focus:outline-none rounded-2xl min-h-[46px] ${className}`}
            {...props}
          />

          {RightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              className="pr-3.5 pl-1 text-charcoal/40 hover:text-charcoal dark:text-dark-muted dark:hover:text-dark-text flex items-center transition-colors"
            >
              <RightIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {error ? (
          <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-charcoal/50 dark:text-dark-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
