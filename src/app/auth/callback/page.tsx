'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import { checkProfileCompletion } from '@/lib/profile-utils';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, checkAndRedirect } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the access token and refresh token from URL params
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

        if (!accessToken) {
          setStatus('error');
          setMessage('No access token found');
          toast.error('No access token found');
          setTimeout(() => router.push('/login'), 3000);
          return;
        }

        // Set the session manually
        const { data, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

        if (sessionError) {
          setStatus('error');
          setMessage('Failed to set session');
          toast.error('Failed to set session');
          setTimeout(() => router.push('/login'), 3000);
          return;
        }

        // Get the current user
        const currentUser = await getCurrentUser();

        if (!currentUser) {
          setStatus('error');
          setMessage('Failed to get user information');
          toast.error('Failed to get user information');
          setTimeout(() => router.push('/login'), 3000);
          return;
        }

        // Set user in context
        setUser(currentUser);

        // Check profile completion and redirect
        const profileStatus = checkProfileCompletion(currentUser);

        if (!profileStatus.isComplete) {
          setStatus('success');
          setMessage(
            'Email confirmed! Redirecting to complete your profile...'
          );
          toast.success('Email confirmed! Please complete your profile.');

          // Redirect to complete profile page
          setTimeout(() => {
            checkAndRedirect(currentUser);
          }, 2000);
        } else {
          setStatus('success');
          setMessage('Email confirmed! Redirecting to dashboard...');
          toast.success('Email confirmed! Welcome to QuizMentor.');

          // Redirect to dashboard
          setTimeout(() => {
            checkAndRedirect(currentUser);
          }, 2000);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred');
        toast.error('An unexpected error occurred');
        setTimeout(() => router.push('/login'), 3000);
      }
    };

    handleAuthCallback();
  }, [searchParams, router, setUser, checkAndRedirect]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            {status === 'loading' && (
              <Loader2 className="w-5 h-5 animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            {status === 'error' && (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            {status === 'loading' && 'Verifying Email'}
            {status === 'success' && 'Email Confirmed'}
            {status === 'error' && 'Verification Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">{message}</p>
          {status === 'loading' && (
            <div className="mt-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
