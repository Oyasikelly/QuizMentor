import React, { useEffect, useState } from 'react';
import { Quiz } from '@/types/quiz';
import { Button } from '@/components/ui/button';

interface QuizCardProps {
  quiz: Quiz;
  onStart?: (quizId: string) => void;
}

export default function QuizCard({ quiz, onStart }: QuizCardProps) {
  const [questionCount, setQuestionCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchQuestionCount() {
      try {
        const res = await fetch(`/api/quizzes/${quiz.id}`);
        if (!res.ok) return;
        const data = await res.json();
        setQuestionCount(data.quiz?.questions?.length ?? 0);
      } catch {
        setQuestionCount(null);
      }
    }
    fetchQuestionCount();
  }, [quiz.id]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{quiz.title}</h3>
      <p className="text-gray-600 mb-4">{quiz.description}</p>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>
          Subject:{' '}
          {typeof quiz.subject === 'string'
            ? quiz.subject
            : quiz.subject?.name || 'No Subject'}
        </span>
        <span>Points: {quiz.totalPoints}</span>
      </div>
      <div className="text-sm text-gray-500 mb-2">
        Questions: {questionCount !== null ? questionCount : '...'}
      </div>
      {quiz.timeLimit && (
        <div className="text-sm text-gray-500 mb-4">
          Time Limit: {quiz.timeLimit} minutes
        </div>
      )}

      {onStart && (
        <Button onClick={() => onStart(quiz.id)} className="w-full">
          Start Quiz
        </Button>
      )}
    </div>
  );
}
