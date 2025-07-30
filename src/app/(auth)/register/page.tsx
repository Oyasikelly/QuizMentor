'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Eye, EyeOff, BookOpen, Shield } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, BarChart3 } from 'lucide-react';
import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from '@/components/toggle-switch';
import { registerUser } from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function RegisterPage() {
  const router = useRouter();
  const { user, setUser, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    organizationId: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);

  // Remove the automatic redirect logic - users should be able to register new accounts
  // even if they have an existing session

  // Fetch organizations on component mount
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoadingOrgs(true);
        const response = await fetch('/api/organizations');

        if (!response.ok) {
          throw new Error('Failed to fetch organizations');
        }

        const data = await response.json();
        setOrganizations(data.organizations);

        // Don't auto-select - user must choose
      } catch (error) {
        console.error('Error fetching organizations:', error);
        toast.error('Failed to load organizations. Please try again.');
      } finally {
        setLoadingOrgs(false);
      }
    };

    fetchOrganizations();
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out. You can now register a new account.');
  };

  const handleInputChange = (
    field:
      | 'name'
      | 'email'
      | 'password'
      | 'confirmPassword'
      | 'role'
      | 'organizationId',
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Please enter a valid email');
      return false;
    }
    if (!formData.password) {
      toast.error('Password is required');
      return false;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    if (!formData.organizationId) {
      toast.error('Please select an organization');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role as 'student' | 'teacher',
        organizationId: formData.organizationId,
      });

      // Show success message about email confirmation
      toast.success(
        response.message ||
          'Registration successful! Please check your email to confirm your account.'
      );

      // Redirect to login page with confirmation message
      router.push(
        '/login?message=Please check your email to confirm your account before logging in.'
      );
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 px-2 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between w-full max-w-5xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="bg-primary rounded-lg p-2">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold">QuizMentor</h1>
            </div>
            {/* Theme Toggle */}
            <ModeToggle />
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md space-y-8">
            {/* Welcome Section */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="bg-primary rounded-full p-3">
                  <Shield className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  Create your account
                </h2>
                <p className="text-muted-foreground mt-2">
                  Join QuizMentor to start your learning journey
                </p>
              </div>
            </div>

            {/* Notice for logged-in users */}
            {user && (
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      You're currently logged in as <strong>{user.name}</strong>{' '}
                      ({user.role}).
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                      To register a new account, please logout first.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="ml-4"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            )}

            {/* Register Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Sign Up</CardTitle>
                <CardDescription className="text-center">
                  Choose your role and create your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Role Selection */}
                <Tabs
                  value={formData.role}
                  onValueChange={(value) => handleInputChange('role', value)}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="student"
                      className="flex items-center gap-2"
                    >
                      <GraduationCap className="w-4 h-4" />
                      Student
                    </TabsTrigger>
                    <TabsTrigger
                      value="teacher"
                      className="flex items-center gap-2"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Teacher
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Register Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Select
                      value={formData.organizationId}
                      onValueChange={(value) =>
                        handleInputChange('organizationId', value)
                      }
                      disabled={isLoading || loadingOrgs}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            loadingOrgs
                              ? 'Loading organizations...'
                              : 'Choose your organization'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {organizations.map((org: any) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange('password', e.target.value)
                        }
                        className="pr-10"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange('confirmPassword', e.target.value)
                        }
                        className="pr-10"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 mr-2 animate-spin border-2 border-current border-t-transparent rounded-full" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>

                {/* Sign In Link */}
                <div className="text-center text-sm">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="font-medium text-primary hover:underline"
                  >
                    Sign in
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
