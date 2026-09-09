import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, MapPin, CheckCircle2, Headphones } from "lucide-react";
import Button from "../ui/Button";

const roles = ["Customer", "Worker", "SHG Group", "Gram Panchayat / NGO"];

export default function ContactModal({ isOpen, onClose }) {
  const [role, setRole] = useState("Customer");
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  const resetAndClose = () => {
    setSent(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={resetAndClose}
          className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full sm:max-w-2xl bg-cream dark:bg-dark-surface rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl border border-charcoal/10 dark:border-dark-border overflow-hidden flex flex-col z-10 sm:my-8"
        >
          {/* Header */}
          <div className="bg-olive-950 text-cream p-5 sm:p-6 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-olive-300">
                Contact &amp; Nodal Support
              </span>
              <h3 className="font-display text-xl text-cream mt-0.5">
                Reach Out to Karya
              </h3>
              <p className="text-xs text-cream/70 mt-0.5">
                Our rural operations team is here to help.
              </p>
            </div>
            <button
              onClick={resetAndClose}
              className="p-2 text-cream/70 hover:text-cream rounded-full hover:bg-cream/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto max-h-[80vh] sm:max-h-none">
            <div className="grid sm:grid-cols-[1fr_1.1fr] gap-0">
              {/* Left: Info Panel */}
              <div className="p-6 sm:p-7 flex flex-col gap-5 border-b sm:border-b-0 sm:border-r border-charcoal/10 dark:border-dark-border">
                <div className="flex flex-col gap-3 text-sm text-charcoal/70 dark:text-dark-muted">
                  <span className="flex items-center gap-2.5">
                    <Headphones size={18} className="text-olive-700 dark:text-olive-400 shrink-0" />
                    <span><strong className="text-charcoal dark:text-dark-text">24x7 Toll-Free:</strong> 1800-KARYA-HELP</span>
                  </span>
                  <span className="flex items-center gap-2.5">
                    <Phone size={18} className="text-olive-700 dark:text-olive-400 shrink-0" />
                    <span>+91 98765 43210 (WhatsApp)</span>
                  </span>
                  <span className="flex items-center gap-2.5">
                    <Mail size={18} className="text-olive-700 dark:text-olive-400 shrink-0" />
                    <span>support@karya.app</span>
                  </span>
                  <span className="flex items-center gap-2.5">
                    <MapPin size={18} className="text-olive-700 dark:text-olive-400 shrink-0" />
                    <span>National Rural Gig &amp; SHG Hub, India</span>
                  </span>
                </div>

                <div className="bg-cream-card dark:bg-dark-card border border-charcoal/10 dark:border-dark-border rounded-2xl p-4 space-y-1">
                  <h4 className="font-display text-sm font-semibold text-charcoal dark:text-dark-text">
                    District Nodal Centers
                  </h4>
                  <p className="text-xs text-charcoal/60 dark:text-dark-muted leading-relaxed">
                    Karya operates 48 offline kiosks and Panchayat cluster desks for in-person KYC verification and cash settlement receipts.
                  </p>
                </div>
              </div>

              {/* Right: Form */}
              <div className="p-6 sm:p-7">
                {sent ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-10 space-y-3 flex flex-col items-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center animate-bounce">
                      <CheckCircle2 size={36} />
                    </div>
                    <h3 className="font-display text-xl text-charcoal dark:text-dark-text">Ticket Generated!</h3>
                    <p className="text-xs text-charcoal/60 dark:text-dark-muted max-w-xs">
                      Your inquiry has been routed to your district nodal supervisor. Expect an SMS callback within 30 minutes.
                    </p>
                    <div className="flex gap-2 pt-2">
                      <Button onClick={() => setSent(false)} variant="outline" className="text-xs">
                        Submit Another
                      </Button>
                      <Button onClick={resetAndClose} className="text-xs">
                        Done
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                      <label className="text-xs font-semibold text-charcoal/70 dark:text-dark-muted mb-1.5 block uppercase tracking-wider">
                        Full Name / Entity Name
                      </label>
                      <input
                        required
                        className="w-full bg-cream dark:bg-dark-bg rounded-xl px-4 py-3 text-xs outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-charcoal/70 dark:text-dark-muted mb-1.5 block uppercase tracking-wider">
                        Phone Number (SMS / Call)
                      </label>
                      <input
                        required
                        placeholder="+91 98765 00000"
                        className="w-full bg-cream dark:bg-dark-bg rounded-xl px-4 py-3 text-xs outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-charcoal/70 dark:text-dark-muted mb-1.5 block uppercase tracking-wider">
                        I am a...
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {roles.map((r) => (
                          <button
                            type="button"
                            key={r}
                            onClick={() => setRole(r)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                              role === r
                                ? "bg-olive-700 text-cream border-olive-700 font-bold"
                                : "border-charcoal/15 dark:border-dark-border text-charcoal/70 dark:text-dark-muted hover:bg-cream dark:hover:bg-dark-surface"
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-charcoal/70 dark:text-dark-muted mb-1.5 block uppercase tracking-wider">
                        Describe your requirement or issue
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="How can our community team assist you?"
                        className="w-full bg-cream dark:bg-dark-bg rounded-xl p-3 text-xs outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text resize-none transition-colors"
                      />
                    </div>

                    <Button type="submit" icon className="self-start text-xs py-3">
                      Send Direct Message
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
