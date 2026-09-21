import { RadialBar, RadialBarChart, PolarAngleAxis } from 'recharts';
import type { ThreatScore } from '../../types/investigation';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { ThreatBadge, threatLevelColor } from '../ui/ThreatBadge';
import { ProgressBar } from '../ui/ProgressBar';
import { Gauge } from 'lucide-react';

const scoreColor = (level: ThreatScore['level']) => {
  const map: Record<ThreatScore['level'], string> = {
    critical: '#f43f5e', high: '#f97316', medium: '#eab308', low: '#38bdf8', clean: '#34d399',
  };
  return map[level];
};

const riskRows = (s: ThreatScore) => [
  { label: 'Header risk', value: s.headerRisk },
  { label: 'Content risk', value: s.contentRisk },
  { label: 'Link risk', value: s.linkRisk },
  { label: 'Attachment risk', value: s.attachmentRisk },
  { label: 'Sender reputation risk', value: s.reputationRisk },
];

export function ThreatScoreCard({ score }: { score: ThreatScore }) {
  const color = scoreColor(score.level);
  const data = [{ name: 'score', value: score.overall, fill: color }];

  return (
    <Card glow>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-[var(--nx-cyan)]" />
          <h3 className="text-sm font-semibold text-[var(--nx-text)]">Threat Score</h3>
        </div>
        <ThreatBadge level={score.level} />
      </CardHeader>
      <CardBody>
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32 flex-shrink-0">
            <RadialBarChart width={128} height={128} cx={64} cy={64} innerRadius={48} outerRadius={62} data={data} startAngle={90} endAngle={-270}>
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar background={{ fill: 'var(--nx-border)' }} dataKey="value" cornerRadius={20} angleAxisId={0} />
            </RadialBarChart>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold" style={{ color }}>{score.overall}</span>
              <span className="text-[10px] text-[var(--nx-text-faint)]">/ 100</span>
            </div>
          </div>

          <div className="flex-1 space-y-2.5">
            {riskRows(score).map((r) => (
              <div key={r.label}>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-[var(--nx-text-dim)]">{r.label}</span>
                  <span className={threatLevelColor(score.level)}>{r.value}</span>
                </div>
                <ProgressBar value={r.value} height="h-1" />
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
