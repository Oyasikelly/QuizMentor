import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function PracticeProblemGenerator() {
  return (
    <Card className="p-4 flex flex-col gap-4">
      <div className="font-semibold">Practice Problem Generator</div>
      <Button variant="secondary">Generate Practice Problems</Button>
      <div className="h-16 bg-muted rounded flex items-center justify-center text-muted-foreground">
        [Problems Placeholder]
      </div>
    </Card>
  );
}
