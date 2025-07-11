'use client';

import { useState } from 'react';
import { Edit, Trash2, Copy, GripVertical, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Question } from '@/types/quiz-creation';
import {
  getQuestionTypeDisplayName,
  getQuestionTypeIcon,
  getDifficultyColor,
} from '@/lib/question-templates';

interface QuestionListProps {
  questions: Question[];
  onQuestionSelect: (question: Question) => void;
  onQuestionDelete: (questionId: string) => void;
  onQuestionDuplicate: (question: Question) => void;
  onQuestionsReorder: (questions: Question[]) => void;
  selectedQuestionId?: string;
}

export default function QuestionList({
  questions,
  onQuestionSelect,
  onQuestionDelete,
  onQuestionDuplicate,
  onQuestionsReorder,
  selectedQuestionId,
}: QuestionListProps) {
  const [showAnswers, setShowAnswers] = useState(false);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));

    if (dragIndex !== dropIndex) {
      const newQuestions = [...questions];
      const [draggedQuestion] = newQuestions.splice(dragIndex, 1);
      newQuestions.splice(dropIndex, 0, draggedQuestion);

      // Update order property
      newQuestions.forEach((q, index) => {
        q.order = index;
      });

      onQuestionsReorder(newQuestions);
    }
  };

  const getQuestionPreview = (question: Question) => {
    const text = question.question || 'No question text';
    return text.length > 100 ? text.substring(0, 100) + '...' : text;
  };

  const getAnswerPreview = (question: Question) => {
    if (!showAnswers) return null;

    switch (question.type) {
      case 'multiple-choice':
        return question.correctAnswer;
      case 'true-false':
        return question.correctAnswer;
      case 'short-answer':
      case 'fill-blank':
        return question.correctAnswer as string;
      case 'essay':
        return 'Essay question - manual grading required';
      default:
        return 'No answer';
    }
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const estimatedTime = Math.ceil(questions.length * 2);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Questions ({questions.length})
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Total: {totalPoints} points • Est. time: {estimatedTime} minutes
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAnswers(!showAnswers)}
          >
            {showAnswers ? (
              <EyeOff className="w-4 h-4 mr-2" />
            ) : (
              <Eye className="w-4 h-4 mr-2" />
            )}
            {showAnswers ? 'Hide' : 'Show'} Answers
          </Button>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-2">
        {questions.map((question, index) => (
          <div
            key={question.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
              selectedQuestionId === question.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}
            onClick={() => onQuestionSelect(question)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex items-center space-x-2 mt-1">
                  <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Q{index + 1}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {getQuestionTypeDisplayName(question.type)}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${getDifficultyColor(
                        question.difficulty
                      )}`}
                    >
                      {question.difficulty}
                    </Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {question.points} pts
                    </span>
                  </div>

                  <p className="text-sm text-gray-900 dark:text-white mb-2">
                    {getQuestionPreview(question)}
                  </p>

                  {showAnswers && (
                    <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                      <p className="text-xs text-green-700 dark:text-green-300 font-medium">
                        Answer: {getAnswerPreview(question)}
                      </p>
                    </div>
                  )}

                  {question.tags && question.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {question.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {question.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{question.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-1 ml-4">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuestionDuplicate(question);
                  }}
                  title="Duplicate question"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuestionDelete(question.id);
                  }}
                  title="Delete question"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {questions.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <div className="text-gray-500 dark:text-gray-400">
              <p className="text-lg font-medium mb-2">No questions yet</p>
              <p className="text-sm">Add your first question to get started</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {questions.length > 0 && (
        <Card className="bg-gray-50 dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {questions.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Questions
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {totalPoints}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Total Points
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {estimatedTime}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Est. Time (min)
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round((totalPoints / questions.length) * 10) / 10}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Avg. Points
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Question Types
              </h4>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(questions.map((q) => q.type))).map(
                  (type) => {
                    const count = questions.filter(
                      (q) => q.type === type
                    ).length;
                    return (
                      <Badge key={type} variant="secondary">
                        {getQuestionTypeDisplayName(type)} ({count})
                      </Badge>
                    );
                  }
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Difficulty Distribution
              </h4>
              <div className="flex flex-wrap gap-2">
                {['Easy', 'Medium', 'Hard'].map((difficulty) => {
                  const count = questions.filter(
                    (q) => q.difficulty === difficulty
                  ).length;
                  return (
                    <Badge
                      key={difficulty}
                      variant="outline"
                      className={getDifficultyColor(difficulty)}
                    >
                      {difficulty} ({count})
                    </Badge>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
