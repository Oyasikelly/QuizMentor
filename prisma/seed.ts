import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for FUPRE...');

  // Create FUPRE organization
  const fupreOrg = await prisma.organization.upsert({
    where: { id: 'fupre-org' },
    update: {},
    create: {
      id: 'fupre-org',
      name: 'Federal University of Petroleum Resources, Effurun',
      slug: 'fupre',
      type: 'UNIVERSITY',
      domain: 'fupre.edu.ng',
      email: 'info@fupre.edu.ng',
      address: 'Effurun, Delta State, Nigeria',
      phone: '+234-xxx-xxxx',
      subscriptionPlan: 'premium',
      isActive: true,
    },
  });

  console.log('✅ Created organization:', fupreOrg.name);

  // Create organizational units (departments/faculties)
  const engineeringDept = await prisma.organizationalUnit.upsert({
    where: { id: 'fupre-eng-dept' },
    update: {},
    create: {
      id: 'fupre-eng-dept',
      organizationId: fupreOrg.id,
      name: 'Faculty of Engineering',
      type: 'FACULTY',
      description: 'Faculty of Engineering and Technology',
      isActive: true,
    },
  });

  const scienceDept = await prisma.organizationalUnit.upsert({
    where: { id: 'fupre-sci-dept' },
    update: {},
    create: {
      id: 'fupre-sci-dept',
      organizationId: fupreOrg.id,
      name: 'Faculty of Science',
      type: 'FACULTY',
      description: 'Faculty of Science and Technology',
      isActive: true,
    },
  });

  const petroleumDept = await prisma.organizationalUnit.upsert({
    where: { id: 'fupre-pet-dept' },
    update: {},
    create: {
      id: 'fupre-pet-dept',
      organizationId: fupreOrg.id,
      name: 'Department of Petroleum Engineering',
      type: 'DEPARTMENT',
      description: 'Department of Petroleum Engineering',
      parentId: engineeringDept.id,
      isActive: true,
    },
  });

  const chemicalDept = await prisma.organizationalUnit.upsert({
    where: { id: 'fupre-chem-dept' },
    update: {},
    create: {
      id: 'fupre-chem-dept',
      organizationId: fupreOrg.id,
      name: 'Department of Chemical Engineering',
      type: 'DEPARTMENT',
      description: 'Department of Chemical Engineering',
      parentId: engineeringDept.id,
      isActive: true,
    },
  });

  const physicsDept = await prisma.organizationalUnit.upsert({
    where: { id: 'fupre-phy-dept' },
    update: {},
    create: {
      id: 'fupre-phy-dept',
      organizationId: fupreOrg.id,
      name: 'Department of Physics',
      type: 'DEPARTMENT',
      description: 'Department of Physics',
      parentId: scienceDept.id,
      isActive: true,
    },
  });

  console.log('✅ Created organizational units');

  // Create subjects
  const subjects = await Promise.all([
    prisma.subject.upsert({
      where: { id: 'fupre-subj-001' },
      update: {},
      create: {
        id: 'fupre-subj-001',
        name: 'Petroleum Engineering',
        organizationId: fupreOrg.id,
        unitId: petroleumDept.id,
      },
    }),
    prisma.subject.upsert({
      where: { id: 'fupre-subj-002' },
      update: {},
      create: {
        id: 'fupre-subj-002',
        name: 'Chemical Engineering',
        organizationId: fupreOrg.id,
        unitId: chemicalDept.id,
      },
    }),
    prisma.subject.upsert({
      where: { id: 'fupre-subj-003' },
      update: {},
      create: {
        id: 'fupre-subj-003',
        name: 'Physics',
        organizationId: fupreOrg.id,
        unitId: physicsDept.id,
      },
    }),
    prisma.subject.upsert({
      where: { id: 'fupre-subj-004' },
      update: {},
      create: {
        id: 'fupre-subj-004',
        name: 'Mathematics',
        organizationId: fupreOrg.id,
        unitId: scienceDept.id,
      },
    }),
    prisma.subject.upsert({
      where: { id: 'fupre-subj-005' },
      update: {},
      create: {
        id: 'fupre-subj-005',
        name: 'Chemistry',
        organizationId: fupreOrg.id,
        unitId: scienceDept.id,
      },
    }),
  ]);

  console.log('✅ Created subjects');

  // Create teachers
  const teachers = await Promise.all([
    prisma.user.upsert({
      where: { id: 'fupre-teacher-001' },
      update: {},
      create: {
        id: 'fupre-teacher-001',
        email: 'dr.adebayo@fupre.edu.ng',
        name: 'Dr. Adebayo Johnson',
        password: 'hashedpassword123',
        role: 'TEACHER',
        organizationId: fupreOrg.id,
        unitId: petroleumDept.id,
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { id: 'fupre-teacher-002' },
      update: {},
      create: {
        id: 'fupre-teacher-002',
        email: 'prof.ogunleye@fupre.edu.ng',
        name: 'Prof. Ogunleye Sarah',
        password: 'hashedpassword123',
        role: 'TEACHER',
        organizationId: fupreOrg.id,
        unitId: chemicalDept.id,
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { id: 'fupre-teacher-003' },
      update: {},
      create: {
        id: 'fupre-teacher-003',
        email: 'dr.ekong@fupre.edu.ng',
        name: 'Dr. Ekong Michael',
        password: 'hashedpassword123',
        role: 'TEACHER',
        organizationId: fupreOrg.id,
        unitId: physicsDept.id,
        isActive: true,
      },
    }),
  ]);

  // Create teacher profiles
  await Promise.all([
    prisma.teacher.upsert({
      where: { id: 'fupre-teacher-profile-001' },
      update: {},
      create: {
        id: 'fupre-teacher-profile-001',
        userId: teachers[0].id,
        employeeId: 'FUPRE-EMP-001',
        department: 'Petroleum Engineering',
        phoneNumber: '+234-801-234-5678',
      },
    }),
    prisma.teacher.upsert({
      where: { id: 'fupre-teacher-profile-002' },
      update: {},
      create: {
        id: 'fupre-teacher-profile-002',
        userId: teachers[1].id,
        employeeId: 'FUPRE-EMP-002',
        department: 'Chemical Engineering',
        phoneNumber: '+234-802-345-6789',
      },
    }),
    prisma.teacher.upsert({
      where: { id: 'fupre-teacher-profile-003' },
      update: {},
      create: {
        id: 'fupre-teacher-profile-003',
        userId: teachers[2].id,
        employeeId: 'FUPRE-EMP-003',
        department: 'Physics',
        phoneNumber: '+234-803-456-7890',
      },
    }),
  ]);

  // Create students
  const students = await Promise.all([
    prisma.user.upsert({
      where: { id: 'cmd6ea83a0001w0xgq1sk3t1o' },
      update: {},
      create: {
        id: 'cmd6ea83a0001w0xgq1sk3t1o',
        email: 'test.student@fupre.edu.ng',
        name: 'Test Student',
        password: 'hashedpassword123',
        role: 'STUDENT',
        organizationId: fupreOrg.id,
        unitId: petroleumDept.id,
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { id: 'fupre-student-001' },
      update: {},
      create: {
        id: 'fupre-student-001',
        email: 'student1@fupre.edu.ng',
        name: 'Aisha Mohammed',
        password: 'hashedpassword123',
        role: 'STUDENT',
        organizationId: fupreOrg.id,
        unitId: petroleumDept.id,
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { id: 'fupre-student-002' },
      update: {},
      create: {
        id: 'fupre-student-002',
        email: 'student2@fupre.edu.ng',
        name: 'Chukwudi Okonkwo',
        password: 'hashedpassword123',
        role: 'STUDENT',
        organizationId: fupreOrg.id,
        unitId: chemicalDept.id,
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { id: 'fupre-student-003' },
      update: {},
      create: {
        id: 'fupre-student-003',
        email: 'student3@fupre.edu.ng',
        name: 'Fatima Hassan',
        password: 'hashedpassword123',
        role: 'STUDENT',
        organizationId: fupreOrg.id,
        unitId: physicsDept.id,
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { id: 'fupre-student-004' },
      update: {},
      create: {
        id: 'fupre-student-004',
        email: 'student4@fupre.edu.ng',
        name: 'Emeka Okafor',
        password: 'hashedpassword123',
        role: 'STUDENT',
        organizationId: fupreOrg.id,
        unitId: petroleumDept.id,
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { id: 'fupre-student-005' },
      update: {},
      create: {
        id: 'fupre-student-005',
        email: 'student5@fupre.edu.ng',
        name: 'Zainab Abdullahi',
        password: 'hashedpassword123',
        role: 'STUDENT',
        organizationId: fupreOrg.id,
        unitId: chemicalDept.id,
        isActive: true,
      },
    }),
  ]);

  // Create student profiles
  await Promise.all([
    prisma.student.upsert({
      where: { id: 'test-student-profile' },
      update: {},
      create: {
        id: 'test-student-profile',
        userId: students[0].id,
        studentId: 'TEST-2024-001',
        classYear: '2024',
        academicLevel: 'Undergraduate',
        phoneNumber: '+234-900-000-0000',
      },
    }),
    prisma.student.upsert({
      where: { id: 'fupre-student-profile-001' },
      update: {},
      create: {
        id: 'fupre-student-profile-001',
        userId: students[1].id,
        studentId: 'FUPRE-2024-001',
        classYear: '2024',
        academicLevel: 'Undergraduate',
        phoneNumber: '+234-901-234-5678',
      },
    }),
    prisma.student.upsert({
      where: { id: 'fupre-student-profile-002' },
      update: {},
      create: {
        id: 'fupre-student-profile-002',
        userId: students[2].id,
        studentId: 'FUPRE-2024-002',
        classYear: '2024',
        academicLevel: 'Undergraduate',
        phoneNumber: '+234-902-345-6789',
      },
    }),
    prisma.student.upsert({
      where: { id: 'fupre-student-profile-003' },
      update: {},
      create: {
        id: 'fupre-student-profile-003',
        userId: students[3].id,
        studentId: 'FUPRE-2024-003',
        classYear: '2024',
        academicLevel: 'Undergraduate',
        phoneNumber: '+234-903-456-7890',
      },
    }),
    prisma.student.upsert({
      where: { id: 'fupre-student-profile-004' },
      update: {},
      create: {
        id: 'fupre-student-profile-004',
        userId: students[4].id,
        studentId: 'FUPRE-2024-004',
        classYear: '2024',
        academicLevel: 'Undergraduate',
        phoneNumber: '+234-904-567-8901',
      },
    }),
    prisma.student.upsert({
      where: { id: 'fupre-student-profile-005' },
      update: {},
      create: {
        id: 'fupre-student-profile-005',
        userId: students[5].id,
        studentId: 'FUPRE-2024-005',
        classYear: '2024',
        academicLevel: 'Undergraduate',
        phoneNumber: '+234-905-678-9012',
      },
    }),
  ]);

  console.log('✅ Created users (teachers and students)');

  // Create quizzes
  const quizzes = await Promise.all([
    prisma.quiz.upsert({
      where: { id: 'fupre-quiz-001' },
      update: {},
      create: {
        id: 'fupre-quiz-001',
        title: 'Introduction to Petroleum Engineering',
        description: 'Basic concepts and principles of petroleum engineering',
        subject: 'Petroleum Engineering',
        timeLimit: 45,
        totalPoints: 100,
        isPublished: true,
        teacherId: teachers[0].id,
        organizationId: fupreOrg.id,
      },
    }),
    prisma.quiz.upsert({
      where: { id: 'fupre-quiz-002' },
      update: {},
      create: {
        id: 'fupre-quiz-002',
        title: 'Chemical Process Design',
        description: 'Fundamentals of chemical process design and optimization',
        subject: 'Chemical Engineering',
        timeLimit: 60,
        totalPoints: 150,
        isPublished: true,
        teacherId: teachers[1].id,
        organizationId: fupreOrg.id,
      },
    }),
    prisma.quiz.upsert({
      where: { id: 'fupre-quiz-003' },
      update: {},
      create: {
        id: 'fupre-quiz-003',
        title: 'Quantum Physics Fundamentals',
        description:
          'Introduction to quantum mechanics and wave-particle duality',
        subject: 'Physics',
        timeLimit: 50,
        totalPoints: 120,
        isPublished: true,
        teacherId: teachers[2].id,
        organizationId: fupreOrg.id,
      },
    }),
    prisma.quiz.upsert({
      where: { id: 'fupre-quiz-004' },
      update: {},
      create: {
        id: 'fupre-quiz-004',
        title: 'Advanced Calculus',
        description: 'Complex calculus problems and mathematical analysis',
        subject: 'Mathematics',
        timeLimit: 75,
        totalPoints: 200,
        isPublished: true,
        teacherId: teachers[0].id,
        organizationId: fupreOrg.id,
      },
    }),
    prisma.quiz.upsert({
      where: { id: 'fupre-quiz-005' },
      update: {},
      create: {
        id: 'fupre-quiz-005',
        title: 'Organic Chemistry',
        description: 'Organic chemistry principles and reactions',
        subject: 'Chemistry',
        timeLimit: 40,
        totalPoints: 80,
        isPublished: true,
        teacherId: teachers[1].id,
        organizationId: fupreOrg.id,
      },
    }),
  ]);

  console.log('✅ Created quizzes');

  // Create questions for each quiz
  const questions = await Promise.all([
    // Questions for Petroleum Engineering Quiz
    prisma.question.upsert({
      where: { id: 'fupre-q-001' },
      update: {},
      create: {
        id: 'fupre-q-001',
        text: 'What is the primary function of a drilling rig?',
        type: 'MULTIPLE_CHOICE',
        options: [
          'To extract oil',
          'To drill wells',
          'To transport oil',
          'To refine oil',
        ],
        correctAnswer: 'To drill wells',
        points: 10,
        order: 1,
        quizId: quizzes[0].id,
        organizationId: fupreOrg.id,
      },
    }),
    prisma.question.upsert({
      where: { id: 'fupre-q-002' },
      update: {},
      create: {
        id: 'fupre-q-002',
        text: 'Which of the following is NOT a type of petroleum reservoir?',
        type: 'MULTIPLE_CHOICE',
        options: ['Conventional', 'Unconventional', 'Synthetic', 'Natural'],
        correctAnswer: 'Synthetic',
        points: 10,
        order: 2,
        quizId: quizzes[0].id,
        organizationId: fupreOrg.id,
      },
    }),
    prisma.question.upsert({
      where: { id: 'fupre-q-003' },
      update: {},
      create: {
        id: 'fupre-q-003',
        text: 'What is the main component of natural gas?',
        type: 'MULTIPLE_CHOICE',
        options: ['Methane', 'Ethane', 'Propane', 'Butane'],
        correctAnswer: 'Methane',
        points: 10,
        order: 3,
        quizId: quizzes[0].id,
        organizationId: fupreOrg.id,
      },
    }),

    // Questions for Chemical Engineering Quiz
    prisma.question.upsert({
      where: { id: 'fupre-q-004' },
      update: {},
      create: {
        id: 'fupre-q-004',
        text: 'What is the purpose of a distillation column?',
        type: 'MULTIPLE_CHOICE',
        options: [
          'To mix chemicals',
          'To separate components',
          'To heat materials',
          'To cool materials',
        ],
        correctAnswer: 'To separate components',
        points: 15,
        order: 1,
        quizId: quizzes[1].id,
        organizationId: fupreOrg.id,
      },
    }),
    prisma.question.upsert({
      where: { id: 'fupre-q-005' },
      update: {},
      create: {
        id: 'fupre-q-005',
        text: 'Which unit operation is used for solid-liquid separation?',
        type: 'MULTIPLE_CHOICE',
        options: [
          'Distillation',
          'Filtration',
          'Crystallization',
          'Evaporation',
        ],
        correctAnswer: 'Filtration',
        points: 15,
        order: 2,
        quizId: quizzes[1].id,
        organizationId: fupreOrg.id,
      },
    }),

    // Questions for Physics Quiz
    prisma.question.upsert({
      where: { id: 'fupre-q-006' },
      update: {},
      create: {
        id: 'fupre-q-006',
        text: 'What is the Heisenberg Uncertainty Principle?',
        type: 'MULTIPLE_CHOICE',
        options: [
          'You cannot know both position and momentum simultaneously',
          'You cannot observe quantum particles',
          'Quantum particles are always uncertain',
          'Measurement affects quantum systems',
        ],
        correctAnswer:
          'You cannot know both position and momentum simultaneously',
        points: 12,
        order: 1,
        quizId: quizzes[2].id,
        organizationId: fupreOrg.id,
      },
    }),
    prisma.question.upsert({
      where: { id: 'fupre-q-007' },
      update: {},
      create: {
        id: 'fupre-q-007',
        text: 'What is wave-particle duality?',
        type: 'MULTIPLE_CHOICE',
        options: [
          'Particles can behave as waves',
          'Waves can behave as particles',
          'Both A and B',
          'Neither A nor B',
        ],
        correctAnswer: 'Both A and B',
        points: 12,
        order: 2,
        quizId: quizzes[2].id,
        organizationId: fupreOrg.id,
      },
    }),
  ]);

  console.log('✅ Created questions');

  // Create quiz attempts
  const attempts = await Promise.all([
    prisma.quizAttempt.upsert({
      where: { id: 'fupre-attempt-001' },
      update: {},
      create: {
        id: 'fupre-attempt-001',
        score: 85,
        totalPoints: 100,
        timeSpent: 1800, // 30 minutes
        completedAt: new Date(),
        quizId: quizzes[0].id,
        studentId: students[0].id,
        organizationId: fupreOrg.id,
      },
    }),
    prisma.quizAttempt.upsert({
      where: { id: 'fupre-attempt-002' },
      update: {},
      create: {
        id: 'fupre-attempt-002',
        score: 92,
        totalPoints: 150,
        timeSpent: 2400, // 40 minutes
        completedAt: new Date(),
        quizId: quizzes[1].id,
        studentId: students[1].id,
        organizationId: fupreOrg.id,
      },
    }),
    prisma.quizAttempt.upsert({
      where: { id: 'fupre-attempt-003' },
      update: {},
      create: {
        id: 'fupre-attempt-003',
        score: 78,
        totalPoints: 120,
        timeSpent: 2000, // 33 minutes
        completedAt: new Date(),
        quizId: quizzes[2].id,
        studentId: students[2].id,
        organizationId: fupreOrg.id,
      },
    }),
  ]);

  console.log('✅ Created quiz attempts');

  // Create quiz answers
  await Promise.all([
    prisma.quizAnswer.upsert({
      where: { id: 'fupre-answer-001' },
      update: {},
      create: {
        id: 'fupre-answer-001',
        answer: 'To drill wells',
        isCorrect: true,
        pointsEarned: 10,
        attemptId: attempts[0].id,
        questionId: questions[0].id,
        organizationId: fupreOrg.id,
      },
    }),
    prisma.quizAnswer.upsert({
      where: { id: 'fupre-answer-002' },
      update: {},
      create: {
        id: 'fupre-answer-002',
        answer: 'Synthetic',
        isCorrect: true,
        pointsEarned: 10,
        attemptId: attempts[0].id,
        questionId: questions[1].id,
        organizationId: fupreOrg.id,
      },
    }),
    prisma.quizAnswer.upsert({
      where: { id: 'fupre-answer-003' },
      update: {},
      create: {
        id: 'fupre-answer-003',
        answer: 'Methane',
        isCorrect: true,
        pointsEarned: 10,
        attemptId: attempts[0].id,
        questionId: questions[2].id,
        organizationId: fupreOrg.id,
      },
    }),
  ]);

  console.log('✅ Created quiz answers');

  console.log('🎉 FUPRE Database seeding completed successfully!');
  console.log('\n📊 FUPRE Sample Data Created:');
  console.log(
    '- Organization: Federal University of Petroleum Resources, Effurun'
  );
  console.log('- Organizational Units: 5 departments/faculties');
  console.log('- Subjects: 5 subjects');
  console.log('- Teachers: 3 teachers');
  console.log('- Students: 5 students');
  console.log('- Quizzes: 5 published quizzes');
  console.log('- Questions: 7 sample questions');
  console.log('- Quiz Attempts: 3 attempts');
  console.log('- Quiz Answers: 3 answers');
  console.log('\n👥 Sample Users:');
  console.log('- Teachers: Dr. Adebayo, Prof. Ogunleye, Dr. Ekong');
  console.log('- Students: Aisha, Chukwudi, Fatima, Emeka, Zainab');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
