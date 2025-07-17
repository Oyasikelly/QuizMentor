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

  // Build subject name-to-id map for FUPRE
  const fupreSubjectsByName: Record<string, string> = {};
  for (const subj of await prisma.subject.findMany({
    where: { organizationId: fupreOrg.id },
  })) {
    fupreSubjectsByName[subj.name] = subj.id;
  }

  // Create quizzes for FUPRE
  const quizzes = await Promise.all([
    prisma.quiz.upsert({
      where: { id: 'fupre-quiz-001' },
      update: {},
      create: {
        id: 'fupre-quiz-001',
        title: 'Introduction to Petroleum Engineering',
        description: 'Basic algebraic concepts and equations',
        subjectId: fupreSubjectsByName['Petroleum Engineering'],
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
        subjectId: fupreSubjectsByName['Chemical Engineering'],
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
        subjectId: fupreSubjectsByName['Physics'],
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
        subjectId: fupreSubjectsByName['Mathematics'],
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
        subjectId: fupreSubjectsByName['Chemistry'],
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

  // === DELTATECH INSTITUTE SEED DATA ===
  console.log('🌱 Seeding DeltaTech Institute...');

  // Create DeltaTech organization
  const dtiOrg = await prisma.organization.upsert({
    where: { id: 'dti-org' },
    update: {},
    create: {
      id: 'dti-org',
      name: 'DeltaTech Institute',
      slug: 'deltatech',
      type: 'INSTITUTE',
      domain: 'deltatech.edu.ng',
      email: 'info@deltatech.edu.ng',
      address: 'Asaba, Delta State, Nigeria',
      phone: '+234-yyy-yyyy',
      subscriptionPlan: 'premium',
      isActive: true,
    },
  });

  // Create organizational units
  const dtiEngDept = await prisma.organizationalUnit.upsert({
    where: { id: 'dti-eng-dept' },
    update: {},
    create: {
      id: 'dti-eng-dept',
      organizationId: dtiOrg.id,
      name: 'School of Engineering',
      type: 'FACULTY',
      description: 'Engineering Faculty',
      isActive: true,
    },
  });
  const dtiCompDept = await prisma.organizationalUnit.upsert({
    where: { id: 'dti-comp-dept' },
    update: {},
    create: {
      id: 'dti-comp-dept',
      organizationId: dtiOrg.id,
      name: 'Department of Computer Science',
      type: 'DEPARTMENT',
      description: 'Computer Science Department',
      parentId: dtiEngDept.id,
      isActive: true,
    },
  });
  const dtiBizDept = await prisma.organizationalUnit.upsert({
    where: { id: 'dti-biz-dept' },
    update: {},
    create: {
      id: 'dti-biz-dept',
      organizationId: dtiOrg.id,
      name: 'School of Business',
      type: 'FACULTY',
      description: 'Business Faculty',
      isActive: true,
    },
  });
  const dtiAcctDept = await prisma.organizationalUnit.upsert({
    where: { id: 'dti-acct-dept' },
    update: {},
    create: {
      id: 'dti-acct-dept',
      organizationId: dtiOrg.id,
      name: 'Department of Accounting',
      type: 'DEPARTMENT',
      description: 'Accounting Department',
      parentId: dtiBizDept.id,
      isActive: true,
    },
  });

  // Create subjects
  const dtiSubjects = await Promise.all([
    prisma.subject.upsert({
      where: { id: 'dti-subj-001' },
      update: {},
      create: {
        id: 'dti-subj-001',
        name: 'Computer Science',
        organizationId: dtiOrg.id,
        unitId: dtiCompDept.id,
      },
    }),
    prisma.subject.upsert({
      where: { id: 'dti-subj-002' },
      update: {},
      create: {
        id: 'dti-subj-002',
        name: 'Software Engineering',
        organizationId: dtiOrg.id,
        unitId: dtiCompDept.id,
      },
    }),
    prisma.subject.upsert({
      where: { id: 'dti-subj-003' },
      update: {},
      create: {
        id: 'dti-subj-003',
        name: 'Accounting',
        organizationId: dtiOrg.id,
        unitId: dtiAcctDept.id,
      },
    }),
    prisma.subject.upsert({
      where: { id: 'dti-subj-004' },
      update: {},
      create: {
        id: 'dti-subj-004',
        name: 'Business Administration',
        organizationId: dtiOrg.id,
        unitId: dtiBizDept.id,
      },
    }),
  ]);

  // Create teachers
  const dtiTeachers = await Promise.all([
    prisma.user.upsert({
      where: { id: 'dti-teacher-001' },
      update: {},
      create: {
        id: 'dti-teacher-001',
        email: 'mrs.ogbe@deltatech.edu.ng',
        password: 'hashedpassword123',
        role: 'TEACHER',
        organizationId: dtiOrg.id,
        unitId: dtiCompDept.id,
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { id: 'dti-teacher-002' },
      update: {},
      create: {
        id: 'dti-teacher-002',
        email: 'mr.adebisi@deltatech.edu.ng',
        password: 'hashedpassword123',
        role: 'TEACHER',
        organizationId: dtiOrg.id,
        unitId: dtiAcctDept.id,
        isActive: true,
      },
    }),
  ]);

  // Create teacher profiles
  await Promise.all([
    prisma.teacher.upsert({
      where: { id: 'dti-teacher-profile-001' },
      update: {},
      create: {
        id: 'dti-teacher-profile-001',
        userId: dtiTeachers[0].id,
        employeeId: 'DTI-EMP-001',
        department: 'Computer Science',
        phoneNumber: '+234-811-111-1111',
      },
    }),
    prisma.teacher.upsert({
      where: { id: 'dti-teacher-profile-002' },
      update: {},
      create: {
        id: 'dti-teacher-profile-002',
        userId: dtiTeachers[1].id,
        employeeId: 'DTI-EMP-002',
        department: 'Accounting',
        phoneNumber: '+234-822-222-2222',
      },
    }),
  ]);

  // Create students
  const dtiStudents = await Promise.all([
    prisma.user.upsert({
      where: { id: 'dti-student-001' },
      update: {},
      create: {
        id: 'dti-student-001',
        email: 'student1@deltatech.edu.ng',
        password: 'hashedpassword123',
        role: 'STUDENT',
        organizationId: dtiOrg.id,
        unitId: dtiCompDept.id,
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { id: 'dti-student-002' },
      update: {},
      create: {
        id: 'dti-student-002',
        email: 'student2@deltatech.edu.ng',
        password: 'hashedpassword123',
        role: 'STUDENT',
        organizationId: dtiOrg.id,
        unitId: dtiAcctDept.id,
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { id: 'dti-student-003' },
      update: {},
      create: {
        id: 'dti-student-003',
        email: 'student3@deltatech.edu.ng',
        password: 'hashedpassword123',
        role: 'STUDENT',
        organizationId: dtiOrg.id,
        unitId: dtiBizDept.id,
        isActive: true,
      },
    }),
  ]);

  // Create student profiles
  await Promise.all([
    prisma.student.upsert({
      where: { id: 'dti-student-profile-001' },
      update: {},
      create: {
        id: 'dti-student-profile-001',
        userId: dtiStudents[0].id,
        studentId: 'DTI-2024-001',
        classYear: '2024',
        academicLevel: 'ND',
        phoneNumber: '+234-833-333-3333',
      },
    }),
    prisma.student.upsert({
      where: { id: 'dti-student-profile-002' },
      update: {},
      create: {
        id: 'dti-student-profile-002',
        userId: dtiStudents[1].id,
        studentId: 'DTI-2024-002',
        classYear: '2024',
        academicLevel: 'ND',
        phoneNumber: '+234-844-444-4444',
      },
    }),
    prisma.student.upsert({
      where: { id: 'dti-student-profile-003' },
      update: {},
      create: {
        id: 'dti-student-profile-003',
        userId: dtiStudents[2].id,
        studentId: 'DTI-2024-003',
        classYear: '2024',
        academicLevel: 'ND',
        phoneNumber: '+234-855-555-5555',
      },
    }),
  ]);

  // Build subject name-to-id map for DeltaTech
  const dtiSubjectsByName: Record<string, string> = {};
  for (const subj of await prisma.subject.findMany({
    where: { organizationId: dtiOrg.id },
  })) {
    dtiSubjectsByName[subj.name] = subj.id;
  }

  // Create quizzes for DeltaTech
  const dtiQuizzes = await Promise.all([
    prisma.quiz.upsert({
      where: { id: 'dti-quiz-001' },
      update: {},
      create: {
        id: 'dti-quiz-001',
        title: 'Intro to Programming',
        description: 'Basics of programming in Python',
        subjectId: dtiSubjectsByName['Computer Science'],
        timeLimit: 30,
        totalPoints: 50,
        isPublished: true,
        teacherId: dtiTeachers[0].id,
        organizationId: dtiOrg.id,
      },
    }),
    prisma.quiz.upsert({
      where: { id: 'dti-quiz-002' },
      update: {},
      create: {
        id: 'dti-quiz-002',
        title: 'Principles of Accounting',
        description: 'Fundamentals of accounting principles',
        subjectId: dtiSubjectsByName['Accounting'],
        timeLimit: 40,
        totalPoints: 60,
        isPublished: true,
        teacherId: dtiTeachers[1].id,
        organizationId: dtiOrg.id,
      },
    }),
  ]);

  // Create questions for each quiz
  await Promise.all([
    prisma.question.upsert({
      where: { id: 'dti-q-001' },
      update: {},
      create: {
        id: 'dti-q-001',
        text: 'What is a variable in programming?',
        type: 'MULTIPLE_CHOICE',
        options: ['A value', 'A container for data', 'A function', 'A loop'],
        correctAnswer: 'A container for data',
        points: 10,
        order: 1,
        quizId: dtiQuizzes[0].id,
        organizationId: dtiOrg.id,
      },
    }),
    prisma.question.upsert({
      where: { id: 'dti-q-002' },
      update: {},
      create: {
        id: 'dti-q-002',
        text: 'Which language is used for web development?',
        type: 'MULTIPLE_CHOICE',
        options: ['Python', 'HTML', 'C++', 'Java'],
        correctAnswer: 'HTML',
        points: 10,
        order: 2,
        quizId: dtiQuizzes[0].id,
        organizationId: dtiOrg.id,
      },
    }),
    prisma.question.upsert({
      where: { id: 'dti-q-003' },
      update: {},
      create: {
        id: 'dti-q-003',
        text: 'What is the accounting equation?',
        type: 'MULTIPLE_CHOICE',
        options: [
          'Assets = Liabilities + Equity',
          'Assets = Revenue - Expenses',
          'Liabilities = Assets + Equity',
          'Equity = Assets - Liabilities',
        ],
        correctAnswer: 'Assets = Liabilities + Equity',
        points: 15,
        order: 1,
        quizId: dtiQuizzes[1].id,
        organizationId: dtiOrg.id,
      },
    }),
    prisma.question.upsert({
      where: { id: 'dti-q-004' },
      update: {},
      create: {
        id: 'dti-q-004',
        text: 'Which of these is a financial statement?',
        type: 'MULTIPLE_CHOICE',
        options: [
          'Balance Sheet',
          'Income Statement',
          'Cash Flow Statement',
          'All of the above',
        ],
        correctAnswer: 'All of the above',
        points: 15,
        order: 2,
        quizId: dtiQuizzes[1].id,
        organizationId: dtiOrg.id,
      },
    }),
  ]);

  // Create quiz attempts
  const dtiAttempts = await Promise.all([
    prisma.quizAttempt.upsert({
      where: { id: 'dti-attempt-001' },
      update: {},
      create: {
        id: 'dti-attempt-001',
        score: 40,
        totalPoints: 50,
        timeSpent: 1200,
        completedAt: new Date(),
        quizId: dtiQuizzes[0].id,
        studentId: dtiStudents[0].id,
        organizationId: dtiOrg.id,
      },
    }),
    prisma.quizAttempt.upsert({
      where: { id: 'dti-attempt-002' },
      update: {},
      create: {
        id: 'dti-attempt-002',
        score: 55,
        totalPoints: 60,
        timeSpent: 1500,
        completedAt: new Date(),
        quizId: dtiQuizzes[1].id,
        studentId: dtiStudents[1].id,
        organizationId: dtiOrg.id,
      },
    }),
  ]);

  // Create quiz answers
  await Promise.all([
    prisma.quizAnswer.upsert({
      where: { id: 'dti-answer-001' },
      update: {},
      create: {
        id: 'dti-answer-001',
        answer: 'A container for data',
        isCorrect: true,
        pointsEarned: 10,
        attemptId: dtiAttempts[0].id,
        questionId: 'dti-q-001',
        organizationId: dtiOrg.id,
      },
    }),
    prisma.quizAnswer.upsert({
      where: { id: 'dti-answer-002' },
      update: {},
      create: {
        id: 'dti-answer-002',
        answer: 'HTML',
        isCorrect: true,
        pointsEarned: 10,
        attemptId: dtiAttempts[0].id,
        questionId: 'dti-q-002',
        organizationId: dtiOrg.id,
      },
    }),
    prisma.quizAnswer.upsert({
      where: { id: 'dti-answer-003' },
      update: {},
      create: {
        id: 'dti-answer-003',
        answer: 'Assets = Liabilities + Equity',
        isCorrect: true,
        pointsEarned: 15,
        attemptId: dtiAttempts[1].id,
        questionId: 'dti-q-003',
        organizationId: dtiOrg.id,
      },
    }),
    prisma.quizAnswer.upsert({
      where: { id: 'dti-answer-004' },
      update: {},
      create: {
        id: 'dti-answer-004',
        answer: 'All of the above',
        isCorrect: true,
        pointsEarned: 15,
        attemptId: dtiAttempts[1].id,
        questionId: 'dti-q-004',
        organizationId: dtiOrg.id,
      },
    }),
  ]);

  console.log('✅ DeltaTech Institute seeded!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
