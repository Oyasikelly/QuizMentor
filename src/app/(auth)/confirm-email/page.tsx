'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { handleEmailConfirmation } from '@/lib/auth';

function ConfirmEmailPageContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        setStatus('loading');

        // Get token from URL params
        const token = searchParams.get('token');

        if (!token) {
          setStatus('error');
          setMessage(
            'No confirmation token found. Please check your email for the correct link.'
          );
          return;
        }

        // Handle email confirmation
        const user = await handleEmailConfirmation();

        if (user) {
          setStatus('success');
          setMessage(
            'Email confirmed successfully! You can now log in to your account.'
          );

          // Redirect to login after a short delay
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(
            'Email confirmation failed. Please try again or contact support.'
          );
        }
      } catch (error) {
        setStatus('error');
        setMessage(
          'An error occurred during email confirmation. Please try again.'
        );
        console.error('Email confirmation error:', error);
      }
    };

    confirmEmail();
  }, [searchParams, router]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-8 w-8 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'error':
        return <XCircle className="h-8 w-8 text-red-500" />;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'loading':
        return 'Confirming Email...';
      case 'success':
        return 'Email Confirmed!';
      case 'error':
        return 'Confirmation Failed';
    }
  };

  const getStatusDescription = () => {
    switch (status) {
      case 'loading':
        return 'Please wait while we confirm your email address.';
      case 'success':
        return 'Your email has been successfully confirmed. You will be redirected to the login page shortly.';
      case 'error':
        return 'We encountered an issue confirming your email. Please try again or contact support.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">{getStatusIcon()}</div>
          <CardTitle className="text-2xl">{getStatusTitle()}</CardTitle>
          <CardDescription>{getStatusDescription()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <Alert variant={status === 'success' ? 'default' : 'destructive'}>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <div className="space-y-2">
              <Button onClick={() => router.push('/login')} className="w-full">
                Go to Login
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/request-reset')}
                className="w-full"
              >
                Request New Confirmation
              </Button>
            </div>
          )}

          {status === 'success' && (
            <Button onClick={() => router.push('/login')} className="w-full">
              Continue to Login
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <ConfirmEmailPageContent />
    </Suspense>
  );
}
