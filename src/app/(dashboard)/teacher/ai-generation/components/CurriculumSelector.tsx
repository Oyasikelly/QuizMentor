import React from 'react';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from '@/components/ui/select';

const curricula = ['JAMB', 'WAEC', 'NECO'];
const topics = ['Algebra', 'Biology', 'Literature', 'Economics', 'Physics'];

export function CurriculumSelector({
  value,
  onChange,
  selectedTopics,
  onTopicsChange,
}: {
  value: string;
  onChange: (v: string) => void;
  selectedTopics: string[];
  onTopicsChange: (v: string[]) => void;
}) {
  return (
    <Card className="p-4 flex flex-col gap-4">
      <div>
        <label className="font-semibold">Curriculum Standard</label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select curriculum" />
          </SelectTrigger>
          <SelectContent>
            {curricula.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="font-semibold">Topics</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {topics.map((t) => (
            <label key={t} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={selectedTopics.includes(t)}
                onChange={() =>
                  onTopicsChange(
                    selectedTopics.includes(t)
                      ? selectedTopics.filter((x) => x !== t)
                      : [...selectedTopics, t]
                  )
                }
              />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </div>
    </Card>
  );
}
