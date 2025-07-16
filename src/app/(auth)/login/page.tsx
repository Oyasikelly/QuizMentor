'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  CheckCircle,
  AlertCircle,
  BarChart3,
} from 'lucide-react';

// Add types for organization, unit, and subject
interface Organization {
  id: string;
  name: string;
}
interface Unit {
  id: string;
  name: string;
  organizationId: string;
}
interface Subject {
  id: string;
  name: string;
  organizationId: string;
  unitId?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Only email and password in formData
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Email validation
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  // Only validate email and password
  const validateForm = (): boolean => {
    if (!formData.email) {
      setError('Email is required');
      return false;
    }
    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        role: activeTab,
      };
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed. Please try again.');
        setIsLoading(false);
        return;
      }
      localStorage.setItem('user', JSON.stringify(data.user));
      // Profile completion check (as before)
      if (data.user.role === 'student') {
        if (
          !data.user.academicLevel ||
          !data.user.classYear ||
          !data.user.phoneNumber
        ) {
          router.push('/student/complete-profile');
        } else {
          router.push('/student');
        }
      } else if (data.user.role === 'teacher') {
        if (
          !data.user.department ||
          !data.user.subjectsTaught ||
          !data.user.phoneNumber
        ) {
          router.push('/teacher/complete-profile');
        } else {
          router.push('/teacher');
        }
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'student' | 'teacher') => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const demoUser = {
        id: `demo-${role}-1`,
        email: `demo.${role}@quizmentor.com`,
        name: role === 'student' ? 'Demo Student' : 'Demo Teacher',
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      localStorage.setItem('user', JSON.stringify(demoUser));
      router.push(role === 'student' ? '/student' : '/teacher');
    } catch (err) {
      setError('Demo login failed. Please try again.');
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
        <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center px-2 py-6 sm:px-6 lg:px-8 bg-background">
          <div className="w-full max-w-md mx-auto flex flex-col gap-8">
            {/* Login Header */}
            <div className="text-center mb-4 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
                Welcome Back
              </h2>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                Sign in to access your personalized learning experience
              </p>
            </div>

            {/* Login Card */}
            <Card className="shadow-lg rounded-xl">
              <CardContent className="p-4 sm:p-6">
                {/* Role Tabs */}
                <Tabs
                  value={activeTab}
                  onValueChange={(value) =>
                    setActiveTab(value as 'student' | 'teacher')
                  }
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6">
                    <TabsTrigger
                      value="student"
                      className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                    >
                      <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Student</span>
                      <span className="sm:hidden">Student</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="teacher"
                      className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                    >
                      <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Teacher</span>
                      <span className="sm:hidden">Teacher</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="student">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="student-email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="student-email"
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
                        <Label htmlFor="student-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="student-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) =>
                              handleInputChange('password', e.target.value)
                            }
                            className="pl-10 pr-10"
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {error && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          'Sign in as Student'
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="teacher">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="teacher-email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="teacher-email"
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
                        <Label htmlFor="teacher-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="teacher-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) =>
                              handleInputChange('password', e.target.value)
                            }
                            className="pl-10 pr-10"
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {error && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          'Sign in as Teacher'
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                {/* Demo Access */}
                <div className="mt-4 sm:mt-6">
                  <div className="border-t border-border my-3 sm:my-4"></div>
                  <div className="text-center">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                      Try the platform
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDemoLogin('student')}
                        disabled={isLoading}
                        className="flex-1 text-xs sm:text-sm"
                      >
                        Demo Student
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDemoLogin('teacher')}
                        disabled={isLoading}
                        className="flex-1 text-xs sm:text-sm"
                      >
                        Demo Teacher
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Additional Links */}
                <div className="mt-6 text-center space-y-2">
                  <Link
                    href="/register"
                    className="text-sm text-primary hover:underline"
                  >
                    Don't have an account? Sign up
                  </Link>
                  <div className="text-sm">
                    <Link
                      href="/forgot-password"
                      className="text-muted-foreground hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security & Trust Indicators */}
            <div className="mt-4 sm:mt-6 text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>GDPR Compliant</span>
                </div>
              </div>
            </div>

            {/* Features Preview */}
            <div className="mt-8 flex flex-row flex-wrap md:flex-nowrap gap-2 sm:gap-4 items-stretch justify-center text-center">
              <Card className="w-32 sm:w-40 md:w-48 lg:w-56 h-40 sm:h-44 md:h-48 flex-shrink-0">
                <CardContent className="p-3 sm:p-4 flex flex-col items-center justify-center h-full">
                  <div className="bg-primary/10 rounded-lg p-2 sm:p-3 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center mb-2 sm:mb-3">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xs sm:text-sm mb-1 sm:mb-2">
                    AI-Powered Quizzes
                  </h3>
                  <p className="text-xs text-muted-foreground text-center leading-tight">
                    Generate intelligent assessments from your materials
                  </p>
                </CardContent>
              </Card>
              <Card className="w-32 sm:w-40 md:w-48 lg:w-56 h-40 sm:h-44 md:h-48 flex-shrink-0">
                <CardContent className="p-3 sm:p-4 flex flex-col items-center justify-center h-full">
                  <div className="bg-primary/10 rounded-lg p-2 sm:p-3 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center mb-2 sm:mb-3">
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xs sm:text-sm mb-1 sm:mb-2">
                    Personalized Learning
                  </h3>
                  <p className="text-xs text-muted-foreground text-center leading-tight">
                    Adaptive feedback and study recommendations
                  </p>
                </CardContent>
              </Card>
              <Card className="w-32 sm:w-40 md:w-48 lg:w-56 h-40 sm:h-44 md:h-48 flex-shrink-0">
                <CardContent className="p-3 sm:p-4 flex flex-col items-center justify-center h-full">
                  <div className="bg-primary/10 rounded-lg p-2 sm:p-3 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center mb-2 sm:mb-3">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xs sm:text-sm mb-1 sm:mb-2">
                    Advanced Analytics
                  </h3>
                  <p className="text-xs text-muted-foreground text-center leading-tight">
                    Detailed insights into student performance
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
