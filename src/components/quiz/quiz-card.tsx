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
import { cn } from '@/lib/utils';

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
    <Card className={cn('w-full h-full', className)}>
      <CardHeader
        className={cn(isCompact ? 'pb-2' : '', 'px-4 sm:px-6 pt-4 pb-2')}
      >
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
      <CardContent
        className={cn(
          isCompact ? 'pt-0' : '',
          'px-4 sm:px-6 pb-4 flex flex-col gap-2'
        )}
      >
        <div className="space-y-3 min-w-0 break-words">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
              <div className="flex items-center gap-1 min-w-0">
                <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">
                  {quiz.subject && typeof quiz.subject === 'object'
                    ? quiz.subject.name
                    : String(quiz.subject || 'No Subject')}
                </span>
              </div>
              {quiz.timeLimit && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>{quiz.timeLimit} min</span>
                </div>
              )}
              <div className="flex items-center gap-1 mt-1 sm:mt-0">
                <Target className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span>{quiz.totalPoints} pts</span>
              </div>
            </div>
          </div>

          {!isCompact && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 gap-2">
              <div className="text-xs text-muted-foreground">
                Created {new Date(quiz.createdAt).toLocaleDateString()}
              </div>
              <div className="flex gap-2 flex-wrap">
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
