'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { handleEmailConfirmation } from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

function AuthCallbackPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, checkAndRedirect } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the access token and refresh token from URL parameters
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          setStatus('error');
          setMessage(errorDescription || 'Authentication failed');
          toast.error(errorDescription || 'Authentication failed');
          setTimeout(() => router.push('/login'), 3000);
          return;
        }

        if (!accessToken || !refreshToken) {
          setStatus('error');
          setMessage('Invalid callback parameters');
          toast.error('Invalid callback parameters');
          setTimeout(() => router.push('/login'), 3000);
          return;
        }

        // Set the session with the tokens
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          setStatus('error');
          setMessage(sessionError.message);
          toast.error(sessionError.message);
          setTimeout(() => router.push('/login'), 3000);
          return;
        }

        // Handle email confirmation
        const user = await handleEmailConfirmation();

        if (!user) {
          setStatus('error');
          setMessage('Failed to fetch user profile');
          toast.error('Failed to fetch user profile');
          setTimeout(() => router.push('/login'), 3000);
          return;
        }

        // Set user in context
        setUser(user);

        setStatus('success');
        setMessage('Email verified successfully!');
        toast.success('Email verified successfully!');

        // Redirect based on profile completion
        setTimeout(() => {
          checkAndRedirect(user);
        }, 1500);
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred');
        toast.error('An unexpected error occurred');
        setTimeout(() => router.push('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router, setUser, checkAndRedirect]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            {status === 'loading' && 'Verifying your email...'}
            {status === 'success' && 'Email verified successfully!'}
            {status === 'error' && 'Verification failed'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {status === 'loading' && (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Please wait while we verify your email address...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <p className="text-sm text-muted-foreground">
                Your email has been verified successfully. Redirecting you to
                your dashboard...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="w-8 h-8 text-red-500" />
              <p className="text-sm text-muted-foreground">{message}</p>
              <p className="text-xs text-muted-foreground">
                Redirecting to login page...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <AuthCallbackPageContent />
    </Suspense>
  );
}
