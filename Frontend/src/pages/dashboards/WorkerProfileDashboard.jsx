import { useState } from "react";
import {
  User, Phone, Mail, MapPin, Wrench, ShieldCheck, CheckCircle2,
  Upload, Camera, IndianRupee, Clock, Award, Save, Building,
  Sparkles, AlertCircle, Plus, X, Tag, FileText, Check, Star
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

export default function WorkerProfileDashboard() {
  const { user } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || "Sunita Devi",
    role: "Master Tailor & Embroidery Specialist",
    phone: user?.phone || "+91 98765 11002",
    altPhone: "+91 94150 99812",
    email: user?.email || "sunita.devi@karya.app",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    // Location
    village: user?.village || "Rampura Gram Panchayat",
    block: "Sadar Block",
    district: "Gorakhpur",
    state: "Uttar Pradesh",
    pincode: "273001",
    // Work Details
    experienceYears: 11,
    baseRate: 350,
    rateUnit: "piece",
    emergencyFee: 150,
    workRadiusKm: 12,
    availability: "Mon - Sat: 09:00 AM - 07:00 PM",
    bio: "Runs a small tailoring and pit-loom corner from home. Certified specialist in bulk school uniform stitching, designer zari blouses, and traditional dress alteration. Proud member of Maa Lakshmi Women SHG.",
    skills: ["Blouse Stitching", "Alterations", "Embroidery", "School Uniforms", "Pit-Loom Weaving"],
    // KYC Details
    aadhaarNumber: "•••• •••• 6192",
    aadhaarVerified: true,
    skillCertificate: "PM Vishwakarma Artisan Certificate #VSH-9281",
    skillVerified: true,
    shgAffiliation: "Maa Lakshmi Women SHG (Panchayat Reg #SHG-041)",
    shgVerified: true,
    // Banking & UPI
    upiId: "sunita.devi@sbi",
    bankName: "State Bank of India (SBI Rampur Branch)",
    accountNumber: "••••••••4819",
    ifsc: "SBIN0001248",
  });

  const [newSkill, setNewSkill] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim() || formData.skills.includes(newSkill.trim())) return;
    setFormData((prev) => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
    setNewSkill("");
    toast.show("New skill added!", "info");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsEditing(false);
    toast.show("Worker profile & credentials saved successfully!", "success");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-charcoal dark:text-dark-text font-bold">
            Worker Profile &amp; KYC Verification
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted mt-1">
            Manage your public trade bio, service rates, village address, and verified documents.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className={`inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl font-bold text-xs sm:text-sm transition-all border shadow-sm cursor-pointer ${
            isEditing
              ? "bg-white dark:bg-dark-card border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text"
              : "bg-olive-700 hover:bg-olive-800 text-white border-olive-800/20"
          }`}
        >
          {isEditing ? <X size={15} /> : <Wrench size={15} />}
          <span>{isEditing ? "Exit Edit Mode" : "Edit Profile Details"}</span>
        </button>
      </div>

      {/* WORKER HERO PROFILE CARD */}
      <div className="bg-cream-card dark:bg-dark-card rounded-[2.5rem] p-6 sm:p-8 border border-charcoal/10 dark:border-dark-border shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center gap-6 lg:gap-8">
          {/* Avatar with Verified Ring */}
          <div className="relative shrink-0 self-start md:self-auto">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-olive-700/30 shadow-md">
              <img
                src={formData.photo}
                alt={formData.name}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => toast.show("Photo update simulator: please select image", "info")}
              className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-olive-700 text-white shadow-md hover:bg-olive-800 transition-transform active:scale-95 cursor-pointer"
              title="Change Photo"
            >
              <Camera size={14} />
            </button>
          </div>

          {/* Profile Quick Summary */}
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal dark:text-dark-text">
                  {formData.name}
                </h2>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-500/20">
                  <ShieldCheck size={13} className="text-emerald-600" />
                  <span>Verified Specialist Worker</span>
                </span>
              </div>
              <p className="text-sm font-semibold text-olive-800 dark:text-olive-300 mt-0.5">
                {formData.role} • {formData.village}, {formData.district}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-charcoal/70 dark:text-dark-muted font-medium">
              <span className="flex items-center gap-1 text-amber-500 font-bold">
                <Star size={13} className="fill-amber-400" /> 4.9 (38 Reviews)
              </span>
              <span>•</span>
              <span>203 Jobs Completed</span>
              <span>•</span>
              <span>{formData.experienceYears} Years Experience</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin size={13} /> {formData.workRadiusKm} km Radius
              </span>
            </div>

            {/* Verification Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-3 py-1 rounded-full bg-cream dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-[11px] font-semibold text-charcoal/80 dark:text-dark-muted flex items-center gap-1">
                <CheckCircle2 size={12} className="text-emerald-600" /> Phone Verified
              </span>
              <span className="px-3 py-1 rounded-full bg-cream dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-[11px] font-semibold text-charcoal/80 dark:text-dark-muted flex items-center gap-1">
                <CheckCircle2 size={12} className="text-emerald-600" /> Aadhaar KYC Approved
              </span>
              <span className="px-3 py-1 rounded-full bg-cream dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-[11px] font-semibold text-charcoal/80 dark:text-dark-muted flex items-center gap-1">
                <CheckCircle2 size={12} className="text-emerald-600" /> SHG Endorsed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FORM: EDIT / VIEW WORKER PROFILE */}
      <form onSubmit={handleSaveProfile} className="space-y-8">
        {/* Section 1: Personal & Contact Information */}
        <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-6 sm:p-7 border border-charcoal/10 dark:border-dark-border shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-charcoal/10 dark:border-dark-border">
            <User size={18} className="text-olive-700 dark:text-olive-400" />
            <h3 className="font-display text-lg font-bold text-charcoal dark:text-dark-text">
              1. Personal &amp; Contact Details
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1.5 block">
                Full Legal Name
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white dark:bg-dark-surface rounded-xl px-4 py-2.5 text-xs text-charcoal dark:text-dark-text font-medium outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 disabled:opacity-75"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1.5 block">
                Phone Number (Primary)
              </label>
              <input
                type="tel"
                disabled={!isEditing}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white dark:bg-dark-surface rounded-xl px-4 py-2.5 text-xs text-charcoal dark:text-dark-text font-mono outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 disabled:opacity-75"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1.5 block">
                Alternative Family Phone
              </label>
              <input
                type="tel"
                disabled={!isEditing}
                value={formData.altPhone}
                onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                className="w-full bg-white dark:bg-dark-surface rounded-xl px-4 py-2.5 text-xs text-charcoal dark:text-dark-text font-mono outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 disabled:opacity-75"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1.5 block">
                Email Address
              </label>
              <input
                type="email"
                disabled={!isEditing}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white dark:bg-dark-surface rounded-xl px-4 py-2.5 text-xs text-charcoal dark:text-dark-text outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 disabled:opacity-75"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1.5 block">
                Gram Panchayat &amp; Village
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="w-full bg-white dark:bg-dark-surface rounded-xl px-4 py-2.5 text-xs text-charcoal dark:text-dark-text outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 disabled:opacity-75"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1.5 block">
                District, State &amp; Pincode
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={`${formData.district}, ${formData.state} - ${formData.pincode}`}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full bg-white dark:bg-dark-surface rounded-xl px-4 py-2.5 text-xs text-charcoal dark:text-dark-text outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 disabled:opacity-75"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Trade Skills, Rates & Availability */}
        <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-6 sm:p-7 border border-charcoal/10 dark:border-dark-border shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-charcoal/10 dark:border-dark-border">
            <Wrench size={18} className="text-olive-700 dark:text-olive-400" />
            <h3 className="font-display text-lg font-bold text-charcoal dark:text-dark-text">
              2. Trade Skills, Rates &amp; Work Radius
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1.5 block">
                Base Service Rate
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/50 text-xs font-bold">₹</span>
                <input
                  type="number"
                  disabled={!isEditing}
                  value={formData.baseRate}
                  onChange={(e) => setFormData({ ...formData, baseRate: Number(e.target.value) })}
                  className="w-full bg-white dark:bg-dark-surface rounded-xl pl-8 pr-4 py-2.5 text-xs text-charcoal dark:text-dark-text font-bold outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 disabled:opacity-75"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1.5 block">
                Rate Unit
              </label>
              <select
                disabled={!isEditing}
                value={formData.rateUnit}
                onChange={(e) => setFormData({ ...formData, rateUnit: e.target.value })}
                className="w-full bg-white dark:bg-dark-surface rounded-xl px-3.5 py-2.5 text-xs text-charcoal dark:text-dark-text font-semibold outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 disabled:opacity-75"
              >
                <option value="piece">Per Piece / Uniform</option>
                <option value="visit">Per Service Visit</option>
                <option value="hour">Per Hour</option>
                <option value="day">Full Day Rate</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1.5 block">
                Emergency Visit Extra Fee
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/50 text-xs font-bold">₹</span>
                <input
                  type="number"
                  disabled={!isEditing}
                  value={formData.emergencyFee}
                  onChange={(e) => setFormData({ ...formData, emergencyFee: Number(e.target.value) })}
                  className="w-full bg-white dark:bg-dark-surface rounded-xl pl-8 pr-4 py-2.5 text-xs text-charcoal dark:text-dark-text font-bold outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 disabled:opacity-75"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1.5 block">
                Maximum Radius
              </label>
              <select
                disabled={!isEditing}
                value={formData.workRadiusKm}
                onChange={(e) => setFormData({ ...formData, workRadiusKm: Number(e.target.value) })}
                className="w-full bg-white dark:bg-dark-surface rounded-xl px-3.5 py-2.5 text-xs text-charcoal dark:text-dark-text font-semibold outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 disabled:opacity-75"
              >
                <option value={5}>5 km Village Radius</option>
                <option value={10}>10 km Block Radius</option>
                <option value={12}>12 km Cluster Radius</option>
                <option value={20}>20 km District Radius</option>
              </select>
            </div>
          </div>

          {/* Skills Management */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted block">
              Specialized Skills &amp; Services Offered
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {formData.skills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-dark-surface text-xs font-semibold text-charcoal dark:text-dark-text border border-charcoal/15 dark:border-dark-border"
                >
                  <span>{s}</span>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(s)}
                      className="text-charcoal/40 hover:text-rose-600 cursor-pointer"
                    >
                      <X size={13} />
                    </button>
                  )}
                </span>
              ))}

              {isEditing && (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    placeholder="Add new skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="bg-white dark:bg-dark-surface rounded-xl px-3 py-1.5 text-xs text-charcoal dark:text-dark-text outline-none border border-charcoal/20 focus:border-olive-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="p-1.5 rounded-xl bg-olive-700 text-white hover:bg-olive-800 cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Worker Bio */}
          <div>
            <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1.5 block">
              Public Bio &amp; Artisan Story
            </label>
            <textarea
              rows={3}
              disabled={!isEditing}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-white dark:bg-dark-surface rounded-xl p-3.5 text-xs text-charcoal dark:text-dark-text leading-relaxed outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 disabled:opacity-75"
            />
          </div>
        </div>

        {/* Section 3: Verified KYC Documents & SHG Link */}
        <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-6 sm:p-7 border border-charcoal/10 dark:border-dark-border shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-charcoal/10 dark:border-dark-border">
            <ShieldCheck size={18} className="text-olive-700 dark:text-olive-400" />
            <h3 className="font-display text-lg font-bold text-charcoal dark:text-dark-text">
              3. Verified KYC Documents &amp; SHG Link
            </h3>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {/* Aadhaar KYC */}
            <div className="p-4 rounded-2xl bg-white dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-charcoal dark:text-dark-text flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Aadhaar Identity</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Verified
                </span>
              </div>
              <p className="font-mono text-xs text-charcoal/70 dark:text-dark-muted">
                {formData.aadhaarNumber}
              </p>
              <p className="text-[10px] text-charcoal/50">Verified at Rampur Panchayat Desk</p>
            </div>

            {/* Skill Certificate */}
            <div className="p-4 rounded-2xl bg-white dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-charcoal dark:text-dark-text flex items-center gap-1.5">
                  <Award size={14} className="text-emerald-600" />
                  <span>Skill Certificate</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Govt Certified
                </span>
              </div>
              <p className="text-xs text-charcoal/70 dark:text-dark-muted font-medium">
                {formData.skillCertificate}
              </p>
              <p className="text-[10px] text-charcoal/50">NSDC Rural Livelihood Mission</p>
            </div>

            {/* SHG Affiliation */}
            <div className="p-4 rounded-2xl bg-white dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-charcoal dark:text-dark-text flex items-center gap-1.5">
                  <Building size={14} className="text-emerald-600" />
                  <span>SHG Collective</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Endorsed
                </span>
              </div>
              <p className="text-xs text-charcoal/70 dark:text-dark-muted font-medium">
                {formData.shgAffiliation}
              </p>
              <p className="text-[10px] text-charcoal/50">Eligible for SHG Batch Orders</p>
            </div>
          </div>
        </div>

        {/* Section 4: Daily UPI & Bank Payout Details */}
        <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-6 sm:p-7 border border-charcoal/10 dark:border-dark-border shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-charcoal/10 dark:border-dark-border">
            <IndianRupee size={18} className="text-olive-700 dark:text-olive-400" />
            <h3 className="font-display text-lg font-bold text-charcoal dark:text-dark-text">
              4. Direct Payout Banking &amp; UPI
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1.5 block">
                Direct UPI ID (Instant Payout)
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.upiId}
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                className="w-full bg-white dark:bg-dark-surface rounded-xl px-4 py-2.5 text-xs text-charcoal dark:text-dark-text font-mono font-bold outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 disabled:opacity-75"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1.5 block">
                Jan Dhan / Bank Name
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full bg-white dark:bg-dark-surface rounded-xl px-4 py-2.5 text-xs text-charcoal dark:text-dark-text outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 disabled:opacity-75"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1.5 block">
                Account Number &amp; IFSC
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={`${formData.accountNumber} (${formData.ifsc})`}
                className="w-full bg-white dark:bg-dark-surface rounded-xl px-4 py-2.5 text-xs text-charcoal dark:text-dark-text font-mono outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 disabled:opacity-75"
              />
            </div>
          </div>
        </div>

        {/* Save Button (when editing) */}
        {isEditing && (
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-charcoal/70 hover:text-charcoal cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-7 rounded-xl font-bold text-xs sm:text-sm bg-olive-700 hover:bg-olive-800 text-white shadow-sm border border-olive-800/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Save size={16} />
              <span>Save Worker Profile</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
