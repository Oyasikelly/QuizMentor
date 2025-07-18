import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get('studentId');
  if (!studentId) {
    return NextResponse.json({ error: 'Missing studentId' }, { status: 400 });
  }

  try {
    const attempts = await prisma.quizAttempt.findMany({
      where: { studentId },
      include: { quiz: true, answers: true },
      orderBy: { createdAt: 'asc' },
    });

    const totalAttempts = attempts.length;
    const scores = attempts.map((a) => a.score ?? 0);
    const averageScore = scores.length
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : 0;
    const totalPoints = scores.reduce((a, b) => a + b, 0);

    // Calculate study streak (max consecutive days with attempts)
    const dates = Array.from(
      new Set(attempts.map((a) => a.createdAt.toISOString().slice(0, 10)))
    ).sort();
    let streak = 0,
      maxStreak = 0,
      prevDate = null;
    for (const date of dates) {
      if (
        prevDate &&
        new Date(date).getTime() - new Date(prevDate).getTime() === 86400000
      ) {
        streak++;
      } else {
        streak = 1;
      }
      maxStreak = Math.max(maxStreak, streak);
      prevDate = date;
    }

    // List of completed quizzes (one per quiz, latest attempt)
    const completedQuizzesMap = new Map();
    for (const attempt of attempts) {
      if (attempt.completedAt && attempt.quiz) {
        // Only keep the latest attempt per quiz
        const prev = completedQuizzesMap.get(attempt.quiz.id);
        if (
          !prev ||
          new Date(attempt.completedAt) > new Date(prev.completedAt)
        ) {
          completedQuizzesMap.set(attempt.quiz.id, {
            id: attempt.quiz.id,
            title: attempt.quiz.title,
            score: attempt.score,
            totalPoints: attempt.totalPoints,
            completedAt: attempt.completedAt,
          });
        }
      }
    }
    const completedQuizzes = Array.from(completedQuizzesMap.values());

    return NextResponse.json({
      totalAttempts,
      averageScore,
      totalPoints,
      studyStreak: maxStreak,
      completedQuizzes,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
