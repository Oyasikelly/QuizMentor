'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';

type Organization = { id: string; name: string };
type Subject = { id: string; name: string };

export default function TeacherCompleteProfilePage() {
  const router = useRouter();
  const [role, setRole] = useState('teacher');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [orgLoading, setOrgLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [formData, setFormData] = useState({
    department: '',
    subjectIds: [] as string[], // allow multiple subjects
    phoneNumber: '',
    organizationId: '',
    employeeId: '',
  });
  type Unit = { id: string; name: string };

  const [units, setUnits] = useState<Unit[]>([]);
  const [unitsLoading, setUnitsLoading] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuth();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role && user.role === 'teacher') {
      setRole('teacher');
    } else {
      // If not teacher, redirect to student profile page
      router.push('/student/complete-profile');
    }
  }, [router]);

  useEffect(() => {
    async function fetchOrganizations() {
      setOrgLoading(true);
      try {
        const res = await fetch('/api/organizations');
        const data = await res.json();
        setOrganizations((data.organizations as Organization[]) || []);
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

  useEffect(() => {
    async function fetchSubjects() {
      if (!formData.organizationId) return;
      setSubjectsLoading(true);
      try {
        const res = await fetch(
          `/api/subjects?organizationId=${formData.organizationId}`
        );
        const data = await res.json();
        setSubjects((data.subjects as Subject[]) || []);
      } catch (err) {
        setSubjects([]);
      } finally {
        setSubjectsLoading(false);
      }
    }
    fetchSubjects();
  }, [formData.organizationId]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
    setError(null);
    if (e.target.value === 'student') {
      router.push('/student/complete-profile');
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
        body: JSON.stringify({
          ...formData,
          role,
          userId: user.id,
        }),
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
      router.push('/teacher');
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
              <Input value="Teacher" disabled className="bg-muted" />
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
                {organizations.map((org: Organization) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Unit/Department</Label>

              <select
                id="department"
                className="w-full border rounded px-3 py-2 bg-background"
                value={formData.department}
                onChange={(e) =>
                  handleInputChange('department', e.target.value)
                }
                disabled={isLoading || unitsLoading || !formData.organizationId}
                required
              >
                <option>
                  {isLoading
                    ? 'Loading units/departments...'
                    : 'select your unit department'}
                </option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.name}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subjectsTaught">Subjects Taught</Label>
              <select
                id="subjectsTaught"
                className="w-full border rounded px-3 py-2 bg-background"
                value={formData.subjectIds}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions).map(
                    (option) => option.value
                  );
                  handleInputChange('subjectIds', selected);
                }}
                multiple
                disabled={
                  isLoading || subjectsLoading || !formData.organizationId
                }
                required
              >
                {subjects.map((subj: Subject) => (
                  <option key={subj.id} value={subj.id}>
                    {subj.name}
                  </option>
                ))}
              </select>
              <span className="text-xs text-muted-foreground">
                Hold Ctrl (Cmd on Mac) to select multiple subjects.
              </span>
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
              <Label htmlFor="employeeId">
                Employee ID{' '}
                <span className="text-xs text-muted-foreground">
                  (Optional, unless required by your organization)
                </span>
              </Label>
              <Input
                id="employeeId"
                type="text"
                placeholder="e.g. EMP-2024-001"
                value={formData.employeeId}
                onChange={(e) =>
                  handleInputChange('employeeId', e.target.value)
                }
                disabled={isLoading}
              />
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
