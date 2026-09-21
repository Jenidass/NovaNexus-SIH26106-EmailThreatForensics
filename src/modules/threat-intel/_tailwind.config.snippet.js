/**
 * Nova Nexus — shared Tailwind tokens for the SOC-style theme.
 *
 * This is a SNIPPET, not a standalone config. Merge the pieces below
 * into your host app's real tailwind.config.js so every module (Threat
 * Intelligence, and future ones) renders with the same dark navy /
 * cyan-blue identity.
 *
 * 1) Make sure `content` includes this package's files, e.g.:
 *      content: [
 *        "./src/**\/*.{ts,tsx}",
 *        "./node_modules/nova-nexus-threat-intel/src/**\/*.{ts,tsx}",
 *      ]
 *
 * 2) Merge this `theme.extend` into your config:
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        // Base SOC surface colors (also directly usable as slate-*/cyan-*
        // Tailwind defaults — listed here for clarity/reference only).
        "nn-bg": "#040810",
        "nn-surface": "#0f172a", // slate-900
        "nn-border": "#1e293b", // slate-800
        "nn-accent": "#22d3ee", // cyan-400
        "nn-accent-dim": "#0e7490", // cyan-700
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        "nn-card": "0 0 0 1px rgba(15, 23, 42, 0.4)",
        "nn-glow": "0 0 24px rgba(34, 211, 238, 0.15)",
      },
    },
  },
};
