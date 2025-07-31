import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quizId, studentId /*, answers, status */, timeSpent } = body;
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
  } catch {
    console.error('ATTEMPT SAVE ERROR: Unknown error');
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
    const review = answers.map((a: unknown) => ({
      questionId: (a as { questionId: string }).questionId,
      question: (a as { question: { text: string } }).question.text,
      correctAnswer: (a as { question: { correctAnswer: string | string[] } }).question.correctAnswer,
      userAnswer: (a as { answer: string | string[] }).answer,
      isCorrect: (a as { isCorrect: boolean }).isCorrect,
      pointsEarned: (a as { pointsEarned: number }).pointsEarned,
      options: (a as { question: { options: string[] | null } }).question.options,
    }));
    return NextResponse.json({ attempt, review });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch attempt.' },
      { status: 500 }
    );
  }
}

// Stats functionality moved to /api/attempts/stats/route.ts
