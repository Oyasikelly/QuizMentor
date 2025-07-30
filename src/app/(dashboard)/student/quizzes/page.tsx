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
  PlayCircle,
  FileText,
  Users,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { FullPageSpinner } from '@/components/shared/loading-spinner';
import { useQuizzes } from '@/hooks/useQuizzes';
import { Quiz } from '@/types/quiz';
import { useRouter } from 'next/navigation';
import { useQuizQuestions } from '@/hooks/useQuizQuestions';
import { useQuizContext } from '@/context/QuizContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

type MockAchievement = {
  id: string;
  name: string;
  icon: React.ReactNode;
  value: number;
  label: string;
};

type MockRecommendation = {
  id: string;
  title: string;
  reason: string;
  quizId: string;
};

type MockTopicMastery = Array<{ subject: string; percent: number }>;

function StudentQuizProgressSummary({
  quizzes,
  achievements,
}: {
  quizzes: Quiz[];
  achievements: MockAchievement[];
}) {
  const inProgress = quizzes.filter((q) => q.isPublished).length;
  const notStarted = quizzes.filter((q) => !q.isPublished).length;
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
  recommendations: MockRecommendation[];
  onDetails: (quizId: string) => void;
}) {
  if (!recommendations.length) return null;
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Recommended for You</h2>
      <div className="flex flex-col md:flex-row gap-3">
        {/* Responsive card grid */}
        {recommendations.map((r) => (
          <Card
            key={r.id}
            className="w-full max-w-md sm:max-w-lg flex-1 shadow-sm hover:shadow-md transition cursor-pointer bg-green-50 dark:bg-green-900/10 mx-auto"
            onClick={() => onDetails(r.quizId)}
          >
            <CardContent className="p-4 sm:p-6 flex flex-col gap-2">
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

function TopicMasteryBar({ mastery }: { mastery: MockTopicMastery }) {
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

type QuizFiltersProps = {
  search: string;
  setSearch: (search: string) => void;
  filter: string;
  setFilter: (filter: string) => void;
};

function QuizFiltersBar({ search, setSearch, filter, setFilter }: QuizFiltersProps) {
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
  quizAttempts,
  setReviewQuizId,
  setReviewOpen,
}: {
  quiz: Quiz;
  onDetails: (quiz: Quiz) => void;
  quizAttempts: Record<string, { score: number; totalPoints: number }>;
  setReviewQuizId: (id: string) => void;
  setReviewOpen: (open: boolean) => void;
}) {
  const attempt = quizAttempts[quiz.id];
  return (
    <Card
      className="w-full max-w-md sm:max-w-lg shadow-sm hover:shadow-md transition cursor-pointer mx-auto"
      onClick={() => onDetails(quiz)}
    >
      <CardContent className="p-4 sm:p-6 flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-lg">{quiz.title}</span>
          {attempt && (
            <Badge variant="default" className="ml-2">
              Completed
            </Badge>
          )}
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
          <span>Questions: {quiz.questionsCount ?? 0}</span>
          {attempt && (
            <span className="font-semibold text-green-700">
              Score: {attempt.score} / {attempt.totalPoints}
            </span>
          )}
        </div>
        {attempt && (
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-fit"
            onClick={(e) => {
              e.stopPropagation();
              setReviewQuizId(quiz.id);
              setReviewOpen(true);
            }}
          >
            Review
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function StudentQuizList({
  quizzes,
  onDetails,
  quizAttempts,
  setReviewQuizId,
  setReviewOpen,
}: {
  quizzes: Quiz[];
  onDetails: (quiz: Quiz) => void;
  quizAttempts: Record<string, { score: number; totalPoints: number }>;
  setReviewQuizId: (id: string) => void;
  setReviewOpen: (open: boolean) => void;
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
        <StudentQuizCard
          key={q.id}
          quiz={q}
          onDetails={onDetails}
          quizAttempts={quizAttempts}
          setReviewQuizId={setReviewQuizId}
          setReviewOpen={setReviewOpen}
        />
      ))}
    </div>
  );
}

function QuizDetailsDrawer({
  quiz,
  open,
  onClose,
  onReview,
}: {
  quiz: Quiz;
  open: boolean;
  onClose: () => void;
  onReview: () => void;
}) {
  const router = useRouter();
  const { setQuiz } = useQuizContext();
  // Fetch questions for the selected quiz
  const { questions } = useQuizQuestions(quiz?.id || null);
  if (!quiz) return null;
  const handleStartQuiz = () => {
    setQuiz({ ...quiz, questions });
    router.push(`/quiz/${quiz.id}`);
  };
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
          {/* Questions Section */}
          {/* <div className="mb-4">
            <h4 className="font-semibold mb-2">Questions</h4>
            {loading && <div>Loading questions...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {!loading && !error && questions.length === 0 && (
              <div className="text-muted-foreground">
                No questions found for this quiz.
              </div>
            )}
            <ul className="list-decimal pl-5 space-y-1">
              {questions.map((q, idx) => (
                <li key={q.id || idx} className="text-sm">
                  {q.text}
                </li>
              ))}
            </ul>
          </div> */}
          <div className="flex gap-2 mt-4">
            <Button variant="default" onClick={handleStartQuiz}>
              Start Quiz
            </Button>
            <Button variant="outline" onClick={onReview}>
              Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReviewModalDrawer({
  open,
  onClose,
  quizId,
  studentId,
}: {
  open: boolean;
  onClose: () => void;
  quizId: string;
  studentId: string;
}) {
  const [loading, setLoading] = useState(false);
type ReviewItem = {
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  options?: string[];
  pointsEarned: number;
  isCorrect: boolean;
};

type Attempt = {
  score: number;
  totalPoints: number;
  completedAt: string;
};

const [review, setReview] = useState<ReviewItem[]>([]);
const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    fetch(`/api/attempts?studentId=${studentId}&quizId=${quizId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('No previous attempt found.');
        const data = await res.json();
        setReview(data.review);
        setAttempt(data.attempt);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [open, quizId, studentId]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full pb-8 p-4 sm:p-6 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700">
        <DialogHeader>
          <DialogTitle>Quiz Review</DialogTitle>
          <DialogDescription>
            Review your answers and see the correct answers below.
          </DialogDescription>
        </DialogHeader>
        {loading && <div>Loading review...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {attempt && (
          <div className="mb-4">
            <div className="font-semibold mb-2">
              Score: {attempt.score} / {attempt.totalPoints}
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              Completed at: {new Date(attempt.completedAt).toLocaleString()}
            </div>
          </div>
        )}
        <div className="space-y-4">
          {review.map((r, idx) => (
            <div
              key={r.questionId + '-' + idx}
              className="border rounded p-3 bg-muted/30"
            >
              <div className="font-medium mb-1">
                Q{idx + 1}: {r.question}
              </div>
              <div className="flex flex-col gap-1 text-sm">
                <span>
                  Your answer:{' '}
                  <span
                    className={r.isCorrect ? 'text-green-600' : 'text-red-600'}
                  >
                    {r.userAnswer}
                  </span>
                </span>
                <span>
                  Correct answer:{' '}
                  <span className="text-green-700 font-semibold">
                    {r.correctAnswer}
                  </span>
                </span>
                {r.options && r.options.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    Options: {r.options.join(', ')}
                  </span>
                )}
                <span>Points: {r.pointsEarned}</span>
                <span
                  className={r.isCorrect ? 'text-green-600' : 'text-red-600'}
                >
                  {r.isCorrect ? 'Correct' : 'Incorrect'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function StudentQuizzesPage() {
  const { user, loading } = useAuth();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [subjectId, setSubjectId] = useState('');
  const [detailsQuiz, setDetailsQuiz] = useState<Quiz | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewQuizId, setReviewQuizId] = useState<string | null>(null);
  const [quizAttempts, setQuizAttempts] = useState<Record<string, { score: number; totalPoints: number }>>({});
  const [topicMastery, setTopicMastery] = useState<MockTopicMastery>([]);

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

  // Fetch latest attempts for all quizzes for this student
  useEffect(() => {
    async function fetchAttempts() {
      if (!user?.id || !quizzes.length) return;
      const results: Record<string, { score: number; totalPoints: number }> = {};
      await Promise.all(
        quizzes.map(async (quiz) => {
          try {
            const res = await fetch(
              `/api/attempts?studentId=${user.id}&quizId=${quiz.id}`
            );
            if (res.ok) {
              const data = await res.json();
              results[quiz.id] = data.attempt;
            }
          } catch {}
        })
      );
      setQuizAttempts(results);
    }
    fetchAttempts();
  }, [user?.id, quizzes]);

  useEffect(() => {
    async function fetchSubjectMastery() {
      if (!user) return;
      fetch(`/api/attempts/stats?studentId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setTopicMastery(
            data.subjectsStudied?.map((s: { name: string }) => ({
              subject: s.name,
              percent: Math.floor(Math.random() * 41) + 60,
            })) || []
          );
        });
    }
    fetchSubjectMastery();
  }, [user]);

  // After fetching quizzes, map them to add type and completed for demo/testing
  const quizzesWithType = quizzes.map((q) => ({
    ...q,
    type: q.type || 'practice', // You can randomize or derive this for demo
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
  const handleDetails = (quizOrId: Quiz | string) => {
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
        <TopicMasteryBar mastery={topicMastery} />
        <QuizFiltersBar
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
        />
        <StudentQuizList
          quizzes={filtered}
          onDetails={handleDetails}
          quizAttempts={quizAttempts}
          setReviewQuizId={setReviewQuizId}
          setReviewOpen={setReviewOpen}
        />
        {detailsQuiz && (
          <QuizDetailsDrawer
            quiz={detailsQuiz}
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            onReview={() => {
              setReviewQuizId(detailsQuiz.id);
              setReviewOpen(true);
            }}
          />
        )}
        <ReviewModalDrawer
          open={reviewOpen}
          onClose={() => setReviewOpen(false)}
          quizId={reviewQuizId || ''}
          studentId={user?.id || ''}
        />
      </div>
    </DashboardLayout>
  );
}
