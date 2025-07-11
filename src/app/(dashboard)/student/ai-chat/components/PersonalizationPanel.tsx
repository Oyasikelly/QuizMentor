import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function PersonalizationPanel() {
  return (
    <Card className="p-4 flex flex-col gap-4">
      <div className="font-semibold">Personalization</div>
      <div>
        <div className="text-sm">
          Learning Style: <Badge variant="secondary">Visual</Badge>
        </div>
        <div className="text-sm">
          Progress: <Badge variant="outline">Intermediate</Badge>
        </div>
        <div className="text-sm">
          Recent Topics: <Badge>Algebra</Badge> <Badge>Photosynthesis</Badge>
        </div>
      </div>
    </Card>
  );
}
