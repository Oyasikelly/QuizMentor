'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader as DialogH,
  DialogTitle as DialogT,
  DialogDescription as DialogD,
} from '@/components/ui/dialog';
import {
  Flame,
  Award,
  CheckCircle,
  TrendingUp,
  BookOpen,
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
} from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { FullPageSpinner } from '@/components/shared/loading-spinner';

// Mock data types for TypeScript
type MockStats = {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
};

type MockProgressData = {
  performanceOverTime: Array<{ date: string; score: number; subject: string }>;
  subjectBreakdown: Array<{
    subject: string;
    averageScore: number;
    quizCount: number;
  }>;
  difficultyProgress: Array<{ difficulty: string; successRate: number }>;
};

type MockStreakData = {
  currentStreak: number;
  longestStreak: number;
  weeklyActivity: Array<{
    date: string;
    quizzesCompleted: number;
    studyTime: number;
  }>;
  monthlyGoal: { target: number; achieved: number; percentage: number };
};

type MockRecentAchievements = Array<{
  id: string;
  type: string;
  title: string;
  description: string;
  earnedAt: Date;
  points: number;
  celebrationLevel: string;
}>;

type MockLeaderboard = Array<{
  rank: number;
  studentName: string;
  points: number;
  avatar: string;
  isCurrentUser: boolean;
  trend: string;
}>;

function AchievementHeader({
  studentName,
  overallGrade,
  totalPoints,
  currentRank,
  totalStudents,
}: {
  studentName: string;
  overallGrade: string;
  totalPoints: number;
  currentRank: number;
  totalStudents: number;
}) {
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

function AchievementOverviewGrid({ stats }: { stats: MockStats[] }) {
  console.log(stats);
  return (
    <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {stats.map((s: MockStats, i: number) => (
        <Card key={i} className="p-4">
          <div className="flex items-center space-x-2">
            <s.icon className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{s.title}</p>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  earnedAt: Date | null;
  requirements: string;
  rarity: string;
};

function BadgeCollection({
  badges,
  onBadgeClick,
}: {
  badges: Badge[];
  onBadgeClick: (badge: Badge) => void;
}) {
  const rarityColors: Record<string, string> = {
    common: 'border-gray-300',
    rare: 'border-yellow-400',
    epic: 'border-purple-500',
    legendary: 'border-blue-500',
  };

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'star':
        return <Star className="w-8 h-8" />;
      case 'award':
        return <Award className="w-8 h-8" />;
      case 'flame':
        return <Flame className="w-8 h-8" />;
      case 'trending-up':
        return <TrendingUp className="w-8 h-8" />;
      default:
        return <CheckCircle className="w-8 h-8" />;
    }
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
                <div className="text-3xl text-yellow-500">
                  {getBadgeIcon(badge.icon)}
                </div>
                <span className="font-medium text-sm text-center">
                  {badge.name}
                </span>
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
  badge: Badge | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!badge) return null;

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'star':
        return <Star className="w-12 h-12" />;
      case 'award':
        return <Award className="w-12 h-12" />;
      case 'flame':
        return <Flame className="w-12 h-12" />;
      case 'trending-up':
        return <TrendingUp className="w-12 h-12" />;
      default:
        return <CheckCircle className="w-12 h-12" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogH>
          <DialogT>{badge.name}</DialogT>
          <DialogD>{badge.description}</DialogD>
        </DialogH>
        <div className="flex flex-col items-center gap-2">
          <div className="text-4xl text-yellow-500">
            {getBadgeIcon(badge.icon)}
          </div>
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
              ? `Unlocked on ${new Date(badge.earnedAt).toLocaleDateString()}`
              : 'Locked'}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProgressCharts({ data }: { data: MockProgressData }) {
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

function StreakTracker({ data }: { data: MockStreakData }) {
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
  achievements: MockRecentAchievements;
}) {
  return (
    <Card className="mb-8 bg-yellow-50 dark:bg-yellow-900/10">
      <CardHeader>
        <CardTitle>Recent Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {achievements.map((a: MockRecentAchievements[0]) => (
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

function Leaderboard({ entries }: { entries: MockLeaderboard }) {
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
              {entries.map((e: MockLeaderboard[0]) => (
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

function GoalTracker({
  goals,
}: {
  goals: Array<{
    id: string;
    title: string;
    description: string;
    targetValue: number;
    currentValue: number;
  }>;
}) {
  if (!goals || goals.length === 0) {
    return null;
  }

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

type HeaderData = {
  studentName: string;
  overallGrade: string;
  totalPoints: number;
  currentRank: number;
  totalStudents: number;
};

type CompletedQuiz = {
  id: string;
  title: string;
  score: number;
  rank: number;
  totalTakers: number;
};

type Goal = {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
};

export default function StudentAchievementsPage() {
  const { user, loading } = useAuth();
  const [header, setHeader] = useState<HeaderData | null>(null);
  const [stats, setStats] = useState<MockStats[] | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [achievements, setAchievements] = useState<MockRecentAchievements>([]);
  const [progressData, setProgressData] = useState<MockProgressData | null>(
    null
  );
  const [streakData, setStreakData] = useState<MockStreakData | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [badgeDialogOpen, setBadgeDialogOpen] = useState(false);
  const [completedQuizzes, setCompletedQuizzes] = useState<CompletedQuiz[]>([]);
  const [leaderboard, setLeaderboard] = useState<MockLeaderboard>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  // TODO: Add celebratory animation/modal for new achievements
  // TODO: Add social sharing for achievements

  useEffect(() => {
    if (!user) return;
    // Fetch stats
    fetch(`/api/attempts/stats?studentId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setStats([
          {
            title: 'Quizzes Completed',
            value: data.totalAttempts,
            icon: BookOpen,
            description: 'Total quizzes finished.',
          },
          {
            title: 'Average Score',
            value: `${Math.round(data.averageScore)}%`,
            icon: TrendingUp,
            description: 'Across all quizzes.',
          },
          {
            title: 'Perfect Scores',
            value:
              data.completedQuizzes?.filter(
                (q: CompletedQuiz) => q.score === 100
              ).length || 0,
            icon: Award,
            description: '100% scores achieved.',
          },
          {
            title: 'Improvement Rate',
            value:
              (data.improvementRate >= 0 ? '+' : '') +
              data.improvementRate +
              '%',
            icon: TrendingUp,
            description: 'Compared to first quiz.',
          },
          {
            title: 'Current Streak',
            value: data.studyStreak,
            icon: Flame,
            description: 'Days in a row.',
          },
          {
            title: 'Badges Earned',
            value: data.badges, // Will update after fetching badges
            icon: Star,
            description: 'Total badges unlocked.',
          },
        ]);
        setHeader({
          studentName: user.name || '',
          overallGrade: 'B+', // TODO: Calculate grade
          totalPoints: data.totalPoints || 0,
          currentRank: data.departmentRank || 0,
          totalStudents: data.totalStudentsInDepartment || 0,
        });

        // Update progressData and streakData with real data
        if (data.progressData) setProgressData(data.progressData);
        if (data.streakData) setStreakData(data.streakData);

        // Update progressData with real quiz data including ranks
        if (data.completedQuizzes) {
          setCompletedQuizzes(data.completedQuizzes);
        }
        if (data.leaderboard) setLeaderboard(data.leaderboard);
        if (data.goals) setGoals(data.goals);
      });
    // Fetch achievements and badges
    fetch(`/api/student/achievements?studentId=${user.id}`)
      .then((res) => res.json())
      .then((achvData) => {
        setAchievements(achvData.achievements || []);
        setBadges(achvData.badges || []);
        setStats((prevStats: MockStats[] | null) =>
          prevStats
            ? prevStats.map((s) =>
                s.title === 'Badges Earned'
                  ? { ...s, value: achvData.badges?.length || 0 }
                  : s
              )
            : prevStats
        );
      });
  }, [user]);

  if (loading || !user || !stats || !header)
    return <FullPageSpinner text="Loading your dashboard..." />;

  return (
    <DashboardLayout pageTitle="Achievements">
      <div className="space-y-6 mx-auto">
        <AchievementHeader {...header} />
        <AchievementOverviewGrid stats={stats} />
        <BadgeCollection
          badges={badges}
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
        <QuizRankList completedQuizzes={completedQuizzes} />
        {progressData ? (
          <ProgressCharts data={progressData} />
        ) : (
          <div>Loading progress...</div>
        )}
        {streakData ? (
          <StreakTracker data={streakData} />
        ) : (
          <div>Loading streak...</div>
        )}
        <RecentAchievements achievements={achievements} />
        {leaderboard && leaderboard.length > 0 ? (
          <Leaderboard entries={leaderboard} />
        ) : (
          <div>No leaderboard data yet.</div>
        )}
        {goals && goals.length > 0 ? (
          <GoalTracker goals={goals} />
        ) : (
          <div>No goals data yet.</div>
        )}
      </div>
    </DashboardLayout>
  );
}

function QuizRankList({
  completedQuizzes,
}: {
  completedQuizzes: Array<{
    id: string;
    title: string;
    score: number;
    rank: number;
    totalTakers: number;
  }>;
}) {
  if (!completedQuizzes || completedQuizzes.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Quiz Ranks</CardTitle>
        <CardDescription>
          Your rank for each quiz within your department.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {completedQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted"
            >
              <div className="flex-1">
                <p className="font-semibold">{quiz.title}</p>
                <p className="text-sm text-muted-foreground">
                  Score: <span className="font-bold">{quiz.score}%</span>
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  #{quiz.rank}{' '}
                  <span className="text-sm text-muted-foreground">
                    / {quiz.totalTakers}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">Your Rank</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
