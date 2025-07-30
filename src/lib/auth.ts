import { supabase } from './supabase';
import {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from '@/types/auth';

export async function loginUser(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      // Provide user-friendly error messages
      let errorMessage = 'Login failed. Please try again.';
      if (error.message.includes('Invalid login credentials')) {
        errorMessage =
          'Invalid email or password. Please check your credentials and try again.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage =
          'Please check your email and confirm your account before logging in.';
      } else if (error.message.includes('Too many requests')) {
        errorMessage =
          'Too many login attempts. Please wait a moment and try again.';
      }
      throw new Error(errorMessage);
    }

    if (!data.user) {
      throw new Error('No user returned from authentication');
    }

    // Get user profile from our database
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      throw new Error('Failed to fetch user profile');
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        name: profile?.name || data.user.user_metadata?.name || 'User',
        role: profile?.role || 'student',
        createdAt: new Date(data.user.created_at || new Date()),
        updatedAt: new Date(data.user.updated_at || new Date()),
        email_confirmed_at: data.user.email_confirmed_at,
        // Include profile fields
        academicLevel: profile?.academicLevel,
        classYear: profile?.classYear,
        phoneNumber: profile?.phoneNumber,
        department: profile?.department,
        institution: profile?.institution,
      },
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
      // Provide user-friendly error messages
      let errorMessage = 'Registration failed. Please try again.';
      if (error.message.includes('User already registered')) {
        errorMessage =
          'An account with this email already exists. Please try logging in instead.';
      } else if (error.message.includes('Password should be at least')) {
        errorMessage = 'Password must be at least 6 characters long.';
      } else if (error.message.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      }
      throw new Error(errorMessage);
    }

    if (!data.user) {
      throw new Error('No user returned from registration');
    }

    // Create user profile in our database
    const { error: profileError } = await supabase.from('users').insert({
      id: data.user.id,
      email: credentials.email,
      name: credentials.name,
      role: credentials.role,
      organization_id: 'fupre-org', // Default organization
    });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Don't throw here as the user was created successfully
    }

    return {
      user: {
        id: data.user.id,
        email: credentials.email,
        name: credentials.name,
        role: credentials.role,
        createdAt: new Date(data.user.created_at || new Date()),
        updatedAt: new Date(data.user.updated_at || new Date()),
        email_confirmed_at: data.user.email_confirmed_at,
      },
      token: data.session?.access_token || '',
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
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Get user profile from our database
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile fetch error:', profileError);
      return null;
    }

    return {
      id: user.id,
      email: user.email!,
      name: profile?.name || user.user_metadata?.name || 'User',
      role: profile?.role || 'student',
      createdAt: new Date(user.created_at || new Date()),
      updatedAt: new Date(user.updated_at || new Date()),
      email_confirmed_at: user.email_confirmed_at,
      // Include profile fields
      academicLevel: profile?.academicLevel,
      classYear: profile?.classYear,
      phoneNumber: profile?.phoneNumber,
      department: profile?.department,
      institution: profile?.institution,
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}
