import { useEffect, useState } from 'react';
import { Question } from '@/types/quiz';

interface UseQuizQuestionsResult {
  questions: Question[];
  loading: boolean;
  error: string | null;
  quiz: Record<string, unknown> | null;
}

export function useQuizQuestions(
  quizId: string | null
): UseQuizQuestionsResult {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quiz, setQuiz] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!quizId) {
      setQuestions([]);
      setQuiz(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`/api/quizzes/${quizId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch quiz questions');
        const data = await res.json();
        setQuiz(data.quiz);
        setQuestions(data.quiz?.questions || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [quizId]);

  return { questions, loading, error, quiz };
}
