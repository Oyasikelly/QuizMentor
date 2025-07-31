'use client';

import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { WizardStep } from '@/types/quiz-creation';

interface QuizCreationProgressProps {
  steps: WizardStep[];
  currentStep: number;
  quiz?: Record<string, unknown>;
  questions?: Record<string, unknown>[];
  isDirty?: boolean;
  lastSaved?: Date;
}

export default function QuizCreationProgress({
  steps,
  currentStep,
  quiz,
  questions = [],
  isDirty = false,
  lastSaved,
}: QuizCreationProgressProps) {
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;
  const totalPoints = questions.reduce(
    (sum: number, q: Record<string, unknown>) =>
      sum + ((q.points as number) || 0),
    0
  );
  const estimatedTime = Math.ceil(questions.length * 2);

  const getStepIcon = (step: WizardStep) => {
    if (step.isCompleted) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (step.isActive) {
      return <Circle className="w-5 h-5 text-blue-500 fill-current" />;
    } else {
      return <Circle className="w-5 h-5 text-gray-300" />;
    }
  };

  const getStepStatus = (step: WizardStep) => {
    if (step.isCompleted) {
      return 'Completed';
    } else if (step.isActive) {
      return 'In Progress';
    } else {
      return 'Pending';
    }
  };

  const getStepStatusColor = (step: WizardStep) => {
    if (step.isCompleted) {
      return 'text-green-600';
    } else if (step.isActive) {
      return 'text-blue-600';
    } else {
      return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Creation Progress</span>
            <Badge variant={isDirty ? 'destructive' : 'secondary'}>
              {isDirty ? 'Unsaved Changes' : 'All Saved'}
            </Badge>
          </CardTitle>
          <CardDescription>
            Step {currentStep} of {steps.length} -{' '}
            {Math.round(progressPercentage)}% Complete
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={progressPercentage} className="w-full" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {currentStep}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Current Step
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {steps.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Total Steps
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {questions.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Questions
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {totalPoints}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Points
                </div>
              </div>
            </div>

            {lastSaved && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <Clock className="w-4 h-4" />
                <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Step Details */}
      <Card>
        <CardHeader>
          <CardTitle>Step Details</CardTitle>
          <CardDescription>
            Track your progress through each step
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                  step.isActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : step.isCompleted
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {getStepIcon(step)}
                  <div className="flex-1">
                    <h4
                      className={`font-medium ${
                        step.isActive
                          ? 'text-blue-900 dark:text-blue-100'
                          : step.isCompleted
                          ? 'text-green-900 dark:text-green-100'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {step.title}
                    </h4>
                    <p
                      className={`text-sm ${
                        step.isActive
                          ? 'text-blue-700 dark:text-blue-300'
                          : step.isCompleted
                          ? 'text-green-700 dark:text-green-300'
                          : 'text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className={getStepStatusColor(step)}>
                  {getStepStatus(step)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quiz Summary */}
      {(quiz || questions.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Quiz Summary</CardTitle>
            <CardDescription>Overview of your quiz in progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quiz && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Basic Info
                  </h4>
                  <div className="space-y-2 text-sm">
                    {(() => {
                      const title = quiz.title;
                      return title && typeof title === 'string' ? (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">
                            Title:
                          </span>
                          <span className="font-medium">{title}</span>
                        </div>
                      ) : null;
                    })()}
                    {(() => {
                      const subject = quiz.subject;
                      return subject && typeof subject === 'string' ? (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">
                            Subject:
                          </span>
                          <span className="font-medium">{subject}</span>
                        </div>
                      ) : null;
                    })()}
                    {(() => {
                      const category = quiz.category;
                      return category && typeof category === 'string' ? (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">
                            Category:
                          </span>
                          <span className="font-medium">{category}</span>
                        </div>
                      ) : null;
                    })()}
                    {(() => {
                      const difficulty = quiz.difficulty;
                      return difficulty && typeof difficulty === 'string' ? (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">
                            Difficulty:
                          </span>
                          <span className="font-medium">{difficulty}</span>
                        </div>
                      ) : null;
                    })()}
                  </div>
                </div>
              )}

              {questions.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Questions
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">
                        {questions.length}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">
                        Total
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-xl font-bold text-green-600">
                        {totalPoints}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">
                        Points
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-xl font-bold text-purple-600">
                        {estimatedTime}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">
                        Est. Time (min)
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-xl font-bold text-orange-600">
                        {questions.length > 0
                          ? Math.round((totalPoints / questions.length) * 10) /
                            10
                          : 0}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">
                        Avg. Points
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Auto-save Status */}
      <Card className="bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            {isDirty ? (
              <AlertCircle className="w-4 h-4 text-orange-500" />
            ) : (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
            <span className="text-sm font-medium">
              {isDirty ? 'Unsaved changes' : 'All changes saved'}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Your progress is automatically saved every 30 seconds
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
