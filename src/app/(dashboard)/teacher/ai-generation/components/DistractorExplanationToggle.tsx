import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function DistractorExplanationToggle({
  generateDistractors,
  setGenerateDistractors,
  generateExplanations,
  setGenerateExplanations,
}: {
  generateDistractors: boolean;
  setGenerateDistractors: React.Dispatch<React.SetStateAction<boolean>>;
  generateExplanations: boolean;
  setGenerateExplanations: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="flex gap-8 items-center">
      <div className="flex items-center gap-2">
        <Switch
          checked={generateDistractors}
          onCheckedChange={setGenerateDistractors}
          id="distractors"
        />
        <Label htmlFor="distractors">Generate Distractors</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          checked={generateExplanations}
          onCheckedChange={setGenerateExplanations}
          id="explanations"
        />
        <Label htmlFor="explanations">Generate Explanations</Label>
      </div>
    </div>
  );
}
