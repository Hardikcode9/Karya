import {
  Wrench, Zap, Hammer, Sparkles, HardHat, Wheat, Truck, Home,
  Scissors, Palette, ChefHat, Soup, Cookie, Package, ShoppingBag,
  Sprout, Settings, PartyPopper, Package2, CalendarDays,
} from "lucide-react";

export const iconMap = {
  Wrench, Zap, Hammer, Sparkles, HardHat, Wheat, Truck, Home,
  Scissors, Palette, ChefHat, Soup, Cookie, Package, ShoppingBag,
  Sprout, Settings, PartyPopper, Package2, CalendarDays,
};

export function getIcon(name) {
  return iconMap[name] || Package;
}
