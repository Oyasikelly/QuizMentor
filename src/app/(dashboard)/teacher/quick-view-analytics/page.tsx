import React from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';
import Link from 'next/link';

const mockUser = {
  id: 'teacher1',
  name: 'Dr. Sarah Wilson',
  email: 'sarah.wilson@example.com',
  role: 'teacher' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function QuickViewAnalyticsPage() {
  return (
    <DashboardLayout user={mockUser} pageTitle="Quick View Analytics">
      <div className="max-w-2xl mx-auto py-12 flex flex-col gap-8 items-center text-center">
        <h1 className="text-3xl font-bold">Quick View Analytics</h1>
        <p className="text-muted-foreground text-lg">
          Get a snapshot of your quiz and student performance. For detailed
          analytics, use the full analytics dashboard.
        </p>
        <Link href="/teacher/analytics">
          <Button size="lg" className="gap-2">
            <BarChart3 className="w-5 h-5" /> Go to Analytics Dashboard
          </Button>
        </Link>
      </div>
    </DashboardLayout>
  );
}
