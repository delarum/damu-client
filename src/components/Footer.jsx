import { useLanguage } from "../lib/LanguageContext";
import { Link } from "react-router-dom";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-ruby-night border-t border-cream/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14">

        {/* Main Grid */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}

          <div className="lg:col-span-2">

            <Link
              to="/"
              className="font-display text-3xl text-cream tracking-tight"
            >
              {t("footer.brand")}
            </Link>

            <p className="mt-4 text-cream/70 leading-7 max-w-md">
              {t("footer.tagline")}
            </p>

            <div className="mt-8 space-y-3 text-sm text-cream/60">

              <p>📍 {t("footer.address")}</p>

              <p>📞 +254 700 123 456</p>

              <p>📧 support@damulink.org</p>

            </div>

          </div>

          {/* Company */}

          <div>

            <h3 className="text-mist uppercase tracking-[0.18em] text-xs font-semibold mb-5">
              {t("footer.company")}
            </h3>

            <div className="flex flex-col gap-3">

              <Link to="/" className="text-cream/70 hover:text-cream">
                {t("footer.home")}
              </Link>

              <Link to="/signup" className="text-cream/70 hover:text-cream">
                {t("footer.signUp")}
              </Link>

              <Link to="/login" className="text-cream/70 hover:text-cream">
                {t("footer.login")}
              </Link>

              <Link to="/credits" className="text-cream/70 hover:text-cream">
                {t("footer.credits")}
              </Link>

            </div>

          </div>

          {/* Donors */}

          <div>

            <h3 className="text-mist uppercase tracking-[0.18em] text-xs font-semibold mb-5">
              {t("footer.donors")}
            </h3>

            <div className="flex flex-col gap-3">

              <Link to="/dashboard" className="text-cream/70 hover:text-cream">
                {t("footer.dashboard")}
              </Link>

              <Link to="/requests" className="text-cream/70 hover:text-cream">
                {t("footer.contact")}
              </Link>

              <Link to="/donations" className="text-cream/70 hover:text-cream">
                {t("footer.history")}
              </Link>

              <Link to="/badges" className="text-cream/70 hover:text-cream">
                {t("footer.badges")}
              </Link>

            </div>

          </div>

          {/* Hospitals */}

          <div>

            <h3 className="text-mist uppercase tracking-[0.18em] text-xs font-semibold mb-5">
              {t("footer.hospitals")}
            </h3>

            <div className="flex flex-col gap-3">

              <Link
                to="/hospital/login"
                className="text-cream/70 hover:text-cream"
              >
                {t("footer.hospitalLogin")}
              </Link>

              <Link
                to="/hospital/register"
                className="text-cream/70 hover:text-cream"
              >
                {t("footer.hospitalRegister")}
              </Link>

              <Link
                to="/hospital/search"
                className="text-cream/70 hover:text-cream"
              >
                {t("footer.findHospital")}
              </Link>

            </div>

          </div>

        </div>

        {/* Divider */}

        <div className="border-t border-cream/10 mt-12 pt-8">

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">

            <p className="text-xs text-cream/40 text-center md:text-left">
              {t("footer.copyright")}
            </p>

            <div className="flex gap-6 text-sm">

              <a
                href="#"
                className="text-cream/60 hover:text-cream transition-colors"
              >
                Facebook
              </a>

              <a
                href="#"
                className="text-cream/60 hover:text-cream transition-colors"
              >
                Instagram
              </a>

              <a
                href="#"
                className="text-cream/60 hover:text-cream transition-colors"
              >
                LinkedIn
              </a>

            </div>

          </div>

        </div>

      </div>
    </footer>
  );
}