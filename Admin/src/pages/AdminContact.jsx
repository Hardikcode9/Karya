import { useState, useMemo, useEffect } from "react";
import { PhoneCall, Search } from "lucide-react";
import { useToast } from "../hooks/useToast";
import api from "../utils/api";

export default function AdminContact() {
  const toast = useToast();
  const [messagesList, setMessagesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get("/contact");
      setMessagesList(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch contact messages.");
    } finally {
      setLoading(false);
    }
  };

  const [search, setSearch] = useState("");

  const filteredMessages = useMemo(() => {
    return messagesList.filter((m) => {
      const name = m.name || "";
      const email = m.email || "";
      const message = m.message || "";
      
      return (
        name.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase()) ||
        message.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [messagesList, search]);

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <PhoneCall size={18} />
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal dark:text-dark-text">
              Contact Inquiries
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted mt-1">
            General inquiries from public users and potential partners.
          </p>
        </div>
      </div>

      {/* Aggregate Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-cream-card dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs">
          <span className="text-[11px] font-bold text-charcoal/50 dark:text-dark-muted uppercase tracking-wider block">Total Inquiries</span>
          <span className="font-display font-bold text-2xl text-charcoal dark:text-dark-text mt-1 block">{messagesList.length}</span>
        </div>
      </div>

      {/* Search Controls */}
      <div className="bg-cream-card dark:bg-dark-card rounded-2xl p-4 border border-charcoal/10 dark:border-dark-border shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-dark-muted" />
            <input
              type="text"
              placeholder="Search inquiries..."
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
            <div className="p-8 text-center text-sm text-charcoal/50">Loading inquiries...</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal/5 dark:bg-dark-surface border-b border-charcoal/10 dark:border-dark-border text-[11px] uppercase font-bold text-charcoal/60 dark:text-dark-muted tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Sender Details</th>
                  <th className="py-3.5 px-4">Message</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5 dark:divide-dark-border font-medium">
                {filteredMessages.map((item) => (
                  <tr key={item._id} className="hover:bg-charcoal/2 dark:hover:bg-dark-surface/50 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <span className="font-bold text-charcoal dark:text-dark-text block">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-charcoal/50">
                        {item.email}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-[200px] truncate">
                      {item.message}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'read' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        <span className="capitalize">{item.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-charcoal/70">
                      {new Date(item.createdAt).toLocaleDateString()}
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
