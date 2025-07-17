import React from 'react';
import { Question } from '@/types/quiz-creation';

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
      <div className="mb-4 font-medium">{question.question}</div>
      <textarea
        className="w-full border rounded px-3 py-2 min-h-[120px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your essay answer..."
      />
    </div>
  );
}
