import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create Organizations
  const fupre = await prisma.organization.upsert({
    where: { slug: 'fupre' },
    update: {},
    create: {
      id: 'fupre-org',
      name: 'Federal University of Petroleum Resources, Effurun',
      slug: 'fupre',
      type: 'UNIVERSITY',
      address: 'Effurun, Delta State, Nigeria',
      email: 'info@fupre.edu.ng',
      phone: '+234-803-123-4567',
      isActive: true,
    },
  });

  const delsu = await prisma.organization.upsert({
    where: { slug: 'delsu' },
    update: {},
    create: {
      id: 'delsu-org',
      name: 'Delta State University, Abraka',
      slug: 'delsu',
      type: 'UNIVERSITY',
      address: 'Abraka, Delta State, Nigeria',
      email: 'info@delsu.edu.ng',
      phone: '+234-803-987-6543',
      isActive: true,
    },
  });

  console.log('✅ Organizations created');

  // Create Organizational Units for FUPRE
  const fupreUnits = [
    {
      id: 'fupre-faculty-engineering',
      name: 'Faculty of Engineering',
      type: 'FACULTY' as const,
      description: 'Faculty of Engineering and Technology',
      organizationId: fupre.id,
    },
    {
      id: 'fupre-faculty-science',
      name: 'Faculty of Science',
      type: 'FACULTY' as const,
      description: 'Faculty of Science and Technology',
      organizationId: fupre.id,
    },
    {
      id: 'fupre-dept-petroleum',
      name: 'Department of Petroleum Engineering',
      type: 'DEPARTMENT' as const,
      description: 'Department of Petroleum Engineering',
      organizationId: fupre.id,
      parentId: 'fupre-faculty-engineering',
    },
    {
      id: 'fupre-dept-chemical',
      name: 'Department of Chemical Engineering',
      type: 'DEPARTMENT' as const,
      description: 'Department of Chemical Engineering',
      organizationId: fupre.id,
      parentId: 'fupre-faculty-engineering',
    },
    {
      id: 'fupre-dept-mechanical',
      name: 'Department of Mechanical Engineering',
      type: 'DEPARTMENT' as const,
      description: 'Department of Mechanical Engineering',
      organizationId: fupre.id,
      parentId: 'fupre-faculty-engineering',
    },
    {
      id: 'fupre-dept-computer',
      name: 'Department of Computer Science',
      type: 'DEPARTMENT' as const,
      description: 'Department of Computer Science',
      organizationId: fupre.id,
      parentId: 'fupre-faculty-science',
    },
  ];

  // Create Organizational Units for DELSU
  const delsuUnits = [
    {
      id: 'delsu-faculty-engineering',
      name: 'Faculty of Engineering',
      type: 'FACULTY' as const,
      description: 'Faculty of Engineering and Technology',
      organizationId: delsu.id,
    },
    {
      id: 'delsu-faculty-science',
      name: 'Faculty of Science',
      type: 'FACULTY' as const,
      description: 'Faculty of Science and Technology',
      organizationId: delsu.id,
    },
    {
      id: 'delsu-dept-electrical',
      name: 'Department of Electrical Engineering',
      type: 'DEPARTMENT' as const,
      description: 'Department of Electrical Engineering',
      organizationId: delsu.id,
      parentId: 'delsu-faculty-engineering',
    },
    {
      id: 'delsu-dept-civil',
      name: 'Department of Civil Engineering',
      type: 'DEPARTMENT' as const,
      description: 'Department of Civil Engineering',
      organizationId: delsu.id,
      parentId: 'delsu-faculty-engineering',
    },
    {
      id: 'delsu-dept-physics',
      name: 'Department of Physics',
      type: 'DEPARTMENT' as const,
      description: 'Department of Physics',
      organizationId: delsu.id,
      parentId: 'delsu-faculty-science',
    },
    {
      id: 'delsu-dept-mathematics',
      name: 'Department of Mathematics',
      type: 'DEPARTMENT' as const,
      description: 'Department of Mathematics',
      organizationId: delsu.id,
      parentId: 'delsu-faculty-science',
    },
  ];

  // Create all units
  for (const unit of [...fupreUnits, ...delsuUnits]) {
    await prisma.organizationalUnit.upsert({
      where: { id: unit.id },
      update: {},
      create: unit,
    });
  }

  console.log('✅ Organizational units created');

  // Create Subjects/Courses
  const subjects = [
    // FUPRE Subjects
    {
      id: 'fupre-petroleum-101',
      name: 'Introduction to Petroleum Engineering (PETE 101)',
      organizationId: fupre.id,
      unitId: 'fupre-dept-petroleum',
    },
    {
      id: 'fupre-petroleum-201',
      name: 'Reservoir Engineering (PETE 201)',
      organizationId: fupre.id,
      unitId: 'fupre-dept-petroleum',
    },
    {
      id: 'fupre-chemical-101',
      name: 'Chemical Engineering Principles (CHEM 101)',
      organizationId: fupre.id,
      unitId: 'fupre-dept-chemical',
    },
    {
      id: 'fupre-chemical-201',
      name: 'Process Design (CHEM 201)',
      organizationId: fupre.id,
      unitId: 'fupre-dept-chemical',
    },
    {
      id: 'fupre-mechanical-101',
      name: 'Engineering Mechanics (MECH 101)',
      organizationId: fupre.id,
      unitId: 'fupre-dept-mechanical',
    },
    {
      id: 'fupre-mechanical-201',
      name: 'Thermodynamics (MECH 201)',
      organizationId: fupre.id,
      unitId: 'fupre-dept-mechanical',
    },
    {
      id: 'fupre-computer-101',
      name: 'Introduction to Computer Science (CSC 101)',
      organizationId: fupre.id,
      unitId: 'fupre-dept-computer',
    },
    {
      id: 'fupre-computer-201',
      name: 'Data Structures and Algorithms (CSC 201)',
      organizationId: fupre.id,
      unitId: 'fupre-dept-computer',
    },

    // DELSU Subjects
    {
      id: 'delsu-electrical-101',
      name: 'Electrical Engineering Fundamentals (ELE 101)',
      organizationId: delsu.id,
      unitId: 'delsu-dept-electrical',
    },
    {
      id: 'delsu-electrical-201',
      name: 'Circuit Analysis (ELE 201)',
      organizationId: delsu.id,
      unitId: 'delsu-dept-electrical',
    },
    {
      id: 'delsu-civil-101',
      name: 'Civil Engineering Principles (CIV 101)',
      organizationId: delsu.id,
      unitId: 'delsu-dept-civil',
    },
    {
      id: 'delsu-civil-201',
      name: 'Structural Analysis (CIV 201)',
      organizationId: delsu.id,
      unitId: 'delsu-dept-civil',
    },
    {
      id: 'delsu-physics-101',
      name: 'General Physics (PHY 101)',
      organizationId: delsu.id,
      unitId: 'delsu-dept-physics',
    },
    {
      id: 'delsu-physics-201',
      name: 'Modern Physics (PHY 201)',
      organizationId: delsu.id,
      unitId: 'delsu-dept-physics',
    },
    {
      id: 'delsu-math-101',
      name: 'Calculus I (MAT 101)',
      organizationId: delsu.id,
      unitId: 'delsu-dept-mathematics',
    },
    {
      id: 'delsu-math-201',
      name: 'Linear Algebra (MAT 201)',
      organizationId: delsu.id,
      unitId: 'delsu-dept-mathematics',
    },
  ];

  // Create all subjects
  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { id: subject.id },
      update: {},
      create: subject,
    });
  }

  console.log('✅ Subjects created');

  // Create Teachers
  const teachers = [
    // FUPRE Teachers
    {
      id: 'fupre-teacher-1',
      userId: 'fupre-teacher-user-1',
      employeeId: 'FUPRE/TEACHER/001',
      department: 'Petroleum Engineering',
      institution: 'Federal University of Petroleum Resources, Effurun',
    },
    {
      id: 'fupre-teacher-2',
      userId: 'fupre-teacher-user-2',
      employeeId: 'FUPRE/TEACHER/002',
      department: 'Chemical Engineering',
      institution: 'Federal University of Petroleum Resources, Effurun',
    },
    {
      id: 'fupre-teacher-3',
      userId: 'fupre-teacher-user-3',
      employeeId: 'FUPRE/TEACHER/003',
      department: 'Computer Science',
      institution: 'Federal University of Petroleum Resources, Effurun',
    },

    // DELSU Teachers
    {
      id: 'delsu-teacher-1',
      userId: 'delsu-teacher-user-1',
      employeeId: 'DELSU/TEACHER/001',
      department: 'Electrical Engineering',
      institution: 'Delta State University, Abraka',
    },
    {
      id: 'delsu-teacher-2',
      userId: 'delsu-teacher-user-2',
      employeeId: 'DELSU/TEACHER/002',
      department: 'Physics',
      institution: 'Delta State University, Abraka',
    },
    {
      id: 'delsu-teacher-3',
      userId: 'delsu-teacher-user-3',
      employeeId: 'DELSU/TEACHER/003',
      department: 'Mathematics',
      institution: 'Delta State University, Abraka',
    },
  ];

  // Create Teacher Users and Profiles
  for (const teacher of teachers) {
    const user = await prisma.user.upsert({
      where: { id: teacher.userId },
      update: {},
      create: {
        id: teacher.userId,
        email: `${teacher.employeeId
          .toLowerCase()
          .replace('/', '.')}@${teacher.institution
          .toLowerCase()
          .replace(/[^a-z]/g, '')}.edu.ng`,
        name: `Dr. ${teacher.department.split(' ')[0]} Professor`,
        role: 'TEACHER',
        organizationId: teacher.institution.includes('FUPRE')
          ? fupre.id
          : delsu.id,
        isActive: true,
        emailVerified: true,
      },
    });

    await prisma.teacher.upsert({
      where: { id: teacher.id },
      update: {},
      create: {
        id: teacher.id,
        userId: user.id,
        employeeId: teacher.employeeId,
        department: teacher.department,
      },
    });
  }

  console.log('✅ Teachers created');

  // Create Quizzes for each subject
  const quizzes = [
    // FUPRE Petroleum Engineering Quizzes
    {
      id: 'fupre-pete-101-quiz-1',
      title: 'Introduction to Petroleum Engineering - Quiz 1',
      description: 'Basic concepts and principles of petroleum engineering',
      subjectId: 'fupre-petroleum-101',
      organizationId: fupre.id,
      teacherId: 'fupre-teacher-user-1',
      timeLimit: 30,
      isPublished: true,
      status: 'ACTIVE' as const,
    },
    {
      id: 'fupre-pete-101-quiz-2',
      title: 'Introduction to Petroleum Engineering - Quiz 2',
      description: 'Advanced concepts in petroleum engineering fundamentals',
      subjectId: 'fupre-petroleum-101',
      organizationId: fupre.id,
      teacherId: 'fupre-teacher-user-1',
      timeLimit: 45,
      isPublished: true,
      status: 'ACTIVE' as const,
    },
    {
      id: 'fupre-pete-201-quiz-1',
      title: 'Reservoir Engineering - Quiz 1',
      description: 'Basic reservoir engineering principles',
      subjectId: 'fupre-petroleum-201',
      organizationId: fupre.id,
      teacherId: 'fupre-teacher-user-1',
      timeLimit: 40,
      isPublished: true,
      status: 'ACTIVE' as const,
    },
    {
      id: 'fupre-pete-201-quiz-2',
      title: 'Reservoir Engineering - Quiz 2',
      description: 'Advanced reservoir engineering concepts',
      subjectId: 'fupre-petroleum-201',
      organizationId: fupre.id,
      teacherId: 'fupre-teacher-user-1',
      timeLimit: 50,
      isPublished: true,
      status: 'ACTIVE' as const,
    },

    // FUPRE Chemical Engineering Quizzes
    {
      id: 'fupre-chem-101-quiz-1',
      title: 'Chemical Engineering Principles - Quiz 1',
      description: 'Basic chemical engineering principles',
      subjectId: 'fupre-chemical-101',
      organizationId: fupre.id,
      teacherId: 'fupre-teacher-user-2',
      timeLimit: 35,
      isPublished: true,
      status: 'ACTIVE' as const,
    },
    {
      id: 'fupre-chem-101-quiz-2',
      title: 'Chemical Engineering Principles - Quiz 2',
      description: 'Advanced chemical engineering concepts',
      subjectId: 'fupre-chemical-101',
      organizationId: fupre.id,
      teacherId: 'fupre-teacher-user-2',
      timeLimit: 40,
      isPublished: true,
      status: 'ACTIVE' as const,
    },
    {
      id: 'fupre-chem-201-quiz-1',
      title: 'Process Design - Quiz 1',
      description: 'Basic process design principles',
      subjectId: 'fupre-chemical-201',
      organizationId: fupre.id,
      teacherId: 'fupre-teacher-user-2',
      timeLimit: 45,
      isPublished: true,
      status: 'ACTIVE' as const,
    },
    {
      id: 'fupre-chem-201-quiz-2',
      title: 'Process Design - Quiz 2',
      description: 'Advanced process design concepts',
      subjectId: 'fupre-chemical-101',
      organizationId: fupre.id,
      teacherId: 'fupre-teacher-user-2',
      timeLimit: 50,
      isPublished: true,
      status: 'ACTIVE' as const,
    },

    // FUPRE Computer Science Quizzes
    {
      id: 'fupre-csc-101-quiz-1',
      title: 'Introduction to Computer Science - Quiz 1',
      description: 'Basic computer science concepts',
      subjectId: 'fupre-computer-101',
      organizationId: fupre.id,
      teacherId: 'fupre-teacher-user-3',
      timeLimit: 30,
      isPublished: true,
      status: 'ACTIVE' as const,
    },
    {
      id: 'fupre-csc-101-quiz-2',
      title: 'Introduction to Computer Science - Quiz 2',
      description: 'Programming fundamentals',
      subjectId: 'fupre-computer-101',
      organizationId: fupre.id,
      teacherId: 'fupre-teacher-user-3',
      timeLimit: 35,
      isPublished: true,
      status: 'ACTIVE' as const,
    },
    {
      id: 'fupre-csc-201-quiz-1',
      title: 'Data Structures - Quiz 1',
      description: 'Basic data structures concepts',
      subjectId: 'fupre-computer-201',
      organizationId: fupre.id,
      teacherId: 'fupre-teacher-user-3',
      timeLimit: 40,
      isPublished: true,
      status: 'ACTIVE' as const,
    },
    {
      id: 'fupre-csc-201-quiz-2',
      title: 'Algorithms - Quiz 1',
      description: 'Algorithm design and analysis',
      subjectId: 'fupre-computer-201',
      organizationId: fupre.id,
      teacherId: 'fupre-teacher-user-3',
      timeLimit: 45,
      isPublished: true,
      status: 'ACTIVE' as const,
    },

    // DELSU Electrical Engineering Quizzes
    {
      id: 'delsu-ele-101-quiz-1',
      title: 'Electrical Engineering Fundamentals - Quiz 1',
      description: 'Basic electrical engineering principles',
      subjectId: 'delsu-electrical-101',
      organizationId: delsu.id,
      teacherId: 'delsu-teacher-user-1',
      timeLimit: 35,
      isPublished: true,
      status: 'ACTIVE' as const,
    },
    {
      id: 'delsu-ele-101-quiz-2',
      title: 'Electrical Engineering Fundamentals - Quiz 2',
      description: 'Advanced electrical engineering concepts',
      subjectId: 'delsu-electrical-101',
      organizationId: delsu.id,
      teacherId: 'delsu-teacher-user-1',
      timeLimit: 40,
      isPublished: true,
      status: 'ACTIVE' as const,
    },
    {
      id: 'delsu-ele-201-quiz-1',
      title: 'Circuit Analysis - Quiz 1',
      description: 'Basic circuit analysis principles',
      subjectId: 'delsu-electrical-201',
      organizationId: delsu.id,
      teacherId: 'delsu-teacher-user-1',
      timeLimit: 45,
      isPublished: true,
      status: 'ACTIVE' as const,
    },
    {
      id: 'delsu-ele-201-quiz-2',
      title: 'Circuit Analysis - Quiz 2',
      description: 'Advanced circuit analysis concepts',
      subjectId: 'delsu-electrical-201',
      organizationId: delsu.id,
      teacherId: 'delsu-teacher-user-1',
      timeLimit: 50,
      isPublished: true,
      status: 'ACTIVE' as const,
    },

    // DELSU Physics Quizzes
    {
      id: 'delsu-phy-101-quiz-1',
      title: 'General Physics - Quiz 1',
      description: 'Basic physics principles',
      subjectId: 'delsu-physics-101',
      organizationId: delsu.id,
      teacherId: 'delsu-teacher-user-2',
      timeLimit: 30,
      isPublished: true,
      status: 'ACTIVE' as const,
    },
    {
      id: 'delsu-phy-101-quiz-2',
      title: 'General Physics - Quiz 2',
      description: 'Advanced physics concepts',
      subjectId: 'delsu-physics-101',
      organizationId: delsu.id,
      teacherId: 'delsu-teacher-user-2',
      timeLimit: 35,
      isPublished: true,
      status: 'ACTIVE' as const,
    },
    {
      id: 'delsu-phy-201-quiz-1',
      title: 'Modern Physics - Quiz 1',
      description: 'Basic modern physics concepts',
      subjectId: 'delsu-physics-201',
      organizationId: delsu.id,
      teacherId: 'delsu-teacher-user-2',
      timeLimit: 40,
      isPublished: true,
      status: 'ACTIVE' as const,
    },
    {
      id: 'delsu-phy-201-quiz-2',
      title: 'Modern Physics - Quiz 2',
      description: 'Advanced modern physics concepts',
      subjectId: 'delsu-physics-201',
      organizationId: delsu.id,
      teacherId: 'delsu-teacher-user-2',
      timeLimit: 45,
      isPublished: true,
      status: 'ACTIVE' as const,
    },

    // DELSU Mathematics Quizzes
    {
      id: 'delsu-mat-101-quiz-1',
      title: 'Calculus I - Quiz 1',
      description: 'Basic calculus concepts',
      subjectId: 'delsu-math-101',
      organizationId: delsu.id,
      teacherId: 'delsu-teacher-user-3',
      timeLimit: 35,
      isPublished: true,
      status: 'ACTIVE' as const,
    },
    {
      id: 'delsu-mat-101-quiz-2',
      title: 'Calculus I - Quiz 2',
      description: 'Advanced calculus concepts',
      subjectId: 'delsu-math-101',
      organizationId: delsu.id,
      teacherId: 'delsu-teacher-user-3',
      timeLimit: 40,
      isPublished: true,
      status: 'ACTIVE' as const,
    },
    {
      id: 'delsu-mat-201-quiz-1',
      title: 'Linear Algebra - Quiz 1',
      description: 'Basic linear algebra concepts',
      subjectId: 'delsu-math-201',
      organizationId: delsu.id,
      teacherId: 'delsu-teacher-user-3',
      timeLimit: 45,
      isPublished: true,
      status: 'ACTIVE' as const,
    },
    {
      id: 'delsu-mat-201-quiz-2',
      title: 'Linear Algebra - Quiz 2',
      description: 'Advanced linear algebra concepts',
      subjectId: 'delsu-math-201',
      organizationId: delsu.id,
      teacherId: 'delsu-teacher-user-3',
      timeLimit: 50,
      isPublished: true,
      status: 'ACTIVE' as const,
    },
  ];

  // Create all quizzes
  for (const quiz of quizzes) {
    await prisma.quiz.upsert({
      where: { id: quiz.id },
      update: {},
      create: quiz,
    });
  }

  console.log('✅ Quizzes created');

  // Create sample questions for each quiz
  const questions = [
    // FUPRE Petroleum Engineering Questions
    {
      id: 'fupre-pete-101-q1',
      quizId: 'fupre-pete-101-quiz-1',
      text: 'What is the primary objective of petroleum engineering?',
      type: 'MULTIPLE_CHOICE' as const,
      options: [
        'To extract oil and gas efficiently',
        'To design buildings',
        'To create software',
        'To study plants',
      ],
      correctAnswer: 'To extract oil and gas efficiently',
      points: 10,
      order: 1,
      organizationId: fupre.id,
    },
    {
      id: 'fupre-pete-101-q2',
      quizId: 'fupre-pete-101-quiz-1',
      text: 'Which of the following is NOT a type of petroleum reservoir?',
      type: 'MULTIPLE_CHOICE' as const,
      options: [
        'Conventional reservoir',
        'Unconventional reservoir',
        'Shale gas reservoir',
        'Solar panel reservoir',
      ],
      correctAnswer: 'Solar panel reservoir',
      points: 10,
      order: 2,
      organizationId: fupre.id,
    },
    {
      id: 'fupre-pete-101-q3',
      quizId: 'fupre-pete-101-quiz-1',
      text: 'What is the main component of natural gas?',
      type: 'MULTIPLE_CHOICE' as const,
      options: ['Methane', 'Ethane', 'Propane', 'Butane'],
      correctAnswer: 'Methane',
      points: 10,
      order: 3,
      organizationId: fupre.id,
    },

    // DELSU Electrical Engineering Questions
    {
      id: 'delsu-ele-101-q1',
      quizId: 'delsu-ele-101-quiz-1',
      text: "What is Ohm's Law?",
      type: 'MULTIPLE_CHOICE' as const,
      options: ['V = IR', 'P = VI', 'F = ma', 'E = mc²'],
      correctAnswer: 'V = IR',
      points: 10,
      order: 1,
      organizationId: delsu.id,
    },
    {
      id: 'delsu-ele-101-q2',
      quizId: 'delsu-ele-101-quiz-1',
      text: 'Which component stores electrical energy?',
      type: 'MULTIPLE_CHOICE' as const,
      options: ['Capacitor', 'Resistor', 'Inductor', 'Transistor'],
      correctAnswer: 'Capacitor',
      points: 10,
      order: 2,
      organizationId: delsu.id,
    },
    {
      id: 'delsu-ele-101-q3',
      quizId: 'delsu-ele-101-quiz-1',
      text: 'What is the unit of electrical resistance?',
      type: 'MULTIPLE_CHOICE' as const,
      options: ['Ohm', 'Volt', 'Ampere', 'Watt'],
      correctAnswer: 'Ohm',
      points: 10,
      order: 3,
      organizationId: delsu.id,
    },

    // DELSU Physics Questions
    {
      id: 'delsu-phy-101-q1',
      quizId: 'delsu-phy-101-quiz-1',
      text: "What is Newton's First Law?",
      type: 'MULTIPLE_CHOICE' as const,
      options: [
        'An object at rest stays at rest unless acted upon by an external force',
        'Force equals mass times acceleration',
        'For every action there is an equal and opposite reaction',
        'Energy cannot be created or destroyed',
      ],
      correctAnswer:
        'An object at rest stays at rest unless acted upon by an external force',
      points: 10,
      order: 1,
      organizationId: delsu.id,
    },
    {
      id: 'delsu-phy-101-q2',
      quizId: 'delsu-phy-101-quiz-1',
      text: 'What is the SI unit of force?',
      type: 'MULTIPLE_CHOICE' as const,
      options: ['Newton', 'Joule', 'Watt', 'Pascal'],
      correctAnswer: 'Newton',
      points: 10,
      order: 2,
      organizationId: delsu.id,
    },
    {
      id: 'delsu-phy-101-q3',
      quizId: 'delsu-phy-101-quiz-1',
      text: 'What is the formula for kinetic energy?',
      type: 'MULTIPLE_CHOICE' as const,
      options: ['KE = ½mv²', 'KE = mgh', 'KE = Fd', 'KE = Pt'],
      correctAnswer: 'KE = ½mv²',
      points: 10,
      order: 3,
      organizationId: delsu.id,
    },
  ];

  // Create all questions
  for (const question of questions) {
    await prisma.question.upsert({
      where: { id: question.id },
      update: {},
      create: question,
    });
  }

  console.log('✅ Questions created');

  console.log('🎉 Database seeding completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log('- 2 Organizations (FUPRE, DELSU)');
  console.log('- 12 Organizational Units (6 each)');
  console.log('- 16 Subjects/Courses (8 each)');
  console.log('- 6 Teachers (3 each)');
  console.log('- 24 Quizzes (2 per subject)');
  console.log('- 9 Sample Questions');
  console.log('');
  console.log('👥 Test Accounts:');
  console.log('Teachers:');
  console.log('- fupre.teacher.001@fupre.edu.ng');
  console.log('- fupre.teacher.002@fupre.edu.ng');
  console.log('- fupre.teacher.003@fupre.edu.ng');
  console.log('- delsu.teacher.001@delsu.edu.ng');
  console.log('- delsu.teacher.002@delsu.edu.ng');
  console.log('- delsu.teacher.003@delsu.edu.ng');
  console.log('');
  console.log('🎓 You can now sign up as a student or teacher!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
