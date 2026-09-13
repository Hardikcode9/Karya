import fs from "fs";

const file = "Frontend/src/pages/SHGs.jsx";
let src = fs.readFileSync(file, "utf8");

// 1. Replace the hardcoded PRODUCTS + CATEGORIES block with the data import.
const start = src.indexOf("const CATEGORIES = [");
const marker = "export default function SHGs()";
const end = src.indexOf(marker);
if (start === -1 || end === -1 || end < start) {
  console.error("MARKERS NOT FOUND", { start, end });
  process.exit(1);
}
const replacement =
  '// Real product catalog snapshot from shgeshop.com (theme, filters and fonts unchanged).\nimport { PRODUCTS, CATEGORIES } from "../data/shgCatalog";\n\n';
src = src.slice(0, start) + replacement + src.slice(end);

// 2. Dynamic price slider bounds from the real catalog (min, max, step 50).
const oldMax = 'const [priceLimit, setPriceLimit] = useState(2500);';
const newMax =
  'const MAX_PRICE = Math.max(...PRODUCTS.map((p) => p.price));\n  const [priceLimit, setPriceLimit] = useState(MAX_PRICE);';
if (!src.includes(oldMax)) {
  console.error("PRICE STATE NOT FOUND");
  process.exit(1);
}
src = src.replace(oldMax, newMax);

// 3. Reset buttons: reset to the real max instead of the old hardcoded 2500.
src = src.replaceAll(
  "setSelectedCategory(\"All\"); setPriceLimit(2500); setSearchQuery(\"\");",
  'setSelectedCategory("All"); setPriceLimit(MAX_PRICE); setSearchQuery("");'
);

fs.writeFileSync(file, src);

// sanity report
const checks = {
  hardcodedProductsGone: !src.includes('id: "prod-1"'),
  importPresent: src.includes('from "../data/shgCatalog"'),
  maxPriceDynamic: src.includes("const MAX_PRICE"),
  resetFixed: !src.includes("setPriceLimit(2500)"),
  linesKept: src.split("\n").length,
};
console.log(JSON.stringify(checks, null, 2));
