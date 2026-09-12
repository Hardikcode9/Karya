// Service Image Registry
// Curated, high-resolution photography for every village trade, artisan craft, and community service.

export const DEFAULT_SERVICE_IMAGE =
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80";

export const SERVICE_IMAGES = {
  // Individual Trade Services
  plumbing:
    "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=600&q=80",
  electrical:
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
  carpentry:
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
  cleaning:
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
  construction:
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
  farming:
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80",
  "farming help":
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80",
  "farming-help":
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80",
  transportation:
    "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80",
  household:
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
  "household work":
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
  "household-work":
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",

  // SHG Women Collective Services & Products
  tailoring:
    "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=600&q=80",
  handicrafts:
    "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80",
  catering:
    "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80",
  pickles:
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80",
  papad:
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
  "food-products":
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
  "food products":
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
  "local-products":
    "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
  "local products":
    "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",

  // Community & Agriculture Services
  "agriculture-assist":
    "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80",
  "agricultural assistance":
    "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80",
  repair:
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
  "repair services":
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
  "event-assist":
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
  "event assistance":
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
  logistics:
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
  "local logistics":
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
  seasonal:
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80",
  "seasonal work":
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80",
  gardening:
    "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80",
};

/**
 * Returns the relevant, high-resolution image URL for a given service object.
 * Searches by explicit image property, id, name, and trade category keywords.
 */
export function getServiceImage(service) {
  if (!service) return DEFAULT_SERVICE_IMAGE;

  // 1. Direct explicit image on the service object
  if (service.image && typeof service.image === "string" && service.image.startsWith("http")) {
    return service.image;
  }

  // 2. Lookup by id
  const idKey = String(service.id || "").toLowerCase().trim();
  if (idKey && SERVICE_IMAGES[idKey]) {
    return SERVICE_IMAGES[idKey];
  }

  // 3. Lookup by name
  const nameKey = String(service.name || "").toLowerCase().trim();
  if (nameKey && SERVICE_IMAGES[nameKey]) {
    return SERVICE_IMAGES[nameKey];
  }

  // 4. Fuzzy match against dictionary keys
  const lookupString = `${idKey} ${nameKey}`.toLowerCase();
  for (const [key, url] of Object.entries(SERVICE_IMAGES)) {
    if (lookupString.includes(key) || key.includes(lookupString)) {
      return url;
    }
  }

  // 5. Category-based fallback
  const cat = String(service.category || "").toLowerCase();
  if (cat.includes("repair") || cat.includes("home")) return SERVICE_IMAGES.carpentry;
  if (cat.includes("farm") || cat.includes("agri")) return SERVICE_IMAGES.farming;
  if (cat.includes("shg") || cat.includes("craft")) return SERVICE_IMAGES.handicrafts;
  if (cat.includes("food")) return SERVICE_IMAGES["food products"];
  if (cat.includes("logistics") || cat.includes("transport")) return SERVICE_IMAGES.transportation;

  return DEFAULT_SERVICE_IMAGE;
}
