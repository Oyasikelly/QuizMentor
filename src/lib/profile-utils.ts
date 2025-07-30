import { User } from '@/types/auth';

export interface ProfileCompletionStatus {
  isComplete: boolean;
  missingFields: string[];
  redirectPath: string;
}

export function checkProfileCompletion(user: User): ProfileCompletionStatus {
  const missingFields: string[] = [];

  if (user.role === 'student') {
    // Check student-specific required fields
    if (!user.academicLevel) missingFields.push('academic level');
    if (!user.classYear) missingFields.push('class year');
    if (!user.phoneNumber) missingFields.push('phone number');

    return {
      isComplete: missingFields.length === 0,
      missingFields,
      redirectPath:
        missingFields.length > 0 ? '/student/complete-profile' : '/student',
    };
  } else if (user.role === 'teacher') {
    // Check teacher-specific required fields
    if (!user.department) missingFields.push('department');
    if (!user.employeeId) missingFields.push('employee ID');

    return {
      isComplete: missingFields.length === 0,
      missingFields,
      redirectPath:
        missingFields.length > 0 ? '/teacher/complete-profile' : '/teacher',
    };
  }

  // Default fallback
  return {
    isComplete: true,
    missingFields: [],
    redirectPath: '/',
  };
}

export function getProfileCompletionMessage(user: User): string {
  const status = checkProfileCompletion(user);

  if (status.isComplete) {
    return 'Profile is complete!';
  }

  const missingFieldsText = status.missingFields.join(', ');
  return `Please complete your profile by adding: ${missingFieldsText}`;
}
