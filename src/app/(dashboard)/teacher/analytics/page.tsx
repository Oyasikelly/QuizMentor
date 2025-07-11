'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight, RefreshCw, Download } from 'lucide-react';
import OverviewDashboard from './components/OverviewDashboard';
import PerformanceCharts from './components/PerformanceCharts';
import QuizAnalytics from './components/QuizAnalytics';
import StudentAnalytics from './components/StudentAnalytics';
import InsightsPanel from './components/InsightsPanel';
import FilterControls from './components/FilterControls';
import DataTable from './components/DataTable';
import ExportOptions from './components/ExportOptions';

// Mock user data for dashboard layout
const mockUser = {
  id: 'teacher1',
  name: 'Dr. Sarah Wilson',
  email: 'sarah.wilson@example.com',
  role: 'teacher' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function TeacherAnalysisPage() {
  return (
    <DashboardLayout user={mockUser}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            {/* Removed breadcrumb navigation */}
            <h1 className="text-3xl font-bold tracking-tight">
              Quiz Analytics & Performance Analysis
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Deep-dive into student performance, quiz effectiveness, and
              actionable insights to improve your teaching methods. Use the
              filters and tools below to explore your data.
            </p>
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3 mt-4 md:mt-0">
            {/* Time Range Selector (placeholder) */}
            <select className="border rounded-md px-3 py-2 text-sm bg-background">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Custom range</option>
            </select>
            {/* Export Options (placeholder) */}
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" /> Export
            </Button>
            {/* Refresh Button (placeholder) */}
            <Button variant="ghost" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Refresh
            </Button>
            <span className="text-xs text-muted-foreground mt-1 md:mt-0 md:ml-2">
              Last updated: a few seconds ago
            </span>
          </div>
        </div>

        {/* Filter Controls and Export Options */}
        <FilterControls />
        <ExportOptions />

        {/* Analytics Overview Cards */}
        <OverviewDashboard />

        {/* Performance Charts */}
        <PerformanceCharts />

        {/* Quiz Analytics Section */}
        <QuizAnalytics />

        {/* Student Analytics Section */}
        <StudentAnalytics />

        {/* Insights Panel */}
        <InsightsPanel />

        {/* Data Table Section */}
        <DataTable />
      </div>
    </DashboardLayout>
  );
}
