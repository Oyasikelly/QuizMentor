// Application constants and configuration

export const APP_CONFIG = {
  name: 'QuizMentor',
  description: 'AI-powered quiz platform for students and teachers',
  version: '1.0.0',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

export const API_ENDPOINTS = {
  auth: {
    syncUser: '/api/auth/sync-user',
    getUser: (userId: string) => `/api/auth/user/${userId}`,
    verifyEmail: '/api/auth/verify-email',
  },
  quizzes: {
    list: '/api/quizzes',
    create: '/api/quizzes',
    get: (id: string) => `/api/quizzes/${id}`,
    update: (id: string) => `/api/quizzes/${id}`,
    delete: (id: string) => `/api/quizzes/${id}`,
    submit: (id: string) => `/api/quizzes/${id}/submit`,
  },
  questions: {
    list: '/api/questions',
    create: '/api/questions',
    get: (id: string) => `/api/questions/${id}`,
    update: (id: string) => `/api/questions/${id}`,
    delete: (id: string) => `/api/questions/${id}`,
  },
  analytics: {
    student: '/api/analytics/student',
    teacher: '/api/analytics/teacher',
    quiz: (id: string) => `/api/analytics/quiz/${id}`,
  },
  ai: {
    generateQuestions: '/api/ai/generate-questions',
    analyzeResults: '/api/ai/analyze-results',
    generateFeedback: '/api/ai/generate-feedback',
  },
} as const;

export const QUIZ_TYPES = {
  MULTIPLE_CHOICE: 'multiple-choice',
  TRUE_FALSE: 'true-false',
  SHORT_ANSWER: 'short-answer',
} as const;

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

export const SUBJECTS = [
  'Mathematics',
  'Science',
  'History',
  'Geography',
  'Literature',
  'Language',
  'Computer Science',
  'Art',
  'Music',
  'Physical Education',
  'Other',
] as const;

export const ACHIEVEMENTS = {
  FIRST_QUIZ: {
    id: 'first_quiz',
    name: 'First Steps',
    description: 'Complete your first quiz',
    icon: '🎯',
  },
  PERFECT_SCORE: {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Get 100% on any quiz',
    icon: '🏆',
  },
  STREAK_7: {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day study streak',
    icon: '🔥',
  },
  STREAK_30: {
    id: 'streak_30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day study streak',
    icon: '👑',
  },
  QUIZ_MASTER: {
    id: 'quiz_master',
    name: 'Quiz Master',
    description: 'Complete 50 quizzes',
    icon: '🎓',
  },
  SUBJECT_EXPERT: {
    id: 'subject_expert',
    name: 'Subject Expert',
    description: 'Complete 10 quizzes in one subject',
    icon: '📚',
  },
} as const;

export const THEME_COLORS = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  accent: 'hsl(var(--accent))',
  destructive: 'hsl(var(--destructive))',
  success: 'hsl(var(--success))',
  warning: 'hsl(var(--warning))',
  tertiary: 'hsl(var(--tertiary))',
} as const;

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;

export const PAGINATION = {
  defaultPageSize: 10,
  maxPageSize: 100,
} as const;

export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  QUIZ_NOT_FOUND: 'Quiz not found or no longer available.',
  QUIZ_ALREADY_COMPLETED: 'You have already completed this quiz.',
  QUIZ_TIME_EXPIRED: 'Time has expired for this quiz.',
} as const;

export const SUCCESS_MESSAGES = {
  QUIZ_CREATED: 'Quiz created successfully!',
  QUIZ_UPDATED: 'Quiz updated successfully!',
  QUIZ_DELETED: 'Quiz deleted successfully!',
  QUIZ_SUBMITTED: 'Quiz submitted successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!',
} as const;
