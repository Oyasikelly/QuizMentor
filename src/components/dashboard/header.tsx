'use client';

import * as React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/dashboard/theme-toggle';
import { User } from '@/types/auth';

interface HeaderProps {
  user: User;
  onSidebarToggle?: () => void;
  className?: string;
  pageTitle?: string;
}

// Navigation items mapping
const studentNavItems = [
  { title: 'Dashboard', href: '/student' },
  { title: 'Available Quizzes', href: '/student/quizzes' },
  { title: 'My Progress', href: '/student/progress' },
  { title: 'Achievements', href: '/student/achievements' },
];

const teacherNavItems = [
  { title: 'Dashboard', href: '/teacher' },
  { title: 'Create Quiz', href: '/teacher/create-quiz' },
  { title: 'Manage Quizzes', href: '/teacher/manage-quizzes' },
  { title: 'Analytics', href: '/teacher/analytics' },
  { title: 'Students', href: '/teacher/students' },
];

export function Header({
  user,
  onSidebarToggle,
  className,
  pageTitle,
}: HeaderProps) {
  const pathname = usePathname();
  const navItems = user.role === 'student' ? studentNavItems : teacherNavItems;

  // Find the current active navigation item
  const currentNavItem = navItems.find((item) => {
    if (item.href === '/student' || item.href === '/teacher') {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  });

  const resolvedTitle = pageTitle || currentNavItem?.title || 'QuizMentor';

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onSidebarToggle}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <div className="hidden md:flex">
            <h1 className="text-lg font-semibold">{resolvedTitle}</h1>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search quizzes..."
                className="pl-8 md:w-[300px] lg:w-[400px]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive" />
              <span className="sr-only">Notifications</span>
            </Button>

            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
