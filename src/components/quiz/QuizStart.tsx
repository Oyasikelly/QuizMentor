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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100/60 via-green-100/40 to-purple-100/30 dark:from-[#23272f] dark:via-[#2d3140] dark:to-[#23272f]">
      <Card className="w-full max-w-lg shadow-2xl backdrop-blur-md bg-white/80 dark:bg-card/80 border-0">
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
            className="w-full py-3 text-lg font-semibold rounded-xl shadow-md bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 transition-all duration-200"
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
