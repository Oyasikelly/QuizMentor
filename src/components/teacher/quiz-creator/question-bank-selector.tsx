'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Question } from '@/types/quiz-creation';
import {
  getQuestionTypeDisplayName,
  getQuestionTypeIcon,
  getDifficultyColor,
} from '@/lib/question-templates';

interface QuestionBankSelectorProps {
  onQuestionsSelected: (questions: Question[]) => void;
  existingQuestions?: Question[];
}

// Mock question bank data - in a real app, this would come from an API
const MOCK_QUESTION_BANK: Question[] = [
  {
    id: 'bank-1',
    type: 'multiple-choice',
    question: 'What is the capital of France?',
    options: ['London', 'Paris', 'Berlin', 'Madrid'],
    correctAnswer: 'Paris',
    explanation: 'Paris is the capital and largest city of France.',
    points: 5,
    difficulty: 'Easy',
    tags: ['Geography', 'Europe'],
    category: 'Geography',
    order: 0,
  },
  {
    id: 'bank-2',
    type: 'true-false',
    question: 'The Earth is round.',
    correctAnswer: 'true',
    explanation: 'The Earth is approximately spherical in shape.',
    points: 3,
    difficulty: 'Easy',
    tags: ['Science', 'Earth'],
    category: 'Science',
    order: 0,
  },
  {
    id: 'bank-3',
    type: 'short-answer',
    question: 'What is the chemical symbol for gold?',
    correctAnswer: 'Au',
    explanation: 'Au comes from the Latin word for gold, "aurum".',
    points: 5,
    difficulty: 'Medium',
    tags: ['Chemistry', 'Elements'],
    category: 'Chemistry',
    order: 0,
  },
  {
    id: 'bank-4',
    type: 'essay',
    question:
      'Explain the process of photosynthesis and its importance to life on Earth.',
    correctAnswer: '',
    explanation:
      'Look for understanding of light energy conversion, carbon dioxide absorption, oxygen production, and ecological significance.',
    points: 10,
    difficulty: 'Hard',
    tags: ['Biology', 'Photosynthesis'],
    category: 'Biology',
    order: 0,
  },
  {
    id: 'bank-5',
    type: 'fill-blank',
    question: 'The capital of Japan is _____.',
    correctAnswer: 'Tokyo',
    explanation: 'Tokyo is the capital and largest city of Japan.',
    points: 3,
    difficulty: 'Easy',
    tags: ['Geography', 'Asia'],
    category: 'Geography',
    order: 0,
  },
];

export default function QuestionBankSelector({
  onQuestionsSelected,
  existingQuestions = [],
}: QuestionBankSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(
    new Set()
  );
  const [filteredQuestions, setFilteredQuestions] =
    useState<Question[]>(MOCK_QUESTION_BANK);

  const categories = Array.from(
    new Set(MOCK_QUESTION_BANK.map((q) => q.category))
  );
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const questionTypes = Array.from(
    new Set(MOCK_QUESTION_BANK.map((q) => q.type))
  );

  useEffect(() => {
    let filtered = MOCK_QUESTION_BANK;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((q) => q.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter((q) => q.difficulty === selectedDifficulty);
    }

    // Filter by question type
    if (selectedType !== 'all') {
      filtered = filtered.filter((q) => q.type === selectedType);
    }

    setFilteredQuestions(filtered);
  }, [searchTerm, selectedCategory, selectedDifficulty, selectedType]);

  const handleQuestionToggle = (questionId: string) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(questionId)) {
      newSelected.delete(questionId);
    } else {
      newSelected.add(questionId);
    }
    setSelectedQuestions(newSelected);
  };

  const handleSelectAll = () => {
    const allIds = new Set(filteredQuestions.map((q) => q.id));
    setSelectedQuestions(allIds);
  };

  const handleClearSelection = () => {
    setSelectedQuestions(new Set());
  };

  const handleAddSelected = () => {
    const selectedQuestionsList = MOCK_QUESTION_BANK.filter((q) =>
      selectedQuestions.has(q.id)
    );
    onQuestionsSelected([...existingQuestions, ...selectedQuestionsList]);
    setSelectedQuestions(new Set());
  };

  const getQuestionPreview = (question: Question) => {
    const text = question.question;
    return text.length > 100 ? text.substring(0, 100) + '...' : text;
  };

  const getQuestionOptions = (question: Question) => {
    if (question.type === 'multiple-choice' && question.options) {
      return question.options.map((option, index) => (
        <div key={index} className="text-xs text-gray-600 dark:text-gray-300">
          {String.fromCharCode(65 + index)}) {option}
        </div>
      ));
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Question Bank</CardTitle>
          <CardDescription>
            Browse and select questions from the question bank to add to your
            quiz
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty</label>
              <Select
                value={selectedDifficulty}
                onValueChange={setSelectedDifficulty}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Question Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {questionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {getQuestionTypeDisplayName(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Selection Actions */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearSelection}
              >
                Clear Selection
              </Button>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {selectedQuestions.size} selected
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredQuestions.map((question) => (
              <div
                key={question.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedQuestions.has(question.id)
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
                onClick={() => handleQuestionToggle(question.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex items-center space-x-2 mt-1">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.has(question.id)}
                      onChange={() => handleQuestionToggle(question.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {getQuestionTypeIcon(question.type)}
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
                      <Badge variant="outline" className="text-xs">
                        {question.category}
                      </Badge>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {question.points} pts
                      </span>
                    </div>

                    <p className="text-sm text-gray-900 dark:text-white mb-2">
                      {getQuestionPreview(question)}
                    </p>

                    {getQuestionOptions(question)}

                    {question.tags && question.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {question.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
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
              </div>
            ))}
          </div>

          {filteredQuestions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No questions found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {selectedQuestions.size > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {selectedQuestions.size} question
                  {selectedQuestions.size !== 1 ? 's' : ''} selected
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Total points:{' '}
                  {MOCK_QUESTION_BANK.filter((q) =>
                    selectedQuestions.has(q.id)
                  ).reduce((sum, q) => sum + q.points, 0)}
                </p>
              </div>
              <Button onClick={handleAddSelected}>
                <Plus className="w-4 h-4 mr-2" />
                Add to Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="bg-green-50 dark:bg-green-900/20">
        <CardContent className="p-4">
          <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
            💡 Question Bank Tips
          </h4>
          <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
            <li>• Use filters to find questions that match your needs</li>
            <li>• Check the difficulty level before adding questions</li>
            <li>• Review question content and answers before using</li>
            <li>• Consider mixing question types for better assessment</li>
            <li>• You can edit questions after adding them to your quiz</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
