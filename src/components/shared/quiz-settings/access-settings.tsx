'use client';

import { Users, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface AccessSettingsProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  requirePassword: boolean;
  password: string | undefined;
  onUpdate: (updates: {
    startDate?: Date;
    endDate?: Date;
    requirePassword?: boolean;
    password?: string;
  }) => void;
}

export default function AccessSettings({
  startDate,
  endDate,
  requirePassword,
  password,
  onUpdate,
}: AccessSettingsProps) {
  return (
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
      <CardContent className="space-y-6">
        {/* Availability Dates */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-white">
            Availability
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Available From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => onUpdate({ startDate: date })}
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
                      !endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => onUpdate({ endDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {startDate && endDate && startDate >= endDate && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                End date must be after start date
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Password Protection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label
                htmlFor="requirePassword"
                className="text-base font-medium"
              >
                Require password
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Students must enter a password to access the quiz
              </p>
            </div>
            <Switch
              id="requirePassword"
              checked={requirePassword}
              onCheckedChange={(checked) =>
                onUpdate({ requirePassword: checked })
              }
            />
          </div>

          {requirePassword && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password || ''}
                onChange={(e) => onUpdate({ password: e.target.value })}
                placeholder="Enter quiz password"
                className="max-w-xs"
              />
              <p className="text-sm text-gray-500">
                Share this password with students who should have access
              </p>
            </div>
          )}
        </div>

        {/* Access Recommendations */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            💡 Access Control Tips
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>
              • <strong>Availability:</strong> Set clear start and end dates
            </li>
            <li>
              • <strong>Password:</strong> Use for sensitive or private quizzes
            </li>
            <li>
              • <strong>Time Windows:</strong> Consider student time zones
            </li>
            <li>
              • <strong>Communication:</strong> Inform students of access
              details
            </li>
          </ul>
        </div>

        {/* Current Status */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            Current Access Status
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">
                Available From:
              </span>
              <span className="font-medium">
                {startDate ? format(startDate, 'PPP') : 'Not set'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">
                Available Until:
              </span>
              <span className="font-medium">
                {endDate ? format(endDate, 'PPP') : 'Not set'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">
                Password Protected:
              </span>
              <span className="font-medium">
                {requirePassword ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
