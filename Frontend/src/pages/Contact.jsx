import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail, Phone, MapPin, CheckCircle2, Headphones, Send,
  ArrowLeft, Clock, ShieldCheck, MessageSquare, AlertCircle,
  HelpCircle, Building2, Sparkles, FileText, Check
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const ROLES = ["Customer", "Worker", "SHG Collective", "Gram Panchayat / NGO", "Enterprise Partner"];

const CATEGORIES = [
  "General Inquiry",
  "Service Booking / Quality Grievance",
  "Worker Registration & Skill KYC",
  "SHG Cooperative Product Onboarding",
  "UPI Payment & Cash Settlement",
  "Technical Platform Support",
];

const DISTRICT_KIOSKS = [
  { district: "Gorakhpur Cluster", state: "Uttar Pradesh", officer: "Rameshwar Upadhyay", phone: "+91 98765 11001", timing: "08:00 AM - 07:00 PM" },
  { district: "Chanderi / Ashoknagar", state: "Madhya Pradesh", officer: "Sunita Bai Nodal Desk", phone: "+91 98765 11002", timing: "08:30 AM - 06:30 PM" },
  { district: "Satna Forest Block", state: "Madhya Pradesh", officer: "Vikas Gond Tribal Hub", phone: "+91 98765 11003", timing: "09:00 AM - 06:00 PM" },
  { district: "Madhubani Art Collective", state: "Bihar", officer: "Kalyani Devi Nodal Center", phone: "+91 98765 11004", timing: "09:00 AM - 07:00 PM" },
];

export default function Contact() {
  const { user } = useAuth();
  const [role, setRole] = useState(user?.role === "worker" ? "Worker" : user?.role === "shg" ? "SHG Collective" : "Customer");
  const [category, setCategory] = useState("General Inquiry");
  const [fullName, setFullName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [village, setVillage] = useState(user?.village || "");
  const [urgency, setUrgency] = useState("Normal");
  const [message, setMessage] = useState("");
  const [ticketId, setTicketId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const generatedId = `KRY-TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketId(generatedId);
  };

  const resetForm = () => {
    setTicketId(null);
    setMessage("");
    setCategory("General Inquiry");
  };

  return (
    <div className="pt-24 sm:pt-28 pb-24 bg-cream dark:bg-dark-bg min-h-screen transition-colors">
      <div className="container-kare">
        {/* Top Bar with Back Link & Official Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-charcoal/60 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-olive-100 dark:bg-olive-950/60 text-olive-800 dark:text-olive-300 text-xs font-bold border border-olive-500/20">
            <Headphones size={13} />
            <span>Official Helpdesk &amp; District Nodal Support</span>
          </div>
        </div>

        {/* TOP SECTION: Form & District Kiosks Grid */}
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 sm:gap-10 items-start mb-16">
          {/* Submit a Support Request or Grievance Form */}
          <div className="bg-white dark:bg-dark-card rounded-[2.5rem] p-6 sm:p-10 border border-charcoal/10 dark:border-dark-border shadow-elevation-1">
            {ticketId ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-4"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 size={36} />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    Support Ticket Generated
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl text-charcoal dark:text-dark-text font-bold">
                    Ticket ID: {ticketId}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted max-w-md mx-auto leading-relaxed">
                  Your inquiry has been assigned to a Karya District Nodal Supervisor. A confirmation SMS with tracking details has been dispatched. You will receive an operational callback within <strong>30 minutes</strong>.
                </p>

                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl font-bold text-xs sm:text-sm bg-olive-700 hover:bg-olive-800 text-white shadow-sm border border-olive-800/20 cursor-pointer"
                  >
                    <Send size={15} />
                    <span>Submit Another Ticket</span>
                  </button>
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl font-bold text-xs sm:text-sm border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text hover:bg-cream dark:hover:bg-dark-surface cursor-pointer"
                  >
                    <ArrowLeft size={15} />
                    <span>Return to Home</span>
                  </Link>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal dark:text-dark-text">
                    Submit a Support Request or Grievance
                  </h1>
                  <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted mt-1.5">
                    Fill out the details below to receive direct assistance from your local Gram Panchayat cluster supervisor.
                  </p>
                </div>

                {/* Role Selector */}
                <div>
                  <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-2 block uppercase tracking-wider">
                    I am submitting as:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ROLES.map((r) => (
                      <button
                        type="button"
                        key={r}
                        onClick={() => setRole(r)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          role === r
                            ? "bg-olive-700 text-white border-olive-700 shadow-2xs"
                            : "border-charcoal/15 dark:border-dark-border text-charcoal/70 dark:text-dark-muted hover:border-olive-600"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category & Urgency */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1.5 block">
                      Inquiry Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-cream dark:bg-dark-surface rounded-xl px-3.5 py-2.5 text-xs text-charcoal dark:text-dark-text font-semibold outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 cursor-pointer"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1.5 block">
                      Urgency Level
                    </label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value)}
                      className="w-full bg-cream dark:bg-dark-surface rounded-xl px-3.5 py-2.5 text-xs text-charcoal dark:text-dark-text font-semibold outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 cursor-pointer"
                    >
                      <option value="Normal">Normal (Response within 2-4 hours)</option>
                      <option value="Urgent">Urgent (Within 1 hour)</option>
                      <option value="Critical">Critical Dispute (Within 30 mins)</option>
                    </select>
                  </div>
                </div>

                {/* Name & Phone */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1.5 block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-cream dark:bg-dark-surface rounded-xl px-4 py-2.5 text-xs outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1.5 block">
                      Phone Number (SMS &amp; Call) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 00000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-cream dark:bg-dark-surface rounded-xl px-4 py-2.5 text-xs outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text"
                    />
                  </div>
                </div>

                {/* Village / Gram Panchayat */}
                <div>
                  <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1.5 block">
                    Village / Gram Panchayat &amp; District
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rampura Ward 2, Chanderi Block"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full bg-cream dark:bg-dark-surface rounded-xl px-4 py-2.5 text-xs outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text"
                  />
                </div>

                {/* Message Details */}
                <div>
                  <label className="text-xs font-bold text-charcoal/70 dark:text-dark-muted mb-1.5 block">
                    Detailed Message or Grievance Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Please explain the issue or question in detail. Mention booking ID, worker name, or product order if applicable..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-cream dark:bg-dark-surface rounded-xl p-3.5 text-xs outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text leading-relaxed"
                  />
                </div>

                {/* Submit Action conforming to button structure */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2.5 py-3 px-7 rounded-xl font-bold text-xs sm:text-sm bg-olive-700 hover:bg-olive-800 active:scale-[0.98] text-white shadow-sm border border-olive-800/20 transition-all cursor-pointer"
                  >
                    <Send size={16} />
                    <span>Submit Support Ticket</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Side: District Kiosks & Direct Support Desks */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-dark-card rounded-3xl p-6 border border-charcoal/10 dark:border-dark-border space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-olive-700 dark:text-olive-400" />
                <h4 className="font-display text-base font-bold text-charcoal dark:text-dark-text">
                  Offline District Kiosks &amp; Cluster Desks
                </h4>
              </div>
              <p className="text-xs text-charcoal/60 dark:text-dark-muted leading-relaxed">
                For in-person document submission, Aadhaar KYC verification, cash receipts, or cooperative handloom inspections, visit your nearest Gram Panchayat nodal center:
              </p>

              <div className="space-y-3 pt-2">
                {DISTRICT_KIOSKS.map((k, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-cream dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-xs text-charcoal dark:text-dark-text">
                        {k.district}
                      </h5>
                      <span className="text-[10px] font-semibold text-olive-800 dark:text-olive-300">
                        {k.state}
                      </span>
                    </div>
                    <p className="text-[11px] text-charcoal/60 dark:text-dark-muted">
                      Supervisor: <strong>{k.officer}</strong>
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-charcoal/50 dark:text-dark-muted pt-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Phone size={11} /> {k.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {k.timing}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Zero-Commission Grievance Guarantee */}
            <div className="bg-olive-950 text-cream rounded-3xl p-6 space-y-3 shadow-elevation-1">
              <div className="flex items-center gap-2 text-olive-300 text-xs font-bold">
                <Sparkles size={14} />
                <span>Our Citizen Protection Guarantee</span>
              </div>
              <h4 className="font-display text-lg font-bold text-white">
                Zero Fees for Dispute Resolution
              </h4>
              <p className="text-xs text-cream/70 leading-relaxed">
                Every grievance filed through this portal is logged under the Karya Transparency Ledger. Neither workers nor customers are ever charged mediation fees or penalty cuts.
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Quick Contact Channels & Helplines */}
        <div className="border-t border-charcoal/10 dark:border-dark-border pt-12">
          <div className="mb-6">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-charcoal dark:text-dark-text">
              Direct Helplines &amp; Emergency Desks
            </h3>
            <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted mt-1">
              Prefer instant phone or WhatsApp communication? Reach our 24x7 Gramin support network.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Card 1: Toll Free */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs flex flex-col justify-between gap-4">
              <div>
                <span className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3">
                  <Headphones size={20} />
                </span>
                <h3 className="font-display text-base font-bold text-charcoal dark:text-dark-text">
                  24x7 Toll-Free
                </h3>
                <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-1">
                  Zero call charges across India in Hindi, English, &amp; 6 regional languages.
                </p>
              </div>
              <div>
                <p className="font-mono font-bold text-sm text-olive-800 dark:text-olive-300">
                  1800-KARYA-HELP
                </p>
                <a
                  href="tel:180052792"
                  className="mt-2 inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl border border-charcoal/15 dark:border-dark-border text-xs font-bold text-charcoal dark:text-dark-text hover:bg-cream dark:hover:bg-dark-surface transition-all"
                >
                  <Phone size={13} />
                  <span>Call Toll-Free</span>
                </a>
              </div>
            </div>

            {/* Card 2: WhatsApp Community */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs flex flex-col justify-between gap-4">
              <div>
                <span className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3">
                  <MessageSquare size={20} />
                </span>
                <h3 className="font-display text-base font-bold text-charcoal dark:text-dark-text">
                  WhatsApp Support
                </h3>
                <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-1">
                  Direct chat with instant bot responses and live human operator routing.
                </p>
              </div>
              <div>
                <p className="font-mono font-bold text-sm text-emerald-800 dark:text-emerald-300">
                  +91 98765 43210
                </p>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl border border-charcoal/15 dark:border-dark-border text-xs font-bold text-charcoal dark:text-dark-text hover:bg-cream dark:hover:bg-dark-surface transition-all"
                >
                  <MessageSquare size={13} />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Card 3: District Operations Email */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs flex flex-col justify-between gap-4">
              <div>
                <span className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-3">
                  <Mail size={20} />
                </span>
                <h3 className="font-display text-base font-bold text-charcoal dark:text-dark-text">
                  Email Desk
                </h3>
                <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-1">
                  Official inquiries, SHG bulk partnerships, and verification claims.
                </p>
              </div>
              <div>
                <p className="font-mono font-bold text-xs sm:text-sm text-blue-800 dark:text-blue-300 truncate">
                  support@karya.app
                </p>
                <a
                  href="mailto:support@karya.app"
                  className="mt-2 inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl border border-charcoal/15 dark:border-dark-border text-xs font-bold text-charcoal dark:text-dark-text hover:bg-cream dark:hover:bg-dark-surface transition-all"
                >
                  <Mail size={13} />
                  <span>Send Official Email</span>
                </a>
              </div>
            </div>

            {/* Card 4: National Nodal Hub */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border shadow-xs flex flex-col justify-between gap-4">
              <div>
                <span className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 flex items-center justify-center mb-3">
                  <MapPin size={20} />
                </span>
                <h3 className="font-display text-base font-bold text-charcoal dark:text-dark-text">
                  Central Operations Hub
                </h3>
                <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-1">
                  National Rural Gig &amp; SHG Federation Center, New Delhi &amp; Regional Hubs.
                </p>
              </div>
              <div>
                <p className="font-mono font-bold text-xs text-purple-800 dark:text-purple-300">
                  Mon - Sat: 08:00 - 20:00
                </p>
                <div className="mt-2 inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-olive-50 dark:bg-olive-950/50 text-[11px] font-semibold text-olive-800 dark:text-olive-300">
                  <ShieldCheck size={13} />
                  <span>Govt. Aligned Trust</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
