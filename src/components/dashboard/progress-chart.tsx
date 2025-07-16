'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ProgressData {
  date: string;
  score: number;
  quizzesTaken: number;
}

interface ProgressChartProps {
  title: string;
  description?: string;
  data: ProgressData[];
  currentValue: number;
  previousValue: number;
  unit?: string;
  className?: string;
}

export function ProgressChart({
  title,
  description,
  data,
  currentValue,
  previousValue,
  unit = '%',
  className,
}: ProgressChartProps) {
  const change = currentValue - previousValue;
  const changePercentage =
    previousValue !== 0 ? (change / previousValue) * 100 : 0;
  const isPositive = change >= 0;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Value */}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">
              {currentValue}
              {unit}
            </span>
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : change === 0 ? (
                <Minus className="h-4 w-4 text-gray-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <Badge
                variant={isPositive ? 'default' : 'destructive'}
                className="text-xs"
              >
                {isPositive ? '+' : ''}
                {changePercentage.toFixed(1)}%
              </Badge>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p className="text-sm">Chart visualization</p>
              <p className="text-xs">Coming soon with charts library</p>
            </div>
          </div>

          {/* Data Points */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Recent Performance</p>
            <div className="space-y-1">
              {data.slice(-5).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-muted-foreground">{item.date}</span>
                  <span className="font-medium">{item.score}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Mini progress indicator for inline use
interface MiniProgressProps {
  value: number;
  maxValue: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

export function MiniProgress({
  value,
  maxValue,
  label,
  size = 'md',
}: MiniProgressProps) {
  const percentage = (value / maxValue) * 100;
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {value}/{maxValue}
        </span>
      </div>
      <div className={`w-full bg-muted rounded-full ${sizeClasses[size]}`}>
        <div
          className="bg-primary rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
