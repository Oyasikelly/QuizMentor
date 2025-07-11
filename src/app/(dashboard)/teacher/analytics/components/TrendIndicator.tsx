import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface Trend {
  value: string;
  direction: 'up' | 'down' | 'neutral';
  color: 'green' | 'red' | 'blue' | 'gray';
}

interface TrendIndicatorProps {
  trend: Trend;
}

export default function TrendIndicator({ trend }: TrendIndicatorProps) {
  let icon = null;
  let colorClass = '';
  let ariaLabel = trend.value;

  switch (trend.direction) {
    case 'up':
      icon = <ArrowUpRight className="w-4 h-4 inline" />;
      colorClass =
        trend.color === 'green'
          ? 'text-green-600'
          : trend.color === 'blue'
          ? 'text-blue-600'
          : 'text-gray-600';
      break;
    case 'down':
      icon = <ArrowDownRight className="w-4 h-4 inline" />;
      colorClass = 'text-red-600';
      break;
    default:
      icon = <Minus className="w-4 h-4 inline" />;
      colorClass = 'text-gray-500';
  }

  return (
    <span
      className={`text-sm font-medium flex items-center gap-1 ${colorClass}`}
      aria-label={ariaLabel}
      tabIndex={0}
      title={trend.value}
    >
      {icon}
      {trend.value}
    </span>
  );
}
