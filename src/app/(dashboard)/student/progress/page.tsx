'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

type MockStats = {
  quizzesTaken: number;
  averageScore: number;
  bestScore: number;
  streak: number;
  timeSpent: number;
  badges: number;
};

type MockPerformance = Array<{ date: string; score: number }>;

type MockQuizHistory = Array<{
  id: string;
  title: string;
  date: string;
  score: number;
  type: string;
}>;

type MockTopicMastery = Array<{ subject: string; percent: number }>;

function StudentProgressOverview({
  stats,
  onViewAchievements,
}: {
  stats: MockStats;
  onViewAchievements: () => void;
}) {
  console.log(stats);
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

function PerformanceChart({ data }: { data: MockPerformance }) {
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

function QuizHistoryTable({ history }: { history: MockQuizHistory }) {
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

function TopicMasteryBars({ mastery }: { mastery: MockTopicMastery }) {
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

type Achievement = {
  id: string;
  type: string;
  title: string;
  description: string;
  earnedAt?: Date;
  points: number;
  celebrationLevel: string;
  icon: React.ReactNode;
  name: string;
  label: string;
};

function AchievementsGallery({
  achievements,
}: {
  achievements: Achievement[];
}) {
  // Debug log
  console.log('AchievementsGallery:', achievements);

  if (!achievements || achievements.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Achievements & Badges</h2>
        <div className="text-muted-foreground pl-6 text-sm">
          No achievements yet. Keep learning to unlock badges!
        </div>
      </div>
    );
  }

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

function AchievementsModal({
  open,
  onClose,
  achievements,
  badges,
}: {
  open: boolean;
  onClose: () => void;
  achievements: Achievement[];
  badges: Badge[];
}) {
  if (!open) return null;

  // Helper function to get icon based on achievement type
  const getIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <Award className="w-6 h-6 text-yellow-500" />;
      case 'performance':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'consistency':
        return <Flame className="w-6 h-6 text-orange-500" />;
      case 'mastery':
        return <BookOpen className="w-6 h-6 text-blue-500" />;
      case 'improvement':
        return <TrendingUp className="w-6 h-6 text-purple-500" />;
      default:
        return <Award className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
      onClick={onClose}
    >
      <Card className="w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <button
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            &times;
          </button>
          <CardTitle>All Achievements & Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Achievements</h3>
            {achievements.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No achievements earned yet. Keep taking quizzes to earn
                achievements!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {achievements.map((achievement) => (
                  <Card key={achievement.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {getIcon(achievement.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">
                          {achievement.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {achievement.description}
                        </p>
                        {achievement.earnedAt && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Earned:{' '}
                            {new Date(
                              achievement.earnedAt
                            ).toLocaleDateString()}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {achievement.points} pts
                          </Badge>
                          {achievement.celebrationLevel === 'special' && (
                            <Badge
                              variant="outline"
                              className="text-xs text-orange-600"
                            >
                              Special
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold mb-2">Badges</h3>
            {badges.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No badges earned yet. Keep taking quizzes to earn badges!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {badges.map((badge) => (
                  <Card key={badge.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {getIcon(badge.category)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{badge.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {badge.description}
                        </p>
                        {badge.earnedAt && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Earned:{' '}
                            {new Date(badge.earnedAt).toLocaleDateString()}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {badge.rarity}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {badge.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PersonalizedRecommendations({
  recommendations,
}: {
  recommendations: { id: string; text: string }[];
}) {
  // Debug log
  console.log('PersonalizedRecommendations:', recommendations);

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">
          Personalized Recommendations
        </h2>
        <div className="text-muted-foreground pl-6 text-sm">
          No recommendations at this time.
        </div>
      </div>
    );
  }

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

type PeerComparison = {
  percentile: number;
  classAverage: number;
  yourAverage: number;
};

function PeerComparisonPanel({
  comparison,
}: {
  comparison: PeerComparison | null;
}) {
  if (!comparison) {
    return (
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Peer Comparison</h2>
        <div className="text-muted-foreground pl-6 text-sm">
          Peer comparison data not available.
        </div>
      </div>
    );
  }
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
  const [stats, setStats] = useState<MockStats | null>(null);
  const [performance, setPerformance] = useState<MockPerformance>([]);
  const [quizHistory, setQuizHistory] = useState<MockQuizHistory>([]);
  const [topicMastery, setTopicMastery] = useState<MockTopicMastery>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]); // TODO: Fetch from /api/achievements
  const [badges, setBadges] = useState<Badge[]>([]); // Store badges from API
  const [recommendations, setRecommendations] = useState<
    { id: string; text: string }[]
  >([]); // TODO: Fetch from /api/recommendations
  const [peerComparison, setPeerComparison] = useState<PeerComparison | null>(
    null
  ); // TODO: Fetch from /api/peer-comparison
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    fetch(`/api/attempts/stats?studentId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setStats({
          quizzesTaken: data.totalAttempts,
          averageScore: Math.round(data.averageScore),
          bestScore: data.completedQuizzes?.length
            ? Math.max(
                ...data.completedQuizzes.map(
                  (q: { score: number }) => q.score || 0
                )
              )
            : 0,
          streak: data.studyStreak,
          timeSpent: 0, // TODO: Add timeSpent if available from backend
          badges: 0, // TODO: Add badges if available from backend
        });
        setPerformance(
          data.completedQuizzes?.map(
            (q: { completedAt: string; score: number }) => ({
              date: q.completedAt?.slice(0, 10),
              score: q.score,
            })
          ) || []
        );
        setQuizHistory(
          data.completedQuizzes?.map(
            (q: {
              id: string;
              title: string;
              completedAt: string;
              score: number;
              subject?: { name: string };
            }) => ({
              id: q.id,
              title: q.title,
              date: q.completedAt?.slice(0, 10),
              score: q.score,
              type: q.subject?.name || 'Assignment',
            })
          ) || []
        );
        setTopicMastery(
          data.subjectsStudied?.map((s: { name: string }) => ({
            subject: s.name,
            percent: Math.floor(Math.random() * 41) + 60, // 60-100% random for now
          })) || []
        );
        // Fetch achievements, badges, streaks
        fetch(`/api/student/achievements?studentId=${user.id}`)
          .then((res) => res.json())
          .then((achvData) => {
            setAchievements(achvData.achievements || []);
            setBadges(achvData.badges || []); // Store badges
            // Update stats with real badges count
            setStats((prevStats: MockStats | null) =>
              prevStats
                ? {
                    ...prevStats,
                    badges: achvData.badges?.length || 0,
                  }
                : null
            );
            // Fetch peer comparison
            fetch(`/api/student/peer-comparison?studentId=${user.id}`)
              .then((res) => res.json())
              .then((peerData) => {
                setPeerComparison(peerData);
                // Fetch recommendations
                fetch(`/api/student/recommendations?studentId=${user.id}`)
                  .then((res) => res.json())
                  .then((recData) => {
                    setRecommendations(recData.recommendations || []);
                    setIsLoading(false);
                  })
                  .catch(() => {
                    setRecommendations([]);
                    setIsLoading(false);
                  });
              })
              .catch(() => {
                setPeerComparison(null);
                setIsLoading(false);
              });
          })
          .catch(() => {
            setAchievements([]);
            setIsLoading(false);
          });
      })
      .catch(() => {
        setError('Failed to load progress data.');
        setIsLoading(false);
      });
  }, [user]);

  if (loading || isLoading)
    return <FullPageSpinner text="Loading your dashboard..." />;
  if (!user) return null;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  console.log(achievements);
  return (
    <DashboardLayout pageTitle="Progress">
      <div className="space-y-6 mx-auto">
        {stats && (
          <StudentProgressOverview
            stats={stats}
            onViewAchievements={() => setAchievementsOpen(true)}
          />
        )}
        <PerformanceChart data={performance} />
        <QuizHistoryTable history={quizHistory} />
        <TopicMasteryBars mastery={topicMastery} />
        <AchievementsGallery achievements={achievements} />
        <PersonalizedRecommendations recommendations={recommendations} />
        <PeerComparisonPanel comparison={peerComparison} />
        <AchievementsModal
          open={achievementsOpen}
          onClose={() => setAchievementsOpen(false)}
          achievements={achievements}
          badges={badges}
        />
        {/* Debug info */}
        <div className="hidden">
          <p>achievementsOpen: {achievementsOpen.toString()}</p>
          <p>achievements count: {achievements.length}</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
