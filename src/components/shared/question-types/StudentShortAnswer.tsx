import React from 'react';
import { Question } from '@/types/quiz-creation';

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
      <div className="mb-4 font-medium">{question.question}</div>
      <input
        type="text"
        className="w-full border rounded px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your answer..."
      />
    </div>
  );
}
