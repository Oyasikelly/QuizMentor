import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function StudySessionPanel() {
  return (
    <Card className="p-4 flex flex-col gap-4">
      <div className="font-semibold">Study Session</div>
      <div className="flex gap-2 items-center">
        <Button variant="outline">Start Pomodoro</Button>
        <span className="text-xs text-muted-foreground">25:00</span>
      </div>
      <Input placeholder="Take a quick note..." />
    </Card>
  );
}
