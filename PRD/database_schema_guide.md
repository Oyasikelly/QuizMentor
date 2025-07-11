# QuizMentor Database Schema Guide

## 1. Prisma Schema Setup

### Create `prisma/schema.prisma`
```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User Management
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String?
  name      String?
  role      UserRole @default(STUDENT)
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Student specific fields
  studentId String?
  grade     String?
  school    String?

  // Teacher specific fields
  teacherId  String?
  department String?
  subjects   String[]

  // Relationships
  quizzes        Quiz[]
  quizAttempts   QuizAttempt[]
  aiInteractions AIInteraction[]
  studyPlans     StudyPlan[]

  @@map("users")
}

enum UserRole {
  STUDENT
  TEACHER
  ADMIN
}

// Quiz Management
model Quiz {
  id          String     @id @default(cuid())
  title       String
  description String?
  subject     String
  topic       String?
  difficulty  Difficulty @default(MEDIUM)
  timeLimit   Int? // in minutes
  maxAttempts Int        @default(3)
  isActive    Boolean    @default(true)
  isPublic    Boolean    @default(false)
  
  // Quiz settings
  shuffleQuestions Boolean @default(false)
  shuffleAnswers   Boolean @default(false)
  showResultsImmediately Boolean @default(true)
  allowReview     Boolean @default(true)
  
  // Metadata
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relationships
  createdBy   User   @relation(fields: [createdById], references: [id])
  createdById String
  
  questions    QuizQuestion[]
  attempts     QuizAttempt[]
  categories   QuizCategory[]
  aiGenerated  Boolean        @default(false)
  
  @@map("quizzes")
}

enum Difficulty {
  EASY
  MEDIUM
  HARD
}

// Question Management
model Question {
  id          String       @id @default(cuid())
  content     String
  type        QuestionType @default(MULTIPLE_CHOICE)
  difficulty  Difficulty   @default(MEDIUM)
  explanation String?
  subject     String
  topic       String?
  
  // Question metadata
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relationships
  createdBy   User   @relation(fields: [createdById], references: [id])
  createdById String
  
  options      QuestionOption[]
  quizQuestions QuizQuestion[]
  answers      Answer[]
  aiGenerated  Boolean          @default(false)
  
  @@map("questions")
}

enum QuestionType {
  MULTIPLE_CHOICE
  TRUE_FALSE
  SHORT_ANSWER
  ESSAY
  FILL_IN_BLANK
}

model QuestionOption {
  id         String  @id @default(cuid())
  content    String
  isCorrect  Boolean @default(false)
  order      Int     @default(0)
  
  // Relationships
  question   Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
  questionId String
  
  @@map("question_options")
}

// Quiz-Question Junction Table
model QuizQuestion {
  id       String @id @default(cuid())
  order    Int    @default(0)
  points   Int    @default(1)
  
  // Relationships
  quiz       Quiz     @relation(fields: [quizId], references: [id], onDelete: Cascade)
  quizId     String
  question   Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
  questionId String
  
  @@unique([quizId, questionId])
  @@map("quiz_questions")
}

// Quiz Attempts and Answers
model QuizAttempt {
  id          String        @id @default(cuid())
  score       Float?
  maxScore    Float?
  percentage  Float?
  timeSpent   Int? // in seconds
  status      AttemptStatus @default(IN_PROGRESS)
  startedAt   DateTime      @default(now())
  completedAt DateTime?
  
  // Relationships
  user   User   @relation(fields: [userId], references: [id])
  userId String
  quiz   Quiz   @relation(fields: [quizId], references: [id])
  quizId String
  
  answers Answer[]
  
  @@map("quiz_attempts")
}

enum AttemptStatus {
  IN_PROGRESS
  COMPLETED
  ABANDONED
  EXPIRED
}

model Answer {
  id           String  @id @default(cuid())
  content      String?
  isCorrect    Boolean @default(false)
  pointsEarned Float   @default(0)
  timeSpent    Int? // in seconds
  
  // Relationships
  attempt    QuizAttempt @relation(fields: [attemptId], references: [id], onDelete: Cascade)
  attemptId  String
  question   Question    @relation(fields: [questionId], references: [id])
  questionId String
  
  // For multiple choice questions
  selectedOptions String[] // Array of option IDs
  
  createdAt DateTime @default(now())
  
  @@map("answers")
}

// Categories and Organization
model QuizCategory {
  id          String @id @default(cuid())
  name        String
  description String?
  color       String?
  
  // Relationships
  quizzes Quiz[]
  
  @@map("quiz_categories")
}

// Mock Exam Support
model MockExam {
  id          String     @id @default(cuid())
  name        String
  examType    ExamType
  duration    Int // in minutes
  totalMarks  Int
  passingMarks Int
  instructions String?
  
  // Relationships
  subjects MockExamSubject[]
  attempts MockExamAttempt[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("mock_exams")
}

enum ExamType {
  JAMB
  WAEC
  NECO
  CUSTOM
}

model MockExamSubject {
  id           String @id @default(cuid())
  subjectName  String
  questionCount Int
  marksPerQuestion Int
  
  // Relationships
  mockExam   MockExam @relation(fields: [mockExamId], references: [id], onDelete: Cascade)
  mockExamId String
  
  @@map("mock_exam_subjects")
}

model MockExamAttempt {
  id          String    @id @default(cuid())
  score       Float?
  percentage  Float?
  timeSpent   Int? // in seconds
  status      AttemptStatus @default(IN_PROGRESS)
  startedAt   DateTime  @default(now())
  completedAt DateTime?
  
  // Subject-wise scores
  subjectScores Json? // { "Mathematics": 85, "English": 92, ... }
  
  // Relationships
  user       User     @relation(fields: [userId], references: [id])
  userId     String
  mockExam   MockExam @relation(fields: [mockExamId], references: [id])
  mockExamId String
  
  @@map("mock_exam_attempts")
}

// AI Integration
model AIInteraction {
  id          String        @id @default(cuid())
  type        AIRequestType
  input       String
  output      String
  tokens      Int?
  cost        Float?
  model       String        @default("gpt-4")
  success     Boolean       @default(true)
  
  // Relationships
  user   User   @relation(fields: [userId], references: [id])
  userId String
  
  createdAt DateTime @default(now())
  
  @@map("ai_interactions")
}

enum AIRequestType {
  QUESTION_GENERATION
  ANSWER_EXPLANATION
  STUDY_RECOMMENDATION
  QUIZ_ANALYSIS
  CONTENT_EXTRACTION
}

// Study Plans and Recommendations
model StudyPlan {
  id          String @id @default(cuid())
  title       String
  description String?
  subject     String
  topics      String[]
  difficulty  Difficulty @default(MEDIUM)
  duration    Int // estimated days
  
  // Plan content
  recommendations StudyRecommendation[]
  
  // Relationships
  user   User   @relation(fields: [userId], references: [id])
  userId String
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("study_plans")
}

model StudyRecommendation {
  id          String @id @default(cuid())
  title       String
  description String
  type        RecommendationType
  priority    Int    @default(1)
  completed   Boolean @default(false)
  
  // Content
  content     String?
  resources   String[] // URLs or references
  
  // Relationships
  studyPlan   StudyPlan @relation(fields: [studyPlanId], references: [id], onDelete: Cascade)
  studyPlanId String
  
  createdAt DateTime @default(now())
  
  @@map("study_recommendations")
}

enum RecommendationType {
  PRACTICE_QUIZ
  REVIEW_TOPIC
  STUDY_MATERIAL
  WEAKNESS_FOCUS
  STRENGTH_BUILDING
}

// Analytics and Reporting
model Analytics {
  id        String      @id @default(cuid())
  type      AnalyticsType
  data      Json
  period    String // daily, weekly, monthly
  date      DateTime
  
  // Optional user context
  userId String?
  
  createdAt DateTime @default(now())
  
  @@map("analytics")
}

enum AnalyticsType {
  USER_ENGAGEMENT
  QUIZ_PERFORMANCE
  QUESTION_DIFFICULTY
  SUBJECT_ANALYTICS
  AI_USAGE
}
```

## 2. Database Migration Commands

### Initialize Prisma
```bash
npx prisma init
npx prisma generate
npx prisma db push
```

### Create and Apply Migrations
```bash
# Create migration
npx prisma migrate dev --name init

# Apply migration to production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

## 3. Database Seeding

### Create `prisma/seed.ts`
```typescript
import { PrismaClient, UserRole, Difficulty, QuestionType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create demo users
  const hashedPassword = await bcrypt.hash('demo123', 10);
  
  // Create teacher
  const teacher = await prisma.user.create({
    data: {
      email: 'teacher@fupre.edu.ng',
      password: hashedPassword,
      name: 'Dr. Amina Hassan',
      role: UserRole.TEACHER,
      teacherId: 'FUPRE001',
      department: 'Computer Science',
      subjects: ['Computer Science', 'Mathematics', 'Physics'],
    },
  });

  // Create student
  const student = await prisma.user.create({
    data: {
      email: 'student@fupre.edu.ng',
      password: hashedPassword,
      name: 'Chidi Okoro',
      role: UserRole.STUDENT,
      studentId: 'FUPRE/CSC/2021/001',
      grade: '300 Level',
      school: 'FUPRE',
    },
  });

  // Create sample questions
  const questions = await Promise.all([
    prisma.question.create({
      data: {
        content: 'What is the time complexity of binary search?',
        type: QuestionType.MULTIPLE_CHOICE,
        difficulty: Difficulty.MEDIUM,
        subject: 'Computer Science',
        topic: 'Algorithms',
        explanation: 'Binary search has O(log n) time complexity because it eliminates half of the search space in each iteration.',
        createdById: teacher.id,
        options: {
          create: [
            { content: 'O(n)', isCorrect: false, order: 1 },
            { content: 'O(log n)', isCorrect: true, order: 2 },
            { content: 'O(n²)', isCorrect: false, order: 3 },
            { content: 'O(1)', isCorrect: false, order: 4 },
          ],
        },
      },
    }),
    prisma.question.create({
      data: {
        content: 'Which data structure uses LIFO principle?',
        type: QuestionType.MULTIPLE_CHOICE,
        difficulty: Difficulty.EASY,
        subject: 'Computer Science',
        topic: 'Data Structures',
        explanation: 'Stack follows Last In First Out (LIFO) principle where the last element added is the first one to be removed.',
        createdById: teacher.id,
        options: {
          create: [
            { content: 'Queue', isCorrect: false, order: 1 },
            { content: 'Stack', isCorrect: true, order: 2 },
            { content: 'Array', isCorrect: false, order: 3 },
            { content: 'Tree', isCorrect: false, order: 4 },
          ],
        },
      },
    }),
  ]);

  // Create sample quiz
  const quiz = await prisma.quiz.create({
    data: {
      title: 'Data Structures and Algorithms Quiz',
      description: 'Test your knowledge of basic DSA concepts',
      subject: 'Computer Science',
      topic: 'Data Structures',
      difficulty: Difficulty.MEDIUM,
      timeLimit: 30,
      maxAttempts: 3,
      createdById: teacher.id,
      questions: {
        create: questions.map((question, index) => ({
          questionId: question.id,
          order: index + 1,
          points: 10,
        })),
      },
    },
  });

  // Create categories
  await prisma.quizCategory.create({
    data: {
      name: 'Computer Science',
      description: 'Programming and computer science topics',
      color: '#3B82F6',
    },
  });

  await prisma.quizCategory.create({
    data: {
      name: 'Mathematics',
      description: 'Mathematical concepts and problem solving',
      color: '#10B981',
    },
  });

  // Create mock exam
  await prisma.mockExam.create({
    data: {
      name: 'JAMB Computer Science Mock',
      examType: 'JAMB',
      duration: 120,
      totalMarks: 400,
      passingMarks: 200,
      instructions: 'This is a mock JAMB examination for Computer Science students.',
      subjects: {
        create: [
          { subjectName: 'Mathematics', questionCount: 40, marksPerQuestion: 4 },
          { subjectName: 'English', questionCount: 40, marksPerQuestion: 4 },
          { subjectName: 'Physics', questionCount: 40, marksPerQuestion: 4 },
          { subjectName: 'Computer Science', questionCount: 40, marksPerQuestion: 4 },
        ],
      },
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## 4. Database Utilities

### Create `src/lib/db.ts`
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Database helper functions
export const db = {
  // User operations
  user: {
    findByEmail: (email: string) => 
      prisma.user.findUnique({ where: { email } }),
    
    findById: (id: string) => 
      prisma.user.findUnique({ where: { id } }),
    
    create: (data: any) => 
      prisma.user.create({ data }),
    
    update: (id: string, data: any) => 
      prisma.user.update({ where: { id }, data }),
  },

  // Quiz operations
  quiz: {
    findMany: (filters?: any) => 
      prisma.quiz.findMany({
        where: filters,
        include: {
          createdBy: { select: { name: true, email: true } },
          questions: {
            include: {
              question: {
                include: { options: true }
              }
            }
          },
          _count: { select: { attempts: true } }
        }
      }),
    
    findById: (id: string) => 
      prisma.quiz.findUnique({
        where: { id },
        include: {
          createdBy: { select: { name: true, email: true } },
          questions: {
            include: {
              question: {
                include: { options: true }
              }
            },
            orderBy: { order: 'asc' }
          }
        }
      }),
    
    create: (data: any) => 
      prisma.quiz.create({ data }),
    
    update: (id: string, data: any) => 
      prisma.quiz.update({ where: { id }, data }),
    
    delete: (id: string) => 
      prisma.quiz.delete({ where: { id } }),
  },

  // Question operations
  question: {
    findMany: (filters?: any) => 
      prisma.question.findMany({
        where: filters,
        include: {
          options: true,
          createdBy: { select: { name: true } }
        }
      }),
    
    create: (data: any) => 
      prisma.question.create({
        data,
        include: { options: true }
      }),
    
    update: (id: string, data: any) => 
      prisma.question.update({
        where: { id },
        data,
        include: { options: true }
      }),
  },

  // Quiz attempt operations
  quizAttempt: {
    create: (data: any) => 
      prisma.quizAttempt.create({ data }),
    
    update: (id: string, data: any) => 
      prisma.quizAttempt.update({ where: { id }, data }),
    
    findByUser: (userId: string) => 
      prisma.quizAttempt.findMany({
        where: { userId },
        include: {
          quiz: { select: { title: true, subject: true } }