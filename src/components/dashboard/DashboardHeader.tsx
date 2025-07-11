import React from 'react';
import { User } from '@/types/auth';

interface DashboardHeaderProps {
  user: User;
  onLogout?: () => void;
}

export default function DashboardHeader({
  user,
  onLogout,
}: DashboardHeaderProps) {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              QuizMentor Dashboard
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700">
              Welcome, {user.name} ({user.role})
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
