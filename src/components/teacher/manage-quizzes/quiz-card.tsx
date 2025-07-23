'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  Edit,
  Eye,
  Copy,
  Archive,
  Trash2,
  MoreHorizontal,
  Clock,
  Users,
  Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Quiz } from '@/types/quiz';

interface QuizCardProps {
  quiz: Quiz;
  onAction: (quizId: string, action: string) => void;
}

export function QuizCard({ quiz, onAction }: QuizCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'draft':
        return 'Draft';
      case 'archived':
        return 'Archived';
      default:
        return 'Unknown';
    }
  };

  const handleAction = (action: string) => {
    if (action === 'delete') {
      setShowDeleteDialog(true);
    } else {
      onAction(quiz.id, action);
    }
  };

  const confirmDelete = () => {
    onAction(quiz.id, 'delete');
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle
                className="text-base sm:text-lg font-semibold truncate"
                title={quiz.title}
              >
                {quiz.title.length > 25
                  ? quiz.title.slice(0, 25) + '...'
                  : quiz.title}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm line-clamp-2 mt-1">
                {quiz.description}
              </CardDescription>
            </div>
            <div className="flex-shrink-0 flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleAction('edit')}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction('preview')}>
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction('duplicate')}>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleAction('archive')}>
                    <Archive className="mr-2 h-4 w-4" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleAction('delete')}
                    className="text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col flex-1 space-y-4">
          {/* Status and Subject */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge variant="secondary" className="text-xs max-w-[60%] truncate">
              {typeof quiz.subject === 'string'
                ? quiz.subject
                : quiz.subject?.name || ''}
            </Badge>
            <Badge
              className={`text-xs ${getStatusColor(quiz.status || 'draft')}`}
            >
              {getStatusText(quiz.status || 'draft')}
            </Badge>
          </div>

          {/* Quiz Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 text-sm">
            <div className="flex items-center space-x-2 min-w-0">
              <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground truncate">
                {quiz.timeLimit} min
              </span>
            </div>
            <div className="flex items-center space-x-2 min-w-0">
              <Target className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground truncate">
                {quiz.totalPoints} pts
              </span>
            </div>
            <div className="flex items-center space-x-2 min-w-0">
              <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground truncate">
                {quiz.attempts || 0} attempts
              </span>
            </div>
            {(quiz.averageScore || 0) > 0 && (
              <div className="flex items-center space-x-2 min-w-0">
                <Target className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground truncate">
                  {quiz.averageScore || 0}% avg
                </span>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="text-xs text-muted-foreground space-y-1">
            <div>
              Created: {format(new Date(quiz.createdAt), 'MMM d, yyyy')}
            </div>
            <div>
              Modified: {format(new Date(quiz.updatedAt), 'MMM d, yyyy')}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction('edit')}
              className="flex-1 min-w-0"
            >
              <Edit className="mr-2 h-3 w-3" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction('preview')}
              className="flex-1 min-w-0"
            >
              <Eye className="mr-2 h-3 w-3" />
              Preview
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{quiz.title}"? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
