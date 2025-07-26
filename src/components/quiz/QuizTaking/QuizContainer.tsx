'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Timer } from 'lucide-react';
// Import your question type components
import StudentMultipleChoice from '@/components/shared/question-types/StudentMultipleChoice';
import StudentTrueFalse from '@/components/shared/question-types/StudentTrueFalse';
import StudentShortAnswer from '@/components/shared/question-types/StudentShortAnswer';
import StudentFillInBlank from '@/components/shared/question-types/StudentFillInBlank';
import StudentEssay from '@/components/shared/question-types/StudentEssay';
import { useRouter } from 'next/navigation';

interface Question {
  id: string;
  type: string;
  text: string;
  options?: any[];
  // ...other fields as needed
}

interface QuizContainerProps {
  quizTitle: string;
  questions: Question[];
  timeLimit?: number; // in minutes
  onSubmit: (answers: any[], timeTaken: number) => void;
}

export default function QuizContainer({
  quizTitle,
  questions,
  timeLimit,
  onSubmit,
}: QuizContainerProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [startTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(timeLimit ? timeLimit * 60 : null); // seconds
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>(
    'saved'
  );
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  // Timer logic
  useEffect(() => {
    if (!timeLeft) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((t) => (t ? t - 1 : null));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Autosave logic (debounced)
  useEffect(() => {
    if (!answers.length) return;
    setSaveStatus('saving');
    const timeout = setTimeout(() => {
      // Simulate save
      setSaveStatus('saved');
    }, 1000);
    return () => clearTimeout(timeout);
  }, [answers]);

  const handleAnswer = useCallback(
    (answer: any) => {
      setAnswers((prev) => {
        const updated = [...prev];
        updated[current] = answer;
        return updated;
      });
      setSaveStatus('saving');
    },
    [current]
  );

  const handleNext = () =>
    setCurrent((c) => Math.min(c + 1, questions.length - 1));
  const handlePrev = () => setCurrent((c) => Math.max(c - 1, 0));

  const handleSubmit = async () => {
    setSubmitting(true);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    try {
      await onSubmit(answers, timeTaken);
      // Optionally show a result modal here
      router.push('/student/quizzes'); // or '/quizzes' or wherever
    } catch (err) {
      // Optionally show error
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (q: Question, idx: number) => {
    // Map backend question to quiz-creation type for student components
    const mappedQ = {
      id: q.id,
      type: q.type as any,
      question: q.text,
      options: q.options || [],
    } as any; // Only pass what is needed

    // Map backend enum types to frontend expected types
    const getQuestionType = (backendType: string) => {
      switch (backendType) {
        case 'MULTIPLE_CHOICE':
          return 'multiple-choice';
        case 'TRUE_FALSE':
          return 'true-false';
        case 'SHORT_ANSWER':
          return 'short-answer';
        case 'FILL_IN_BLANK':
          return 'fill-in-blank';
        case 'ESSAY':
          return 'essay';
        default:
          return backendType.toLowerCase();
      }
    };

    const questionType = getQuestionType(q.type);

    switch (questionType) {
      case 'multiple-choice':
        return (
          <StudentMultipleChoice
            question={mappedQ}
            value={answers[idx] || ''}
            onChange={(val: string) => handleAnswer(val)}
          />
        );
      case 'true-false':
        return (
          <StudentTrueFalse
            question={mappedQ}
            value={answers[idx] || ''}
            onChange={(val: string) => handleAnswer(val)}
          />
        );
      case 'short-answer':
        return (
          <StudentShortAnswer
            question={mappedQ}
            value={answers[idx] || ''}
            onChange={(val: string) => handleAnswer(val)}
          />
        );
      case 'fill-in-blank':
        return (
          <StudentFillInBlank
            question={mappedQ}
            value={answers[idx] || ''}
            onChange={(val: string) => handleAnswer(val)}
          />
        );
      case 'essay':
        return (
          <StudentEssay
            question={mappedQ}
            value={answers[idx] || ''}
            onChange={(val: string) => handleAnswer(val)}
          />
        );
      default:
        return (
          <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/10">
            <p className="text-yellow-800 dark:text-yellow-200 font-medium">
              Unsupported question type: {q.type}
            </p>
            <p className="text-sm text-yellow-600 dark:text-yellow-300 mt-1">
              Please contact your instructor if you see this message.
            </p>
            <div className="mt-2 text-xs text-gray-500">
              Debug info: Backend type: {q.type}, Mapped type: {questionType}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-2 sm:px-4 py-4">
      <Card className="w-full max-w-lg sm:max-w-xl md:max-w-2xl shadow-xl">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between px-3 sm:px-6 pt-4 pb-2">
          <CardTitle className="text-lg sm:text-xl md:text-2xl break-words">
            {quizTitle}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 md:mt-0">
            <Progress
              value={((current + 1) / questions.length) * 100}
              className="w-24 sm:w-32"
            />
            {timeLimit && (
              <span className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                <Timer className="w-4 h-4" />
                {timeLeft !== null
                  ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60)
                      .toString()
                      .padStart(2, '0')}`
                  : '--:--'}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {saveStatus === 'saving'
                ? 'Saving...'
                : saveStatus === 'saved'
                ? 'Saved'
                : 'Error'}
            </span>
          </div>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-6">
          <div className="mb-6 min-w-0 break-words">
            {renderQuestion(questions[current], current)}
          </div>
          <div className="flex flex-row justify-between items-center mt-4 gap-3">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={current === 0}
              className="w-auto"
            >
              Previous
            </Button>
            <span className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-0">
              Question {current + 1} of {questions.length}
            </span>
            {current < questions.length - 1 ? (
              <Button onClick={handleNext} className="w-auto">
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-auto"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
