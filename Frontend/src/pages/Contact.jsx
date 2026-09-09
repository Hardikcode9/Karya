import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, CheckCircle2, Headphones } from "lucide-react";
import SectionHeading from "../components/ui/SectionHeading";
import Button from "../components/ui/Button";

const roles = ["Customer", "Worker", "SHG Group", "Gram Panchayat / NGO"];

export default function Contact() {
  const [role, setRole] = useState("Customer");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="pt-32 sm:pt-40 pb-20">
      <section className="container-kare grid lg:grid-cols-[1fr_1.1fr] gap-14 items-start">
        <div className="flex flex-col gap-6">
          <SectionHeading
            eyebrow="Contact & Nodal Support"
            title="Let's build stronger local communities together."
            description="Have a question, emergency grievance, SHG partnership request, or platform feedback? Our rural operations team is here to help."
          />
          <div className="flex flex-col gap-4 text-sm text-charcoal/70 dark:text-dark-muted">
            <span className="flex items-center gap-2.5">
              <Headphones size={18} className="text-olive-700 dark:text-olive-400" />
              <strong>24x7 Gramin Toll-Free:</strong> 1800-KARYA-HELP (1800-52792)
            </span>
            <span className="flex items-center gap-2.5">
              <Phone size={18} className="text-olive-700 dark:text-olive-400" />
              +91 98765 43210 (Direct WhatsApp Support)
            </span>
            <span className="flex items-center gap-2.5">
              <Mail size={18} className="text-olive-700 dark:text-olive-400" />
              support@karya.app (Official District Nodal Inquiries)
            </span>
            <span className="flex items-center gap-2.5">
              <MapPin size={18} className="text-olive-700 dark:text-olive-400" />
              National Rural Gig & SHG Federation Hub, India
            </span>
          </div>

          <div className="bg-cream-card dark:bg-dark-card border border-charcoal/10 dark:border-dark-border rounded-3xl p-5 space-y-2">
            <h4 className="font-display text-base font-semibold text-charcoal dark:text-dark-text">
              District Nodal Centers
            </h4>
            <p className="text-xs text-charcoal/60 dark:text-dark-muted leading-relaxed">
              Karya operates 48 offline kiosks and Panchayat cluster desks for in-person worker KYC verification and cash settlement receipts.
            </p>
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card rounded-[2.5rem] p-7 sm:p-9 border border-charcoal/10 dark:border-dark-border shadow-card">
          {sent ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center animate-bounce">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="font-display text-2xl text-charcoal dark:text-dark-text">Ticket Generated!</h3>
              <p className="text-xs text-charcoal/60 dark:text-dark-muted max-w-xs mx-auto">
                Your inquiry has been routed to your district nodal supervisor. Expect an SMS callback within 30 minutes.
              </p>
              <Button onClick={() => setSent(false)} variant="outline" className="mt-4 text-xs">
                Submit Another Request
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-charcoal/70 dark:text-dark-muted mb-1.5 block uppercase tracking-wider">
                  Full Name / Entity Name
                </label>
                <input required className="w-full bg-cream dark:bg-dark-bg rounded-xl px-4 py-3 text-xs outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text transition-colors" />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal/70 dark:text-dark-muted mb-1.5 block uppercase tracking-wider">
                  Phone Number (SMS / Call)
                </label>
                <input required placeholder="+91 98765 00000" className="w-full bg-cream dark:bg-dark-bg rounded-xl px-4 py-3 text-xs outline-none border border-charcoal/15 dark:border-dark-border focus:border-olive-600 dark:text-dark-text transition-colors" />
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

              <Button type="submit" icon className="self-start mt-1 text-xs py-3">
                Send Direct Message
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
