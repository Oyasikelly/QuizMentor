'use client';
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Upload, Sparkles } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { QuestionList } from './components/QuestionList';
import { QuestionEditor } from './components/QuestionEditor';

// Mock user data for dashboard layout
const mockUser = {
  id: 'teacher1',
  name: 'Dr. Sarah Wilson',
  email: 'sarah.wilson@example.com',
  role: 'teacher' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock stats
const stats = [
  { label: 'Total Questions', value: 1240 },
  { label: 'Created This Month', value: 87 },
  { label: 'AI Generated', value: 320 },
  { label: 'MCQ Ratio', value: '62%' },
];

interface QuestionBankPageProps {
  searchParams: {
    search?: string;
    filter?: string;
    category?: string;
    page?: string;
  };
}

export default function QuestionBankPage({
  searchParams,
}: QuestionBankPageProps) {
  const [editorOpen, setEditorOpen] = useState(false);

  const handleSaveQuestion = (data: any) => {
    // TODO: Save question to API
    setEditorOpen(false);
    alert('Question saved! (mock)');
  };

  return (
    <DashboardLayout user={mockUser} pageTitle="Question Bank">
      <div className="flex flex-col gap-8">
        {/* Header & Stats */}
        <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Question Bank</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Manage, create, and organize your questions. Use AI to generate
              new questions, import from files, and filter by subject, type, or
              difficulty.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <Button
              size="sm"
              className="gap-2"
              onClick={() => setEditorOpen(true)}
            >
              <Plus className="w-4 h-4" /> Create Question
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              <Upload className="w-4 h-4" /> Import
            </Button>
            <Button size="sm" variant="secondary" className="gap-2">
              <Sparkles className="w-4 h-4" /> Generate with AI
            </Button>
          </div>
        </section>
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-4 flex flex-col items-center">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </section>
        {/* Search & Filters */}
        <section className="flex flex-col md:flex-row md:items-center gap-4">
          <Input placeholder="Search questions..." className="max-w-md" />
          <Button variant="outline" size="sm">
            Advanced Filters
          </Button>
        </section>
        {/* Main Content Area */}
        <section className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-64 flex-shrink-0">
            <Sidebar />
          </aside>
          <main className="flex-1">
            <QuestionList />
          </main>
        </section>
        <QuestionEditor
          open={editorOpen}
          onClose={() => setEditorOpen(false)}
          onSave={handleSaveQuestion}
        />
      </div>
    </DashboardLayout>
  );
}
