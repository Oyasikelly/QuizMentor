import { z } from 'zod';

// Quiz Creation Method
export interface QuizCreationMethod {
  id: 'from-document' | 'from-scratch' | 'from-template';
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  estimatedTime: string;
}

// Question Types
export type QuestionType =
  | 'multiple-choice'
  | 'true-false'
  | 'short-answer'
  | 'essay'
  | 'fill-blank';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  category: string;
  mediaUrl?: string;
  order: number;
}

// Quiz Settings
export interface QuizSettings {
  // Basic Information
  title: string;
  description: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  tags: string[];
  estimatedDuration: number;

  // Timing Settings
  timeLimit: number | null;
  showTimer: boolean;
  autoSubmit: boolean;

  // Scoring Settings
  passingScore: number;
  showScoreImmediately: boolean;
  allowRetakes: boolean;
  maxAttempts: number;

  // Access Settings
  startDate: Date;
  endDate: Date;
  assignToClasses: string[];
  assignToStudents: string[];
  requirePassword: boolean;
  password?: string;

  // Display Settings
  questionsPerPage: number;
  randomizeQuestions: boolean;
  randomizeAnswers: boolean;
  showQuestionNumbers: boolean;
}

// Document Upload State
export interface DocumentUploadState {
  files: File[];
  uploadProgress: number;
  processingStatus: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  extractedContent: string;
  generatedQuestions: Question[];
  aiSuggestions: {
    questionCount: number;
    questionTypes: QuestionType[];
    difficulty: string;
    topics: string[];
  };
}

// Quiz Creation Wizard State
export interface QuizCreationWizardState {
  currentStep: number;
  method: QuizCreationMethod | null;
  settings: Partial<QuizSettings>;
  questions: Question[];
  isDirty: boolean;
  isSaving: boolean;
  error: string | null;
}

// AI Generation Settings
export interface AIGenerationSettings {
  questionCount: number;
  questionTypes: QuestionType[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  focusAreas: string[];
}

// Quiz Preview
export interface QuizPreview {
  quiz: QuizSettings;
  questions: Question[];
  estimatedDuration: number;
  totalPoints: number;
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
}

// Validation Schemas
export const QuizSettingsSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000),
  subject: z.string().min(1, 'Subject is required'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()),
  estimatedDuration: z.number().positive(),

  // Timing
  timeLimit: z.number().positive().nullable(),
  showTimer: z.boolean(),
  autoSubmit: z.boolean(),

  // Scoring
  passingScore: z.number().min(0).max(100),
  showScoreImmediately: z.boolean(),
  allowRetakes: z.boolean(),
  maxAttempts: z.number().positive(),

  // Access
  startDate: z.date(),
  endDate: z.date(),
  assignToClasses: z.array(z.string()),
  assignToStudents: z.array(z.string()),
  requirePassword: z.boolean(),
  password: z.string().optional(),

  // Display
  questionsPerPage: z.number().positive(),
  randomizeQuestions: z.boolean(),
  randomizeAnswers: z.boolean(),
  showQuestionNumbers: z.boolean(),
});

export const QuestionSchema = z.object({
  id: z.string(),
  type: z.enum([
    'multiple-choice',
    'true-false',
    'short-answer',
    'essay',
    'fill-blank',
  ]),
  question: z.string().min(1, 'Question is required'),
  options: z.array(z.string()).optional(),
  correctAnswer: z.union([z.string(), z.array(z.string())]),
  explanation: z.string().optional(),
  points: z.number().positive(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  tags: z.array(z.string()),
  category: z.string(),
  mediaUrl: z.string().optional(),
  order: z.number(),
});

export const QuizCreationMethodSchema = z.object({
  id: z.enum(['from-document', 'from-scratch', 'from-template']),
  title: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  estimatedTime: z.string(),
});

export const AIGenerationSettingsSchema = z.object({
  questionCount: z.number().min(1).max(50),
  questionTypes: z.array(
    z.enum([
      'multiple-choice',
      'true-false',
      'short-answer',
      'essay',
      'fill-blank',
    ])
  ),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  topics: z.array(z.string()),
  focusAreas: z.array(z.string()),
});

// Wizard Steps
export interface WizardStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
  isDisabled: boolean;
}

export const WIZARD_STEPS: WizardStep[] = [
  {
    id: 1,
    title: 'Method',
    description: 'Choose how to create your quiz',
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
