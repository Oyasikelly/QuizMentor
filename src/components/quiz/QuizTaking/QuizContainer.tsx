import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Timer } from 'lucide-react';
// Import your question type components
import MultipleChoice from '@/components/shared/question-types/multiple-choice';
import TrueFalse from '@/components/shared/question-types/true-false';
import ShortAnswer from '@/components/shared/question-types/short-answer';
import FillInBlank from '@/components/shared/question-types/fill-in-blank';
import Essay from '@/components/shared/question-types/essay';

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

  const handleSubmit = () => {
    setSubmitting(true);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    onSubmit(answers, timeTaken);
  };

  const renderQuestion = (q: Question, idx: number) => {
    switch (q.type) {
      case 'multiple-choice':
        return (
          <MultipleChoice
            question={q}
            value={answers[idx]}
            onChange={handleAnswer}
          />
        );
      case 'true-false':
        return (
          <TrueFalse
            question={q}
            value={answers[idx]}
            onChange={handleAnswer}
          />
        );
      case 'short-answer':
        return (
          <ShortAnswer
            question={q}
            value={answers[idx]}
            onChange={handleAnswer}
          />
        );
      case 'fill-in-blank':
        return (
          <FillInBlank
            question={q}
            value={answers[idx]}
            onChange={handleAnswer}
          />
        );
      case 'essay':
        return (
          <Essay question={q} value={answers[idx]} onChange={handleAnswer} />
        );
      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <CardTitle>{quizTitle}</CardTitle>
          <div className="flex items-center gap-3">
            <Progress
              value={((current + 1) / questions.length) * 100}
              className="w-32"
            />
            {timeLimit && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
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
        <CardContent>
          <div className="mb-6">
            {renderQuestion(questions[current], current)}
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={current === 0}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Question {current + 1} of {questions.length}
            </span>
            {current < questions.length - 1 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
