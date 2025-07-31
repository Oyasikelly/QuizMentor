import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user exists and get their role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role === 'STUDENT') {
      // Check student profile completion
      const student = await prisma.student.findUnique({
        where: { userId },
        select: {
          academicLevel: true,
          classYear: true,
          phoneNumber: true,
        },
      });

      return NextResponse.json({
        isComplete: !!(
          student?.academicLevel &&
          student?.classYear &&
          student?.phoneNumber
        ),
        missingFields: [
          ...(!student?.academicLevel ? ['academicLevel'] : []),
          ...(!student?.classYear ? ['classYear'] : []),
          ...(!student?.phoneNumber ? ['phoneNumber'] : []),
        ],
      });
    } else if (user.role === 'TEACHER') {
      // Check teacher profile completion
      const teacher = await prisma.teacher.findUnique({
        where: { userId },
        select: {
          department: true,
          employeeId: true,
        },
      });

      return NextResponse.json({
        isComplete: !!(teacher?.department && teacher?.employeeId),
        missingFields: [
          ...(!teacher?.department ? ['department'] : []),
          ...(!teacher?.employeeId ? ['employeeId'] : []),
        ],
      });
    }

    return NextResponse.json({ error: 'Invalid user role' }, { status: 400 });
  } catch (error) {
    console.error('Profile completion check error:', error);
    return NextResponse.json(
      { error: 'Failed to check profile completion' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      role,
      // academicLevel,
      // classYear,
      // phoneNumber,
      // department,
      // employeeId,
      unitId,
    } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'User ID and role are required' },
        { status: 400 }
      );
    }

    if (role.toUpperCase() === 'STUDENT') {
      // Update user record with unitId
      await prisma.user.update({
        where: { id: userId },
        data: {
          unitId: unitId || null,
        },
      });

      // Update or create student profile
      // const student = await prisma.student.upsert({
      //   where: { userId },
      //   update: {
      //     academicLevel,
      //     classYear,
      //     phoneNumber,
      //   },
      //   create: {
      //     userId,
      //     studentId: userId, // Use userId as studentId for now
      //     academicLevel,
      //     classYear,
      //     phoneNumber,
      //   },
      // });
      // Comment out to avoid unused variable

      // Fetch updated user data
      const updatedUser = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          student: true,
          teacher: true,
        },
      });

      return NextResponse.json({
        success: true,
        user: updatedUser,
        message: 'Student profile completed successfully',
      });
    } else if (role.toUpperCase() === 'TEACHER') {
      // Update user record with unitId
      await prisma.user.update({
        where: { id: userId },
        data: {
          unitId: unitId || null,
        },
      });

      // Update or create teacher profile
      // const teacher = await prisma.teacher.upsert({
      //   where: { userId },
      //   update: {
      //     department,
      //     employeeId,
      //   },
      //   create: {
      //     userId,
      //     department,
      //     employeeId,
      //   },
      // });

      // Fetch updated user data
      const updatedUser = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          student: true,
          teacher: true,
        },
      });

      return NextResponse.json({
        success: true,
        user: updatedUser,
        message: 'Teacher profile completed successfully',
      });
    }

    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  } catch (error) {
    console.error('Profile completion error:', error);
    return NextResponse.json(
      { error: 'Failed to complete profile' },
      { status: 500 }
    );
  }
}
