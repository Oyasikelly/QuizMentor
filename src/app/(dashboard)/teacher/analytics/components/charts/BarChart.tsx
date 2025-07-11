import React from 'react';
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';

const data = [
  { grade: 'A', count: 42 },
  { grade: 'B', count: 68 },
  { grade: 'C', count: 37 },
  { grade: 'D', count: 15 },
  { grade: 'F', count: 6 },
];

const COLORS = [
  '#4ade80', // A - green
  '#60a5fa', // B - blue
  '#fbbf24', // C - yellow
  '#f87171', // D - red
  '#a3a3a3', // F - gray
];

export default function BarChart() {
  return (
    <div className="w-full h-64" aria-label="Score Distribution Histogram">
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart
          data={data}
          margin={{ top: 16, right: 16, left: 0, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="text-muted" />
          <XAxis dataKey="grade" fontSize={14} />
          <YAxis allowDecimals={false} fontSize={14} />
          <Tooltip
            contentStyle={{ background: '#fff', borderRadius: 8, fontSize: 14 }}
            labelClassName="font-semibold"
            cursor={{ fill: '#e0e7ef', opacity: 0.3 }}
            formatter={(value: number) => [`${value} students`, 'Count']}
            labelFormatter={(label) => `Grade ${label}`}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {data.map((entry, idx) => (
              <Cell
                key={`cell-${idx}`}
                fill={COLORS[idx]}
                aria-label={`Grade ${entry.grade}`}
              />
            ))}
          </Bar>
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}
