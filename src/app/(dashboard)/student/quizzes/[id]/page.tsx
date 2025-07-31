import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { GoToSubjectButton } from './GoToSubjectButton';
import React from 'react';

export default async function StudentQuizRedirectPage(props: {
  params: Promise<{ id: string | string[] }>;
}) {
  // Await params in Next.js 15 server components
  const params = await props.params;
  const quizId =
    typeof params.id === 'string'
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : '';
  if (!quizId) return notFound();

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { subject: true },
  });

  if (!quiz) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Quiz Not Found</h1>
        <p className="text-muted-foreground">No quiz found with this ID.</p>
      </div>
    );
  }

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
      <p className="mb-2 text-muted-foreground">
        Subject: {quiz.subject?.name || 'General'}
      </p>
      {quiz.subjectId && <GoToSubjectButton subjectId={quiz.subjectId} />}
    </div>
  );
}
