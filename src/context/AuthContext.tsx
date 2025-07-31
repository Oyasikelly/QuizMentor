'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/auth';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  logout: () => Promise<void>;
  checkAndRedirect: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Helper function to get redirect path based on role and profile completion
  const getRedirectPath = (user: User) => {
    if (!user.profileComplete) {
      // Redirect to complete profile page based on role
      switch (user.role) {
        case 'student':
          return '/student/complete-profile';
        case 'teacher':
          return '/teacher/complete-profile';
        case 'admin':
        case 'super_admin':
          return '/admin/complete-profile';
        default:
          return '/login';
      }
    } else {
      // Redirect to dashboard based on role
      switch (user.role) {
        case 'student':
          return '/student';
        case 'teacher':
          return '/teacher';
        case 'admin':
          return '/admin';
        case 'super_admin':
          return '/admin'; // Super admins use admin dashboard
        default:
          return '/login';
      }
    }
  };

  // Function to check and redirect user based on their profile completion
  const checkAndRedirect = useCallback(
    (user: User) => {
      const redirectPath = getRedirectPath(user);
      const currentPath = window.location.pathname;

      // Prevent redirect loop - only redirect if we're not already on the target path
      if (currentPath !== redirectPath) {
        console.log(
          'Redirecting from',
          currentPath,
          'to',
          redirectPath,
          'for user:',
          user.role,
          'profileComplete:',
          user.profileComplete
        );
        router.push(redirectPath);
      }
    },
    [router]
  );

  // Function to sync user to database if not found
  const syncUserToDatabase = async (supabaseUser: {
    id: string;
    email?: string;
    user_metadata?: {
      name?: string;
      role?: string;
      organizationId?: string;
    };
    email_confirmed_at?: string | null;
  }): Promise<User | null> => {
    // Early return if email is missing
    if (!supabaseUser.email) {
      console.error('Cannot sync user: email is missing');
      return null;
    }
    try {
      const response = await fetch('/api/auth/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: supabaseUser.id,
          email: supabaseUser.email,
          name: supabaseUser.user_metadata?.name || supabaseUser.email,
          role: supabaseUser.user_metadata?.role || 'student',
          emailVerified: supabaseUser.email_confirmed_at !== null,
          organizationId: supabaseUser.user_metadata?.organizationId || '',
        }),
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error syncing user to database:', error);
      return null;
    }
  };

  // Simple function to get user from your database
  const getUserFromDatabase = async (userId: string): Promise<User | null> => {
    try {
      const response = await fetch(`/api/auth/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error getting user from database:', error);
      return null;
    }
  };

  useEffect(() => {
    // Check for existing session on mount
    const checkUser = async () => {
      try {
        // 1. Get session from Supabase
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          // 2. Get user from your database
          let userProfile = await getUserFromDatabase(session.user.id);

          // If user profile not found, try to sync from Supabase
          if (!userProfile && session.user.email) {
            console.log('User profile not found, attempting to sync...');
            userProfile = await syncUserToDatabase(session.user);
          }

          if (userProfile) {
            setUser(userProfile);
            // Only redirect if we're on the login page (not register page)
            const pathname = window.location.pathname;
            if (pathname === '/login') {
              const redirectPath = getRedirectPath(userProfile);
              router.push(redirectPath);
            }
          }
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        setLoading(false);
      }
    };

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);

      if (event === 'SIGNED_IN' && session?.user) {
        let userProfile = await getUserFromDatabase(session.user.id);

        // If user profile not found, try to sync from Supabase
        if (!userProfile && session.user.email) {
          console.log(
            'User profile not found during sign in, attempting to sync...'
          );
          userProfile = await syncUserToDatabase(session.user);
        }

        if (userProfile) {
          setUser(userProfile);
          checkAndRedirect(userProfile);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        router.push('/login');
      }
    });

    checkUser();

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, [router, checkAndRedirect]);

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
      router.push('/login');
      toast.success('Successfully logged out');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, logout, checkAndRedirect }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
