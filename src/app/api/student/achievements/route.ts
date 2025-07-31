import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');
  if (!studentId) {
    return NextResponse.json({ error: 'Missing studentId' }, { status: 400 });
  }

  // Fetch all quiz attempts for the student
  const attempts = await prisma.quizAttempt.findMany({
    where: { studentId, completedAt: { not: null } },
    include: {
      quiz: { include: { subject: true } },
    },
    orderBy: { completedAt: 'asc' },
  });

  // Calculate streaks
  const dates = Array.from(
    new Set(
      attempts
        .map((a: { completedAt: Date | null }) =>
          a.completedAt?.toISOString().slice(0, 10)
        )
        .filter((d: string | undefined): d is string => !!d)
    )
  ).sort();
  let streak = 0,
    maxStreak = 0,
    prevDate: string | null = null;
  for (const date of dates) {
    if (
      prevDate !== null &&
      new Date(date).getTime() - new Date(prevDate).getTime() === 86400000
    ) {
      streak++;
    } else {
      streak = 1;
    }
    maxStreak = Math.max(maxStreak, streak);
    prevDate = date;
  }

  // Calculate achievements and badges
  const achievements = [];
  const badges = [];
  // First quiz completed
  if (attempts.length > 0) {
    achievements.push({
      id: 'first-quiz',
      type: 'milestone',
      title: 'First Quiz',
      description: 'Completed your first quiz!',
      earnedAt: attempts[0].completedAt,
      points: 10,
      celebrationLevel: 'special',
    });
    badges.push({
      id: 'first-quiz-badge',
      name: 'First Quiz',
      description: 'Completed your first quiz',
      icon: 'star',
      category: 'milestone',
      earnedAt: attempts[0].completedAt,
      requirements: 'Complete your first quiz',
      rarity: 'common',
    });
  }
  // 10 quizzes completed
  if (attempts.length >= 10) {
    achievements.push({
      id: 'ten-quizzes',
      type: 'milestone',
      title: 'Quiz Veteran',
      description: 'Completed 10 quizzes!',
      earnedAt: attempts[9]?.completedAt,
      points: 20,
      celebrationLevel: 'normal',
    });
    badges.push({
      id: 'ten-quizzes-badge',
      name: 'Quiz Veteran',
      description: 'Completed 10 quizzes',
      icon: 'award',
      category: 'milestone',
      earnedAt: attempts[9]?.completedAt,
      requirements: 'Complete 10 quizzes',
      rarity: 'common',
    });
  }
  // 7-day streak
  if (maxStreak >= 7) {
    achievements.push({
      id: 'seven-day-streak',
      type: 'consistency',
      title: 'Streak Master',
      description: 'Maintain a 7-day quiz streak!',
      earnedAt: attempts[attempts.length - 1]?.completedAt,
      points: 30,
      celebrationLevel: 'special',
    });
    badges.push({
      id: 'seven-day-streak-badge',
      name: 'Streak Master',
      description: 'Maintain a 7-day quiz streak',
      icon: 'flame',
      category: 'consistency',
      earnedAt: attempts[attempts.length - 1]?.completedAt,
      requirements: 'Complete a quiz every day for 7 days',
      rarity: 'epic',
    });
  }
  // Perfect score badge
  const perfect = attempts.find(
    (a) => a.score === a.totalPoints && a.totalPoints > 0
  );
  if (perfect) {
    badges.push({
      id: 'perfect-score',
      name: 'Perfect Score',
      description: 'Score 100% on a quiz',
      icon: 'star',
      category: 'performance',
      earnedAt: perfect.completedAt,
      requirements: 'Score 100% on any quiz',
      rarity: 'rare',
    });
  }
  // Subject mastery (average >= 90 in a subject)
  const subjectScores: Record<string, { name: string; scores: number[] }> = {};
  for (const a of attempts) {
    const subject = a.quiz?.subject;
    if (!subject) continue;
    if (!subjectScores[subject.id])
      subjectScores[subject.id] = { name: subject.name, scores: [] };
    if (typeof a.score === 'number')
      subjectScores[subject.id].scores.push(a.score);
  }
  for (const subjId in subjectScores) {
    const subj = subjectScores[subjId];
    const avg = subj.scores.length
      ? subj.scores.reduce((a, b) => a + b, 0) / subj.scores.length
      : 0;
    if (avg >= 90) {
      achievements.push({
        id: `mastery-${subjId}`,
        type: 'mastery',
        title: `Mastered ${subj.name}`,
        description: `Achieved an average score of 90%+ in ${subj.name}`,
        earnedAt: attempts.find((a) => a.quiz?.subject?.id === subjId)
          ?.completedAt,
        points: 25,
        celebrationLevel: 'normal',
      });
      badges.push({
        id: `mastery-badge-${subjId}`,
        name: `Mastery: ${subj.name}`,
        description: `Average 90%+ in ${subj.name}`,
        icon: 'star',
        category: 'performance',
        earnedAt: attempts.find((a) => a.quiz?.subject?.id === subjId)
          ?.completedAt,
        requirements: `Average 90%+ in ${subj.name}`,
        rarity: 'rare',
      });
    }
  }
  // Improvement (last score at least 20% higher than first)
  if (attempts.length >= 2) {
    const first = attempts[0].score ?? 0;
    const last = attempts[attempts.length - 1].score ?? 0;
    if (first > 0 && last >= first * 1.2) {
      achievements.push({
        id: 'improvement',
        type: 'improvement',
        title: 'On the Rise',
        description: 'Improved your score by 20% or more!',
        earnedAt: attempts[attempts.length - 1].completedAt,
        points: 20,
        celebrationLevel: 'normal',
      });
      badges.push({
        id: 'improvement-badge',
        name: 'On the Rise',
        description: 'Improved your score by 20% or more',
        icon: 'trending-up',
        category: 'improvement',
        earnedAt: attempts[attempts.length - 1].completedAt,
        requirements: 'Improve your score by 20% or more',
        rarity: 'rare',
      });
    }
  }

  // Performance metrics (score over time)
  const performanceMetrics = attempts.map(
    (a: {
      completedAt: Date | null;
      score: number | null;
      quiz?: { subject?: { name: string } };
    }) => ({
      date: a.completedAt?.toISOString().slice(0, 10),
      score: a.score,
      subject: a.quiz?.subject?.name || 'General',
    })
  );

  // Streaks
  const streaks = [
    {
      currentStreak: streak,
      longestStreak: maxStreak,
      weeklyActivity: dates.map((date: string) => ({
        date,
        quizzesCompleted: attempts.filter(
          (a: { completedAt: Date | null }) =>
            a.completedAt?.toISOString().slice(0, 10) === date
        ).length,
        studyTime: 0, // Add if you track time
      })),
      monthlyGoal: {
        target: 20,
        achieved: attempts.filter((a: { completedAt: Date | null }) => {
          const d = a.completedAt;
          if (!d) return false;
          const now = new Date();
          return (
            d.getFullYear() === now.getFullYear() &&
            d.getMonth() === now.getMonth()
          );
        }).length,
        percentage: Math.round(
          (attempts.filter((a: { completedAt: Date | null }) => {
            const d = a.completedAt;
            if (!d) return false;
            const now = new Date();
            return (
              d.getFullYear() === now.getFullYear() &&
              d.getMonth() === now.getMonth()
            );
          }).length /
            20) *
            100
        ),
      },
    },
  ];

  return NextResponse.json({
    achievements,
    badges,
    streaks,
    performanceMetrics,
  });
}
