import { useLanguage } from "../lib/LanguageContext";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  HeartPulse,
} from "lucide-react";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-ruby-night border-t border-cream/10">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-14">

        {/* Top Grid */}

        <div className="grid gap-12 lg:grid-cols-5 md:grid-cols-2">

          {/* Brand */}

          <div className="lg:col-span-2">

            <Link
              to="/"
              className="flex items-center gap-3 text-cream"
            >
              <HeartPulse className="w-7 h-7 text-mist" />

              <span className="font-display text-2xl">
                {t("footer.brand")}
              </span>
            </Link>

            <p className="mt-4 text-sm leading-7 text-cream/60 max-w-sm">
              {t("footer.tagline")}
            </p>

            <div className="mt-8 space-y-3">

              <div className="flex items-center gap-3 text-cream/60">

                <MapPin size={18} />

                <span>{t("footer.address")}</span>

              </div>

              <div className="flex items-center gap-3 text-cream/60">

                <Phone size={18} />

                <span>+254 700 123 456</span>

              </div>

              <div className="flex items-center gap-3 text-cream/60">

                <Mail size={18} />

                <span>support@damulink.org</span>

              </div>

            </div>

          </div>

          {/* Company */}

          <div>

            <h3 className="font-mono uppercase tracking-[0.18em] text-xs text-mist mb-5">
              {t("footer.company")}
            </h3>

            <nav className="flex flex-col gap-3">

              <Link to="/" className="text-cream/65 hover:text-cream transition">
                {t("footer.home")}
              </Link>

              <Link to="/signup" className="text-cream/65 hover:text-cream transition">
                {t("footer.signUp")}
              </Link>

              <Link to="/login" className="text-cream/65 hover:text-cream transition">
                {t("footer.login")}
              </Link>

              <Link to="/credits" className="text-cream/65 hover:text-cream transition">
                {t("footer.credits")}
              </Link>

            </nav>

          </div>

          {/* Donors */}

          <div>

            <h3 className="font-mono uppercase tracking-[0.18em] text-xs text-mist mb-5">
              {t("footer.donors")}
            </h3>

            <nav className="flex flex-col gap-3">

              <Link to="/dashboard" className="text-cream/65 hover:text-cream transition">
                {t("footer.dashboard")}
              </Link>

              <Link to="/requests" className="text-cream/65 hover:text-cream transition">
                {t("footer.contact")}
              </Link>

              <Link to="/donations" className="text-cream/65 hover:text-cream transition">
                {t("footer.history")}
              </Link>

              <Link to="/badges" className="text-cream/65 hover:text-cream transition">
                {t("footer.badges")}
              </Link>

            </nav>

          </div>

          {/* Hospitals */}

          <div>

            <h3 className="font-mono uppercase tracking-[0.18em] text-xs text-mist mb-5">
              {t("footer.hospitals")}
            </h3>

            <nav className="flex flex-col gap-3">

              <Link
                to="/hospital/login"
                className="text-cream/65 hover:text-cream transition"
              >
                {t("footer.hospitalLogin")}
              </Link>

              <Link
                to="/hospital/register"
                className="text-cream/65 hover:text-cream transition"
              >
                {t("footer.hospitalRegister")}
              </Link>

              <Link
                to="/hospital/search"
                className="text-cream/65 hover:text-cream transition"
              >
                {t("footer.findHospital")}
              </Link>

            </nav>

          </div>

        </div>

        {/* Divider */}

        <div className="border-t border-cream/10 mt-14 pt-8">

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">

            <p className="text-xs text-cream/40">
              {t("footer.copyright")}
            </p>

            <div className="flex items-center gap-4">

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-cream/5 hover:bg-ruby flex items-center justify-center transition"
              >
                <Facebook size={18} className="text-cream" />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-cream/5 hover:bg-ruby flex items-center justify-center transition"
              >
                <Instagram size={18} className="text-cream" />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-cream/5 hover:bg-ruby flex items-center justify-center transition"
              >
                <Linkedin size={18} className="text-cream" />
              </a>

            </div>

          </div>

        </div>

      </div>
    </footer>
  );
}