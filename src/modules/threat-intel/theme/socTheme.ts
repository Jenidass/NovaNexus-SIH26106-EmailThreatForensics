/**
 * Nova Nexus — shared SOC visual theme tokens.
 *
 * Import these helpers wherever severity/reputation/status colors are
 * needed so every module (Threat Intel, future modules, etc.) stays
 * visually consistent. Backed by the Tailwind config in this package
 * (see tailwind.config.snippet.js) — the class names below all resolve
 * against the extended palette + shadows defined there.
 */

import type { ReputationStatus, SeverityLevel } from "../types/threatIntel.types";

export const severityStyles: Record<
  SeverityLevel,
  { text: string; bg: string; border: string; dot: string; ring: string; label: string }
> = {
  critical: {
    text: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    dot: "bg-rose-500",
    ring: "ring-rose-500/20",
    label: "Critical",
  },
  high: {
    text: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    dot: "bg-orange-500",
    ring: "ring-orange-500/20",
    label: "High",
  },
  medium: {
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    dot: "bg-amber-500",
    ring: "ring-amber-500/20",
    label: "Medium",
  },
  low: {
    text: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    dot: "bg-cyan-500",
    ring: "ring-cyan-500/20",
    label: "Low",
  },
  info: {
    text: "text-slate-400",
    bg: "bg-slate-500/10",
    border: "border-slate-500/30",
    dot: "bg-slate-500",
    ring: "ring-slate-500/20",
    label: "Info",
  },
};

export const reputationStyles: Record<
  ReputationStatus,
  { text: string; bg: string; border: string; label: string }
> = {
  malicious: {
    text: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    label: "Malicious",
  },
  suspicious: {
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    label: "Suspicious",
  },
  unverified: {
    text: "text-slate-400",
    bg: "bg-slate-500/10",
    border: "border-slate-500/30",
    label: "Unverified",
  },
  clean: {
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    label: "Clean",
  },
};

/** Base surface classes shared by every card in the module family. */
export const surfaceCard =
  "rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm shadow-[0_0_0_1px_rgba(15,23,42,0.4)]";

export const surfaceCardHover =
  "transition-colors duration-200 hover:border-cyan-800/60 hover:bg-slate-900/80";

export const sectionHeading =
  "text-xs font-semibold uppercase tracking-wider text-slate-400";

export const monoValue = "font-mono text-slate-200";
