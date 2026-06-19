import { useRef } from "react";

/**
 * BloodFlow — an abstract ruby liquid wave that flows in from the left edge
 * and settles into a slow ambient pulse. This is the landing page's one
 * deliberate signature moment: everything else on the page stays quiet.
 *
 * Implemented as layered SVG paths animated with native SMIL rather than a
 * canvas particle system — cheaper to render and stays crisp at any size.
 * prefers-reduced-motion is respected via the CSS below.
 */
export default function BloodFlow({ className = "" }) {
  const svgRef = useRef(null);

  return (
    <div className={`relative w-full overflow-hidden ${className}`} aria-hidden="true">
      <svg
        ref={svgRef}
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="rubyFade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#570300" stopOpacity="0" />
            <stop offset="35%" stopColor="#570300" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#3D0200" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="rubyFadeSoft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#570300" stopOpacity="0" />
            <stop offset="45%" stopColor="#570300" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#570300" stopOpacity="0.06" />
          </linearGradient>
        </defs>

        <path className="flow-path" fill="url(#rubyFadeSoft)">
          <animate
            attributeName="d"
            dur="9s"
            repeatCount="indefinite"
            values="
              M0,420 C200,380 350,460 600,420 C850,380 1000,440 1200,400 L1200,600 L0,600 Z;
              M0,400 C220,440 380,370 600,400 C820,430 1020,380 1200,420 L1200,600 L0,600 Z;
              M0,420 C200,380 350,460 600,420 C850,380 1000,440 1200,400 L1200,600 L0,600 Z
            "
          />
        </path>

        <path className="flow-path" fill="url(#rubyFade)" opacity="0">
          <animate
            attributeName="opacity"
            dur="1.8s"
            begin="0.2s"
            fill="freeze"
            values="0;1"
            keyTimes="0;1"
          />
          <animate
            attributeName="d"
            dur="10s"
            repeatCount="indefinite"
            values="
              M0,480 C250,440 400,510 650,470 C880,435 1050,490 1200,455 L1200,600 L0,600 Z;
              M0,460 C270,500 420,440 650,460 C870,480 1040,440 1200,475 L1200,600 L0,600 Z;
              M0,480 C250,440 400,510 650,470 C880,435 1050,490 1200,455 L1200,600 L0,600 Z
            "
          />
        </path>

        <path
          className="flow-line"
          fill="none"
          stroke="#570300"
          strokeWidth="2"
          strokeOpacity="0.35"
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            dur="10s"
            repeatCount="indefinite"
            values="
              M0,470 C250,430 400,500 650,460 C880,425 1050,480 1200,445;
              M0,450 C270,490 420,430 650,450 C870,470 1040,430 1200,465;
              M0,470 C250,430 400,500 650,460 C880,425 1050,480 1200,445
            "
          />
          <animate
            attributeName="opacity"
            dur="1.8s"
            begin="0.2s"
            fill="freeze"
            values="0;1"
            keyTimes="0;1"
          />
        </path>
      </svg>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .flow-path animate, .flow-line animate {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}