import React from 'react';
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const data = [
  { week: 'Week 1', avgScore: 72 },
  { week: 'Week 2', avgScore: 75 },
  { week: 'Week 3', avgScore: 78 },
  { week: 'Week 4', avgScore: 80 },
  { week: 'Week 5', avgScore: 79 },
  { week: 'Week 6', avgScore: 82 },
];

export default function LineChart() {
  return (
    <div className="w-full h-64" aria-label="Performance Trends Line Chart">
      <ResponsiveContainer width="100%" height="100%">
        <ReLineChart
          data={data}
          margin={{ top: 16, right: 16, left: 0, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="text-muted" />
          <XAxis dataKey="week" fontSize={14} />
          <YAxis
            domain={[60, 100]}
            fontSize={14}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{ background: '#fff', borderRadius: 8, fontSize: 14 }}
            labelClassName="font-semibold"
            cursor={{ fill: '#e0e7ef', opacity: 0.3 }}
            formatter={(value: number) => [`${value}%`, 'Avg Score']}
            labelFormatter={(label) => `${label}`}
          />
          <Line
            type="monotone"
            dataKey="avgScore"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ r: 5, fill: '#6366f1' }}
            activeDot={{ r: 7, fill: '#6366f1' }}
          />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
}
