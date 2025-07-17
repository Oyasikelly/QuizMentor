import React from 'react';
import { Question } from '@/types/quiz-creation';

export default function StudentTrueFalse({
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
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name={`tf-${question.id}`}
            value="true"
            checked={value === 'true'}
            onChange={() => onChange('true')}
          />
          <span>True</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name={`tf-${question.id}`}
            value="false"
            checked={value === 'false'}
            onChange={() => onChange('false')}
          />
          <span>False</span>
        </label>
      </div>
    </div>
  );
}
