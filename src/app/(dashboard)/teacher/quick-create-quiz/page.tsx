import React from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

const mockUser = {
  id: 'teacher1',
  name: 'Dr. Sarah Wilson',
  email: 'sarah.wilson@example.com',
  role: 'teacher' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function QuickCreateQuizPage() {
  return (
    <DashboardLayout user={mockUser} pageTitle="Quick Create Quiz">
      <div className="max-w-2xl mx-auto py-12 flex flex-col gap-8 items-center text-center">
        <h1 className="text-3xl font-bold">Quick Create Quiz</h1>
        <p className="text-muted-foreground text-lg">
          Start a new quiz in seconds! For advanced options, use the full quiz
          creation tool.
        </p>
        <Link href="/teacher/create-quiz">
          <Button size="lg" className="gap-2">
            <Plus className="w-5 h-5" /> Go to Full Quiz Creator
          </Button>
        </Link>
      </div>
    </DashboardLayout>
  );
}
