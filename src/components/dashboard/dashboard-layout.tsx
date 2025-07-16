'use client';

import * as React from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { User } from '@/types/auth';
import { useAuth } from '@/hooks/useAuth';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
  pageTitle?: string;
}

export function DashboardLayout({
  children,
  className,
  pageTitle,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-background border-r transition-transform duration-200 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar user={user} />
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        {/* Header */}
        <Header
          user={user}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          pageTitle={pageTitle}
        />

        {/* Page content with proper spacing */}
        <main className={`flex-1 p-4 md:p-6 lg:p-8 ${className}`}>
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
