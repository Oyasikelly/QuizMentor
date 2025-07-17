import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Teacher } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      role,
      academicLevel,
      classYear,
      phoneNumber,
      department,
      subjectIds, // <-- Accept array of subjectIds for teacher
      employeeId,
      unitId, // <-- Accept unitId from the request body
      studentId, // Accept studentId if provided
    } = body;
    const userId = body.userId;
    if (!userId || !role) {
      return NextResponse.json(
        { error: 'Missing userId or role.' },
        { status: 400 }
      );
    }
    // Update the user's unitId and organizationId if provided
    const updateData: any = {};
    if (unitId) updateData.unitId = unitId;
    if (body.organizationId) updateData.organizationId = body.organizationId;
    if (Object.keys(updateData).length > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });
    }
    if (role === 'student') {
      try {
        await prisma.student.update({
          where: { userId },
          data: { academicLevel, classYear, phoneNumber, studentId },
        });
      } catch (e) {
        // If not found, create
        await prisma.student.create({
          data: {
            userId,
            academicLevel,
            classYear,
            phoneNumber,
            studentId: studentId || userId, // Use provided studentId or fallback to userId
          },
        });
      }
    } else if (role === 'teacher') {
      let teacher: Teacher;
      try {
        teacher = await prisma.teacher.update({
          where: { userId },
          data: { department, phoneNumber, employeeId },
        });
        // Remove all current subject assignments
        await prisma.teacherSubject.deleteMany({
          where: { teacherId: teacher.id },
        });
        // Add new subject assignments
        if (subjectIds && subjectIds.length > 0) {
          await prisma.teacherSubject.createMany({
            data: subjectIds.map((subjectId: string) => ({
              teacherId: teacher.id,
              subjectId,
            })),
          });
        }
      } catch (e) {
        // If not found, create
        teacher = await prisma.teacher.create({
          data: { userId, department, phoneNumber, employeeId },
        });
        if (subjectIds && subjectIds.length > 0) {
          await prisma.teacherSubject.createMany({
            data: subjectIds.map((subjectId: string) => ({
              teacherId: teacher.id,
              subjectId,
            })),
          });
        }
      }
    } else {
      return NextResponse.json({ error: 'Invalid role.' }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PROFILE COMPLETE ERROR:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
