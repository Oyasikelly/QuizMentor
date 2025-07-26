'use client';
import { useState, useEffect, useCallback } from 'react';
import { Quiz, Question, QuizAttempt } from '@/types/quiz';

export function useQuiz(quizId?: string) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuiz = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/quizzes/${id}`);
      if (!res.ok) throw new Error('Quiz not found');
      const data = await res.json();
      setQuiz(data.quiz);
    } catch (err) {
      setError('Failed to fetch quiz');
      setQuiz(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitQuiz = async (answers: any) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Implement quiz submission logic
      console.log('Submitting quiz:', answers);
    } catch (err) {
      setError('Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  const createQuiz = async (quizData: any) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Implement quiz creation logic
      console.log('Creating quiz:', quizData);
    } catch (err) {
      setError('Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quizId) {
      fetchQuiz(quizId);
    }
  }, [quizId, fetchQuiz]);

  return {
    quiz,
    questions,
    loading,
    error,
    fetchQuiz,
    submitQuiz,
    createQuiz,
  };
}
