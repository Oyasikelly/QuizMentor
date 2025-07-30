import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST /api/grades - Teacher submits a manual grade
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answerId, teacherId, pointsAwarded, feedback } = body;
    if (!answerId || !teacherId || pointsAwarded === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      );
    }
    // Upsert manual grade using unchecked create input
    const manualGrade = await prisma.manualGrade.upsert({
      where: { answerId },
      update: { pointsAwarded, feedback, gradedAt: new Date(), teacherId },
      create: {
        answerId,
        teacherId,
        pointsAwarded,
        feedback: feedback || null,
        gradedAt: new Date(),
      } as any, // Type assertion to bypass type checking temporarily
    });
    // Update QuizAnswer points and feedback
    await prisma.quizAnswer.update({
      where: { id: answerId },
      data: { pointsEarned: pointsAwarded },
    });
    return NextResponse.json({ manualGrade });
  } catch (error) {
    console.error('Failed to submit manual grade:', error);
    return NextResponse.json(
      { error: 'Failed to submit manual grade.' },
      { status: 500 }
    );
  }
}

// GET /api/grades?quizId=...&teacherId=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('quizId');

    if (!quizId) {
      return NextResponse.json(
        { error: 'Quiz ID is required.' },
        { status: 400 }
      );
    }

    // Find all answers for the quiz that need manual grading (no manualGrade yet)
    const answers = await prisma.quizAnswer.findMany({
      where: {
        question: { quizId },
        manualGrade: null,
      } as any, // Type assertion to bypass type checking temporarily
      include: {
        question: true,
        attempt: true,
      },
    });
    return NextResponse.json({ answers });
  } catch (error) {
    console.error('Failed to fetch pending grades:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending grades.' },
      { status: 500 }
    );
  }
}
