import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const teacherId = searchParams.get('teacherId');
    const subjectId = searchParams.get('subjectId');
    const unitId = searchParams.get('unitId');
    let quizzes = [];
    if (studentId) {
      // Find the student user
      const studentUser = await prisma.user.findUnique({
        where: { id: studentId },
      });
      if (!studentUser) {
        return NextResponse.json(
          { error: 'Student not found.' },
          { status: 404 }
        );
      }
      // Build query for quizzes in student's org/unit, optionally filtered by subject and unit
      quizzes = await prisma.quiz.findMany({
        where: {
          organizationId: studentUser.organizationId,
          ...(subjectId ? { subjectId } : {}),
          ...(unitId ? { subject: { unitId } } : {}),
          isPublished: true,
        },
        include: {
          teacher: true,
          subject: true,
          _count: {
            select: { questions: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      // Add questionsCount property to each quiz
      quizzes = quizzes.map(
        (q: { status?: string; _count?: { questions: number } }) => ({
          ...q,
          status: q.status?.toLowerCase(),
          questionsCount: q._count?.questions ?? 0,
          _count: undefined,
        })
      );
    } else if (teacherId) {
      // Find the teacher profile and their organization/subjects
      const teacher = await prisma.teacher.findUnique({
        where: { userId: teacherId },
        include: { subjects: true, user: true },
      });
      if (!teacher) {
        return NextResponse.json(
          { quizzes: [], message: 'Teacher not found.' },
          { status: 200 }
        );
      }
      const orgId = teacher.user.organizationId;
      const subjectIds = teacher.subjects.map((s: { id: string }) => s.id);
      // Find quizzes created by this teacher or for subjects they teach, strictly in their org
      quizzes = await prisma.quiz.findMany({
        where: {
          organizationId: orgId,
          OR: [
            { teacherId },
            { subjectId: { in: subjectIds.length > 0 ? subjectIds : [''] } },
          ],
        },
        include: {
          teacher: true,
          subject: true,
          _count: { select: { questions: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      quizzes = quizzes.map(
        (q: { status?: string; _count?: { questions: number } }) => ({
          ...q,
          status: q.status?.toLowerCase(),
          questionsCount: q._count?.questions ?? 0,
          _count: undefined,
        })
      );
    } else {
      // Fallback: return all published quizzes
      quizzes = await prisma.quiz.findMany({
        where: { isPublished: true },
        include: {
          teacher: true,
          subject: true,
          _count: {
            select: { questions: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      quizzes = quizzes.map(
        (q: { status?: string; _count?: { questions: number } }) => ({
          ...q,
          status: q.status?.toLowerCase(),
          questionsCount: q._count?.questions ?? 0,
          _count: undefined,
        })
      );
    }
    return NextResponse.json({ quizzes });
  } catch (error) {
    console.error('Error in /api/quizzes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      questions,
      teacherId,
      subjectId,
      isPublished = false,
      organizationId,
      status,
    } = body;
    if (!title || !questions || !teacherId) {
      return NextResponse.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      );
    }
    // Map template question types to Prisma enum values
    const typeMap: Record<string, string> = {
      'multiple-choice': 'MULTIPLE_CHOICE',
      'short-answer': 'SHORT_ANSWER',
      'true-false': 'TRUE_FALSE',
      'fill-in-blank': 'SHORT_ANSWER',
      essay: 'SHORT_ANSWER',
    };
    // Create the quiz
    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        teacherId,
        subjectId: subjectId || undefined,
        isPublished,
        organizationId,
        status: status || 'DRAFT',
        questions: {
          create: questions.map((q: unknown, idx: number) => {
            const question = q as {
              text: string;
              type: string;
              options?: string[];
              correctAnswer?: string;
            };
            return {
              text: question.text,
              type: typeMap[question.type] || question.type,
              options: question.options ?? [],
              correctAnswer: question.correctAnswer ?? '',
              order: idx,
              organizationId,
              // Add other fields as needed
            };
          }),
        },
      },
      include: { questions: true },
    });
    return NextResponse.json({ quiz });
  } catch (error) {
    console.error('QUIZ CREATION ERROR:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
