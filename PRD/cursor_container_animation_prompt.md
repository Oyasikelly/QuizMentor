# Cursor AI Implementation Prompt: Container Animation for QuizMentor Homepage

## Overview
Create an engaging container-based animation for the QuizMentor homepage ("/") that represents the flow of knowledge, AI processing, and educational content. The animation should feature multiple containers with educational elements moving in and out, symbolizing the dynamic nature of AI-powered learning.

## Animation Concept

### Core Visual Metaphor
**"Knowledge Processing Factory"** - Containers represent different stages of AI-powered learning:
- **Input Container:** Questions, topics, and learning materials flowing in
- **Processing Container:** AI analysis, question generation, and content processing
- **Output Container:** Generated quizzes, explanations, and personalized recommendations flowing out

### Container Types
```typescript
interface ContainerTypes {
  inputContainer: {
    purpose: 'receiving_content';
    items: ['📚 Books', '📝 Notes', '🎯 Topics', '❓ Questions'];
    animation: 'items_flowing_in';
    color: '#3B82F6'; // Blue
  };
  
  processingContainer: {
    purpose: 'ai_analysis';
    items: ['🤖 AI Brain', '⚙️ Gears', '✨ Sparkles', '🔄 Processing'];
    animation: 'rotating_mixing';
    color: '#8B5CF6'; // Purple
  };
  
  outputContainer: {
    purpose: 'delivering_results';
    items: ['📊 Results', '🎯 Quizzes', '💡 Explanations', '🏆 Achievements'];
    animation: 'items_flowing_out';
    color: '#10B981'; // Green
  };
}
```

## Technical Requirements

### Framework & Libraries
- **Next.js 14** with App Router (`app/page.tsx`)
- **TypeScript** for type safety
- **Framer Motion** for smooth animations
- **Tailwind CSS** for styling
- **React hooks** for state management
- **CSS transforms** for 3D effects

### Animation Library Setup
```typescript
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};
```

## Container Animation Specifications

### Container Structure
```typescript
interface AnimationContainer {
  id: string;
  type: 'input' | 'processing' | 'output';
  position: { x: number; y: number };
  size: { width: number; height: number };
  items: AnimationItem[];
  style: ContainerStyle;
  animations: ContainerAnimations;
}

interface AnimationItem {
  id: string;
  content: string | React.ReactNode;
  type: 'text' | 'icon' | 'image' | 'component';
  animation: 'slide' | 'fade' | 'bounce' | 'rotate' | 'scale';
  duration: number;
  delay: number;
  lifecycle: 'enter' | 'processing' | 'exit';
}

interface ContainerStyle {
  backgroundColor: string;
  borderColor: string;
  borderRadius: string;
  shadow: string;
  gradient: string;
  glassmorphism: boolean;
}
```

### Animation Flow Design
```typescript
const animationFlow = {
  // Stage 1: Input Flow (Left Side)
  inputStage: {
    containers: [
      {
        id: 'input-main',
        position: { x: 0, y: 0 },
        items: [
          { content: '📚', animation: 'slideInLeft', duration: 800, delay: 0 },
          { content: '📝', animation: 'slideInLeft', duration: 800, delay: 200 },
          { content: '🎯', animation: 'slideInLeft', duration: 800, delay: 400 },
          { content: '❓', animation: 'slideInLeft', duration: 800, delay: 600 }
        ],
        style: {
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderColor: '#3B82F6',
          gradient: 'from-blue-400 to-blue-600',
          glassmorphism: true
        }
      }
    ],
    animation: {
      itemFlow: 'continuous_stream',
      direction: 'left_to_center',
      speed: 'medium',
      pattern: 'wave'
    }
  },

  // Stage 2: Processing (Center)
  processingStage: {
    containers: [
      {
        id: 'processing-main',
        position: { x: 50, y: 0 }, // Center
        items: [
          { content: '🤖', animation: 'rotate', duration: 2000, delay: 0 },
          { content: '⚙️', animation: 'spin', duration: 1500, delay: 300 },
          { content: '✨', animation: 'twinkle', duration: 1000, delay: 600 },
          { content: '🔄', animation: 'pulse', duration: 800, delay: 900 }
        ],
        style: {
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          borderColor: '#8B5CF6',
          gradient: 'from-purple-400 to-purple-600',
          glassmorphism: true
        }
      }
    ],
    animation: {
      containerEffect: 'breathing',
      itemMixing: 'orbital_motion',
      processing: 'particle_effects',
      duration: 3000
    }
  },

  // Stage 3: Output Flow (Right Side)
  outputStage: {
    containers: [
      {
        id: 'output-main',
        position: { x: 100, y: 0 }, // Right side
        items: [
          { content: '📊', animation: 'slideOutRight', duration: 800, delay: 0 },
          { content: '🎯', animation: 'slideOutRight', duration: 800, delay: 200 },
          { content: '💡', animation: 'slideOutRight', duration: 800, delay: 400 },
          { content: '🏆', animation: 'slideOutRight', duration: 800, delay: 600 }
        ],
        style: {
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderColor: '#10B981',
          gradient: 'from-green-400 to-green-600',
          glassmorphism: true
        }
      }
    ],
    animation: {
      itemFlow: 'continuous_stream',
      direction: 'center_to_right',
      speed: 'medium',
      pattern: 'cascade'
    }
  }
};
```

## Animation Patterns

### Item Flow Animations
```typescript
const itemFlowAnimations = {
  // Items entering the input container
  slideInLeft: {
    initial: { x: -100, opacity: 0, scale: 0.8 },
    animate: { x: 0, opacity: 1, scale: 1 },
    exit: { x: 50, opacity: 0, scale: 0.8 },
    transition: { 
      type: 'spring', 
      stiffness: 100, 
      damping: 15,
      duration: 0.8
    }
  },

  // Items being processed in center
  rotate: {
    animate: { 
      rotate: [0, 360],
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7]
    },
    transition: { 
      duration: 2, 
      repeat: Infinity, 
      ease: 'linear' 
    }
  },

  spin: {
    animate: { 
      rotate: [0, -360],
      x: [0, 20, -20, 0],
      y: [0, -10, 10, 0]
    },
    transition: { 
      duration: 1.5, 
      repeat: Infinity, 
      ease: 'easeInOut' 
    }
  },

  twinkle: {
    animate: { 
      opacity: [0, 1, 0],
      scale: [0.5, 1.2, 0.5]
    },
    transition: { 
      duration: 1, 
      repeat: Infinity, 
      ease: 'easeInOut' 
    }
  },

  pulse: {
    animate: { 
      scale: [1, 1.3, 1],
      opacity: [0.8, 1, 0.8]
    },
    transition: { 
      duration: 0.8, 
      repeat: Infinity, 
      ease: 'easeInOut' 
    }
  },

  // Items exiting to output container
  slideOutRight: {
    initial: { x: -50, opacity: 0, scale: 0.8 },
    animate: { x: 0, opacity: 1, scale: 1 },
    exit: { x: 100, opacity: 0, scale: 0.8 },
    transition: { 
      type: 'spring', 
      stiffness: 120, 
      damping: 12,
      duration: 0.8
    }
  }
};
```

### Container Animations
```typescript
const containerAnimations = {
  // Input container breathing effect
  inputBreathing: {
    animate: {
      scale: [1, 1.02, 1],
      borderWidth: ['2px', '3px', '2px']
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  },

  // Processing container active state
  processingActive: {
    animate: {
      scale: [1, 1.05, 1],
      borderColor: ['#8B5CF6', '#A855F7', '#8B5CF6'],
      boxShadow: [
        '0 0 20px rgba(139, 92, 246, 0.3)',
        '0 0 30px rgba(139, 92, 246, 0.5)',
        '0 0 20px rgba(139, 92, 246, 0.3)'
      ]
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  },

  // Output container celebration
  outputCelebration: {
    animate: {
      scale: [1, 1.03, 1],
      rotate: [0, 1, -1, 0],
      borderColor: ['#10B981', '#059669', '#10B981']
    },
    transition: {
      duration: 1.8,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};
```

## Component Implementation

### Main Animation Component
```typescript
interface ContainerAnimationProps {
  speed?: 'slow' | 'medium' | 'fast';
  interactive?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  showLabels?: boolean;
  size?: 'small' | 'medium' | 'large';
  theme?: 'light' | 'dark' | 'auto';
}

const ContainerAnimation: React.FC<ContainerAnimationProps> = ({
  speed = 'medium',
  interactive = true,
  autoPlay = true,
  loop = true,
  showLabels = true,
  size = 'medium',
  theme = 'auto'
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [items, setItems] = useState<AnimationItem[]>([]);
  
  // Animation cycle management
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        generateNewItems();
        setCurrentCycle(prev => prev + 1);
      }, getSpeedDuration(speed));
      
      return () => clearInterval(interval);
    }
  }, [isPlaying, speed]);

  const generateNewItems = () => {
    // Logic to generate new items for animation
    const newItems = createRandomItems();
    setItems(newItems);
  };

  return (
    <div className="container-animation-wrapper">
      {/* Implementation */}
    </div>
  );
};
```

### Individual Container Component
```typescript
interface ContainerProps {
  type: 'input' | 'processing' | 'output';
  items: AnimationItem[];
  isActive: boolean;
  size: 'small' | 'medium' | 'large';
  onItemComplete?: (item: AnimationItem) => void;
}

const AnimatedContainer: React.FC<ContainerProps> = ({
  type,
  items,
  isActive,
  size,
  onItemComplete
}) => {
  const controls = useAnimation();
  
  const containerStyles = {
    input: 'border-blue-500 bg-blue-50 shadow-blue-200',
    processing: 'border-purple-500 bg-purple-50 shadow-purple-200',
    output: 'border-green-500 bg-green-50 shadow-green-200'
  };

  const sizeStyles = {
    small: 'w-32 h-32',
    medium: 'w-48 h-48',
    large: 'w-64 h-64'
  };

  return (
    <motion.div
      className={`
        relative rounded-2xl border-2 backdrop-blur-sm
        ${containerStyles[type]}
        ${sizeStyles[size]}
        flex items-center justify-center
        overflow-hidden
      `}
      variants={containerVariants}
      initial="hidden"
      animate={isActive ? "visible" : "hidden"}
      style={{
        background: `linear-gradient(135deg, 
          ${type === 'input' ? 'rgba(59, 130, 246, 0.1)' : 
            type === 'processing' ? 'rgba(139, 92, 246, 0.1)' : 
            'rgba(16, 185, 129, 0.1)'} 0%, 
          rgba(255, 255, 255, 0.05) 100%)`
      }}
    >
      <AnimatePresence mode="wait">
        {items.map((item, index) => (
          <motion.div
            key={`${item.id}-${index}`}
            className="absolute text-2xl md:text-3xl lg:text-4xl"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ delay: index * 0.1 }}
            style={{
              left: `${20 + (index % 3) * 30}%`,
              top: `${20 + Math.floor(index / 3) * 30}%`
            }}
          >
            {item.content}
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Container label */}
      {showLabels && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <span className="text-sm font-medium text-gray-600 capitalize">
            {type}
          </span>
        </div>
      )}
    </motion.div>
  );
};
```

## Item Generation System

### Dynamic Item Creation
```typescript
const itemDatabase = {
  input: [
    { content: '📚', label: 'Study Materials' },
    { content: '📝', label: 'Notes' },
    { content: '🎯', label: 'Learning Goals' },
    { content: '❓', label: 'Questions' },
    { content: '📖', label: 'Textbooks' },
    { content: '🧠', label: 'Knowledge' },
    { content: '💭', label: 'Ideas' },
    { content: '🔍', label: 'Research' }
  ],
  
  processing: [
    { content: '🤖', label: 'AI Processing' },
    { content: '⚙️', label: 'Analysis' },
    { content: '✨', label: 'Generation' },
    { content: '🔄', label: 'Optimization' },
    { content: '🧮', label: 'Calculations' },
    { content: '🔬', label: 'Evaluation' },
    { content: '⚡', label: 'Processing' },
    { content: '🎲', label: 'Randomization' }
  ],
  
  output: [
    { content: '📊', label: 'Results' },
    { content: '🎯', label: 'Quizzes' },
    { content: '💡', label: 'Explanations' },
    { content: '🏆', label: 'Achievements' },
    { content: '📈', label: 'Progress' },
    { content: '🎉', label: 'Success' },
    { content: '🔥', label: 'Streaks' },
    { content: '⭐', label: 'Ratings' }
  ]
};

const generateRandomItems = (type: 'input' | 'processing' | 'output', count: number = 4) => {
  const available = itemDatabase[type];
  const selected = [];
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * available.length);
    selected.push({
      id: `${type}-${Date.now()}-${i}`,
      ...available[randomIndex],
      animation: getRandomAnimation(type),
      duration: 800 + Math.random() * 400, // 800-1200ms
      delay: i * 150 // Stagger effect
    });
  }
  
  return selected;
};
```

## Layout Integration

### Homepage Integration
```typescript
const HomePage = () => {
  const [animationState, setAnimationState] = useState('idle');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Content */}
            <div className="space-y-8">
              <motion.h1 
                className="text-5xl lg:text-6xl font-bold text-gray-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                AI-Powered Learning with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  QuizMentor
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Watch as your study materials transform into personalized quizzes, 
                intelligent explanations, and adaptive learning experiences.
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  Start Learning
                </button>
                <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all duration-300">
                  See How It Works
                </button>
              </motion.div>
            </div>
            
            {/* Right: Container Animation */}
            <div className="relative">
              <motion.div
                className="flex justify-center items-center space-x-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                <ContainerAnimation
                  speed="medium"
                  interactive={true}
                  autoPlay={true}
                  loop={true}
                  showLabels={true}
                  size="medium"
                />
              </motion.div>
              
              {/* Background decoration */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Animation explanation section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            How QuizMentor Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Input Your Content</h3>
              <p className="text-gray-600">Upload your study materials, notes, or topics</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-purple-600 mb-2">AI Processing</h3>
              <p className="text-gray-600">Our AI analyzes and generates personalized content</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-green-600 mb-2">Get Results</h3>
              <p className="text-gray-600">Receive custom quizzes and detailed explanations</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
```

## Interactive Features

### User Controls
```typescript
const AnimationControls = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState('medium');
  
  return (
    <div className="absolute top-4 right-4 flex gap-2">
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
      >
        {isPlaying ? '⏸️' : '▶️'}
      </button>
      
      <select
        value={speed}
        onChange={(e) => setSpeed(e.target.value)}
        className="p-2 bg-white rounded-lg shadow-md"
      >
        <option value="slow">Slow</option>
        <option value="medium">Medium</option>
        <option value="fast">Fast</option>
      </select>
    </div>
  );
};
```

### Hover Effects
```typescript
const containerHoverEffects = {
  hover: {
    scale: 1.05,
    rotateY: 5,
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    transition: { duration: 0.3 }
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};
```

## Performance Optimization

### Animation Performance
```typescript
const optimizationSettings = {
  // Use transform instead of changing layout properties
  willChange: 'transform, opacity',
  
  // Reduce motion for users who prefer it
  respectReducedMotion: true,
  
  // Cleanup animations on unmount
  cleanup: true,
  
  // Throttle updates for better performance
  throttle: 16, // 60fps
  
  // Use GPU acceleration
  transform3d: true
};
```

### Memory Management
```typescript
useEffect(() => {
  return () => {
    // Cleanup timers and animations
    clearAllIntervals();
    cancelAnimationFrame(animationId);
  };
}, []);
```

## Responsive Design

### Breakpoint Adaptations
```typescript
const responsiveConfig = {
  mobile: {
    containerSize: 'small',
    itemCount: 2,
    speed: 'slow',
    reducedMotion: true
  },
  
  tablet: {
    containerSize: 'medium',
    itemCount: 3,
    speed: 'medium',
    fullAnimation: true
  },
  
  desktop: {
    containerSize: 'large',
    itemCount: 4,
    speed: 'medium',
    fullAnimation: true,
    interactiveFeatures: true
  }
};
```

## Success Metrics

### Engagement Metrics
- **Animation Completion Rate:** % of users who watch full cycle
- **Interaction Rate:** % of users who interact with containers
- **Time on Section:** Average time spent viewing animation
- **Scroll Behavior:** Impact on page scroll depth

### Performance Metrics
- **Animation FPS:** Maintain 60fps on desktop, 30fps on mobile
- **Load Impact:** < 500ms additional load time
- **Memory Usage:** < 25MB for animation
- **CPU Usage:** < 10% on average devices

## Implementation Steps

### Phase 1: Basic Structure (2-3 hours)
1. Create container components with basic styling
2. Implement item generation system
3. Add basic slide-in/slide-out animations
4. Test responsive behavior

### Phase 2: Advanced Animations (2-3 hours)
1. Add processing container with rotating/mixing effects
2. Implement continuous item flow
3. Add hover interactions and controls
4. Create smooth transitions between states

### Phase 3: Polish & Optimization (1-2 hours)
1. Add performance optimizations
2. Implement reduced motion preferences
3. Add error handling and fallbacks
4. Test across devices and browsers

This container animation will create a visually engaging representation of QuizMentor's AI-powered learning process, making the abstract concept of AI processing tangible and understandable for users.