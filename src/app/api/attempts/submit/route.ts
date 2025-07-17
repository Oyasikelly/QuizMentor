import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Simple grading logic for demonstration
function gradeAttempt(questions, answers) {
  let score = 0;
  const responses = questions.map((q, idx) => {
    const answer = answers[idx];
    let isCorrect = false;
    if (q.type === 'multiple-choice' || q.type === 'short-answer') {
      isCorrect = answer === q.correctAnswer;
    } else if (q.type === 'true-false') {
      isCorrect = answer === q.correctAnswer;
    }
    if (isCorrect) score++;
    return {
      questionId: q.id,
      answer,
      isCorrect,
      pointsEarned: isCorrect ? 1 : 0,
    };
  });
  return { score, responses };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { attemptId, answers, timeSpent } = body;
    if (!attemptId) {
      return NextResponse.json(
        { error: 'Missing attemptId.' },
        { status: 400 }
      );
    }
    // Fetch attempt and quiz/questions
    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: { quiz: { include: { questions: true } } },
    });
    if (!attempt) {
      return NextResponse.json(
        { error: 'Attempt not found.' },
        { status: 404 }
      );
    }
    const questions = attempt.quiz.questions;
    // Grade attempt
    const { score, responses } = gradeAttempt(questions, answers);
    // Update attempt
    const updatedAttempt = await prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        answers,
        timeSpent,
        score,
        status: 'submitted',
        submittedAt: new Date(),
      },
    });
    // Save responses (optional: upsert logic)
    // ...
    return NextResponse.json({ attempt: updatedAttempt, responses });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to submit attempt.' },
      { status: 500 }
    );
  }
}
