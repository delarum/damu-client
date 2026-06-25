const BLOOD_TYPES = ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"];

/**
 * The dark ruby-night panel shown alongside auth forms (sign up, login).
 * A quieter echo of the Landing hero's bag + blood-type wheel, scaled down,
 * so the brand carries through every screen rather than auth feeling like
 * a different, generic app bolted onto a colorful marketing site.
 */
export default function AuthSidePanel({ eyebrow, heading, body }) {
  return (
    <div className="hidden lg:flex lg:w-[44%] bg-ruby-night relative overflow-hidden flex-col justify-between px-12 py-10">
      <span className="font-display text-xl tracking-tight text-cream relative z-10">
        DamuLink
      </span>

      <div className="relative z-10">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-mist/80 mb-4">
          {eyebrow}
        </p>
        <h2 className="font-display font-medium text-3xl leading-[1.15] text-cream mb-3 max-w-sm">
          {heading}
        </h2>
        <p className="font-body text-sm text-cream/55 max-w-xs leading-relaxed">
          {body}
        </p>
      </div>

      <div className="relative z-10 flex items-center justify-center pt-8">
        <MiniBagWheel />
      </div>
    </div>
  );
}

function MiniBagWheel() {
  const radius = 110;
  const center = 130;

  return (
    <svg viewBox="0 0 260 260" className="w-56 h-56" aria-hidden="true">
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#FFFBF5"
        strokeOpacity="0.12"
        strokeWidth="1.5"
        strokeDasharray="2 7"
      />

      {BLOOD_TYPES.map((type, i) => {
        const angle = (i / BLOOD_TYPES.length) * 2 * Math.PI - Math.PI / 2;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        return (
          <g key={type}>
            <circle cx={x} cy={y} r="15" fill="#220301" stroke="#F7E493" strokeOpacity="0.3" strokeWidth="1.2" />
            <text
              x={x}
              y={y + 3.5}
              textAnchor="middle"
              fontFamily="IBM Plex Mono, monospace"
              fontSize="9"
              fill="#F7E493"
            >
              {type}
            </text>
          </g>
        );
      })}

      <g transform={`translate(${center},${center}) scale(0.55)`}>
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
          strokeWidth="3"
        />
        <path
          d="M -64 5
             Q -60 92, 0 96
             Q 60 92, 64 5
             Q 64 30, 0 34
             Q -64 30, -64 5 Z"
          fill="#F7E493"
          fillOpacity="0.85"
        />
        <rect x="-12" y="-100" width="24" height="22" rx="6" fill="none" stroke="#FFFBF5" strokeWidth="3" />
        <path
          d="M 0 -25 C 14 -10, 18 5, 0 18 C -18 5, -14 -10, 0 -25 Z"
          fill="#570300"
        />
      </g>
    </svg>
  );
}