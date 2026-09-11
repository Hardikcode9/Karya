import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Mail, Phone, MapPin, CheckCircle2, Headphones, User, FileText,
  ShieldCheck, UploadCloud, Check, Clock, AlertTriangle, Building,
  CreditCard, Sparkles, ChevronDown, ChevronUp, Camera,
  Send, ExternalLink, RefreshCw, Eye, Edit3, X
} from "lucide-react";
import SectionHeading from "../components/ui/SectionHeading";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";

const ROLES_CATEGORIES = [
  { id: "service", label: "Technician & Village Service Issue" },
  { id: "shg_order", label: "SHG Store & Handloom Product Query" },
  { id: "kyc_doc", label: "Aadhaar / Government Document Updation" },
  { id: "payment", label: "Payment & Kiosk Cash Settlement" },
  { id: "urgent_panchayat", label: "Urgent Gram Panchayat Escalation" },
];

const FAQS = [
  {
    q: "How does the District Nodal Officer resolve customer grievances?",
    a: "Every submission generates a tracked Panchayat Ticket. The designated Block Development Officer or Cluster Supervisor contacts you via phone or SMS within 30 minutes for urgent matters, and within 24 hours for standard inquiries."
  },
  {
    q: "Can I update my village address and Aadhaar documents here?",
    a: "Yes. You can edit your registered premises, Gram Panchayat ward, and attach fresh UIDAI or Ration Card copies directly through the Citizen Dossier on this page."
  },
  {
    q: "What if I need in-person assistance without a smartphone?",
    a: "Karya operates 48 physical Gram Panchayat kiosks across blocks with dedicated Sahaayaks who can process complaints, verify identity, and hand over printed cash receipts."
  },
  {
    q: "Is my customer information and document data safe?",
    a: "All government documents and identification numbers are stored with 256-bit AES encryption compliant with Digital India and NRLM privacy standards. Sensitive numbers like Aadhaar are masked."
  }
];

export default function Contact() {
  const { user } = useAuth();

  // Customer Profile State (Defaults to authenticated user or sample village customer)
  const [profile, setProfile] = useState({
    name: user?.name || "Ramesh Sharma",
    phone: user?.phone || "+91 98765 43210",
    email: user?.email || "ramesh.sharma@karya.citizen",
    customerId: user?.id ? `KRY-CUST-${String(user.id).slice(-6).toUpperCase()}` : "KRY-CUST-849201",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    role: "Verified Rural Citizen / Customer",
    joinedDate: "January 2024",
    kycStatus: "Aadhaar e-KYC Verified",
    
    // Address Details
    houseNo: "Plot #42, Ward No. 4",
    village: "Sonipur Gram Panchayat",
    block: "Sonipur Block",
    district: "Varanasi District",
    state: "Uttar Pradesh",
    pincode: "221001",
    landmark: "Opposite Community Well, Near Primary School",
    coordinates: "25.3176° N, 82.9739° E",
    clusterDesk: "Sonipur Panchayat Bhavan Kiosk #2",

    // Government & Related Docs
    aadhaarMasked: "●●●● ●●●● 8294",
    aadhaarDocName: "Aadhaar_Card_eKYC_Verified.pdf",
    rationCardNo: "UP-RC-8849201 (Antyodaya NFSA)",
    rationDocName: "Ration_Card_Family_Sheet.pdf",
    nrlmId: "NRLM-UP-VN-4401 (Registered Rural Household)",
    electricityConsumerNo: "PVVNL-8920148 (Rural Metered)",
    dbtStatus: "Active · Bank of Baroda (A/C: ●●●● 3948)",
  });

  // Edit Modal State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ ...profile });

  // Form Submission State
  const [selectedCategory, setSelectedCategory] = useState(ROLES_CATEGORIES[0].id);
  const [priority, setPriority] = useState("Normal");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [ticketGenerated, setTicketGenerated] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setAttachedFiles((prev) => [...prev, ...files.map((f) => f.name)]);
    }
  };

  const removeFile = (idx) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile({ ...editForm });
    setIsEditingProfile(false);
  };

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const ticketId = `TK-KRY-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketGenerated({
        id: ticketId,
        category: ROLES_CATEGORIES.find((c) => c.id === selectedCategory)?.label,
        priority,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
      setSubject("");
      setDescription("");
      setAttachedFiles([]);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-dark-bg text-charcoal dark:text-dark-text pt-28 sm:pt-36 pb-24 transition-colors">
      <div className="container-kare space-y-12">
        
        {/* Page Breadcrumbs & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-charcoal/10 dark:border-dark-border">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-charcoal/50 dark:text-dark-muted mb-2.5">
              <Link to="/" className="hover:text-olive-700 dark:hover:text-olive-400 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-olive-800 dark:text-olive-300 font-bold">Customer Care & Nodal Contact</span>
            </div>
            <SectionHeading
              eyebrow="District Nodal Help Desk & Citizen Care"
              title="Customer Support & Village Nodal Desk"
              description="Review your registered citizen credentials, linked government identity documents, and submit expedited grievances directly to your Gram Panchayat cluster nodal desk."
            />
          </div>

          {/* Quick Help Status Pill */}
          <div className="flex items-center gap-3 bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border rounded-2xl p-3 shadow-xs self-start md:self-auto shrink-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Headphones size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-charcoal/50 dark:text-dark-muted uppercase tracking-wider">Toll-Free Helpline</p>
              <p className="text-sm font-display font-bold text-charcoal dark:text-dark-text">1800-KARYA-HELP</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">● 24x7 Gramin Response Active</p>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 1: CUSTOMER PROFILE & VERIFIED CREDENTIALS DOSSIER    */}
        {/* ------------------------------------------------------------- */}
        <div className="rounded-[2.5rem] bg-white dark:bg-dark-card border-2 border-olive-600/20 dark:border-olive-500/20 shadow-elevation-2 p-6 sm:p-9 relative overflow-hidden">
          {/* Subtle Decorative Gradient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-olive-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Card Top Header: Profile Avatar, Name, ID & Verification */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-charcoal/10 dark:border-dark-border">
            <div className="flex items-center gap-5">
              {/* Profile Photo */}
              <div className="relative group shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden border-2 border-olive-600 shadow-md bg-olive-100 dark:bg-dark-surface">
                  <img
                    src={profile.photo}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80";
                    }}
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-dark-card text-white flex items-center justify-center shadow-xs" title="e-KYC Verified">
                  <Check size={12} strokeWidth={3} />
                </span>
              </div>

              {/* Name, Role & Badges */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal dark:text-dark-text">
                    {profile.name}
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck size={13} />
                    {profile.kycStatus}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-charcoal/60 dark:text-dark-muted">
                  {profile.role} · Member since {profile.joinedDate}
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-olive-50 dark:bg-dark-surface border border-olive-500/20 text-olive-800 dark:text-olive-300 text-xs font-mono font-semibold">
                  <span>Customer ID:</span>
                  <span className="font-bold">{profile.customerId}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 self-start md:self-auto">
              <button
                type="button"
                onClick={() => { setEditForm({ ...profile }); setIsEditingProfile(true); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl border border-charcoal/15 dark:border-dark-border text-xs font-bold text-charcoal dark:text-dark-text hover:bg-ivory dark:hover:bg-dark-surface transition-all shadow-2xs cursor-pointer"
              >
                <Edit3 size={14} />
                <span>Update Details</span>
              </button>
            </div>
          </div>

          {/* Dossier Grid: 3 Structured Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            
            {/* Column 1: Contact & Communication */}
            <div className="space-y-3.5 bg-cream/70 dark:bg-dark-surface/60 p-4 sm:p-5 rounded-3xl border border-charcoal/5 dark:border-dark-border">
              <div className="flex items-center gap-2 text-olive-700 dark:text-olive-400 font-bold text-xs uppercase tracking-wider">
                <Phone size={14} />
                <span>Contact Channels</span>
              </div>
              
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-charcoal/50 dark:text-dark-muted uppercase font-bold block">Mobile Phone</span>
                  <span className="font-semibold text-charcoal dark:text-dark-text text-sm font-mono">{profile.phone}</span>
                  <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">SMS OTP Active</span>
                </div>

                <div>
                  <span className="text-[10px] text-charcoal/50 dark:text-dark-muted uppercase font-bold block">Registered Email</span>
                  <span className="font-semibold text-charcoal dark:text-dark-text">{profile.email}</span>
                </div>

                <div>
                  <span className="text-[10px] text-charcoal/50 dark:text-dark-muted uppercase font-bold block">Direct Benefits Transfer (DBT)</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 text-[11px] mt-0.5">
                    <CheckCircle2 size={13} /> {profile.dbtStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Column 2: Registered Village Address */}
            <div className="space-y-3.5 bg-cream/70 dark:bg-dark-surface/60 p-4 sm:p-5 rounded-3xl border border-charcoal/5 dark:border-dark-border">
              <div className="flex items-center gap-2 text-olive-700 dark:text-olive-400 font-bold text-xs uppercase tracking-wider">
                <MapPin size={14} />
                <span>Registered Village Address</span>
              </div>
              
              <div className="space-y-1.5 text-xs text-charcoal/80 dark:text-dark-text leading-relaxed">
                <p className="font-semibold text-charcoal dark:text-dark-text">
                  {profile.houseNo}, {profile.village}
                </p>
                <p className="text-charcoal/65 dark:text-dark-muted">
                  {profile.block}, {profile.district}
                </p>
                <p className="text-charcoal/65 dark:text-dark-muted">
                  {profile.state} – <span className="font-mono font-bold text-charcoal dark:text-dark-text">{profile.pincode}</span>
                </p>
                <p className="text-[11px] text-charcoal/60 dark:text-dark-muted pt-1 border-t border-charcoal/10 dark:border-dark-border">
                  <span className="font-semibold">Landmark:</span> {profile.landmark}
                </p>
                <p className="text-[10px] font-mono text-olive-800 dark:text-olive-300">
                  📍 Panchayat Desk: {profile.clusterDesk}
                </p>
              </div>
            </div>

            {/* Column 3: Government Identity & Related Docs */}
            <div className="space-y-3.5 bg-cream/70 dark:bg-dark-surface/60 p-4 sm:p-5 rounded-3xl border border-charcoal/5 dark:border-dark-border">
              <div className="flex items-center gap-2 text-olive-700 dark:text-olive-400 font-bold text-xs uppercase tracking-wider">
                <FileText size={14} />
                <span>Related Verification Documents</span>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-dark-card border border-charcoal/5 dark:border-dark-border">
                  <div>
                    <span className="text-[10px] text-charcoal/50 dark:text-dark-muted uppercase font-bold block">Aadhaar Card (UIDAI)</span>
                    <span className="font-mono font-bold text-charcoal dark:text-dark-text">{profile.aadhaarMasked}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                    Verified
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-dark-card border border-charcoal/5 dark:border-dark-border">
                  <div>
                    <span className="text-[10px] text-charcoal/50 dark:text-dark-muted uppercase font-bold block">Ration Card (NFSA)</span>
                    <span className="font-semibold text-charcoal dark:text-dark-text text-[11px]">{profile.rationCardNo}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                    Linked
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-dark-card border border-charcoal/5 dark:border-dark-border">
                  <div>
                    <span className="text-[10px] text-charcoal/50 dark:text-dark-muted uppercase font-bold block">NRLM Household ID</span>
                    <span className="font-semibold text-charcoal dark:text-dark-text text-[11px]">{profile.nrlmId}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-olive-500/15 text-olive-700 dark:text-olive-300">
                    Registered
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 2: INTERACTIVE GRIEVANCE & SUPPORT TICKET FORM        */}
        {/* ------------------------------------------------------------- */}
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
          
          {/* Support Ticket Submission Card */}
          <div className="rounded-[2.5rem] bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-card p-6 sm:p-9 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-olive-700 dark:text-olive-400 block mb-1">
                  Expedited Village Desk Ticket
                </span>
                <h3 className="font-display text-2xl font-bold text-charcoal dark:text-dark-text">
                  Submit Direct Support Request
                </h3>
              </div>
              <div className="p-2.5 rounded-2xl bg-olive-100 dark:bg-olive-900/60 text-olive-800 dark:text-olive-300">
                <Send size={20} />
              </div>
            </div>

            {ticketGenerated ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 px-6 rounded-3xl bg-cream dark:bg-dark-surface border-2 border-emerald-500/30 space-y-4"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shadow-md animate-bounce">
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                    Official Ticket Generated
                  </span>
                  <h4 className="font-display text-3xl font-bold text-charcoal dark:text-dark-text mt-2 font-mono">
                    {ticketGenerated.id}
                  </h4>
                  <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-1">
                    Logged at {ticketGenerated.timestamp} · Priority: {ticketGenerated.priority}
                  </p>
                </div>
                <div className="max-w-md mx-auto p-4 rounded-2xl bg-white dark:bg-dark-card text-left text-xs space-y-2 border border-charcoal/5">
                  <p className="font-semibold text-charcoal dark:text-dark-text">
                    • Request Category: <span className="font-normal">{ticketGenerated.category}</span>
                  </p>
                  <p className="font-semibold text-charcoal dark:text-dark-text">
                    • Dispatched To: <span className="font-normal">{profile.clusterDesk}</span>
                  </p>
                  <p className="font-semibold text-charcoal dark:text-dark-text">
                    • Confirmation SMS: <span className="font-normal">Sent to {profile.phone}</span>
                  </p>
                  <p className="text-[11px] text-charcoal/55 dark:text-dark-muted pt-1 border-t border-charcoal/10">
                    A designated Panchayat Supervisor has been assigned to your ticket and will call back within 30 minutes.
                  </p>
                </div>
                <Button
                  onClick={() => setTicketGenerated(null)}
                  variant="outline"
                  className="mt-2 text-xs font-bold"
                >
                  Create Another Request
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                {/* Pre-Filled Customer Summary Badge */}
                <div className="p-3.5 rounded-2xl bg-cream dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-charcoal/50 dark:text-dark-muted uppercase font-bold block">Filing On Behalf Of</span>
                    <span className="font-bold text-charcoal dark:text-dark-text">{profile.name} ({profile.customerId})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-charcoal/50 dark:text-dark-muted uppercase font-bold block">Assigned Nodal Hub</span>
                    <span className="font-semibold text-olive-800 dark:text-olive-300">{profile.village}</span>
                  </div>
                </div>

                {/* Inquiry Category Buttons */}
                <div>
                  <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-2 block uppercase tracking-wider">
                    Select Request / Issue Category
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ROLES_CATEGORIES.map((cat) => (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`p-3 rounded-2xl text-xs font-semibold text-left border transition-all cursor-pointer ${
                          selectedCategory === cat.id
                            ? "bg-olive-800 text-cream border-olive-800 shadow-xs"
                            : "border-charcoal/10 dark:border-dark-border text-charcoal/80 dark:text-dark-muted hover:bg-cream dark:hover:bg-dark-surface"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority Selection */}
                <div>
                  <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1.5 block uppercase tracking-wider">
                    Urgency & Priority
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "Normal", label: "Normal (Standard 24h Response)", color: "text-charcoal dark:text-dark-text" },
                      { id: "High", label: "High Priority (2 Hour SLA)", color: "text-amber-700 dark:text-amber-400" },
                      { id: "Urgent", label: "🚨 Urgent Gramin SOS (30 Min Callback)", color: "text-red-700 dark:text-red-400" },
                    ].map((p) => (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => setPriority(p.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          priority === p.id
                            ? "bg-charcoal dark:bg-olive-700 text-cream border-charcoal dark:border-olive-700 shadow-xs"
                            : `border-charcoal/15 dark:border-dark-border ${p.color} hover:bg-cream dark:hover:bg-dark-surface`
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject Line */}
                <div>
                  <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1.5 block uppercase tracking-wider">
                    Subject / Brief Summary
                  </label>
                  <input
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Electrician did not arrive for scheduled booking ORD-821"
                    className="w-full bg-cream dark:bg-dark-bg rounded-xl px-4 py-3 text-xs outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text transition-colors"
                  />
                </div>

                {/* Description Textarea */}
                <div>
                  <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1.5 block uppercase tracking-wider">
                    Detailed Explanation
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide relevant details such as technician name, booking reference number, or nature of grievance..."
                    className="w-full bg-cream dark:bg-dark-bg rounded-xl p-3.5 text-xs outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text resize-none transition-colors leading-relaxed"
                  />
                </div>

                {/* Document & Photo Attachment Zone */}
                <div>
                  <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1.5 block uppercase tracking-wider">
                    Attach Related Photos / Receipts / Documents (Optional)
                  </label>
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-charcoal/20 dark:border-dark-border rounded-2xl bg-cream/40 dark:bg-dark-bg/40 hover:bg-cream dark:hover:bg-dark-surface cursor-pointer transition-colors text-center">
                    <UploadCloud size={24} className="text-olive-700 dark:text-olive-400 mb-1" />
                    <span className="text-xs font-bold text-charcoal dark:text-dark-text">Click to upload bill, receipt or photo</span>
                    <span className="text-[10px] text-charcoal/50 dark:text-dark-muted mt-0.5">PNG, JPG, PDF up to 10MB</span>
                    <input type="file" multiple onChange={handleFileUpload} className="hidden" />
                  </label>

                  {/* Attached Files List */}
                  {attachedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2.5">
                      {attachedFiles.map((fn, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-olive-100 dark:bg-olive-950/60 border border-olive-500/20 text-olive-900 dark:text-olive-300 text-xs font-medium">
                          <FileText size={12} />
                          <span className="max-w-xs truncate">{fn}</span>
                          <button type="button" onClick={() => removeFile(idx)} className="text-charcoal/40 hover:text-red-600 ml-1">
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-xs font-bold py-3.5 shadow-md flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        <span>Generating Ticket & Dispatching to Cluster...</span>
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>Submit Grievance to Block Officer</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Direct Help Channels & FAQs */}
          <div className="space-y-6">
            
            {/* Direct Channels Card */}
            <div className="rounded-[2.5rem] bg-gradient-to-br from-olive-950 via-olive-900 to-charcoal text-cream p-7 sm:p-8 space-y-5 shadow-elevation-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-olive-300 text-xs font-semibold backdrop-blur">
                <Building size={13} />
                <span>Gram Panchayat Network</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white">
                Live Support Channels
              </h3>
              <p className="text-xs text-cream/75 leading-relaxed">
                Connect directly with rural cluster supervisors, block coordinators, or our 24x7 voice helpline.
              </p>

              <div className="space-y-3.5 pt-2 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur border border-white/10">
                  <Headphones size={18} className="text-olive-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Toll-Free Gramin Line</span>
                    <span className="text-cream/80 font-mono text-sm font-bold">1800-KARYA-HELP (1800-52792)</span>
                    <p className="text-[10px] text-cream/60 mt-0.5">Toll-free across all Indian operators · 24x7 Support</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur border border-white/10">
                  <Phone size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">District WhatsApp Nodal Line</span>
                    <span className="text-cream/80 font-mono text-sm font-bold">+91 98765 43210</span>
                    <p className="text-[10px] text-cream/60 mt-0.5">Send voice notes, photos & booking slips directly</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur border border-white/10">
                  <Mail size={18} className="text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Official Nodal Email</span>
                    <span className="text-cream/80 font-mono">nodal.support@karya.gov.in</span>
                    <p className="text-[10px] text-cream/60 mt-0.5">Escalated to District Magistrate Livelihood Cell</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur border border-white/10">
                  <Building size={18} className="text-olive-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">48 Offline Village Kiosks</span>
                    <span className="text-cream/80">Panchayat Cluster Desks across Uttar Pradesh & Bihar</span>
                    <p className="text-[10px] text-cream/60 mt-0.5">Open Mon–Sat: 8:00 AM – 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQs Accordion */}
            <div className="rounded-[2.5rem] bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border p-6 sm:p-7 space-y-4 shadow-card">
              <div className="flex items-center gap-2">
                <HelpCircle size={18} className="text-olive-700 dark:text-olive-400" />
                <h4 className="font-display text-lg font-bold text-charcoal dark:text-dark-text">
                  Customer Assistance FAQs
                </h4>
              </div>

              <div className="space-y-2">
                {FAQS.map((faq, idx) => (
                  <div key={idx} className="border border-charcoal/10 dark:border-dark-border rounded-2xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      className="w-full p-3.5 text-left flex items-center justify-between text-xs font-bold text-charcoal dark:text-dark-text hover:bg-cream dark:hover:bg-dark-surface transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {openFaqIndex === idx ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {openFaqIndex === idx && (
                      <div className="p-3.5 pt-0 text-xs text-charcoal/70 dark:text-dark-muted leading-relaxed bg-cream/30 dark:bg-dark-surface/40">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: UPDATE CUSTOMER PROFILE & ADDRESS DETAILS               */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-white dark:bg-dark-card rounded-[2.5rem] border border-charcoal/15 dark:border-dark-border shadow-elevation-3 p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-charcoal/10 dark:border-dark-border">
                <div>
                  <h3 className="font-display text-xl font-bold text-charcoal dark:text-dark-text">
                    Update Customer Information
                  </h3>
                  <p className="text-xs text-charcoal/60 dark:text-dark-muted">
                    Update your registered village residence and identification documents.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="p-2 rounded-xl text-charcoal/50 hover:text-charcoal dark:text-dark-muted dark:hover:text-dark-text hover:bg-cream dark:hover:bg-dark-surface cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-charcoal/70 dark:text-dark-muted block mb-1">Full Name</label>
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-cream dark:bg-dark-bg rounded-xl px-3.5 py-2.5 outline-none border border-charcoal/15 dark:border-dark-border font-semibold"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-charcoal/70 dark:text-dark-muted block mb-1">Phone Number</label>
                    <input
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full bg-cream dark:bg-dark-bg rounded-xl px-3.5 py-2.5 outline-none border border-charcoal/15 dark:border-dark-border font-mono font-semibold"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-charcoal/70 dark:text-dark-muted block mb-1">Email Address</label>
                    <input
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full bg-cream dark:bg-dark-bg rounded-xl px-3.5 py-2.5 outline-none border border-charcoal/15 dark:border-dark-border font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-charcoal/70 dark:text-dark-muted block mb-1">House / Ward No.</label>
                    <input
                      value={editForm.houseNo}
                      onChange={(e) => setEditForm({ ...editForm, houseNo: e.target.value })}
                      className="w-full bg-cream dark:bg-dark-bg rounded-xl px-3.5 py-2.5 outline-none border border-charcoal/15 dark:border-dark-border"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-charcoal/70 dark:text-dark-muted block mb-1">Gram Panchayat / Village</label>
                    <input
                      value={editForm.village}
                      onChange={(e) => setEditForm({ ...editForm, village: e.target.value })}
                      className="w-full bg-cream dark:bg-dark-bg rounded-xl px-3.5 py-2.5 outline-none border border-charcoal/15 dark:border-dark-border font-semibold"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-charcoal/70 dark:text-dark-muted block mb-1">Block / Tehsil</label>
                    <input
                      value={editForm.block}
                      onChange={(e) => setEditForm({ ...editForm, block: e.target.value })}
                      className="w-full bg-cream dark:bg-dark-bg rounded-xl px-3.5 py-2.5 outline-none border border-charcoal/15 dark:border-dark-border"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-charcoal/70 dark:text-dark-muted block mb-1">District</label>
                    <input
                      value={editForm.district}
                      onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
                      className="w-full bg-cream dark:bg-dark-bg rounded-xl px-3.5 py-2.5 outline-none border border-charcoal/15 dark:border-dark-border"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-charcoal/70 dark:text-dark-muted block mb-1">PIN Code</label>
                    <input
                      value={editForm.pincode}
                      onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })}
                      className="w-full bg-cream dark:bg-dark-bg rounded-xl px-3.5 py-2.5 outline-none border border-charcoal/15 dark:border-dark-border font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-charcoal/70 dark:text-dark-muted block mb-1">Landmark / Directions</label>
                  <input
                    value={editForm.landmark}
                    onChange={(e) => setEditForm({ ...editForm, landmark: e.target.value })}
                    className="w-full bg-cream dark:bg-dark-bg rounded-xl px-3.5 py-2.5 outline-none border border-charcoal/15 dark:border-dark-border"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-charcoal/10 dark:border-dark-border">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-charcoal/60 dark:text-dark-muted hover:text-charcoal"
                  >
                    Cancel
                  </button>
                  <Button type="submit" className="text-xs font-bold py-2.5">
                    Save Updated Profile
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
