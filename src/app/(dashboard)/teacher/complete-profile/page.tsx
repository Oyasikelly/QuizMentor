'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

type Unit = { id: string; name: string };
type Subject = { id: string; name: string };

export default function TeacherCompleteProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [units, setUnits] = useState<Unit[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [unitsLoading, setUnitsLoading] = useState(false);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [formData, setFormData] = useState({
    unitId: '',
    subjectIds: [] as string[],
    phoneNumber: '',
    employeeId: '',
    department: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated and is a teacher
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'teacher') {
      router.push('/student/complete-profile');
      return;
    }

    // Fetch units and subjects for the user's organization
    if (user.organizationId) {
      fetchUnits(user.organizationId);
      fetchSubjects(user.organizationId);
    }
  }, [user, router]);

  // Redirect if profile is already complete
  useEffect(() => {
    if (user?.profileComplete) {
      console.log('Profile already complete, redirecting to teacher dashboard');
      router.push('/teacher');
    }
  }, [user, router]);

  const fetchUnits = async (organizationId: string) => {
    setUnitsLoading(true);
    try {
      const res = await fetch(`/api/units?organizationId=${organizationId}`);
      const data = await res.json();
      setUnits(data.units || []);
    } catch (error) {
      console.error('Error fetching units:', error);
      setUnits([]);
    } finally {
      setUnitsLoading(false);
    }
  };

  const fetchSubjects = async (organizationId: string) => {
    setSubjectsLoading(true);
    try {
      const res = await fetch(`/api/subjects?organizationId=${organizationId}`);
      const data = await res.json();
      setSubjects(data.subjects || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setSubjects([]);
    } finally {
      setSubjectsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubjectChange = (subjectId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      subjectIds: checked
        ? [...prev.subjectIds, subjectId]
        : prev.subjectIds.filter((id) => id !== subjectId),
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/profile/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: 'teacher',
          userId: user?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Profile update failed. Please try again.');
        return;
      }

      // Update user in context
      if (setUser && data.user) {
        console.log('Updating user context with:', data.user);
        setUser(data.user);
      }

      toast.success('Profile completed successfully!');

      // Add a small delay to ensure context is updated
      setTimeout(() => {
        router.push('/teacher');
      }, 100);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Complete Your Profile</CardTitle>
          <p className="text-center text-sm text-muted-foreground">
            Please provide the following information to complete your teacher
            profile.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                type="text"
                placeholder="Enter your department"
                value={formData.department}
                onChange={(e) =>
                  handleInputChange('department', e.target.value)
                }
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitId">Unit/Department</Label>
              <Select
                value={formData.unitId}
                onValueChange={(value) => handleInputChange('unitId', value)}
                disabled={unitsLoading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      unitsLoading ? 'Loading units...' : 'Select your unit'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                type="text"
                placeholder="Enter your employee ID"
                value={formData.employeeId}
                onChange={(e) =>
                  handleInputChange('employeeId', e.target.value)
                }
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange('phoneNumber', e.target.value)
                }
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label>Subjects You Teach</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                {subjectsLoading ? (
                  <p className="text-sm text-muted-foreground">
                    Loading subjects...
                  </p>
                ) : (
                  subjects.map((subject) => (
                    <div
                      key={subject.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={subject.id}
                        checked={formData.subjectIds.includes(subject.id)}
                        onCheckedChange={(checked: boolean) =>
                          handleSubjectChange(subject.id, checked)
                        }
                        disabled={isLoading}
                      />
                      <Label
                        htmlFor={subject.id}
                        className="text-sm cursor-pointer"
                      >
                        {subject.name}
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Updating Profile...' : 'Complete Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
