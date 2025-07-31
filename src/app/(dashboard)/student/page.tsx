'use client';

import React from 'react';
import { StudentDashboard } from '@/components/student/student-dashboard';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { SimpleLoadingDashboard } from '@/components/shared/loading-dashboard';
import { useAuth } from '@/hooks/useAuth';

export default function StudentDashboardPage() {
  const { user, loading } = useAuth();

  // Handle server-side rendering
  if (typeof window === 'undefined') {
    return <div>Loading...</div>;
  }

  if (loading) {
    return (
      <DashboardLayout>
        <SimpleLoadingDashboard />
      </DashboardLayout>
    );
  }

  if (!user) return null;
  return (
    <DashboardLayout>
      <StudentDashboard user={user} />
    </DashboardLayout>
  );
}
