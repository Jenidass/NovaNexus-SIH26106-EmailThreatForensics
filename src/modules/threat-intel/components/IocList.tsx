import React, { useMemo, useState } from "react";
import { ListFilter, Hash, Globe, Link2, Mail, Network, Copy, Check } from "lucide-react";
import type { IndicatorOfCompromise, IndicatorType } from "../types/threatIntel.types";
import { surfaceCard, surfaceCardHover, sectionHeading } from "../theme/socTheme";
import { ReputationBadge } from "./ReputationBadge";

interface IocListProps {
  indicators: IndicatorOfCompromise[];
}

const typeIcon: Record<IndicatorType, React.ComponentType<{ className?: string }>> = {
  ip: Network,
  domain: Globe,
  url: Link2,
  hash: Hash,
  email: Mail,
};

const typeLabel: Record<IndicatorType, string> = {
  ip: "IP",
  domain: "Domain",
  url: "URL",
  hash: "Hash",
  email: "Email",
};

const filters: Array<IndicatorType | "all"> = ["all", "ip", "domain", "url", "hash", "email"];

function truncateMiddle(value: string, max = 42): string {
  if (value.length <= max) return value;
  const keep = Math.floor((max - 3) / 2);
  return `${value.slice(0, keep)}...${value.slice(value.length - keep)}`;
}

const CopyButton: React.FC<{ value: string }> = ({ value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — fail silently, this is a non-critical affordance.
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="shrink-0 rounded-md border border-slate-800 p-1.5 text-slate-500 transition-colors hover:border-cyan-700/50 hover:text-cyan-400"
      aria-label="Copy indicator value"
      type="button"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
};

export const IocList: React.FC<IocListProps> = ({ indicators }) => {
  const [activeFilter, setActiveFilter] = useState<IndicatorType | "all">("all");

  const filtered = useMemo(
    () =>
      activeFilter === "all"
        ? indicators
        : indicators.filter((i) => i.type === activeFilter),
    [indicators, activeFilter]
  );

  return (
    <div className={`${surfaceCard} p-5`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ListFilter className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            Indicators of Compromise
          </h3>
          <span className="rounded-full border border-slate-700 bg-slate-800/60 px-2 py-0.5 text-[11px] text-slate-400">
            {indicators.length}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium capitalize transition-colors ${
                activeFilter === f
                  ? "bg-cyan-500/15 text-cyan-300 ring-1 ring-inset ring-cyan-500/30"
                  : "text-slate-500 hover:bg-slate-800/60 hover:text-slate-300"
              }`}
            >
              {f === "all" ? "All" : typeLabel[f]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">
          No indicators match this filter.
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map((ioc) => {
            const Icon = typeIcon[ioc.type];
            return (
              <div
                key={ioc.id}
                className={`flex flex-col gap-2 rounded-lg border border-slate-800/80 bg-slate-950/30 p-3 sm:flex-row sm:items-center sm:justify-between ${surfaceCardHover}`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-800 bg-slate-900 text-slate-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-center gap-2">
                      <span className="truncate font-mono text-sm text-slate-200">
                        {truncateMiddle(ioc.value)}
                      </span>
                      <CopyButton value={ioc.value} />
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {ioc.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded border border-slate-800 bg-slate-900 px-1.5 py-0.5 text-[10px] text-slate-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3 pl-11 sm:pl-0">
                  <div className="text-right">
                    <p className={sectionHeading}>Confidence</p>
                    <p className="font-mono text-xs text-slate-300">{ioc.confidence}%</p>
                  </div>
                  <ReputationBadge reputation={ioc.reputation} size="sm" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default IocList;
