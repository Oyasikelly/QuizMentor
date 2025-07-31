import { supabase } from './supabase';
import {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from '@/types/auth';

// Simple function to sync user from Supabase to your database
async function syncUserToDatabase(
  supabaseUser: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  role: string,
  name: string,
  organizationId: string
) {
  try {
    const response = await fetch('/api/auth/sync-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: supabaseUser.id,
        email: supabaseUser.email,
        name: name,
        role: role,
        emailVerified: supabaseUser.email_confirmed_at !== null,
        organizationId: organizationId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to sync user to database');
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Error syncing user to database:', error);
    throw error;
  }
}

// Simple function to get user from your database
async function getUserFromDatabase(userId: string) {
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
}

export async function loginUser(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  try {
    console.log('Login attempt:', credentials.email, 'Role:', credentials.role);

    // 1. Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Login failed. No user data returned.');
    }

    console.log('Supabase login successful for user:', data.user.id);

    // 2. Get user from your database
    const userProfile = await getUserFromDatabase(data.user.id);

    if (!userProfile) {
      throw new Error('User profile not found in database.');
    }

    // 3. Check if role matches
    if (userProfile.role !== credentials.role) {
      throw new Error(
        `This account is registered as a ${userProfile.role}. Please select the correct role.`
      );
    }

    return {
      user: userProfile,
      token: data.session?.access_token || '',
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function registerUser(
  credentials: RegisterCredentials
): Promise<AuthResponse> {
  try {
    console.log(
      'Registration attempt:',
      credentials.email,
      'Role:',
      credentials.role
    );

    // 1. Register with Supabase
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          name: credentials.name,
          role: credentials.role,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Registration failed. No user data returned.');
    }

    console.log('Supabase registration successful for user:', data.user.id);

    // 2. Sync user to your database
    await syncUserToDatabase(
      data.user,
      credentials.role,
      credentials.name,
      credentials.organizationId
    );

    // 3. Get the complete user profile
    const completeUser = await getUserFromDatabase(data.user.id);

    if (!completeUser) {
      throw new Error('Failed to create user profile in database.');
    }

    return {
      user: completeUser,
      token: data.session?.access_token || '',
      message:
        'Registration successful! Please check your email to verify your account.',
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    console.log('User logged out');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    // 1. Get session from Supabase
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session?.user) {
      return null;
    }

    // 2. Get user from your database
    const userProfile = await getUserFromDatabase(session.user.id);

    return userProfile;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

export async function handleEmailConfirmation(): Promise<User | null> {
  try {
    // 1. Get authenticated user from Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      throw new Error('No authenticated user found');
    }

    // 2. Update email verification status in your database
    const response = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: user.id }),
    });

    if (!response.ok) {
      throw new Error('Failed to verify email');
    }

    // 3. Get updated user profile
    const userProfile = await getUserFromDatabase(user.id);

    return userProfile;
  } catch (error) {
    console.error('Email confirmation error:', error);
    return null;
  }
}
