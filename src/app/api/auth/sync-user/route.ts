import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { userId, email, name, role, emailVerified, organizationId } =
      await request.json();

    // Check if user already exists in your database
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      // Create new user in your database
      const userProfile = await prisma.user.create({
        data: {
          id: userId,
          email: email,
          name: name,
          role: role.toUpperCase() as
            | 'STUDENT'
            | 'TEACHER'
            | 'ADMIN'
            | 'SUPER_ADMIN',
          organizationId: organizationId, // Use the selected organization
          isActive: true,
          emailVerified: emailVerified,
        },
        include: {
          student: true,
          teacher: true,
        },
      });

      // Create student or teacher profile
      if (role === 'student') {
        await prisma.student.create({
          data: {
            userId: userId,
            studentId: userId,
          },
        });
      } else if (role === 'teacher') {
        await prisma.teacher.create({
          data: {
            userId: userId,
            employeeId: userId,
          },
        });
      }

      return NextResponse.json({ user: userProfile });
    }

    return NextResponse.json({ user: existingUser });
  } catch (error) {
    console.error('Error syncing user to database:', error);
    return NextResponse.json(
      { error: 'Failed to sync user to database' },
      { status: 500 }
    );
  }
}
