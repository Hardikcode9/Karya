import fs from "fs";

const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const products = [...read(".shgtmp/page_0.json"), ...read(".shgtmp/page_500.json")];
const cats = read(".shgtmp/cats.json");
const vendors = read(".shgtmp/vendors.json");
const attrs = [...read(".shgtmp/pattrs.json"), ...read(".shgtmp/pattrs2.json")];

console.log(`input: ${products.length} products, ${cats.length} categories, ${vendors.length} vendors, ${attrs.length} attribute rows`);

// --- child -> root category resolution ---
const catById = new Map(cats.map((c) => [c.id, c]));
const rootOf = (catId) => {
  let c = catById.get(catId);
  let hops = 0;
  while (c && c.parent_id && hops++ < 10) c = catById.get(c.parent_id);
  return c || catById.get(catId);
};

const vendorById = new Map(vendors.map((v) => [v.id, v]));

// --- variants from product_attributes ---
const variantsByProduct = new Map();
for (const a of attrs) {
  const label = a.custom_value || a.attribute_values?.name;
  if (!label || !a.product_id) continue;
  if (!variantsByProduct.has(a.product_id)) variantsByProduct.set(a.product_id, []);
  const list = variantsByProduct.get(a.product_id);
  if (!list.includes(label) && list.length < 8) list.push(label);
}

// --- html strip / entity decode ---
const stripHtml = (html) =>
  (html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, " ")
    .trim();

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=800&q=80";

const out = [];
const rootCount = new Map();
const seenSlugs = new Set();
let noSlug = 0;

for (const p of products) {
  const slug = p.slug || p.id;
  if (seenSlugs.has(slug)) {
    slug && noSlug++;
    continue;
  }
  seenSlugs.add(slug);

  // root category for the filter facet
  const rootCat = (p.categories || []).map((c) => rootOf(c.id)).find(Boolean);
  const rootName = rootCat ? rootCat.name.replace(/&amp;/g, "&") : "Other";
  rootCount.set(rootName, (rootCount.get(rootName) || 0) + 1);

  const v = p.vendors ? vendorById.get(p.vendors.id) : null;
  const price = p.sale_price ?? p.regular_price ?? p.min_price ?? 0;
  const original =
    p.sale_price != null && p.regular_price != null && p.regular_price > p.sale_price
      ? p.regular_price
      : null;
  const location = v ? [v.city, v.state].filter(Boolean).join(", ") : null;

  const tags = [];
  if (p.featured) tags.push("Featured");
  if (original) {
    const off = Math.round((1 - price / original) * 100);
    if (off >= 20) tags.push(`${off}% Off`);
  }
  if (!p.stock_status || p.stock_status === "instock") tags.push("In Stock");

  out.push({
    id: slug,
    name: p.title,
    category: rootName,
    subcategory: p.categories?.[0]?.name?.replace(/&amp;/g, "&") || null,
    price: Math.round(price * 100) / 100,
    originalPrice: original ? Math.round(original * 100) / 100 : null,
    rating: p.rating_avg > 0 ? p.rating_avg : null,
    reviews: p.review_count || 0,
    shgName: v?.name || p.vendors?.name || "SHG e-shop Collective",
    artisanStory: stripHtml(v?.about || v?.story || "").slice(0, 800) || null,
    village: location || "Maharashtra, India",
    vendorSlug: v?.slug || null,
    image: p.product_images?.[0]?.file_url || FALLBACK_IMG,
    images: (p.product_images || []).slice(0, 3).map((i) => i.file_url).filter(Boolean),
    description: stripHtml(p.description || p.short_description || "").slice(0, 1500),
    variants: variantsByProduct.get(p.id) || [],
    inStock: p.stock_status !== "outofstock",
    featured: !!p.featured,
    tags,
  });
}

// categories ordered by product count, only those with >= 3 products
const categories = [...rootCount.entries()]
  .filter(([, n]) => n >= 3)
  .sort((a, b) => b[1] - a[1])
  .map(([name, n]) => ({ name, count: n }));

const meta = {
  source: "shgeshop.com",
  fetchedAt: new Date().toISOString(),
  totalProducts: out.length,
  categories,
};

fs.mkdirSync("Frontend/src/data", { recursive: true });
fs.writeFileSync(
  "Frontend/src/data/shgCatalog.json",
  JSON.stringify({ meta, products: out })
);

const sizeMB = (fs.statSync("Frontend/src/data/shgCatalog.json").size / 1024 / 1024).toFixed(2);
console.log(`written: Frontend/src/data/shgCatalog.json (${sizeMB} MB)`);
console.log(`products: ${out.length} | dropped duplicate slugs: ${noSlug}`);
console.log("categories:", JSON.stringify(categories));
const withImg = out.filter((p) => p.image !== FALLBACK_IMG).length;
const withDesc = out.filter((p) => p.description).length;
const withVariants = out.filter((p) => p.variants.length > 0).length;
const withVendor = out.filter((p) => p.shgName !== "SHG e-shop Collective").length;
console.log(`coverage: images ${withImg}/${out.length}, descriptions ${withDesc}, variants ${withVariants}, vendor ${withVendor}`);
const noDesc = out.filter((p) => !p.description).slice(0, 3).map((p) => p.name);
console.log("sample missing desc:", noDesc.join(" | "));
