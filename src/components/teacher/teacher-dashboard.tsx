'use client';

import * as React from 'react';
import Link from 'next/link';
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
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import {
  Users,
  BookOpen,
  BarChart3,
  Target,
  Plus,
  TrendingUp,
  Award,
  Calendar,
  FileText,
} from 'lucide-react';
import { Quiz } from '@/types/quiz';
import { User } from '@/types/auth';
import { useEffect, useState } from 'react';

interface TeacherDashboardProps {
  user: User;
  stats: {
    totalStudents: number;
    activeQuizzes: number;
    averageCompletionRate: number;
    totalAssignments: number;
  };
  recentQuizzes: Quiz[];
  classPerformance: Array<{
    className: string;
    studentCount: number;
    averageScore: number;
    completionRate: number;
  }>;
  pendingAssignments: Array<{
    id: string;
    quizTitle: string;
    assignedTo: string;
    dueDate: string;
    status: 'pending' | 'in-progress' | 'completed';
  }>;
  isLoading?: boolean;
}

export function TeacherDashboard({
  user,
  stats,
  recentQuizzes,
  classPerformance,
  pendingAssignments,
  isLoading = false,
}: TeacherDashboardProps) {
  const [metrics, setMetrics] = useState<{
    studentsInSubjects: number;
    studentsInDepartment: number;
    overlap: number;
    activeQuizzes?: number;
    activeQuizzesTrend?: number;
  } | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  // const [metricsError, setMetricsError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      setMetricsLoading(true);
      try {
        const res = await fetch(
          `/api/teacher/teacher-dashboard-metrics?userId=${user.id}`
        );
        if (!res.ok) throw new Error('Failed to fetch metrics');
        const data = await res.json();
        setMetrics(data);
      } catch {
        setMetrics({
          studentsInSubjects: 0,
          studentsInDepartment: 0,
          overlap: 0,
        });
      } finally {
        setMetricsLoading(false);
      }
    }
    if (user.role === 'teacher') fetchMetrics();
  }, [user.id, user.role]);

  if (user.role !== 'teacher') return null;
  if (isLoading || metricsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">Loading teacher dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back, {user.name}! 👨‍🏫
          </h1>
          <p className="text-muted-foreground mt-1">
            Ready to inspire and educate your students?
          </p>
        </div>
        <Button className="flex items-center gap-2 w-fit" asChild>
          <Link href="/teacher/create-quiz">
            <Plus className="h-4 w-4" />
            Create Quiz
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Students in Your Subjects"
          value={metrics?.studentsInSubjects ?? 0}
          icon={Users}
          trend={{ value: 0, isPositive: true }}
          subtitle={
            metrics && metrics.overlap > 0
              ? `${metrics.overlap} also in your department`
              : undefined
          }
        />
        <StatsCard
          title="Students in Your Department"
          value={metrics?.studentsInDepartment ?? 0}
          icon={Users}
          trend={{ value: 0, isPositive: true }}
        />
        <StatsCard
          title="Active Quizzes"
          value={metrics?.activeQuizzes ?? 0}
          icon={BookOpen}
          trend={{
            value: metrics?.activeQuizzesTrend ?? 0,
            isPositive: (metrics?.activeQuizzesTrend ?? 0) >= 0,
          }}
        />
        <StatsCard
          title="Completion Rate"
          value={`${stats.averageCompletionRate}%`}
          icon={Target}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Total Assignments"
          value={stats.totalAssignments}
          icon={FileText}
          trend={{ value: 12, isPositive: true }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Class Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Class Performance
            </CardTitle>
            <CardDescription>
              Overview of your classes and their progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classPerformance.map((classData, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 p-4 border rounded-lg sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{classData.className}</p>
                    <p className="text-sm text-muted-foreground">
                      {classData.studentCount} students
                    </p>
                  </div>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex gap-4">
                      <div className="text-center">
                        <p className="text-sm font-medium">
                          {classData.averageScore}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Avg Score
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">
                          {classData.completionRate}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Completion
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Quizzes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Recent Quizzes
            </CardTitle>
            <CardDescription>Your latest quiz creations</CardDescription>
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
                  <Badge variant="outline" className="text-xs">
                    {quiz.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Quizzes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pending Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Pending Assignments
            </CardTitle>
            <CardDescription>
              Quizzes waiting for student completion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingAssignments.slice(0, 3).map((assignment) => (
                <div key={assignment.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {assignment.quizTitle}
                    </p>
                    <Badge
                      variant={
                        assignment.status === 'completed'
                          ? 'default'
                          : assignment.status === 'in-progress'
                          ? 'secondary'
                          : 'outline'
                      }
                      className="text-xs"
                    >
                      {assignment.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p>Assigned to: {assignment.assignedTo}</p>
                    <p>Due: {assignment.dueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Create New Quiz
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Manage Students
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Question Bank
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Performance Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Overview
            </CardTitle>
            <CardDescription>Key metrics and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Student Engagement</p>
                  <Progress value={85} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    85% of students active this week
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Quiz Completion</p>
                  <Progress value={72} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    72% of assigned quizzes completed
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Average Score</p>
                  <Progress value={78} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    78% average across all quizzes
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Time on Platform</p>
                  <Progress value={65} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    65% increase from last month
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
