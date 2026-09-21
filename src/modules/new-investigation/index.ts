/**
 * Public entry point for the New Investigation module.
 * Added during integration — no original component files were modified.
 * Import the page from here, not from deep paths, so future refactors
 * of this module's internals don't ripple into route files.
 */
export { NewInvestigationPage } from "./components/investigation/NewInvestigationPage";

// Re-exported in case another module needs to render New-Investigation UI
// primitives directly. Names are intentionally NOT re-exported from the
// project-wide barrel (src/modules/index.ts) to avoid colliding with the
// same-named components in dashboard / threat-intel — consumers must import
// from this module-scoped path explicitly.
export * from "./components/ui/Button";
export * from "./components/ui/Card";
export * from "./components/ui/ProgressBar";
export * from "./components/ui/StatePanels";
export * from "./components/ui/ThreatBadge";

export * from "./types/investigation";
