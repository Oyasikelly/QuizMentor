'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Save, Eye, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { WizardStep } from '@/types/quiz-creation';

interface QuizCreationWizardProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  quiz: Record<string, unknown>;
  questions: Record<string, unknown>[];
  onSaveDraft: () => Promise<void>;
  onPublish: () => Promise<void>;
}

const WIZARD_STEPS: WizardStep[] = [
  {
    id: 1,
    title: 'Method',
    description: 'Choose creation method',
    isCompleted: false,
    isActive: true,
    isDisabled: false,
  },
  {
    id: 2,
    title: 'Settings',
    description: 'Configure quiz settings',
    isCompleted: false,
    isActive: false,
    isDisabled: true,
  },
  {
    id: 3,
    title: 'Questions',
    description: 'Add and edit questions',
    isCompleted: false,
    isActive: false,
    isDisabled: true,
  },
  {
    id: 4,
    title: 'Review',
    description: 'Preview and publish',
    isCompleted: false,
    isActive: false,
    isDisabled: true,
  },
];

export default function QuizCreationWizard({
  currentStep,
  onStepChange,
  quiz,
  questions,
  onSaveDraft,
  onPublish,
}: QuizCreationWizardProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [steps, setSteps] = useState<WizardStep[]>(WIZARD_STEPS);

  // Update step states based on current step and completion
  useEffect(() => {
    setSteps((prevSteps) =>
      prevSteps.map((step) => ({
        ...step,
        isActive: step.id === currentStep,
        isCompleted: step.id < currentStep,
        isDisabled: step.id > currentStep,
      }))
    );
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      onStepChange(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1);
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      await onSaveDraft();
    } catch (error) {
      console.error('Failed to save draft:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await onPublish();
      router.push('/teacher/dashboard');
    } catch (error) {
      console.error('Failed to publish quiz:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: // Method
        return true; // Always can proceed from method selection
      case 2: // Settings
        return quiz?.title && quiz?.subject;
      case 3: // Questions
        return questions.length > 0;
      case 4: // Review
        return true; // Can always review
      default:
        return false;
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return <div>Method Selection Component</div>;
      case 2:
        return <div>Quiz Settings Component</div>;
      case 3:
        return <div>Question Editor Component</div>;
      case 4:
        return <div>Quiz Preview Component</div>;
      default:
        return <div>Unknown step</div>;
    }
  };

  const getStepTitle = () => {
    const step = steps.find((s) => s.id === currentStep);
    return step?.title || 'Unknown Step';
  };

  const getStepDescription = () => {
    const step = steps.find((s) => s.id === currentStep);
    return step?.description || '';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-gray-600 dark:text-gray-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {getStepTitle()}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {getStepDescription()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                disabled={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Draft'}
              </Button>

              {currentStep === 4 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    /* Preview logic */
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              )}

              {currentStep === 4 && (
                <Button onClick={handlePublish} disabled={isPublishing}>
                  <Play className="w-4 h-4 mr-2" />
                  {isPublishing ? 'Publishing...' : 'Publish Quiz'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Progress Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quiz Creation Progress
              </h3>
              <Progress
                value={(currentStep / steps.length) * 100}
                className="mb-4"
              />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Step {currentStep} of {steps.length}
              </p>
            </div>

            <div className="space-y-3">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    step.isActive
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : step.isCompleted
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step.isCompleted
                          ? 'bg-green-500 text-white'
                          : step.isActive
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {step.isCompleted ? '✓' : step.id}
                    </div>
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
                </div>
              ))}
            </div>

            {/* Quiz Info */}
            {quiz && (
              <Card className="bg-gray-50 dark:bg-gray-700">
                <CardContent className="p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Quiz Info
                  </h4>
                  <div className="space-y-2 text-sm">
                    {(() => {
                      const title = quiz.title;
                      return title && typeof title === 'string' ? (
                        <div>
                          <span className="text-gray-600 dark:text-gray-300">
                            Title:
                          </span>
                          <span className="ml-2 text-gray-900 dark:text-white">
                            {title}
                          </span>
                        </div>
                      ) : null;
                    })()}
                    {(() => {
                      const subject = quiz.subject;
                      return subject && typeof subject === 'string' ? (
                        <div>
                          <span className="text-gray-600 dark:text-gray-300">
                            Subject:
                          </span>
                          <span className="ml-2 text-gray-900 dark:text-white">
                            {subject}
                          </span>
                        </div>
                      ) : null;
                    })()}
                    {questions.length > 0 && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-300">
                          Questions:
                        </span>
                        <span className="ml-2 text-gray-900 dark:text-white">
                          {questions.length}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">{getStepContent()}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Draft'}
              </Button>

              {currentStep < steps.length && (
                <Button onClick={handleNext} disabled={!canProceed()}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
