import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const quizId = params.id;
  if (!quizId) {
    return NextResponse.json(
      { error: 'Quiz ID is required.' },
      { status: 400 }
    );
  }
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: true,
        teacher: true,
        subject: true,
      },
    });
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found.' }, { status: 404 });
    }
    return NextResponse.json({ quiz });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch quiz.' },
      { status: 500 }
    );
  }
}
