import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  try {
    const units = await prisma.organizationalUnit.findMany();
    return NextResponse.json({ units });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch units.' },
      { status: 500 }
    );
  }
}
