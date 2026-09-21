import type { DemoMode } from "../../hooks/useDashboardData";

interface DemoModeSwitcherProps {
  mode: DemoMode;
  onChange: (mode: DemoMode) => void;
}

const OPTIONS: { value: DemoMode; label: string }[] = [
  { value: "success", label: "Live data" },
  { value: "empty", label: "Empty state" },
  { value: "error", label: "Error state" },
];

/**
 * Not part of the production UI — lets a demo presenter switch panels
 * between loading/success/empty/error without wiring a real backend.
 * Safe to delete this file once a real API is connected.
 */
export function DemoModeSwitcher({ mode, onChange }: DemoModeSwitcherProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/60 p-1 text-xs">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
            mode === opt.value
              ? "bg-cyan-500/15 text-cyan-300"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
