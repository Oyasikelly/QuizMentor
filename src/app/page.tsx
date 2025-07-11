'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from '@/components/toggle-switch';
import {
  BookOpen,
  GraduationCap,
  Brain,
  BarChart3,
  Users,
  Zap,
  Shield,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Award,
} from 'lucide-react';
import ContainerAnimation from '@/components/global-components/ContainerAnimation';

// Advanced 3D Robot Component
const AdvancedRobot3D: React.FC<{ size?: 'small' | 'medium' | 'large' }> = ({
  size = 'medium',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Dynamically import Three.js
    const initThreeJS = async () => {
      try {
        const THREE = await import('three');

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        scene.fog = new THREE.Fog(0x000000, 1, 15);

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
          75,
          (containerRef.current?.clientWidth || 800) /
            (containerRef.current?.clientHeight || 600),
          0.1,
          1000
        );
        camera.position.set(0, 2, 5);

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
        });
        renderer.setSize(
          containerRef.current?.clientWidth || 800,
          containerRef.current?.clientHeight || 600
        );
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Only access window on client side
        if (typeof window !== 'undefined') {
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }

        if (containerRef.current) {
          containerRef.current.appendChild(renderer.domElement);
        }

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0x4a90e2, 0.8, 10);
        pointLight.position.set(0, 3, 2);
        scene.add(pointLight);

        // Robot Group
        const robotGroup = new THREE.Group();

        // Head
        const headGeometry = new THREE.SphereGeometry(0.8, 32, 32);
        const headMaterial = new THREE.MeshPhongMaterial({
          color: 0x2c3e50,
          shininess: 100,
          specular: 0x444444,
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2.5;
        head.castShadow = true;
        robotGroup.add(head);

        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const eyeMaterial = new THREE.MeshPhongMaterial({
          color: 0x00ff00,
          emissive: 0x00ff00,
          emissiveIntensity: 0.3,
        });

        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.3, 2.6, 0.7);
        robotGroup.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.3, 2.6, 0.7);
        robotGroup.add(rightEye);

        // Antenna
        const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8);
        const antennaMaterial = new THREE.MeshPhongMaterial({
          color: 0x34495e,
        });
        const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
        antenna.position.set(0, 3.2, 0);
        robotGroup.add(antenna);

        const antennaTipGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const antennaTipMaterial = new THREE.MeshPhongMaterial({
          color: 0xffd700,
          emissive: 0xffd700,
          emissiveIntensity: 0.5,
        });
        const antennaTip = new THREE.Mesh(
          antennaTipGeometry,
          antennaTipMaterial
        );
        antennaTip.position.set(0, 3.6, 0);
        robotGroup.add(antennaTip);

        // Body
        const bodyGeometry = new THREE.CylinderGeometry(0.6, 0.8, 1.8, 8);
        const bodyMaterial = new THREE.MeshPhongMaterial({
          color: 0xecf0f1,
          shininess: 50,
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.2;
        body.castShadow = true;
        robotGroup.add(body);

        // Chest Panel
        const chestGeometry = new THREE.BoxGeometry(0.8, 0.6, 0.1);
        const chestMaterial = new THREE.MeshPhongMaterial({
          color: 0x2c3e50,
          shininess: 200,
        });
        const chestPanel = new THREE.Mesh(chestGeometry, chestMaterial);
        chestPanel.position.set(0, 1.2, 0.4);
        robotGroup.add(chestPanel);

        // Chest Screen
        const screenGeometry = new THREE.PlaneGeometry(0.6, 0.4);
        const screenMaterial = new THREE.MeshPhongMaterial({
          color: 0x1a1a1a,
          emissive: 0x4a90e2,
          emissiveIntensity: 0.2,
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(0, 1.2, 0.46);
        robotGroup.add(screen);

        // Arms
        const armGeometry = new THREE.CylinderGeometry(0.12, 0.12, 1.2, 8);
        const armMaterial = new THREE.MeshPhongMaterial({
          color: 0x3498db,
          shininess: 100,
        });

        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-1.2, 1.5, 0);
        leftArm.rotation.z = Math.PI / 6;
        leftArm.castShadow = true;
        robotGroup.add(leftArm);

        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(1.2, 1.5, 0);
        rightArm.rotation.z = -Math.PI / 6;
        rightArm.castShadow = true;
        robotGroup.add(rightArm);

        // Hands
        const handGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const handMaterial = new THREE.MeshPhongMaterial({
          color: 0x2980b9,
          shininess: 100,
        });

        const leftHand = new THREE.Mesh(handGeometry, handMaterial);
        leftHand.position.set(-1.8, 1.2, 0);
        robotGroup.add(leftHand);

        const rightHand = new THREE.Mesh(handGeometry, handMaterial);
        rightHand.position.set(1.8, 1.2, 0);
        robotGroup.add(rightHand);

        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1.2, 8);
        const legMaterial = new THREE.MeshPhongMaterial({
          color: 0x34495e,
          shininess: 100,
        });

        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.4, 0.2, 0);
        leftLeg.castShadow = true;
        robotGroup.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.4, 0.2, 0);
        rightLeg.castShadow = true;
        robotGroup.add(rightLeg);

        // Feet
        const footGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.4);
        const footMaterial = new THREE.MeshPhongMaterial({
          color: 0x2c3e50,
          shininess: 100,
        });

        const leftFoot = new THREE.Mesh(footGeometry, footMaterial);
        leftFoot.position.set(-0.4, -0.4, 0.1);
        leftFoot.castShadow = true;
        robotGroup.add(leftFoot);

        const rightFoot = new THREE.Mesh(footGeometry, footMaterial);
        rightFoot.position.set(0.4, -0.4, 0.1);
        rightFoot.castShadow = true;
        robotGroup.add(rightFoot);

        // Base Platform
        const baseGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 8);
        const baseMaterial = new THREE.MeshPhongMaterial({
          color: 0x7f8c8d,
          shininess: 50,
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -0.6;
        base.receiveShadow = true;
        robotGroup.add(base);

        scene.add(robotGroup);

        // Animation variables
        let time = 0;
        const originalPositions = {
          leftArm: leftArm.position.clone(),
          rightArm: rightArm.position.clone(),
          head: head.position.clone(),
          antenna: antenna.position.clone(),
          antennaTip: antennaTip.position.clone(),
        };

        // Animation loop
        const animate = () => {
          requestAnimationFrame(animate);
          time += 0.02;

          // Gentle floating animation
          robotGroup.position.y = Math.sin(time) * 0.1;

          // Breathing animation
          const breathScale = 1 + Math.sin(time * 2) * 0.02;
          body.scale.setScalar(breathScale);

          // Eye blinking
          if (Math.sin(time * 3) > 0.8) {
            leftEye.scale.y = 0.1;
            rightEye.scale.y = 0.1;
          } else {
            leftEye.scale.y = 1;
            rightEye.scale.y = 1;
          }

          // Antenna movement
          antenna.rotation.x = Math.sin(time * 1.5) * 0.1;
          antennaTip.rotation.y = time * 2;

          // Arm movement on hover
          if (isHovered) {
            leftArm.rotation.z = Math.PI / 6 + Math.sin(time * 4) * 0.2;
            rightArm.rotation.z = -Math.PI / 6 - Math.sin(time * 4) * 0.2;
          } else {
            leftArm.rotation.z = Math.PI / 6 + Math.sin(time) * 0.1;
            rightArm.rotation.z = -Math.PI / 6 - Math.sin(time) * 0.1;
          }

          // Head movement
          head.rotation.y = Math.sin(time * 0.5) * 0.1;

          renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        const handleResize = () => {
          if (!containerRef.current) return;

          camera.aspect =
            containerRef.current.clientWidth /
            containerRef.current.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(
            containerRef.current.clientWidth,
            containerRef.current.clientHeight
          );
        };

        // Only add window event listeners on client side
        if (typeof window !== 'undefined') {
          window.addEventListener('resize', handleResize);
        }

        // Mouse interaction
        const handleMouseMove = (event: MouseEvent) => {
          if (!containerRef.current) return;

          const rect = containerRef.current.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

          // Head follows mouse
          head.rotation.y = x * 0.3;
          head.rotation.x = y * 0.2;

          // Eyes follow mouse
          leftEye.position.x = -0.3 + x * 0.1;
          leftEye.position.y = 2.6 + y * 0.1;
          rightEye.position.x = 0.3 + x * 0.1;
          rightEye.position.y = 2.6 + y * 0.1;
        };

        if (containerRef.current) {
          containerRef.current.addEventListener('mousemove', handleMouseMove);
        }

        setIsLoaded(true);

        // Cleanup
        return () => {
          if (typeof window !== 'undefined') {
            window.removeEventListener('resize', handleResize);
          }
          if (containerRef.current) {
            containerRef.current.removeEventListener(
              'mousemove',
              handleMouseMove
            );
          }
          renderer.dispose();
        };
      } catch (error) {
        console.error('Failed to load Three.js:', error);
        setIsLoaded(true); // Show fallback
      }
    };

    initThreeJS();
  }, [isHovered]);

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center">
            <Brain className="w-16 h-16 text-white" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={containerRef}
        className={`w-full h-full ${
          size === 'large'
            ? 'w-80 h-80'
            : size === 'medium'
            ? 'w-64 h-64'
            : 'w-48 h-48'
        }`}
      />
    </div>
  );
};

// WebGL Support Detection
const WebGLSupport: React.FC = () => {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

      if (!gl) {
        setHasWebGL(false);
        setError('WebGL not supported');
      }
    } catch (e) {
      setHasWebGL(false);
      setError('WebGL initialization failed');
    }
  }, []);

  // Don't render anything during SSR
  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center">
            <Brain className="w-16 h-16 text-white" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-16 h-16 text-white" />
          </div>
          <p className="text-sm text-muted-foreground">AI Assistant Ready</p>
        </div>
      </div>
    );
  }

  return <AdvancedRobot3D size="large" />;
};

// Scroll Animation Hook
const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  return { elementRef, isVisible };
};

// Staggered Animation Hook
const useStaggeredAnimation = (items: number, delay: number = 100) => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger the animations
          for (let i = 0; i < items; i++) {
            setTimeout(() => {
              setVisibleItems((prev) => [...prev, i]);
            }, i * delay);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [items, delay]);

  return { elementRef, visibleItems };
};

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Learning',
      description:
        'Intelligent algorithms adapt to your learning style and pace',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: GraduationCap,
      title: 'Personalized Quizzes',
      description:
        'Get custom assessments based on your strengths and weaknesses',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description:
        'Track your progress with detailed insights and recommendations',
      color: 'from-purple-500 to-violet-600',
    },
    {
      icon: Users,
      title: 'Collaborative Learning',
      description: 'Study with peers and share knowledge in real-time',
      color: 'from-orange-500 to-red-600',
    },
    {
      icon: Zap,
      title: 'Instant Feedback',
      description:
        'Get immediate responses and explanations for every question',
      color: 'from-yellow-500 to-orange-600',
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Your data is protected with enterprise-grade security',
      color: 'from-gray-500 to-gray-700',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Computer Science Student',
      content:
        'QuizMentor helped me understand complex algorithms through interactive quizzes. The AI feedback is incredibly helpful!',
      rating: 5,
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Mathematics Professor',
      content:
        "As an educator, I love how QuizMentor adapts to each student's learning needs. It's revolutionized my teaching approach.",
      rating: 5,
    },
    {
      name: 'Alex Rodriguez',
      role: 'Medical Student',
      content:
        'The personalized study paths and instant feedback have made my exam preparation so much more effective.',
      rating: 5,
    },
  ];

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 px-2 sm:px-6 lg:px-8 sticky top-0 z-50">
          <div className="flex h-16 items-center justify-between w-full max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="bg-primary rounded-lg p-2">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold">QuizMentor</h1>
            </div>

            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="#features"
                  className="text-sm hover:text-primary transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="#testimonials"
                  className="text-sm hover:text-primary transition-colors"
                >
                  Testimonials
                </Link>
                <Link
                  href="#pricing"
                  className="text-sm hover:text-primary transition-colors"
                >
                  Pricing
                </Link>
              </nav>
              <ModeToggle />
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Content */}
              <div
                className={`space-y-8 transition-all duration-1000 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
              >
                <div className="space-y-4">
                  <Badge variant="secondary" className="w-fit">
                    <Zap className="w-3 h-3 mr-1" />
                    AI-Powered Learning Platform
                  </Badge>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                    Transform Your Learning with{' '}
                    <span className="text-primary">QuizMentor</span>
                  </h1>
                  <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
                    Experience the future of education with intelligent quizzes,
                    personalized feedback, and adaptive learning paths powered
                    by cutting-edge AI technology.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register">
                    <Button size="lg" className="w-full sm:w-auto">
                      Get Started Free
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Watch Demo
                  </Button>
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Free for students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>No credit card required</span>
                  </div>
                </div>
              </div>

              {/* Right: 3D Robot */}
              <div className="relative h-96 lg:h-[500px] flex items-center justify-center">
                <ContainerAnimation
                  speed="medium"
                  interactive={true}
                  autoPlay={true}
                  loop={true}
                  showLabels={true}
                  size="medium"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30"
        >
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Why Choose QuizMentor?
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Our AI-powered platform combines cutting-edge technology with
                proven educational methods to create the most effective learning
                experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const { elementRef, isVisible } = useScrollAnimation();
                return (
                  <div
                    key={index}
                    ref={elementRef}
                    className={`transition-all duration-700 ease-out ${
                      isVisible
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-10 scale-95'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <Card className="group hover:shadow-lg transition-all duration-300 h-full">
                      <CardContent className="p-6">
                        <div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Loved by Students & Teachers
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Join thousands of learners who have transformed their
                educational journey with QuizMentor.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => {
                const { elementRef, isVisible } = useScrollAnimation();
                return (
                  <div
                    key={index}
                    ref={elementRef}
                    className={`transition-all duration-700 ease-out ${
                      isVisible
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-10 scale-95'
                    }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <Card className="group hover:shadow-lg transition-all duration-300 h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground mb-4 italic">
                          "{testimonial.content}"
                        </p>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="useScrollAnimation">
              {(() => {
                const { elementRef, isVisible } = useScrollAnimation();
                return (
                  <div
                    ref={elementRef}
                    className={`transition-all duration-1000 ease-out ${
                      isVisible
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-10 scale-95'
                    }`}
                  >
                    <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
                      Ready to Transform Your Learning?
                    </h2>
                    <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                      Join thousands of students and teachers who are already
                      experiencing the future of education.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link href="/login">
                        <Button size="lg" variant="secondary">
                          Start Learning Free
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button
                          size="lg"
                          variant="outline"
                          className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                        >
                          Create Account
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-primary rounded-lg p-2">
                    <BookOpen className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold">QuizMentor</h3>
                </div>
                <p className="text-muted-foreground">
                  Empowering students and teachers with AI-powered learning
                  solutions.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      API
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Status
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2024 QuizMentor. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
