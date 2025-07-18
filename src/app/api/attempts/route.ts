import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quizId, studentId, answers, status, timeSpent } = body;
    if (!quizId || !studentId) {
      return NextResponse.json(
        { error: 'Missing quizId or studentId.' },
        { status: 400 }
      );
    }
    // Always create a new attempt for testing/multiple attempts
    // --- LIMIT ATTEMPTS LOGIC (uncomment to enable in production) ---
    // const maxAttempts = 3; // Example limit
    // const previousAttempts = await prisma.quizAttempt.count({ where: { quizId, studentId } });
    // if (previousAttempts >= maxAttempts) {
    //   return NextResponse.json({ error: `You have reached the maximum number of attempts (${maxAttempts}) for this quiz.` }, { status: 403 });
    // }
    // --- END LIMIT ATTEMPTS LOGIC ---
    // Find or create an in-progress attempt
    let attempt = await prisma.quizAttempt.findFirst({
      where: { quizId, studentId },
    });
    if (attempt) {
      // Only update timeSpent (do NOT update answers)
      attempt = await prisma.quizAttempt.update({
        where: { id: attempt.id },
        data: { timeSpent },
      });
    } else {
      // Fetch the quiz to get organizationId
      const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
      if (!quiz) {
        return NextResponse.json({ error: 'Quiz not found.' }, { status: 404 });
      }
      attempt = await prisma.quizAttempt.create({
        data: {
          quiz: { connect: { id: quizId } },
          student: { connect: { id: studentId } },
          organization: { connect: { id: quiz.organizationId } },
          timeSpent: timeSpent || 0,
        },
      });
    }
    return NextResponse.json({ attempt });
  } catch (error) {
    console.error('ATTEMPT SAVE ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to save attempt.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('quizId');
    const studentId = searchParams.get('studentId');
    if (!quizId || !studentId) {
      return NextResponse.json(
        { error: 'Missing quizId or studentId.' },
        { status: 400 }
      );
    }
    // Find the latest completed attempt for this student and quiz
    const attempt = await prisma.quizAttempt.findFirst({
      where: {
        quizId,
        studentId,
        completedAt: { not: null },
      },
      orderBy: { completedAt: 'desc' },
    });
    if (!attempt) {
      return NextResponse.json(
        { error: 'No completed attempt found.' },
        { status: 404 }
      );
    }
    // Fetch all answers for this attempt, including question and correct answer
    const answers = await prisma.quizAnswer.findMany({
      where: { attemptId: attempt.id },
      include: {
        question: true,
      },
    });
    // Format for review
    const review = answers.map((a) => ({
      questionId: a.questionId,
      question: a.question.text,
      correctAnswer: a.question.correctAnswer,
      userAnswer: a.answer,
      isCorrect: a.isCorrect,
      pointsEarned: a.pointsEarned,
      options: a.question.options,
    }));
    return NextResponse.json({ attempt, review });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch attempt.' },
      { status: 500 }
    );
  }
}

// GET /api/attempts/stats?studentId=...
export async function GET_stats(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    if (!studentId) {
      return NextResponse.json(
        { error: 'Missing studentId.' },
        { status: 400 }
      );
    }
    // Fetch all completed attempts for this student
    const attempts = await prisma.quizAttempt.findMany({
      where: { studentId, completedAt: { not: null } },
    });
    const quizzesTaken = attempts.length;
    const totalPoints = attempts.reduce((sum, a) => sum + (a.score || 0), 0);
    const maxPoints = attempts.reduce(
      (sum, a) => sum + (a.totalPoints || 0),
      0
    );
    const averageScore =
      maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;
    // Dummy study streak (implement real logic if needed)
    const studyStreak = 1;
    return NextResponse.json({
      quizzesTaken,
      averageScore,
      studyStreak,
      totalPoints,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats.' },
      { status: 500 }
    );
  }
}
