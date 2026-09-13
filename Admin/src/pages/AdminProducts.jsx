import { useState, useMemo, useEffect } from "react";
import {
  Package, Search
} from "lucide-react";
import { useToast } from "../hooks/useToast";
import api from "../utils/api";

export default function AdminProducts() {
  const toast = useToast();
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProductsList(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const name = p.title || "";
      const shg = p.shg?.user?.name || "";
      const category = p.category || "";

      return (
        name.toLowerCase().includes(search.toLowerCase()) ||
        shg.toLowerCase().includes(search.toLowerCase()) ||
        category.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [productsList, search]);

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <Package size={18} />
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal dark:text-dark-text">
              SHG Product Catalog
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted mt-1">
            Global repository of artisan goods, food products, and rural crafts.
          </p>
        </div>
      </div>

      {/* Aggregate Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-cream-card dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs">
          <span className="text-[11px] font-bold text-charcoal/50 dark:text-dark-muted uppercase tracking-wider block">Total Products</span>
          <span className="font-display font-bold text-2xl text-charcoal dark:text-dark-text mt-1 block">{productsList.length}</span>
        </div>
      </div>

      {/* Search Controls */}
      <div className="bg-cream-card dark:bg-dark-card rounded-2xl p-4 border border-charcoal/10 dark:border-dark-border shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-dark-muted" />
            <input
              type="text"
              placeholder="Search by product name, category, or SHG group..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-surface rounded-xl text-xs sm:text-sm text-charcoal dark:text-dark-text border border-charcoal/15 dark:border-dark-border outline-none focus:border-olive-600 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Table View */}
      <div className="bg-cream-card dark:bg-dark-card rounded-3xl border border-charcoal/10 dark:border-dark-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-sm text-charcoal/50">Loading products...</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal/5 dark:bg-dark-surface border-b border-charcoal/10 dark:border-dark-border text-[11px] uppercase font-bold text-charcoal/60 dark:text-dark-muted tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Product Details</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">SHG Collective</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5 dark:divide-dark-border font-medium">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-charcoal/2 dark:hover:bg-dark-surface/50 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-charcoal/5 dark:bg-dark-surface overflow-hidden flex items-center justify-center shrink-0">
                          {product.images && product.images[0] ? (
                            <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                          ) : (
                            <Package size={16} className="text-charcoal/40" />
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-charcoal dark:text-dark-text block">
                            {product.title}
                          </span>
                          <span className="text-[11px] text-charcoal/50 dark:text-dark-muted">
                            {product.category}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-charcoal dark:text-dark-text">₹{product.price}</span>
                      {product.unit && <span className="text-[10px] text-charcoal/50 ml-1">/ {product.unit}</span>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-charcoal dark:text-dark-text">{product.stockQuantity || 0} in stock</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-olive-800 dark:text-olive-300">
                        {product.shg?.user?.name || "Unknown SHG"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
