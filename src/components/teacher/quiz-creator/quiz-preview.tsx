'use client';

import { useState } from 'react';
import {
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Play,
  Clock,
  Award,
  Users,
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
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuizSettings, Question } from '@/types/quiz-creation';
import {
  getQuestionTypeDisplayName,
  getQuestionTypeIcon,
  getDifficultyColor,
} from '@/lib/question-templates';

interface QuizPreviewProps {
  quiz: QuizSettings;
  questions: Question[];
  onPublish: () => Promise<void>;
  onSaveDraft: () => Promise<void>;
  isPublishing?: boolean;
  isSaving?: boolean;
}

export default function QuizPreview({
  quiz,
  questions,
  onPublish,
  onSaveDraft,
  isPublishing = false,
  isSaving = false,
}: QuizPreviewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const [viewMode, setViewMode] = useState<'student' | 'teacher'>('student');

  const currentQuestion = questions[currentQuestionIndex];
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const estimatedTime = Math.ceil(questions.length * 2);

  const difficultyDistribution = {
    easy: questions.filter((q) => q.difficulty === 'Easy').length,
    medium: questions.filter((q) => q.difficulty === 'Medium').length,
    hard: questions.filter((q) => q.difficulty === 'Hard').length,
  };

  const questionTypes = Array.from(new Set(questions.map((q) => q.type))).map(
    (type) => ({
      type,
      count: questions.filter((q) => q.type === type).length,
    })
  );

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const getQuestionDisplay = (question: Question) => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            <p className="text-lg">{question.question}</p>
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 border rounded-lg"
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    id={`option-${question.id}-${index}`}
                    disabled
                  />
                  <label
                    htmlFor={`option-${question.id}-${index}`}
                    className="flex-1 cursor-pointer"
                  >
                    {String.fromCharCode(65 + index)}) {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'true-false':
        return (
          <div className="space-y-3">
            <p className="text-lg">{question.question}</p>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <input type="radio" name={`question-${question.id}`} disabled />
                <label className="flex-1 cursor-pointer">True</label>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <input type="radio" name={`question-${question.id}`} disabled />
                <label className="flex-1 cursor-pointer">False</label>
              </div>
            </div>
          </div>
        );

      case 'short-answer':
        return (
          <div className="space-y-3">
            <p className="text-lg">{question.question}</p>
            <textarea
              className="w-full p-3 border rounded-lg resize-none"
              rows={3}
              placeholder="Enter your answer here..."
              disabled
            />
          </div>
        );

      case 'essay':
        return (
          <div className="space-y-3">
            <p className="text-lg">{question.question}</p>
            <textarea
              className="w-full p-3 border rounded-lg resize-none"
              rows={6}
              placeholder="Write your essay answer here..."
              disabled
            />
          </div>
        );

      case 'fill-blank':
        return (
          <div className="space-y-3">
            <p className="text-lg">{question.question}</p>
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              placeholder="Enter your answer..."
              disabled
            />
          </div>
        );

      default:
        return <p className="text-lg">{question.question}</p>;
    }
  };

  const getAnswerDisplay = (question: Question) => {
    if (!showAnswers) return null;

    return (
      <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
          Correct Answer:
        </h4>
        <p className="text-green-700 dark:text-green-300">
          {Array.isArray(question.correctAnswer)
            ? question.correctAnswer.join(', ')
            : question.correctAnswer}
        </p>
        {question.explanation && (
          <div className="mt-2 pt-2 border-t border-green-200 dark:border-green-700">
            <h5 className="font-medium text-green-800 dark:text-green-200 mb-1">
              Explanation:
            </h5>
            <p className="text-sm text-green-700 dark:text-green-300">
              {question.explanation}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Quiz Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span>Quiz Preview</span>
          </CardTitle>
          <CardDescription>
            Preview how your quiz will appear to students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {quiz.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {quiz.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{quiz.subject}</Badge>
                  <Badge variant="outline">{quiz.category}</Badge>
                  <Badge
                    variant="secondary"
                    className={getDifficultyColor(quiz.difficulty)}
                  >
                    {quiz.difficulty}
                  </Badge>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {quiz.timeLimit
                        ? `${quiz.timeLimit} minutes`
                        : 'No time limit'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4" />
                    <span>{totalPoints} points</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{questions.length} questions</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {questions.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Questions
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {totalPoints}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Points
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Question Types</h4>
                <div className="flex flex-wrap gap-2">
                  {questionTypes.map(({ type, count }) => (
                    <Badge key={type} variant="secondary">
                      {getQuestionTypeDisplayName(type)} ({count})
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Question Preview</CardTitle>
              <CardDescription>
                Question {currentQuestionIndex + 1} of {questions.length}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Tabs
                value={viewMode}
                onValueChange={(value) =>
                  setViewMode(value as 'student' | 'teacher')
                }
              >
                <TabsList>
                  <TabsTrigger value="student">Student View</TabsTrigger>
                  <TabsTrigger value="teacher">Teacher View</TabsTrigger>
                </TabsList>
              </Tabs>
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
        </CardHeader>
        <CardContent>
          {currentQuestion ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {getQuestionTypeDisplayName(currentQuestion.type)}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={getDifficultyColor(currentQuestion.difficulty)}
                  >
                    {currentQuestion.difficulty}
                  </Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {currentQuestion.points} points
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
              </div>

              <div className="border rounded-lg p-6 bg-white dark:bg-gray-800">
                {getQuestionDisplay(currentQuestion)}
                {getAnswerDisplay(currentQuestion)}
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {currentQuestionIndex + 1} of {questions.length}
                  </span>
                </div>

                <Button
                  variant="outline"
                  onClick={handleNext}
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No questions to preview
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Quiz Analytics</CardTitle>
          <CardDescription>Summary of your quiz composition</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Difficulty Distribution</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Easy</span>
                  <span className="text-sm font-medium">
                    {difficultyDistribution.easy}
                  </span>
                </div>
                <Progress
                  value={(difficultyDistribution.easy / questions.length) * 100}
                  className="h-2"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Medium</span>
                  <span className="text-sm font-medium">
                    {difficultyDistribution.medium}
                  </span>
                </div>
                <Progress
                  value={
                    (difficultyDistribution.medium / questions.length) * 100
                  }
                  className="h-2"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Hard</span>
                  <span className="text-sm font-medium">
                    {difficultyDistribution.hard}
                  </span>
                </div>
                <Progress
                  value={(difficultyDistribution.hard / questions.length) * 100}
                  className="h-2"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Question Types</h4>
              <div className="space-y-2">
                {questionTypes.map(({ type, count }) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm">
                      {getQuestionTypeDisplayName(type)}
                    </span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Quiz Statistics</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Questions</span>
                  <span className="text-sm font-medium">
                    {questions.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Points</span>
                  <span className="text-sm font-medium">{totalPoints}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Points</span>
                  <span className="text-sm font-medium">
                    {questions.length > 0
                      ? Math.round((totalPoints / questions.length) * 10) / 10
                      : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Estimated Time</span>
                  <span className="text-sm font-medium">
                    {estimatedTime} minutes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onSaveDraft} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Draft'}
        </Button>
        <Button onClick={onPublish} disabled={isPublishing}>
          <Play className="w-4 h-4 mr-2" />
          {isPublishing ? 'Publishing...' : 'Publish Quiz'}
        </Button>
      </div>
    </div>
  );
}
