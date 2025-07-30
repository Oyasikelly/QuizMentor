'use client';
import React, { useState } from 'react';
import { useQuiz } from '@/hooks/useQuiz';
import { useQuizContext } from '@/context/QuizContext';
import { FullPageSpinner } from '@/components/shared/loading-spinner';
import QuizStart from '@/components/quiz/QuizStart';
import QuizContainer from '@/components/quiz/QuizTaking/QuizContainer';

export default function QuizClient({ id }: { id: string }) {
  const { quiz: contextQuiz } = useQuizContext();
  const { quiz, loading, error } = useQuiz(id);
  const [started, setStarted] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  // Use the fetched quiz data, fallback to context only if it matches the current id
  const quizData =
    quiz || (contextQuiz && contextQuiz.id === id ? contextQuiz : null);

  if (loading) return <FullPageSpinner text="Loading quiz..." />;
  if (!quizData || error)
    return (
      <div className="p-8 text-center text-red-500">
        Quiz not found or failed to load.
        {error && <div className="mt-2 text-sm">{error}</div>}
      </div>
    );

  // When quiz is started, create an in-progress attempt
  const handleStart = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user?.id) {
      alert(
        'You must be logged in to start a quiz. Please log in and try again.'
      );
      return;
    }
    if (!quizData.questions || quizData.questions.length === 0) {
      alert('This quiz has no questions and cannot be started.');
      return;
    }
    try {
      const res = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: quizData.id,
          studentId: user.id,
        }),
      });
      const data = await res.json();
      if (res.ok && data.attempt) {
        setAttemptId(data.attempt.id);
        setStarted(true);
      } else {
        alert(data.error || 'Failed to start quiz attempt.');
      }
    } catch {
      alert('Failed to start quiz attempt.');
    }
  };

  // On submit, call the backend to grade and save answers
  const handleSubmit = async (
    answers: Array<{ questionId: string; answer: string }>,
    timeTaken: number
  ) => {
    if (!attemptId) {
      alert('No attempt in progress.');
      return;
    }
    try {
      const res = await fetch('/api/attempts/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId,
          answers,
          timeSpent: timeTaken,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to submit quiz.');
      }
      // Success: dashboard and review modal will update automatically
    } catch {
      alert('Failed to submit quiz.');
    }
  };

  if (!started) {
    return (
      <QuizStart
        title={quizData.title}
        description={quizData.description}
        timeLimit={quizData.timeLimit}
        questionCount={quizData.questions?.length || 0}
        onStart={handleStart}
      />
    );
  }

  return (
    <QuizContainer
      quizTitle={quizData.title}
      questions={quizData.questions}
      timeLimit={quizData.timeLimit}
      onSubmit={handleSubmit}
    />
  );
}
