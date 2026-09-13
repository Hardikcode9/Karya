import { useState, useEffect } from "react";
import { X, Users, Loader2 } from "lucide-react";
import api from "../../utils/api";
import { useToast } from "../../hooks/useToast";

export default function AddMemberModal({ isOpen, onClose, onMemberAdded }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [availableWorkers, setAvailableWorkers] = useState([]);
  const [fetchingWorkers, setFetchingWorkers] = useState(false);
  
  const [formData, setFormData] = useState({
    workerId: "",
    memberRole: "member",
  });

  useEffect(() => {
    if (isOpen) {
      fetchWorkers();
    }
  }, [isOpen]);

  const fetchWorkers = async () => {
    setFetchingWorkers(true);
    try {
      // In a real app, you might have an endpoint to get all workers or search workers by location.
      // We will try fetching from /workers which is public
      const response = await api.get("/workers/all"); 
      setAvailableWorkers(response.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setFetchingWorkers(false);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.workerId) {
      return toast.error("Please select a worker");
    }
    
    setLoading(true);
    try {
      await api.post("/shg/members", formData);
      toast.success("Member added successfully");
      onMemberAdded();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add member");
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
              <Users size={16} className="text-olive-700" />
            </div>
            <h3 className="font-bold text-lg">Add New Member</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-charcoal/5">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-charcoal/60 mb-1">Select Worker</label>
            <select
              name="workerId"
              required
              value={formData.workerId}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-charcoal/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-olive-500/20"
              disabled={fetchingWorkers}
            >
              <option value="">Select a worker...</option>
              {availableWorkers.map((w) => (
                <option key={w._id} value={w._id}>
                  {w.user?.name || "Unknown Worker"} - {w.user?.phone || "No phone"} ({w.service?.name || "General"})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal/60 mb-1">Role</label>
            <select
              name="memberRole"
              value={formData.memberRole}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-charcoal/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-olive-500/20"
            >
              <option value="member">Member</option>
              <option value="coordinator">Coordinator</option>
              <option value="leader">Leader</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || fetchingWorkers}
              className="w-full py-3 bg-olive-700 hover:bg-olive-800 text-white font-bold rounded-xl text-sm flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
