import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const mockFolders = [
  { name: 'All Questions', count: 1240 },
  { name: 'Math', count: 320 },
  { name: 'Science', count: 210 },
  { name: 'History', count: 180 },
];

const mockCategories = ['MCQ', 'True/False', 'Short Answer'];
const mockQuickFilters = ['Recently Used', 'AI Generated', 'Needs Review'];

export function Sidebar() {
  return (
    <Card className="p-4 flex flex-col gap-6">
      <div>
        <div className="font-semibold mb-2">Folders</div>
        <div className="flex flex-col gap-1">
          {mockFolders.map((folder) => (
            <Button
              key={folder.name}
              variant="ghost"
              className="justify-between w-full"
            >
              <span>{folder.name}</span>
              <span className="text-xs text-muted-foreground">
                {folder.count}
              </span>
            </Button>
          ))}
        </div>
      </div>
      <div>
        <div className="font-semibold mb-2">Categories</div>
        <div className="flex flex-wrap gap-2">
          {mockCategories.map((cat) => (
            <Button key={cat} size="sm" variant="outline">
              {cat}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <div className="font-semibold mb-2">Quick Filters</div>
        <div className="flex flex-wrap gap-2">
          {mockQuickFilters.map((filter) => (
            <Button key={filter} size="sm" variant="secondary">
              {filter}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
