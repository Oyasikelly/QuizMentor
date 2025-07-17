'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Lock, Settings, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { QuizSettings } from '@/types/quiz-creation';

interface Subject {
  id: string;
  name: string;
}
interface QuizSettingsFormProps {
  settings: Partial<QuizSettings>;
  onSettingsChange: (settings: Partial<QuizSettings>) => void;
  onNext: () => void;
  subjects: Subject[]; // Only subjects assigned to the teacher
}

const CATEGORIES = [
  'Assessment',
  'Practice',
  'Review',
  'Final Exam',
  'Midterm',
  'Homework',
  'Quiz',
  'Test',
  'Assignment',
  'Project',
];

const DIFFICULTY_LEVELS = [
  { value: 'Easy', label: 'Easy', color: 'text-green-600' },
  { value: 'Medium', label: 'Medium', color: 'text-yellow-600' },
  { value: 'Hard', label: 'Hard', color: 'text-red-600' },
];

export default function QuizSettingsForm({
  settings,
  onSettingsChange,
  onNext,
  subjects,
}: QuizSettingsFormProps) {
  const [tags, setTags] = useState<string[]>(settings.tags || []);
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateSettings = (updates: Partial<QuizSettings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      updateSettings({ tags: updatedTags });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    updateSettings({ tags: updatedTags });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!settings.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!settings.subjectId) {
      newErrors.subjectId = 'Subject is required';
    }

    if (!settings.category?.trim()) {
      newErrors.category = 'Category is required';
    }

    if (settings.timeLimit && settings.timeLimit <= 0) {
      newErrors.timeLimit = 'Time limit must be greater than 0';
    }

    if (
      settings.passingScore &&
      (settings.passingScore < 0 || settings.passingScore > 100)
    ) {
      newErrors.passingScore = 'Passing score must be between 0 and 100';
    }

    if (settings.maxAttempts && settings.maxAttempts <= 0) {
      newErrors.maxAttempts = 'Max attempts must be greater than 0';
    }

    if (
      settings.startDate &&
      settings.endDate &&
      settings.startDate >= settings.endDate
    ) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Basic Information</span>
          </CardTitle>
          <CardDescription>Set the basic details for your quiz</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Quiz Title *</Label>
              <Input
                id="title"
                value={settings.title || ''}
                onChange={(e) => updateSettings({ title: e.target.value })}
                placeholder="Enter quiz title"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subjectId">Subject *</Label>
              <Select
                value={settings.subjectId || ''}
                onValueChange={(value) => updateSettings({ subjectId: value })}
              >
                <SelectTrigger
                  className={errors.subjectId ? 'border-red-500' : ''}
                >
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subjectId && (
                <p className="text-sm text-red-500">{errors.subjectId}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={settings.description || ''}
              onChange={(e) => updateSettings({ description: e.target.value })}
              placeholder="Describe your quiz"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={settings.category || ''}
                onValueChange={(value) => updateSettings({ category: value })}
              >
                <SelectTrigger
                  className={errors.category ? 'border-red-500' : ''}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={settings.difficulty || 'Medium'}
                onValueChange={(value) =>
                  updateSettings({
                    difficulty: value as 'Easy' | 'Medium' | 'Hard',
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <span className={level.color}>{level.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer">
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timing Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Timing Settings</span>
          </CardTitle>
          <CardDescription>
            Configure time limits and restrictions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Switch
              id="timeLimit"
              checked={(settings.timeLimit ?? 0) > 0}
              onCheckedChange={(checked) =>
                updateSettings({ timeLimit: checked ? 30 : null })
              }
            />
            <Label htmlFor="timeLimit">Set time limit</Label>
          </div>

          {settings.timeLimit && (
            <div className="space-y-2">
              <Label htmlFor="timeLimitValue">Time Limit (minutes)</Label>
              <Input
                id="timeLimitValue"
                type="number"
                value={settings.timeLimit ?? ''}
                onChange={(e) =>
                  updateSettings({
                    timeLimit: parseInt(e.target.value) || null,
                  })
                }
                min="1"
                max="480"
                className={errors.timeLimit ? 'border-red-500' : ''}
              />
              {errors.timeLimit && (
                <p className="text-sm text-red-500">{errors.timeLimit}</p>
              )}
            </div>
          )}

          <div className="flex items-center space-x-4">
            <Switch
              id="showTimer"
              checked={settings.showTimer || false}
              onCheckedChange={(checked) =>
                updateSettings({ showTimer: checked })
              }
            />
            <Label htmlFor="showTimer">Show timer to students</Label>
          </div>

          <div className="flex items-center space-x-4">
            <Switch
              id="autoSubmit"
              checked={settings.autoSubmit || false}
              onCheckedChange={(checked) =>
                updateSettings({ autoSubmit: checked })
              }
            />
            <Label htmlFor="autoSubmit">Auto-submit when time expires</Label>
          </div>
        </CardContent>
      </Card>

      {/* Scoring Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Tag className="w-5 h-5" />
            <span>Scoring Settings</span>
          </CardTitle>
          <CardDescription>
            Configure grading and scoring options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="passingScore">Passing Score (%)</Label>
            <Input
              id="passingScore"
              type="number"
              value={settings.passingScore || 70}
              onChange={(e) =>
                updateSettings({ passingScore: parseInt(e.target.value) || 70 })
              }
              min="0"
              max="100"
              className={errors.passingScore ? 'border-red-500' : ''}
            />
            {errors.passingScore && (
              <p className="text-sm text-red-500">{errors.passingScore}</p>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Switch
              id="showScoreImmediately"
              checked={settings.showScoreImmediately || false}
              onCheckedChange={(checked) =>
                updateSettings({ showScoreImmediately: checked })
              }
            />
            <Label htmlFor="showScoreImmediately">
              Show score immediately after submission
            </Label>
          </div>

          <div className="flex items-center space-x-4">
            <Switch
              id="allowRetakes"
              checked={settings.allowRetakes || false}
              onCheckedChange={(checked) =>
                updateSettings({ allowRetakes: checked })
              }
            />
            <Label htmlFor="allowRetakes">Allow retakes</Label>
          </div>

          {settings.allowRetakes && (
            <div className="space-y-2">
              <Label htmlFor="maxAttempts">Maximum Attempts</Label>
              <Input
                id="maxAttempts"
                type="number"
                value={settings.maxAttempts || 3}
                onChange={(e) =>
                  updateSettings({ maxAttempts: parseInt(e.target.value) || 3 })
                }
                min="1"
                max="10"
                className={errors.maxAttempts ? 'border-red-500' : ''}
              />
              {errors.maxAttempts && (
                <p className="text-sm text-red-500">{errors.maxAttempts}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Access Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Access Settings</span>
          </CardTitle>
          <CardDescription>
            Configure when and who can access the quiz
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Available From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !settings.startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {settings.startDate
                      ? format(settings.startDate, 'PPP')
                      : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={settings.startDate}
                    onSelect={(date) => updateSettings({ startDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Available Until</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !settings.endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {settings.endDate
                      ? format(settings.endDate, 'PPP')
                      : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={settings.endDate}
                    onSelect={(date) => updateSettings({ endDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Switch
              id="requirePassword"
              checked={settings.requirePassword || false}
              onCheckedChange={(checked) =>
                updateSettings({ requirePassword: checked })
              }
            />
            <Label htmlFor="requirePassword">Require password</Label>
          </div>

          {settings.requirePassword && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={settings.password || ''}
                onChange={(e) => updateSettings({ password: e.target.value })}
                placeholder="Enter quiz password"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6">
        <Button variant="outline">Save Draft</Button>
        <Button onClick={handleNext}>Continue to Questions</Button>
      </div>
    </div>
  );
}
