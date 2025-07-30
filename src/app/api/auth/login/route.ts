import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json();

    console.log('Attempting login with:', email, 'Requested role:', role);

    // Validate that role is provided
    if (!role || !['student', 'teacher'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be either "student" or "teacher".' },
        { status: 400 }
      );
    }

    // Find user in database with all related data
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        student: true,
        teacher: true,
        organization: true,
        unit: true,
      },
    });

    if (!user) {
      console.log('Login failed: User not found');
      return NextResponse.json(
        {
          error:
            'Invalid email or password. Please check your credentials and try again.',
        },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      console.log('Login failed: User account is deactivated');
      return NextResponse.json(
        {
          error: 'Your account has been deactivated. Please contact support.',
        },
        { status: 403 }
      );
    }

    // Check if email is verified
    if (!user.emailVerified) {
      console.log('Login failed: Email not verified');
      return NextResponse.json(
        {
          error:
            'Please verify your email address before logging in. Check your inbox for a confirmation email.',
        },
        { status: 403 }
      );
    }

    // Check if user has a valid role
    if (
      !user.role ||
      !['STUDENT', 'TEACHER', 'ADMIN', 'SUPER_ADMIN'].includes(user.role)
    ) {
      console.log('Login failed: Invalid user role');
      return NextResponse.json(
        {
          error: 'Invalid user role. Please contact support.',
        },
        { status: 403 }
      );
    }

    // Validate that the user's actual role matches the requested role
    const userRole = user.role.toLowerCase();
    if (userRole !== role) {
      console.log(
        `Login failed: Role mismatch. User role: ${userRole}, Requested role: ${role}`
      );
      return NextResponse.json(
        {
          error: `This account is registered as a ${userRole}. Please select the correct role.`,
        },
        { status: 403 }
      );
    }

    // Check if password exists and compare
    if (!user.password) {
      console.log('Login failed: No password set for user');
      return NextResponse.json(
        {
          error:
            'Invalid email or password. Please check your credentials and try again.',
        },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('Login failed: Invalid password');
      return NextResponse.json(
        {
          error:
            'Invalid email or password. Please check your credentials and try again.',
        },
        { status: 401 }
      );
    }

    // Additional role-specific validations
    if (user.role === 'STUDENT' && !user.student) {
      console.log('Login failed: Student profile not found');
      return NextResponse.json(
        {
          error: 'Student profile not found. Please contact support.',
        },
        { status: 403 }
      );
    }

    if (user.role === 'TEACHER' && !user.teacher) {
      console.log('Login failed: Teacher profile not found');
      return NextResponse.json(
        {
          error: 'Teacher profile not found. Please contact support.',
        },
        { status: 403 }
      );
    }

    // Check if organization is active (for all users)
    if (user.organization && !user.organization.isActive) {
      console.log('Login failed: Organization is deactivated');
      return NextResponse.json(
        {
          error:
            'Your organization account is deactivated. Please contact support.',
        },
        { status: 403 }
      );
    }

    console.log('Login successful for user:', user.id, 'Role:', user.role);

    // Check if profile is complete based on role
    let profileComplete = false;

    if (user.role === 'STUDENT') {
      profileComplete = !!(
        user.student?.academicLevel &&
        user.student?.classYear &&
        user.student?.phoneNumber
      );
    } else if (user.role === 'TEACHER') {
      profileComplete = !!(
        user.teacher?.department && user.teacher?.employeeId
      );
    } else if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      // Admins are considered to have complete profiles
      profileComplete = true;
    }

    // Return user data with profile completion status
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name || 'User',
        role: user.role.toLowerCase(), // Convert to lowercase for frontend
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        profileComplete,
        organizationId: user.organizationId,
        unitId: user.unitId,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
