import React from 'react';
import { Question } from '@/types/quiz-creation';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function StudentEssay({
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
        htmlFor={`essay-${question.id}`}
      >
        {question.question}
      </Label>
      <Textarea
        id={`essay-${question.id}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your essay answer..."
        className="w-full min-h-[120px]"
      />
    </div>
  );
}
