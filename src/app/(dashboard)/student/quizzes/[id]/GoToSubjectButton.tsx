'use client';
import React from 'react';

export function GoToSubjectButton({ subjectId }: { subjectId: string }) {
  return (
    <button
      className="mt-4 px-6 py-2 bg-primary text-white rounded hover:bg-primary/90"
      onClick={() =>
        (window.location.href = `/student/quizzes?subjectId=${subjectId}`)
      }
    >
      Go to Subject Quizzes
    </button>
  );
}
