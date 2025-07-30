import React from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import Link from 'next/link';

export default function QuickImportQuestionsPage() {
  return (
    <DashboardLayout pageTitle="Quick Import Questions">
      <div className="max-w-2xl mx-auto py-12 flex flex-col gap-8 items-center text-center">
        <h1 className="text-3xl font-bold">Quick Import Questions</h1>
        <p className="text-muted-foreground text-lg">
          Import questions in bulk from CSV, Excel, or other formats. For more
          options, use the full question bank import tool.
        </p>
        <Link href="/teacher/question-bank">
          <Button size="lg" className="gap-2">
            <Upload className="w-5 h-5" /> Go to Question Bank Import
          </Button>
        </Link>
      </div>
    </DashboardLayout>
  );
}
