import { Link } from "react-router-dom";
import { useLanguage } from "../lib/LanguageContext";

export default function HospitalAbout() {
  const { t } = useLanguage();

  const steps = [1, 2, 3, 4].map((n) => ({
    title: t(`about.hospital.step${n}.title`),
    body: t(`about.hospital.step${n}.body`),
  }));

  const tiers = [1, 2, 3, 4].map((n) => ({
    name: t(`about.hospital.tier${n}.name`),
    price: t(`about.hospital.tier${n}.price`),
    detail: t(`about.hospital.tier${n}.detail`),
  }));

  return (
    <div className="min-h-screen bg-clay">
      <header className="flex items-center justify-between px-6 md:px-12 py-6 bg-ruby-night">
        <Link to="/hospital/dashboard" className="font-display text-lg tracking-tight text-cream">
          {t("common.brand")}
        </Link>
        <Link
          to="/hospital/dashboard"
          className="font-body text-sm text-cream/60 hover:text-cream transition-colors"
        >
          {t("about.hospital.backDashboard")}
        </Link>
      </header>

      {/* Hero */}
      <section className="px-6 md:px-12 py-14 bg-dusk-soft">
        <div className="max-w-3xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-dusk mb-4">
            {t("about.hospital.eyebrow")}
          </p>
          <h1 className="font-display font-medium text-3xl md:text-4xl text-ink mb-5 leading-tight">
            {t("about.hospital.title")}
          </h1>
          <p className="font-body text-base text-ink/65 leading-relaxed max-w-xl">
            {t("about.hospital.intro")}
          </p>
        </div>
      </section>

      <main className="px-6 md:px-12 py-14 max-w-5xl mx-auto">
        {/* How search works — numbered, structured, not playful */}
        <section className="mb-16">
          <h2 className="font-display font-medium text-2xl text-ink mb-8">
            {t("about.hospital.howTitle")}
          </h2>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-5 rounded-2xl bg-white border border-ink/8 p-6">
                <span className="font-mono text-sm font-semibold text-dusk w-7 h-7 rounded-full bg-dusk-soft flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-body text-base font-semibold text-ink mb-1">{step.title}</h3>
                  <p className="font-body text-sm text-ink/60 leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Subscription tiers */}
        <section className="mb-16">
          <h2 className="font-display font-medium text-2xl text-ink mb-8">
            {t("about.hospital.tiersTitle")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {tiers.map((tier, i) => (
              <div key={i} className="rounded-2xl bg-white border border-ink/8 p-6">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="font-display font-medium text-lg text-ink">{tier.name}</h3>
                  <span className="font-mono text-sm text-dusk">{tier.price}</span>
                </div>
                <p className="font-body text-sm text-ink/60">{tier.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Compliance reassurance */}
        <section className="mb-16 rounded-3xl bg-ruby-night p-8">
          <h2 className="font-display font-medium text-xl text-cream mb-3">
            {t("about.hospital.complianceTitle")}
          </h2>
          <p className="font-body text-sm text-cream/65 leading-relaxed max-w-2xl">
            {t("about.hospital.complianceBody")}
          </p>
        </section>

        {/* Founders */}
        <section className="mb-16">
          <h2 className="font-display font-medium text-2xl text-ink mb-8 text-center">
            {t("about.hospital.foundersTitle")}
          </h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-2xl bg-white border border-ink/8 p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-dusk-soft mx-auto mb-4 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" fill="#3E5C76" />
                    <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="#3E5C76" />
                  </svg>
                </div>
                <p className="font-body text-sm font-semibold text-ink">
                  {t(`about.donor.founder${n}.name`)}
                </p>
                <p className="font-mono text-xs text-dusk mt-1">
                  {t(`about.donor.founder${n}.role`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Partners */}
        <section>
          <h2 className="font-display font-medium text-2xl text-ink mb-2 text-center">
            {t("about.hospital.partnersTitle")}
          </h2>
          <p className="font-mono text-xs text-ink/40 text-center mb-8 uppercase tracking-wide">
            {t("about.hospital.partnersNote")}
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="rounded-2xl bg-white border border-ink/8 px-5 py-4 font-body text-sm text-ink/80"
              >
                {t(`about.donor.partner${n}`)}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}