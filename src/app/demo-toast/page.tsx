'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

export default function ToastDemoPage() {
  const showSuccessToast = () => {
    toast.success('This is a success message!', {
      description: 'Everything is working perfectly.',
    });
  };

  const showErrorToast = () => {
    toast.error('This is an error message!', {
      description: 'Something went wrong. Please try again.',
    });
  };

  const showInfoToast = () => {
    toast.info('This is an info message!', {
      description: 'Here is some useful information.',
    });
  };

  const showWarningToast = () => {
    toast.warning('This is a warning message!', {
      description: 'Please be careful with this action.',
    });
  };

  const showCustomToast = () => {
    toast('Custom toast with icon', {
      description: 'This toast has a custom icon and styling.',
      icon: <CheckCircle className="w-4 h-4" />,
    });
  };

  const showPromiseToast = () => {
    const promise = new Promise((resolve) => {
      setTimeout(() => resolve('Data loaded successfully!'), 2000);
    });

    toast.promise(promise, {
      loading: 'Loading your data...',
      success: (data) => `${data}`,
      error: 'Failed to load data',
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Toast Notification Demo</h1>
          <p className="text-muted-foreground">
            Test different types of toast notifications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Success Toast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Shows a green success message with a checkmark icon.
              </p>
              <Button onClick={showSuccessToast} className="w-full">
                Show Success Toast
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                Error Toast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Shows a red error message with an X icon.
              </p>
              <Button
                onClick={showErrorToast}
                className="w-full"
                variant="destructive"
              >
                Show Error Toast
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" />
                Info Toast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Shows a blue info message with an info icon.
              </p>
              <Button
                onClick={showInfoToast}
                className="w-full"
                variant="outline"
              >
                Show Info Toast
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                Warning Toast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Shows a yellow warning message with an alert icon.
              </p>
              <Button
                onClick={showWarningToast}
                className="w-full"
                variant="outline"
              >
                Show Warning Toast
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Toast</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Shows a toast with a custom icon and styling.
              </p>
              <Button
                onClick={showCustomToast}
                className="w-full"
                variant="outline"
              >
                Show Custom Toast
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Promise Toast</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Shows a loading toast that resolves to success.
              </p>
              <Button
                onClick={showPromiseToast}
                className="w-full"
                variant="outline"
              >
                Show Promise Toast
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Toast Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Rich colors and icons for different message types</li>
              <li>Auto-dismiss after 4 seconds (configurable)</li>
              <li>Manual close button</li>
              <li>Positioned in top-right corner</li>
              <li>Supports descriptions and custom icons</li>
              <li>Promise-based loading states</li>
              <li>Accessible and keyboard navigable</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
