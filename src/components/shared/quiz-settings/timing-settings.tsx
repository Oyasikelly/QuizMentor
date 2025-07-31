'use client';

import { Clock, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TimingSettingsProps {
  timeLimit: number | null;
  showTimer: boolean;
  autoSubmit: boolean;
  onUpdate: (updates: {
    timeLimit?: number | null;
    showTimer?: boolean;
    autoSubmit?: boolean;
  }) => void;
}

export default function TimingSettings({
  timeLimit,
  showTimer,
  autoSubmit,
  onUpdate,
}: TimingSettingsProps) {
  const handleTimeLimitChange = (enabled: boolean) => {
    if (enabled) {
      onUpdate({ timeLimit: 30 }); // Default 30 minutes
    } else {
      onUpdate({ timeLimit: null });
    }
  };

  const handleTimeLimitValueChange = (value: string) => {
    const minutes = parseInt(value) || 0;
    onUpdate({ timeLimit: minutes > 0 ? minutes : null });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Timing Settings</span>
        </CardTitle>
        <CardDescription>
          Configure time limits and restrictions for your quiz
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Time Limit */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Switch
              id="timeLimit"
              checked={timeLimit !== null && timeLimit > 0}
              onCheckedChange={handleTimeLimitChange}
            />
            <Label htmlFor="timeLimit" className="text-base font-medium">
              Set time limit
            </Label>
          </div>

          {timeLimit && (
            <div className="space-y-2">
              <Label htmlFor="timeLimitValue">Time Limit (minutes)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="timeLimitValue"
                  type="number"
                  value={timeLimit}
                  onChange={(e) => handleTimeLimitValueChange(e.target.value)}
                  min="1"
                  max="480"
                  className="w-32"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  minutes
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Maximum time allowed: 8 hours (480 minutes)
              </p>
            </div>
          )}
        </div>

        {/* Timer Display */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Label htmlFor="showTimer" className="text-base font-medium">
              Show timer to students
            </Label>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Display a countdown timer during the quiz
            </p>
          </div>
          <Switch
            id="showTimer"
            checked={showTimer}
            onCheckedChange={(checked) => onUpdate({ showTimer: checked })}
          />
        </div>

        {/* Auto Submit */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Label htmlFor="autoSubmit" className="text-base font-medium">
              Auto-submit when time expires
            </Label>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Automatically submit the quiz when the time limit is reached
            </p>
          </div>
          <Switch
            id="autoSubmit"
            checked={autoSubmit}
            onCheckedChange={(checked) => onUpdate({ autoSubmit: checked })}
          />
        </div>

        {/* Warning */}
        {timeLimit && autoSubmit && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Students will be automatically logged out when the time limit
              expires. Make sure to inform them about this setting.
            </AlertDescription>
          </Alert>
        )}

        {/* Time Recommendations */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            💡 Time Limit Recommendations
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>
              • <strong>Short quizzes (5-10 questions):</strong> 15-30 minutes
            </li>
            <li>
              • <strong>Medium quizzes (10-20 questions):</strong> 30-60 minutes
            </li>
            <li>
              • <strong>Long quizzes (20+ questions):</strong> 60-120 minutes
            </li>
            <li>
              • <strong>Essay questions:</strong> Add 10-15 minutes per essay
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
