import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');
    const studentId = searchParams.get('studentId');
    let subjects;
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
      // Fetch subjects for the student's organization and unit (if unitId is set)
      subjects = await prisma.subject.findMany({
        where: {
          organizationId: studentUser.organizationId,
          ...(studentUser.unitId ? { unitId: studentUser.unitId } : {}),
        },
      });
    } else if (teacherId) {
      // Find subjects assigned to this teacher (many-to-many through TeacherSubject)
      subjects = await prisma.subject.findMany({
        where: {
          TeacherSubjects: {
            some: { teacher: { userId: teacherId } },
          },
        },
      });
    } else {
      subjects = await prisma.subject.findMany();
    }
    return NextResponse.json({ subjects });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch subjects.' },
      { status: 500 }
    );
  }
}
