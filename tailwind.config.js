/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // fontFamily: identical across dashboard / threat-intel / sentineltrace
      // originals (Inter + JetBrains Mono) — merged into one entry.
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        // --- from nova-nexus-dashboard/tailwind.theme.snippet.js ---
        surface: {
          50: "#1e293b",
          100: "#141B2D",
          200: "#0F1420",
          300: "#0B1120",
          400: "#070B14",
        },
        // --- from nova-nexus-threat-intel/tailwind.config.snippet.js ---
        "nn-bg": "#040810",
        "nn-surface": "#0f172a",
        "nn-border": "#1e293b",
        "nn-accent": "#22d3ee",
        "nn-accent-dim": "#0e7490",
        // --- from sentineltrace-investigation-page/tailwind.config.js ---
        base: {
          950: "#05080A",
          900: "#0A1013",
          850: "#0D1518",
          800: "#111C20",
          700: "#1A2A2F",
          600: "#26393F",
          500: "#3C5259",
          400: "#5C7A82",
          300: "#8DA5AB",
          200: "#C2D2D6",
          100: "#E4EDEF",
        },
        signal: {
          teal: "#2DD4BF",
          tealDim: "#0F5C55",
          amber: "#F5A623",
          amberDim: "#5C3F0C",
          red: "#F04438",
          redDim: "#5C1712",
          green: "#3FC98A",
          greenDim: "#0F4A31",
        },
      },
      boxShadow: {
        // threat-intel
        "nn-card": "0 0 0 1px rgba(15, 23, 42, 0.4)",
        "nn-glow": "0 0 24px rgba(34, 211, 238, 0.15)",
        // sentineltrace
        glow: "0 0 40px -8px rgba(45, 212, 191, 0.35)",
        glowRed: "0 0 40px -8px rgba(240, 68, 56, 0.45)",
      },
      keyframes: {
        // sentineltrace only — dashboard/threat-intel/new-investigation
        // ship their keyframes as plain CSS (theme.css / globals.snippet.css),
        // not as Tailwind config, so nothing to merge there.
        sweep: { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } },
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: "0.8" },
          "80%": { transform: "scale(1.6)", opacity: "0" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        blink: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.35" } },
        fadeUp: { "0%": { opacity: "0", transform: "translateY(6px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
      animation: {
        sweep: "sweep 4s linear infinite",
        pulseRing: "pulseRing 2.2s cubic-bezier(0.2,0.6,0.4,1) infinite",
        blink: "blink 1.8s ease-in-out infinite",
        fadeUp: "fadeUp 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
