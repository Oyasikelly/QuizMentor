import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId');
    const where = organizationId ? { organizationId } : {};
    const units = await prisma.organizationalUnit.findMany({ where });
    return NextResponse.json({ units });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch units.' },
      { status: 500 }
    );
  }
}
