import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { userId, currentPassword, newPassword } = await req.json();
  if (!userId || !currentPassword || !newPassword) {
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
  const passwordMatch = await bcrypt.compare(currentPassword, user.password);
  if (!passwordMatch) {
    return NextResponse.json(
      { error: 'Current password is incorrect.' },
      { status: 401 }
    );
  }
  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });
  return NextResponse.json({ message: 'Password changed successfully.' });
}
