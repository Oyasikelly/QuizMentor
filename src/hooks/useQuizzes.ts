'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Quiz, CreateQuizRequest, SubmitQuizRequest } from '@/types/quiz';

interface UseQuizzesOptions {
  userId?: string;
  role?: 'student' | 'teacher';
  filters?: {
    subject?: string;
    difficulty?: string;
    isPublished?: boolean;
  };
}

interface UseQuizzesReturn {
  quizzes: Quiz[];
  loading: boolean;
  error: string | null;
  createQuiz: (data: CreateQuizRequest) => Promise<void>;
  updateQuiz: (id: string, data: Partial<Quiz>) => Promise<void>;
  deleteQuiz: (id: string) => Promise<void>;
  submitQuiz: (data: SubmitQuizRequest) => Promise<void>;
  refreshQuizzes: () => Promise<void>;
}

export function useQuizzes(options: UseQuizzesOptions = {}): UseQuizzesReturn {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize the options to prevent infinite re-renders
  const memoizedOptions = useMemo(
    () => ({
      userId: options.userId,
      role: options.role,
      filters: options.filters
        ? {
            subject: options.filters.subject,
            difficulty: options.filters.difficulty,
            isPublished: options.filters.isPublished,
          }
        : undefined,
    }),
    [options.userId, options.role, options.filters]
  );

  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params for student filtering
      let url = '/api/quizzes';
      const params = new URLSearchParams();
      if (memoizedOptions.role === 'student' && memoizedOptions.userId) {
        params.append('studentId', memoizedOptions.userId);
        if (memoizedOptions.filters?.subject) {
          params.append('subjectId', memoizedOptions.filters.subject);
        }
      }
      if ([...params].length > 0) {
        url += `?${params.toString()}`;
      }
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quizzes');
      }

      const data = await response.json();
      setQuizzes(data.quizzes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [memoizedOptions]);

  const createQuiz = useCallback(async (data: CreateQuizRequest) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create quiz');
      }

      const newQuiz = await response.json();
      setQuizzes((prev) => [newQuiz, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create quiz');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQuiz = useCallback(async (id: string, data: Partial<Quiz>) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/quizzes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update quiz');
      }

      const updatedQuiz = await response.json();
      setQuizzes((prev) =>
        prev.map((quiz) => (quiz.id === id ? updatedQuiz : quiz))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quiz');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteQuiz = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/quizzes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete quiz');
      }

      setQuizzes((prev) => prev.filter((quiz) => quiz.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete quiz');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitQuiz = useCallback(async (data: SubmitQuizRequest) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/quizzes/${data.quizId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit quiz');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshQuizzes = useCallback(async () => {
    await fetchQuizzes();
  }, [fetchQuizzes]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  return {
    quizzes,
    loading,
    error,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    submitQuiz,
    refreshQuizzes,
  };
}

// Hook for single quiz management
export function useQuiz(quizId: string) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuiz = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/quizzes/${quizId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch quiz');
      }

      const data = await response.json();
      setQuiz(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quiz');
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    if (quizId) {
      fetchQuiz();
    }
  }, [quizId, fetchQuiz]);

  return {
    quiz,
    loading,
    error,
    refreshQuiz: fetchQuiz,
  };
}
