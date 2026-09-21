/**
 * Nova Nexus — Tailwind theme extension.
 *
 * This project intentionally ships without its own tailwind.config.js
 * (per project constraints). Merge this `extend` block into your app's
 * existing tailwind.config.js so every module shares the same design tokens.
 *
 * Usage in your tailwind.config.js:
 *
 *   const novaNexusTheme = require("./nova-nexus-dashboard/tailwind.theme.snippet.js");
 *   module.exports = {
 *     content: [
 *       "./index.html",
 *       "./src/**\/*.{ts,tsx}",
 *       "./nova-nexus-dashboard/src/**\/*.{ts,tsx}",
 *     ],
 *     theme: { extend: novaNexusTheme.extend },
 *     plugins: [],
 *   };
 */
module.exports = {
  extend: {
    fontFamily: {
      sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
    },
    colors: {
      // Nova Nexus surface scale (navy/black)
      surface: {
        50: "#1e293b",
        100: "#141B2D",
        200: "#0F1420",
        300: "#0B1120",
        400: "#070B14",
      },
    },
  },
};
