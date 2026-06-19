/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ruby: {
          DEFAULT: "#570300",
          deep: "#3D0200",
          50: "#FBEEED",
        },
        mist: {
          DEFAULT: "#F7E493",
          soft: "#FBF0BE",
        },
        surface: "#F5EDEA",
        ink: "#1A1310",
      },
      fontFamily: {
        display: ["Archivo Black", "Arial Narrow", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(87,3,0,0.15)" },
          "50%": { boxShadow: "0 0 0 8px rgba(87,3,0,0)" },
        },
      },
      animation: {
        pulseGlow: "pulseGlow 2.4s ease-out infinite",
      },
    },
  },
  plugins: [],
}