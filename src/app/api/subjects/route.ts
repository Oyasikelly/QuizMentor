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
      // Fetch all subjects for the student's organization (ignore unitId)
      subjects = await prisma.subject.findMany({
        where: {
          organizationId: studentUser.organizationId,
        },
      });
    } else if (teacherId) {
      // Find the teacher profile
      const teacher = await prisma.teacher.findUnique({
        where: { userId: teacherId },
      });
      if (!teacher) {
        return NextResponse.json(
          {
            subjects: [],
            message: 'Teacher not found or not assigned to any subjects.',
          },
          { status: 200 }
        );
      }
      // Find subjects assigned to this teacher (many-to-many through teachers relation)
      subjects = await prisma.subject.findMany({
        where: {
          teachers: {
            some: { userId: teacherId },
          },
        },
      });
      if (!subjects || subjects.length === 0) {
        return NextResponse.json(
          { subjects: [], message: 'No subjects assigned to this teacher.' },
          { status: 200 }
        );
      }
    } else {
      subjects = await prisma.subject.findMany();
    }
    return NextResponse.json({ subjects });
  } catch (error) {
    console.error('SUBJECTS API ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subjects.' },
      { status: 500 }
    );
  }
}
