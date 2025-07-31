'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { useAuth } from '@/hooks/useAuth';
import { FullPageSpinner } from '@/components/shared/loading-spinner';

// TODO: Replace with real API data
const mockStudents = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@email.com',
    status: 'Active',
    quizzes: 12,
    avgScore: 87,
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@email.com',
    status: 'Inactive',
    quizzes: 8,
    avgScore: 74,
  },
  {
    id: '3',
    name: 'Charlie Lee',
    email: 'charlie@email.com',
    status: 'Active',
    quizzes: 15,
    avgScore: 92,
  },
];

export default function StudentsPage() {
  const { user, loading } = useAuth();

  // Handle server-side rendering
  if (typeof window === 'undefined') {
    return <div>Loading...</div>;
  }

  if (loading) return <FullPageSpinner text="Loading your dashboard..." />;
  if (!user) return null;
  // TODO: Add search/filter state and logic
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">Students</h1>
          <Input placeholder="Search students..." className="max-w-xs" />
        </div>
        <Card className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold">
                  Quizzes
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold">
                  Avg. Score
                </th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {mockStudents.map((student) => (
                <tr key={student.id} className="hover:bg-muted transition">
                  <td className="px-4 py-2 font-medium">{student.name}</td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {student.email}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        student.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">{student.quizzes}</td>
                  <td className="px-4 py-2 text-center">{student.avgScore}%</td>
                  <td className="px-4 py-2 text-right">
                    <Link href={`/teacher/student/${student.id}`}>
                      <Button size="sm" variant="outline">
                        View Profile
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
