'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BookOpen,
  Timer,
  CheckCircle,
  PlayCircle,
  Search,
  FileText,
  Flame,
  Award,
  Users,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { FullPageSpinner } from '@/components/shared/loading-spinner';
import { useQuizzes } from '@/hooks/useQuizzes';
import { Quiz } from '@/types/quiz';
import { useRouter } from 'next/navigation';

const mockAchievements = [
  {
    id: 'streak',
    name: 'Quiz Streak',
    icon: <Flame className="w-4 h-4 text-orange-500" />,
    value: 5,
    label: '5-day streak!',
  },
  {
    id: 'perfect',
    name: 'Perfect Score',
    icon: <Award className="w-4 h-4 text-yellow-500" />,
    value: 1,
    label: 'Perfect Score!',
  },
  {
    id: 'first',
    name: 'First Quiz',
    icon: <CheckCircle className="w-4 h-4 text-green-500" />,
    value: 1,
    label: 'First Quiz Completed',
  },
];

const mockRecommendations = [
  {
    id: 'r1',
    title: 'Practice More on Algebra',
    reason: 'Based on your recent scores',
    quizId: 'q1',
  },
  {
    id: 'r2',
    title: 'Try the JAMB Mock Exam',
    reason: 'Mock exam available this week',
    quizId: 'q2',
  },
];

const mockTopicMastery = [
  { subject: 'Mathematics', percent: 60 },
  { subject: 'Biology', percent: 80 },
  { subject: 'History', percent: 40 },
];

function StudentQuizProgressSummary({
  quizzes,
  achievements,
}: {
  quizzes: Quiz[];
  achievements: typeof mockAchievements;
}) {
  const inProgress = quizzes.filter((q) => q.isPublished).length;
  const completed = 0; // No completed status in Quiz model
  const notStarted = quizzes.filter((q) => !q.isPublished).length;
  // No mockAvailable logic for real quizzes
  const mockAvailable = 0;
  const lastQuiz =
    quizzes.find((q) => q.isPublished) || quizzes.find((q) => !q.isPublished);
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        {/* <h1 className="text-2xl font-bold mb-1">My Quizzes</h1> */}
        <div className="text-muted-foreground text-sm">
          {`You have ${inProgress} published, ${notStarted} unpublished quizzes available.`}
        </div>
        <div className="flex gap-2 mt-2">
          {achievements.map((a) => (
            <span
              key={a.id}
              className="flex items-center gap-1 bg-muted rounded px-2 py-1 text-xs font-medium"
            >
              {a.icon} {a.label}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 md:items-end">
        {lastQuiz && (
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-1 mb-1"
          >
            <PlayCircle className="w-4 h-4" /> Continue Last Quiz
          </Button>
        )}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <FileText className="w-4 h-4" /> Take Mock Exam
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <BookOpen className="w-4 h-4" /> Review Completed
          </Button>
        </div>
      </div>
    </div>
  );
}

function RecommendedForYou({
  recommendations,
  onDetails,
}: {
  recommendations: typeof mockRecommendations;
  onDetails: (quizId: string) => void;
}) {
  if (!recommendations.length) return null;
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Recommended for You</h2>
      <div className="flex flex-col md:flex-row gap-3">
        {recommendations.map((r) => (
          <Card
            key={r.id}
            className="flex-1 shadow-sm hover:shadow-md transition cursor-pointer bg-green-50 dark:bg-green-900/10"
            onClick={() => onDetails(r.quizId)}
          >
            <CardContent className="p-4">
              <div className="font-medium mb-1">{r.title}</div>
              <div className="text-xs text-muted-foreground mb-2">
                {r.reason}
              </div>
              <Button variant="secondary" size="sm">
                Go to Quiz
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TopicMasteryBar({ mastery }: { mastery: typeof mockTopicMastery }) {
  if (!mastery.length) return null;
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Topic Mastery</h2>
      <div className="flex flex-col gap-2">
        {mastery.map((m) => (
          <div key={m.subject} className="flex items-center gap-2">
            <span className="w-32 text-xs font-medium">{m.subject}</span>
            <Progress value={m.percent} className="flex-1 h-2" />
            <span className="text-xs font-mono w-10 text-right">
              {m.percent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuizFiltersBar({ search, setSearch, filter, setFilter }: any) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
      <div className="flex-1 flex items-center gap-2">
        <Input
          placeholder="Search quizzes by title, subject, or teacher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'assignment' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('assignment')}
        >
          Assignments
        </Button>
        <Button
          variant={filter === 'practice' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('practice')}
        >
          Practice
        </Button>
        <Button
          variant={filter === 'mock' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('mock')}
        >
          Mock Exams
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('completed')}
        >
          Completed
        </Button>
      </div>
      {/* TODO: Add leaderboard, discussion, and AI Mentor integration */}
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" title="Leaderboard (Coming soon)">
          <Users className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" title="Discussion (Coming soon)">
          <MessageCircle className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" title="AI Mentor (Coming soon)">
          <BookOpen className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

function StudentQuizCard({
  quiz,
  onDetails,
}: {
  quiz: Quiz;
  onDetails: (quiz: Quiz) => void;
}) {
  return (
    <Card
      className="shadow-sm hover:shadow-md transition cursor-pointer"
      onClick={() => onDetails(quiz)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-lg">{quiz.title}</span>
          <span
            className={`ml-auto px-2 py-0.5 rounded text-xs font-medium ${
              quiz.isPublished
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {quiz.isPublished ? 'Published' : 'Draft'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>
            <BookOpen className="inline w-3 h-3 mr-1" />
            {typeof quiz.subject === 'string'
              ? quiz.subject
              : quiz.subject?.name || 'No Subject'}
          </span>
          <span>
            <Timer className="inline w-3 h-3 mr-1" />
            {quiz.timeLimit || 'No time limit'} min
          </span>
          <span>By {quiz.teacher?.name || 'Unknown Teacher'}</span>
          <span>Questions: {quiz.questions?.length ?? 0}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function StudentQuizList({
  quizzes,
  onDetails,
}: {
  quizzes: Quiz[];
  onDetails: (quiz: Quiz) => void;
}) {
  if (!quizzes.length)
    return (
      <div className="text-muted-foreground text-center py-12">
        No quizzes found.
      </div>
    );
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {quizzes.map((q) => (
        <StudentQuizCard key={q.id} quiz={q} onDetails={onDetails} />
      ))}
    </div>
  );
}

function QuizDetailsDrawer({
  quiz,
  open,
  onClose,
}: {
  quiz: any;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  if (!quiz) return null;
  return (
    <div
      className={`fixed inset-0 z-50 bg-black/30 flex items-center justify-center transition ${
        open ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <Card className="w-full max-w-md relative">
        <CardHeader>
          <button
            className="absolute top-2 right-2 text-muted-foreground"
            onClick={onClose}
          >
            &times;
          </button>
          <CardTitle>{quiz.title}</CardTitle>
          <CardDescription>
            {typeof quiz.subject === 'string'
              ? quiz.subject
              : quiz.subject?.name || 'No Subject'}{' '}
            &middot; {quiz.timeLimit || 'No time limit'} min
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            By {quiz.teacher?.name || 'Unknown Teacher'}
          </div>
          <div className="mb-2">{quiz.description}</div>
          {/* Remove topics section since it doesn't exist in the Quiz model */}
          <div className="flex gap-2 mt-4">
            <Button
              variant="default"
              onClick={() => router.push(`/quiz/${quiz.id}`)}
            >
              Start Quiz
            </Button>
            <Button variant="outline">Review</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function StudentQuizzesPage() {
  const { user, loading } = useAuth();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [subjectId, setSubjectId] = useState('');
  const [detailsQuiz, setDetailsQuiz] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);

  // Fetch student's subjects for filtering
  useEffect(() => {
    async function fetchSubjects() {
      if (!user?.id) return;
      setSubjectsLoading(true);
      try {
        const res = await fetch(`/api/subjects?studentId=${user.id}`);
        const data = await res.json();
        setSubjects(data.subjects || []);
        if (data.subjects && data.subjects.length === 1) {
          setSubjectId(data.subjects[0].id);
        }
      } finally {
        setSubjectsLoading(false);
      }
    }
    fetchSubjects();
  }, [user?.id]);

  // Memoize the filters object to prevent infinite re-renders
  const filters = useMemo(
    () => ({
      subject: subjectId,
    }),
    [subjectId]
  );

  // Fetch quizzes for this student and subject
  const { quizzes, loading: quizzesLoading } = useQuizzes({
    userId: user?.id,
    role: 'student',
    filters,
  });

  // After fetching quizzes, map them to add type and completed for demo/testing
  const quizzesWithType = quizzes.map((q) => ({
    ...q,
    type: q.type || 'assignment', // You can randomize or derive this for demo
    completed: q.completed ?? false, // You can randomize or derive this for demo
  }));

  if (loading || quizzesLoading || subjectsLoading)
    return <FullPageSpinner text="Loading your dashboard..." />;
  if (!user) return null;

  // Use quizzesWithType in filtering
  const filtered = quizzesWithType.filter((q) => {
    const subjectText =
      typeof q.subject === 'string' ? q.subject : q.subject?.name || '';
    const matchesSearch =
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      subjectText.toLowerCase().includes(search.toLowerCase()) ||
      (q.teacher?.name || '').toLowerCase().includes(search.toLowerCase());
    // Filter by quiz type
    let matchesFilter = false;
    if (filter === 'all') matchesFilter = true;
    else if (filter === 'assignment') matchesFilter = q.type === 'assignment';
    else if (filter === 'practice') matchesFilter = q.type === 'practice';
    else if (filter === 'mock') matchesFilter = q.type === 'mock';
    else if (filter === 'completed') matchesFilter = q.completed === true;
    return matchesSearch && matchesFilter;
  });

  // Handler for recommendations and quiz cards
  const handleDetails = (quizOrId: any) => {
    const quiz =
      typeof quizOrId === 'string'
        ? quizzes.find((q) => q.id === quizOrId)
        : quizOrId;
    if (quiz) {
      setDetailsQuiz(quiz);
      setDrawerOpen(true);
    }
  };

  return (
    <DashboardLayout pageTitle="My Quizzes">
      <div className="space-y-6 mx-auto">
        {/* Subject filter dropdown if multiple subjects */}
        {subjects.length > 0 && (
          <div className="mb-4">
            <label
              htmlFor="subject-filter"
              className="block text-sm font-medium mb-1"
            >
              Filter by Subject:
            </label>
            <select
              id="subject-filter"
              className="border rounded px-3 py-2 bg-background"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
            >
              <option value="">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <StudentQuizProgressSummary quizzes={quizzes} achievements={[]} />
        <RecommendedForYou recommendations={[]} onDetails={handleDetails} />
        <TopicMasteryBar mastery={mockTopicMastery} />
        <QuizFiltersBar
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
        />
        <StudentQuizList quizzes={filtered} onDetails={handleDetails} />
        <QuizDetailsDrawer
          quiz={detailsQuiz}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
}
