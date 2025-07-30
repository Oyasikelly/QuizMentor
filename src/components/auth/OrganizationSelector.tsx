'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  type: string;
  address?: string;
  domain?: string;
  email?: string;
  logoUrl?: string;
  phone?: string;
  slug: string;
  subscriptionPlan: string;
}

interface OrganizationSelectorProps {
  selectedOrganizationId: string;
  onOrganizationChange: (organizationId: string) => void;
}

export function OrganizationSelector({
  selectedOrganizationId,
  onOrganizationChange,
}: OrganizationSelectorProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/organizations');

        if (!response.ok) {
          throw new Error('Failed to fetch organizations');
        }

        const data = await response.json();
        setOrganizations(data.organizations);

        // Auto-select the first organization if none is selected
        if (!selectedOrganizationId && data.organizations.length > 0) {
          onOrganizationChange(data.organizations[0].id);
        }
      } catch (error) {
        console.error('Error fetching organizations:', error);
        setError('Failed to load organizations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, [selectedOrganizationId, onOrganizationChange]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading Organizations...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">
            Error Loading Organizations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (organizations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Organizations Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            No organizations are currently available for registration.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Organization</CardTitle>
        <p className="text-sm text-gray-600">
          Choose the organization you belong to. This helps us organize your
          account properly.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="organization">Organization</Label>
          <Select
            value={selectedOrganizationId}
            onValueChange={onOrganizationChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an organization" />
            </SelectTrigger>
            <SelectContent>
              {organizations.map((org) => (
                <SelectItem key={org.id} value={org.id}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-1">
                      <div className="font-medium">{org.name}</div>
                      <div className="text-xs text-gray-500">
                        {org.type} • {org.address || 'No address'}
                      </div>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {org.subscriptionPlan}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
