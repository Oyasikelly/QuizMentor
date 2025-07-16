import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const subjectId = searchParams.get('subjectId');
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
      // Build query for quizzes in student's org/unit, optionally filtered by subject
      quizzes = await prisma.quiz.findMany({
        where: {
          organizationId: studentUser.organizationId,
          ...(studentUser.unitId
            ? {
                // Note: The database doesn't have unitId in quizzes table
                // We'll filter by organization only for now
              }
            : {}),
          ...(subjectId
            ? {
                // Since subject is a string field, we need to filter differently
                // For now, we'll skip subject filtering until we have proper subject mapping
              }
            : {}),
          isPublished: true,
        },
        include: {
          teacher: true,
          // Note: subject is a string field, not a relation
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      // Fallback: return all published quizzes
      quizzes = await prisma.quiz.findMany({
        where: { isPublished: true },
        include: {
          teacher: true,
        },
        orderBy: { createdAt: 'desc' },
      });
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

    // TODO: Implement quiz creation logic
    return NextResponse.json({
      message: 'Quiz creation endpoint - implementation coming soon',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
