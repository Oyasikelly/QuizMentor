import React from 'react';
import { Quiz } from '@/types/quiz';
import { Button } from '@/components/ui/button';

interface QuizCardProps {
  quiz: Quiz;
  onStart?: (quizId: string) => void;
}

export default function QuizCard({ quiz, onStart }: QuizCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{quiz.title}</h3>
      <p className="text-gray-600 mb-4">{quiz.description}</p>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>Subject: {quiz.subject}</span>
        <span>Points: {quiz.totalPoints}</span>
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
