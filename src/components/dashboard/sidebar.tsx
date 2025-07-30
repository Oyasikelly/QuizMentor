'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThemeToggle } from '@/components/dashboard/theme-toggle';
import {
  BookOpen,
  BarChart3,
  Home,
  Settings,
  Trophy,
  Users,
  FileText,
  Plus,
  List,
  TrendingUp,
  Upload,
  Sparkles,
  Bot,
} from 'lucide-react';

interface SidebarProps {
  user: {
    id: string;
    role: 'student' | 'teacher';
    organizationId?: string;
    institution?: string;
    department?: string;
    studentId?: string;
    name?: string;
    email?: string;
  };
  className?: string;
}

const studentNavItems = [
  {
    title: 'Dashboard',
    href: '/student',
    icon: Home,
  },
  {
    title: 'Available Quizzes',
    href: '/student/quizzes',
    icon: BookOpen,
  },
  {
    title: 'My Progress',
    href: '/student/progress',
    icon: TrendingUp,
  },
  {
    title: 'Achievements',
    href: '/student/achievements',
    icon: Trophy,
  },
  {
    title: 'AI Chat',
    href: '/student/ai-chat',
    icon: Bot,
  },
  {
    title: 'Settings',
    href: '/student/settings',
    icon: Settings,
  },
];

const teacherNavItems = [
  {
    title: 'Dashboard',
    href: '/teacher',
    icon: Home,
  },
  {
    title: 'Create Quiz',
    href: '/teacher/create-quiz',
    icon: Plus,
  },
  {
    title: 'Manage Quizzes',
    href: '/teacher/manage-quizzes',
    icon: List,
  },
  {
    title: 'Analytics',
    href: '/teacher/analytics',
    icon: BarChart3,
  },
  {
    title: 'Students',
    href: '/teacher/students',
    icon: Users,
  },
  {
    title: 'Question Bank',
    href: '/teacher/question-bank',
    icon: FileText,
  },
  {
    title: 'AI Generation Hub',
    href: '/teacher/ai-generation',
    icon: Sparkles,
  },
  {
    title: 'Settings',
    href: '/teacher/settings',
    icon: Settings,
  },
];

export function Sidebar({ user, className }: SidebarProps) {
  const pathname = usePathname();
  const navItems = user.role === 'student' ? studentNavItems : teacherNavItems;

  return (
    <div className={cn('flex h-full flex-col', className)}>
      {/* Logo/Brand */}
      <div className="flex h-16 items-center border-b px-6 gap-3">
        <div className="bg-primary/10 rounded-lg p-2 flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-lg font-bold tracking-tight">QuizMentor</h2>
      </div>

      {/* Organization/Institution Display */}
      {user.organizationId && (
        <div className="px-6 py-2 text-xs text-muted-foreground">
          Org ID: {user.organizationId}
        </div>
      )}
      {user.institution && (
        <div className="px-6 py-1 text-xs text-muted-foreground">
          {user.institution}
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-2">
          <div className="px-3 py-2">
            <h3 className="mb-2 px-4 text-sm font-medium">Navigation</h3>
            <div className="space-y-1">
              {navItems.map((item) => {
                // Mark 'Students' active for both /teacher/students and /teacher/student/[id]
                const isActive =
                  pathname === item.href ||
                  (item.href === '/teacher/students' &&
                    pathname.startsWith('/teacher/student/')) ||
                  (item.href === '/teacher/question-bank' &&
                    pathname.startsWith('/teacher/question-bank')) ||
                  (item.href === '/student/ai-chat' &&
                    pathname.startsWith('/student/ai-chat'));
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      className="w-full justify-start"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="px-3 py-2">
            <h3 className="mb-2 px-4 text-sm font-medium">Quick Actions</h3>
            <div className="space-y-1">
              {user.role === 'teacher' ? (
                <>
                  <Link href="/teacher/quick-create-quiz">
                    <Button variant="ghost" className="w-full justify-start">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Quiz
                    </Button>
                  </Link>
                  <Link href="/teacher/quick-create-question">
                    <Button variant="ghost" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      Create Question
                    </Button>
                  </Link>
                  <Link href="/teacher/quick-import-questions">
                    <Button variant="ghost" className="w-full justify-start">
                      <Upload className="mr-2 h-4 w-4" />
                      Import Questions
                    </Button>
                  </Link>
                  <Link href="/teacher/quick-generate-ai">
                    <Button variant="ghost" className="w-full justify-start">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate with AI
                    </Button>
                  </Link>
                  <Link href="/teacher/quick-view-analytics">
                    <Button variant="ghost" className="w-full justify-start">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Analytics
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/student/ai-chat">
                    <Button variant="ghost" className="w-full justify-start">
                      <Bot className="mr-2 h-4 w-4" />
                      AI Chat
                    </Button>
                  </Link>
                  <Link href="/student/progress">
                    <Button variant="ghost" className="w-full justify-start">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      My Progress
                    </Button>
                  </Link>
                  <Link href="/student/quizzes">
                    <Button variant="ghost" className="w-full justify-start">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Available Quizzes
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Bottom Actions */}
      <div className="border-t p-4">
        <div className="flex items-center justify-between">
          <ThemeToggle />
          {user.role == 'student' ? (
            <Link href="/student/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/teacher/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
