export interface Question {
  id: string;
  quizId: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Quiz {
  id: string;
  title: string;
  name: string;
  description: string;
  teacherId: string;
  subjectId: string; // The id of the subject for this quiz
  timeLimit?: number; // in minutes
  totalPoints: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  questions: Question[];
  // Additional properties for quiz management
  attempts?: number;
  averageScore?: number;
  status?: 'active' | 'draft' | 'archived';
  // Populated from backend for display
  subject?: { id: string; name: string };
  teacher?: { id: string; name: string };
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  score: number;
  totalPoints: number;
  timeSpent: number; // in seconds
  completedAt: Date;
  createdAt: Date;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  pointsEarned: number;
}

export interface CreateQuizRequest {
  title: string;
  description: string;
  subjectId: string; // The id of the subject for this quiz
  timeLimit?: number;
  questions: Omit<Question, 'id' | 'quizId' | 'createdAt' | 'updatedAt'>[];
}

export interface SubmitQuizRequest {
  quizId: string;
  answers: {
    questionId: string;
    answer: string | string[];
  }[];
}
