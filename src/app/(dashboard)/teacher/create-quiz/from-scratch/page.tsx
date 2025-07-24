'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Settings,
  Eye,
  Play,
  CheckCircle,
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
import { Question, QuizSettings } from '@/types/quiz-creation';
import QuizSettingsForm from '@/components/teacher/quiz-creator/quiz-settings-form';
import QuestionEditor from '@/components/teacher/quiz-creator/question-editor';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { useAuth } from '@/hooks/useAuth';

type CreationStep = 'settings' | 'questions' | 'review';

// Mock user data for dashboard layout
const mockUser = {
  id: 'teacher1',
  name: 'Dr. Sarah Wilson',
  email: 'sarah.wilson@example.com',
  role: 'teacher' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function FromScratchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isTemplate = searchParams.get('template') === 'true';
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);

  useEffect(() => {
    async function fetchSubjects() {
      if (!user?.id) return;
      setSubjectsLoading(true);
      try {
        const res = await fetch(`/api/subjects?teacherId=${user.id}`);
        const data = await res.json();
        setSubjects(data.subjects || []);
      } catch (err) {
        setSubjects([]);
      } finally {
        setSubjectsLoading(false);
      }
    }
    fetchSubjects();
  }, [user]);

  const [currentStep, setCurrentStep] = useState<CreationStep>('settings');
  const [quizSettings, setQuizSettings] = useState<Partial<QuizSettings>>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  // Debug log: log questions state in parent on every render
  useEffect(() => {
    console.log('[FromScratchPage] questions state:', questions);
  }, [questions]);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    {
      id: 'settings',
      title: 'Quiz Settings',
      description: 'Configure quiz settings',
    },
    {
      id: 'questions',
      title: 'Questions',
      description: 'Create and edit questions',
    },
    { id: 'review', title: 'Review', description: 'Preview and publish' },
  ];

  const handleSettingsChange = (settings: Partial<QuizSettings>) => {
    setQuizSettings((prev) => ({ ...prev, ...settings }));
  };

  const handleQuestionsChange = (updatedQuestions: Question[]) => {
    setQuestions(updatedQuestions);
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      // Save draft logic here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Draft saved');
    } catch (error) {
      console.error('Failed to save draft:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setError(null);
    try {
      if (!quizSettings.title || !quizSettings.subjectId || !user?.id) {
        setError('Title, subject, and teacher are required.');
        setIsPublishing(false);
        return;
      }
      // Fetch organizationId from user
      const organizationId = user.organizationId;
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: quizSettings.title,
          description: quizSettings.description || '',
          questions,
          teacherId: user.id,
          subjectId: quizSettings.subjectId,
          organizationId,
          isPublished: true,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to publish quiz.');
        setIsPublishing(false);
        return;
      }
      router.push('/teacher/manage-quizzes');
    } catch (error: any) {
      setError(error.message || 'Failed to publish quiz.');
    } finally {
      setIsPublishing(false);
    }
  };

  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.id === currentStep);
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 'settings':
        return quizSettings.title && quizSettings.subjectId;
      case 'questions':
        return questions.length > 0;
      case 'review':
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < steps.length - 1 && canProceedToNext()) {
      setCurrentStep(steps[currentIndex + 1].id as CreationStep);
    }
  };

  const handlePrevious = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id as CreationStep);
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 'settings':
        return (
          <QuizSettingsForm
            settings={quizSettings}
            onSettingsChange={handleSettingsChange}
            onNext={handleNext}
            subjects={subjects}
          />
        );
      case 'questions':
        return (
          <QuestionEditor
            questions={questions}
            onQuestionsChange={(updatedQuestions) => {
              console.log(
                '[FromScratchPage] onQuestionsChange called:',
                updatedQuestions
              );
              setQuestions(updatedQuestions);
              setTimeout(() => {
                console.log(
                  '[FromScratchPage] questions state after setQuestions:',
                  questions
                );
              }, 100);
            }}
            onNext={handleNext}
          />
        );
      case 'review':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Preview</CardTitle>
                <CardDescription>
                  Review your quiz before publishing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {quizSettings.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {quizSettings.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium">Subject:</span>
                      <p className="text-sm text-muted-foreground">
                        {quizSettings.subjectId}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Questions:</span>
                      <p className="text-sm text-muted-foreground">
                        {questions.length}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Question Types</h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(questions.map((q) => q.type))).map(
                        (type) => (
                          <Badge key={type} variant="secondary">
                            {type.replace('-', ' ')}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Quiz Settings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Subject:</span>
                        <span className="ml-2 font-medium">
                          {quizSettings.subjectId}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Category:</span>
                        <span className="ml-2 font-medium">
                          {quizSettings.category}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Time Limit:
                        </span>
                        <span className="ml-2 font-medium">
                          {quizSettings.timeLimit} minutes
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Total Points:
                        </span>
                        <span className="ml-2 font-medium">
                          {questions.reduce((sum, q) => sum + q.points, 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {error && (
              <div className="text-red-500 text-center mt-2">{error}</div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {isTemplate
                  ? 'Create Quiz from Template'
                  : 'Create Quiz from Scratch'}
              </h1>
              <p className="text-muted-foreground mt-2">
                {isTemplate
                  ? 'Customize a pre-built quiz template'
                  : 'Create questions manually with full control'}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = getCurrentStepIndex() > index;
                const canAccess = getCurrentStepIndex() >= index;

                return (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-2 ${
                      !canAccess ? 'opacity-50' : ''
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                        isActive
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : isCompleted
                          ? 'border-green-500 bg-green-500 text-white'
                          : 'border-gray-300 bg-gray-100 text-gray-500'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="hidden sm:block">
                      <div
                        className={`text-sm font-medium ${
                          isActive
                            ? 'text-blue-600'
                            : isCompleted
                            ? 'text-green-600'
                            : 'text-gray-500'
                        }`}
                      >
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {step.description}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-8 h-0.5 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <div className="min-h-[400px]">{getStepContent()}</div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={getCurrentStepIndex() === 0}
          >
            Previous
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
            {currentStep === 'review' ? (
              <Button
                onClick={handlePublish}
                disabled={isPublishing}
                className="bg-green-600 hover:bg-green-700"
              >
                {isPublishing ? 'Publishing...' : 'Publish Quiz'}
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!canProceedToNext()}>
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
