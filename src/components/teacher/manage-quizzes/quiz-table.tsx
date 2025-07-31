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
  Users,
  Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

interface QuizTableProps {
  quizzes: Quiz[];
  onAction: (quizId: string, action: string) => void;
}

export function QuizTable({ quizzes, onAction }: QuizTableProps) {
  const [deleteQuizId, setDeleteQuizId] = useState<string | null>(null);

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

  const handleAction = (quizId: string, action: string) => {
    if (action === 'delete') {
      setDeleteQuizId(quizId);
    } else {
      onAction(quizId, action);
    }
  };

  const confirmDelete = () => {
    if (deleteQuizId) {
      onAction(deleteQuizId, 'delete');
      setDeleteQuizId(null);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Attempts</TableHead>
              <TableHead>Avg Score</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Modified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quizzes.map((quiz) => (
              <TableRow key={quiz.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div>
                    <div className="font-semibold">{quiz.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {quiz.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {typeof quiz.subject === 'object' && quiz.subject !== null
                      ? quiz.subject.name
                      : quiz.subject || '-'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`text-xs ${getStatusColor(
                      quiz.status || 'draft'
                    )}`}
                  >
                    {getStatusText(quiz.status || 'draft')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Target className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">
                      {quiz.questions?.length || 0}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{quiz.attempts || 0}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {(quiz.averageScore || 0) > 0 ? (
                    <span className="text-sm font-medium">
                      {quiz.averageScore || 0}%
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(quiz.createdAt), 'MMM d, yyyy')}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(quiz.updatedAt), 'MMM d, yyyy')}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleAction(quiz.id, 'edit')}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAction(quiz.id, 'preview')}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAction(quiz.id, 'duplicate')}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleAction(quiz.id, 'archive')}
                      >
                        <Archive className="mr-2 h-4 w-4" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAction(quiz.id, 'delete')}
                        className="text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!deleteQuizId}
        onOpenChange={() => setDeleteQuizId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this quiz? This action cannot be
              undone.
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
