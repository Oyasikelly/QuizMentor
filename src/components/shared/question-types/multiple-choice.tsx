'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Question } from '@/types/quiz-creation';

interface MultipleChoiceEditorProps {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
  errors?: Record<string, string>;
}

export default function MultipleChoiceEditor({
  question,
  onUpdate,
  errors = {},
}: MultipleChoiceEditorProps) {
  const [options, setOptions] = useState<string[]>(
    question.options || ['', '', '', '']
  );

  const updateOptions = (newOptions: string[]) => {
    setOptions(newOptions);
    onUpdate({ options: newOptions });
  };

  const addOption = () => {
    if (options.length < 6) {
      updateOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      updateOptions(newOptions);

      // If the removed option was the correct answer, clear it
      if (question.correctAnswer === options[index]) {
        onUpdate({ correctAnswer: '' });
      }
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    updateOptions(newOptions);

    // Update correct answer if it was changed
    if (question.correctAnswer === options[index]) {
      onUpdate({ correctAnswer: value });
    }
  };

  const handleCorrectAnswerChange = (value: string) => {
    onUpdate({ correctAnswer: value });
  };

  return (
    <div className="space-y-6">
      {/* Question Text */}
      <div className="space-y-2">
        <Label htmlFor="question">Question Text *</Label>
        <Textarea
          id="question"
          value={question.question}
          onChange={(e) => onUpdate({ question: e.target.value })}
          placeholder="Enter your multiple choice question"
          rows={3}
          className={errors.question ? 'border-red-500' : ''}
        />
        {errors.question && (
          <p className="text-sm text-red-500">{errors.question}</p>
        )}
      </div>

      {/* Answer Options */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Answer Options *</Label>
          <Badge variant="outline" className="text-xs">
            {options.length}/6 options
          </Badge>
        </div>

        <div className="space-y-3">
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 flex-1">
                <input
                  type="radio"
                  name="correctAnswer"
                  id={`option-${index}`}
                  value={option}
                  checked={question.correctAnswer === option}
                  onChange={(e) => handleCorrectAnswerChange(e.target.value)}
                  disabled={!option.trim()}
                />
                <Label htmlFor={`option-${index}`} className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      {String.fromCharCode(65 + index)})
                    </span>
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      className="flex-1"
                    />
                  </div>
                </Label>
              </div>

              {options.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {options.length < 6 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addOption}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Option
          </Button>
        )}

        {errors.options && (
          <p className="text-sm text-red-500">{errors.options}</p>
        )}
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
