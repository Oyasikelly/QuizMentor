'use client';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

type StudentSettingsForm = {
  name: string;
  email: string;
  school: string;
  department: string;
  year: string;
  regNo: string;
};

function ProfileInfoForm({ userId }: { userId: string }) {
  const { register, handleSubmit, formState, reset } =
    useForm<StudentSettingsForm>({
      defaultValues: {
        name: '',
        email: '',
        school: '',
        department: '',
        year: '',
        regNo: '',
      },
    });

  // Fetch student profile on mount
  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch(`/api/profile/complete?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        reset({
          name: data.name || '',
          email: data.email || '',
          school: data.school || '',
          department: data.department || '',
          year: data.year || '',
          regNo: data.regNo || '',
        });
      }
    }
    fetchProfile();
  }, [userId, reset]);

  // Handle form submission
  const onSubmit = async (values: StudentSettingsForm) => {
    const res = await fetch('/api/profile/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        role: 'student',
        classYear: values.year,
        studentId: values.regNo,
        // department and school are not directly updatable here, but you can add logic if needed
      }),
    });
    if (res.ok) {
      alert('Profile updated!');
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal and academic info.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <Input id="name" {...register('name')} disabled />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <Input id="email" type="email" {...register('email')} disabled />
          </div>
          <div>
            <label htmlFor="school" className="block text-sm font-medium mb-1">
              School
            </label>
            <Input id="school" {...register('school')} disabled />
          </div>
          <div>
            <label
              htmlFor="department"
              className="block text-sm font-medium mb-1"
            >
              Department
            </label>
            <Input id="department" {...register('department')} disabled />
          </div>
          <div>
            <label htmlFor="year" className="block text-sm font-medium mb-1">
              Year
            </label>
            <Input id="year" {...register('year')} />
          </div>
          <div>
            <label htmlFor="regNo" className="block text-sm font-medium mb-1">
              Reg. Number
            </label>
            <Input id="regNo" {...register('regNo')} />
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

export default function StudentProfilePage() {
  // TODO: Replace with actual userId from auth context or props
  const { user } = useAuth();
  if (!user) return null;
  return (
    <DashboardLayout>
      <ProfileInfoForm userId={user.id} />
    </DashboardLayout>
  );
}
