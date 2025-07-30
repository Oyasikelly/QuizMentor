'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Edit, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface QuizData {
  title: string;
  description: string;
  subject: string;
  category: string;
  method?: string;
}

interface CreateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateQuiz: (quizData: QuizData) => void;
}

const CREATE_METHODS = [
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

export function CreateQuizModal({
  isOpen,
  onClose,
  onCreateQuiz,
}: CreateQuizModalProps) {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<QuizData>({
    title: '',
    description: '',
    subject: '',
    category: '',
  });

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
  };

  const handleCreateQuiz = () => {
    if (!selectedMethod) return;

    // Navigate to the appropriate creation method
    switch (selectedMethod) {
      case 'from-document':
        router.push('/teacher/create-quiz/from-document');
        break;
      case 'from-scratch':
        router.push('/teacher/create-quiz/from-scratch');
        break;
      case 'from-template':
        router.push('/teacher/create-quiz/from-scratch?template=true');
        break;
    }
    onClose();
  };

  const handleQuickCreate = () => {
    if (!quizData.title || !quizData.subject) return;

    onCreateQuiz({
      ...quizData,
      method: 'quick',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Quiz</DialogTitle>
          <DialogDescription>
            Choose how you&apos;d like to create your quiz
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Create Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Create</CardTitle>
              <CardDescription>
                Create a basic quiz with minimal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Quiz Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter quiz title"
                    value={quizData.title}
                    onChange={(e) =>
                      setQuizData({ ...quizData, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select
                    value={quizData.subject}
                    onValueChange={(value) =>
                      setQuizData({ ...quizData, subject: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="Literature">Literature</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                      <SelectItem value="Geography">Geography</SelectItem>
                      <SelectItem value="Language">Language</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter quiz description"
                  value={quizData.description}
                  onChange={(e) =>
                    setQuizData({ ...quizData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <Button
                onClick={handleQuickCreate}
                disabled={!quizData.title || !quizData.subject}
              >
                Create Quiz
              </Button>
            </CardContent>
          </Card>

          {/* Creation Methods */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Or choose a creation method:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CREATE_METHODS.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;

                return (
                  <Card
                    key={method.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      isSelected
                        ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => handleMethodSelect(method.id)}
                  >
                    <CardHeader className="pb-4">
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
                          <CardTitle className="text-lg">
                            {method.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {method.estimatedTime}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">
                        {method.description}
                      </CardDescription>
                      <div className="space-y-2">
                        {method.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            <span className="text-sm text-muted-foreground">
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
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleCreateQuiz} disabled={!selectedMethod}>
              Continue with{' '}
              {selectedMethod
                ? CREATE_METHODS.find((m) => m.id === selectedMethod)?.title
                : 'Method'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
