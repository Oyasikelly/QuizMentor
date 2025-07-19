'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Flame,
  Award,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Users,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { FullPageSpinner } from '@/components/shared/loading-spinner';

const mockStats = {
  quizzesTaken: 18,
  averageScore: 78,
  bestScore: 100,
  streak: 6,
  timeSpent: 540, // minutes
  badges: 4,
};

const mockPerformance = [
  { date: '2024-05-01', score: 70 },
  { date: '2024-05-08', score: 75 },
  { date: '2024-05-15', score: 80 },
  { date: '2024-05-22', score: 85 },
  { date: '2024-05-29', score: 90 },
  { date: '2024-06-05', score: 100 },
  { date: '2024-06-12', score: 95 },
];

const mockQuizHistory = [
  {
    id: 'q1',
    title: 'Algebra Basics',
    date: '2024-06-12',
    score: 95,
    type: 'Assignment',
  },
  {
    id: 'q2',
    title: 'JAMB Mock Exam',
    date: '2024-06-05',
    score: 100,
    type: 'Mock Exam',
  },
  {
    id: 'q3',
    title: 'Photosynthesis',
    date: '2024-05-29',
    score: 90,
    type: 'Assignment',
  },
  {
    id: 'q4',
    title: 'World War II',
    date: '2024-05-22',
    score: 85,
    type: 'Practice',
  },
  {
    id: 'q5',
    title: 'English Literature',
    date: '2024-05-15',
    score: 80,
    type: 'Assignment',
  },
];

const mockTopicMastery = [
  { subject: 'Mathematics', percent: 80 },
  { subject: 'Biology', percent: 90 },
  { subject: 'History', percent: 60 },
  { subject: 'Literature', percent: 70 },
];

const mockAchievements = [
  {
    id: 'streak',
    name: 'Quiz Streak',
    icon: <Flame className="w-4 h-4 text-orange-500" />,
    label: '6-day streak!',
  },
  {
    id: 'perfect',
    name: 'Perfect Score',
    icon: <Award className="w-4 h-4 text-yellow-500" />,
    label: 'Perfect Score!',
  },
  {
    id: 'first',
    name: 'First Quiz',
    icon: <CheckCircle className="w-4 h-4 text-green-500" />,
    label: 'First Quiz Completed',
  },
  {
    id: 'progress',
    name: 'On the Rise',
    icon: <TrendingUp className="w-4 h-4 text-blue-500" />,
    label: 'Improved 5 weeks in a row',
  },
];

const mockRecommendations = [
  { id: 'r1', text: 'Practice more on Algebra to boost your score.' },
  { id: 'r2', text: 'Retake Biology quiz for a higher score.' },
  { id: 'r3', text: 'Try the next JAMB Mock Exam for exam readiness.' },
];

const mockPeerComparison = {
  percentile: 80,
  classAverage: 72,
  yourAverage: 78,
};

function StudentProgressOverview({
  stats,
  onViewAchievements,
}: {
  stats: typeof mockStats;
  onViewAchievements: () => void;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
      <div className="flex-1 flex flex-col gap-2">
        {/* <h1 className="text-2xl font-bold mb-1">Progress Overview</h1> */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex flex-col items-center">
            <BarChart3 className="w-6 h-6 mb-1 text-primary" />
            <span className="text-lg font-bold">{stats.quizzesTaken}</span>
            <span className="text-xs text-muted-foreground">Quizzes Taken</span>
          </div>
          <div className="flex flex-col items-center">  
            <TrendingUp className="w-6 h-6 mb-1 text-primary" />
            <span className="text-lg font-bold">{stats.averageScore}%</span>
            <span className="text-xs text-muted-foreground">Avg. Score</span>
          </div>
          <div className="flex flex-col items-center">
            <Award className="w-6 h-6 mb-1 text-primary" />
            <span className="text-lg font-bold">{stats.bestScore}%</span>
            <span className="text-xs text-muted-foreground">Best Score</span>
          </div>
          <div className="flex flex-col items-center">
            <Flame className="w-6 h-6 mb-1 text-orange-500" />
            <span className="text-lg font-bold">{stats.streak}</span>
            <span className="text-xs text-muted-foreground">Day Streak</span>
          </div>
          <div className="flex flex-col items-center">
            <BookOpen className="w-6 h-6 mb-1 text-primary" />
            <span className="text-lg font-bold">
              {Math.round(stats.timeSpent / 60)}h
            </span>
            <span className="text-xs text-muted-foreground">Time Spent</span>
          </div>
          <div className="flex flex-col items-center">
            <CheckCircle className="w-6 h-6 mb-1 text-green-500" />
            <span className="text-lg font-bold">{stats.badges}</span>
            <span className="text-xs text-muted-foreground">Badges</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 items-end">
        {/* TODO: Add celebratory animation for new achievements */}
        <Button variant="outline" size="sm" onClick={onViewAchievements}>
          View Achievements
        </Button>
      </div>
    </div>
  );
}

function PerformanceChart({ data }: { data: typeof mockPerformance }) {
  // Simple SVG line chart mock
  const maxScore = 100;
  const width = 320;
  const height = 80;
  const points = data
    .map(
      (d, i) =>
        `${(i / (data.length - 1)) * width},${
          height - (d.score / maxScore) * height
        }`
    )
    .join(' ');
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2">Performance Over Time</h2>
      <Card>
        <CardContent className="p-4">
          <svg width={width} height={height} className="block mx-auto">
            <polyline
              fill="none"
              stroke="#6366f1"
              strokeWidth="3"
              points={points}
            />
            {data.map((d, i) => (
              <circle
                key={i}
                cx={(i / (data.length - 1)) * width}
                cy={height - (d.score / maxScore) * height}
                r="4"
                fill="#6366f1"
              />
            ))}
          </svg>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            {data.map((d, i) => (
              <span key={i}>{d.date.slice(5)}</span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function QuizHistoryTable({ history }: { history: typeof mockQuizHistory }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2">Quiz History</h2>
      <div className="overflow-x-auto rounded border bg-background">
        <table className="min-w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-2 text-left">Quiz</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Score</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {history.map((q) => (
              <tr key={q.id} className="border-b last:border-0">
                <td className="p-2 font-medium">{q.title}</td>
                <td className="p-2">{q.date}</td>
                <td className="p-2">{q.type}</td>
                <td className="p-2">{q.score}%</td>
                <td className="p-2">
                  <Button variant="outline" size="sm">
                    Review
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TopicMasteryBars({ mastery }: { mastery: typeof mockTopicMastery }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2">Subject Mastery</h2>
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

function AchievementsGallery({
  achievements,
}: {
  achievements: typeof mockAchievements;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2">Achievements & Badges</h2>
      <div className="flex flex-wrap gap-3">
        {achievements.map((a) => (
          <Card
            key={a.id}
            className="min-w-[100px] bg-yellow-50 dark:bg-yellow-900/10"
          >
            <CardContent className="p-3 flex flex-col items-center">
              {a.icon}
              <span className="text-xs font-medium mt-1">{a.name}</span>
              <span className="text-xs text-muted-foreground">{a.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AchievementsModal({
  open,
  onClose,
  achievements,
}: {
  open: boolean;
  onClose: () => void;
  achievements: typeof mockAchievements;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
      onClick={onClose}
    >
      <Card className="w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <button
            className="absolute top-2 right-2 text-muted-foreground"
            onClick={onClose}
          >
            &times;
          </button>
          <CardTitle>All Achievements & Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 justify-center">
            {achievements.map((a) => (
              <Card key={a.id} className="min-w-[120px]">
                <CardContent className="p-4 flex flex-col items-center">
                  {a.icon}
                  <span className="text-sm font-medium mt-2">{a.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {a.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PersonalizedRecommendations({
  recommendations,
}: {
  recommendations: typeof mockRecommendations;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2">
        Personalized Recommendations
      </h2>
      <ul className="list-disc pl-6 text-sm">
        {recommendations.map((r) => (
          <li key={r.id}>{r.text}</li>
        ))}
      </ul>
    </div>
  );
}

function PeerComparisonPanel({
  comparison,
}: {
  comparison: typeof mockPeerComparison;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2">Peer Comparison</h2>
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex flex-col items-center">
            <Users className="w-6 h-6 mb-1 text-primary" />
            <span className="text-lg font-bold">
              Top {comparison.percentile}%
            </span>
            <span className="text-xs text-muted-foreground">
              Your percentile
            </span>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <BarChart3 className="w-6 h-6 mb-1 text-primary" />
            <span className="text-lg font-bold">{comparison.yourAverage}%</span>
            <span className="text-xs text-muted-foreground">
              Your Avg. Score
            </span>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <BarChart3 className="w-6 h-6 mb-1 text-muted-foreground" />
            <span className="text-lg font-bold">
              {comparison.classAverage}%
            </span>
            <span className="text-xs text-muted-foreground">
              Class Avg. Score
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function StudentProgressPage() {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner text="Loading your dashboard..." />;
  if (!user) return null;
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  return (
    <DashboardLayout pageTitle="Progress">
      <div className="space-y-6 mx-auto">
        <StudentProgressOverview
          stats={mockStats}
          onViewAchievements={() => setAchievementsOpen(true)}
        />
        <PerformanceChart data={mockPerformance} />
        <QuizHistoryTable history={mockQuizHistory} />
        <TopicMasteryBars mastery={mockTopicMastery} />
        <AchievementsGallery achievements={mockAchievements} />
        <PersonalizedRecommendations recommendations={mockRecommendations} />
        <PeerComparisonPanel comparison={mockPeerComparison} />
        <AchievementsModal
          open={achievementsOpen}
          onClose={() => setAchievementsOpen(false)}
          achievements={mockAchievements}
        />
      </div>
    </DashboardLayout>
  );
}
