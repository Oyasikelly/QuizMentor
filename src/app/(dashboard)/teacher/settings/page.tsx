'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
// import { User } from '@/types/auth';
import { useAuth } from '@/hooks/useAuth';
import { FullPageSpinner } from '@/components/shared/loading-spinner';

// const mockUser: User = {
//   id: 'teacher-1',
//   name: 'Dr. Sarah Wilson',
//   email: 'sarah.wilson@example.com',
//   role: 'teacher',
//   createdAt: new Date(),
//   updatedAt: new Date(),
// };

type TeacherSettingsForm = {
  name: string;
  email: string;
  school: string;
  department: string;
  title: string;
};

const defaultValues: TeacherSettingsForm = {
  name: 'Dr. Sarah Wilson',
  email: 'sarah.wilson@example.com',
  school: 'FUPRE',
  department: 'Computer Science',
  title: 'Lecturer',
};

function ProfileInfoForm() {
  const { register /*, handleSubmit */, formState } =
    useForm<TeacherSettingsForm>({
      defaultValues,
    });
  // TODO: Integrate with backend
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal and academic info.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <Input id="name" {...register('name')} />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <Input id="email" type="email" {...register('email')} />
          </div>
          <div>
            <label htmlFor="school" className="block text-sm font-medium mb-1">
              School
            </label>
            <Input id="school" {...register('school')} />
          </div>
          <div>
            <label
              htmlFor="department"
              className="block text-sm font-medium mb-1"
            >
              Department
            </label>
            <Input id="department" {...register('department')} />
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title/Role
            </label>
            <Input id="title" {...register('title')} />
          </div>
          <div className="md:col-span-2 flex gap-2 mt-2">
            <Button type="submit" disabled={formState.isSubmitting}>
              Save Changes
            </Button>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function AccountSecuritySection() {
  // TODO: Integrate with backend
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Account & Security</CardTitle>
        <CardDescription>
          Change your password or manage account security.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-3 max-w-md">
          <div>
            <label
              htmlFor="current-password"
              className="block text-sm font-medium mb-1"
            >
              Current Password
            </label>
            <Input id="current-password" type="password" />
          </div>
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium mb-1"
            >
              New Password
            </label>
            <Input id="new-password" type="password" />
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium mb-1"
            >
              Confirm New Password
            </label>
            <Input id="confirm-password" type="password" />
          </div>
          <Button type="submit">Change Password</Button>
        </form>
        <div className="mt-4">
          <Button variant="destructive">Delete Account</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationPreferences() {
  // TODO: Integrate with backend
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose how you want to be notified.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 max-w-md">
          <div className="flex items-center gap-2">
            <Switch id="email-submissions" defaultChecked />
            <label htmlFor="email-submissions" className="text-sm">
              Email me about quiz submissions
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="email-analytics" defaultChecked />
            <label htmlFor="email-analytics" className="text-sm">
              Email me analytics reports
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="inapp-ai" defaultChecked />
            <label htmlFor="inapp-ai" className="text-sm">
              Show in-app AI generation results
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TeachingPreferencesSection() {
  // TODO: Integrate with backend
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Teaching Preferences</CardTitle>
        <CardDescription>
          Set your default quiz and AI generation preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 max-w-md">
          <div className="flex items-center gap-2">
            <Switch id="default-timelimit" />
            <label htmlFor="default-timelimit" className="text-sm">
              Default quiz time limit: 30 min
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="ai-explanations" defaultChecked />
            <label htmlFor="ai-explanations" className="text-sm">
              AI-generated explanations: Detailed
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="dark-mode" />
            <label htmlFor="dark-mode" className="text-sm">
              Enable dark mode
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PrivacyDataSection() {
  // TODO: Integrate with backend
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Privacy & Data</CardTitle>
        <CardDescription>
          Manage your data and privacy preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 max-w-md">
          <Button variant="outline">Download My Data</Button>
          <div className="flex items-center gap-2">
            <Switch id="analytics-consent" defaultChecked />
            <label htmlFor="analytics-consent" className="text-sm">
              Allow personalized analytics
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ConnectedAccountsSection() {
  // TODO: Integrate with backend
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Connected Accounts</CardTitle>
        <CardDescription>Manage your linked accounts.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 max-w-md">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Google</Badge>
            <Button variant="outline" size="sm">
              Unlink
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Microsoft</Badge>
            <Button variant="outline" size="sm">
              Unlink
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SupportSection() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Support & Help</CardTitle>
        <CardDescription>
          Contact support or find answers to your questions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 max-w-md">
          <Button variant="outline">Contact Support</Button>
          <Button variant="outline">FAQ / Help Center</Button>
          <Button variant="outline">Report a Problem</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TeacherSettingsPage() {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner text="Loading your dashboard..." />;
  if (!user) return null;
  return (
    <DashboardLayout pageTitle="Settings">
      <div className="max-w-3xl mx-auto">
        <ProfileInfoForm />
        <AccountSecuritySection />
        <NotificationPreferences />
        <TeachingPreferencesSection />
        <PrivacyDataSection />
        <ConnectedAccountsSection />
        <SupportSection />
      </div>
    </DashboardLayout>
  );
}
