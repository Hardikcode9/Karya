import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AtSign, Link2, Mail } from "lucide-react";
import Logo from "../ui/Logo";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-charcoal text-cream mt-24 sm:mt-32">
      <div className="container-kare py-16 grid grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 lg:gap-8">
        <div className="col-span-2 lg:col-span-1 flex flex-col gap-4">
          <Logo light />
          <p className="text-cream/60 text-sm leading-relaxed max-w-xs">{t("footer.tagline")}</p>
        </div>

        <div>
          <h4 className="text-sm text-cream/50 mb-4">{t("footer.quickLinks")}</h4>
          <ul className="flex flex-col gap-3 text-sm text-cream/80">
            <li><Link to="/about" className="hover:text-cream">{t("nav.about")}</Link></li>
            <li><Link to="/services" className="hover:text-cream">{t("nav.services")}</Link></li>
            <li><Link to="/how-it-works" className="hover:text-cream">{t("nav.howItWorks")}</Link></li>
            <li><Link to="/work" className="hover:text-cream">{t("nav.work")}</Link></li>
            <li><Link to="/resources" className="hover:text-cream">{t("nav.resources")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm text-cream/50 mb-4">{t("footer.forCommunities")}</h4>
          <ul className="flex flex-col gap-3 text-sm text-cream/80">
            <li><Link to="/services" className="hover:text-cream">{t("footer.findServices")}</Link></li>
            <li><Link to="/register" className="hover:text-cream">{t("footer.offerSkills")}</Link></li>
            <li><Link to="/shgs" className="hover:text-cream">{t("footer.joinSHG")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm text-cream/50 mb-4">{t("footer.connect")}</h4>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center hover:bg-cream/20">
              <AtSign size={16} />
            </a>
            <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center hover:bg-cream/20">
              <Link2 size={16} />
            </a>
            <a href="mailto:hello@karya.app" aria-label="Email" className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center hover:bg-cream/20">
              <Mail size={16} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="container-kare py-5 text-xs text-cream/40 flex flex-col sm:flex-row justify-between gap-2">
          <span>© 2026 Karya. {t("footer.rights")}</span>
          <span>Made for local communities, everywhere.</span>
        </div>
      </div>
    </footer>
  );
}
