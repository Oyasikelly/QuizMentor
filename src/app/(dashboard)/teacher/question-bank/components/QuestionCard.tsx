import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Copy, Trash2, PlusCircle } from 'lucide-react';

interface QuestionCardProps {
  question: {
    id: string;
    text: string;
    type: 'MCQ' | 'True/False' | 'Short Answer';
    difficulty: 'Easy' | 'Medium' | 'Hard';
    tags: string[];
    usage: number;
  };
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onAddToQuiz?: () => void;
}

export function QuestionCard({
  question,
  onEdit,
  onDuplicate,
  onDelete,
  onAddToQuiz,
}: QuestionCardProps) {
  return (
    <Card className="w-full max-w-md sm:max-w-lg p-4 sm:p-6 flex flex-col gap-2 mx-auto">
      <div className="flex items-center justify-between gap-2">
        <div className="font-medium truncate max-w-xs" title={question.text}>
          {question.text}
        </div>
        <Badge variant="outline" className="ml-2">
          {question.type}
        </Badge>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="secondary">{question.difficulty}</Badge>
        {question.tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
        <span className="ml-auto">Used {question.usage}x</span>
      </div>
      <div className="flex gap-2 mt-2">
        <Button size="icon" variant="ghost" aria-label="Edit" onClick={onEdit}>
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Duplicate"
          onClick={onDuplicate}
        >
          <Copy className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Delete"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          aria-label="Add to Quiz"
          onClick={onAddToQuiz}
        >
          <PlusCircle className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
