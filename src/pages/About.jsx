import { Link } from "react-router-dom";
import { useLanguage } from "../lib/LanguageContext";

const STEP_TONES = ["ruby", "sage", "clementine", "dusk"];

export default function About() {
  const { t } = useLanguage();

  const steps = [1, 2, 3, 4].map((n) => ({
    title: t(`about.donor.step${n}.title`),
    body: t(`about.donor.step${n}.body`),
    tone: STEP_TONES[n - 1],
  }));

  const founders = [1, 2, 3].map((n) => ({
    name: t(`about.donor.founder${n}.name`),
    role: t(`about.donor.founder${n}.role`),
  }));

  const partners = [1, 2, 3, 4].map((n) => t(`about.donor.partner${n}`));

  return (
    <div className="min-h-screen bg-clay">
      <header className="flex items-center justify-between px-6 md:px-12 py-6 bg-ruby-night">
        <Link to="/dashboard" className="font-display text-lg tracking-tight text-cream">
          {t("common.brand")}
        </Link>
        <Link
          to="/dashboard"
          className="font-body text-sm text-cream/60 hover:text-cream transition-colors"
        >
          {t("about.donor.backDashboard")}
        </Link>
      </header>

      {/* Hero / why */}
      <section className="px-6 md:px-12 py-14 bg-ruby-night">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-mist/80 mb-4">
            {t("about.donor.eyebrow")}
          </p>
          <h1 className="font-display font-medium text-3xl md:text-4xl text-cream mb-5 leading-tight">
            {t("about.donor.title")}
          </h1>
          <p className="font-body text-base text-cream/65 leading-relaxed max-w-xl mx-auto">
            {t("about.donor.intro")}
          </p>
        </div>
      </section>

      <main className="px-6 md:px-12 py-14 max-w-5xl mx-auto">
        {/* How it works — whimsical colorful steps */}
        <section className="mb-16">
          <h2 className="font-display font-medium text-2xl text-ink mb-8 text-center">
            {t("about.donor.howTitle")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {steps.map((step, i) => (
              <StepCard key={i} index={i + 1} tone={step.tone} title={step.title} body={step.body} />
            ))}
          </div>
        </section>

        {/* Impact / credits explainer */}
        <section className="mb-16 rounded-3xl bg-mist-soft border border-mist/40 p-8 text-center">
          <h2 className="font-display font-medium text-xl text-ink mb-3">
            {t("about.donor.impactTitle")}
          </h2>
          <p className="font-body text-sm text-ink/70 max-w-2xl mx-auto leading-relaxed">
            {t("about.donor.impactBody")}
          </p>
        </section>

        {/* Founders */}
        <section className="mb-16">
          <h2 className="font-display font-medium text-2xl text-ink mb-2 text-center">
            {t("about.donor.foundersTitle")}
          </h2>
          <p className="font-mono text-xs text-ink/40 text-center mb-8 uppercase tracking-wide">
            {t("about.donor.foundersNote")}
          </p>
          <div className="grid sm:grid-cols-3 gap-5">
            {founders.map((f, i) => (
              <FounderCard key={i} name={f.name} role={f.role} tone={STEP_TONES[i % STEP_TONES.length]} />
            ))}
          </div>
        </section>

        {/* Partners */}
        <section>
          <h2 className="font-display font-medium text-2xl text-ink mb-2 text-center">
            {t("about.donor.partnersTitle")}
          </h2>
          <p className="font-mono text-xs text-ink/40 text-center mb-8 uppercase tracking-wide">
            {t("about.donor.partnersNote")}
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {partners.map((p, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white border border-ink/8 px-5 py-4 font-body text-sm text-ink/80"
              >
                {p}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

const TONE_STYLES = {
  ruby: { bg: "bg-ruby-50", border: "border-ruby/20", badge: "bg-ruby text-cream", text: "text-ruby-warm" },
  sage: { bg: "bg-sage-soft", border: "border-sage/25", badge: "bg-sage text-white", text: "text-sage" },
  clementine: {
    bg: "bg-clementine-soft",
    border: "border-clementine/25",
    badge: "bg-clementine text-white",
    text: "text-clementine",
  },
  dusk: { bg: "bg-dusk-soft", border: "border-dusk/25", badge: "bg-dusk text-cream", text: "text-dusk" },
};

function StepCard({ index, tone, title, body }) {
  const s = TONE_STYLES[tone];
  return (
    <div className={`rounded-3xl ${s.bg} border ${s.border} p-6`}>
      <span
        className={`inline-flex items-center justify-center w-9 h-9 rounded-full font-mono text-sm font-semibold mb-4 ${s.badge}`}
      >
        {index}
      </span>
      <h3 className="font-display font-medium text-lg text-ink mb-2">{title}</h3>
      <p className="font-body text-sm text-ink/65 leading-relaxed">{body}</p>
    </div>
  );
}

function FounderCard({ name, role, tone }) {
  const s = TONE_STYLES[tone];
  return (
    <div className="rounded-3xl bg-white border border-ink/8 p-6 text-center">
      <div className={`w-16 h-16 rounded-full ${s.badge} mx-auto mb-4 flex items-center justify-center`}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" fill="currentColor" />
          <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="currentColor" />
        </svg>
      </div>
      <p className="font-body text-sm font-semibold text-ink">{name}</p>
      <p className={`font-mono text-xs ${s.text} mt-1`}>{role}</p>
    </div>
  );
}