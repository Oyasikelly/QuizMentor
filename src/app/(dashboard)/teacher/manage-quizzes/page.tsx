'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Info, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { QuizCard } from '@/components/teacher/manage-quizzes/quiz-card';
import { QuizTable } from '@/components/teacher/manage-quizzes/quiz-table';
import { FilterBar } from '@/components/teacher/manage-quizzes/filter-bar';
import { QuizStats } from '@/components/teacher/manage-quizzes/quiz-stats';
import { Quiz } from '@/types/quiz';
import { useRouter } from 'next/navigation';
import PendingGradingPanel from '@/components/teacher/manage-quizzes/PendingGradingPanel';

// Mock user data for dashboard layout
const mockUser = {
  id: 'teacher1',
  name: 'Dr. Sarah Wilson',
  email: 'sarah.wilson@example.com',
  role: 'teacher' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Helper to generate subjectId from subject object
const subjectObj = (id: string, name: string) => ({ id, name });

// Mock quiz data
const mockQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'Advanced Calculus',
    description: 'Complex mathematical concepts and applications',
    teacherId: 'teacher1',
    subject: { id: 'math', name: 'Mathematics' },
    subjectId: 'math',
    timeLimit: 60,
    totalPoints: 200,
    isPublished: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    questions: [],
    attempts: 45,
    averageScore: 78,
    status: 'active',
  },
  {
    id: '2',
    title: 'Modern Physics',
    description: 'Quantum mechanics and relativity',
    teacherId: 'teacher1',
    subject: { id: 'science', name: 'Science' },
    subjectId: 'science',
    timeLimit: 45,
    totalPoints: 150,
    isPublished: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    questions: [],
    attempts: 32,
    averageScore: 82,
    status: 'active',
  },
  {
    id: '3',
    title: "Shakespeare's Works",
    description: 'Analysis of classic literature',
    teacherId: 'teacher1',
    subject: { id: 'literature', name: 'Literature' },
    subjectId: 'literature',
    timeLimit: 40,
    totalPoints: 120,
    isPublished: false,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12'),
    questions: [],
    attempts: 0,
    averageScore: 0,
    status: 'draft',
  },
  {
    id: '4',
    title: 'World History: Ancient Civilizations',
    description: 'Explore the rise and fall of ancient empires',
    teacherId: 'teacher1',
    subject: { id: 'history', name: 'History' },
    subjectId: 'history',
    timeLimit: 50,
    totalPoints: 180,
    isPublished: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    questions: [],
    attempts: 28,
    averageScore: 75,
    status: 'active',
  },
  {
    id: '5',
    title: 'Basic Chemistry',
    description: 'Fundamental chemical principles and reactions',
    teacherId: 'teacher1',
    subject: { id: 'science', name: 'Science' },
    subjectId: 'science',
    timeLimit: 35,
    totalPoints: 100,
    isPublished: false,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-14'),
    questions: [],
    attempts: 0,
    averageScore: 0,
    status: 'draft',
  },
];

type ViewMode = 'card' | 'table';
type QuizStatus = 'all' | 'active' | 'draft' | 'archived';

export default function ManageQuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>(mockQuizzes);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>(mockQuizzes);
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<QuizStatus>('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created');
  const [isLoading, setIsLoading] = useState(false);

  // For demo, use the first active quiz and mock teacher
  const activeQuiz = quizzes.find((q) => q.status === 'active');
  const teacherId = mockUser.id;

  // Calculate stats
  const stats = {
    totalQuizzes: quizzes.length,
    activeQuizzes: quizzes.filter((q) => q.status === 'active').length,
    draftQuizzes: quizzes.filter((q) => q.status === 'draft').length,
    totalAttempts: quizzes.reduce((sum, q) => sum + (q.attempts || 0), 0),
  };

  // Filter and sort quizzes
  useEffect(() => {
    let filtered = [...quizzes];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          quiz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (quiz.subject?.name || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((quiz) => quiz.status === statusFilter);
    }

    // Subject filter
    if (subjectFilter !== 'all') {
      filtered = filtered.filter(
        (quiz) => quiz.subject?.name === subjectFilter
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'created':
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case 'modified':
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        case 'attempts':
          return (b.attempts || 0) - (a.attempts || 0);
        default:
          return 0;
      }
    });

    setFilteredQuizzes(filtered);
  }, [quizzes, searchQuery, statusFilter, subjectFilter, sortBy]);

  const handleQuizAction = (quizId: string, action: string) => {
    switch (action) {
      case 'edit':
        router.push(`/teacher/edit-quiz/${quizId}`);
        break;
      case 'preview':
        // Navigate to preview page
        break;
      case 'duplicate':
        // Handle duplicate logic
        break;
      case 'archive':
        // Handle archive logic
        break;
      case 'delete':
        // Handle delete logic
        break;
    }
  };

  const subjects = Array.from(
    new Set(quizzes.map((q) => q.subject?.name).filter(Boolean))
  ) as string[];

  return (
    <DashboardLayout user={mockUser}>
      {/* Pending Grading Panel */}
      {activeQuiz && (
        <PendingGradingPanel quizId={activeQuiz.id} teacherId={teacherId} />
      )}
      <div className="space-y-6 px-2 sm:px-4 md:px-6 lg:px-8 py-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Manage Quizzes
            </h1>
            <p className="text-muted-foreground mt-2">
              Create, edit, and manage your quiz library
            </p>
          </div>
          <Button asChild className="flex items-center gap-2 w-full sm:w-auto">
            <Link href="/teacher/create-quiz">
              <Plus className="h-4 w-4" />
              Create New Quiz
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <QuizStats stats={stats} />

        {/* How to Use Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-blue-50 dark:bg-blue-900/10">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Info className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base">How to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm text-blue-900 dark:text-blue-200 space-y-1">
                <li>Use the search and filters to quickly find quizzes.</li>
                <li>
                  Switch between card and table view for your preferred layout.
                </li>
                <li>Click a quiz title to edit, preview, or manage it.</li>
                <li>
                  Use bulk actions in table view for efficient management.
                </li>
                <li>Track attempts and performance in the stats above.</li>
                <li>
                  All features are fully responsive for mobile and desktop.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Recent Activity Card */}
          <Card className="bg-green-50 dark:bg-green-900/10">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Activity className="h-5 w-5 text-green-600" />
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-green-900 dark:text-green-200 space-y-1">
                <li>Quiz "Advanced Calculus" was updated 2 days ago.</li>
                <li>"Modern Physics" received 5 new attempts this week.</li>
                <li>"Shakespeare's Works" saved as draft.</li>
                <li>"World History" published and assigned to Class A.</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Filter and Search Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          subjectFilter={subjectFilter}
          onSubjectFilterChange={setSubjectFilter}
          subjects={subjects}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Quiz Display */}
        {filteredQuizzes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="space-y-4">
                <div className="text-6xl">📚</div>
                <h3 className="text-xl font-semibold">
                  {searchQuery ||
                  statusFilter !== 'all' ||
                  subjectFilter !== 'all'
                    ? 'No quizzes found'
                    : 'No quizzes yet'}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery ||
                  statusFilter !== 'all' ||
                  subjectFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Create your first quiz to get started'}
                </p>
                {!searchQuery &&
                  statusFilter === 'all' &&
                  subjectFilter === 'all' && (
                    <Button asChild>
                      <Link href="/teacher/create-quiz">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Quiz
                      </Link>
                    </Button>
                  )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {viewMode === 'card' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredQuizzes.map((quiz) => (
                  <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    onAction={handleQuizAction}
                  />
                ))}
              </div>
            ) : (
              <QuizTable
                quizzes={filteredQuizzes}
                onAction={handleQuizAction}
              />
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
