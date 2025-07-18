import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, ListChecks, Repeat } from 'lucide-react';

interface QuizStartProps {
  title: string;
  description?: string;
  timeLimit?: number; // in minutes
  questionCount: number;
  attemptsAllowed?: number;
  onStart: () => void;
  loading?: boolean;
}

export default function QuizStart({
  title,
  description,
  timeLimit,
  questionCount,
  attemptsAllowed,
  onStart,
  loading,
}: QuizStartProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold text-center mb-2">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {description && (
            <p className="text-center text-muted-foreground mb-6 text-base md:text-lg">
              {description}
            </p>
          )}
          <div className="flex justify-center gap-4 mb-8">
            <div className="flex flex-col items-center">
              <Timer className="w-6 h-6 text-blue-500 mb-1" />
              <span className="text-xs font-medium text-muted-foreground">
                Time
              </span>
              <span className="font-semibold text-sm">
                {timeLimit ? `${timeLimit} min` : 'No limit'}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <ListChecks className="w-6 h-6 text-green-500 mb-1" />
              <span className="text-xs font-medium text-muted-foreground">
                Questions
              </span>
              <span className="font-semibold text-sm">{questionCount}</span>
            </div>
            {attemptsAllowed && (
              <div className="flex flex-col items-center">
                <Repeat className="w-6 h-6 text-purple-500 mb-1" />
                <span className="text-xs font-medium text-muted-foreground">
                  Attempts
                </span>
                <span className="font-semibold text-sm">{attemptsAllowed}</span>
              </div>
            )}
          </div>
          <Button
            className="w-full py-3 text-lg font-semibold rounded-xl shadow-md"
            onClick={onStart}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Begin Quiz'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
