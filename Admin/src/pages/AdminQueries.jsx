import { useState, useMemo, useEffect } from "react";
import { MessageSquare, Search } from "lucide-react";
import { useToast } from "../hooks/useToast";
import api from "../utils/api";

export default function AdminQueries() {
  const toast = useToast();
  const [queriesList, setQueriesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const response = await api.get("/queries");
      setQueriesList(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch queries.");
    } finally {
      setLoading(false);
    }
  };

  const [search, setSearch] = useState("");

  const filteredQueries = useMemo(() => {
    return queriesList.filter((q) => {
      const customer = q.customer?.name || "";
      const worker = q.worker?.user?.name || "";
      const subject = q.subject || "";

      return (
        customer.toLowerCase().includes(search.toLowerCase()) ||
        worker.toLowerCase().includes(search.toLowerCase()) ||
        subject.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [queriesList, search]);

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-xs">
              <MessageSquare size={18} />
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal dark:text-dark-text">
              Grievance &amp; Query Desk
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted mt-1">
            Manage customer disputes, worker issues, and general support tickets.
          </p>
        </div>
      </div>

      {/* Aggregate Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-cream-card dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs">
          <span className="text-[11px] font-bold text-charcoal/50 dark:text-dark-muted uppercase tracking-wider block">Total Queries</span>
          <span className="font-display font-bold text-2xl text-charcoal dark:text-dark-text mt-1 block">{queriesList.length}</span>
        </div>
      </div>

      {/* Search Controls */}
      <div className="bg-cream-card dark:bg-dark-card rounded-2xl p-4 border border-charcoal/10 dark:border-dark-border shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-dark-muted" />
            <input
              type="text"
              placeholder="Search by subject, customer, or worker..."
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
            <div className="p-8 text-center text-sm text-charcoal/50">Loading queries...</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal/5 dark:bg-dark-surface border-b border-charcoal/10 dark:border-dark-border text-[11px] uppercase font-bold text-charcoal/60 dark:text-dark-muted tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Subject &amp; Details</th>
                  <th className="py-3.5 px-4">Raised By</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5 dark:divide-dark-border font-medium">
                {filteredQueries.map((query) => (
                  <tr key={query._id} className="hover:bg-charcoal/2 dark:hover:bg-dark-surface/50 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <span className="font-bold text-charcoal dark:text-dark-text block">
                        {query.subject}
                      </span>
                      <span className="text-[11px] text-charcoal/50">
                        {query.description.substring(0, 50)}...
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {query.customer ? (
                        <span className="font-bold text-amber-700">Customer: {query.customer.name}</span>
                      ) : query.worker ? (
                        <span className="font-bold text-blue-700">Worker: {query.worker.user?.name}</span>
                      ) : (
                        <span className="font-bold text-charcoal">Unknown</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        query.status === 'resolved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        <span className="capitalize">{query.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-charcoal/70">
                      {new Date(query.createdAt).toLocaleDateString()}
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
