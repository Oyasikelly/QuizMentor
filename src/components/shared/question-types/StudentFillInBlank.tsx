import React from 'react';
import { Question } from '@/types/quiz-creation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function StudentFillInBlank({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: string;
  onChange: (val: string) => void;
}) {
  // Replace blank with input
  const parts = question.question.split('_____');
  return (
    <Label className="mb-4 font-medium block">
      {parts.map((part, idx) => (
        <span key={idx}>
          {part}
          {idx < parts.length - 1 && (
            <Input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Blank"
              className="inline-block mx-2 min-w-[60px]"
            />
          )}
        </span>
      ))}
    </Label>
  );
}
