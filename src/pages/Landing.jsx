import { Link } from "react-router-dom";
import { useLanguage } from "../lib/LanguageContext";

const BLOOD_TYPES = ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"];

export default function Landing() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-ruby-night flex flex-col">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 md:px-12 py-7 relative z-10">
        <span className="font-display text-xl tracking-tight text-cream">
          {t("common.brand")}
        </span>
        <nav className="flex items-center gap-3 relative">
          <Link
            to="/signup"
            className="font-body text-sm font-semibold px-5 py-2.5 rounded-full bg-cream text-ruby-night hover:bg-mist transition-colors"
          >
            {t("common.becomeDonor")}
          </Link>
          <Link
            to="/admin/login"
            className="font-body text-sm font-semibold px-5 py-2.5 rounded-full border border-cream/30 text-cream hover:bg-cream/10 transition-colors"
          >
            Admin Access
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex-1 px-6 md:px-12 relative" style={{ minHeight: "560px" }}>
        <div
          className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center"
          style={{ minHeight: "560px" }}
        >
          {/* Left: headline */}
          <div className="relative z-10 py-10">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-mist/80 mb-5">
              {t("landing.eyebrow")}
            </p>
            <h1 className="font-display font-medium text-[2.75rem] md:text-6xl leading-[1.08] text-cream mb-6">
              {t("landing.title.line1")}
              <br />
              {t("landing.title.line2")}{" "}
              <span className="italic text-mist">{t("landing.title.accent")}</span>
            </h1>
            <p className="font-body text-base md:text-lg text-cream/60 max-w-md mb-9 leading-relaxed">
              {t("landing.body")}
            </p>
          </div>

          {/* Right: illustrated blood bag with radial blood-type wheel */}
          <div className="relative flex items-center justify-center md:justify-end">
            <BagWithWheel />
          </div>
        </div>
      </section>

      {/* The fork: donor or hospital, the one real decision this page asks for */}
      <section className="px-6 md:px-12 py-14 relative z-10">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-mist/70 text-center mb-8">
            {t("landing.choice.title")}
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            <ChoiceCard
              to="/signup"
              tone="donor"
              label={t("landing.choice.donorLabel")}
              body={t("landing.choice.donorBody")}
            />
            <ChoiceCard
              to="/hospital/login"
              tone="hospital"
              label={t("landing.choice.hospitalLabel")}
              body={t("landing.choice.hospitalBody")}
            />
          </div>
        </div>
      </section>

      {/* Stat strip — quiet, on dark */}
      <section className="px-6 md:px-12 py-12 border-t border-cream/10 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            value={t("landing.stat.types.value")}
            label={t("landing.stat.types.label")}
          />
          <StatCard
            value={t("landing.stat.alerts.value")}
            label={t("landing.stat.alerts.label")}
          />
          <StatCard
            value={t("landing.stat.ussd.value")}
            label={t("landing.stat.ussd.label")}
          />
        </div>
      </section>
    </div>
  );
}

function BagWithWheel() {
  const radius = 175;
  const center = 200;

  return (
    <div
      className="relative"
      style={{ width: "320px", height: "320px" }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 400 400" className="w-full h-full">
        {/* dotted orbit ring */}
        <circle
          cx="200"
          cy="200"
          r={radius}
          fill="none"
          stroke="#FFFBF5"
          strokeOpacity="0.14"
          strokeWidth="1.5"
          strokeDasharray="2 8"
        />

        {/* blood type labels around the ring */}
        {BLOOD_TYPES.map((type, i) => {
          const angle = (i / BLOOD_TYPES.length) * 2 * Math.PI - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <g key={type}>
              <circle cx={x} cy={y} r="22" fill="#220301" stroke="#F7E493" strokeOpacity="0.35" strokeWidth="1.5" />
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                fontFamily="IBM Plex Mono, monospace"
                fontSize="13"
                fill="#F7E493"
              >
                {type}
              </text>
            </g>
          );
        })}

        {/* flat illustrated blood bag, cream/mist line-work */}
        <g transform="translate(200,200)">
          {/* bag body */}
          <path
            d="M -68 -50
               Q -72 -10, -68 50
               Q -64 95, 0 100
               Q 64 95, 68 50
               Q 72 -10, 68 -50
               Q 68 -78, 40 -82
               L -40 -82
               Q -68 -78, -68 -50 Z"
            fill="#FFFBF5"
            fillOpacity="0.08"
            stroke="#FFFBF5"
            strokeWidth="2.5"
          />
          {/* fill level inside bag */}
          <path
            d="M -64 5
               Q -60 92, 0 96
               Q 60 92, 64 5
               Q 64 30, 0 34
               Q -64 30, -64 5 Z"
            fill="#F7E493"
            fillOpacity="0.85"
          />
          {/* top spout */}
          <rect x="-12" y="-100" width="24" height="22" rx="6" fill="none" stroke="#FFFBF5" strokeWidth="2.5" />
          {/* tubing */}
          <path
            d="M -12 -100 Q -30 -118, -10 -130"
            fill="none"
            stroke="#FFFBF5"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* drop emblem on bag face */}
          <path
            d="M 0 -25
               C 14 -10, 18 5, 0 18
               C -18 5, -14 -10, 0 -25 Z"
            fill="#570300"
          />
        </g>
      </svg>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="text-center">
      <p className="font-display text-3xl text-mist mb-1.5">{value}</p>
      <p className="font-mono text-xs uppercase tracking-wide text-cream/45">{label}</p>
    </div>
  );
}

function ChoiceCard({ to, tone, label, body }) {
  const isHospital = tone === "hospital";

  return (
    <Link
      to={to}
      className={`group rounded-3xl p-7 border transition-colors ${
        isHospital
          ? "bg-dusk-soft border-dusk/30 hover:border-dusk/60"
          : "bg-ruby-night border-mist/25 hover:border-mist/60"
      }`}
    >
      <span
        className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-4 ${
          isHospital ? "bg-dusk text-cream" : "bg-mist text-ruby-night"
        }`}
      >
        {isHospital ? <HospitalIcon /> : <DropIcon />}
      </span>
      <h3 className="font-display font-medium text-xl text-cream mb-2">{label}</h3>
      <p className="font-body text-sm text-cream/55 leading-relaxed mb-4">{body}</p>
      <span
        className={`font-body text-sm font-semibold ${
          isHospital ? "text-dusk" : "text-mist"
        } group-hover:underline`}
      >
        →
      </span>
    </Link>
  );
}

function DropIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3c4 5 7 8.5 7 12a7 7 0 11-14 0c0-3.5 3-7 7-12z"
        fill="currentColor"
      />
    </svg>
  );
}

function HospitalIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 4v16M4 12h16"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}