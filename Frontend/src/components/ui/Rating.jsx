import { Star } from "lucide-react";

export default function Rating({ value, showValue = true, size = 14 }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-charcoal">
      <Star size={size} className="fill-clay-300 text-clay-300" />
      {showValue && value.toFixed(1)}
    </span>
  );
}
