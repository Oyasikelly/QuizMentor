import React from 'react';
import { Card } from '@/components/ui/card';

export function AssessmentBuilder() {
  return (
    <Card className="p-4 flex flex-col gap-4">
      <div className="font-semibold">Assessment Blueprint</div>
      <div className="flex flex-col gap-2">
        <label>Topic Coverage</label>
        <input
          type="range"
          min={0}
          max={100}
          defaultValue={80}
          className="w-full"
        />
        <label>Difficulty Balance</label>
        <input
          type="range"
          min={0}
          max={100}
          defaultValue={50}
          className="w-full"
        />
      </div>
      <div className="mt-4">
        <div className="font-semibold mb-2">Coverage Chart (Mock)</div>
        <div className="h-32 bg-muted rounded flex items-center justify-center text-muted-foreground">
          [Chart Placeholder]
        </div>
      </div>
    </Card>
  );
}
