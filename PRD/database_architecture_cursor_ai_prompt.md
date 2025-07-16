# QuizMentor Multi-Tenant Organization Implementation

## Context
You are working on QuizMentor, an AI-powered educational web application built with Next.js 14, TypeScript, Tailwind CSS, ShadCN UI, PostgreSQL, and Prisma ORM. The application currently serves students and teachers but needs to be converted to a multi-tenant system where each school/institution operates as a separate organization.

## Current Tech Stack
- **Frontend:** Next.js 14 with App Router, TypeScript, Tailwind CSS, ShadCN UI
- **Backend:** Next.js API Routes, Prisma ORM, PostgreSQL
- **Authentication:** Supabase Auth
- **AI Integration:** OpenAI GPT-4o, Claude
- **Deployment:** Vercel, Railway/Render

## Objective
Transform QuizMentor into a multi-tenant system where:
1. Each school/institution is a separate organization
2. Users (students and teachers) are scoped to their organization
3. All data (quizzes, questions, results) is organization-specific
4. Sign-up forms are generic for any organization/department structure

## Database Schema Changes

### 1. Create Organizations Table
```prisma
model Organization {
  id            String   @id @default(cuid())
  name          String
  slug          String   @unique
  type          OrganizationType
  domain        String?
  logoUrl       String?
  address       String?
  phone         String?
  email         String?
  subscriptionPlan String @default("basic")
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  users         User[]
  organizationalUnits OrganizationalUnit[]
  quizzes       Quiz[]
  questions     Question[]
  
  @@map("organizations")
}

enum OrganizationType {
  UNIVERSITY
  SECONDARY_SCHOOL
  PRIMARY_SCHOOL
  STUDY_GROUP
  TRAINING_CENTER
  COLLEGE
  INSTITUTE
}
```

### 2. Create Organizational Units Table (Flexible Structure)
```prisma
model OrganizationalUnit {
  id             String   @id @default(cuid())
  organizationId String
  name           String
  type           UnitType // DEPARTMENT, CLASS, GRADE, GROUP, FACULTY, etc.
  description    String?
  parentId       String?  // For hierarchical structures
  headId         String?  // Head of unit (teacher/coordinator)
  academicYear   String?  // For classes/grades
  level          String?  // For academic levels
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  // Relations
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  parent         OrganizationalUnit? @relation("UnitHierarchy", fields: [parentId], references: [id])
  children       OrganizationalUnit[] @relation("UnitHierarchy")
  users          User[]
  subjects       Subject[]
  
  @@unique([organizationId, name, type])
  @@map("organizational_units")
}

enum UnitType {
  DEPARTMENT     // Universities: Computer Science, Mathematics
  FACULTY        // Universities: Faculty of Science, Faculty of Arts
  CLASS          // Secondary Schools: Grade 10A, JSS 1B
  GRADE          // Secondary Schools: Grade 10, JSS 1
  GROUP          // Study Groups: Math Study Group, Science Club
  SECTION        // Primary Schools: Section A, Section B
  STREAM         // Some schools: Science Stream, Arts Stream
  YEAR           // Academic years: Year 1, Year 2
  DIVISION       // Large institutions: Division of Engineering
}
```

### 3. Update User Model
```prisma
model User {
  id             String   @id @default(cuid())
  email          String   @unique
  name           String?
  role           UserRole
  organizationId String
  unitId         String?  // Flexible: department, class, group, etc.
  employeeId     String?  // For teachers/staff
  studentId      String?  // For students
  classYear      String?  // For students (e.g., "2024", "Grade 10")
  academicLevel  String?  // For students (e.g., "Undergraduate", "Graduate")
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  // Relations
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  unit           OrganizationalUnit? @relation(fields: [unitId], references: [id], onDelete: SetNull)
  quizzes        Quiz[]
  quizAttempts   QuizAttempt[]
  aiInteractions AIInteraction[]
  
  @@unique([organizationId, employeeId])
  @@unique([organizationId, studentId])
  @@map("users")
}

enum UserRole {
  STUDENT
  TEACHER
  ADMIN
  SUPER_ADMIN
}
```

### 4. Update Existing Models
```prisma
model Quiz {
  id             String   @id @default(cuid())
  title          String
  description    String?
  organizationId String
  createdById    String
  subjectId      String?
  isActive       Boolean  @default(true)
  // ... other existing fields

  // Relations
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  createdBy      User         @relation(fields: [createdById], references: [id])
  // ... other existing relations
  
  @@map("quizzes")
}

model Question {
  id             String   @id @default(cuid())
  organizationId String
  // ... other existing fields

  // Relations
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  // ... other existing relations
  
  @@map("questions")
}

model Subject {
  id             String   @id @default(cuid())
  name           String
  organizationId String
  unitId         String?  // Can belong to department, class, etc.
  // ... other existing fields

  // Relations
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  unit           OrganizationalUnit? @relation(fields: [unitId], references: [id], onDelete: SetNull)
  // ... other existing relations
  
  @@unique([organizationId, name])
  @@map("subjects")
}
```

## Implementation Tasks

### 1. Database Migration
```bash
# Create and run migration
npx prisma migrate dev --name add-organizations-multi-tenant
npx prisma generate
```

### 2. Update Authentication Flow

#### Organization Context Middleware
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Extract organization from subdomain or path
  const orgSlug = extractOrganizationSlug(request);
  
  if (orgSlug) {
    const response = NextResponse.next();
    response.headers.set('x-organization-slug', orgSlug);
    return response;
  }
  
  return NextResponse.next();
}

function extractOrganizationSlug(request: NextRequest): string | null {
  const host = request.headers.get('host');
  if (host?.includes('.')) {
    const subdomain = host.split('.')[0];
    if (subdomain !== 'www' && subdomain !== 'app') {
      return subdomain;
    }
  }
  return null;
}
```

#### Organization Context Hook
```typescript
// hooks/useOrganization.ts
import { createContext, useContext } from 'react';

interface OrganizationContextType {
  organization: Organization | null;
  departments: Department[];
  setOrganization: (org: Organization | null) => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within OrganizationProvider');
  }
  return context;
}
```

### 3. Updated Sign-Up Forms

#### Dynamic Unit Selection Component
```tsx
// components/auth/UnitSelector.tsx
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UnitSelectorProps {
  organizationId: string;
  organizationType: OrganizationType;
  onUnitSelect: (unitId: string) => void;
  label?: string;
}

export function UnitSelector({ 
  organizationId, 
  organizationType, 
  onUnitSelect,
  label
}: UnitSelectorProps) {
  const [units, setUnits] = useState<OrganizationalUnit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUnits();
  }, [organizationId]);

  const loadUnits = async () => {
    try {
      const response = await fetch(`/api/organizations/${organizationId}/units`);
      const data = await response.json();
      setUnits(data);
    } catch (error) {
      console.error('Error loading units:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUnitLabel = () => {
    if (label) return label;
    
    switch (organizationType) {
      case 'UNIVERSITY':
        return 'Select Department/Faculty';
      case 'SECONDARY_SCHOOL':
        return 'Select Class/Grade';
      case 'PRIMARY_SCHOOL':
        return 'Select Class/Section';
      case 'STUDY_GROUP':
        return 'Select Group';
      case 'TRAINING_CENTER':
        return 'Select Program/Course';
      default:
        return 'Select Unit';
    }
  };

  const getUnitDisplayName = (unit: OrganizationalUnit) => {
    switch (unit.type) {
      case 'DEPARTMENT':
        return `${unit.name} (Department)`;
      case 'CLASS':
        return `${unit.name} ${unit.academicYear ? `- ${unit.academicYear}` : ''}`;
      case 'GRADE':
        return `Grade ${unit.name}`;
      case 'GROUP':
        return `${unit.name} (Group)`;
      case 'FACULTY':
        return `${unit.name} (Faculty)`;
      default:
        return unit.name;
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded-md"></div>
      </div>
    );
  }

  return (
    <Select onValueChange={onUnitSelect}>
      <SelectTrigger>
        <SelectValue placeholder={getUnitLabel()} />
      </SelectTrigger>
      <SelectContent>
        {units.map((unit) => (
          <SelectItem key={unit.id} value={unit.id}>
            {getUnitDisplayName(unit)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
#### Teacher Sign-Up Component
```tsx
// components/auth/TeacherSignUpForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UnitSelector } from './UnitSelector';

interface TeacherSignUpData {
  name: string;
  email: string;
  password: string;
  organizationId: string;
  unitId?: string;
  employeeId?: string;
  specialization?: string;
}

export function TeacherSignUpForm() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const { register, handleSubmit, watch, setValue } = useForm<TeacherSignUpData>();
  
  const selectedOrgId = watch('organizationId');
  
  const handleOrganizationSelect = (orgId: string) => {
    const org = organizations.find(o => o.id === orgId);
    setSelectedOrg(org || null);
    setValue('organizationId', orgId);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register('name')}
        placeholder="Full Name"
        required
      />
      
      <Input
        {...register('email')}
        type="email"
        placeholder="Email Address"
        required
      />
      
      <Input
        {...register('password')}
        type="password"
        placeholder="Password"
        required
      />
      
      <Select onValueChange={handleOrganizationSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Select Organization" />
        </SelectTrigger>
        <SelectContent>
          {organizations.map((org) => (
            <SelectItem key={org.id} value={org.id}>
              {org.name} ({org.type.replace('_', ' ').toLowerCase()})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {selectedOrg && (
        <UnitSelector
          organizationId={selectedOrg.id}
          organizationType={selectedOrg.type}
          onUnitSelect={(unitId) => setValue('unitId', unitId)}
        />
      )}
      
      <Input
        {...register('employeeId')}
        placeholder="Employee ID (Optional)"
      />
      
      <Input
        {...register('specialization')}
        placeholder="Subject Specialization"
      />
      
      <Button type="submit" className="w-full">
        Create Teacher Account
      </Button>
    </form>
  );
}
```

#### Student Sign-Up Component
```tsx
// components/auth/StudentSignUpForm.tsx
export function StudentSignUpForm() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const { register, handleSubmit, watch, setValue } = useForm<StudentSignUpData>();
  
  const handleOrganizationSelect = (orgId: string) => {
    const org = organizations.find(o => o.id === orgId);
    setSelectedOrg(org || null);
    setValue('organizationId', orgId);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register('name')}
        placeholder="Full Name"
        required
      />
      
      <Input
        {...register('email')}
        type="email"
        placeholder="Email Address"
        required
      />
      
      <Input
        {...register('password')}
        type="password"
        placeholder="Password"
        required
      />
      
      <Select onValueChange={handleOrganizationSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Select Institution" />
        </SelectTrigger>
        <SelectContent>
          {organizations.map((org) => (
            <SelectItem key={org.id} value={org.id}>
              {org.name} ({org.type.replace('_', ' ').toLowerCase()})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {selectedOrg && (
        <UnitSelector
          organizationId={selectedOrg.id}
          organizationType={selectedOrg.type}
          onUnitSelect={(unitId) => setValue('unitId', unitId)}
        />
      )}
      
      <Input
        {...register('studentId')}
        placeholder="Student ID (Optional)"
      />
      
      <Input
        {...register('classYear')}
        placeholder={getClassYearPlaceholder(selectedOrg?.type)}
      />
      
      <Select onValueChange={(value) => setValue('academicLevel', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Academic Level" />
        </SelectTrigger>
        <SelectContent>
          {getAcademicLevels(selectedOrg?.type).map((level) => (
            <SelectItem key={level.value} value={level.value}>
              {level.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button type="submit" className="w-full">
        Create Student Account
      </Button>
    </form>
  );
}

// Helper functions
function getClassYearPlaceholder(orgType?: OrganizationType): string {
  switch (orgType) {
    case 'UNIVERSITY':
      return 'Academic Year (e.g., 2024/2025)';
    case 'SECONDARY_SCHOOL':
      return 'Current Grade (e.g., Grade 10, JSS 2)';
    case 'PRIMARY_SCHOOL':
      return 'Current Class (e.g., Primary 5)';
    case 'STUDY_GROUP':
      return 'Study Session (e.g., 2024 Session)';
    default:
      return 'Class/Year';
  }
}

function getAcademicLevels(orgType?: OrganizationType) {
  switch (orgType) {
    case 'UNIVERSITY':
      return [
        { value: 'undergraduate', label: 'Undergraduate' },
        { value: 'graduate', label: 'Graduate' },
        { value: 'postgraduate', label: 'Postgraduate' },
        { value: 'phd', label: 'PhD' }
      ];
    case 'SECONDARY_SCHOOL':
      return [
        { value: 'junior', label: 'Junior Secondary (JSS)' },
        { value: 'senior', label: 'Senior Secondary (SSS)' }
      ];
    case 'PRIMARY_SCHOOL':
      return [
        { value: 'lower_primary', label: 'Lower Primary (1-3)' },
        { value: 'upper_primary', label: 'Upper Primary (4-6)' }
      ];
    case 'STUDY_GROUP':
      return [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' }
      ];
    default:
      return [
        { value: 'basic', label: 'Basic Level' },
        { value: 'intermediate', label: 'Intermediate Level' },
        { value: 'advanced', label: 'Advanced Level' }
      ];
  }
}
```

### 4. Update API Routes

#### Organization-Scoped Data Access
```typescript
// lib/auth.ts
export async function getOrganizationContext(req: NextRequest) {
  const orgSlug = req.headers.get('x-organization-slug');
  if (orgSlug) {
    const organization = await prisma.organization.findUnique({
      where: { slug: orgSlug },
      include: { departments: true }
    });
    return organization;
  }
  return null;
}

// lib/prisma-helpers.ts
export function createOrganizationFilter(organizationId: string) {
  return {
    where: {
      organizationId
    }
  };
}
```

#### Updated API Endpoints
```typescript
// app/api/quizzes/route.ts
export async function GET(request: NextRequest) {
  const organization = await getOrganizationContext(request);
  if (!organization) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
  }
  
  const quizzes = await prisma.quiz.findMany({
    where: { organizationId: organization.id },
    include: {
      createdBy: true,
      subject: true,
      _count: {
        select: { questions: true }
      }
    }
  });
  
  return NextResponse.json(quizzes);
}

// app/api/students/route.ts
export async function GET(request: NextRequest) {
  const organization = await getOrganizationContext(request);
  if (!organization) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
  }
  
  const students = await prisma.user.findMany({
    where: { 
      organizationId: organization.id,
      role: 'STUDENT'
    },
    include: {
      department: true,
      quizAttempts: {
        include: {
          quiz: true
        }
      }
    }
  });
  
  return NextResponse.json(students);
}
```

### 5. Organization Management Components

#### Organization Setup Form
```tsx
// components/admin/OrganizationSetupForm.tsx
export function OrganizationSetupForm() {
  const { register, handleSubmit } = useForm<OrganizationData>();
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register('name')}
          placeholder="Organization Name"
          required
        />
        
        <Input
          {...register('slug')}
          placeholder="URL Slug (e.g., university-name)"
          required
        />
        
        <Input
          {...register('domain')}
          placeholder="Domain (optional)"
        />
        
        <Input
          {...register('email')}
          type="email"
          placeholder="Contact Email"
        />
      </div>
      
      <textarea
        {...register('address')}
        placeholder="Address"
        className="w-full p-3 border rounded-md"
        rows={3}
      />
      
      <Button type="submit" className="w-full">
        Create Organization
      </Button>
    </form>
  );
}
```

#### Organizational Unit Management
```tsx
// components/admin/OrganizationalUnitManagement.tsx
export function OrganizationalUnitManagement() {
  const { organization } = useOrganization();
  const [units, setUnits] = useState<OrganizationalUnit[]>([]);
  const [selectedUnitType, setSelectedUnitType] = useState<UnitType | null>(null);
  
  const getUnitTypeOptions = () => {
    switch (organization?.type) {
      case 'UNIVERSITY':
        return [
          { value: 'FACULTY', label: 'Faculty' },
          { value: 'DEPARTMENT', label: 'Department' },
          { value: 'DIVISION', label: 'Division' }
        ];
      case 'SECONDARY_SCHOOL':
        return [
          { value: 'GRADE', label: 'Grade Level' },
          { value: 'CLASS', label: 'Class' },
          { value: 'STREAM', label: 'Stream' }
        ];
      case 'PRIMARY_SCHOOL':
        return [
          { value: 'GRADE', label: 'Grade Level' },
          { value: 'CLASS', label: 'Class' },
          { value: 'SECTION', label: 'Section' }
        ];
      case 'STUDY_GROUP':
        return [
          { value: 'GROUP', label: 'Study Group' },
          { value: 'CLASS', label: 'Class' }
        ];
      default:
        return [
          { value: 'DEPARTMENT', label: 'Department' },
          { value: 'CLASS', label: 'Class' },
          { value: 'GROUP', label: 'Group' }
        ];
    }
  };
  
  const getUnitIcon = (unitType: UnitType) => {
    switch (unitType) {
      case 'FACULTY':
        return '🏛️';
      case 'DEPARTMENT':
        return '📚';
      case 'CLASS':
        return '🎓';
      case 'GRADE':
        return '📝';
      case 'GROUP':
        return '👥';
      case 'SECTION':
        return '📋';
      default:
        return '📁';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {organization?.type === 'UNIVERSITY' ? 'Faculties & Departments' : 
           organization?.type === 'SECONDARY_SCHOOL' ? 'Classes & Grades' :
           organization?.type === 'STUDY_GROUP' ? 'Groups & Classes' : 'Organizational Units'}
        </h2>
        <Button onClick={() => setShowAddForm(true)}>
          Add {organization?.type === 'UNIVERSITY' ? 'Faculty/Department' : 
              organization?.type === 'SECONDARY_SCHOOL' ? 'Class/Grade' :
              organization?.type === 'STUDY_GROUP' ? 'Group' : 'Unit'}
        </Button>
      </div>
      
      {/* Unit Type Filter */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedUnitType === null ? 'default' : 'outline'}
          onClick={() => setSelectedUnitType(null)}
        >
          All Units
        </Button>
        {getUnitTypeOptions().map((option) => (
          <Button
            key={option.value}
            variant={selectedUnitType === option.value ? 'default' : 'outline'}
            onClick={() => setSelectedUnitType(option.value as UnitType)}
          >
            {option.label}
          </Button>
        ))}
      </div>
      
      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {units
          .filter(unit => !selectedUnitType || unit.type === selectedUnitType)
          .map((unit) => (
            <Card key={unit.id} className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getUnitIcon(unit.type)}</span>
                <div className="flex-1">
                  <h3 className="font-semibold">{unit.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {unit.type.replace('_', ' ').toLowerCase()}
                  </p>
                  {unit.description && (
                    <p className="text-sm text-gray-500 mt-1">{unit.description}</p>
                  )}
                  {unit.academicYear && (
                    <p className="text-sm text-blue-600">Academic Year: {unit.academicYear}</p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm" variant="destructive">Delete</Button>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
}text-2xl font-bold">Departments</h2>
        <Button onClick={() => setShowAddForm(true)}>
          Add Department
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <Card key={dept.id} className="p-4">
            <h3 className="font-semibold">{dept.name}</h3>
            <p className="text-sm text-gray-600">{dept.description}</p>
            <div className="mt-2 flex gap-2">
              <Button size="sm" variant="outline">Edit</Button>
              <Button size="sm" variant="destructive">Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### 6. Data Migration Script

```typescript
// scripts/migrate-to-multi-tenant.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateToMultiTenant() {
  // Create default organization for existing data
  const defaultOrg = await prisma.organization.create({
    data: {
      name: 'Default Organization',
      slug: 'default',
      subscriptionPlan: 'basic',
      isActive: true
    }
  });
  
  // Create default department
  const defaultDept = await prisma.department.create({
    data: {
      name: 'General',
      organizationId: defaultOrg.id,
      description: 'Default department for existing users'
    }
  });
  
  // Update existing users
  await prisma.user.updateMany({
    data: {
      organizationId: defaultOrg.id,
      departmentId: defaultDept.id
    }
  });
  
  // Update existing quizzes
  await prisma.quiz.updateMany({
    data: {
      organizationId: defaultOrg.id
    }
  });
  
  // Update existing questions
  await prisma.question.updateMany({
    data: {
      organizationId: defaultOrg.id
    }
  });
  
  console.log('Migration completed successfully');
}

migrateToMultiTenant()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### 7. Security and Data Isolation

#### Row Level Security (RLS) Implementation
```typescript
// lib/security.ts
export function validateOrganizationAccess(
  userOrgId: string,
  resourceOrgId: string
) {
  if (userOrgId !== resourceOrgId) {
    throw new Error('Unauthorized access to organization resource');
  }
}

export async function getOrganizationScopedData<T>(
  organizationId: string,
  query: any
): Promise<T> {
  return await prisma[query.model].findMany({
    ...query,
    where: {
      ...query.where,
      organizationId
    }
  });
}
```

## Implementation Checklist

### Phase 1: Database and Core Setup
- [ ] Update Prisma schema with organization and department models
- [ ] Create and run database migrations
- [ ] Implement organization context middleware
- [ ] Create organization and department management APIs

### Phase 2: Authentication and Sign-up
- [ ] Update user registration to include organization selection
- [ ] Create generic teacher sign-up form with department selection
- [ ] Create generic student sign-up form with department selection
- [ ] Implement organization-scoped authentication

### Phase 3: Data Isolation
- [ ] Update all existing API routes to filter by organization
- [ ] Implement organization context throughout the application
- [ ] Add organization validation to all data operations
- [ ] Create data migration script for existing data

### Phase 4: UI Updates
- [ ] Update dashboards to show organization-specific data
- [ ] Create organization and department management interfaces
- [ ] Add organization branding capabilities
- [ ] Update user profiles to show organization information

### Phase 5: Testing and Deployment
- [ ] Test data isolation between organizations
- [ ] Verify user access controls work correctly
- [ ] Test organization switching scenarios
- [ ] Deploy with proper environment configuration

## Success Criteria
- Multiple organizations can use the platform simultaneously
- Complete data isolation between organizations
- Teachers and students can only access their organization's content
- Departments can be managed independently within each organization
- System maintains performance with multiple organizations
- All existing functionality works within the organization context

## Notes
- All database queries MUST include organizationId filtering
- Implement proper indexing on organizationId columns
- Create database constraints to prevent cross-organization data leaks
- Update all existing API endpoints to be organization-aware
- Ensure the frontend properly handles organization context
- Use TypeScript for type safety throughout the implementation