import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, Target } from 'lucide-react';
import { Quiz } from '@/types/quiz';

interface QuizCardProps {
  quiz: Quiz;
  onStart?: (quizId: string) => void;
  onView?: (quizId: string) => void;
  variant?: 'default' | 'compact';
  className?: string;
}

export function QuizCard({
  quiz,
  onStart,
  onView,
  variant = 'default',
  className,
}: QuizCardProps) {
  const isCompact = variant === 'compact';

  return (
    <Card className={className}>
      <CardHeader className={isCompact ? 'pb-2' : ''}>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{quiz.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {quiz.description}
            </CardDescription>
          </div>
          <Badge variant={quiz.isPublished ? 'default' : 'secondary'}>
            {quiz.isPublished ? 'Published' : 'Draft'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className={isCompact ? 'pt-0' : ''}>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{quiz.subject}</span>
              </div>
              {quiz.timeLimit && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{quiz.timeLimit} min</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span>{quiz.totalPoints} pts</span>
            </div>
          </div>

          {!isCompact && (
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-muted-foreground">
                Created {new Date(quiz.createdAt).toLocaleDateString()}
              </div>
              <div className="flex gap-2">
                {onView && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(quiz.id)}
                  >
                    View
                  </Button>
                )}
                {onStart && quiz.isPublished && (
                  <Button size="sm" onClick={() => onStart(quiz.id)}>
                    Start Quiz
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
