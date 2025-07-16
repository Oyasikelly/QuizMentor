'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';

type Unit = { id: string; name: string };

export default function StudentCompleteProfilePage() {
  const router = useRouter();
  const [role, setRole] = useState('student');
  const [organizations, setOrganizations] = useState([]);
  const [orgLoading, setOrgLoading] = useState(true);
  const [formData, setFormData] = useState({
    academicLevel: '',
    classYear: '',
    phoneNumber: '',
    organizationId: '',
    unitId: '',
    studentId: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [unitsLoading, setUnitsLoading] = useState(false);
  const { setUser } = useAuth();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role && user.role === 'student') {
      setRole('student');
    } else {
      // If not student, redirect to teacher profile page
      router.push('/teacher/complete-profile');
    }
  }, [router]);

  useEffect(() => {
    async function fetchOrganizations() {
      setOrgLoading(true);
      try {
        const res = await fetch('/api/organizations');
        const data = await res.json();
        setOrganizations(data.organizations || []);
      } catch (err) {
        setOrganizations([]);
      } finally {
        setOrgLoading(false);
      }
    }
    fetchOrganizations();
  }, []);

  useEffect(() => {
    async function fetchUnits() {
      if (!formData.organizationId) return;
      setUnitsLoading(true);
      try {
        const res = await fetch(
          `/api/units?organizationId=${formData.organizationId}`
        );
        const data = await res.json();
        setUnits((data.units as Unit[]) || []);
      } catch (err) {
        setUnits([]);
      } finally {
        setUnitsLoading(false);
      }
    }
    fetchUnits();
  }, [formData.organizationId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
    setError(null);
    if (e.target.value === 'teacher') {
      router.push('/teacher/complete-profile');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const res = await fetch('/api/profile/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role, userId: user.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Profile update failed. Please try again.');
        setIsLoading(false);
        return;
      }
      // Fetch latest user data from backend
      const userRes = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, role: user.role }),
      });
      const userData = await userRes.json();
      if (userRes.ok && userData.user) {
        localStorage.setItem('user', JSON.stringify(userData.user));
        setUser(userData.user); // Update context
      }
      router.push('/student');
    } catch (err) {
      setError('Profile update failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value="Student" disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="academicLevel">Academic Level</Label>
              <Input
                id="academicLevel"
                type="text"
                placeholder="e.g. 300 Level"
                value={formData.academicLevel}
                onChange={(e) =>
                  handleInputChange('academicLevel', e.target.value)
                }
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="classYear">Class Year</Label>
              <Input
                id="classYear"
                type="text"
                placeholder="e.g. 3rd Year"
                value={formData.classYear}
                onChange={(e) => handleInputChange('classYear', e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="text"
                placeholder="e.g. 08012345678"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange('phoneNumber', e.target.value)
                }
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentId">
                Student ID{' '}
                <span className="text-xs text-muted-foreground">
                  (Optional, unless required by your organization)
                </span>
              </Label>
              <Input
                id="studentId"
                type="text"
                placeholder="e.g. 2024-00123"
                value={formData.studentId}
                onChange={(e) => handleInputChange('studentId', e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <select
                id="organization"
                className="w-full border rounded px-3 py-2 bg-background"
                value={formData.organizationId}
                onChange={(e) =>
                  handleInputChange('organizationId', e.target.value)
                }
                disabled={isLoading || orgLoading}
                required
              >
                <option value="">
                  {orgLoading
                    ? 'Loading organizations...'
                    : 'Select your organization'}
                </option>
                {organizations.map((org: Unit) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit/Department</Label>
              <select
                id="unit"
                className="w-full border rounded px-3 py-2 bg-background"
                value={formData.unitId}
                onChange={(e) => handleInputChange('unitId', e.target.value)}
                disabled={isLoading || unitsLoading || !formData.organizationId}
                required
              >
                <option value="">
                  {unitsLoading
                    ? 'Loading units/departments...'
                    : 'Select your unit/department'}
                </option>
                {units.map((unit: Unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
