'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Edit,
  Copy,
  ArrowRight,
  Clock,
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

import { QuizCreationMethod } from '@/types/quiz-creation';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { useAuth } from '@/hooks/useAuth';
import { FullPageSpinner } from '@/components/shared/loading-spinner';

const CREATE_METHODS: QuizCreationMethod[] = [
  {
    id: 'from-document',
    title: 'From Document',
    description:
      'Upload PDFs, Word docs, or text files and let AI generate questions',
    icon: FileText,
    features: [
      'AI-powered question generation',
      'Supports multiple formats',
      'Automatic content analysis',
    ],
    estimatedTime: '5-10 minutes',
  },
  {
    id: 'from-scratch',
    title: 'From Scratch',
    description:
      'Create questions manually with full control over content and format',
    icon: Edit,
    features: [
      'Full control over questions',
      'Multiple question types',
      'Custom formatting',
    ],
    estimatedTime: '15-30 minutes',
  },
  {
    id: 'from-template',
    title: 'From Template',
    description:
      'Use pre-built quiz templates and customize them for your needs',
    icon: Copy,
    features: [
      'Pre-built question sets',
      'Subject-specific templates',
      'Quick customization',
    ],
    estimatedTime: '3-5 minutes',
  },
];

export default function CreateQuizPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] =
    useState<QuizCreationMethod | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (loading) return <FullPageSpinner text="Loading your dashboard..." />;
  if (!user) return null;

  const handleMethodSelect = (method: QuizCreationMethod) => {
    setSelectedMethod(method);
  };

  const handleContinue = async () => {
    if (!selectedMethod) return;

    setIsLoading(true);

    try {
      // Navigate to the appropriate creation method
      switch (selectedMethod.id) {
        case 'from-document':
          router.push('/teacher/create-quiz/from-document');
          break;
        case 'from-scratch':
          router.push('/teacher/create-quiz/from-scratch');
          break;
        case 'from-template':
          router.push('/teacher/create-quiz/from-template');
          break;
      }
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Quiz
            </h1>
            <p className="text-muted-foreground mt-2">
              Choose how you&apos;d like to create your quiz
            </p>
          </div>
        </div>

        {/* Method Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CREATE_METHODS.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod?.id === method.id;

            return (
              <Card
                key={method.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'hover:shadow-md'
                }`}
                onClick={() => handleMethodSelect(method)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-3 rounded-lg ${
                          isSelected
                            ? 'bg-blue-100 dark:bg-blue-800'
                            : 'bg-gray-100 dark:bg-gray-800'
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 ${
                            isSelected
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        />
                      </div>
                      <div>
                        <CardTitle
                          className={`text-lg ${
                            isSelected
                              ? 'text-blue-900 dark:text-blue-100'
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {method.title}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {method.estimatedTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-300 mb-4">
                    {method.description}
                  </CardDescription>

                  <div className="space-y-2">
                    {method.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center pt-6">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedMethod || isLoading}
            className="px-8 py-3 text-lg"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>Continue with {selectedMethod?.title}</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </Button>
        </div>

        {/* Tips Section */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-xl">
              💡 Tips for Creating Great Quizzes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">From Document</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Upload clear, well-structured documents</li>
                  <li>• Include key concepts and definitions</li>
                  <li>• Review generated questions before publishing</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">From Scratch</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Mix different question types</li>
                  <li>• Include explanations for correct answers</li>
                  <li>• Test your quiz before assigning to students</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
