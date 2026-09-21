import { useEffect, useState } from 'react';
import type { Severity } from '../types/investigation';
import { severityStyles } from '../lib/severity';

interface ThreatScoreGaugeProps {
  score: number; // 0-100
  severity: Severity;
}

const SIZE = 220;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const severityStroke: Record<Severity, string> = {
  SAFE: '#3FC98A',
  SUSPICIOUS: '#F5A623',
  HIGH: '#FB923C',
  CRITICAL: '#F04438',
};

export default function ThreatScoreGauge({ score, severity }: ThreatScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const style = severityStyles[severity];
  const stroke = severityStroke[severity];

  useEffect(() => {
    let frame: number;
    const duration = 1100;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const dashOffset = CIRCUMFERENCE - (animatedScore / 100) * CIRCUMFERENCE;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: SIZE, height: SIZE }}>
      {/* ambient pulse rings for critical/high severity */}
      {(severity === 'CRITICAL' || severity === 'HIGH') && (
        <>
          <span
            className="absolute inset-4 rounded-full border"
            style={{ borderColor: stroke, animation: 'pulseRing 2.2s cubic-bezier(0.2,0.6,0.4,1) infinite' }}
          />
          <span
            className="absolute inset-4 rounded-full border"
            style={{
              borderColor: stroke,
              animation: 'pulseRing 2.2s cubic-bezier(0.2,0.6,0.4,1) infinite',
              animationDelay: '1.1s',
            }}
          />
        </>
      )}

      <svg width={SIZE} height={SIZE} className="-rotate-90" role="img" aria-label={`Threat score ${score} out of 100`}>
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="#1A2A2F"
          strokeWidth={STROKE}
        />
        {/* sweeping radar arc, subtle, behind the value arc */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={stroke}
          strokeOpacity={0.15}
          strokeWidth={STROKE}
          strokeDasharray={`${CIRCUMFERENCE * 0.06} ${CIRCUMFERENCE}`}
          className="origin-center animate-sweep"
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={stroke}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>

      <div className="absolute flex flex-col items-center">
        <span className="font-mono text-5xl font-bold tabular-nums text-base-100 tracking-tight">
          {animatedScore}
        </span>
        <span className="text-xs font-mono text-base-400 tracking-wide">/ 100</span>
        <span className={`mt-2 text-[11px] font-mono font-semibold uppercase tracking-[0.15em] ${style.text}`}>
          {style.label}
        </span>
      </div>
    </div>
  );
}
