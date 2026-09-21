import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, Tooltip as RTooltip } from 'recharts';
import type { RiskCategory } from '../../types/investigation';
import Card from '../ui/Card';

const colorHex: Record<RiskCategory['color'], string> = {
  teal: '#2DD4BF',
  amber: '#F5A623',
  red: '#F04438',
  green: '#3FC98A',
};

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload as RiskCategory;
  return (
    <div className="rounded-md border border-base-600 bg-base-850 px-3 py-2 text-xs shadow-xl">
      <p className="font-medium text-base-100">{item.category}</p>
      <p className="font-mono text-base-300 mt-0.5">{item.score} / 100</p>
    </div>
  );
}

export default function RiskBreakdown({ data }: { data: RiskCategory[] }) {
  return (
    <Card eyebrow="05 · Composite Analysis" title="Risk Breakdown">
      <div className="h-64 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 4 }}>
            <XAxis type="number" domain={[0, 100]} tick={{ fill: '#5C7A82', fontSize: 11 }} axisLine={{ stroke: '#26393F' }} tickLine={false} />
            <YAxis
              type="category"
              dataKey="category"
              width={130}
              tick={{ fill: '#C2D2D6', fontSize: 12 }}
              axisLine={{ stroke: '#26393F' }}
              tickLine={false}
            />
            <RTooltip cursor={{ fill: 'rgba(45,212,191,0.06)' }} content={<CustomTooltip />} />
            <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={16}>
              {data.map((entry) => (
                <Cell key={entry.category} fill={colorHex[entry.color]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
