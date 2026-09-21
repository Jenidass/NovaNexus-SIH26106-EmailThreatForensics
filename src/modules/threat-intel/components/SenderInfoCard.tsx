import React from "react";
import { UserRound, AtSign, CornerDownRight, History, TriangleAlert } from "lucide-react";
import type { SenderInfo } from "../types/threatIntel.types";
import { surfaceCard, sectionHeading } from "../theme/socTheme";

interface SenderInfoCardProps {
  senderInfo: SenderInfo;
}

export const SenderInfoCard: React.FC<SenderInfoCardProps> = ({ senderInfo }) => {
  return (
    <div className={`${surfaceCard} p-5`}>
      <div className="mb-4 flex items-center gap-2">
        <UserRound className="h-4 w-4 text-cyan-400" />
        <h3 className="text-sm font-semibold text-slate-200">Sender Information</h3>
      </div>

      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800/60 text-sm font-semibold text-slate-300">
          {senderInfo.displayName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-100">
            {senderInfo.displayName}
          </p>
          <p className="flex items-center gap-1 truncate font-mono text-xs text-slate-400">
            <AtSign className="h-3 w-3 shrink-0" />
            {senderInfo.emailAddress}
          </p>
        </div>
        {senderInfo.spoofed && (
          <span className="ml-auto flex shrink-0 items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-400">
            <TriangleAlert className="h-3 w-3" /> Spoofed
          </span>
        )}
      </div>

      {senderInfo.replyTo && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-300">
          <CornerDownRight className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">
            Reply-To mismatch: <span className="font-mono">{senderInfo.replyTo}</span>
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
          <p className={`${sectionHeading} flex items-center gap-1.5`}>
            <History className="h-3 w-3" /> Prior Contact
          </p>
          <p className="mt-1.5 text-sm font-medium text-slate-200">
            {senderInfo.firstTimeContact
              ? "First-time sender"
              : `${senderInfo.historicalMessageCount} prior messages`}
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
          <p className={sectionHeading}>Organization</p>
          <p className="mt-1.5 truncate text-sm font-medium text-slate-200">
            {senderInfo.organization ?? "Unresolved"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SenderInfoCard;
