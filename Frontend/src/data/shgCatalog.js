// Live catalog snapshot imported from shgeshop.com (929 products, 19 top-level categories).
// Snapshot generated with: node .shgtmp/build-catalog.mjs
import catalog from "./shgCatalog.json";

export const PRODUCTS = catalog.products;

// "All" first, then categories ordered by product count — same string-array
// shape the storefront UI has always consumed.
export const CATEGORIES = [
  "All",
  ...catalog.meta.categories.map((c) => c.name),
];

export const CATALOG_META = catalog.meta;

export default catalog;
