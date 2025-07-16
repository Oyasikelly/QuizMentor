'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Eye, Copy, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Question, QuestionType } from '@/types/quiz-creation';
import {
  createQuestionFromTemplate,
  getQuestionTypeDisplayName,
  getQuestionTypeIcon,
  getDefaultPoints,
  getDifficultyLevels,
} from '@/lib/question-templates';

interface QuestionEditorProps {
  questions: Question[];
  onQuestionsChange: (questions: Question[]) => void;
  onNext: () => void;
}

export default function QuestionEditor({
  questions,
  onQuestionsChange,
  onNext,
}: QuestionEditorProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [activeTab, setActiveTab] = useState('editor');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const difficultyLevels = getDifficultyLevels();

  useEffect(() => {
    if (questions.length > 0 && !selectedQuestion) {
      setSelectedQuestion(questions[0]);
      setEditingQuestion({ ...questions[0] });
    }
  }, [questions, selectedQuestion]);

  const addQuestion = (type: QuestionType) => {
    const newQuestion = createQuestionFromTemplate(type, questions.length);
    const updatedQuestions = [...questions, newQuestion];
    onQuestionsChange(updatedQuestions);
    setSelectedQuestion(newQuestion);
    setEditingQuestion({ ...newQuestion });
    setActiveTab('editor');
  };

  const updateQuestion = (updates: Partial<Question>) => {
    if (!editingQuestion) return;

    const updatedQuestion = { ...editingQuestion, ...updates };
    setEditingQuestion(updatedQuestion);

    const updatedQuestions = questions.map((q) =>
      q.id === updatedQuestion.id ? updatedQuestion : q
    );
    onQuestionsChange(updatedQuestions);
  };

  const saveQuestion = () => {
    if (!editingQuestion) return;

    const validationErrors = validateQuestion(editingQuestion);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedQuestions = questions.map((q) =>
      q.id === editingQuestion.id ? editingQuestion : q
    );
    onQuestionsChange(updatedQuestions);
    setSelectedQuestion(editingQuestion);
    setErrors({});
  };

  const deleteQuestion = (questionId: string) => {
    const updatedQuestions = questions.filter((q) => q.id !== questionId);
    onQuestionsChange(updatedQuestions);

    if (selectedQuestion?.id === questionId) {
      setSelectedQuestion(
        updatedQuestions.length > 0 ? updatedQuestions[0] : null
      );
      setEditingQuestion(
        updatedQuestions.length > 0 ? { ...updatedQuestions[0] } : null
      );
    }
  };

  const duplicateQuestion = (question: Question) => {
    const duplicatedQuestion = {
      ...question,
      id: `question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      order: questions.length,
    };
    const updatedQuestions = [...questions, duplicatedQuestion];
    onQuestionsChange(updatedQuestions);
  };

  const reorderQuestions = (fromIndex: number, toIndex: number) => {
    const updatedQuestions = [...questions];
    const [movedQuestion] = updatedQuestions.splice(fromIndex, 1);
    updatedQuestions.splice(toIndex, 0, movedQuestion);

    // Update order property
    updatedQuestions.forEach((q, index) => {
      q.order = index;
    });

    onQuestionsChange(updatedQuestions);
  };

  const validateQuestion = (question: Question): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!question.question.trim()) {
      errors.question = 'Question text is required';
    }

    if (question.type === 'multiple-choice') {
      if (!question.options || question.options.length < 2) {
        errors.options = 'Multiple choice questions need at least 2 options';
      }
      if (!question.correctAnswer) {
        errors.correctAnswer = 'Correct answer is required';
      }
    }

    if (question.type === 'true-false') {
      if (
        !question.correctAnswer ||
        !['true', 'false'].includes(question.correctAnswer)
      ) {
        errors.correctAnswer =
          'True/False questions must have "true" or "false" as correct answer';
      }
    }

    if (
      ['short-answer', 'fill-blank'].includes(question.type) &&
      !question.correctAnswer
    ) {
      errors.correctAnswer = 'Correct answer is required';
    }

    if (question.points <= 0) {
      errors.points = 'Points must be greater than 0';
    }

    return errors;
  };

  const getQuestionTypeComponent = (question: Question) => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <MultipleChoiceEditor
            question={question}
            onUpdate={updateQuestion}
            errors={errors}
          />
        );
      case 'true-false':
        return (
          <TrueFalseEditor
            question={question}
            onUpdate={updateQuestion}
            errors={errors}
          />
        );
      case 'short-answer':
        return (
          <ShortAnswerEditor
            question={question}
            onUpdate={updateQuestion}
            errors={errors}
          />
        );
      case 'essay':
        return (
          <EssayEditor
            question={question}
            onUpdate={updateQuestion}
            errors={errors}
          />
        );
      case 'fill-blank':
        return (
          <FillBlankEditor
            question={question}
            onUpdate={updateQuestion}
            errors={errors}
          />
        );
      default:
        return <div>Unknown question type</div>;
    }
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const estimatedTime = Math.ceil(questions.length * 2); // 2 minutes per question

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Question Editor
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Create and edit your quiz questions
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">{questions.length}</span> questions •
            <span className="font-medium ml-1">{totalPoints}</span> points •
            <span className="font-medium ml-1">~{estimatedTime} min</span>
          </div>
          <Button onClick={onNext} disabled={questions.length === 0}>
            Continue to Review
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Questions</span>
                <Button size="sm" onClick={() => setActiveTab('add')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedQuestion?.id === question.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedQuestion(question);
                      setEditingQuestion({ ...question });
                      setActiveTab('editor');
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">
                          Q{index + 1}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {getQuestionTypeDisplayName(question.type)}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateQuestion(question);
                          }}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteQuestion(question.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                      {question.question || 'No question text'}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {question.points} pts
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {question.difficulty}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Editor */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Question Editor</CardTitle>
              <CardDescription>
                {selectedQuestion
                  ? `Editing Question ${
                      questions.findIndex((q) => q.id === selectedQuestion.id) +
                      1
                    }`
                  : 'Select a question to edit'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedQuestion && editingQuestion ? (
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="editor">Editor</TabsTrigger>
                    <TabsTrigger value="add">Add Question</TabsTrigger>
                  </TabsList>

                  <TabsContent value="editor" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Question Type</Label>
                        <Select
                          value={editingQuestion.type}
                          onValueChange={(value) =>
                            updateQuestion({ type: value as QuestionType })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              'multiple-choice',
                              'true-false',
                              'short-answer',
                              'essay',
                              'fill-blank',
                            ].map((type) => (
                              <SelectItem key={type} value={type}>
                                <div className="flex items-center space-x-2">
                                  <span>
                                    {getQuestionTypeIcon(type as QuestionType)}
                                  </span>
                                  <span>
                                    {getQuestionTypeDisplayName(
                                      type as QuestionType
                                    )}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Points</Label>
                        <Input
                          type="number"
                          value={editingQuestion.points}
                          onChange={(e) =>
                            updateQuestion({
                              points: parseInt(e.target.value) || 0,
                            })
                          }
                          min="1"
                          max="100"
                          className={errors.points ? 'border-red-500' : ''}
                        />
                        {errors.points && (
                          <p className="text-sm text-red-500">
                            {errors.points}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Difficulty</Label>
                      <Select
                        value={editingQuestion.difficulty}
                        onValueChange={(value) =>
                          updateQuestion({
                            difficulty: value as 'Easy' | 'Medium' | 'Hard',
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {difficultyLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              <span className={level.color}>{level.label}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {getQuestionTypeComponent(editingQuestion)}

                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          setEditingQuestion({ ...selectedQuestion })
                        }
                      >
                        Cancel
                      </Button>
                      <Button onClick={saveQuestion}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Question
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="add" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        'multiple-choice',
                        'true-false',
                        'short-answer',
                        'essay',
                        'fill-blank',
                      ].map((type) => (
                        <Card
                          key={type}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => addQuestion(type as QuestionType)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">
                                {getQuestionTypeIcon(type as QuestionType)}
                              </span>
                              <div>
                                <h4 className="font-medium">
                                  {getQuestionTypeDisplayName(
                                    type as QuestionType
                                  )}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  {getDefaultPoints(type as QuestionType)}{' '}
                                  points
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Select a question to edit or add a new question</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Question Type Editors
function MultipleChoiceEditor({
  question,
  onUpdate,
  errors,
}: {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
  errors: Record<string, string>;
}) {
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
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Question Text *</Label>
        <Textarea
          value={question.question}
          onChange={(e) => onUpdate({ question: e.target.value })}
          placeholder="Enter your question"
          rows={3}
          className={errors.question ? 'border-red-500' : ''}
        />
        {errors.question && (
          <p className="text-sm text-red-500">{errors.question}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Answer Options *</Label>
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              value={option}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                updateOptions(newOptions);
              }}
              placeholder={`Option ${String.fromCharCode(65 + index)}`}
            />
            <input
              type="radio"
              name="correctAnswer"
              checked={question.correctAnswer === option}
              onChange={() => onUpdate({ correctAnswer: option })}
            />
            {options.length > 2 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeOption(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        {options.length < 6 && (
          <Button type="button" variant="outline" size="sm" onClick={addOption}>
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

      <div className="space-y-2">
        <Label>Explanation (Optional)</Label>
        <Textarea
          value={question.explanation || ''}
          onChange={(e) => onUpdate({ explanation: e.target.value })}
          placeholder="Explain why this is the correct answer"
          rows={2}
        />
      </div>
    </div>
  );
}

function TrueFalseEditor({
  question,
  onUpdate,
  errors,
}: {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Question Text *</Label>
        <Textarea
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

      <div className="space-y-2">
        <Label>Explanation (Optional)</Label>
        <Textarea
          value={question.explanation || ''}
          onChange={(e) => onUpdate({ explanation: e.target.value })}
          placeholder="Explain why this is the correct answer"
          rows={2}
        />
      </div>
    </div>
  );
}

function ShortAnswerEditor({
  question,
  onUpdate,
  errors,
}: {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Question Text *</Label>
        <Textarea
          value={question.question}
          onChange={(e) => onUpdate({ question: e.target.value })}
          placeholder="Enter your question"
          rows={3}
          className={errors.question ? 'border-red-500' : ''}
        />
        {errors.question && (
          <p className="text-sm text-red-500">{errors.question}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Correct Answer *</Label>
        <Input
          value={question.correctAnswer as string}
          onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
          placeholder="Enter the correct answer"
          className={errors.correctAnswer ? 'border-red-500' : ''}
        />
        {errors.correctAnswer && (
          <p className="text-sm text-red-500">{errors.correctAnswer}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Explanation (Optional)</Label>
        <Textarea
          value={question.explanation || ''}
          onChange={(e) => onUpdate({ explanation: e.target.value })}
          placeholder="Explain the correct answer"
          rows={2}
        />
      </div>
    </div>
  );
}

function EssayEditor({
  question,
  onUpdate,
  errors,
}: {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Question Text *</Label>
        <Textarea
          value={question.question}
          onChange={(e) => onUpdate({ question: e.target.value })}
          placeholder="Enter your essay question"
          rows={3}
          className={errors.question ? 'border-red-500' : ''}
        />
        {errors.question && (
          <p className="text-sm text-red-500">{errors.question}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Sample Answer (Optional)</Label>
        <Textarea
          value={question.correctAnswer as string}
          onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
          placeholder="Provide a sample answer or key points"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Grading Criteria (Optional)</Label>
        <Textarea
          value={question.explanation || ''}
          onChange={(e) => onUpdate({ explanation: e.target.value })}
          placeholder="Describe what you're looking for in the answer"
          rows={3}
        />
      </div>
    </div>
  );
}

function FillBlankEditor({
  question,
  onUpdate,
  errors,
}: {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Question Text *</Label>
        <Textarea
          value={question.question}
          onChange={(e) => onUpdate({ question: e.target.value })}
          placeholder="Enter your question with _____ for the blank"
          rows={3}
          className={errors.question ? 'border-red-500' : ''}
        />
        <p className="text-sm text-gray-500">
          Use _____ to indicate where the blank should be
        </p>
        {errors.question && (
          <p className="text-sm text-red-500">{errors.question}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Correct Answer *</Label>
        <Input
          value={question.correctAnswer as string}
          onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
          placeholder="Enter the correct answer"
          className={errors.correctAnswer ? 'border-red-500' : ''}
        />
        {errors.correctAnswer && (
          <p className="text-sm text-red-500">{errors.correctAnswer}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Explanation (Optional)</Label>
        <Textarea
          value={question.explanation || ''}
          onChange={(e) => onUpdate({ explanation: e.target.value })}
          placeholder="Explain the correct answer"
          rows={2}
        />
      </div>
    </div>
  );
}
