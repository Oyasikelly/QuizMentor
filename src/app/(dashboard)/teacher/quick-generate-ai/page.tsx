import React from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

const mockUser = {
  id: 'teacher1',
  name: 'Dr. Sarah Wilson',
  email: 'sarah.wilson@example.com',
  role: 'teacher' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function QuickGenerateAIPage() {
  return (
    <DashboardLayout user={mockUser} pageTitle="Quick Generate with AI">
      <div className="max-w-2xl mx-auto py-12 flex flex-col gap-8 items-center text-center">
        <h1 className="text-3xl font-bold">Quick Generate with AI</h1>
        <p className="text-muted-foreground text-lg">
          Use AI to generate high-quality questions in seconds! For advanced AI
          options, use the full question bank AI generator.
        </p>
        <Link href="/teacher/question-bank">
          <Button size="lg" className="gap-2">
            <Sparkles className="w-5 h-5" /> Go to AI Generator
          </Button>
        </Link>
      </div>
    </DashboardLayout>
  );
}
