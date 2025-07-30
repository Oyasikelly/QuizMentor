'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from '@/components/toggle-switch';
import {
  BookOpen,
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Shield,
  BarChart3,
  CheckCircle,
} from 'lucide-react';
import { loginUser } from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const { user, setUser, checkAndRedirect } = useAuth();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Check for email verification message from registration
  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      toast.success(message);
    }
  }, [searchParams]);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      checkAndRedirect(user);
    }
  }, [user, checkAndRedirect]);

  // Email validation
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Only validate email and password
  const validateForm = (): boolean => {
    if (!formData.email) {
      toast.error('Email is required');
      return false;
    }
    if (!isValidEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      toast.error('Password is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
        role: activeTab, // Send the selected role
      });

      setUser(response.user);
      toast.success(`Welcome back, ${response.user.name}!`);

      // Use the new profile completion check
      checkAndRedirect(response.user);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Invalid email or password. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'student' | 'teacher') => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const demoUser = {
        id: `demo-${role}-1`,
        email: `demo.${role}@quizmentor.com`,
        name: role === 'student' ? 'Demo Student' : 'Demo Teacher',
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
        // Demo users have complete profiles for testing
        academicLevel: role === 'student' ? 'Undergraduate' : undefined,
        classYear: role === 'student' ? '2024' : undefined,
        phoneNumber: role === 'student' ? '+1234567890' : undefined,
        department: role === 'teacher' ? 'Computer Science' : undefined,
        institution: role === 'teacher' ? 'Demo University' : undefined,
      };

      setUser(demoUser);
      toast.success(`Welcome to the ${role} demo!`);
      checkAndRedirect(demoUser);
    } catch {
      toast.error('Demo login failed. Please try again.');
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
                  Welcome back
                </h2>
                <p className="text-muted-foreground mt-2">
                  Sign in to your QuizMentor account
                </p>
              </div>
            </div>

            {/* Login Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Sign In</CardTitle>
                <CardDescription className="text-center">
                  Choose your role and enter your credentials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Role Selection */}
                <Tabs
                  value={activeTab}
                  onValueChange={(value) =>
                    setActiveTab(value as 'student' | 'teacher')
                  }
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

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange('email', e.target.value)
                        }
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange('password', e.target.value)
                        }
                        className="pl-10 pr-10"
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

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>

                {/* Demo Login Buttons */}
                <div className="space-y-3">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or try demo
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleDemoLogin('student')}
                      disabled={isLoading}
                      className="text-sm"
                    >
                      Demo Student
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDemoLogin('teacher')}
                      disabled={isLoading}
                      className="text-sm"
                    >
                      Demo Teacher
                    </Button>
                  </div>
                </div>

                {/* Sign Up Link */}
                <div className="text-center text-sm">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/register"
                    className="font-medium text-primary hover:underline"
                  >
                    Sign up
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
