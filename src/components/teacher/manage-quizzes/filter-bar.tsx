'use client';

import { Search, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useEffect } from 'react';

interface SubjectOption {
  id: string;
  name: string;
}

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: 'all' | 'active' | 'draft' | 'archived';
  onStatusFilterChange: (
    status: 'all' | 'active' | 'draft' | 'archived'
  ) => void;
  subjectFilter: string[]; // now array for multi-select
  onSubjectFilterChange: (subjectIds: string[]) => void;
  subjects: SubjectOption[];
  sortBy: string;
  onSortChange: (sort: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  viewMode: 'card' | 'table';
  onViewModeChange: (mode: 'card' | 'table') => void;
  onResetFilters: () => void;
  isLoading?: boolean;
  multiSelectSubjects?: boolean;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  subjectFilter,
  onSubjectFilterChange,
  subjects,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  viewMode,
  onViewModeChange,
  onResetFilters,
  isLoading = false,
  multiSelectSubjects = false,
}: FilterBarProps) {
  // Debounced search
  const [searchInput, setSearchInput] = useState(searchQuery);
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== searchQuery) onSearchChange(searchInput);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Multi-select subject logic
  const handleSubjectChange = (value: string) => {
    onSubjectFilterChange([value]);
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-muted/50 rounded-lg">
      {/* Search and View Toggle */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search quizzes by title, subject, or description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'card' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onViewModeChange('card')}
            disabled={isLoading}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onViewModeChange('table')}
            disabled={isLoading}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Select
            value={statusFilter}
            onValueChange={onStatusFilterChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Subject Filter (multi or single select) */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Subject:</span>
          {multiSelectSubjects ? (
            <Select
              value={subjectFilter[0] || 'all'}
              onValueChange={handleSubjectChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Select
              value={subjectFilter[0] || 'all'}
              onValueChange={handleSubjectChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select
            value={sortBy}
            onValueChange={onSortChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created">Date Created</SelectItem>
              <SelectItem value="modified">Last Modified</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="attempts">Attempts</SelectItem>
            </SelectContent>
          </Select>
          {/* Sort Order Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')
            }
            disabled={isLoading}
            aria-label={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          >
            {sortOrder === 'asc' ? <span>&uarr;</span> : <span>&darr;</span>}
          </Button>
        </div>

        {/* Clear Filters */}
        {(searchInput ||
          statusFilter !== 'all' ||
          (subjectFilter.length && subjectFilter[0] !== 'all')) && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            disabled={isLoading}
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
