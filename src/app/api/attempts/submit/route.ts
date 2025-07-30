import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Question } from '@/types/quiz';

const prisma = new PrismaClient();

// Simple grading logic for demonstration
function gradeAttempt(questions: Question[], answers: (string | string[])[]) {
  let score = 0;
  const responses = questions.map((q: Question, idx: number) => {
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
    let score = 0;
    let totalPoints = 0;
    const answerRecords = [];
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const userAnswer = answers[i];
      const isCorrect = userAnswer === q.correctAnswer;
      const pointsEarned = isCorrect ? q.points : 0;
      score += pointsEarned;
      totalPoints += q.points;
      // Upsert or create QuizAnswer
      const answerRecord = await prisma.quizAnswer.create({
        data: {
          answer: userAnswer,
          isCorrect,
          pointsEarned,
          attemptId: attempt.id,
          questionId: q.id,
          organizationId: attempt.organizationId,
        },
      });
      answerRecords.push({
        questionId: q.id,
        question: q.text,
        correctAnswer: q.correctAnswer,
        userAnswer,
        isCorrect,
        pointsEarned,
      });
    }
    // Update attempt
    const updatedAttempt = await prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        timeSpent,
        score,
        totalPoints,
        completedAt: new Date(),
      },
    });
    return NextResponse.json({
      attempt: updatedAttempt,
      answers: answerRecords,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to submit attempt.' },
      { status: 500 }
    );
  }
}
