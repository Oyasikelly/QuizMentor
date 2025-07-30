'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User } from '@/types/auth';
import { supabase } from '@/lib/supabase';
import { getCurrentUser, logoutUser } from '@/lib/auth';
import { checkProfileCompletion } from '@/lib/profile-utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

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

  // Function to check profile completion and redirect accordingly
  const checkAndRedirect = (user: User) => {
    const profileStatus = checkProfileCompletion(user);

    if (!profileStatus.isComplete) {
      // Show toast message about incomplete profile
      const missingFieldsText = profileStatus.missingFields.join(', ');
      toast.info(
        `Welcome! Please complete your profile by adding: ${missingFieldsText}`,
        {
          duration: 5000,
        }
      );

      // Redirect to complete profile page
      router.push(profileStatus.redirectPath);
    } else {
      // Profile is complete, redirect to dashboard
      router.push(profileStatus.redirectPath);
    }
  };

  useEffect(() => {
    // Check for existing session on mount
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          // Check profile completion on initial load
          checkAndRedirect(currentUser);
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          // Check profile completion after sign in
          checkAndRedirect(currentUser);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
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
