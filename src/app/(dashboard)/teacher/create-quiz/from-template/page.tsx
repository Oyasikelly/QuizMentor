'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { FullPageSpinner } from '@/components/shared/loading-spinner';

// Mock templates (replace with real fetch if available)
const TEMPLATES = [
  // Multiple Choice Templates
  {
    id: 'mcq-math',
    title: 'Math Multiple Choice Quiz',
    description: 'A set of basic math multiple-choice questions.',
    questions: [
      {
        text: 'What is 5 x 3?',
        type: 'multiple-choice',
        options: ['8', '15', '10'],
        correctAnswer: '15',
      },
      {
        text: 'Which is a prime number?',
        type: 'multiple-choice',
        options: ['4', '6', '7'],
        correctAnswer: '7',
      },
    ],
  },
  {
    id: 'mcq-history',
    title: 'History Multiple Choice Quiz',
    description: 'Test your knowledge of world history.',
    questions: [
      {
        text: 'Who was the first President of the USA?',
        type: 'multiple-choice',
        options: ['Abraham Lincoln', 'George Washington', 'John Adams'],
        correctAnswer: 'George Washington',
      },
      {
        text: 'In which year did World War II end?',
        type: 'multiple-choice',
        options: ['1945', '1939', '1918'],
        correctAnswer: '1945',
      },
    ],
  },
  // Short Answer Templates
  {
    id: 'sa-science',
    title: 'Science Short Answer Quiz',
    description: 'Short answer questions on basic science.',
    questions: [
      {
        text: 'What gas do plants absorb from the atmosphere?',
        type: 'short-answer',
        correctAnswer: 'Carbon dioxide',
      },
      {
        text: 'What is the boiling point of water in Celsius?',
        type: 'short-answer',
        correctAnswer: '100',
      },
    ],
  },
  {
    id: 'sa-english',
    title: 'English Short Answer Quiz',
    description: 'Short answer questions on English language.',
    questions: [
      {
        text: "What is the synonym of 'happy'?",
        type: 'short-answer',
        correctAnswer: 'Joyful',
      },
      {
        text: "Who wrote 'Romeo and Juliet'?",
        type: 'short-answer',
        correctAnswer: 'William Shakespeare',
      },
    ],
  },
  // True/False Templates
  {
    id: 'tf-biology',
    title: 'Biology True/False Quiz',
    description: 'True or false questions on biology.',
    questions: [
      {
        text: 'The human heart has four chambers.',
        type: 'true-false',
        correctAnswer: 'True',
      },
      {
        text: 'Plants make their own food through photosynthesis.',
        type: 'true-false',
        correctAnswer: 'True',
      },
    ],
  },
  {
    id: 'tf-geography',
    title: 'Geography True/False Quiz',
    description: 'Test your knowledge of world geography.',
    questions: [
      {
        text: 'The Sahara is the largest desert in the world.',
        type: 'true-false',
        correctAnswer: 'True',
      },
      {
        text: 'Mount Everest is located in Africa.',
        type: 'true-false',
        correctAnswer: 'False',
      },
    ],
  },
  // Fill in the Blank Templates
  {
    id: 'fb-chemistry',
    title: 'Chemistry Fill in the Blank Quiz',
    description: 'Fill in the blank questions on chemistry.',
    questions: [
      {
        text: 'The chemical symbol for water is _____.',
        type: 'fill-in-blank',
        correctAnswer: 'H2O',
      },
      {
        text: "_____ is the most abundant gas in Earth's atmosphere.",
        type: 'fill-in-blank',
        correctAnswer: 'Nitrogen',
      },
    ],
  },
  {
    id: 'fb-computers',
    title: 'Computers Fill in the Blank Quiz',
    description:
      'Test your computer knowledge with fill in the blank questions.',
    questions: [
      {
        text: 'The brain of the computer is the _____.',
        type: 'fill-in-blank',
        correctAnswer: 'CPU',
      },
      {
        text: 'HTML stands for _____ Markup Language.',
        type: 'fill-in-blank',
        correctAnswer: 'HyperText',
      },
    ],
  },
  // Essay Templates
  {
    id: 'essay-literature',
    title: 'Literature Essay Quiz',
    description: 'Essay questions on literature topics.',
    questions: [
      {
        text: "Discuss the main themes in 'To Kill a Mockingbird'.",
        type: 'essay',
      },
      {
        text: 'Explain the significance of symbolism in poetry.',
        type: 'essay',
      },
    ],
  },
  {
    id: 'essay-history',
    title: 'History Essay Quiz',
    description: 'Essay questions on historical events.',
    questions: [
      {
        text: 'Describe the causes and effects of the Industrial Revolution.',
        type: 'essay',
      },
      { text: 'Analyze the impact of World War I on Europe.', type: 'essay' },
    ],
  },
];

export default function FromTemplatePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [subjectId, setSubjectId] = useState<string>('');
  const [organizationId, setOrganizationId] = useState<string>('');
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    async function fetchSubjects() {
      if (!user) return;
      try {
        const res = await fetch(`/api/subjects?teacherId=${user.id}`);
        const data = await res.json();
        setSubjects(data.subjects || []);
        if (data.subjects && data.subjects.length > 0) {
          setSubjectId(data.subjects[0].id);
        }
        setOrganizationId(user.organizationId || '');
      } catch {
        setSubjects([]);
      }
    }
    fetchSubjects();
  }, [user]);

  if (loading) return <FullPageSpinner text="Loading your dashboard..." />;
  if (!user) return null;

  const handleSelect = (id: string) => setSelected(id);

  const handleCreate = async () => {
    if (!selected || !subjectId || !organizationId) return;
    setIsLoading(true);
    setError(null);
    try {
      const template = TEMPLATES.find((t) => t.id === selected);
      if (!template) throw new Error('Template not found');
      // POST to /api/quizzes (adjust fields as needed for your schema)
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: template.title,
          description: template.description,
          questions: template.questions,
          teacherId: user.id,
          subjectId,
          organizationId,
          isPublished: true, // publish by default
        }),
      });
      if (!res.ok) throw new Error('Failed to create quiz');
      router.push('/teacher/manage-quizzes');
    } catch (err: any) {
      setError(err.message || 'Failed to create quiz');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Create Quiz from Template
        </h1>
        <p className="text-muted-foreground mb-4">
          Select a template to quickly create a new quiz. You can edit questions
          after creation.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TEMPLATES.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selected === template.id
                  ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleSelect(template.id)}
            >
              <CardHeader>
                <CardTitle>{template.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{template.description}</CardDescription>
                <div className="mt-2 text-xs text-muted-foreground">
                  {template.questions.length} questions
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6">
          <label className="block mb-2 font-medium">Select Subject</label>
          <select
            className="w-full border rounded px-3 py-2 bg-background"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            disabled={subjects.length === 0}
          >
            {subjects.map((subj) => (
              <option key={subj.id} value={subj.id}>
                {subj.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-center pt-6">
          <Button
            size="lg"
            onClick={handleCreate}
            disabled={!selected || !subjectId || !organizationId || isLoading}
            className="px-8 py-3 text-lg"
          >
            {isLoading ? 'Creating...' : 'Create Quiz from Template'}
          </Button>
        </div>
        {error && <div className="text-red-500 text-center mt-2">{error}</div>}
      </div>
    </DashboardLayout>
  );
}
