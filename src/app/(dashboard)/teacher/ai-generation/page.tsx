'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BookOpen, FileText, ListChecks, Sparkles } from 'lucide-react';
import { AIGenerationInputPanel } from './components/AIGenerationInputPanel';
import { useAuth } from '@/hooks/useAuth';
import { FullPageSpinner } from '@/components/shared/loading-spinner';

function AIGenerationQueue() {
  return (
    <div className="bg-background border rounded p-4 mb-4">
      <h3 className="font-semibold mb-2">Batch Queue</h3>
      <div className="text-muted-foreground text-sm">
        No queued requests. (TODO: Implement batch/queue management)
      </div>
    </div>
  );
}

function AIGenerationReviewPanel({ result }: { result: any }) {
  return (
    <div className="bg-background border rounded p-4 mb-4">
      <h3 className="font-semibold mb-2">Review & Edit</h3>
      {result ? (
        <div className="text-foreground text-sm whitespace-pre-line">
          <strong>Result:</strong>
          <div className="mt-2">
            {typeof result === 'object'
              ? JSON.stringify(result, null, 2)
              : String(result)}
          </div>
        </div>
      ) : (
        <div className="text-muted-foreground text-sm">
          No generated items to review. (TODO: Show AI results, allow
          edit/approve/export)
        </div>
      )}
    </div>
  );
}

function AIGenerationHistory() {
  return (
    <div className="bg-background border rounded p-4 mb-4">
      <h3 className="font-semibold mb-2">History</h3>
      <div className="text-muted-foreground text-sm">
        No history yet. (TODO: Show past generations)
      </div>
    </div>
  );
}

export default function TeacherAIGenerationPage() {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner text="Loading your dashboard..." />;
  if (!user) return null;
  const [tab, setTab] = useState<
    'question' | 'explanation' | 'study' | 'assessment'
  >('question');
  const [result, setResult] = useState<any>(null);
  return (
    <DashboardLayout pageTitle="AI Generation Hub">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">AI Generation Hub</h1>
        <p className="text-muted-foreground mb-6">
          Generate questions, explanations, study materials, and assessments
          with AI. Select a tab to get started.
        </p>
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as any)}
          className="mb-6"
        >
          <div className='w-80% flex mx-auto  flex-wrap'>
            <TabsList className='flex-wrap mx-auto w-80%'>
              <TabsTrigger value="question">
                <BookOpen className="w-4 h-4 mr-1" /> Questions
              </TabsTrigger>
              <TabsTrigger value="explanation">
                <FileText className="w-4 h-4 mr-1" /> Explanations
              </TabsTrigger>
              <TabsTrigger value="study">
                <ListChecks className="w-4 h-4 mr-1" /> Study Materials
              </TabsTrigger>
              <TabsTrigger value="assessment">
                <Sparkles className="w-4 h-4 mr-1" /> Assessments
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="question">
            <AIGenerationInputPanel tab="question" onGenerate={setResult} />
            <AIGenerationQueue />
            <AIGenerationReviewPanel result={result} />
            <AIGenerationHistory />
          </TabsContent>
          <TabsContent value="explanation">
            <AIGenerationInputPanel tab="explanation" onGenerate={setResult} />
            <AIGenerationQueue />
            <AIGenerationReviewPanel result={result} />
            <AIGenerationHistory />
          </TabsContent>
          <TabsContent value="study">
            <AIGenerationInputPanel tab="study" onGenerate={setResult} />
            <AIGenerationQueue />
            <AIGenerationReviewPanel result={result} />
            <AIGenerationHistory />
          </TabsContent>
          <TabsContent value="assessment">
            <AIGenerationInputPanel tab="assessment" onGenerate={setResult} />
            <AIGenerationQueue />
            <AIGenerationReviewPanel result={result} />
            <AIGenerationHistory />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
