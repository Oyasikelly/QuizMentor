import React from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import Link from 'next/link';

const mockUser = {
  id: 'teacher1',
  name: 'Dr. Sarah Wilson',
  email: 'sarah.wilson@example.com',
  role: 'teacher' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function QuickCreateQuestionPage() {
  return (
    <DashboardLayout user={mockUser} pageTitle="Quick Create Question">
      <div className="max-w-2xl mx-auto py-12 flex flex-col gap-8 items-center text-center">
        <h1 className="text-3xl font-bold">Quick Create Question</h1>
        <p className="text-muted-foreground text-lg">
          Add a new question to your bank instantly! For advanced options, use
          the full question bank.
        </p>
        <Link href="/teacher/question-bank">
          <Button size="lg" className="gap-2">
            <FileText className="w-5 h-5" /> Go to Question Bank
          </Button>
        </Link>
      </div>
    </DashboardLayout>
  );
}
