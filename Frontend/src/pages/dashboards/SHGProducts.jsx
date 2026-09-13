import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Package, Plus, Search, CheckCircle2,
  Edit3, Trash2, Tag, Eye,
  AlertTriangle, Star, Check
} from "lucide-react";
import { useToast } from "../../hooks/useToast";
import api from "../../utils/api";

export default function SHGProducts() {
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const actionParam = searchParams.get("action");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/shg/products");
      setProducts(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const title = p.title || "";
      const category = p.category || "";

      const matchesSearch = title.toLowerCase().includes(search.toLowerCase());
      const matchesCat = categoryFilter === "all" || category === categoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [products, search, categoryFilter]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        toast.success("Product deleted successfully");
        fetchProducts();
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal dark:text-dark-text flex items-center gap-2">
            <Package size={28} className="text-olive-700 dark:text-olive-500" />
            Product Catalog
          </h2>
          <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted mt-1">
            Manage your artisan goods and inventory.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border rounded-2xl shadow-xs p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex bg-charcoal/5 dark:bg-dark-surface p-1 rounded-xl w-full sm:w-auto">
          {["all", "Food", "Craft", "Textile"].map((tab) => (
            <button
              key={tab}
              onClick={() => setCategoryFilter(tab)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[11px] font-bold capitalize transition-all ${
                categoryFilter === tab
                  ? "bg-white dark:bg-dark-card text-charcoal dark:text-dark-text shadow-sm"
                  : "text-charcoal/50 hover:text-charcoal"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-charcoal/5 dark:bg-dark-surface rounded-xl text-xs outline-none focus:ring-2 focus:ring-olive-500/20"
            />
          </div>
          <button onClick={() => toast.info("Add product functionality coming soon")} className="shrink-0 flex items-center gap-2 bg-olive-700 hover:bg-olive-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors">
            <Plus size={16} />
            <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-3xl border border-charcoal/10 dark:border-dark-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-charcoal/50">Loading catalog...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-charcoal/5 flex items-center justify-center mb-3">
                <Package size={24} className="text-charcoal/20" />
              </div>
              <p className="font-bold text-charcoal dark:text-dark-text">No products found</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal/5 dark:bg-dark-surface border-b border-charcoal/10 dark:border-dark-border text-[11px] uppercase font-bold text-charcoal/60 dark:text-dark-muted tracking-wider">
                <tr>
                  <th className="py-4 px-5">Product Details</th>
                  <th className="py-4 px-5">Category &amp; Price</th>
                  <th className="py-4 px-5">Stock</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5 dark:divide-dark-border">
                {filteredProducts.map((prod) => (
                  <tr key={prod._id} className="hover:bg-charcoal/2 dark:hover:bg-dark-surface/50 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-charcoal/5 overflow-hidden flex items-center justify-center shrink-0">
                          {prod.images && prod.images[0] ? (
                            <img src={prod.images[0]} alt={prod.title} className="w-full h-full object-cover" />
                          ) : (
                            <Package size={16} className="text-charcoal/30" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-charcoal dark:text-dark-text">{prod.title}</p>
                          <p className="text-[10px] text-charcoal/50">{prod.description?.substring(0, 40)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <p className="font-bold text-charcoal dark:text-dark-text">₹{prod.price}</p>
                      <p className="text-[10px] text-charcoal/50">{prod.category}</p>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        prod.stockQuantity > 10 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {prod.stockQuantity > 10 ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
                        {prod.stockQuantity} in stock
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right space-x-1.5">
                      <button onClick={() => handleDelete(prod._id)} className="p-1.5 rounded-lg border border-charcoal/15 text-charcoal/70 hover:text-rose-600 hover:border-rose-200">
                        <Trash2 size={14} />
                      </button>
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
