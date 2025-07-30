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
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

type Unit = { id: string; name: string };

export default function StudentCompleteProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [units, setUnits] = useState<Unit[]>([]);
  const [unitsLoading, setUnitsLoading] = useState(false);
  const [formData, setFormData] = useState({
    academicLevel: '',
    classYear: '',
    phoneNumber: '',
    unitId: '',
    studentId: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated and is a student
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'student') {
      router.push('/teacher/complete-profile');
      return;
    }

    // Fetch units for the user's organization
    if (user.organizationId) {
      fetchUnits(user.organizationId);
    }
  }, [user, router]);

  // Redirect if profile is already complete
  useEffect(() => {
    if (user?.profileComplete) {
      console.log('Profile already complete, redirecting to student dashboard');
      router.push('/student');
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
          role: 'student',
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
        router.push('/student');
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
            Please provide the following information to complete your student
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
              <Label htmlFor="academicLevel">Academic Level</Label>
              <Select
                value={formData.academicLevel}
                onValueChange={(value) =>
                  handleInputChange('academicLevel', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your academic level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100 Level</SelectItem>
                  <SelectItem value="200">200 Level</SelectItem>
                  <SelectItem value="300">300 Level</SelectItem>
                  <SelectItem value="400">400 Level</SelectItem>
                  <SelectItem value="500">500 Level</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="classYear">Class Year</Label>
              <Input
                id="classYear"
                type="text"
                placeholder="e.g., 2024/2025"
                value={formData.classYear}
                onChange={(e) => handleInputChange('classYear', e.target.value)}
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
              <Label htmlFor="unitId">Department/Unit</Label>
              <Select
                value={formData.unitId}
                onValueChange={(value) => handleInputChange('unitId', value)}
                disabled={unitsLoading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      unitsLoading
                        ? 'Loading departments...'
                        : 'Select your department'
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
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                type="text"
                placeholder="Enter your student ID"
                value={formData.studentId}
                onChange={(e) => handleInputChange('studentId', e.target.value)}
                disabled={isLoading}
              />
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
