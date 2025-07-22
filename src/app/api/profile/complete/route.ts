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
      // Use upsert to avoid unique constraint errors and set subjects relation
      await prisma.teacher.upsert({
        where: { userId },
        update: {
          department,
          phoneNumber,
          employeeId,
          subjects: {
            set: (subjectIds || []).map((id: string) => ({ id })),
          },
        },
        create: {
          userId,
          department,
          phoneNumber,
          employeeId,
          subjects: {
            connect: (subjectIds || []).map((id: string) => ({ id })),
          },
        },
      });
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Fetch user, student profile, department (unit), and school (organization)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: true,
        unit: true,
        organization: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch all quiz attempts for the student
    const attempts = await prisma.quizAttempt.findMany({
      where: { studentId: userId },
      include: {
        quiz: { include: { subject: true } },
      },
      orderBy: { completedAt: 'desc' },
    });
    const quizAttempts = attempts.map((a) => ({
      quizTitle: a.quiz?.title,
      subject: a.quiz?.subject?.name,
      score: a.score,
      totalPoints: a.totalPoints,
      completedAt: a.completedAt,
    }));

    // Fetch achievements and badges
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
    const achievementsRes = await fetch(
      `${baseUrl}/api/student/achievements?studentId=${userId}`
    );
    const achievementsData = await achievementsRes.json();

    // Flatten the response for the form
    return NextResponse.json({
      name: user.name,
      email: user.email,
      school: user.organization?.name || '',
      department: user.unit?.name || '',
      year: user.student?.classYear || '',
      regNo: user.student?.studentId || '',
      phoneNumber: user.student?.phoneNumber || '',
      academicLevel: user.student?.academicLevel || '',
      notificationPrefs: (user.student as any)?.notificationPrefs || {},
      quizAttempts,
      achievements: achievementsData.achievements || [],
      badges: achievementsData.badges || [],
    });
  } catch (error) {
    console.error('PROFILE GET ERROR:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
