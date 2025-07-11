import React from 'react';
import TrendIndicator from './TrendIndicator';
import { MetricData } from './OverviewCards';

interface MetricCardProps {
  metric: MetricData;
  loading?: boolean;
  style?: React.CSSProperties;
}

export default function MetricCard({
  metric,
  loading,
  style,
}: MetricCardProps) {
  return (
    <div
      className={`relative min-h-[140px] rounded-xl p-6 shadow-md transition-transform transition-shadow duration-200 bg-white dark:bg-card ${metric.bgColor} focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer hover:scale-[1.03] hover:shadow-lg active:scale-[0.98]`}
      tabIndex={0}
      aria-label={metric.title}
      style={style}
    >
      {/* Loading Skeleton */}
      {loading ? (
        <div className="animate-pulse flex flex-col items-start gap-4 h-full">
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 mb-2" />
          <div className="h-8 w-2/3 rounded bg-gray-200 dark:bg-gray-700 mb-1" />
          <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700 mb-1" />
          <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      ) : (
        <div className="flex flex-col h-full justify-between">
          <div className="flex items-center gap-4 mb-2">
            <span aria-hidden="true">{metric.icon}</span>
            <span className="sr-only">{metric.title} icon</span>
          </div>
          <div className="mt-2 mb-1">
            <span className="text-3xl font-bold text-foreground">
              {metric.value}
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
            {metric.subtitle}
          </div>
          <TrendIndicator trend={metric.trend} />
        </div>
      )}
    </div>
  );
}
