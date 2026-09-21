import React from "react";
import { Share2, Globe, Network, Link2, Hash, Mail } from "lucide-react";
import type { IndicatorType, RelatedIndicator } from "../types/threatIntel.types";
import { surfaceCard, surfaceCardHover } from "../theme/socTheme";
import { SeverityBadge } from "./SeverityBadge";

interface RelatedIndicatorsCardProps {
  relatedIndicators: RelatedIndicator[];
}

const typeIcon: Record<IndicatorType, React.ComponentType<{ className?: string }>> = {
  ip: Network,
  domain: Globe,
  url: Link2,
  hash: Hash,
  email: Mail,
};

export const RelatedIndicatorsCard: React.FC<RelatedIndicatorsCardProps> = ({
  relatedIndicators,
}) => {
  if (relatedIndicators.length === 0) {
    return (
      <div className={`${surfaceCard} flex flex-col items-center justify-center gap-2 p-8 text-center`}>
        <Share2 className="h-5 w-5 text-slate-600" />
        <p className="text-sm text-slate-500">
          No related indicators found in the threat graph for this case.
        </p>
      </div>
    );
  }

  return (
    <div className={`${surfaceCard} p-5`}>
      <div className="mb-4 flex items-center gap-2">
        <Share2 className="h-4 w-4 text-cyan-400" />
        <h3 className="text-sm font-semibold text-slate-200">
          Related Suspicious Indicators
        </h3>
        <span className="rounded-full border border-slate-700 bg-slate-800/60 px-2 py-0.5 text-[11px] text-slate-400">
          {relatedIndicators.length} linked
        </span>
      </div>

      <div className="space-y-2">
        {relatedIndicators.map((rel) => {
          const Icon = typeIcon[rel.type];
          return (
            <div
              key={rel.id}
              className={`flex flex-col gap-2 rounded-lg border border-slate-800/80 bg-slate-950/30 p-3 sm:flex-row sm:items-center sm:justify-between ${surfaceCardHover}`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-800 bg-slate-900 text-slate-400">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-mono text-sm text-slate-200">{rel.value}</p>
                  <p className="truncate text-xs text-slate-500">{rel.relation}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3 pl-11 sm:pl-0">
                <span className="text-[11px] text-slate-500">
                  {rel.seenInCampaigns} campaigns
                </span>
                <SeverityBadge severity={rel.severity} size="sm" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedIndicatorsCard;
