'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StatsCard } from '@/components/dashboard/stats-card';
import { QuizCard } from '@/components/quiz/quiz-card';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import {
  BookOpen,
  Trophy,
  TrendingUp,
  Clock,
  Target,
  Award,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { Quiz } from '@/types/quiz';

interface StudentDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'teacher';
  };
  stats: {
    quizzesTaken: number;
    averageScore: number;
    studyStreak: number;
    totalPoints: number;
  };
  recentQuizzes: Quiz[];
  availableQuizzes: Quiz[];
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
  }>;
  isLoading?: boolean;
}

export function StudentDashboard({
  user,
  stats,
  recentQuizzes,
  availableQuizzes,
  achievements,
  isLoading = false,
}: StudentDashboardProps) {
  if (user.role !== 'student') return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Ready to continue your learning journey?
          </p>
        </div>
        <Badge variant="secondary" className="text-sm w-fit">
          {stats.studyStreak} day streak 🔥
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Quizzes Taken"
          value={stats.quizzesTaken}
          icon={BookOpen}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Average Score"
          value={`${stats.averageScore}%`}
          icon={Target}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Study Streak"
          value={`${stats.studyStreak} days`}
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Total Points"
          value={stats.totalPoints}
          icon={Trophy}
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Available Quizzes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Available Quizzes
            </CardTitle>
            <CardDescription>
              New quizzes waiting for you to tackle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableQuizzes.slice(0, 3).map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} variant="compact" />
              ))}
              {availableQuizzes.length > 3 && (
                <Button variant="outline" className="w-full">
                  View All Quizzes
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest quiz attempts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentQuizzes.slice(0, 3).map((quiz: Quiz) => (
                <div
                  key={quiz.id}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {quiz.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {typeof quiz.subject === 'string'
                        ? quiz.subject
                        : quiz.subject?.name || 'No Subject'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">85%</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Achievements
            </CardTitle>
            <CardDescription>Unlock your potential</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.slice(0, 3).map((achievement) => (
                <div
                  key={achievement.id}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    achievement.unlocked
                      ? 'bg-green-50 dark:bg-green-950'
                      : 'bg-muted'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      achievement.unlocked
                        ? 'bg-green-100 dark:bg-green-900'
                        : 'bg-muted-foreground/20'
                    }`}
                  >
                    <Trophy className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{achievement.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Progress Overview
            </CardTitle>
            <CardDescription>Your learning journey over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">This Week</p>
                  <Progress value={75} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    3 of 4 quizzes completed
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">This Month</p>
                  <Progress value={60} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    12 of 20 quizzes completed
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Goal: Complete 20 quizzes this month</span>
                <Badge variant="outline">60%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
