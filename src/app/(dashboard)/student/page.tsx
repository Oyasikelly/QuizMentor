'use client';

import React from 'react';
import { StudentDashboard } from '@/components/student/student-dashboard';
import { Quiz } from '@/types/quiz';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

// Mock data for demonstration
const mockStats = {
  quizzesTaken: 24,
  averageScore: 85,
  studyStreak: 7,
  totalPoints: 1250,
};

const mockAvailableQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'Introduction to Algebra',
    description: 'Basic algebraic concepts and equations',
    teacherId: 'teacher1',
    subject: 'Mathematics',
    timeLimit: 30,
    totalPoints: 100,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [],
  },
  {
    id: '2',
    title: 'World History: Ancient Civilizations',
    description: 'Explore the rise and fall of ancient empires',
    teacherId: 'teacher2',
    subject: 'History',
    timeLimit: 45,
    totalPoints: 150,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [],
  },
  {
    id: '3',
    title: 'Basic Chemistry',
    description: 'Fundamental chemical principles and reactions',
    teacherId: 'teacher3',
    subject: 'Science',
    timeLimit: 40,
    totalPoints: 120,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [],
  },
];

const mockRecentQuizzes: Quiz[] = [
  {
    id: '4',
    title: 'Geometry Basics',
    description: 'Understanding shapes and measurements',
    teacherId: 'teacher1',
    subject: 'Mathematics',
    timeLimit: 25,
    totalPoints: 80,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [],
  },
  {
    id: '5',
    title: 'English Literature',
    description: 'Classic novels and poetry analysis',
    teacherId: 'teacher4',
    subject: 'Literature',
    timeLimit: 35,
    totalPoints: 100,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [],
  },
];

const mockAchievements = [
  {
    id: 'first_quiz',
    name: 'First Steps',
    description: 'Complete your first quiz',
    icon: '🎯',
    unlocked: true,
  },
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Get 100% on any quiz',
    icon: '🏆',
    unlocked: true,
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day study streak',
    icon: '🔥',
    unlocked: true,
  },
  {
    id: 'quiz_master',
    name: 'Quiz Master',
    description: 'Complete 50 quizzes',
    icon: '🎓',
    unlocked: false,
  },
];

const mockUser = {
  id: 'student1',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  role: 'student' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function StudentDashboardPage() {
  return (
    <DashboardLayout user={mockUser}>
      <StudentDashboard
        user={mockUser}
        stats={mockStats}
        recentQuizzes={mockRecentQuizzes}
        availableQuizzes={mockAvailableQuizzes}
        achievements={mockAchievements}
      />
    </DashboardLayout>
  );
}
