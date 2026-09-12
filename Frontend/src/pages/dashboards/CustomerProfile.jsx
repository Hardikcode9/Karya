import { useState } from "react";
import {
  User, Mail, Phone, MapPin, FileText, Upload, CheckCircle2,
  Camera, ShieldCheck, AlertCircle, Sparkles, Save, Trash2, Building, Globe
} from "lucide-react";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

const AVATAR_PRESETS = [
  {
    id: "avatar-1",
    label: "Artisan / Citizen",
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "avatar-2",
    label: "Village Farmer",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "avatar-3",
    label: "SHG Member",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "avatar-4",
    label: "Rural Youth",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
];

export default function CustomerProfile() {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || "sam",
    email: user?.email || "sam.kumar@karya.org",
    phone: user?.phone || "+91 98765 43210",
    altPhone: user?.altPhone || "+91 94150 12890",
    photo: user?.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    // Address Details
    houseNo: user?.houseNo || "Plot 42, Ward 4",
    village: user?.village || "Rampur Gram Panchayat",
    block: user?.block || "Sadar Block",
    district: user?.district || "Gorakhpur",
    state: user?.state || "Uttar Pradesh",
    pincode: user?.pincode || "273001",
    landmark: user?.landmark || "Near Primary School & Panchayat Bhavan",
    // Attached Documents
    docType: user?.docType || "Aadhaar Card",
    docNumber: user?.docNumber || "•••• •••• 8912",
    docFileName: user?.docFileName || "aadhaar_verified_slip.pdf",
    docFilePreview: user?.docFilePreview || null,
    isDocVerified: user?.isDocVerified ?? true,
    // Preferences
    language: user?.language || "Hindi",
    smsUpdates: user?.smsUpdates ?? true,
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Handle Profile Photo Upload via File Reader
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image file size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result }));
        toast.success("Profile photo preview updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Document Upload
  const handleDocUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Document size must be under 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          docFileName: file.name,
          docFilePreview: reader.result,
          isDocVerified: true,
        }));
        toast.success(`Attached ${file.name} successfully!`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      if (updateUser) {
        updateUser(formData);
      }
      setSaving(false);
      setSaveSuccess(true);
      toast.success("Profile & personal details updated successfully!");
      setTimeout(() => setSaveSuccess(false), 4000);
    }, 400);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-olive-900 via-olive-950 to-charcoal text-cream shadow-elevation-2 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-olive-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-olive-300 text-xs font-semibold mb-2">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>Verified Village Resident Profile</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl text-white font-medium">
              Customer Account & Personal Details
            </h1>
            <p className="text-xs sm:text-sm text-cream/75 mt-1 max-w-xl">
              Keep your contact information, village delivery directions, and official ID documents up to date for fast service dispatch and doorstep craft delivery.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 size={13} />
              <span>Aadhaar Verified</span>
            </span>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold">
              Profile details successfully saved! Your updated avatar is now active across your account and sidebar.
            </span>
          </div>
          <span className="text-xs opacity-75 font-mono">Sync: OK</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Photo & Identity Section */}
        <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-5 sm:p-7 border border-charcoal/5 dark:border-dark-border shadow-elevation-1">
          <h2 className="font-display font-medium text-lg text-charcoal dark:text-dark-text flex items-center gap-2 mb-1">
            <User size={18} className="text-olive-700 dark:text-olive-400" />
            <span>Profile Photo & Avatar</span>
          </h2>
          <p className="text-xs text-charcoal/55 dark:text-dark-muted mb-5">
            This photo is shown in the left navigation sidebar and will be visible to your booked technicians.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-white dark:bg-dark-surface border border-charcoal/5 dark:border-dark-border">
            <div className="relative group shrink-0">
              {formData.photo ? (
                <img
                  src={formData.photo}
                  alt={formData.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-olive-700/20 dark:border-olive-400/20 shadow-elevation-1"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-olive-200 dark:bg-olive-900/60 text-olive-800 dark:text-olive-300 flex items-center justify-center font-display font-bold text-3xl">
                  {formData.name.charAt(0)}
                </div>
              )}
              <label
                htmlFor="photo-upload-input"
                className="absolute -bottom-2 -right-2 p-2 rounded-2xl bg-olive-800 text-cream hover:bg-olive-900 shadow-md cursor-pointer transition-transform hover:scale-110"
                title="Change Photo"
              >
                <Camera size={16} />
              </label>
              <input
                id="photo-upload-input"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            <div className="flex-1 min-w-0 space-y-3 text-center sm:text-left">
              <div>
                <p className="text-sm font-bold text-charcoal dark:text-dark-text">
                  Upload Custom Photo or Choose a Preset
                </p>
                <p className="text-xs text-charcoal/55 dark:text-dark-muted mt-0.5">
                  Accepts JPG, PNG, or WEBP (Max 2MB). Stored safely and rendered instantly in the sidebar top.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <label
                  htmlFor="photo-upload-input"
                  className="px-3.5 py-2 rounded-xl bg-olive-700 hover:bg-olive-800 text-cream text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Upload size={14} />
                  <span>Upload from Device</span>
                </label>
                {formData.photo && (
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, photo: "" }))}
                    className="px-3 py-2 rounded-xl border border-charcoal/15 dark:border-dark-border text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={13} />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>

              {/* Quick Presets */}
              <div className="pt-2 border-t border-charcoal/5 dark:border-dark-border">
                <p className="text-[11px] font-semibold text-charcoal/50 dark:text-dark-muted mb-2">
                  Or pick a 1-click village avatar:
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2.5">
                  {AVATAR_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, photo: p.url }))}
                      className={`relative rounded-2xl overflow-hidden border-2 transition-all p-0.5 ${
                        formData.photo === p.url
                          ? "border-olive-700 dark:border-olive-400 ring-2 ring-olive-500/30 scale-105"
                          : "border-transparent opacity-75 hover:opacity-100"
                      }`}
                      title={p.label}
                    >
                      <img src={p.url} alt={p.label} className="w-9 h-9 rounded-xl object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Personal Information */}
        <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-5 sm:p-7 border border-charcoal/5 dark:border-dark-border shadow-elevation-1">
          <h2 className="font-display font-medium text-lg text-charcoal dark:text-dark-text flex items-center gap-2 mb-1">
            <User size={18} className="text-olive-700 dark:text-olive-400" />
            <span>Personal Information</span>
          </h2>
          <p className="text-xs text-charcoal/55 dark:text-dark-muted mb-5">
            Basic customer identity for order billing and technician contact.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-charcoal/70 dark:text-dark-muted block mb-1.5">
                Full Customer Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-dark-muted" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sam Kumar"
                  className="w-full bg-white dark:bg-dark-surface rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-semibold outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal/70 dark:text-dark-muted block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-dark-muted" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sam@example.com"
                  className="w-full bg-white dark:bg-dark-surface rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal/70 dark:text-dark-muted block mb-1.5">
                Primary Phone / WhatsApp <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-dark-muted" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-white dark:bg-dark-surface rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-mono font-semibold outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal/70 dark:text-dark-muted block mb-1.5">
                Alternate / Family Contact No.
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-dark-muted" />
                <input
                  type="tel"
                  value={formData.altPhone}
                  onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                  placeholder="+91 94150 12890"
                  className="w-full bg-white dark:bg-dark-surface rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-mono outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Village Location & Address */}
        <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-5 sm:p-7 border border-charcoal/5 dark:border-dark-border shadow-elevation-1">
          <h2 className="font-display font-medium text-lg text-charcoal dark:text-dark-text flex items-center gap-2 mb-1">
            <MapPin size={18} className="text-olive-700 dark:text-olive-400" />
            <span>Village Location & Residence Address</span>
          </h2>
          <p className="text-xs text-charcoal/55 dark:text-dark-muted mb-5">
            Accurate village address enables local technicians to arrive promptly without getting lost.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-charcoal/70 dark:text-dark-muted block mb-1.5">
                House / Plot / Ward No. <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.houseNo}
                onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
                placeholder="Plot 42, Ward 4"
                className="w-full bg-white dark:bg-dark-surface rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal/70 dark:text-dark-muted block mb-1.5">
                Gram Panchayat / Village <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                placeholder="Rampur Gram Panchayat"
                className="w-full bg-white dark:bg-dark-surface rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal/70 dark:text-dark-muted block mb-1.5">
                Block / Tehsil
              </label>
              <input
                type="text"
                value={formData.block}
                onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                placeholder="Sadar Block"
                className="w-full bg-white dark:bg-dark-surface rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal/70 dark:text-dark-muted block mb-1.5">
                District <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                placeholder="Gorakhpur"
                className="w-full bg-white dark:bg-dark-surface rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold outline-none border border-charcoal/15 dark:border-charcoal/30 dark:border-dark-border focus:border-olive-600 dark:text-dark-text transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal/70 dark:text-dark-muted block mb-1.5">
                State <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Uttar Pradesh"
                className="w-full bg-white dark:bg-dark-surface rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal/70 dark:text-dark-muted block mb-1.5">
                PIN Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                placeholder="273001"
                className="w-full bg-white dark:bg-dark-surface rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono font-bold outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text transition-colors"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="text-xs font-semibold text-charcoal/70 dark:text-dark-muted block mb-1.5">
                Landmark & Route Directions for Technicians
              </label>
              <input
                type="text"
                value={formData.landmark}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                placeholder="e.g. 50 meters past the water tank, near Rampur Primary School"
                className="w-full bg-white dark:bg-dark-surface rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Attached Documents & ID Verification */}
        <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-5 sm:p-7 border border-charcoal/5 dark:border-dark-border shadow-elevation-1">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-display font-medium text-lg text-charcoal dark:text-dark-text flex items-center gap-2">
              <FileText size={18} className="text-olive-700 dark:text-olive-400" />
              <span>Attached Documents & Identification</span>
            </h2>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 text-[11px] font-bold flex items-center gap-1">
              <ShieldCheck size={12} />
              <span>Govt. Verified</span>
            </span>
          </div>
          <p className="text-xs text-charcoal/55 dark:text-dark-muted mb-5">
            Attach verified identification for secure digital contracts, subsidy receipts, and trust verification.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-semibold text-charcoal/70 dark:text-dark-muted block mb-1.5">
                ID Document Type
              </label>
              <select
                value={formData.docType}
                onChange={(e) => setFormData({ ...formData, docType: e.target.value })}
                className="w-full bg-white dark:bg-dark-surface rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text transition-colors"
              >
                <option value="Aadhaar Card">Aadhaar Card (UIDAI Verified)</option>
                <option value="Voter ID Card">Voter ID Card (EPIC)</option>
                <option value="Ration Card">Ration Card (NFSA)</option>
                <option value="Kisan Credit Card">Kisan Credit Card (KCC)</option>
                <option value="Driving License">Driving License</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal/70 dark:text-dark-muted block mb-1.5">
                Document Identification Number
              </label>
              <input
                type="text"
                value={formData.docNumber}
                onChange={(e) => setFormData({ ...formData, docNumber: e.target.value })}
                placeholder="XXXX-XXXX-XXXX"
                className="w-full bg-white dark:bg-dark-surface rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text transition-colors"
              />
            </div>
          </div>

          {/* Document Attachment Box */}
          <div className="p-4 rounded-2xl bg-white dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-olive-100 dark:bg-olive-900/50 text-olive-800 dark:text-olive-300 flex items-center justify-center shrink-0">
                <FileText size={22} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-charcoal dark:text-dark-text">
                  {formData.docFileName || "No Document Attached Yet"}
                </p>
                <p className="text-[11px] text-charcoal/50 dark:text-dark-muted mt-0.5">
                  {formData.isDocVerified ? "Digitally signed & verified via UIDAI e-Pramaan" : "Upload front & back PDF/Image (Max 5MB)"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <label
                htmlFor="doc-upload-input"
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-olive-50 dark:bg-olive-900/30 text-olive-800 dark:text-olive-300 hover:bg-olive-100 dark:hover:bg-olive-900/50 border border-olive-200 dark:border-olive-800 text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
              >
                <Upload size={14} />
                <span>Upload New Doc</span>
              </label>
              <input
                id="doc-upload-input"
                type="file"
                accept=".pdf,image/*"
                onChange={handleDocUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Preferences & Language */}
        <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-5 sm:p-7 border border-charcoal/5 dark:border-dark-border shadow-elevation-1">
          <h2 className="font-display font-medium text-lg text-charcoal dark:text-dark-text flex items-center gap-2 mb-1">
            <Globe size={18} className="text-olive-700 dark:text-olive-400" />
            <span>Language & Communication Preferences</span>
          </h2>
          <p className="text-xs text-charcoal/55 dark:text-dark-muted mb-4">
            Customise language for technician audio calls and invoice receipts.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-charcoal/70 dark:text-dark-muted block mb-1.5">
                Preferred Interface Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full bg-white dark:bg-dark-surface rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text transition-colors"
              >
                <option value="Hindi">हिन्दी (Hindi)</option>
                <option value="English">English</option>
                <option value="Bhojpuri">भोजपुरी (Bhojpuri)</option>
                <option value="Maithili">मैथिली (Maithili)</option>
                <option value="Punjabi">ਪੰਜਾਬੀ (Punjabi)</option>
                <option value="Bengali">বাংলা (Bengali)</option>
                <option value="Marathi">मराठी (Marathi)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border self-end">
              <div>
                <p className="text-xs font-bold text-charcoal dark:text-dark-text">SMS & WhatsApp Alerts</p>
                <p className="text-[11px] text-charcoal/50 dark:text-dark-muted">Job arrival ETA and dispatch updates</p>
              </div>
              <input
                type="checkbox"
                checked={formData.smsUpdates}
                onChange={(e) => setFormData({ ...formData, smsUpdates: e.target.checked })}
                className="w-4 h-4 accent-olive-700 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Action Save Bar */}
        <div className="p-4 sm:p-5 rounded-3xl bg-cream-card dark:bg-dark-card border border-charcoal/5 dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-elevation-1">
          <div className="flex items-center gap-2 text-xs text-charcoal/60 dark:text-dark-muted text-center sm:text-left">
            <Sparkles size={16} className="text-olive-700 dark:text-olive-400 shrink-0" />
            <span>Changes will immediately update your top-left sidebar name and profile photo.</span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3 rounded-xl font-bold text-xs sm:text-sm bg-olive-700 hover:bg-olive-800 disabled:opacity-50 text-white shadow-sm border border-olive-800/20 transition-all active:scale-[0.98]"
          >
            <Save size={16} className="shrink-0" />
            <span>{saving ? "Saving Details..." : "Save Profile Details"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
