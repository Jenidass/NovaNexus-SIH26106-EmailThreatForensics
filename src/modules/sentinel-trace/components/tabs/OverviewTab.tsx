import { Fingerprint, Percent, Info } from 'lucide-react';
import type { CaseSummary, DetectedSignal, RiskCategory, Recommendation } from '../../types/investigation';
import { severityStyles } from '../../lib/severity';
import ThreatScoreGauge from '../ThreatScoreGauge';
import Card from '../ui/Card';
import Tooltip from '../ui/Tooltip';
import DetectedSignals from '../overview/DetectedSignals';
import RiskBreakdown from '../overview/RiskBreakdown';
import Recommendations from '../overview/Recommendations';

interface OverviewTabProps {
  summary: CaseSummary;
  signals: DetectedSignal[];
  risk: RiskCategory[];
  recommendations: Recommendation[];
}

export default function OverviewTab({ summary, signals, risk, recommendations }: OverviewTabProps) {
  const style = severityStyles[summary.severity];

  return (
    <div className="space-y-5 animate-fadeUp">
      {/* 1 & 2 & 3: Threat score, classification, confidence — hero card */}
      <Card className={`border-2 ${style.border} ${style.glow}`}>
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <ThreatScoreGauge score={summary.threatScore} severity={summary.severity} />

          <div className="flex-1 w-full grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-base-700 bg-base-800/60 p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Fingerprint size={14} className="text-signal-red" />
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-base-400">
                  Threat Classification
                </p>
                <Tooltip content="The category the automated engine has assigned this case to, based on the strongest matching indicator pattern." />
              </div>
              <p className="text-2xl font-bold font-mono text-signal-red">{summary.threat}</p>
            </div>

            <div className="rounded-lg border border-base-700 bg-base-800/60 p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Percent size={14} className="text-signal-teal" />
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-base-400">
                  Detection Confidence
                </p>
                <Tooltip content="How certain the engine is in this classification, based on signal strength and historical pattern match rate." />
              </div>
              <p className="text-2xl font-bold font-mono text-base-100">{summary.confidence}%</p>
              <div className="mt-2 h-1.5 rounded-full bg-base-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-signal-teal transition-all duration-1000"
                  style={{ width: `${summary.confidence}%` }}
                />
              </div>
            </div>

            <div className="sm:col-span-2 rounded-lg border border-base-700 bg-base-800/40 p-4 flex items-start gap-2.5">
              <Info size={15} className="text-base-400 mt-0.5 shrink-0" />
              <p className="text-xs text-base-400 leading-relaxed">
                This case was opened automatically by <span className="text-base-200">{summary.analyst}</span> at{' '}
                <span className="font-mono text-base-200">
                  {new Date(summary.openedAt).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
                . All findings below are derived from static message analysis — no data has left your organization's
                environment.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 space-y-5">
          <DetectedSignals signals={signals} />
          <Recommendations items={recommendations} />
        </div>
        <div className="lg:col-span-2">
          <RiskBreakdown data={risk} />
        </div>
      </div>
    </div>
  );
}
