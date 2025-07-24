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
import { useAuth } from '@/hooks/useAuth';
import QuizPreview from '@/components/teacher/quiz-creator/quiz-preview';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
    name: '',
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
    name: '',
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
    name: '',
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
    name: '',
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
    name: '',
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
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<QuizStatus>('all');
  const [subjectFilter, setSubjectFilter] = useState<string[]>(['all']);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortBy, setSortBy] = useState('created');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewQuizId, setPreviewQuizId] = useState<string | null>(null);
  const [previewQuiz, setPreviewQuiz] = useState<Quiz | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Fetch quizzes from API
  useEffect(() => {
    async function fetchQuizzes() {
      if (!user?.id) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/quizzes?teacherId=${user.id}`);
        if (!res.ok) throw new Error('Failed to fetch quizzes');
        const data = await res.json();
        setQuizzes(data.quizzes || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch quizzes');
        setQuizzes([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchQuizzes();
  }, [user]);

  // For demo, use the first active quiz and teacherId from user
  const activeQuiz = quizzes.find((q) => q.status === 'active');
  const teacherId = user?.id || '';

  // Fetch quiz for preview
  useEffect(() => {
    if (!previewQuizId) return;
    setPreviewLoading(true);
    setPreviewError(null);
    fetch(`/api/quizzes/${previewQuizId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.quiz) setPreviewQuiz(data.quiz);
        else setPreviewError(data.error || 'Quiz not found');
      })
      .catch(() => setPreviewError('Failed to load quiz'))
      .finally(() => setPreviewLoading(false));
  }, [previewQuizId]);

  const handleClosePreview = () => {
    setPreviewQuizId(null);
    setPreviewQuiz(null);
    setPreviewError(null);
  };

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
    if (statusFilter !== 'all') {
      filtered = filtered.filter((quiz) => quiz.status === statusFilter);
    }
    if (subjectFilter.length && subjectFilter[0] !== 'all') {
      filtered = filtered.filter(
        (quiz) => quiz.subject && subjectFilter.includes(quiz.subject.id)
      );
    }
    filtered.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case 'name':
          cmp = a.title.localeCompare(b.title);
          break;
        case 'created':
          cmp =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'modified':
          cmp =
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'attempts':
          cmp = (a.attempts || 0) - (b.attempts || 0);
          break;
        default:
          cmp = 0;
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });
    setFilteredQuizzes(filtered);
  }, [quizzes, searchQuery, statusFilter, subjectFilter, sortBy, sortOrder]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSubjectFilter(['all']);
    setSortBy('created');
    setSortOrder('desc');
  };

  const handleQuizAction = async (quizId: string, action: string) => {
    switch (action) {
      case 'edit':
        router.push(`/teacher/edit-quiz/${quizId}`);
        break;
      case 'preview':
        setPreviewQuizId(quizId);
        break;
      case 'duplicate': {
        setIsLoading(true);
        setError(null);
        try {
          const res = await fetch(`/api/quizzes/${quizId}`, { method: 'POST' });
          if (!res.ok) throw new Error('Failed to duplicate quiz');
          const data = await res.json();
          if (data.quiz) {
            setQuizzes((prev) => [data.quiz, ...prev]);
          }
        } catch (err: any) {
          setError(err.message || 'Failed to duplicate quiz');
        } finally {
          setIsLoading(false);
        }
        break;
      }
      case 'archive': {
        setIsLoading(true);
        setError(null);
        try {
          // Archive: set isPublished to false (or status to 'archived' if you use a status field)
          const res = await fetch(`/api/quizzes/${quizId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isPublished: false, status: 'archived' }),
          });
          if (!res.ok) throw new Error('Failed to archive quiz');
          setQuizzes((prev) =>
            prev.map((q) =>
              q.id === quizId
                ? { ...q, isPublished: false, status: 'archived' }
                : q
            )
          );
        } catch (err: any) {
          setError(err.message || 'Failed to archive quiz');
        } finally {
          setIsLoading(false);
        }
        break;
      }
      case 'delete': {
        setIsLoading(true);
        setError(null);
        try {
          const res = await fetch(`/api/quizzes/${quizId}`, {
            method: 'DELETE',
          });
          if (!res.ok) throw new Error('Failed to delete quiz');
          setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
        } catch (err: any) {
          setError(err.message || 'Failed to delete quiz');
        } finally {
          setIsLoading(false);
        }
        break;
      }
    }
  };

  // Extract unique subjects as array of { id, name }
  const subjects = Array.from(
    quizzes.reduce((acc, q) => {
      if (q.subject && q.subject.id && q.subject.name) {
        acc.set(q.subject.id, { id: q.subject.id, name: q.subject.name });
      }
      return acc;
    }, new Map<string, { id: string; name: string }>()),
    ([, value]) => value
  );

  return (
    <DashboardLayout>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="bg-blue-50 dark:bg-blue-900/10">
            <CardHeader className="flex flex-row items-center gap-2 pb-2 px-4 sm:px-6 pt-4">
              <Info className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base">How to Use</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4">
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
            <CardHeader className="flex flex-row items-center gap-2 pb-2 px-4 sm:px-6 pt-4">
              <Activity className="h-5 w-5 text-green-600" />
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4">
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
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onResetFilters={handleResetFilters}
          isLoading={isLoading}
          multiSelectSubjects={false}
        />

        {/* Loading/Error State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <span className="text-lg">Loading quizzes...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-12">
            <span className="text-lg text-red-500">{error}</span>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="space-y-4">
                <div className="text-6xl">📚</div>
                <h3 className="text-xl font-semibold">
                  {searchQuery ||
                  statusFilter !== 'all' ||
                  subjectFilter.length !== 1 ||
                  subjectFilter[0] !== 'all'
                    ? 'No quizzes found'
                    : 'No quizzes yet'}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery ||
                  statusFilter !== 'all' ||
                  subjectFilter.length !== 1 ||
                  subjectFilter[0] !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Create your first quiz to get started'}
                </p>
                {!searchQuery &&
                  statusFilter === 'all' &&
                  subjectFilter.length === 1 &&
                  subjectFilter[0] === 'all' && (
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
      <Dialog open={!!previewQuizId} onOpenChange={handleClosePreview}>
        <DialogContent
          className="
            w-full
            max-w-full
            sm:max-w-2xl
            md:max-w-3xl
            lg:max-w-4xl
            xl:max-w-5xl
            p-0
            sm:p-8
            sm:rounded-2xl
            sm:top-1/2
            sm:left-1/2
            sm:translate-x-[-50%]
            sm:translate-y-[-50%]
            fixed
            bottom-0
            left-0
            right-0
            top-auto
            h-[90dvh]
            sm:h-auto
            overflow-y-auto
            transition-all
            duration-300
            flex
            flex-col
          "
          showCloseButton
        >
          {/* Visually hidden DialogTitle for accessibility */}
          <DialogTitle className="sr-only">Quiz Preview</DialogTitle>
          <div className="relative flex-1 flex flex-col bg-background rounded-t-lg sm:rounded-2xl min-h-[60vh]">
            <div className="sticky top-0 z-10 bg-background p-4 sm:p-6 border-b flex items-center justify-end">
              <button
                onClick={handleClosePreview}
                className="rounded-full p-2 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <span className="sr-only">Close</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-8">
              {previewLoading ? (
                <div className="py-12 text-center text-lg">Loading quiz...</div>
              ) : previewError ? (
                <div className="py-12 text-center text-red-500 text-lg">
                  {previewError}
                </div>
              ) : previewQuiz ? (
                <div className="w-full max-w-4xl mx-auto">
                  <QuizPreview
                    quiz={{
                      title: previewQuiz.title,
                      description: previewQuiz.description,
                      subjectId: previewQuiz.subjectId || '',
                      category: '',
                      difficulty: 'Medium',
                      tags: [],
                      estimatedDuration: 1,
                      timeLimit: previewQuiz.timeLimit ?? null,
                      showTimer: false,
                      autoSubmit: false,
                      passingScore: 70,
                      showScoreImmediately: false,
                      allowRetakes: false,
                      maxAttempts: 1,
                      startDate: new Date(),
                      endDate: new Date(),
                      assignToClasses: [],
                      assignToStudents: [],
                      requirePassword: false,
                      password: '',
                      questionsPerPage: 1,
                      randomizeQuestions: false,
                      randomizeAnswers: false,
                      showQuestionNumbers: true,
                    }}
                    questions={(previewQuiz.questions || []).map((q) => ({
                      id: q.id,
                      type: q.type as any,
                      question: q.text,
                      options: q.options,
                      correctAnswer: q.correctAnswer,
                      explanation: '',
                      points: q.points ?? 1,
                      difficulty: 'Medium',
                      tags: [],
                      category: '',
                      order: q.order ?? 0,
                    }))}
                    onPublish={async () => {}}
                    onSaveDraft={async () => {}}
                    isPublishing={false}
                    isSaving={false}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
