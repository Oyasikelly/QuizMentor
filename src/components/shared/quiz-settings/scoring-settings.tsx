'use client';

import { Award, AlertCircle } from 'lucide-react';
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

interface ScoringSettingsProps {
  passingScore: number;
  showScoreImmediately: boolean;
  allowRetakes: boolean;
  maxAttempts: number;
  onUpdate: (updates: {
    passingScore?: number;
    showScoreImmediately?: boolean;
    allowRetakes?: boolean;
    maxAttempts?: number;
  }) => void;
}

export default function ScoringSettings({
  passingScore,
  showScoreImmediately,
  allowRetakes,
  maxAttempts,
  onUpdate,
}: ScoringSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Award className="w-5 h-5" />
          <span>Scoring Settings</span>
        </CardTitle>
        <CardDescription>
          Configure grading and scoring options for your quiz
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Passing Score */}
        <div className="space-y-2">
          <Label htmlFor="passingScore">Passing Score (%)</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="passingScore"
              type="number"
              value={passingScore}
              onChange={(e) =>
                onUpdate({ passingScore: parseInt(e.target.value) || 0 })
              }
              min="0"
              max="100"
              className="w-32"
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">%</span>
          </div>
          <p className="text-sm text-gray-500">
            Students must score at least this percentage to pass
          </p>
        </div>

        {/* Show Score Immediately */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Label
              htmlFor="showScoreImmediately"
              className="text-base font-medium"
            >
              Show score immediately after submission
            </Label>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Students can see their score and feedback right after completing
              the quiz
            </p>
          </div>
          <Switch
            id="showScoreImmediately"
            checked={showScoreImmediately}
            onCheckedChange={(checked) =>
              onUpdate({ showScoreImmediately: checked })
            }
          />
        </div>

        {/* Allow Retakes */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Label htmlFor="allowRetakes" className="text-base font-medium">
              Allow retakes
            </Label>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Students can retake the quiz if they don&apos;t pass
            </p>
          </div>
          <Switch
            id="allowRetakes"
            checked={allowRetakes}
            onCheckedChange={(checked) => onUpdate({ allowRetakes: checked })}
          />
        </div>

        {/* Max Attempts */}
        {allowRetakes && (
          <div className="space-y-2">
            <Label htmlFor="maxAttempts">Maximum Attempts</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="maxAttempts"
                type="number"
                value={maxAttempts}
                onChange={(e) =>
                  onUpdate({ maxAttempts: parseInt(e.target.value) || 1 })
                }
                min="1"
                max="10"
                className="w-32"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                attempts
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Maximum number of times students can retake the quiz
            </p>
          </div>
        )}

        {/* Warning */}
        {showScoreImmediately && !allowRetakes && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Students will see their score immediately but won&apos;t be able
              to retake the quiz. Consider allowing retakes for better learning
              outcomes.
            </AlertDescription>
          </Alert>
        )}

        {/* Scoring Recommendations */}
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
            💡 Scoring Recommendations
          </h4>
          <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
            <li>
              • <strong>Passing Score:</strong> 70-80% is typical for most
              assessments
            </li>
            <li>
              • <strong>Retakes:</strong> Allow 2-3 attempts for better learning
            </li>
            <li>
              • <strong>Immediate Feedback:</strong> Helps students learn from
              mistakes
            </li>
            <li>
              • <strong>Essay Questions:</strong> May require manual grading
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
