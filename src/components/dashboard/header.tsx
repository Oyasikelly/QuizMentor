'use client';
import { useAuth } from '@/hooks/useAuth';
import * as React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
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
import { useEffect, useState } from 'react';

interface HeaderProps {
  user: User;
  onSidebarToggle?: () => void;
  pageTitle?: string;
}

interface SearchResult {
  nav?: Array<{
    route: string;
    label: string;
    description: string;
  }>;
  quizzes?: Array<{
    id: string;
    title: string;
    subject?: {
      name: string;
    };
  }>;
  attempts?: Array<{
    id: string;
    quiz: {
      title: string;
    };
    score: number;
  }>;
  achievements?: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  badges?: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  subjects?: Array<{
    id: string;
    name: string;
    description: string;
  }>;
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

export function Header({ user, onSidebarToggle, pageTitle }: HeaderProps) {
  const { logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const navItems = user.role === 'student' ? studentNavItems : teacherNavItems;

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult>({});
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Debounced search effect for students
  useEffect(() => {
    if (user.role !== 'student' || !search) {
      setSearchResults({});
      setShowDropdown(false);
      return;
    }
    setSearchLoading(true);
    const timeout = setTimeout(() => {
      fetch(
        `/api/search?userId=${user.id}&organizationId=${
          user.organizationId
        }&q=${encodeURIComponent(search)}`
      )
        .then((res) => res.json())
        .then((data) => {
          setSearchResults(data);
          setShowDropdown(true);
        })
        .catch(() => setSearchResults({}))
        .finally(() => setSearchLoading(false));
    }, 400);
    return () => clearTimeout(timeout);
  }, [search, user]);

  // Find the current active navigation item
  const currentNavItem = navItems.find((item) => {
    if (item.href === '/student' || item.href === '/teacher') {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  });

  const handleStudentProfile = React.useCallback(() => {
    router.push('/student/profile');
  }, [router]);
  const handleStudentSettings = React.useCallback(() => {
    router.push('/student/settings');
  }, [router]);
  const handleStudentLogOut = React.useCallback(() => {
    logout();
    router.push('/login');
  }, [router, logout]);

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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() =>
                  Object.values(searchResults).some(
                    (arr) => Array.isArray(arr) && arr.length > 0
                  ) && setShowDropdown(true)
                }
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              />
              {/* Results dropdown for students */}
              {user.role === 'student' && showDropdown && (
                <div className="absolute left-0 mt-1 w-full bg-white border rounded shadow-lg z-50 max-h-96 overflow-y-auto">
                  {searchLoading ? (
                    <div className="p-3 text-sm text-muted-foreground">
                      Searching...
                    </div>
                  ) : !searchResults ||
                    Object.values(searchResults).every(
                      (arr: unknown) =>
                        !arr || (Array.isArray(arr) && arr.length === 0)
                    ) ? (
                    <div className="p-3 text-sm text-muted-foreground">
                      No results found.
                    </div>
                  ) : (
                    <>
                      {searchResults.nav && searchResults.nav.length > 0 && (
                        <div>
                          <div className="px-3 pt-2 pb-1 text-xs font-semibold text-muted-foreground">
                            Navigation
                          </div>
                          {searchResults.nav.map((nav) => (
                            <div
                              key={nav.route}
                              className="p-3 hover:bg-muted cursor-pointer text-sm"
                              onMouseDown={() => router.push(nav.route)}
                            >
                              <div className="font-medium">{nav.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {nav.description}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {searchResults.quizzes &&
                        searchResults.quizzes.length > 0 && (
                          <div>
                            <div className="px-3 pt-2 pb-1 text-xs font-semibold text-muted-foreground">
                              Quizzes
                            </div>
                            {searchResults.quizzes.map((quiz) => (
                              <div
                                key={quiz.id}
                                className="p-3 hover:bg-muted cursor-pointer text-sm"
                                onMouseDown={() =>
                                  router.push(`/student/quizzes/${quiz.id}`)
                                }
                              >
                                <div className="font-medium">{quiz.title}</div>
                                <div className="text-xs text-muted-foreground">
                                  {quiz.subject?.name || 'General'}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      {searchResults.attempts &&
                        searchResults.attempts.length > 0 && (
                          <div>
                            <div className="px-3 pt-2 pb-1 text-xs font-semibold text-muted-foreground">
                              Attempts
                            </div>
                            {searchResults.attempts.map((attempt) => (
                              <div
                                key={attempt.id}
                                className="p-3 hover:bg-muted cursor-pointer text-sm"
                                onMouseDown={() =>
                                  router.push(`/student/progress`)
                                }
                              >
                                <div className="font-medium">
                                  {attempt.quiz.title}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Score: {attempt.score}%
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      {searchResults.achievements &&
                        searchResults.achievements.length > 0 && (
                          <div>
                            <div className="px-3 pt-2 pb-1 text-xs font-semibold text-muted-foreground">
                              Achievements
                            </div>
                            {searchResults.achievements.map((a) => (
                              <div
                                key={a.id}
                                className="p-3 text-sm"
                                onMouseDown={() =>
                                  router.push('/student/achievements')
                                }
                              >
                                <div className="font-medium">{a.title}</div>
                                <div className="text-xs text-muted-foreground">
                                  {a.description}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      {searchResults.badges &&
                        searchResults.badges.length > 0 && (
                          <div>
                            <div className="px-3 pt-2 pb-1 text-xs font-semibold text-muted-foreground">
                              Badges
                            </div>
                            {searchResults.badges.map((b: unknown) => {
                              const badge = b as {
                                id: string;
                                name: string;
                                description: string;
                              };
                              return (
                                <div
                                  key={badge.id}
                                  className="p-3 text-sm"
                                  onMouseDown={() =>
                                    router.push('/student/achievements')
                                  }
                                >
                                  <div className="font-medium">
                                    {badge.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {badge.description}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      {searchResults.subjects &&
                        searchResults.subjects.length > 0 && (
                          <div>
                            <div className="px-3 pt-2 pb-1 text-xs font-semibold text-muted-foreground">
                              Subjects
                            </div>
                            {searchResults.subjects.map((s: unknown) => {
                              const subject = s as { id: string; name: string };
                              return (
                                <div
                                  key={subject.id}
                                  className="p-3 text-sm"
                                  onMouseDown={() =>
                                    router.push(
                                      `/student/quizzes?subjectId=${subject.id}`
                                    )
                                  }
                                >
                                  <div className="font-medium">
                                    {subject.name}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                    </>
                  )}
                </div>
              )}
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
                      {(user.name || 'U')
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
                <DropdownMenuItem onClick={handleStudentProfile}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleStudentSettings}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleStudentLogOut}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
