'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Quiz } from '@/types/quiz';

interface QuizContextType {
  quiz: Quiz | null;
  setQuiz: (quiz: Quiz | null) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  return (
    <QuizContext.Provider value={{ quiz, setQuiz }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuizContext() {
  const ctx = useContext(QuizContext);
  if (!ctx)
    throw new Error('useQuizContext must be used within a QuizProvider');
  return ctx;
}
