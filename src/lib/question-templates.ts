import { Question, QuestionType } from '@/types/quiz-creation';

export interface QuestionTemplate {
  type: QuestionType;
  template: Partial<Question>;
  description: string;
  example: Question;
}

export const QUESTION_TEMPLATES: Record<QuestionType, QuestionTemplate> = {
  'multiple-choice': {
    type: 'multiple-choice',
    description: 'Choose the best answer from multiple options',
    template: {
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 5,
      difficulty: 'Medium',
      tags: [],
      category: '',
      order: 0,
    },
    example: {
      id: 'example-mc',
      type: 'multiple-choice',
      question: 'What is the capital of France?',
      options: ['London', 'Paris', 'Berlin', 'Madrid'],
      correctAnswer: 'Paris',
      explanation: 'Paris is the capital and largest city of France.',
      points: 5,
      difficulty: 'Easy',
      tags: ['Geography', 'Europe'],
      category: 'Geography',
      order: 0,
    },
  },
  'true-false': {
    type: 'true-false',
    description: 'True or false statement',
    template: {
      type: 'true-false',
      correctAnswer: 'true',
      points: 3,
      difficulty: 'Easy',
      tags: [],
      category: '',
      order: 0,
    },
    example: {
      id: 'example-tf',
      type: 'true-false',
      question: 'The Earth is round.',
      correctAnswer: 'true',
      explanation: 'The Earth is approximately spherical in shape.',
      points: 3,
      difficulty: 'Easy',
      tags: ['Science', 'Earth'],
      category: 'Science',
      order: 0,
    },
  },
  'short-answer': {
    type: 'short-answer',
    description: 'Brief written response',
    template: {
      type: 'short-answer',
      correctAnswer: '',
      points: 5,
      difficulty: 'Medium',
      tags: [],
      category: '',
      order: 0,
    },
    example: {
      id: 'example-sa',
      type: 'short-answer',
      question: 'What is the chemical symbol for gold?',
      correctAnswer: 'Au',
      explanation: 'Au comes from the Latin word for gold, "aurum".',
      points: 5,
      difficulty: 'Medium',
      tags: ['Chemistry', 'Elements'],
      category: 'Chemistry',
      order: 0,
    },
  },
  essay: {
    type: 'essay',
    description: 'Detailed written response',
    template: {
      type: 'essay',
      points: 10,
      difficulty: 'Hard',
      tags: [],
      category: '',
      order: 0,
    },
    example: {
      id: 'example-essay',
      type: 'essay',
      question:
        'Explain the process of photosynthesis and its importance to life on Earth.',
      correctAnswer: '',
      explanation:
        'Look for understanding of light energy conversion, carbon dioxide absorption, oxygen production, and ecological significance.',
      points: 10,
      difficulty: 'Hard',
      tags: ['Biology', 'Photosynthesis'],
      category: 'Biology',
      order: 0,
    },
  },
  'fill-blank': {
    type: 'fill-blank',
    description: 'Fill in the missing word or phrase',
    template: {
      type: 'fill-blank',
      correctAnswer: '',
      points: 3,
      difficulty: 'Easy',
      tags: [],
      category: '',
      order: 0,
    },
    example: {
      id: 'example-fb',
      type: 'fill-blank',
      question: 'The capital of Japan is _____.',
      correctAnswer: 'Tokyo',
      explanation: 'Tokyo is the capital and largest city of Japan.',
      points: 3,
      difficulty: 'Easy',
      tags: ['Geography', 'Asia'],
      category: 'Geography',
      order: 0,
    },
  },
};

/**
 * Create a new question from template
 */
export const createQuestionFromTemplate = (
  type: QuestionType,
  order: number,
  category: string = ''
): Question => {
  const template = QUESTION_TEMPLATES[type];
  const id = `question-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  return {
    id,
    type,
    question: '',
    ...template.template,
    order,
    category,
    tags: [],
  };
};

/**
 * Get question template by type
 */
export const getQuestionTemplate = (type: QuestionType): QuestionTemplate => {
  return QUESTION_TEMPLATES[type];
};

/**
 * Get all question types
 */
export const getQuestionTypes = (): QuestionType[] => {
  return Object.keys(QUESTION_TEMPLATES) as QuestionType[];
};

/**
 * Get question type display name
 */
export const getQuestionTypeDisplayName = (type: QuestionType): string => {
  const names: Record<QuestionType, string> = {
    'multiple-choice': 'Multiple Choice',
    'true-false': 'True/False',
    'short-answer': 'Short Answer',
    essay: 'Essay',
    'fill-blank': 'Fill in the Blank',
  };
  return names[type];
};

/**
 * Get question type icon
 */
export const getQuestionTypeIcon = (type: QuestionType): string => {
  const icons: Record<QuestionType, string> = {
    'multiple-choice': '📋',
    'true-false': '✅',
    'short-answer': '✏️',
    essay: '📝',
    'fill-blank': '🔤',
  };
  return icons[type];
};

/**
 * Validate question based on type
 */
export const validateQuestionByType = (question: Question): string[] => {
  const errors: string[] = [];

  if (!question.question.trim()) {
    errors.push('Question text is required');
  }

  switch (question.type) {
    case 'multiple-choice':
      if (!question.options || question.options.length < 2) {
        errors.push('Multiple choice questions need at least 2 options');
      }
      if (!question.correctAnswer) {
        errors.push('Correct answer is required');
      }
      break;

    case 'true-false':
      if (
        !question.correctAnswer ||
        !['true', 'false'].includes(question.correctAnswer)
      ) {
        errors.push(
          'True/False questions must have "true" or "false" as correct answer'
        );
      }
      break;

    case 'short-answer':
    case 'fill-blank':
      if (!question.correctAnswer) {
        errors.push('Correct answer is required');
      }
      break;

    case 'essay':
      // Essay questions don't require a correct answer
      break;
  }

  if (question.points <= 0) {
    errors.push('Points must be greater than 0');
  }

  return errors;
};

/**
 * Get default points for question type
 */
export const getDefaultPoints = (type: QuestionType): number => {
  const points: Record<QuestionType, number> = {
    'multiple-choice': 5,
    'true-false': 3,
    'short-answer': 5,
    essay: 10,
    'fill-blank': 3,
  };
  return points[type];
};

/**
 * Get difficulty levels
 */
export const getDifficultyLevels = (): Array<{
  value: string;
  label: string;
  color: string;
}> => {
  return [
    { value: 'Easy', label: 'Easy', color: 'text-green-600' },
    { value: 'Medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'Hard', label: 'Hard', color: 'text-red-600' },
  ];
};

/**
 * Get difficulty color
 */
export const getDifficultyColor = (difficulty: string): string => {
  const colors: Record<string, string> = {
    Easy: 'text-green-600 bg-green-100',
    Medium: 'text-yellow-600 bg-yellow-100',
    Hard: 'text-red-600 bg-red-100',
  };
  return colors[difficulty] || 'text-gray-600 bg-gray-100';
};
