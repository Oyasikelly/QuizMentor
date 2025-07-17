import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { attemptId: string } }
) {
  try {
    const { attemptId } = params;
    if (!attemptId) {
      return NextResponse.json(
        { error: 'Missing attemptId.' },
        { status: 400 }
      );
    }
    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: {
          include: { questions: true },
        },
      },
    });
    if (!attempt) {
      return NextResponse.json(
        { error: 'Attempt not found.' },
        { status: 404 }
      );
    }
    // Optionally, fetch responses if stored separately
    // const responses = await prisma.quizResponse.findMany({ where: { attemptId } });
    return NextResponse.json({ attempt });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch attempt.' },
      { status: 500 }
    );
  }
}
