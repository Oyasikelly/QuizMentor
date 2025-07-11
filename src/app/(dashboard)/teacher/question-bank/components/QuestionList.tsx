import React, { useState } from 'react';
import { QuestionCard } from './QuestionCard';
import { Button } from '@/components/ui/button';
import { List, Grid } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  type: 'MCQ' | 'True/False' | 'Short Answer';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  usage: number;
}

const mockQuestions: Question[] = [
  {
    id: 'q1',
    text: 'What is the capital of France?',
    type: 'MCQ',
    difficulty: 'Easy',
    tags: ['Geography', 'Europe'],
    usage: 12,
  },
  {
    id: 'q2',
    text: 'Solve for x: 2x + 3 = 7',
    type: 'Short Answer',
    difficulty: 'Medium',
    tags: ['Math', 'Algebra'],
    usage: 8,
  },
  {
    id: 'q3',
    text: 'The Earth is flat. True or False?',
    type: 'True/False',
    difficulty: 'Easy',
    tags: ['Science'],
    usage: 20,
  },
  {
    id: 'q4',
    text: 'Explain the process of photosynthesis.',
    type: 'Short Answer',
    difficulty: 'Hard',
    tags: ['Biology'],
    usage: 5,
  },
];

export function QuestionList() {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end gap-2 mb-2">
        <Button
          size="icon"
          variant={view === 'grid' ? 'secondary' : 'ghost'}
          aria-label="Grid view"
          onClick={() => setView('grid')}
        >
          <Grid className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant={view === 'list' ? 'secondary' : 'ghost'}
          aria-label="List view"
          onClick={() => setView('list')}
        >
          <List className="w-4 h-4" />
        </Button>
      </div>
      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockQuestions.map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {mockQuestions.map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      )}
    </div>
  );
}
