'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Question } from '@/types/quiz-creation';

interface TrueFalseEditorProps {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
  errors?: Record<string, string>;
}

export default function TrueFalseEditor({
  question,
  onUpdate,
  errors = {},
}: TrueFalseEditorProps) {
  return (
    <div className="space-y-6">
      {/* Question Text */}
      <div className="space-y-2">
        <Label htmlFor="question">Question Text *</Label>
        <Textarea
          id="question"
          value={question.question}
          onChange={(e) => onUpdate({ question: e.target.value })}
          placeholder="Enter your true/false statement"
          rows={3}
          className={errors.question ? 'border-red-500' : ''}
        />
        {errors.question && (
          <p className="text-sm text-red-500">{errors.question}</p>
        )}
      </div>

      {/* Correct Answer */}
      <div className="space-y-2">
        <Label>Correct Answer *</Label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="correctAnswer"
              value="true"
              checked={question.correctAnswer === 'true'}
              onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
            />
            <span>True</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="correctAnswer"
              value="false"
              checked={question.correctAnswer === 'false'}
              onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
            />
            <span>False</span>
          </label>
        </div>
        {errors.correctAnswer && (
          <p className="text-sm text-red-500">{errors.correctAnswer}</p>
        )}
      </div>

      {/* Explanation */}
      <div className="space-y-2">
        <Label htmlFor="explanation">Explanation (Optional)</Label>
        <Textarea
          id="explanation"
          value={question.explanation || ''}
          onChange={(e) => onUpdate({ explanation: e.target.value })}
          placeholder="Explain why this is the correct answer"
          rows={3}
        />
      </div>

      {/* Points and Difficulty */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="points">Points *</Label>
          <Input
            id="points"
            type="number"
            value={question.points}
            onChange={(e) =>
              onUpdate({ points: parseInt(e.target.value) || 0 })
            }
            min="1"
            max="100"
            className={errors.points ? 'border-red-500' : ''}
          />
          {errors.points && (
            <p className="text-sm text-red-500">{errors.points}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <select
            id="difficulty"
            value={question.difficulty}
            onChange={(e) =>
              onUpdate({
                difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard',
              })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2">
          {question.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="cursor-pointer">
              {tag}
              <button
                onClick={() => {
                  const newTags = question.tags.filter((_, i) => i !== index);
                  onUpdate({ tags: newTags });
                }}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input
            placeholder="Add a tag"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const input = e.target as HTMLInputElement;
                const newTag = input.value.trim();
                if (newTag && !question.tags.includes(newTag)) {
                  onUpdate({ tags: [...question.tags, newTag] });
                  input.value = '';
                }
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              const input = e.currentTarget
                .previousElementSibling as HTMLInputElement;
              const newTag = input.value.trim();
              if (newTag && !question.tags.includes(newTag)) {
                onUpdate({ tags: [...question.tags, newTag] });
                input.value = '';
              }
            }}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
