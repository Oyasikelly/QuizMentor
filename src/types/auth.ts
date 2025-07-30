export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher';
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId?: string;
  institution?: string;
  department?: string;
  studentId?: string;
  // Student-specific properties
  academicLevel?: string;
  classYear?: string;
  phoneNumber?: string;
  // Teacher-specific properties
  subjectsTaught?: string[];
  // Email confirmation
  email_confirmed_at?: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  role: 'student' | 'teacher';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthError {
  message: string;
  code?: string;
}
