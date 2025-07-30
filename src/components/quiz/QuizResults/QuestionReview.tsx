import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, Info } from 'lucide-react';

interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

interface Question {
  id: string;
  type: string;
  text: string;
  options?: QuestionOption[];
  explanation?: string;
  correctAnswer?: string | string[];
}

interface Response {
  questionId: string;
  answer: string | string[];
  isCorrect?: boolean;
  pointsEarned?: number;
  feedback?: string;
}

interface QuestionReviewProps {
  questions: Question[];
  responses: Response[];
}

export default function QuestionReview({
  questions,
  responses,
}: QuestionReviewProps) {
  return (
    <div className="space-y-6 max-w-2xl mx-auto py-8">
      {questions.map((q, idx) => {
        const response = responses.find((r) => r.questionId === q.id);
        const isCorrect = response?.isCorrect;
        const feedbackColor =
          isCorrect === true
            ? 'border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/10'
            : isCorrect === false
            ? 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/10'
            : 'border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10';
        return (
          <Card key={q.id} className={`mb-6 rounded-lg ${feedbackColor}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Question {idx + 1}
                </span>
                <span className="flex items-center gap-1 text-sm font-semibold">
                  {isCorrect === true && (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" /> Correct
                    </>
                  )}
                  {isCorrect === false && (
                    <>
                      <XCircle className="w-4 h-4 text-red-600" /> Incorrect
                    </>
                  )}
                  {isCorrect === undefined && (
                    <>
                      <Info className="w-4 h-4 text-yellow-600" /> Pending
                    </>
                  )}
                </span>
              </div>
              <div className="mb-4">
                <p className="text-gray-800 dark:text-gray-100 mb-3 font-medium">
                  {q.text}
                </p>
                <div className="bg-white dark:bg-card p-3 rounded border">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Your answer:
                  </span>
                  <span className="ml-2 font-medium">
                    {renderAnswer(q, response?.answer)}
                  </span>
                </div>
                {q.correctAnswer !== undefined && (
                  <div className="mt-2 bg-green-50 dark:bg-green-900/10 p-2 rounded text-sm">
                    <span className="font-medium">Correct answer:</span>{' '}
                    {renderAnswer(q, q.correctAnswer)}
                  </div>
                )}
              </div>
              {q.explanation && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded border-l-4 border-l-blue-400">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {q.explanation}
                  </p>
                </div>
              )}
              {response?.feedback && (
                <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/10 rounded text-sm">
                  <span className="font-medium">Teacher feedback:</span>{' '}
                  {response.feedback}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function renderAnswer(q: Question, answer: string | string[]) {
  switch (q.type) {
    case 'multiple-choice':
      return Array.isArray(answer)
        ? answer
            .map((a: string) => q.options?.find((o) => o.id === a)?.text || a)
            .join(', ')
        : q.options?.find((o) => o.id === answer)?.text || answer;
    case 'true-false':
      return answer === true ? 'True' : answer === false ? 'False' : '';
    case 'short-answer':
    case 'essay':
      return answer || '';
    case 'fill-in-blank':
      return Array.isArray(answer) ? answer.join(', ') : answer;
    default:
      return String(answer ?? '');
  }
}
