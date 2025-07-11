import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ReviewPanel() {
  return (
    <Card className="p-4 flex flex-col gap-4">
      <div className="font-semibold">Quality Assurance & Review</div>
      <div className="flex gap-2">
        <Button variant="outline">Rate</Button>
        <Button variant="secondary">Approve</Button>
        <Button variant="destructive">Flag</Button>
      </div>
      <div className="text-xs text-muted-foreground mt-2">
        Review generated content for accuracy, clarity, and bias before adding
        to your question bank.
      </div>
    </Card>
  );
}
