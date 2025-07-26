'use client';

import { BookOpen, Users, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuizStatsProps {
  stats: {
    totalQuizzes: number;
    activeQuizzes: number;
    draftQuizzes: number;
    totalAttempts: number;
  };
}

export function QuizStats({ stats }: QuizStatsProps) {
  console.log(stats);
  const statCards = [
    {
      title: 'Total Quizzes',
      value: stats.totalQuizzes,
      icon: BookOpen,
      description: 'All quizzes created',
      color: 'text-blue-600',
    },
    {
      title: 'Active Quizzes',
      value: stats.activeQuizzes,
      icon: Target,
      description: 'Published and active',
      color: 'text-green-600',
    },
    {
      title: 'Draft Quizzes',
      value: stats.draftQuizzes,
      icon: BookOpen,
      description: 'Work in progress',
      color: 'text-yellow-600',
    },
    {
      title: 'Total Attempts',
      value: stats.totalAttempts,
      icon: Users,
      description: 'Student attempts',
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
