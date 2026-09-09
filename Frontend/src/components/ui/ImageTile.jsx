// Lightweight wrapper around a themed placeholder image service so every
// image request stays consistent, lazy-loaded and rounded per the brief.
export default function ImageTile({ keywords, alt, className = "", seed }) {
  const query = encodeURIComponent(keywords);
  const src = `https://source.unsplash.com/${seed || "600x600"}/?${query}`;
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`object-cover bg-olive-100 ${className}`}
      onError={(e) => {
        e.currentTarget.src =
          "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Crect width='100%25' height='100%25' fill='%23E6EEDE'/%3E%3C/svg%3E";
      }}
    />
  );
}
