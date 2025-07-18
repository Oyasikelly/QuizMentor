import React from 'react';
import { Question } from '@/types/quiz-creation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function StudentShortAnswer({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <Label
        className="mb-4 font-medium block"
        htmlFor={`short-answer-${question.id}`}
      >
        {question.question}
      </Label>
      <Input
        id={`short-answer-${question.id}`}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your answer..."
        className="w-full"
      />
    </div>
  );
}
