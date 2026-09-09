export default function Skeleton({
  variant = "rectangular",
  width,
  height,
  className = "",
  count = 1,
}) {
  const baseClasses = "skeleton-shimmer rounded-xl";

  const variantClasses = {
    circular: "rounded-full",
    rounded: "rounded-2xl",
    text: "rounded-md h-4 my-1",
    rectangular: "rounded-xl",
  };

  const style = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  if (count > 1) {
    return (
      <div className="space-y-2 w-full">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}
