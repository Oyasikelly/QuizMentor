import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PendingAnswer {
  id: string;
  answer: string;
  question: { text: string; points: number };
  attempt: { studentId: string };
}

interface PendingGradingPanelProps {
  quizId: string;
  teacherId: string;
}

export default function PendingGradingPanel({
  quizId,
  teacherId,
}: PendingGradingPanelProps) {
  const [pending, setPending] = useState<PendingAnswer[]>([]);
  const [loading, setLoading] = useState(false);
  const [grading, setGrading] = useState<{ [id: string]: boolean }>({});
  const [points, setPoints] = useState<{ [id: string]: number }>({});
  const [feedback, setFeedback] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    setLoading(true);
    fetch(`/api/grades?quizId=${quizId}`)
      .then((res) => res.json())
      .then((data) => setPending(data.answers || []))
      .finally(() => setLoading(false));
  }, [quizId]);

  const handleGrade = async (answerId: string) => {
    setGrading((g) => ({ ...g, [answerId]: true }));
    await fetch('/api/grades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answerId,
        teacherId,
        pointsAwarded: points[answerId],
        feedback: feedback[answerId],
      }),
    });
    setPending((prev) => prev.filter((a) => a.id !== answerId));
    setGrading((g) => ({ ...g, [answerId]: false }));
  };

  if (loading) return <div>Loading pending grades...</div>;
  if (!pending.length)
    return (
      <div className="text-muted-foreground">No pending manual grades.</div>
    );

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Pending Manual Grading</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {pending.map((ans) => (
            <div key={ans.id} className="p-4 border rounded-lg bg-muted/30">
              <div className="mb-2 font-medium">{ans.question.text}</div>
              <div className="mb-2 text-sm text-muted-foreground">
                Student: {ans.attempt.studentId}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Answer:</span> {ans.answer}
              </div>
              <div className="flex gap-4 items-center mb-2">
                <Input
                  type="number"
                  min={0}
                  max={ans.question.points}
                  placeholder={`0-${ans.question.points}`}
                  value={points[ans.id] ?? ''}
                  onChange={(e) =>
                    setPoints((p) => ({
                      ...p,
                      [ans.id]: Number(e.target.value),
                    }))
                  }
                  className="w-24"
                />
                <span className="text-xs text-muted-foreground">
                  / {ans.question.points} points
                </span>
              </div>
              <Textarea
                placeholder="Feedback (optional)"
                value={feedback[ans.id] ?? ''}
                onChange={(e) =>
                  setFeedback((f) => ({ ...f, [ans.id]: e.target.value }))
                }
                className="mb-2"
              />
              <Button
                onClick={() => handleGrade(ans.id)}
                disabled={grading[ans.id] || points[ans.id] === undefined}
              >
                {grading[ans.id] ? 'Saving...' : 'Save Grade'}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
