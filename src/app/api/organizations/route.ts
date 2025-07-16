import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  try {
    const organizations = await prisma.organization.findMany();
    return NextResponse.json({ organizations });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch organizations.' },
      { status: 500 }
    );
  }
}
