import {
  Wrench, Zap, Hammer, Sparkles, HardHat, Wheat, Truck, Home,
  Scissors, Palette, ChefHat, Soup, Cookie, Package, ShoppingBag,
  Sprout, Settings, PartyPopper, Package2, CalendarDays,
} from "lucide-react";

const iconMap = {
  Wrench, Zap, Hammer, Sparkles, HardHat, Wheat, Truck, Home,
  Scissors, Palette, ChefHat, Soup, Cookie, Package, ShoppingBag,
  Sprout, Settings, PartyPopper, Package2, CalendarDays,
};

export default function Icon({ name, size = 20, className = "" }) {
  const Component = iconMap[name] || Package;
  return <Component size={size} className={className} />;
}
