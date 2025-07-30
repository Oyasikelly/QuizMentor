'use client';

import React from 'react';
import { StudentDashboard } from '@/components/student/student-dashboard';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { useAuth } from '@/hooks/useAuth';

export default function StudentDashboardPage() {
  const { user, loading } = useAuth();
  if (loading || !user) return null;
  return (
    <DashboardLayout>
      <StudentDashboard user={user} />
    </DashboardLayout>
  );
}
