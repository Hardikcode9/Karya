import { useState } from "react";
import { X, Package, Loader2 } from "lucide-react";
import api from "../../utils/api";
import { useToast } from "../../hooks/useToast";

export default function AddProductModal({ isOpen, onClose, onProductAdded }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "Craft",
    price: "",
    stock: "",
    description: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/shg/products", {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      });
      toast.success("Product added successfully");
      onProductAdded();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-dark-card rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
        <div className="p-5 border-b border-charcoal/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-olive-100 flex items-center justify-center">
              <Package size={16} className="text-olive-700" />
            </div>
            <h3 className="font-bold text-lg">Add New Product</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-charcoal/5">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-charcoal/60 mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-charcoal/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-olive-500/20"
              placeholder="e.g. Handmade Bamboo Basket"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal/60 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-charcoal/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-olive-500/20"
              >
                <option value="Craft">Craft</option>
                <option value="Food">Food</option>
                <option value="Textile">Textile</option>
                <option value="Art">Art</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal/60 mb-1">Price (₹)</label>
              <input
                type="number"
                name="price"
                required
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-charcoal/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-olive-500/20"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal/60 mb-1">Stock Quantity</label>
            <input
              type="number"
              name="stock"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-charcoal/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-olive-500/20"
              placeholder="10"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal/60 mb-1">Description</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-charcoal/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-olive-500/20 resize-none"
              placeholder="Describe the product..."
            ></textarea>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-olive-700 hover:bg-olive-800 text-white font-bold rounded-xl text-sm flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
