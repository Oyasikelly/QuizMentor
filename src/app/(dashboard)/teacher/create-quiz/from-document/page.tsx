'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  DocumentUploadState,
  AIGenerationSettings,
  Question,
  QuizSettings,
} from '@/types/quiz-creation';
import { generateQuestionsFromDocument } from '@/lib/ai-integration';
import DocumentUploader from '@/components/teacher/quiz-creator/document-uploader';
import QuizSettingsForm from '@/components/teacher/quiz-creator/quiz-settings-form';
import QuestionEditor from '@/components/teacher/quiz-creator/question-editor';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { useAuth } from '@/hooks/useAuth';

type CreationStep = 'upload' | 'settings' | 'questions' | 'review';

export default function FromDocumentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<CreationStep>('upload');
  const [uploadState, setUploadState] = useState<DocumentUploadState>({
    files: [],
    uploadProgress: 0,
    processingStatus: 'idle',
    extractedContent: '',
    generatedQuestions: [],
    aiSuggestions: {
      questionCount: 10,
      questionTypes: ['multiple-choice', 'true-false'],
      difficulty: 'Medium',
      topics: [],
    },
  });
  const [quizSettings, setQuizSettings] = useState<Partial<QuizSettings>>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    async function fetchSubjects() {
      if (!user?.id) return;
      try {
        const res = await fetch(`/api/subjects?teacherId=${user.id}`);
        const data = await res.json();
        setSubjects(data.subjects || []);
      } catch {
        setSubjects([]);
      }
    }
    fetchSubjects();
  }, [user]);

  const steps = [
    {
      id: 'upload',
      title: 'Upload Documents',
      description: 'Upload your documents',
    },
    {
      id: 'settings',
      title: 'Quiz Settings',
      description: 'Configure quiz settings',
    },
    {
      id: 'questions',
      title: 'Questions',
      description: 'Review and edit questions',
    },
    { id: 'review', title: 'Review', description: 'Preview and publish' },
  ];

  const handleUploadStateChange = (updates: Partial<DocumentUploadState>) => {
    setUploadState((prev) => ({ ...prev, ...updates }));
  };

  const handleGenerateQuestions = async (settings: AIGenerationSettings) => {
    try {
      const response = await generateQuestionsFromDocument({
        content: uploadState.extractedContent,
        settings,
        subject: quizSettings.subjectId || 'General',
        category: quizSettings.category || 'Assessment',
      });

      setQuestions(response.questions);
      setCurrentStep('settings');
    } catch (error) {
      console.error('Failed to generate questions:', error);
      // Handle error - show toast or alert
    }
  };

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
    try {
      // Publish logic here
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push('/teacher');
    } catch (error) {
      console.error('Failed to publish quiz:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.id === currentStep);
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 'upload':
        return (
          uploadState.processingStatus === 'complete' && questions.length > 0
        );
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
      case 'upload':
        return (
          <DocumentUploader
            uploadState={uploadState}
            onUploadStateChange={handleUploadStateChange}
            onGenerateQuestions={handleGenerateQuestions}
          />
        );
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
            onQuestionsChange={handleQuestionsChange}
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
                        {subjects.find((s) => s.id === quizSettings.subjectId)
                          ?.name || ''}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Questions:</span>
                      <p className="text-sm text-muted-foreground">
                        {questions.length}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                Create Quiz from Document
              </h1>
              <p className="text-muted-foreground mt-2">
                Upload documents and let AI generate questions
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
