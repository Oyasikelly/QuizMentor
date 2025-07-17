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
    // Find or create an in-progress attempt
    let attempt = await prisma.quizAttempt.findFirst({
      where: { quizId, studentId, status: 'in_progress' },
    });
    if (attempt) {
      // Update answers and timeSpent
      attempt = await prisma.quizAttempt.update({
        where: { id: attempt.id },
        data: { answers, timeSpent },
      });
    } else {
      attempt = await prisma.quizAttempt.create({
        data: {
          quizId,
          studentId,
          answers,
          status: status || 'in_progress',
          timeSpent: timeSpent || 0,
        },
      });
    }
    return NextResponse.json({ attempt });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save attempt.' },
      { status: 500 }
    );
  }
}
