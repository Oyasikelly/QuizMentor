'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { ChatInterface } from './components/ChatInterface';

const mockUser = {
  id: 'student1',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  role: 'student' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function StudentAIChatPage() {
  return (
    <DashboardLayout user={mockUser} pageTitle="AI Mentor">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">AI Mentor</h1>
        <p className="text-muted-foreground mb-4">
          Ask questions, get explanations, and practice with your AI tutor.
        </p>
        <ChatInterface />
      </div>
    </DashboardLayout>
  );
}
