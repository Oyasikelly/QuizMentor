import React, { useState, useEffect } from 'react';
import MetricCard from './MetricCard';

import {
  Activity,
  Target,
  Users,
  CheckCircle,
  Clock,
  BarChart3,
} from 'lucide-react';

export interface MetricData {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  trend: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    color: 'green' | 'red' | 'blue' | 'gray';
  };
  icon: React.ReactNode;
  bgColor: string;
}

const METRICS: MetricData[] = [
  {
    id: 'total-attempts',
    title: 'Total Quiz Attempts',
    value: '2,847',
    subtitle: 'Total attempts this month',
    trend: { value: '+23% from last month', direction: 'up', color: 'green' },
    icon: <Activity className="w-12 h-12 text-blue-500" aria-hidden="true" />, // blue accent
    bgColor: 'bg-blue-50 dark:bg-blue-900/10',
  },
  {
    id: 'average-score',
    title: 'Average Score',
    value: '78.5%',
    subtitle: 'Average quiz score',
    trend: { value: '+5.2% from last month', direction: 'up', color: 'green' },
    icon: <Target className="w-12 h-12 text-green-500" aria-hidden="true" />, // green accent
    bgColor: 'bg-green-50 dark:bg-green-900/10',
  },
  {
    id: 'active-students',
    title: 'Active Students',
    value: '342',
    subtitle: 'Students took quizzes',
    trend: { value: '+18 new students', direction: 'up', color: 'blue' },
    icon: <Users className="w-12 h-12 text-purple-500" aria-hidden="true" />, // purple accent
    bgColor: 'bg-purple-50 dark:bg-purple-900/10',
  },
  {
    id: 'completion-rate',
    title: 'Quiz Completion Rate',
    value: '89.2%',
    subtitle: 'Completion rate',
    trend: { value: '-2.1% from last month', direction: 'down', color: 'red' },
    icon: (
      <CheckCircle className="w-12 h-12 text-orange-500" aria-hidden="true" />
    ), // orange accent
    bgColor: 'bg-orange-50 dark:bg-orange-900/10',
  },
  {
    id: 'avg-time',
    title: 'Average Time per Quiz',
    value: '12.5 min',
    subtitle: 'Average completion time',
    trend: { value: '-30 seconds faster', direction: 'up', color: 'green' },
    icon: <Clock className="w-12 h-12 text-teal-500" aria-hidden="true" />, // teal accent
    bgColor: 'bg-teal-50 dark:bg-teal-900/10',
  },
  {
    id: 'difficulty-distribution',
    title: 'Question Difficulty Distribution',
    value: '40:35:25',
    subtitle: 'Easy : Medium : Hard',
    trend: {
      value: 'Balanced distribution',
      direction: 'neutral',
      color: 'gray',
    },
    icon: <BarChart3 className="w-12 h-12 text-gray-500" aria-hidden="true" />, // gray accent
    bgColor: 'bg-gray-50 dark:bg-gray-900/10',
  },
];

export default function OverviewCards({ subjectId }: { subjectId: string }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      aria-label="Key Metrics Overview"
    >
      {METRICS.map((metric, idx) => (
        <MetricCard
          key={metric.id}
          metric={metric}
          loading={loading}
          style={{ animationDelay: `${idx * 100}ms` }}
        />
      ))}
    </div>
  );
}
