import type { ThreatSeverity } from "../types/threat.types";

/**
 * Single source of truth for severity styling.
 * Reuse this map in every future module (GeoLocation, Forensics, etc.)
 * so severity colors stay consistent app-wide.
 */
export const SEVERITY_META: Record<
  ThreatSeverity,
  { label: string; text: string; bg: string; border: string; dot: string; hex: string }
> = {
  critical: {
    label: "Critical",
    text: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    dot: "bg-rose-500",
    hex: "#f43f5e",
  },
  high: {
    label: "High",
    text: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    dot: "bg-orange-500",
    hex: "#fb923c",
  },
  medium: {
    label: "Medium",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    dot: "bg-amber-500",
    hex: "#fbbf24",
  },
  low: {
    label: "Low",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    dot: "bg-emerald-500",
    hex: "#34d399",
  },
  info: {
    label: "Info",
    text: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    dot: "bg-cyan-500",
    hex: "#22d3ee",
  },
};

export const STATUS_META: Record<
  string,
  { label: string; text: string; bg: string; border: string }
> = {
  open: { label: "Open", text: "text-cyan-300", bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
  in_review: { label: "In Review", text: "text-amber-300", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  escalated: { label: "Escalated", text: "text-rose-300", bg: "bg-rose-500/10", border: "border-rose-500/30" },
  resolved: { label: "Resolved", text: "text-emerald-300", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  false_positive: { label: "False Positive", text: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/30" },
};
