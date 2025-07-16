'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { FullPageSpinner } from '@/components/shared/loading-spinner';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { ChatInterface } from './components/ChatInterface';

export default function StudentAIChatPage() {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner text="Loading your dashboard..." />;
  if (!user) return null;
  return (
    <DashboardLayout pageTitle="AI Mentor">
      <div className="space-y-6 mx-auto">
        <p className="text-muted-foreground mb-4">
          Ask questions, get explanations, and practice with your AI tutor.
        </p>
        <ChatInterface />
      </div>
    </DashboardLayout>
  );
}
