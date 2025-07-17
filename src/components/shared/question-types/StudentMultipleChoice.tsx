import React from 'react';
import { Question } from '@/types/quiz-creation';

export default function StudentMultipleChoice({
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
      <div className="space-y-2">
        {question.options?.map((opt, idx) => (
          <label key={idx} className="flex items-center gap-2">
            <input
              type="radio"
              name={`mcq-${question.id}`}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
