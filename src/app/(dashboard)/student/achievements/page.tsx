'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader as DialogH,
  DialogTitle as DialogT,
  DialogDescription as DialogD,
  DialogClose,
} from '@/components/ui/dialog';
import { StatsCard } from '@/components/dashboard/stats-card';
import { ProgressChart } from '@/components/dashboard/progress-chart';
import {
  Flame,
  Award,
  CheckCircle,
  TrendingUp,
  BookOpen,
  Lock,
  Star,
  User,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { FullPageSpinner } from '@/components/shared/loading-spinner';

// --- Mock Data ---
const mockHeader = {
  studentName: 'Alex Johnson',
  overallGrade: 'A',
  totalPoints: 1240,
  currentRank: 5,
  totalStudents: 50,
};

const mockStats = [
  {
    title: 'Quizzes Completed',
    value: 18,
    icon: BookOpen,
    description: 'Total quizzes finished.',
  },
  {
    title: 'Average Score',
    value: '78%',
    icon: TrendingUp,
    description: 'Across all quizzes.',
  },
  {
    title: 'Perfect Scores',
    value: 3,
    icon: Award,
    description: '100% scores achieved.',
  },
  {
    title: 'Improvement Rate',
    value: '+12%',
    icon: TrendingUp,
    description: 'Compared to last month.',
  },
  {
    title: 'Current Streak',
    value: 6,
    icon: Flame,
    description: 'Days in a row.',
  },
  {
    title: 'Badges Earned',
    value: 4,
    icon: Star,
    description: 'Total badges unlocked.',
  },
];

const mockBadges = [
  {
    id: 'streak',
    name: 'Quiz Streak',
    description: 'Complete quizzes 5 days in a row.',
    icon: '🔥',
    category: 'consistency',
    earnedAt: new Date('2024-06-10'),
    requirements: 'Take a quiz 5 days in a row.',
    rarity: 'common',
  },
  {
    id: 'perfect',
    name: 'Perfect Score',
    description: 'Score 100% on any quiz.',
    icon: '🏆',
    category: 'performance',
    earnedAt: new Date('2024-06-05'),
    requirements: 'Score 100% on a quiz.',
    rarity: 'rare',
  },
  {
    id: 'first',
    name: 'First Quiz',
    description: 'Complete your first quiz.',
    icon: '✅',
    category: 'milestone',
    earnedAt: new Date('2024-05-01'),
    requirements: 'Complete your first quiz.',
    rarity: 'common',
  },
  {
    id: 'enthusiast',
    name: 'Quiz Enthusiast',
    description: 'Complete 10 quizzes.',
    icon: '⭐',
    category: 'milestone',
    earnedAt: null,
    requirements: 'Complete 10 quizzes.',
    rarity: 'epic',
  },
  {
    id: 'mockmaster',
    name: 'Mock Master',
    description: 'Complete 3 mock exams.',
    icon: '📚',
    category: 'milestone',
    earnedAt: null,
    requirements: 'Complete 3 mock exams.',
    rarity: 'rare',
  },
  {
    id: 'longstreak',
    name: 'Streak Legend',
    description: 'Complete quizzes 10 days in a row.',
    icon: '🔥',
    category: 'consistency',
    earnedAt: null,
    requirements: 'Take a quiz 10 days in a row.',
    rarity: 'epic',
  },
];

const mockProgressData = {
  performanceOverTime: [
    { date: '2024-05-01', score: 70, subject: 'Math' },
    { date: '2024-05-08', score: 75, subject: 'Math' },
    { date: '2024-05-15', score: 80, subject: 'Math' },
    { date: '2024-05-22', score: 85, subject: 'Math' },
    { date: '2024-05-29', score: 90, subject: 'Math' },
    { date: '2024-06-05', score: 100, subject: 'Math' },
    { date: '2024-06-12', score: 95, subject: 'Math' },
  ],
  subjectBreakdown: [
    { subject: 'Math', averageScore: 85, quizCount: 7 },
    { subject: 'Biology', averageScore: 90, quizCount: 5 },
    { subject: 'History', averageScore: 70, quizCount: 3 },
  ],
  difficultyProgress: [
    { difficulty: 'Easy', successRate: 95 },
    { difficulty: 'Medium', successRate: 80 },
    { difficulty: 'Hard', successRate: 60 },
  ],
};

const mockStreakData = {
  currentStreak: 6,
  longestStreak: 8,
  weeklyActivity: [
    { date: '2024-06-10', quizzesCompleted: 1, studyTime: 30 },
    { date: '2024-06-11', quizzesCompleted: 1, studyTime: 25 },
    { date: '2024-06-12', quizzesCompleted: 1, studyTime: 40 },
    { date: '2024-06-13', quizzesCompleted: 1, studyTime: 35 },
    { date: '2024-06-14', quizzesCompleted: 1, studyTime: 20 },
    { date: '2024-06-15', quizzesCompleted: 1, studyTime: 50 },
    { date: '2024-06-16', quizzesCompleted: 0, studyTime: 0 },
  ],
  monthlyGoal: { target: 20, achieved: 12, percentage: 60 },
};

const mockRecentAchievements = [
  {
    id: 'a1',
    type: 'badge',
    title: 'Quiz Streak',
    description: '5-day streak!',
    earnedAt: new Date('2024-06-10'),
    points: 50,
    celebrationLevel: 'normal',
  },
  {
    id: 'a2',
    type: 'milestone',
    title: 'First Mock Exam',
    description: 'Completed your first mock exam.',
    earnedAt: new Date('2024-06-05'),
    points: 100,
    celebrationLevel: 'special',
  },
  {
    id: 'a3',
    type: 'improvement',
    title: 'Score Improvement',
    description: 'Improved your average by 10%.',
    earnedAt: new Date('2024-06-01'),
    points: 30,
    celebrationLevel: 'normal',
  },
];

const mockLeaderboard = [
  {
    rank: 1,
    studentName: 'Jane Doe',
    points: 1500,
    avatar: '',
    isCurrentUser: false,
    trend: 'up',
  },
  {
    rank: 2,
    studentName: 'Alex Johnson',
    points: 1240,
    avatar: '',
    isCurrentUser: true,
    trend: 'stable',
  },
  {
    rank: 3,
    studentName: 'Sam Lee',
    points: 1200,
    avatar: '',
    isCurrentUser: false,
    trend: 'down',
  },
];

const mockGoals = [
  {
    id: 'g1',
    title: 'Complete 20 Quizzes',
    description: 'Finish 20 quizzes this term.',
    targetValue: 20,
    currentValue: 12,
  },
  {
    id: 'g2',
    title: 'Maintain 7-day Streak',
    description: 'Take a quiz every day for a week.',
    targetValue: 7,
    currentValue: 6,
  },
];

function AchievementHeader({
  studentName,
  overallGrade,
  totalPoints,
  currentRank,
  totalStudents,
}: typeof mockHeader) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Welcome, {studentName}!</CardTitle>
        <CardDescription>
          Overall Grade: <span className="font-semibold">{overallGrade}</span>{' '}
          &bull; Total Points:{' '}
          <span className="font-semibold">{totalPoints}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Class Rank</span>
          <span className="text-2xl font-bold">
            #{currentRank}{' '}
            <span className="text-base font-normal">/ {totalStudents}</span>
          </span>
          <span className="text-xs text-muted-foreground">
            Keep going to reach the next level!
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function AchievementOverviewGrid({ stats }: { stats: typeof mockStats }) {
  return (
    <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {stats.map((s, i) => (
        <StatsCard
          key={i}
          title={s.title}
          value={s.value}
          description={s.description}
          icon={s.icon}
        />
      ))}
    </div>
  );
}

function BadgeCollection({
  badges,
  onBadgeClick,
}: {
  badges: typeof mockBadges;
  onBadgeClick: (badge: any) => void;
}) {
  const rarityColors: Record<string, string> = {
    common: 'border-gray-300',
    rare: 'border-yellow-400',
    epic: 'border-purple-500',
    legendary: 'border-blue-500',
  };
  return (
    <Card className="mb-8 bg-blue-50 dark:bg-blue-900/10">
      <CardHeader>
        <CardTitle>Badge Collection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <Card
              key={badge.id}
              className={`relative flex flex-col items-center border-2 cursor-pointer transition ${
                badge.earnedAt ? '' : 'opacity-50 grayscale'
              } ${rarityColors[badge.rarity]} bg-card dark:bg-gray-900/10`}
              tabIndex={0}
              aria-label={badge.name}
              onClick={() => onBadgeClick(badge)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onBadgeClick(badge);
              }}
            >
              <CardContent className="flex flex-col items-center gap-2 py-4">
                <span className="text-3xl">{badge.icon}</span>
                <span className="font-medium text-sm">{badge.name}</span>
                <Badge variant={badge.earnedAt ? 'default' : 'outline'}>
                  {badge.earnedAt ? 'Unlocked' : 'Locked'}
                </Badge>
                <Badge variant="secondary" className="capitalize">
                  {badge.rarity}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function BadgeDetailDialog({
  badge,
  open,
  onOpenChange,
}: {
  badge: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!badge) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogH>
          <DialogT>{badge.name}</DialogT>
          <DialogD>{badge.description}</DialogD>
        </DialogH>
        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl">{badge.icon}</span>
          <Badge variant={badge.earnedAt ? 'default' : 'outline'}>
            {badge.earnedAt ? 'Unlocked' : 'Locked'}
          </Badge>
          <Badge variant="secondary" className="capitalize">
            {badge.rarity}
          </Badge>
          <div className="text-xs text-muted-foreground mt-2">
            {badge.requirements}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {badge.earnedAt
              ? `Unlocked on ${badge.earnedAt.toLocaleDateString()}`
              : 'Locked'}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProgressCharts({ data }: { data: typeof mockProgressData }) {
  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart
              data={data.performanceOverTime}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#6366f1"
                strokeWidth={2}
                dot
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Subject Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={data.subjectBreakdown}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="averageScore" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Quiz Completion by Difficulty</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data.difficultyProgress}
                dataKey="successRate"
                nameKey="difficulty"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label
              >
                {data.difficultyProgress.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={['#6366f1', '#f59e42', '#ef4444'][idx % 3]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Study Time vs. Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart
              data={data.performanceOverTime}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function StreakTracker({ data }: { data: typeof mockStreakData }) {
  return (
    <Card className="mb-8 bg-green-50 dark:bg-green-900/10">
      <CardHeader>
        <CardTitle>Streak & Consistency</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6 items-center mb-2">
          <div className="flex flex-col items-center">
            <Flame className="w-8 h-8 text-orange-500" />
            <span className="text-lg font-bold">{data.currentStreak}</span>
            <span className="text-xs text-muted-foreground">
              Current Streak
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Flame className="w-8 h-8 text-orange-400" />
            <span className="text-lg font-bold">{data.longestStreak}</span>
            <span className="text-xs text-muted-foreground">
              Longest Streak
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Star className="w-8 h-8 text-blue-500" />
            <span className="text-lg font-bold">
              {data.monthlyGoal.achieved}/{data.monthlyGoal.target}
            </span>
            <span className="text-xs text-muted-foreground">Monthly Goal</span>
          </div>
        </div>
        <div className="mb-2">
          <Progress value={data.monthlyGoal.percentage} className="h-2" />
          <span className="text-xs text-muted-foreground">
            {data.monthlyGoal.percentage}% of monthly goal achieved
          </span>
        </div>
        {/* TODO: Calendar heatmap for daily activity */}
      </CardContent>
    </Card>
  );
}

function RecentAchievements({
  achievements,
}: {
  achievements: typeof mockRecentAchievements;
}) {
  return (
    <Card className="mb-8 bg-yellow-50 dark:bg-yellow-900/10">
      <CardHeader>
        <CardTitle>Recent Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`rounded p-3 flex items-center gap-4 bg-muted ${
                a.celebrationLevel === 'epic'
                  ? 'border-2 border-yellow-400'
                  : ''
              }`}
            >
              <span className="text-xl">
                {a.type === 'badge'
                  ? '🏅'
                  : a.type === 'milestone'
                  ? '🎯'
                  : '📈'}
              </span>
              <div className="flex-1">
                <div className="font-medium">{a.title}</div>
                <div className="text-xs text-muted-foreground">
                  {a.description}
                </div>
              </div>
              <Badge variant="secondary">+{a.points} pts</Badge>
              {/* TODO: Animated celebration for new achievements */}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function Leaderboard({ entries }: { entries: typeof mockLeaderboard }) {
  const trendIcon = (trend: string) =>
    trend === 'up' ? (
      <ArrowUp className="w-4 h-4 text-green-500" />
    ) : trend === 'down' ? (
      <ArrowDown className="w-4 h-4 text-red-500" />
    ) : (
      <Minus className="w-4 h-4 text-muted-foreground" />
    );
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-2 text-left">Rank</th>
                <th className="p-2 text-left">Student</th>
                <th className="p-2 text-left">Points</th>
                <th className="p-2 text-left">Trend</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr
                  key={e.rank}
                  className={e.isCurrentUser ? 'bg-primary/10 font-bold' : ''}
                >
                  <td className="p-2">#{e.rank}</td>
                  <td className="p-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {e.studentName}
                  </td>
                  <td className="p-2">{e.points}</td>
                  <td className="p-2">{trendIcon(e.trend)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function GoalTracker({ goals }: { goals: typeof mockGoals }) {
  return (
    <Card className="mb-8 bg-purple-50 dark:bg-purple-900/10">
      <CardHeader>
        <CardTitle>Goals & Challenges</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          {goals.map((g) => (
            <Card
              key={g.id}
              className="min-w-[180px] flex-1 flex flex-col items-center p-4"
            >
              <CardTitle className="text-sm font-medium mb-1">
                {g.title}
              </CardTitle>
              <CardDescription className="mb-2">
                {g.description}
              </CardDescription>
              <Progress
                value={Math.round((g.currentValue / g.targetValue) * 100)}
                className="h-2 mb-1"
              />
              <span className="text-xs text-muted-foreground">
                {g.currentValue} / {g.targetValue}
              </span>
              {/* TODO: Add React Hook Form for new goal setting */}
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function StudentAchievementsPage() {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner text="Loading your dashboard..." />;
  if (!user) return null;
  const [selectedBadge, setSelectedBadge] = useState<any>(null);
  const [badgeDialogOpen, setBadgeDialogOpen] = useState(false);
  // TODO: Add celebratory animation/modal for new achievements
  // TODO: Add social sharing for achievements
  // TODO: Connect to backend for real data
  return (
    <DashboardLayout pageTitle="Achievements">
      <div className="space-y-6 mx-auto">
        <AchievementHeader {...mockHeader} />
        <AchievementOverviewGrid stats={mockStats} />
        <BadgeCollection
          badges={mockBadges}
          onBadgeClick={(badge) => {
            setSelectedBadge(badge);
            setBadgeDialogOpen(true);
          }}
        />
        <BadgeDetailDialog
          badge={selectedBadge}
          open={badgeDialogOpen}
          onOpenChange={setBadgeDialogOpen}
        />
        <ProgressCharts data={mockProgressData} />
        <StreakTracker data={mockStreakData} />
        <RecentAchievements achievements={mockRecentAchievements} />
        <Leaderboard entries={mockLeaderboard} />
        <GoalTracker goals={mockGoals} />
      </div>
    </DashboardLayout>
  );
}
