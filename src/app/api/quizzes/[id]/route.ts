import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const quizId = id;
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
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch quiz.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const quizId = id;
  if (!quizId) {
    return NextResponse.json(
      { error: 'Quiz ID is required.' },
      { status: 400 }
    );
  }
  try {
    await prisma.quiz.delete({ where: { id: quizId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete quiz.' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const quizId = id;
  if (!quizId) {
    return NextResponse.json(
      { error: 'Quiz ID is required.' },
      { status: 400 }
    );
  }
  try {
    const body = await request.json();
    // Only allow updating isPublished or status
    const { isPublished, status } = body;

    // Map status string to enum value
    const statusMap: Record<string, string> = {
      active: 'ACTIVE',
      draft: 'DRAFT',
      archived: 'ARCHIVED',
    };

    const updateData: Record<string, unknown> = {};
    if (typeof isPublished === 'boolean') {
      updateData.isPublished = isPublished;
    }
    if (status && statusMap[status]) {
      updateData.status = statusMap[status];
    }

    const updatedQuiz = await prisma.quiz.update({
      where: { id: quizId },
      data: updateData,
    });
    return NextResponse.json({ quiz: updatedQuiz });
  } catch {
    console.error('PATCH quiz error: Unknown error');
    return NextResponse.json(
      { error: 'Failed to update quiz.' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const quizId = id;
  if (!quizId) {
    return NextResponse.json(
      { error: 'Quiz ID is required.' },
      { status: 400 }
    );
  }
  try {
    // Find the quiz and its questions
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found.' }, { status: 404 });
    }
    // Create a new quiz with copied data
    const newQuiz = await prisma.quiz.create({
      data: {
        title: quiz.title + ' (Copy)',
        description: quiz.description,
        teacherId: quiz.teacherId,
        subjectId: quiz.subjectId,
        organizationId: quiz.organizationId,
        isPublished: false,
        status: 'DRAFT', // Duplicates are drafts by default
        totalPoints: quiz.totalPoints,
        timeLimit: quiz.timeLimit,
        questions: {
          create: quiz.questions.map(
            (q: {
              text: string;
              type: string;
              options: string[];
              correctAnswer: string;
              points: number;
              order: number;
            }) => ({
              text: q.text,
              type: q.type as 'MULTIPLE_CHOICE' | 'SHORT_ANSWER' | 'TRUE_FALSE',
              options: q.options,
              correctAnswer: q.correctAnswer,
              points: q.points,
              order: q.order,
              organization: { connect: { id: quiz.organizationId } },
            })
          ),
        },
      },
      include: { questions: true },
    });
    return NextResponse.json({ quiz: newQuiz });
  } catch {
    return NextResponse.json(
      { error: 'Failed to duplicate quiz.' },
      { status: 500 }
    );
  }
}
