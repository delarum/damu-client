import { useState, useRef, useCallback } from "react";
import { useLanguage } from "../lib/LanguageContext";
import { ORGAN_INFO, FALLBACK_ORGAN_ANCHOR } from "../data/organDonationInfo";

/* ----------------------------------------------------------------------
 * BODY ILLUSTRATIONS
 * Two front-facing, semi-realistic comic-hero figures (bold linework,
 * layered shading — the "every donor is somebody's hero" idea made
 * literal). Skin tone, hair, and proportions are deliberately simple so
 * the figure reads as an everyday person, not a specific likeness.
 * ------------------------------------------------------------------- */

function MaleFigure() {
  return (
    <g>
      <defs>
        <linearGradient id="skinM" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C98A65" />
          <stop offset="100%" stopColor="#A8693F" />
        </linearGradient>
        <linearGradient id="shirtM" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7A1410" />
          <stop offset="100%" stopColor="#570300" />
        </linearGradient>
      </defs>

      {/* legs */}
      <path d="M95 360 L90 500 L112 500 L118 372 Z" fill="#2B1B16" opacity="0.88" />
      <path d="M145 360 L150 500 L128 500 L122 372 Z" fill="#220301" opacity="0.88" />

      {/* torso (shirt) */}
      <path
        d="M70 200 C68 250 72 320 88 368 L152 368 C168 320 172 250 170 200
           C166 175 150 158 120 156 C90 158 74 175 70 200 Z"
        fill="url(#shirtM)"
      />
      {/* shirt shading line (chest split) */}
      <path d="M120 168 L120 350" stroke="#3D0200" strokeWidth="2" opacity="0.5" />

      {/* neck */}
      <rect x="108" y="138" width="24" height="26" rx="6" fill="url(#skinM)" />

      {/* head */}
      <ellipse cx="120" cy="112" rx="30" ry="34" fill="url(#skinM)" />
      {/* hair */}
      <path d="M92 102 C90 78 104 64 120 64 C136 64 150 78 148 102
               C148 90 136 80 120 80 C104 80 92 90 92 102 Z" fill="#1A0E0A" />
      {/* jaw shade */}
      <path d="M96 122 C104 134 136 134 144 122" stroke="#7A4B30" strokeWidth="1.5" fill="none" opacity="0.5" />

      {/* arms */}
      <path d="M70 200 C50 210 38 250 40 300 L58 298 C58 260 66 224 80 206 Z" fill="url(#skinM)" />
      <path d="M170 200 C190 210 202 250 200 300 L182 298 C182 260 174 224 160 206 Z" fill="url(#skinM)" />
      {/* sleeves */}
      <path d="M70 200 C58 206 48 222 44 244 L66 240 C68 224 74 210 82 202 Z" fill="url(#shirtM)" />
      <path d="M170 200 C182 206 192 222 196 244 L174 240 C172 224 166 210 158 202 Z" fill="url(#shirtM)" />
      {/* hands */}
      <ellipse cx="46" cy="308" rx="9" ry="11" fill="url(#skinM)" />
      <ellipse cx="194" cy="308" rx="9" ry="11" fill="url(#skinM)" />

      {/* ab/chest definition lines */}
      <g stroke="#3D0200" strokeWidth="1.4" fill="none" opacity="0.45">
        <path d="M100 190 C104 186 116 184 120 184 C124 184 136 186 140 190" />
        <path d="M105 215 L135 215" />
        <path d="M103 235 L137 235" />
        <path d="M103 255 L137 255" />
        <path d="M120 195 L120 270" />
      </g>

      {/* waistline */}
      <path d="M88 368 L152 368 L148 386 L92 386 Z" fill="#2B1B16" />
    </g>
  );
}

function FemaleFigure() {
  return (
    <g>
      <defs>
        <linearGradient id="skinF" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D69B78" />
          <stop offset="100%" stopColor="#B5754C" />
        </linearGradient>
        <linearGradient id="shirtF" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7A1410" />
          <stop offset="100%" stopColor="#570300" />
        </linearGradient>
      </defs>

      {/* legs */}
      <path d="M98 360 L94 500 L114 500 L116 372 Z" fill="#2B1B16" opacity="0.88" />
      <path d="M142 360 L146 500 L126 500 L124 372 Z" fill="#220301" opacity="0.88" />

      {/* torso (hourglass) */}
      <path
        d="M76 196 C70 230 70 260 84 296 C72 320 76 352 90 368 L150 368
           C164 352 168 320 156 296 C170 260 170 230 164 196
           C158 174 144 158 120 156 C96 158 82 174 76 196 Z"
        fill="url(#shirtF)"
      />
      <path d="M120 168 L120 350" stroke="#3D0200" strokeWidth="2" opacity="0.5" />

      {/* neck */}
      <rect x="109" y="138" width="22" height="24" rx="6" fill="url(#skinF)" />

      {/* head */}
      <ellipse cx="120" cy="111" rx="28" ry="33" fill="url(#skinF)" />
      {/* hair */}
      <path d="M88 116 C84 80 100 60 120 60 C140 60 156 80 152 116
               C150 96 146 78 138 70 C146 86 144 104 140 100
               C138 86 130 76 120 76 C110 76 102 86 100 100
               C96 104 92 96 90 116 Z" fill="#1A0E0A" />
      <path d="M98 122 C106 132 134 132 142 122" stroke="#8A5736" strokeWidth="1.5" fill="none" opacity="0.5" />

      {/* arms */}
      <path d="M76 198 C58 208 46 246 48 296 L64 294 C64 258 72 224 84 204 Z" fill="url(#skinF)" />
      <path d="M164 198 C182 208 194 246 192 296 L176 294 C176 258 168 224 156 204 Z" fill="url(#skinF)" />
      <path d="M76 198 C64 204 54 220 50 240 L68 236 C70 220 76 208 84 200 Z" fill="url(#shirtF)" />
      <path d="M164 198 C176 204 186 220 190 240 L172 236 C170 220 164 208 156 200 Z" fill="url(#shirtF)" />
      <ellipse cx="54" cy="304" rx="8" ry="10" fill="url(#skinF)" />
      <ellipse cx="186" cy="304" rx="8" ry="10" fill="url(#skinF)" />

      <g stroke="#3D0200" strokeWidth="1.3" fill="none" opacity="0.4">
        <path d="M104 218 C110 214 130 214 136 218" />
        <path d="M108 246 L132 246" />
        <path d="M120 196 L120 260" />
      </g>

      <path d="M90 368 L150 368 L144 386 L96 386 Z" fill="#2B1B16" />
    </g>
  );
}

/* ----------------------------------------------------------------------
 * ORGAN MARKER + HOVER CARD
 * ------------------------------------------------------------------- */

function OrganMarker({ organKey, anchor, active, onEnter, onLeave, t }) {
  const info = ORGAN_INFO[organKey];
  if (!info) return null;
  return (
    <g
      transform={`translate(${anchor.x}, ${anchor.y})`}
      onMouseEnter={() => onEnter(organKey)}
      onMouseLeave={onLeave}
      onFocus={() => onEnter(organKey)}
      onBlur={onLeave}
      tabIndex={0}
      role="button"
      aria-label={`${info.label} — ${t("avatar.viewDetails")}`}
      style={{ cursor: "pointer", outline: "none" }}
    >
      <circle r="11" fill="#F7E493" opacity={active ? "0.95" : "0.0"} className={active ? "" : ""} />
      <circle
        r="7"
        fill={active ? "#F7E493" : "#FFFBF5"}
        stroke="#570300"
        strokeWidth="2"
        className={active ? "" : "animate-pulseGlow"}
      />
      <circle r="2.4" fill="#570300" />
    </g>
  );
}

/* ----------------------------------------------------------------------
 * MAIN PANEL
 * ------------------------------------------------------------------- */

export default function DonorAvatarPanel({ donorProfile, firstName }) {
  const { t } = useLanguage();
  const [activeOrgan, setActiveOrgan] = useState(null);
  const [cardPos, setCardPos] = useState({ x: 0, y: 0 });
  const wrapRef = useRef(null);

  const gender = donorProfile?.gender === "female" ? "female" : "male";
  const organsPledged = donorProfile?.organs_pledged || [];
  const donatesOrgans = donorProfile?.donor_type === "organ" || donorProfile?.donor_type === "both";

  const handleEnter = useCallback(
    (organKey) => {
      setActiveOrgan(organKey);
      const anchor =
        ORGAN_INFO[organKey]?.anchor?.[gender] || FALLBACK_ORGAN_ANCHOR;
      setCardPos(anchor);
    },
    [gender]
  );
  const handleLeave = useCallback(() => setActiveOrgan(null), []);

  const activeInfo = activeOrgan ? ORGAN_INFO[activeOrgan] : null;

  return (
    <section
      className="rounded-3xl bg-ruby-night overflow-hidden mb-10 animate-riseIn"
      style={{ animationDelay: "20ms" }}
    >
      <div className="grid md:grid-cols-5">
        {/* ------- Stats column ------- */}
        <div className="md:col-span-2 p-6 md:p-8 flex flex-col gap-5">
          <div>
            <span className="font-body text-xs font-medium text-cream/45 uppercase tracking-wide">
              {t("avatar.eyebrow")}
            </span>
            <h2 className="font-display text-2xl text-cream mt-1">
              {firstName ? t("avatar.titleNamed", { name: firstName }) : t("avatar.title")}
            </h2>
          </div>

          <dl className="grid grid-cols-2 gap-3">
            <StatTile label={t("avatar.bloodType")} value={donorProfile?.blood_type || "—"} accent />
            <StatTile
              label={t("avatar.donorType")}
              value={
                donorProfile?.donor_type
                  ? t(`profile.donor.${donorProfile.donor_type}`)
                  : "—"
              }
            />
            <StatTile
              label={t("avatar.height")}
              value={donorProfile?.height_cm ? `${donorProfile.height_cm} cm` : t("avatar.notSet")}
            />
            <StatTile
              label={t("avatar.weight")}
              value={donorProfile?.weight_kg ? `${donorProfile.weight_kg} kg` : t("avatar.notSet")}
            />
          </dl>

          {donatesOrgans && (
            <div className="pt-1">
              <span className="font-body text-xs font-medium text-cream/45 uppercase tracking-wide">
                {t("avatar.pledgedOrgans")}
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {organsPledged.length > 0 ? (
                  organsPledged.map((organKey) => (
                    <span
                      key={organKey}
                      className="font-body text-xs font-medium text-cream bg-cream/10 border border-cream/15 rounded-full px-3 py-1"
                    >
                      {ORGAN_INFO[organKey]?.label || organKey}
                    </span>
                  ))
                ) : (
                  <span className="font-body text-xs text-cream/40">{t("avatar.noOrgans")}</span>
                )}
              </div>
            </div>
          )}

          <p className="font-body text-xs text-cream/40 mt-auto pt-4">
            {donatesOrgans ? t("avatar.hint") : t("avatar.hintBloodOnly")}
          </p>
        </div>

        {/* ------- Avatar column ------- */}
        <div
          ref={wrapRef}
          className="md:col-span-3 relative bg-ruby-deep min-h-90 flex items-center justify-center px-4 py-8"
        >
          <svg viewBox="0 0 240 520" className="w-full max-w-65 h-auto" aria-hidden={false} role="img">
            <title>{t("avatar.svgTitle")}</title>
            {gender === "female" ? <FemaleFigure /> : <MaleFigure />}

            {donatesOrgans &&
              organsPledged.map((organKey) => {
                const anchorPct = ORGAN_INFO[organKey]?.anchor?.[gender] || FALLBACK_ORGAN_ANCHOR;
                const anchor = { x: (anchorPct.x / 100) * 240, y: (anchorPct.y / 100) * 520 };
                return (
                  <OrganMarker
                    key={organKey}
                    organKey={organKey}
                    anchor={anchor}
                    active={activeOrgan === organKey}
                    onEnter={handleEnter}
                    onLeave={handleLeave}
                    t={t}
                  />
                );
              })}
          </svg>

          {!donatesOrgans && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 font-body text-xs text-cream/40 text-center px-6">
              {t("avatar.bloodOnlyCaption")}
            </p>
          )}

          {/* Hover/focus card */}
          {activeInfo && (
            <div
              className="absolute z-10 w-64 rounded-2xl bg-cream text-ink p-4 shadow-xl border border-ink/8 animate-riseIn pointer-events-none"
              style={{
                left: `${Math.min(Math.max(cardPos.x, 22), 78)}%`,
                top: `${Math.min(Math.max(cardPos.y, 8), 80)}%`,
                transform: "translate(-50%, calc(-100% - 14px))",
                animationDuration: "180ms",
              }}
            >
              <p className="font-display text-lg text-ruby leading-tight">{activeInfo.label}</p>
              <p className="font-body text-xs text-ink/65 mt-1.5 leading-relaxed">{activeInfo.summary}</p>
              <dl className="mt-3 space-y-1.5">
                <CardRow label={t("avatar.card.massDonated")} value={activeInfo.massDonated} />
                <CardRow label={t("avatar.card.recovery")} value={activeInfo.recovery} />
              </dl>
              <a
                href={activeInfo.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto font-body text-xs font-semibold text-clementine hover:text-clementine/80 transition-colors mt-3 inline-flex items-center gap-1"
              >
                {t("avatar.card.knowMore")} <span aria-hidden="true">→</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function StatTile({ label, value, accent }) {
  return (
    <div className={`rounded-2xl px-4 py-3 ${accent ? "bg-mist/15 border border-mist/20" : "bg-cream/5 border border-cream/10"}`}>
      <dt className="font-body text-[10px] font-medium text-cream/45 uppercase tracking-wide">{label}</dt>
      <dd className={`font-display text-xl mt-0.5 ${accent ? "text-mist" : "text-cream"}`}>{value}</dd>
    </div>
  );
}

function CardRow({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="font-body text-[11px] text-ink/45 uppercase tracking-wide whitespace-nowrap">{label}</dt>
      <dd className="font-body text-xs text-ink font-medium text-right">{value}</dd>
    </div>
  );
}