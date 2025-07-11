'use client';

import React, { useState } from 'react';
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

const mockUser = {
  id: 'student1',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  role: 'student' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockQuizzes = [
  {
    id: 'q1',
    title: 'Algebra Basics',
    subject: 'Mathematics',
    teacher: 'Dr. Amina Hassan',
    type: 'Assignment',
    questions: 15,
    duration: 30,
    difficulty: 'Easy',
    topics: ['Algebra'],
    status: 'not_started',
    score: null,
    description: 'Practice core algebra concepts and equations.',
    isMock: false,
  },
  {
    id: 'q2',
    title: 'JAMB Mock Exam 2025',
    subject: 'General',
    teacher: 'QuizMentor',
    type: 'Mock Exam',
    questions: 180,
    duration: 180,
    difficulty: 'Mixed',
    topics: ['JAMB', 'Practice'],
    status: 'in_progress',
    score: null,
    description: 'Simulate the real JAMB exam experience.',
    isMock: true,
  },
  {
    id: 'q3',
    title: 'Photosynthesis',
    subject: 'Biology',
    teacher: 'Dr. Amina Hassan',
    type: 'Assignment',
    questions: 10,
    duration: 20,
    difficulty: 'Medium',
    topics: ['Photosynthesis', 'Plants'],
    status: 'completed',
    score: 85,
    description: 'Test your knowledge of plant biology and photosynthesis.',
    isMock: false,
  },
  {
    id: 'q4',
    title: 'World War II',
    subject: 'History',
    teacher: 'Mr. Okoro',
    type: 'Practice',
    questions: 12,
    duration: 25,
    difficulty: 'Hard',
    topics: ['WWII', 'History'],
    status: 'not_started',
    score: null,
    description: 'Review key events and figures from World War II.',
    isMock: false,
  },
];

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

const statusLabels: Record<string, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  completed: 'Completed',
};

const statusColors: Record<string, string> = {
  not_started: 'bg-muted text-foreground',
  in_progress: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
};

function StudentQuizProgressSummary({
  quizzes,
  achievements,
}: {
  quizzes: typeof mockQuizzes;
  achievements: typeof mockAchievements;
}) {
  const inProgress = quizzes.filter((q) => q.status === 'in_progress').length;
  const completed = quizzes.filter((q) => q.status === 'completed').length;
  const notStarted = quizzes.filter((q) => q.status === 'not_started').length;
  const mockAvailable = quizzes.filter(
    (q) => q.isMock && q.status !== 'completed'
  ).length;
  const lastQuiz =
    quizzes.find((q) => q.status === 'in_progress') ||
    quizzes.find((q) => q.status === 'not_started');
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold mb-1">My Quizzes</h1>
        <div className="text-muted-foreground text-sm">
          {`You have ${inProgress} in progress, ${completed} completed, ${notStarted} not started, ${mockAvailable} mock exam${
            mockAvailable === 1 ? '' : 's'
          } available.`}
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
            className="flex-1 shadow-sm hover:shadow-md transition cursor-pointer"
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
  quiz: (typeof mockQuizzes)[0];
  onDetails: (quiz: any) => void;
}) {
  return (
    <Card
      className="shadow-sm hover:shadow-md transition cursor-pointer"
      onClick={() => onDetails(quiz)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-lg">{quiz.title}</span>
          {quiz.isMock && (
            <Badge variant="secondary" className="ml-2">
              Mock Exam
            </Badge>
          )}
          <span
            className={`ml-auto px-2 py-0.5 rounded text-xs font-medium ${
              statusColors[quiz.status]
            }`}
          >
            {statusLabels[quiz.status]}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>
            <BookOpen className="inline w-3 h-3 mr-1" />
            {quiz.subject}
          </span>
          <span>
            <Timer className="inline w-3 h-3 mr-1" />
            {quiz.duration} min
          </span>
          <span>By {quiz.teacher}</span>
          <span>Questions: {quiz.questions}</span>
          <span>Difficulty: {quiz.difficulty}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {quiz.topics.map((t: string) => (
            <Badge key={t} variant="outline" className="text-xs">
              {t}
            </Badge>
          ))}
        </div>
        {quiz.status === 'completed' && quiz.score !== null && (
          <div className="text-green-700 text-xs font-semibold">
            Score: {quiz.score}%
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StudentQuizList({
  quizzes,
  onDetails,
}: {
  quizzes: typeof mockQuizzes;
  onDetails: (quiz: any) => void;
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
            {quiz.subject} &middot; {quiz.difficulty} &middot; {quiz.duration}{' '}
            min
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-2">By {quiz.teacher}</div>
          <div className="mb-2">{quiz.description}</div>
          <div className="flex flex-wrap gap-1 mb-2">
            {quiz.topics.map((t: string) => (
              <Badge key={t} variant="outline" className="text-xs">
                {t}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            {quiz.status === 'not_started' && (
              <Button variant="default">Start Quiz</Button>
            )}
            {quiz.status === 'in_progress' && (
              <Button variant="default">Resume Quiz</Button>
            )}
            {quiz.status === 'completed' && (
              <Button variant="outline">Review</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function StudentQuizzesPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [detailsQuiz, setDetailsQuiz] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Filter logic
  const filtered = mockQuizzes.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.subject.toLowerCase().includes(search.toLowerCase()) ||
      q.teacher.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'assignment' && q.type === 'Assignment') ||
      (filter === 'practice' && q.type === 'Practice') ||
      (filter === 'mock' && q.isMock) ||
      (filter === 'completed' && q.status === 'completed');
    return matchesSearch && matchesFilter;
  });

  // Handler for recommendations and quiz cards
  const handleDetails = (quizOrId: any) => {
    const quiz =
      typeof quizOrId === 'string'
        ? mockQuizzes.find((q) => q.id === quizOrId)
        : quizOrId;
    if (quiz) {
      setDetailsQuiz(quiz);
      setDrawerOpen(true);
    }
  };

  return (
    <DashboardLayout user={mockUser} pageTitle="My Quizzes">
      <div className="max-w-5xl mx-auto">
        <StudentQuizProgressSummary
          quizzes={mockQuizzes}
          achievements={mockAchievements}
        />
        <RecommendedForYou
          recommendations={mockRecommendations}
          onDetails={handleDetails}
        />
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
