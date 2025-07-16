'use client';

import { useState } from 'react';
import {
  Sparkles,
  Settings,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AIGenerationSettings, Question } from '@/types/quiz-creation';
import {
  generateQuestionsFromScratch,
  improveQuestionsWithAI,
  generateQuestionExplanations,
} from '@/lib/ai-integration';

interface AIQuestionGeneratorProps {
  onQuestionsGenerated: (questions: Question[]) => void;
  existingQuestions?: Question[];
  topic?: string;
}

export default function AIQuestionGenerator({
  onQuestionsGenerated,
  existingQuestions = [],
  topic = '',
}: AIQuestionGeneratorProps) {
  const [generationSettings, setGenerationSettings] =
    useState<AIGenerationSettings>({
      questionCount: 10,
      questionTypes: ['multiple-choice', 'true-false'],
      difficulty: 'Medium',
      topics: [],
      focusAreas: [],
    });
  const [customTopic, setCustomTopic] = useState(topic);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [isAddingExplanations, setIsAddingExplanations] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);

  const questionTypeOptions = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'true-false', label: 'True/False' },
    { value: 'short-answer', label: 'Short Answer' },
    { value: 'essay', label: 'Essay' },
    { value: 'fill-blank', label: 'Fill in the Blank' },
  ];

  const difficultyOptions = [
    { value: 'Easy', label: 'Easy', color: 'text-green-600' },
    { value: 'Medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'Hard', label: 'Hard', color: 'text-red-600' },
  ];

  const handleGenerateQuestions = async () => {
    if (!customTopic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const questions = await generateQuestionsFromScratch(
        customTopic,
        generationSettings
      );
      setGeneratedQuestions(questions);
    } catch (error) {
      setError('Failed to generate questions. Please try again.');
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImproveQuestions = async () => {
    if (existingQuestions.length === 0) {
      setError('No questions to improve');
      return;
    }

    setIsImproving(true);
    setError(null);

    try {
      const feedback = prompt(
        'Please provide feedback on how to improve the questions:'
      );
      if (feedback) {
        const improvedQuestions = await improveQuestionsWithAI(
          existingQuestions,
          feedback
        );
        onQuestionsGenerated(improvedQuestions);
      }
    } catch (error) {
      setError('Failed to improve questions. Please try again.');
      console.error('Improvement error:', error);
    } finally {
      setIsImproving(false);
    }
  };

  const handleAddExplanations = async () => {
    if (existingQuestions.length === 0) {
      setError('No questions to add explanations to');
      return;
    }

    setIsAddingExplanations(true);
    setError(null);

    try {
      const questionsWithExplanations = await generateQuestionExplanations(
        existingQuestions
      );
      onQuestionsGenerated(questionsWithExplanations);
    } catch (error) {
      setError('Failed to add explanations. Please try again.');
      console.error('Explanation error:', error);
    } finally {
      setIsAddingExplanations(false);
    }
  };

  const handleUseGeneratedQuestions = () => {
    if (generatedQuestions.length > 0) {
      onQuestionsGenerated([...existingQuestions, ...generatedQuestions]);
      setGeneratedQuestions([]);
    }
  };

  const updateGenerationSettings = (updates: Partial<AIGenerationSettings>) => {
    setGenerationSettings((prev) => ({ ...prev, ...updates }));
  };

  const toggleQuestionType = (type: string) => {
    const currentTypes = generationSettings.questionTypes;
    if (currentTypes.includes(type as any)) {
      updateGenerationSettings({
        questionTypes: currentTypes.filter((t) => t !== type),
      });
    } else {
      updateGenerationSettings({
        questionTypes: [...currentTypes, type as any],
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span>AI Question Generator</span>
          </CardTitle>
          <CardDescription>
            Generate questions using AI based on your topic and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic or Subject *</Label>
              <Input
                id="topic"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="e.g., JavaScript, World War II, Photosynthesis"
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="questionCount">Number of Questions</Label>
                <Input
                  id="questionCount"
                  type="number"
                  min="1"
                  max="50"
                  value={generationSettings.questionCount}
                  onChange={(e) =>
                    updateGenerationSettings({
                      questionCount: parseInt(e.target.value) || 10,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={generationSettings.difficulty}
                  onValueChange={(value) =>
                    updateGenerationSettings({
                      difficulty: value as 'Easy' | 'Medium' | 'Hard',
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className={option.color}>{option.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Question Types</Label>
              <div className="flex flex-wrap gap-2">
                {questionTypeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      generationSettings.questionTypes.includes(
                        option.value as any
                      )
                        ? 'default'
                        : 'outline'
                    }
                    size="sm"
                    onClick={() => toggleQuestionType(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="focusAreas">Focus Areas (Optional)</Label>
              <Input
                id="focusAreas"
                value={generationSettings.focusAreas.join(', ')}
                onChange={(e) =>
                  updateGenerationSettings({
                    focusAreas: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter((s) => s),
                  })
                }
                placeholder="e.g., functions, loops, arrays"
              />
            </div>

            <Button
              onClick={handleGenerateQuestions}
              disabled={isGenerating || !customTopic.trim()}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Questions...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Questions
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Questions Preview */}
      {generatedQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Generated Questions ({generatedQuestions.length})</span>
              <Button onClick={handleUseGeneratedQuestions} size="sm">
                Use These Questions
              </Button>
            </CardTitle>
            <CardDescription>
              Review the AI-generated questions before adding them to your quiz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generatedQuestions.map((question, index) => (
                <div key={question.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {question.type.replace('-', ' ')}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {question.points} pts
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {question.difficulty}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">Q{index + 1}</span>
                  </div>
                  <p className="text-sm">{question.question}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Question Improvement Tools */}
      {existingQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Question Improvement Tools</span>
            </CardTitle>
            <CardDescription>
              Enhance your existing questions with AI assistance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Improve Questions</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Get AI suggestions to improve question quality and clarity
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleImproveQuestions}
                  disabled={isImproving}
                >
                  {isImproving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Improving...
                    </>
                  ) : (
                    'Improve'
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Add Explanations</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Generate explanations for correct answers
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleAddExplanations}
                  disabled={isAddingExplanations}
                >
                  {isAddingExplanations ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Explanations'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            💡 Tips for Better AI Generation
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Be specific with your topic for more relevant questions</li>
            <li>• Mix different question types for better assessment</li>
            <li>• Use focus areas to target specific concepts</li>
            <li>• Review and edit generated questions before using them</li>
            <li>• Consider the difficulty level for your students</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
