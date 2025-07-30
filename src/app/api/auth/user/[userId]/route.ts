import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: true,
        teacher: true,
      },
    });

    if (!userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check profile completion
    let profileComplete = false;
    if (userProfile.role === 'STUDENT') {
      profileComplete = !!(
        userProfile.student?.academicLevel &&
        userProfile.student?.classYear &&
        userProfile.student?.phoneNumber
      );
    } else if (userProfile.role === 'TEACHER') {
      profileComplete = !!(
        userProfile.teacher?.department && userProfile.teacher?.employeeId
      );
    } else if (
      userProfile.role === 'ADMIN' ||
      userProfile.role === 'SUPER_ADMIN'
    ) {
      profileComplete = true;
    }

    const user = {
      id: userProfile.id,
      email: userProfile.email,
      name: userProfile.name || 'User',
      role: userProfile.role.toLowerCase() as
        | 'student'
        | 'teacher'
        | 'admin'
        | 'super_admin',
      createdAt: userProfile.createdAt,
      updatedAt: userProfile.updatedAt,
      profileComplete,
      organizationId: userProfile.organizationId,
      unitId: userProfile.unitId || undefined,
      isActive: userProfile.isActive,
      emailVerified: userProfile.emailVerified,
      // Student-specific properties
      academicLevel: userProfile.student?.academicLevel || undefined,
      classYear: userProfile.student?.classYear || undefined,
      phoneNumber: userProfile.student?.phoneNumber || undefined,
      // Teacher-specific properties
      department: userProfile.teacher?.department || undefined,
      institution: undefined,
      employeeId: userProfile.teacher?.employeeId || undefined,
    };

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error getting user from database:', error);
    return NextResponse.json(
      { error: 'Failed to get user from database' },
      { status: 500 }
    );
  }
}
