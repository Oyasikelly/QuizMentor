import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

// Mock user data for dashboard layout
const mockUser = {
  id: 'teacher1',
  name: 'Dr. Sarah Wilson',
  email: 'sarah.wilson@example.com',
  role: 'teacher' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock student data
const mockStudent = {
  id: '1',
  name: 'Alice Johnson',
  email: 'alice@email.com',
  registered: '2023-01-01',
  status: 'Active',
};

interface StudentPageProps {
  params: { studentId: string };
}

export default function StudentPage({ params }: StudentPageProps) {
  // TODO: Fetch student profile, analytics, quiz history, AI insights, etc.
  // TODO: Add error/loading states
  // In real implementation, fetch student by params.studentId
  const student = mockStudent; // Replace with real fetch

  return (
    <DashboardLayout user={mockUser} pageTitle={student.name}>
      <div className="flex flex-col gap-8">
        {/* Student Profile Header */}
        <section className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 bg-card rounded-xl p-6 shadow">
          <Avatar className="w-24 h-24" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{student.name}</h1>
            <p className="text-muted-foreground">
              {student.email} • Registered: {student.registered}
            </p>
            <div className="flex gap-2 mt-2">
              <span className="text-xs bg-green-100 text-green-800 rounded px-2 py-1">
                {student.status}
              </span>
              {/* TODO: Add more status indicators */}
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm">Send Message</Button>
              <Button size="sm" variant="outline">
                Generate Report
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2 min-w-[180px] mt-6 md:mt-0">
            <Card className="p-3 text-center">
              <div className="text-lg font-semibold">12</div>
              <div className="text-xs text-muted-foreground">
                Quizzes Attempted
              </div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-lg font-semibold">87%</div>
              <div className="text-xs text-muted-foreground">Avg. Score</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-lg font-semibold">3d ago</div>
              <div className="text-xs text-muted-foreground">Last Active</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-lg font-semibold">5 days</div>
              <div className="text-xs text-muted-foreground">
                Current Streak
              </div>
            </Card>
          </div>
        </section>

        {/* Performance Metrics Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* TODO: Replace with real metric cards */}
          <Card className="p-4 flex flex-col items-center">
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs text-muted-foreground">Total Quizzes</div>
          </Card>
          <Card className="p-4 flex flex-col items-center">
            <div className="text-2xl font-bold">87%</div>
            <div className="text-xs text-muted-foreground">Avg. Score</div>
          </Card>
          <Card className="p-4 flex flex-col items-center">
            <div className="text-2xl font-bold">+8%</div>
            <div className="text-xs text-muted-foreground">
              Improvement Rate
            </div>
          </Card>
          <Card className="p-4 flex flex-col items-center">
            <div className="text-2xl font-bold">14h</div>
            <div className="text-xs text-muted-foreground">Time Spent</div>
          </Card>
        </section>

        {/* Performance Analytics & AI Insights */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* TODO: Insert PerformanceCharts, RadarChart, ProgressBar, etc. */}
            <Card className="p-4">Performance Charts Placeholder</Card>
          </div>
          <div>
            {/* TODO: Insert AI Insights Panel */}
            <Card className="p-4">AI Insights Panel Placeholder</Card>
          </div>
        </section>

        {/* Quiz History Table */}
        <section>
          {/* TODO: Insert DataTable for quiz history */}
          <Card className="p-4">Quiz History Table Placeholder</Card>
        </section>

        {/* Detailed Analysis & Communication Tools */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-4">Detailed Performance Analysis Placeholder</Card>
          <Card className="p-4">
            Communication & Feedback Tools Placeholder
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
}
