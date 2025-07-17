import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Award, Clock, BarChart2 } from 'lucide-react';

interface CategoryBreakdown {
  label: string;
  correct: number;
  total: number;
}

interface ResultsOverviewProps {
  score: number;
  maxScore: number;
  timeTaken: number; // seconds
  rank?: string;
  breakdown?: CategoryBreakdown[];
  onReview: () => void;
  onRetake?: () => void;
  onDownload?: () => void;
}

export default function ResultsOverview({
  score,
  maxScore,
  timeTaken,
  rank,
  breakdown = [],
  onReview,
  onRetake,
  onDownload,
}: ResultsOverviewProps) {
  const percent = Math.round((score / maxScore) * 100);
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100/60 via-blue-100/40 to-purple-100/30 dark:from-[#23272f] dark:via-[#2d3140] dark:to-[#23272f]">
      <Card className="w-full max-w-2xl shadow-2xl backdrop-blur-md bg-white/80 dark:bg-card/80 border-0">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold text-center mb-2">
            🎉 Quiz Complete!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-center gap-6 mb-8">
            <div className="flex flex-col items-center">
              <Award className="w-8 h-8 text-yellow-500 mb-1" />
              <span className="text-xs text-muted-foreground">Final Score</span>
              <span className="text-2xl font-bold">{percent}%</span>
              <Progress value={percent} className="w-24 mt-1" />
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-8 h-8 text-blue-500 mb-1" />
              <span className="text-xs text-muted-foreground">Time Taken</span>
              <span className="text-2xl font-bold">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </span>
            </div>
            {rank && (
              <div className="flex flex-col items-center">
                <BarChart2 className="w-8 h-8 text-purple-500 mb-1" />
                <span className="text-xs text-muted-foreground">Rank</span>
                <span className="text-2xl font-bold">{rank}</span>
              </div>
            )}
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">
              Performance Breakdown
            </h3>
            {breakdown.length > 0 ? (
              <div className="space-y-2">
                {breakdown.map((cat) => {
                  const catPercent = Math.round(
                    (cat.correct / cat.total) * 100
                  );
                  return (
                    <div key={cat.label} className="flex items-center gap-3">
                      <span className="w-32 text-sm font-medium">
                        {cat.label}
                      </span>
                      <Progress value={catPercent} className="flex-1 h-2" />
                      <span className="text-xs font-mono w-10 text-right">
                        {catPercent}%
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-muted-foreground text-sm">
                No breakdown available.
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-4 justify-center mt-6">
            <Button onClick={onReview} variant="default">
              Review Answers
            </Button>
            {onRetake && (
              <Button onClick={onRetake} variant="outline">
                Retake Quiz
              </Button>
            )}
            {onDownload && (
              <Button onClick={onDownload} variant="secondary">
                Download Results
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
