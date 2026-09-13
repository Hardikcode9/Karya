import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Users, Search, ShieldCheck, MapPin, Building2, UserCheck, CheckCircle2, XCircle
} from "lucide-react";
import { useToast } from "../../hooks/useToast";
import api from "../../utils/api";

export default function SHGMembers() {
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const actionParam = searchParams.get("action");

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await api.get("/shg/members");
      setMembers(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch SHG members");
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter((m) => {
    const name = m.worker?.user?.name || "";
    const phone = m.worker?.user?.phone || "";
    const role = m.memberRole || "";

    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      phone.includes(search) ||
      role.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" ? m.isActive : !m.isActive);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal dark:text-dark-text flex items-center gap-2">
            <Users size={28} className="text-olive-700 dark:text-olive-500" />
            Member Directory
          </h2>
          <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted mt-1">
            Manage your collective's active workforce and skills.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border rounded-2xl shadow-xs p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex bg-charcoal/5 dark:bg-dark-surface p-1 rounded-xl w-full sm:w-auto">
          {["all", "active", "inactive"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[11px] font-bold capitalize transition-all ${
                statusFilter === tab
                  ? "bg-white dark:bg-dark-card text-charcoal dark:text-dark-text shadow-sm"
                  : "text-charcoal/50 hover:text-charcoal"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
          <input
            type="text"
            placeholder="Search by name, phone or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-charcoal/5 dark:bg-dark-surface rounded-xl text-xs outline-none focus:ring-2 focus:ring-olive-500/20"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-3xl border border-charcoal/10 dark:border-dark-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-charcoal/50">Loading members...</div>
          ) : filteredMembers.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-charcoal/5 flex items-center justify-center mb-3">
                <Users size={24} className="text-charcoal/20" />
              </div>
              <p className="font-bold text-charcoal dark:text-dark-text">No members found</p>
              <p className="text-xs text-charcoal/50 mt-1">Try a different search term.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal/5 dark:bg-dark-surface border-b border-charcoal/10 dark:border-dark-border text-[11px] uppercase font-bold text-charcoal/60 dark:text-dark-muted tracking-wider">
                <tr>
                  <th className="py-4 px-5">Member Name</th>
                  <th className="py-4 px-5">Role &amp; Skills</th>
                  <th className="py-4 px-5">Contact &amp; Location</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5 dark:divide-dark-border">
                {filteredMembers.map((member) => (
                  <tr key={member._id} className="hover:bg-charcoal/2 dark:hover:bg-dark-surface/50 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-olive-100 dark:bg-olive-900/30 text-olive-800 dark:text-olive-400 font-bold flex flex-col items-center justify-center shrink-0">
                          {member.worker?.user?.name?.charAt(0) || "M"}
                        </div>
                        <div>
                          <p className="font-bold text-charcoal dark:text-dark-text">
                            {member.worker?.user?.name || "Unknown Member"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <p className="font-bold text-charcoal dark:text-dark-text">{member.memberRole || "Artisan"}</p>
                    </td>
                    <td className="py-4 px-5">
                      <p className="text-charcoal dark:text-dark-text font-bold flex items-center gap-1.5 mb-1">
                        {member.worker?.user?.phone || "N/A"}
                      </p>
                      <p className="text-[10px] text-charcoal/60 flex items-center gap-1">
                        <MapPin size={10} />
                        {member.worker?.user?.village || "Village"}, {member.worker?.user?.district || "District"}
                      </p>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        member.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {member.isActive ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                        {member.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right text-charcoal/60">
                      {new Date(member.joinedAt).toLocaleDateString()}
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
