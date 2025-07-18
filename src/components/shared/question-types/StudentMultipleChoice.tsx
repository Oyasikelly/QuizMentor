import React from 'react';
import { Question } from '@/types/quiz-creation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    <div className="w-full max-w-full px-2 sm:px-0">
      <Label className="mb-4 font-medium block text-base sm:text-lg break-words">
        {question?.question}
      </Label>
      <div className="flex flex-col gap-2">
        {question.options?.map((opt, idx) => (
          <Label
            key={idx}
            className="flex items-center gap-2 cursor-pointer rounded-md px-2 py-2 transition-colors bg-muted/30 hover:bg-muted/50 text-sm sm:text-base"
            style={{ wordBreak: 'break-word' }}
          >
            <Input
              type="radio"
              name={`mcq-${question.id}`}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
              className="accent-primary w-4 h-4 sm:w-5 sm:h-5"
            />
            <span className="flex-1 break-words">{opt}</span>
          </Label>
        ))}
      </div>
    </div>
  );
}
