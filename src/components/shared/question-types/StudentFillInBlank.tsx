import React from 'react';
import { Question } from '@/types/quiz-creation';

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
    <div className="mb-4 font-medium">
      {parts.map((part, idx) => (
        <span key={idx}>
          {part}
          {idx < parts.length - 1 && (
            <input
              type="text"
              className="inline-block border-b border-gray-400 mx-2 px-2 py-1"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Blank"
              style={{ minWidth: 60 }}
            />
          )}
        </span>
      ))}
    </div>
  );
}
