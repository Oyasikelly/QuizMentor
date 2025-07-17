import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: Request) {
  const { email } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    await prisma.user.update({
      where: { email },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });
    // In production, send email. For dev, log the link:
    console.log(
      `Reset link: http://localhost:3000/reset-password?token=${token}`
    );
  }
  // Always respond with success (don't reveal if email exists)
  return NextResponse.json({
    message: 'If that email exists, a reset link has been sent.',
  });
}
