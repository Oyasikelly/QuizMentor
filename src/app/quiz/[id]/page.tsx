'use client';
import React, { useState } from 'react';
import { useQuiz } from '@/hooks/useQuiz';
import { FullPageSpinner } from '@/components/shared/loading-spinner';
import QuizStart from '@/components/quiz/QuizStart';
import QuizContainer from '@/components/quiz/QuizTaking/QuizContainer';

interface QuizPageProps {
  params: {
    id: string;
  };
}

export default function QuizPage({ params }: QuizPageProps) {
  const { quiz, loading, error } = useQuiz(params.id);
  const [started, setStarted] = useState(false);

  if (loading) return <FullPageSpinner text="Loading quiz..." />;
  if (error || !quiz)
    return (
      <div className="p-8 text-center text-red-500">
        Quiz not found or failed to load.
      </div>
    );

  if (!started) {
    return (
      <QuizStart
        title={quiz.title}
        description={quiz.description}
        timeLimit={quiz.timeLimit}
        questionCount={quiz.questions?.length || 0}
        onStart={() => setStarted(true)}
      />
    );
  }

  return (
    <QuizContainer
      quizTitle={quiz.title}
      questions={quiz.questions}
      timeLimit={quiz.timeLimit}
      onSubmit={(answers, timeTaken) => {
        // TODO: Submit answers to backend
        alert('Quiz submitted!');
      }}
    />
  );
}
