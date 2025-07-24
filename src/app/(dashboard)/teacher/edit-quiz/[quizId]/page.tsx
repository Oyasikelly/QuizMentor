'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import QuizSettingsForm from '@/components/teacher/quiz-creator/quiz-settings-form';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { FullPageSpinner } from '@/components/shared/loading-spinner';
import { QuizSettings } from '@/types/quiz-creation';

export default function EditQuizPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const quizId = params.quizId as string;
  const [quiz, setQuiz] = useState<any>(null);
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [settings, setSettings] = useState<Partial<QuizSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuizAndSubjects() {
      setLoading(true);
      try {
        // Fetch quiz data
        const quizRes = await fetch(`/api/quizzes/${quizId}`);
        if (!quizRes.ok) throw new Error('Quiz not found');
        const quizData = await quizRes.json();
        setQuiz(quizData);
        // Fetch teacher's subjects
        const subjRes = await fetch(`/api/subjects?teacherId=${user?.id}`);
        const subjData = await subjRes.json();
        setSubjects(subjData.subjects || []);
        // Pre-fill settings
        setSettings({
          title: quizData.title,
          description: quizData.description,
          subjectId: quizData.subjectId,
          difficulty: quizData.difficulty,
          category: quizData.category,
          tags: quizData.tags || [],
          estimatedDuration: quizData.estimatedDuration,
          timeLimit: quizData.timeLimit,
          showTimer: quizData.showTimer,
          autoSubmit: quizData.autoSubmit,
          passingScore: quizData.passingScore,
          showScoreImmediately: quizData.showScoreImmediately,
          allowRetakes: quizData.allowRetakes,
          maxAttempts: quizData.maxAttempts,
          startDate: quizData.startDate
            ? new Date(quizData.startDate)
            : undefined,
          endDate: quizData.endDate ? new Date(quizData.endDate) : undefined,
          assignToClasses: quizData.assignToClasses || [],
          assignToStudents: quizData.assignToStudents || [],
          requirePassword: quizData.requirePassword,
          password: quizData.password,
          questionsPerPage: quizData.questionsPerPage,
          randomizeQuestions: quizData.randomizeQuestions,
          randomizeAnswers: quizData.randomizeAnswers,
          showQuestionNumbers: quizData.showQuestionNumbers,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    }
    if (quizId && user?.id) fetchQuizAndSubjects();
  }, [quizId, user]);

  const handleSettingsChange = (updates: Partial<QuizSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/quizzes/${quizId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, teacherId: user?.id }),
      });
      if (!res.ok) throw new Error('Failed to update quiz');
      router.push('/teacher/manage-quizzes');
    } catch (err: any) {
      setError(err.message || 'Failed to update quiz');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <FullPageSpinner text="Loading quiz..." />;
  if (error)
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-red-600">{error}</div>
      </DashboardLayout>
    );
  if (!quiz)
    return (
      <DashboardLayout>
        <div className="p-8 text-center">Quiz not found.</div>
      </DashboardLayout>
    );
  if (quiz.teacherId !== user?.id)
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-red-600">
          You are not authorized to edit this quiz.
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Edit Quiz</h1>
        <QuizSettingsForm
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onNext={handleSave}
          subjects={subjects}
        />
        <div className="flex justify-end mt-6">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
        {error && <div className="text-red-600 mt-4">{error}</div>}
      </div>
    </DashboardLayout>
  );
}
