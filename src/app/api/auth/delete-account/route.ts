import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { userId, password } = await req.json();
  if (!userId || !password) {
    return NextResponse.json(
      { error: 'Missing required fields.' },
      { status: 400 }
    );
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }
  if (!user.password) {
    return NextResponse.json(
      { error: 'User has no password set.' },
      { status: 400 }
    );
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return NextResponse.json(
      { error: 'Password is incorrect.' },
      { status: 401 }
    );
  }
  // Delete related data (student, attempts, etc.)
  await prisma.student.deleteMany({ where: { userId } });
  await prisma.quizAttempt.deleteMany({ where: { studentId: userId } });
  // Add more related deletions as needed
  await prisma.user.delete({ where: { id: userId } });
  return NextResponse.json({ message: 'Account deleted successfully.' });
}
