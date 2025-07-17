'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TeacherDashboard } from '@/components/teacher/teacher-dashboard';
import { Quiz } from '@/types/quiz';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { useAuth } from '@/hooks/useAuth';
import { types } from 'util';

// Mock data for demonstration
// const mockStats = {
//   totalStudents: 45,
//   activeQuizzes: 8,
//   averageCompletionRate: 78,
//   totalAssignments: 24,
// };

// const mockRecentQuizzes: Quiz[] = [
//   {
//     id: '1',
//     title: 'Advanced Calculus',
//     description: 'Complex mathematical concepts and applications',
//     teacherId: 'teacher1',
//     subject: 'Mathematics',
//     timeLimit: 60,
//     totalPoints: 200,
//     isPublished: true,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     questions: [],
//   },
//   {
//     id: '2',
//     title: 'Modern Physics',
//     description: 'Quantum mechanics and relativity',
//     teacherId: 'teacher1',
//     subject: 'Science',
//     timeLimit: 45,
//     totalPoints: 150,
//     isPublished: true,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     questions: [],
//   },
//   {
//     id: '3',
//     title: "Shakespeare's Works",
//     description: 'Analysis of classic literature',
//     teacherId: 'teacher1',
//     subject: 'Literature',
//     timeLimit: 40,
//     totalPoints: 120,
//     isPublished: false,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     questions: [],
//   },
// ];

// const mockClassPerformance = [
//   {
//     className: 'Advanced Mathematics',
//     studentCount: 15,
//     averageScore: 82,
//     completionRate: 85,
//   },
//   {
//     className: 'Physics 101',
//     studentCount: 20,
//     averageScore: 76,
//     completionRate: 72,
//   },
//   {
//     className: 'English Literature',
//     studentCount: 18,
//     averageScore: 88,
//     completionRate: 90,
//   },
// ];

// const mockPendingAssignments = [
//   {
//     id: '1',
//     quizTitle: 'Calculus Midterm',
//     assignedTo: 'Advanced Mathematics',
//     dueDate: '2024-01-15',
//     status: 'in-progress' as const,
//   },
//   {
//     id: '2',
//     quizTitle: 'Physics Lab Report',
//     assignedTo: 'Physics 101',
//     dueDate: '2024-01-20',
//     status: 'pending' as const,
//   },
//   {
//     id: '3',
//     quizTitle: 'Shakespeare Essay',
//     assignedTo: 'English Literature',
//     dueDate: '2024-01-18',
//     status: 'completed' as const,
//   },
// ];

export default function TeacherDashboardPage() {
  const { user, loading } = useAuth();
  if (loading || !user) return null;
  return (
    <DashboardLayout>
      <TeacherDashboard
        user={user}
        stats={{
          totalStudents: 0,
          activeQuizzes: 0,
          averageCompletionRate: 0,
          totalAssignments: 0,
        }}
        recentQuizzes={[]}
        classPerformance={[]}
        pendingAssignments={[]}
      />
    </DashboardLayout>
  );
}
