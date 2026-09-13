import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Users, Search, Plus, CheckCircle2, Phone, Mail, MapPin,
  Building2, ShieldCheck, Edit3, X, Sparkles, Award, UserCheck,
  Calendar, IndianRupee, HeartHandshake, Check, SlidersHorizontal,
  ExternalLink, Trash2, Eye, AlertTriangle, Camera, Upload,
  Briefcase, FileText, Image as ImageIcon
} from "lucide-react";
import { SHG_MEMBERS_DATA } from "../../data/shgDashboardData";
import Button from "../../components/ui/Button";

export default function SHGMembers() {
  const [searchParams] = useSearchParams();
  const actionParam = searchParams.get("action");

  const [members, setMembers] = useState(() => SHG_MEMBERS_DATA);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingMember, setEditingMember] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(actionParam === "add-member");
  const [toast, setToast] = useState(null);

  // New Member Form State with all requested fields
  const [newMember, setNewMember] = useState({
    name: "",
    photo: "",
    role: "",
    phone: "",
    email: "",
    villageWard: "",
    joiningDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    personalInfo: "",
    status: "active",
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (actionParam === "add-member") {
      setShowAddMemberModal(true);
    }
  }, [actionParam]);

  // Handle Photo Upload using FileReader for real-time local image preview
  const handlePhotoUpload = (file, isEdit = true) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("Photo must be less than 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      if (isEdit) {
        setEditingMember((prev) => ({ ...prev, photo: dataUrl }));
      } else {
        setNewMember((prev) => ({ ...prev, photo: dataUrl }));
      }
      showToast("Photo uploaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingMember) return;
    if (!editingMember.name || !editingMember.phone) {
      showToast("Please enter member name and phone number");
      return;
    }

    setMembers((prev) =>
      prev.map((m) =>
        m.id === editingMember.id
          ? {
              ...m,
              ...editingMember,
              title: `${editingMember.name} (${editingMember.role || "Artisan"})`,
              primaryCraft: editingMember.role || m.primaryCraft,
              subtitle: `${editingMember.role || m.role} · ${editingMember.villageWard || m.villageWard}`,
            }
          : m
      )
    );
    showToast(`Updated details for ${editingMember.name}`);
    setEditingMember(null);
  };

  const handleRemoveMember = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    showToast(`Member removed from active collective roster`);
    setMemberToDelete(null);
  };

  const handleCreateMember = (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.phone) {
      showToast("Please enter member name and contact phone");
      return;
    }

    const created = {
      id: `MEM-${String(members.length + 1).padStart(2, "0")}`,
      name: newMember.name,
      photo: newMember.photo || "",
      role: newMember.role || "Artisan Member",
      title: `${newMember.name} (${newMember.role || "Artisan"})`,
      phone: newMember.phone,
      email: newMember.email || `${newMember.name.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
      villageWard: newMember.villageWard || "Sonipur Village, Ashoknagar, MP",
      primaryCraft: newMember.role || "Handloom & Handicraft",
      skills: [newMember.role || "Handicraft", "Quality Inspection"],
      experience: "5+ Years",
      joiningDate: newMember.joiningDate || "13 Sep 2026",
      personalInfo: newMember.personalInfo || "Skilled artisan working with village collective.",
      status: newMember.status || "active",
      bankName: "State Bank of India (Sonipur Rural)",
      accountNumber: "XXXX-XXXX-1122",
      ifscCode: "SBIN0002148",
      aadhaarMasked: "XXXX-XXXX-" + Math.floor(1000 + Math.random() * 9000),
      nrlmId: `NRLM-MP-ASH-${String(members.length + 1).padStart(3, "0")}`,
      attendance: "100% Active",
      subtitle: `${newMember.role || "Artisan"} · ${newMember.villageWard}`,
      date: `Member since ${newMember.joiningDate || "Today"}`,
      user: `NRLM ID: MP-ASH-${String(members.length + 1).padStart(3, "0")}`,
    };

    setMembers((prev) => [created, ...prev]);
    setShowAddMemberModal(false);
    setNewMember({
      name: "",
      photo: "",
      role: "",
      phone: "",
      email: "",
      villageWard: "",
      joiningDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      personalInfo: "",
      status: "active",
    });
    showToast(`New member ${created.name} registered successfully!`);
  };

  const filteredMembers = members.filter((m) => {
    const matchesFilter =
      statusFilter === "all" || m.status === statusFilter;

    const query = search.toLowerCase();
    const matchesSearch =
      m.name.toLowerCase().includes(query) ||
      (m.role && m.role.toLowerCase().includes(query)) ||
      (m.phone && m.phone.toLowerCase().includes(query)) ||
      (m.villageWard && m.villageWard.toLowerCase().includes(query)) ||
      (m.personalInfo && m.personalInfo.toLowerCase().includes(query)) ||
      (m.nrlmId && m.nrlmId.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  // Avatar initial color generator
  const getAvatarBg = (idx) => {
    const colors = [
      "bg-purple-600/20 text-purple-700 dark:text-purple-300 border-purple-500/30",
      "bg-blue-600/20 text-blue-700 dark:text-blue-300 border-blue-500/30",
      "bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
      "bg-amber-600/20 text-amber-700 dark:text-amber-300 border-amber-500/30",
      "bg-rose-600/20 text-rose-700 dark:text-rose-300 border-rose-500/30",
    ];
    return colors[idx % colors.length];
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-charcoal text-cream text-xs font-bold shadow-elevation-3 border border-charcoal/20 flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <CheckCircle2 size={14} className="text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-charcoal/10 dark:border-dark-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-olive-100 dark:bg-olive-950/60 text-olive-800 dark:text-olive-300 text-[11px] font-bold mb-1.5">
            <Users size={12} />
            <span>NRLM Registered Federation Members Roster</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal dark:text-dark-text">
            SHG Group Members &amp; Artisans
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted mt-0.5">
            Manage all registered women artisans, craft roles, joining dates, and personal profile details.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            size="sm"
            onClick={() => setShowAddMemberModal(true)}
            className="flex items-center gap-1.5"
          >
            <Plus size={15} />
            <span>Add Member</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === "all"
                ? "bg-olive-800 text-cream shadow-xs"
                : "bg-cream/60 dark:bg-dark-surface text-charcoal/70 dark:text-dark-text hover:bg-cream"
            }`}
          >
            All Members ({members.length})
          </button>
          <button
            onClick={() => setStatusFilter("active")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === "active"
                ? "bg-olive-800 text-cream shadow-xs"
                : "bg-cream/60 dark:bg-dark-surface text-charcoal/70 dark:text-dark-text hover:bg-cream"
            }`}
          >
            Active ({members.filter((m) => m.status === "active").length})
          </button>
        </div>

        {/* Increased Size of Search Bar */}
        <div className="relative w-full sm:flex-1 sm:max-w-md md:max-w-lg lg:max-w-2xl">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search member, work, phone, location..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-sm text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600 shadow-xs placeholder:text-charcoal/40 dark:placeholder:text-dark-muted"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Members Roster Table Structure (Compact Rows) */}
      <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-elevation-1 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[960px]">
            <thead>
              <tr className="border-b border-charcoal/10 dark:border-dark-border bg-cream/50 dark:bg-dark-surface/80">
                <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-charcoal/60 dark:text-dark-muted">
                  ARTISAN / MEMBER
                </th>
                <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-charcoal/60 dark:text-dark-muted">
                  YOUR WORK
                </th>
                <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-charcoal/60 dark:text-dark-muted">
                  DATE OF JOINING
                </th>
                <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-charcoal/60 dark:text-dark-muted">
                  PHONE NO
                </th>
                <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-charcoal/60 dark:text-dark-muted">
                  STATUS
                </th>
                <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-charcoal/60 dark:text-dark-muted text-right">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5 dark:divide-dark-border text-xs">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-charcoal/50 dark:text-dark-muted">
                    No matching members found.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member, idx) => (
                  <tr
                    key={member.id}
                    className="hover:bg-cream/25 dark:hover:bg-dark-surface/50 transition-colors group"
                  >
                    {/* Column 1: Member Name & Photo / Avatar (Compact Size) */}
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        {member.photo ? (
                          <img
                            src={member.photo}
                            alt={member.name}
                            className="w-8 h-8 rounded-lg object-cover shrink-0 border border-charcoal/15 dark:border-dark-border shadow-xs"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              if (e.currentTarget.nextElementSibling) {
                                e.currentTarget.nextElementSibling.style.display = "flex";
                              }
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-8 h-8 rounded-lg font-display font-bold text-xs items-center justify-center shrink-0 border ${getAvatarBg(idx)} ${
                            member.photo ? "hidden" : "flex"
                          }`}
                        >
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs sm:text-sm text-charcoal dark:text-dark-text truncate">
                            {member.name}
                          </p>
                          <p className="text-[10px] text-charcoal/50 dark:text-dark-muted truncate flex items-center gap-1">
                            <MapPin size={10} className="text-amber-500 shrink-0" />
                            <span className="truncate">{member.villageWard || "Ashoknagar, MP"}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Your Work */}
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-olive-100 dark:bg-olive-950/60 text-olive-800 dark:text-olive-300 flex items-center justify-center shrink-0">
                          <Briefcase size={11} />
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-charcoal dark:text-dark-text truncate">
                            {member.role || member.primaryCraft || "Artisan"}
                          </p>
                          <p className="text-[10px] font-mono text-olive-700 dark:text-olive-400">
                            {member.nrlmId || "NRLM Verified"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Column 3: Date of Joining (Calendar Pill) */}
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-charcoal/5 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-[11px] font-semibold text-charcoal dark:text-dark-text">
                        <Calendar size={11} className="text-olive-700 dark:text-olive-400" />
                        <span>{member.joiningDate || "15 Jan 2024"}</span>
                      </span>
                    </td>

                    {/* Column 4: Phone No */}
                    <td className="px-4 py-2.5">
                      <a
                        href={`tel:${member.phone}`}
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-charcoal/80 dark:text-dark-text hover:text-olive-700 dark:hover:text-olive-400 transition-colors"
                      >
                        <Phone size={11} className="text-charcoal/40" />
                        <span>{member.phone}</span>
                      </a>
                    </td>

                    {/* Column 5: Status Pill Badge */}
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        member.status === "active"
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          member.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                        }`} />
                        {member.status === "active" ? "Active" : "On Leave"}
                      </span>
                    </td>

                    {/* Column 6: Actions Toolbar */}
                    <td className="px-4 py-2.5 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => setEditingMember({ ...member })}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25 text-[11px] font-bold transition-all active:scale-95 cursor-pointer"
                          title="Edit Member Details"
                        >
                          <Edit3 size={11} />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => setViewingMember(member)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-500/25 text-[11px] font-bold transition-all active:scale-95 cursor-pointer"
                          title="View Full Profile & Bank Record"
                        >
                          <Eye size={11} />
                          <span>View</span>
                        </button>

                        <button
                          onClick={() => setMemberToDelete(member)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/25 text-[11px] font-bold transition-all active:scale-95 cursor-pointer"
                          title="Remove Member from Group"
                        >
                          <Trash2 size={11} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal / Inspection Card */}
      {viewingMember && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-dark-card rounded-3xl p-6 sm:p-7 shadow-elevation-3 border border-charcoal/10 dark:border-dark-border space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-charcoal/10 dark:border-dark-border">
              <div className="flex items-center gap-3">
                {viewingMember.photo ? (
                  <img
                    src={viewingMember.photo}
                    alt={viewingMember.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-olive-600/30 shadow-xs"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-olive-700 text-cream font-display font-bold text-lg flex items-center justify-center">
                    {viewingMember.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-display text-lg font-bold text-charcoal dark:text-dark-text">
                    {viewingMember.name}
                  </h3>
                  <p className="text-xs text-olive-800 dark:text-olive-300 font-semibold">
                    {viewingMember.role} · {viewingMember.nrlmId || "NRLM Member"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingMember(null)}
                className="p-1.5 rounded-xl hover:bg-cream dark:hover:bg-dark-surface text-charcoal/50 hover:text-charcoal cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-cream/40 dark:bg-dark-surface/50 border border-charcoal/5 dark:border-dark-border">
                  <p className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted">Phone No</p>
                  <p className="font-mono font-bold text-charcoal dark:text-dark-text mt-0.5">{viewingMember.phone}</p>
                </div>
                <div className="p-3 rounded-2xl bg-cream/40 dark:bg-dark-surface/50 border border-charcoal/5 dark:border-dark-border">
                  <p className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted">Date of Joining</p>
                  <p className="font-bold text-olive-800 dark:text-olive-300 mt-0.5">{viewingMember.joiningDate || "15 Jan 2024"}</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-cream/40 dark:bg-dark-surface/50 border border-charcoal/5 dark:border-dark-border">
                <p className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted">Your Work</p>
                <p className="font-semibold text-charcoal dark:text-dark-text mt-0.5">{viewingMember.role || viewingMember.primaryCraft}</p>
              </div>

              <div className="p-3 rounded-2xl bg-cream/40 dark:bg-dark-surface/50 border border-charcoal/5 dark:border-dark-border">
                <p className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted">Your Location</p>
                <p className="font-medium text-charcoal dark:text-dark-text mt-0.5 flex items-center gap-1.5">
                  <MapPin size={12} className="text-amber-500 shrink-0" />
                  <span>{viewingMember.villageWard || "Not specified"}</span>
                </p>
              </div>

              {viewingMember.personalInfo && (
                <div className="p-3.5 rounded-2xl bg-cream/40 dark:bg-dark-surface/50 border border-charcoal/5 dark:border-dark-border space-y-1">
                  <p className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-dark-muted flex items-center gap-1">
                    <FileText size={11} className="text-olive-600" />
                    <span>Your Personal Info</span>
                  </p>
                  <p className="text-charcoal/80 dark:text-dark-text leading-relaxed">
                    {viewingMember.personalInfo}
                  </p>
                </div>
              )}

              {viewingMember.bankName && (
                <div className="p-3.5 rounded-2xl bg-olive-50 dark:bg-olive-950/40 border border-olive-200 dark:border-olive-800/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-olive-900 dark:text-olive-200 flex items-center gap-1.5">
                      <ShieldCheck size={13} className="text-emerald-600" />
                      <span>PFMS DBT Bank Record</span>
                    </span>
                    <span className="font-mono text-[11px] text-charcoal/70 dark:text-dark-muted">
                      IFSC: {viewingMember.ifscCode || "SBIN0002148"}
                    </span>
                  </div>
                  <p className="text-charcoal/70 dark:text-dark-muted text-[11px]">
                    {viewingMember.bankName} · A/c {viewingMember.accountNumber || "XXXX-XXXX-1122"}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-charcoal/10 dark:border-dark-border">
              <a
                href={`tel:${viewingMember.phone}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-olive-800 dark:text-olive-400 hover:underline"
              >
                <Phone size={13} />
                <span>Call Member</span>
              </a>
              <Button size="sm" variant="outline" onClick={() => setViewingMember(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-dark-card rounded-3xl p-6 shadow-elevation-3 border border-charcoal/10 dark:border-dark-border space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <span className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center">
                <AlertTriangle size={20} />
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-charcoal dark:text-dark-text">
                  Remove {memberToDelete.name}?
                </h3>
                <p className="text-xs text-charcoal/50 dark:text-dark-muted">
                  This will remove them from the active group roster.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button size="sm" variant="outline" onClick={() => setMemberToDelete(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => handleRemoveMember(memberToDelete.id)}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                Confirm Remove
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal (Features Upload Photo, Your Location, Your Work, Date of Joining, Phone No, Your Personal Info) */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden">
          <div className="w-full max-w-lg max-h-[92vh] bg-white dark:bg-dark-card rounded-3xl shadow-elevation-3 border border-charcoal/10 dark:border-dark-border flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Header (Fixed at top) */}
            <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-charcoal/10 dark:border-dark-border shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-olive-100 dark:bg-olive-950 text-olive-800 dark:text-olive-300 flex items-center justify-center">
                  <Edit3 size={16} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-charcoal dark:text-dark-text leading-tight">
                    Edit Member Profile
                  </h3>
                  <p className="text-xs text-charcoal/50 dark:text-dark-muted mt-0.5">
                    Update artisan photo, work, location, joining date &amp; personal information
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingMember(null)}
                className="p-1.5 rounded-xl hover:bg-cream dark:hover:bg-dark-surface text-charcoal/50 hover:text-charcoal cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="edit-member-form" onSubmit={handleSaveEdit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
              {/* 1. UPLOAD PHOTO SECTION */}
              <div className="p-4 rounded-2xl bg-cream/40 dark:bg-dark-surface/60 border border-charcoal/10 dark:border-dark-border space-y-3">
                <label className="block font-bold text-charcoal/90 dark:text-dark-text flex items-center gap-1.5">
                  <Camera size={14} className="text-olive-700 dark:text-olive-400" />
                  <span>Upload Photo</span>
                </label>

                <div className="flex items-center gap-4">
                  <div className="relative group">
                    {editingMember.photo ? (
                      <img
                        src={editingMember.photo}
                        alt="Member Preview"
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-olive-600 shadow-xs"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-olive-700/20 text-olive-800 dark:text-olive-300 font-display font-bold text-xl flex items-center justify-center border border-olive-500/30">
                        {editingMember.name ? editingMember.name.charAt(0).toUpperCase() : "M"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="edit-photo-input"
                        className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-olive-800 text-cream hover:bg-olive-900 text-xs font-bold transition-all active:scale-95 shadow-xs"
                      >
                        <Upload size={12} />
                        <span>Upload Photo</span>
                      </label>
                      <input
                        id="edit-photo-input"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(e.target.files?.[0], true)}
                        className="hidden"
                      />

                      {editingMember.photo && (
                        <button
                          type="button"
                          onClick={() => setEditingMember((prev) => ({ ...prev, photo: "" }))}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-bold border border-rose-500/20 transition-all cursor-pointer"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-charcoal/50 dark:text-dark-muted">
                      JPG, PNG, WebP up to 5MB. Photo updates immediately in real-time.
                    </p>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingMember.name || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  placeholder="e.g. Sunita Devi"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600"
                />
              </div>

              {/* 2. YOUR WORK */}
              <div>
                <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1 flex items-center gap-1.5">
                  <Briefcase size={12} className="text-olive-700 dark:text-olive-400" />
                  <span>Your Work *</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingMember.role || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value, primaryCraft: e.target.value })}
                  placeholder="e.g. Chanderi Pit-Loom Weaving, Forest Honey Lead, Terracotta Pottery"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600"
                />
              </div>

              {/* 3. YOUR LOCATION */}
              <div>
                <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1 flex items-center gap-1.5">
                  <MapPin size={12} className="text-amber-500" />
                  <span>Your Location *</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingMember.villageWard || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, villageWard: e.target.value })}
                  placeholder="e.g. Sonipur Village, Ward No. 4, Ashoknagar, MP"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600"
                />
              </div>

              {/* 4. DATE OF JOINING & 5. PHONE NO (Grid 2 cols) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1 flex items-center gap-1.5">
                    <Calendar size={12} className="text-olive-700 dark:text-olive-400" />
                    <span>Date of Joining *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember.joiningDate || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, joiningDate: e.target.value })}
                    placeholder="e.g. 15 Jan 2024"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1 flex items-center gap-1.5">
                    <Phone size={12} className="text-charcoal/50" />
                    <span>Phone No *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember.phone || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600 font-mono"
                  />
                </div>
              </div>

              {/* 6. YOUR PERSONAL INFO */}
              <div>
                <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1 flex items-center gap-1.5">
                  <FileText size={12} className="text-olive-700 dark:text-olive-400" />
                  <span>Your Personal Info</span>
                </label>
                <textarea
                  rows={3}
                  value={editingMember.personalInfo || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, personalInfo: e.target.value })}
                  placeholder="Enter artisan background, years of experience, family craft heritage, training, and achievements..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600 resize-none leading-relaxed"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1">
                  Active Status
                </label>
                <select
                  value={editingMember.status}
                  onChange={(e) => setEditingMember({ ...editingMember, status: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600"
                >
                  <option value="active">Active Member</option>
                  <option value="on leave">On Leave</option>
                </select>
              </div>
            </form>

            {/* Footer Buttons (Fixed at bottom) */}
            <div className="p-4 px-6 border-t border-charcoal/10 dark:border-dark-border flex items-center justify-end gap-3 shrink-0 bg-cream/20 dark:bg-dark-surface/40">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditingMember(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="edit-member-form"
                size="sm"
                className="bg-olive-800 text-cream cursor-pointer"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal (With Upload Photo, Your Location, Your Work, Date of Joining, Phone No, Your Personal Info) */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden">
          <div className="w-full max-w-lg max-h-[92vh] bg-white dark:bg-dark-card rounded-3xl shadow-elevation-3 border border-charcoal/10 dark:border-dark-border flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Header (Fixed at top) */}
            <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-charcoal/10 dark:border-dark-border shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-olive-100 dark:bg-olive-950 text-olive-800 dark:text-olive-300 flex items-center justify-center">
                  <Users size={16} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-charcoal dark:text-dark-text leading-tight">
                    Register New Artisan Member
                  </h3>
                  <p className="text-xs text-charcoal/50 dark:text-dark-muted mt-0.5">
                    Enroll a village woman artisan with photo, location &amp; craft work
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="p-1.5 rounded-xl hover:bg-cream dark:hover:bg-dark-surface text-charcoal/50 hover:text-charcoal cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="add-member-form" onSubmit={handleCreateMember} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
              {/* Photo Upload */}
              <div className="p-4 rounded-2xl bg-cream/40 dark:bg-dark-surface/60 border border-charcoal/10 dark:border-dark-border space-y-3">
                <label className="block font-bold text-charcoal/90 dark:text-dark-text flex items-center gap-1.5">
                  <Camera size={14} className="text-olive-700 dark:text-olive-400" />
                  <span>Upload Photo</span>
                </label>

                <div className="flex items-center gap-4">
                  {newMember.photo ? (
                    <img
                      src={newMember.photo}
                      alt="New Member"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-olive-600 shadow-xs"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-olive-700/20 text-olive-800 dark:text-olive-300 font-display font-bold text-xl flex items-center justify-center border border-olive-500/30">
                      {newMember.name ? newMember.name.charAt(0).toUpperCase() : "+"}
                    </div>
                  )}

                  <div className="space-y-1.5 flex-1">
                    <label
                      htmlFor="add-photo-input"
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-olive-800 text-cream hover:bg-olive-900 text-xs font-bold transition-all active:scale-95 shadow-xs"
                    >
                      <Upload size={12} />
                      <span>Upload Photo</span>
                    </label>
                    <input
                      id="add-photo-input"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e.target.files?.[0], false)}
                      className="hidden"
                    />
                    <p className="text-[10px] text-charcoal/50 dark:text-dark-muted">
                      JPG, PNG, WebP up to 5MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1">
                  Artisan Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="e.g. Parvati Bai"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600"
                />
              </div>

              {/* Your Work */}
              <div>
                <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1 flex items-center gap-1.5">
                  <Briefcase size={12} className="text-olive-700 dark:text-olive-400" />
                  <span>Your Work *</span>
                </label>
                <input
                  type="text"
                  required
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  placeholder="e.g. Handloom Weaver, Bamboo Artisan, Pottery"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600"
                />
              </div>

              {/* Your Location */}
              <div>
                <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1 flex items-center gap-1.5">
                  <MapPin size={12} className="text-amber-500" />
                  <span>Your Location *</span>
                </label>
                <input
                  type="text"
                  required
                  value={newMember.villageWard}
                  onChange={(e) => setNewMember({ ...newMember, villageWard: e.target.value })}
                  placeholder="e.g. Sonipur Village, Ward No. 3, Ashoknagar"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600"
                />
              </div>

              {/* Date of Joining & Phone No */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1 flex items-center gap-1.5">
                    <Calendar size={12} className="text-olive-700 dark:text-olive-400" />
                    <span>Date of Joining *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newMember.joiningDate}
                    onChange={(e) => setNewMember({ ...newMember, joiningDate: e.target.value })}
                    placeholder="e.g. 13 Sep 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1 flex items-center gap-1.5">
                    <Phone size={12} className="text-charcoal/50" />
                    <span>Phone No *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newMember.phone}
                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600 font-mono"
                  />
                </div>
              </div>

              {/* Your Personal Info */}
              <div>
                <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1 flex items-center gap-1.5">
                  <FileText size={12} className="text-olive-700 dark:text-olive-400" />
                  <span>Your Personal Info</span>
                </label>
                <textarea
                  rows={3}
                  value={newMember.personalInfo}
                  onChange={(e) => setNewMember({ ...newMember, personalInfo: e.target.value })}
                  placeholder="Enter artisan background, family craft heritage, specialization, experience, and notes..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600 resize-none leading-relaxed"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block font-bold text-charcoal/80 dark:text-dark-text mb-1">
                  Account Status
                </label>
                <select
                  value={newMember.status}
                  onChange={(e) => setNewMember({ ...newMember, status: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-cream/50 dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal dark:text-dark-text focus:outline-none focus:border-olive-600"
                >
                  <option value="active">Active &amp; Verified</option>
                  <option value="on leave">On Leave</option>
                </select>
              </div>
            </form>

            {/* Footer Buttons (Fixed at bottom) */}
            <div className="p-4 px-6 border-t border-charcoal/10 dark:border-dark-border flex items-center justify-end gap-3 shrink-0 bg-cream/20 dark:bg-dark-surface/40">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAddMemberModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="add-member-form"
                size="sm"
                className="bg-olive-800 text-cream cursor-pointer"
              >
                Register Member
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
