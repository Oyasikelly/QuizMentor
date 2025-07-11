# Cursor AI Implementation Prompt: 3D Robot Animation for Homepage

## Overview
Create a captivating 3D robot animation for the QuizMentor homepage ("/") that serves as an interactive mascot representing AI-powered learning. The robot should embody intelligence, friendliness, and educational technology while creating a memorable first impression for students and teachers.

## Technical Requirements

### Framework & Libraries
- **Next.js 14** with App Router (`app/page.tsx`)
- **TypeScript** for type safety
- **Three.js (r128)** for 3D rendering (available via CDN)
- **React Three Fiber** equivalent functionality (implement manually)
- **Tailwind CSS** for styling
- **Framer Motion** for additional UI animations
- **React hooks** for state management

### 3D Library Setup
```typescript
// Import Three.js from CDN
import * as THREE from 'three';

// IMPORTANT: Do NOT use THREE.CapsuleGeometry (introduced in r142)
// Use alternatives: CylinderGeometry, SphereGeometry, or custom geometries
```

## Robot Design Specifications

### Robot Appearance
**Overall Design:**
- **Style:** Friendly, modern, educational robot
- **Color Scheme:** QuizMentor brand colors (blues, whites, accent colors)
- **Size:** Medium-sized, approx. 3-4 units in Three.js scale
- **Personality:** Intelligent, approachable, slightly playful

**Robot Components:**
```typescript
interface RobotParts {
  head: {
    shape: 'rounded_cube' | 'sphere';
    features: 'led_eyes' | 'screen_face' | 'expressive_eyes';
    accessories: 'antenna' | 'graduation_cap' | 'thinking_cap';
  };
  body: {
    shape: 'cylinder' | 'rounded_rectangle';
    panels: 'chest_screen' | 'control_panels' | 'book_compartment';
    details: 'vents' | 'wires' | 'educational_symbols';
  };
  arms: {
    joints: 'ball_joints' | 'hinge_joints';
    hands: 'three_finger' | 'claw' | 'pointer';
    mobility: 'full_rotation' | 'limited_rotation';
  };
  legs: {
    style: 'bipedal' | 'tank_treads' | 'hover_base';
    stability: 'grounded' | 'floating';
  };
}
```

### Recommended Robot Design
```typescript
const robotConfig = {
  head: {
    geometry: new THREE.SphereGeometry(0.8, 32, 32),
    material: new THREE.MeshPhongMaterial({ color: 0x4A90E2 }), // Blue
    eyes: [
      { position: [-0.3, 0.2, 0.7], color: 0x00FF00 }, // Green LED eyes
      { position: [0.3, 0.2, 0.7], color: 0x00FF00 }
    ],
    antenna: { height: 0.5, tip: 'blinking_light' }
  },
  body: {
    geometry: new THREE.CylinderGeometry(0.6, 0.8, 1.5, 8),
    material: new THREE.MeshPhongMaterial({ color: 0xF0F0F0 }), // Light gray
    chestScreen: { 
      size: [0.6, 0.4], 
      content: 'quiz_icons' | 'progress_bars' | 'floating_text'
    }
  },
  arms: [
    {
      shoulder: { geometry: new THREE.SphereGeometry(0.2), position: [-0.9, 0.5, 0] },
      upperArm: { geometry: new THREE.CylinderGeometry(0.15, 0.15, 0.8), rotation: 'animated' },
      lowerArm: { geometry: new THREE.CylinderGeometry(0.12, 0.12, 0.6), rotation: 'animated' },
      hand: { geometry: new THREE.SphereGeometry(0.18), color: 0x4A90E2 }
    }
    // Mirror for right arm
  ],
  base: {
    geometry: new THREE.CylinderGeometry(0.5, 0.7, 0.3, 8),
    material: new THREE.MeshPhongMaterial({ color: 0x333333 }), // Dark gray
    hover: { amplitude: 0.1, frequency: 0.5 }
  }
};
```

## Animation Specifications

### Core Animations
```typescript
interface RobotAnimations {
  idle: {
    hover: { y: 0.1, duration: 2000, easing: 'easeInOutSine' };
    breathing: { scale: 0.02, duration: 3000, easing: 'easeInOutQuad' };
    eyeBlink: { interval: 3000, duration: 200 };
    headTilt: { angle: 5, duration: 4000, random: true };
  };
  
  interactive: {
    wave: { 
      arm: 'right', 
      duration: 1500, 
      repetitions: 2,
      trigger: 'hover' | 'click' | 'scroll_into_view'
    };
    nod: { 
      axis: 'x', 
      angle: 15, 
      duration: 800, 
      repetitions: 3 
    };
    point: { 
      target: 'cta_button' | 'features' | 'testimonials',
      duration: 1000,
      return: true
    };
  };
  
  contextual: {
    thinking: {
      headScratch: { duration: 2000, hand: 'right' };
      antennaGlow: { intensity: 0.5, color: 0xFFFF00 };
      thoughtBubbles: { count: 3, animation: 'float_up' };
    };
    excited: {
      jump: { height: 0.3, duration: 600 };
      armRaise: { both: true, angle: 45, duration: 500 };
      eyeGlow: { intensity: 1.5, duration: 1000 };
    };
    explaining: {
      gestureLeft: { duration: 1000, amplitude: 0.3 };
      gestureRight: { duration: 1000, amplitude: 0.3 };
      chestScreenActive: { glow: true, content: 'scrolling_text' };
    };
  };
}
```

### Animation Triggers
```typescript
interface AnimationTriggers {
  onLoad: 'entrance_animation'; // Robot materializes/assembles
  onHover: 'wave' | 'nod' | 'eye_follow_cursor';
  onClick: 'excited' | 'point_to_cta' | 'thinking';
  onScroll: {
    '0-25%': 'idle';
    '25-50%': 'explaining';
    '50-75%': 'pointing';
    '75-100%': 'waving_goodbye';
  };
  onResize: 'scale_adaptive';
  onInactivity: 'sleep_mode'; // Dim lights, slower breathing
}
```

## Scene Setup & Lighting

### Scene Configuration
```typescript
const sceneConfig = {
  scene: new THREE.Scene(),
  camera: {
    type: 'PerspectiveCamera',
    fov: 75,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.1,
    far: 1000,
    position: [0, 0, 5]
  },
  renderer: {
    antialias: true,
    alpha: true, // Transparent background
    shadowMap: {
      enabled: true,
      type: THREE.PCFSoftShadowMap
    }
  }
};
```

### Lighting Setup
```typescript
const lightingConfig = {
  ambientLight: {
    color: 0xffffff,
    intensity: 0.4
  },
  directionalLight: {
    color: 0xffffff,
    intensity: 0.8,
    position: [10, 10, 5],
    castShadow: true,
    shadow: {
      mapSize: { width: 2048, height: 2048 },
      camera: { near: 0.5, far: 50 }
    }
  },
  pointLight: {
    color: 0x4A90E2,
    intensity: 0.5,
    position: [0, 2, 2],
    distance: 10
  },
  spotLight: {
    color: 0xffffff,
    intensity: 0.3,
    position: [0, 5, 0],
    angle: Math.PI / 4,
    penumbra: 0.1
  }
};
```

## Interactive Features

### Mouse Interaction
```typescript
interface MouseInteractions {
  hover: {
    detection: 'raycasting';
    response: 'wave' | 'nod' | 'eye_follow';
    cooldown: 2000; // Prevent spam
  };
  click: {
    detection: 'raycasting';
    response: 'excited_animation';
    particles: 'confetti' | 'sparkles';
    sound: 'beep' | 'chime' | 'success';
  };
  drag: {
    enabled: false; // Keep robot in place
    rotation: 'y_axis_only'; // Allow rotation viewing
  };
}
```

### Scroll-Based Animations
```typescript
interface ScrollAnimations {
  parallax: {
    robot: { speed: 0.5, direction: 'up' };
    background: { speed: 0.2, direction: 'down' };
  };
  sections: {
    hero: { animation: 'entrance', duration: 1000 };
    features: { animation: 'pointing', target: 'feature_cards' };
    testimonials: { animation: 'listening', posture: 'attentive' };
    cta: { animation: 'encouraging', gesture: 'thumbs_up' };
  };
}
```

## Component Architecture

### Main Robot Component
```typescript
interface RobotComponentProps {
  size?: 'small' | 'medium' | 'large';
  position?: [number, number, number];
  interactive?: boolean;
  animations?: AnimationTriggers;
  context?: 'hero' | 'features' | 'testimonials' | 'footer';
  performance?: 'high' | 'medium' | 'low';
}

const Robot3D: React.FC<RobotComponentProps> = ({
  size = 'medium',
  position = [0, 0, 0],
  interactive = true,
  animations = defaultAnimations,
  context = 'hero',
  performance = 'high'
}) => {
  // Implementation here
};
```

### Animation Controller
```typescript
interface AnimationController {
  currentAnimation: string;
  animationQueue: string[];
  isPlaying: boolean;
  
  play(animation: string, options?: AnimationOptions): void;
  queue(animation: string, options?: AnimationOptions): void;
  stop(): void;
  reset(): void;
  setContext(context: string): void;
}
```

### Performance Optimization
```typescript
interface PerformanceOptions {
  levelOfDetail: {
    high: { polygons: 5000, shadows: true, reflections: true };
    medium: { polygons: 2000, shadows: true, reflections: false };
    low: { polygons: 800, shadows: false, reflections: false };
  };
  
  frameRate: {
    target: 60;
    adaptive: true;
    throttle: 'requestAnimationFrame' | 'setTimeout';
  };
  
  culling: {
    frustum: true;
    occlusion: false;
    distance: 20;
  };
}
```

## Layout Integration

### Homepage Placement
```typescript
const HomepageLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Content */}
          <div className="space-y-8">
            <h1 className="text-5xl font-bold text-gray-800">
              AI-Powered Learning with <span className="text-blue-600">QuizMentor</span>
            </h1>
            <p className="text-xl text-gray-600">
              Transform your study experience with intelligent quizzes, 
              personalized feedback, and adaptive learning paths.
            </p>
            <div className="flex gap-4">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition-colors">
                Get Started
              </button>
              <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg hover:bg-blue-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
          
          {/* Right: 3D Robot */}
          <div className="relative h-96 lg:h-full">
            <Robot3D 
              size="large"
              interactive={true}
              context="hero"
              animations={{
                onLoad: 'entrance_animation',
                onHover: 'wave',
                onClick: 'excited',
                onScroll: 'contextual'
              }}
            />
          </div>
        </div>
      </section>
      
      {/* Additional sections... */}
    </div>
  );
};
```

### Responsive Design
```typescript
interface ResponsiveConfig {
  breakpoints: {
    mobile: { maxWidth: 768, robotSize: 'small', quality: 'low' };
    tablet: { maxWidth: 1024, robotSize: 'medium', quality: 'medium' };
    desktop: { minWidth: 1024, robotSize: 'large', quality: 'high' };
  };
  
  adaptiveFeatures: {
    animations: 'reduce_motion_on_mobile';
    interactions: 'touch_optimized';
    performance: 'auto_quality_adjustment';
  };
}
```

## Performance Considerations

### Optimization Strategies
```typescript
const optimizations = {
  geometry: {
    // Reuse geometries across robot instances
    cache: new Map<string, THREE.BufferGeometry>();
    dispose: 'cleanup_on_unmount';
  },
  
  materials: {
    // Share materials between similar parts
    cache: new Map<string, THREE.Material>();
    texture: 'compress_and_cache';
  },
  
  animations: {
    // Use object pooling for particles
    pool: 'reuse_particle_systems';
    RAF: 'single_animation_loop';
  },
  
  rendering: {
    // Frustum culling
    cull: 'outside_viewport';
    LOD: 'distance_based_quality';
  }
};
```

### Loading Strategy
```typescript
interface LoadingStrategy {
  lazy: {
    component: 'load_on_intersection';
    textures: 'progressive_loading';
    models: 'background_loading';
  };
  
  fallback: {
    loading: 'skeleton_placeholder';
    error: 'static_robot_image';
    noWebGL: '2d_animation_fallback';
  };
  
  preload: {
    critical: ['robot_geometry', 'basic_materials'];
    defer: ['particle_systems', 'advanced_animations'];
  };
}
```

## Error Handling & Fallbacks

### WebGL Support Detection
```typescript
const WebGLSupport = () => {
  const [hasWebGL, setHasWebGL] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (gl) {
        setHasWebGL(true);
      } else {
        setError('WebGL not supported');
      }
    } catch (e) {
      setError('WebGL initialization failed');
    }
  }, []);
  
  if (error) {
    return <Robot2DFallback />; // 2D CSS animation fallback
  }
  
  return hasWebGL ? <Robot3D /> : <RobotImageFallback />;
};
```

### Fallback Components
```typescript
const Robot2DFallback = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="robot-2d-animation">
      {/* CSS-based 2D robot animation */}
      <div className="robot-head animate-bounce">🤖</div>
      <div className="robot-body animate-pulse">
        <div className="screen">📚</div>
      </div>
    </div>
  </div>
);

const RobotImageFallback = () => (
  <div className="w-full h-full flex items-center justify-center">
    <img 
      src="/images/robot-static.png" 
      alt="QuizMentor AI Robot" 
      className="max-w-full max-h-full object-contain"
    />
  </div>
);
```

## Implementation Steps

### Phase 1: Basic 3D Robot (1-2 hours)
1. Set up Three.js scene with camera and lights
2. Create basic robot geometry (head, body, arms, legs)
3. Apply materials and basic coloring
4. Add simple hover animation
5. Implement WebGL fallback

### Phase 2: Advanced Animations (2-3 hours)
1. Create animation controller system
2. Implement idle animations (hover, breathing, blinking)
3. Add interactive animations (wave, nod, point)
4. Create contextual animations for different sections
5. Add particle effects for interactions

### Phase 3: Integration & Polish (1-2 hours)
1. Integrate robot into homepage layout
2. Add responsive design handling
3. Implement performance optimizations
4. Add accessibility features
5. Test across devices and browsers

### Phase 4: Advanced Features (Optional)
1. Add sound effects for interactions
2. Implement advanced particle systems
3. Create seasonal/contextual variations
4. Add analytics tracking for interactions
5. Implement A/B testing for different robot styles

## Success Metrics

### User Engagement
- **Interaction Rate:** % of users who interact with robot
- **Time on Page:** Increased engagement with animated hero
- **Scroll Depth:** Users scrolling further due to animation
- **Click-through Rate:** Improved CTA conversion with robot pointing

### Performance Metrics
- **Load Time:** < 3 seconds for full robot animation
- **Frame Rate:** Maintain 60fps on desktop, 30fps on mobile
- **Memory Usage:** < 50MB for robot scene
- **Error Rate:** < 1% WebGL initialization failures

### Technical Metrics
- **Browser Support:** 95% compatibility across modern browsers
- **Mobile Performance:** Smooth operation on mid-range devices
- **Accessibility:** Full keyboard navigation and screen reader support
- **SEO Impact:** No negative impact on page load scores

## Final Implementation Notes

1. **Start Simple:** Begin with basic geometry and expand
2. **Test Early:** Verify WebGL support and performance frequently
3. **Optimize Always:** Monitor performance metrics throughout
4. **Accessibility First:** Ensure robot doesn't hinder navigation
5. **Fallback Ready:** Always provide non-WebGL alternatives
6. **Brand Consistent:** Keep robot design aligned with QuizMentor branding
7. **User Testing:** Validate that robot enhances rather than distracts
8. **Documentation:** Comment complex animation logic thoroughly

The robot should feel like a natural extension of the QuizMentor brand - intelligent, helpful, and engaging while maintaining professional credibility for educational users.