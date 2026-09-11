// Resilient ImageTile using direct high-resolution photo CDN
const KEYWORD_MAP = {
  carpenter: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
  tailor: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=600&q=80",
  electrician: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
  cook: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80",
  caterer: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80",
  farm: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80",
  artisan: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80",
  handicraft: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80",
  plumb: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=600&q=80",
  clean: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
  shg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
  group: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
  community: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
  village: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80",
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80";

function resolveImage(keywords) {
  if (!keywords) return DEFAULT_IMAGE;
  const kw = String(keywords).toLowerCase();
  for (const [key, url] of Object.entries(KEYWORD_MAP)) {
    if (kw.includes(key)) return url;
  }
  return DEFAULT_IMAGE;
}

export default function ImageTile({ keywords, alt, className = "", seed }) {
  const src = resolveImage(keywords);

  return (
    <img
      src={src}
      alt={alt || "Karya Service"}
      loading="lazy"
      className={`object-cover bg-olive-100 dark:bg-olive-950/40 ${className}`}
      onError={(e) => {
        e.currentTarget.src = DEFAULT_IMAGE;
      }}
    />
  );
}
