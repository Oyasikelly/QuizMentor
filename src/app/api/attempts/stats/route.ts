import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get('studentId');
  if (!studentId) {
    return NextResponse.json({ error: 'Missing studentId' }, { status: 400 });
  }

  try {
    // Get student's department (unitId)
    const studentUser = await prisma.user.findUnique({
      where: { id: studentId },
      select: { unitId: true, organizationId: true },
    });
    if (!studentUser || !studentUser.unitId) {
      return NextResponse.json(
        { error: 'Student or department not found' },
        { status: 404 }
      );
    }

    // --- Overall Department Rank (based on total score) ---
    const studentsInDept = await prisma.user.findMany({
      where: { unitId: studentUser.unitId, role: 'STUDENT' },
      select: { id: true },
    });
    const studentIdsInDept = studentsInDept.map((s: { id: string }) => s.id);

    const allDeptAttempts = await prisma.quizAttempt.findMany({
      where: {
        studentId: { in: studentIdsInDept },
        completedAt: { not: null },
      },
      select: { studentId: true, score: true },
    });

    const studentTotalScores: Record<string, number> = {};
    for (const attempt of allDeptAttempts) {
      if (!studentTotalScores[attempt.studentId]) {
        studentTotalScores[attempt.studentId] = 0;
      }
      studentTotalScores[attempt.studentId] += attempt.score ?? 0;
    }

    const sortedStudents = Object.entries(studentTotalScores)
      .map(([id, totalScore]) => ({ id, totalScore }))
      .sort((a, b) => b.totalScore - a.totalScore);

    const departmentRank =
      sortedStudents.findIndex((s) => s.id === studentId) + 1;
    const totalStudentsInDepartment = sortedStudents.length;

    const attempts = await prisma.quizAttempt.findMany({
      where: {
        studentId,
        completedAt: { not: null },
      },
      include: {
        quiz: {
          include: {
            subject: true,
          },
        },
        answers: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const totalAttempts = attempts.length;
    const scores = attempts.map((a: { score?: number | null }) => a.score ?? 0);
    const averageScore = scores.length
      ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length
      : 0;
    const totalPoints = scores.reduce((a: number, b: number) => a + b, 0);

    // Calculate study streak (max consecutive days with attempts)
    const dates = Array.from(
      new Set(
        attempts.map((a: { createdAt: Date }) =>
          (a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt))
            .toISOString()
            .slice(0, 10)
        )
      )
    ).sort();
    let streak = 0,
      maxStreak = 0,
      prevDate: string | null = null;
    for (const date of dates) {
      if (
        prevDate &&
        new Date(date as string).getTime() - new Date(prevDate).getTime() ===
          86400000
      ) {
        streak++;
      } else {
        streak = 1;
      }
      maxStreak = Math.max(maxStreak, streak);
      prevDate = date as string;
    }

    // List of completed quizzes (one per quiz, latest attempt)
    const completedQuizzesMap = new Map();
    for (const attempt of attempts) {
      if (attempt.completedAt && attempt.quiz) {
        // Only keep the latest attempt per quiz
        const prev = completedQuizzesMap.get(attempt.quiz.id);
        if (
          !prev ||
          new Date(attempt.completedAt as Date) >
            new Date(prev.completedAt as Date)
        ) {
          completedQuizzesMap.set(attempt.quiz.id, {
            id: attempt.quiz.id,
            title: attempt.quiz.title,
            score: attempt.score,
            totalPoints: attempt.totalPoints,
            completedAt: attempt.completedAt,
            subject: attempt.quiz.subject
              ? {
                  id: attempt.quiz.subject.id,
                  name: attempt.quiz.subject.name,
                }
              : null,
          });
        }
      }
    }

    // --- Individual Quiz Ranks ---
    const studentQuizIds = Array.from(completedQuizzesMap.keys());
    if (studentQuizIds.length > 0) {
      const allAttemptsForStudentQuizzes = await prisma.quizAttempt.findMany({
        where: {
          quizId: { in: studentQuizIds },
          completedAt: { not: null },
          student: { unitId: studentUser.unitId }, // Filter by department
        },
        select: { quizId: true, studentId: true, score: true },
      });

      const attemptsByQuiz = allAttemptsForStudentQuizzes.reduce(
        (acc, attempt) => {
          const key = attempt.quizId as string;
          if (!acc[key]) acc[key] = [];
          acc[key].push(attempt);
          return acc;
        },
        {} as Record<string, typeof allAttemptsForStudentQuizzes>
      );

      for (const quizId in attemptsByQuiz) {
        const sortedAttempts = attemptsByQuiz[quizId].sort(
          (a: { score?: number | null }, b: { score?: number | null }) =>
            (b.score ?? 0) - (a.score ?? 0)
        );
        const rank =
          sortedAttempts.findIndex(
            (a: { studentId: string }) => a.studentId === studentId
          ) + 1;
        const totalTakers = sortedAttempts.length;

        if (completedQuizzesMap.has(quizId)) {
          const quizData = completedQuizzesMap.get(quizId);
          quizData.rank = rank;
          quizData.totalTakers = totalTakers;
          completedQuizzesMap.set(quizId, quizData);
        }
      }
    }

    const completedQuizzesWithRanks = Array.from(completedQuizzesMap.values());

    // Get unique subjects studied
    const subjectsMap = new Map();
    attempts
      .filter(
        (attempt: { quiz: { subject: { id: string; name: string } } }) =>
          attempt.quiz.subject
      )
      .forEach(
        (attempt: { quiz: { subject: { id: string; name: string } } }) => {
          const subject = attempt.quiz.subject!;
          if (!subjectsMap.has(subject.id)) {
            subjectsMap.set(subject.id, {
              id: subject.id,
              name: subject.name,
            });
          }
        }
      );
    const subjectsStudied = Array.from(subjectsMap.values());

    // Get the student's user and organization
    const user = await prisma.user.findUnique({
      where: { id: studentId },
      select: { organizationId: true },
    });
    if (!user) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    // Get all students in the same organization
    const students = await prisma.user.findMany({
      where: { organizationId: user.organizationId, role: 'STUDENT' },
      select: { id: true },
    });
    const studentIds = students.map((s: { id: string }) => s.id);
    // Get all quiz attempts for these students
    const allAttempts = await prisma.quizAttempt.findMany({
      where: {
        studentId: { in: studentIds },
        completedAt: { not: null },
      },
    });
    // Calculate average score for each student
    const studentScores: Record<string, number[]> = {};
    for (const attempt of allAttempts) {
      if (!studentScores[attempt.studentId])
        studentScores[attempt.studentId] = [];
      if (typeof attempt.score === 'number')
        studentScores[attempt.studentId].push(attempt.score);
    }
    // const studentAverages = Object.entries(studentScores).map(
    //   ([id, scores]) => ({
    //     id,
    //     avg: scores.length
    //       ? scores.reduce((a, b) => a + b, 0) / scores.length
    //       : 0,
    //   })
    // );
    // Find this student's average
    // const yourAvgObj = studentAverages.find((s) => s.id === studentId);
    // const yourAverage = yourAvgObj ? yourAvgObj.avg : 0;
    // Calculate class rank
    // const sorted = studentAverages.sort((a, b) => b.avg - a.avg);
    // const yourRank = sorted.findIndex((s) => s.id === studentId) + 1;
    // const totalStudents = studentAverages.length;
    // Calculate improvement rate (first vs last quiz)
    let improvementRate = 0;
    if (scores.length >= 2) {
      const first = scores[0];
      const last = scores[scores.length - 1];
      if (first > 0) {
        improvementRate = Math.round(((last - first) / first) * 100);
      }
    }

    // --- Progress Chart Data ---
    // Performance over time (date, score, subject)
    const performanceOverTime = attempts.map(
      (a: {
        completedAt: Date | null;
        score: number | null;
        quiz: { subject: { name: string } };
      }) => ({
        date: a.completedAt?.toISOString().slice(0, 10),
        score: a.score,
        subject: a.quiz?.subject?.name || 'General',
      })
    );

    // Subject breakdown (average score and quiz count per subject)
    const subjectStats: Record<string, { name: string; scores: number[] }> = {};
    for (const a of attempts) {
      const subject = a.quiz?.subject;
      if (!subject) continue;
      if (!subjectStats[subject.id])
        subjectStats[subject.id] = { name: subject.name, scores: [] };
      if (typeof a.score === 'number')
        subjectStats[subject.id].scores.push(a.score);
    }
    const subjectBreakdown = Object.values(subjectStats).map(
      (s: { name: string; scores: number[] }) => ({
        subject: s.name,
        averageScore: s.scores.length
          ? Math.round(
              s.scores.reduce((a: number, b: number) => a + b, 0) /
                s.scores.length
            )
          : 0,
        quizCount: s.scores.length,
      })
    );

    // Difficulty progress (dummy, as difficulty is not tracked)
    // You can replace this with real logic if you track question/quiz difficulty
    const difficultyProgress = [
      { difficulty: 'Easy', successRate: 95 },
      { difficulty: 'Medium', successRate: 80 },
      { difficulty: 'Hard', successRate: 60 },
    ];

    const progressData = {
      performanceOverTime,
      subjectBreakdown,
      difficultyProgress,
    };

    // --- Streak Data ---
    const streakData = {
      currentStreak: streak,
      longestStreak: maxStreak,
      weeklyActivity: dates.slice(-7).map((date: string) => ({
        date,
        quizzesCompleted: attempts.filter(
          (a: { completedAt: Date | null }) =>
            a.completedAt?.toISOString().slice(0, 10) === date
        ).length,
        studyTime: 0, // Add if you track time
      })),
      monthlyGoal: {
        target: 20,
        achieved: attempts.filter((a) => {
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
    };

    // --- Leaderboard Data (department) ---
    // Get student names for leaderboard
    const studentNamesMap: Record<string, string> = {};
    const studentUsers = await prisma.user.findMany({
      where: { id: { in: studentIdsInDept } },
      select: { id: true, name: true },
    });
    for (const s of studentUsers) {
      studentNamesMap[s.id] = s.name || 'Student';
    }
    const leaderboard = sortedStudents.map(
      (s: { id: string; totalScore: number }, idx: number) => ({
        rank: idx + 1,
        studentName: studentNamesMap[s.id] || 'Student',
        points: s.totalScore,
        isCurrentUser: s.id === studentId,
      })
    );

    // --- Goals Data ---
    const goals = [
      {
        id: 'g1',
        title: 'Complete 20 Quizzes',
        description: 'Finish 20 quizzes this term.',
        targetValue: 20,
        currentValue: totalAttempts,
      },
      {
        id: 'g2',
        title: 'Maintain 7-day Streak',
        description: 'Take a quiz every day for a week.',
        targetValue: 7,
        currentValue: streak,
      },
    ];

    return NextResponse.json({
      totalAttempts,
      averageScore,
      totalPoints,
      studyStreak: maxStreak,
      completedQuizzes: completedQuizzesWithRanks,
      subjectsStudied,
      departmentRank: departmentRank || 0,
      totalStudentsInDepartment,
      improvementRate,
      progressData,
      streakData,
      leaderboard,
      goals,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
