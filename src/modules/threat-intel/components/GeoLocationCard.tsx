import React from "react";
import { MapPin, Building2, Clock3, TriangleAlert } from "lucide-react";
import type { GeoLocation } from "../types/threatIntel.types";
import { surfaceCard, sectionHeading, monoValue } from "../theme/socTheme";

interface GeoLocationCardProps {
  geoLocation: GeoLocation;
}

export const GeoLocationCard: React.FC<GeoLocationCardProps> = ({ geoLocation }) => {
  return (
    <div className={`${surfaceCard} p-5`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200">GeoLocation Details</h3>
        </div>
        {geoLocation.isHighRiskRegion && (
          <span className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-400">
            <TriangleAlert className="h-3 w-3" /> High-risk region
          </span>
        )}
      </div>

      <div className="mb-4 flex items-center gap-3">
        <span className="text-3xl leading-none">
          {countryCodeToFlagEmoji(geoLocation.countryCode)}
        </span>
        <div>
          <p className="text-lg font-semibold text-slate-100">
            {geoLocation.city}, {geoLocation.country}
          </p>
          <p className="text-xs text-slate-500">{geoLocation.region}</p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
          <p className={sectionHeading}>Coordinates</p>
          <p className={`mt-1.5 text-xs ${monoValue}`}>
            {geoLocation.latitude.toFixed(4)}, {geoLocation.longitude.toFixed(4)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
          <p className={`${sectionHeading} flex items-center gap-1.5`}>
            <Clock3 className="h-3 w-3" /> Timezone
          </p>
          <p className="mt-1.5 font-mono text-xs text-slate-200">{geoLocation.timezone}</p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
        <p className={`${sectionHeading} mb-2 flex items-center gap-1.5`}>
          <Building2 className="h-3 w-3" /> ISP / ASN
        </p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">ASN</span>
          <span className="font-mono text-slate-200">{geoLocation.asn.asn}</span>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-xs">
          <span className="text-slate-500">ISP</span>
          <span className="truncate pl-3 text-right text-slate-200">
            {geoLocation.asn.isp}
          </span>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-xs">
          <span className="text-slate-500">Organization</span>
          <span className="truncate pl-3 text-right text-slate-200">
            {geoLocation.asn.organization}
          </span>
        </div>
      </div>
    </div>
  );
};

/** Converts a 2-letter ISO country code into its flag emoji — no image assets needed. */
function countryCodeToFlagEmoji(countryCode: string): string {
  if (countryCode.length !== 2) return "🏳";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export default GeoLocationCard;
