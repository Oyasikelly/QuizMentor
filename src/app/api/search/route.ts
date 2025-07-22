import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const organizationId = searchParams.get('organizationId');
  const q = searchParams.get('q')?.toLowerCase() || '';
  if (!userId || !organizationId || !q) {
    return NextResponse.json(
      { error: 'Missing userId, organizationId, or q' },
      { status: 400 }
    );
  }

  // Search quizzes (in org, title/subject match)
  const quizzes = await prisma.quiz.findMany({
    where: {
      organizationId,
      isPublished: true,
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { subject: { name: { contains: q, mode: 'insensitive' } } },
      ],
    },
    include: { subject: true },
    take: 10,
  });

  // Search student's attempts (quiz title/subject match)
  const attempts = await prisma.quizAttempt.findMany({
    where: {
      studentId: userId,
      quiz: {
        organizationId,
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { subject: { name: { contains: q, mode: 'insensitive' } } },
        ],
      },
    },
    include: { quiz: { include: { subject: true } } },
    take: 10,
  });

  // Search student's achievements/badges (title/name/description match)
  // For demo, just filter by q in-memory (ideally, store in DB for real search)
  // We'll fetch all and filter in-memory for now
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';
  const achievementsRes = await fetch(
    `${baseUrl}/api/student/achievements?studentId=${userId}`
  );
  const achievementsData = await achievementsRes.json();
  const achievements = (achievementsData.achievements || []).filter(
    (a: any) =>
      a.title?.toLowerCase().includes(q) ||
      a.description?.toLowerCase().includes(q)
  );
  const badges = (achievementsData.badges || []).filter(
    (b: any) =>
      b.name?.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q)
  );

  // Search subjects (in org, name match)
  const subjects = await prisma.subject.findMany({
    where: {
      organizationId,
      name: { contains: q, mode: 'insensitive' },
    },
    take: 10,
  });

  // Navigation keywords and routes
  const navKeywords: {
    keywords: string[];
    label: string;
    description: string;
    route: string;
  }[] = [
    {
      keywords: ['settings', 'password', 'account', 'security'],
      label: 'Settings',
      description: 'Manage your account and password',
      route: '/student/settings',
    },
    {
      keywords: ['profile', 'edit profile', 'my info'],
      label: 'Profile',
      description: 'View or edit your profile',
      route: '/student/profile',
    },
    {
      keywords: ['progress', 'my progress', 'performance'],
      label: 'My Progress',
      description: 'Track your quiz performance',
      route: '/student/progress',
    },
    {
      keywords: ['achievements', 'badges', 'rewards'],
      label: 'Achievements',
      description: 'View your achievements and badges',
      route: '/student/achievements',
    },
    {
      keywords: ['ai chat', 'chatbot', 'assistant'],
      label: 'AI Chat',
      description: 'Get help and practice with AI',
      route: '/student/ai-chat',
    },
    {
      keywords: ['quizzes', 'quiz', 'available quizzes', 'take quiz'],
      label: 'Available Quizzes',
      description: 'Browse and take quizzes',
      route: '/student/quizzes',
    },
    {
      keywords: ['dashboard', 'home'],
      label: 'Dashboard',
      description: 'Go to your dashboard',
      route: '/student',
    },
  ];

  const navResults = navKeywords
    .filter((nav) => nav.keywords.some((kw) => q.includes(kw)))
    .map((nav) => ({
      type: 'nav',
      label: nav.label,
      description: nav.description,
      route: nav.route,
    }));

  // TODO: Add more types (messages, etc.) as needed

  return NextResponse.json({
    nav: navResults,
    quizzes,
    attempts,
    achievements,
    badges,
    subjects,
  });
}
