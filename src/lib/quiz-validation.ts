import { z } from 'zod';

// Quiz Settings Validation
export const QuizSettingsSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters'),
  subject: z.string().min(1, 'Subject is required'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()),
  estimatedDuration: z.number().positive('Duration must be positive'),

  // Timing Settings
  timeLimit: z.number().positive().nullable(),
  showTimer: z.boolean(),
  autoSubmit: z.boolean(),

  // Scoring Settings
  passingScore: z
    .number()
    .min(0, 'Passing score must be at least 0')
    .max(100, 'Passing score cannot exceed 100'),
  showScoreImmediately: z.boolean(),
  allowRetakes: z.boolean(),
  maxAttempts: z.number().positive('Max attempts must be positive'),

  // Access Settings
  startDate: z.date(),
  endDate: z.date().refine((date: Date) => date > new Date(), {
    message: 'End date must be in the future',
  }),
  assignToClasses: z.array(z.string()),
  assignToStudents: z.array(z.string()),
  requirePassword: z.boolean(),
  password: z.string().optional(),

  // Display Settings
  questionsPerPage: z.number().positive('Questions per page must be positive'),
  randomizeQuestions: z.boolean(),
  randomizeAnswers: z.boolean(),
  showQuestionNumbers: z.boolean(),
});

// Question Validation
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
  points: z.number().positive('Points must be positive'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  tags: z.array(z.string()),
  category: z.string(),
  mediaUrl: z.string().optional(),
  order: z.number(),
});

// Multiple Choice Question Validation
export const MultipleChoiceQuestionSchema = QuestionSchema.extend({
  type: z.literal('multiple-choice'),
  options: z
    .array(z.string())
    .min(2, 'At least 2 options required')
    .max(6, 'Maximum 6 options allowed'),
  correctAnswer: z.union([z.string(), z.array(z.string())]).refine(
    (answer: string | string[]) => {
      if (typeof answer === 'string') return answer.length > 0;
      return answer.length > 0;
    },
    { message: 'Correct answer is required' }
  ),
});

// True/False Question Validation
export const TrueFalseQuestionSchema = QuestionSchema.extend({
  type: z.literal('true-false'),
  correctAnswer: z.enum(['true', 'false']),
});

// Short Answer Question Validation
export const ShortAnswerQuestionSchema = QuestionSchema.extend({
  type: z.literal('short-answer'),
  correctAnswer: z.string().min(1, 'Correct answer is required'),
});

// Essay Question Validation
export const EssayQuestionSchema = QuestionSchema.extend({
  type: z.literal('essay'),
  correctAnswer: z.string().optional(),
});

// Fill in the Blank Question Validation
export const FillBlankQuestionSchema = QuestionSchema.extend({
  type: z.literal('fill-blank'),
  correctAnswer: z.string().min(1, 'Correct answer is required'),
});

// AI Generation Settings Validation
export const AIGenerationSettingsSchema = z.object({
  questionCount: z
    .number()
    .min(1, 'At least 1 question required')
    .max(50, 'Maximum 50 questions allowed'),
  questionTypes: z
    .array(
      z.enum([
        'multiple-choice',
        'true-false',
        'short-answer',
        'essay',
        'fill-blank',
      ])
    )
    .min(1, 'At least one question type must be selected'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  topics: z.array(z.string()),
  focusAreas: z.array(z.string()),
});

// Document Upload Validation
export const DocumentUploadSchema = z.object({
  files: z.array(z.instanceof(File)).min(1, 'At least one file is required'),
  maxFileSize: z.number().default(10 * 1024 * 1024), // 10MB
  allowedTypes: z.array(z.string()).default(['.pdf', '.docx', '.txt', '.md']),
});

// Quiz Creation Method Validation
export const QuizCreationMethodSchema = z.object({
  id: z.enum(['from-document', 'from-scratch', 'from-template']),
  title: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  estimatedTime: z.string(),
});

// Validation Functions
export const validateQuizSettings = (data: unknown) => {
  return QuizSettingsSchema.safeParse(data);
};

export const validateQuestion = (data: unknown) => {
  return QuestionSchema.safeParse(data);
};

export const validateMultipleChoiceQuestion = (data: unknown) => {
  return MultipleChoiceQuestionSchema.safeParse(data);
};

export const validateTrueFalseQuestion = (data: unknown) => {
  return TrueFalseQuestionSchema.safeParse(data);
};

export const validateShortAnswerQuestion = (data: unknown) => {
  return ShortAnswerQuestionSchema.safeParse(data);
};

export const validateEssayQuestion = (data: unknown) => {
  return EssayQuestionSchema.safeParse(data);
};

export const validateFillBlankQuestion = (data: unknown) => {
  return FillBlankQuestionSchema.safeParse(data);
};

export const validateAIGenerationSettings = (data: unknown) => {
  return AIGenerationSettingsSchema.safeParse(data);
};

export const validateDocumentUpload = (data: unknown) => {
  return DocumentUploadSchema.safeParse(data);
};

// Error Message Helpers
export const getValidationErrorMessage = (error: z.ZodError) => {
  return error.issues
    .map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`)
    .join(', ');
};

export const formatFieldError = (field: string, message: string) => {
  return `${field}: ${message}`;
};
