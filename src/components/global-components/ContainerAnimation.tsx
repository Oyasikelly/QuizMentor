import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBook,
  FaRegStickyNote,
  FaBullseye,
  FaQuestionCircle,
  FaBrain,
  FaCog,
  FaMagic,
  FaSyncAlt,
  FaChartBar,
  FaLightbulb,
  FaTrophy,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaAward,
  FaClipboardList,
  FaGraduationCap,
  FaStar,
  FaMedal,
  FaLaptopCode,
  FaPenFancy,
  FaPuzzlePiece,
  FaRocket,
  FaBookOpen,
} from 'react-icons/fa';

const inputIcons = [
  FaBook,
  FaRegStickyNote,
  FaBullseye,
  FaQuestionCircle,
  FaClipboardList,
  FaBookOpen,
  FaPenFancy,
  FaPuzzlePiece,
];
const processingIcons = [
  FaBrain,
  FaCog,
  FaMagic,
  FaSyncAlt,
  FaLaptopCode,
  FaRocket,
  FaChalkboardTeacher,
  FaGraduationCap,
];
const outputIcons = [
  FaChartBar,
  FaBullseye,
  FaLightbulb,
  FaTrophy,
  FaAward,
  FaStar,
  FaMedal,
  FaUserGraduate,
];

// 8 visually distinct icons for orbit
const orbitIcons = [
  FaBookOpen,
  FaBrain,
  FaMagic,
  FaChartBar,
  FaTrophy,
  FaUserGraduate,
  FaPuzzlePiece,
  FaLightbulb,
];

const iconColors = {
  input: 'text-foreground',
  processing: 'text-foreground',
  output: 'text-foreground',
};

const getSpeedDuration = (speed: 'slow' | 'medium' | 'fast') => {
  switch (speed) {
    case 'slow':
      return 3000;
    case 'fast':
      return 1000;
    default:
      return 2000;
  }
};

interface ContainerAnimationProps {
  speed?: 'slow' | 'medium' | 'fast';
  interactive?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  showLabels?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const sizeStyles = {
  small: 'w-96 h-32', // wider for orbit
  medium: 'w-[28rem] h-48',
  large: 'w-[40rem] h-64',
};

const iconSize = {
  small: 32,
  medium: 40,
  large: 48,
};

const inputVariants = {
  initial: { x: -40, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 40, opacity: 0 },
};
const outputVariants = {
  initial: { x: 0, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 40, opacity: 0 },
};

const getProcessingPulse = (loop: boolean) => ({
  animate: {
    scale: [1, 1.08, 1],
    rotate: [0, 8, -8, 0],
    transition: {
      duration: 1.5,
      repeat: loop ? Infinity : 0,
      ease: 'easeInOut',
    },
  },
});

const ORBIT_ICON_COUNT = orbitIcons.length;
const ORBIT_RADIUS = {
  small: 120,
  medium: 170,
  large: 240,
};

const ContainerAnimation: React.FC<ContainerAnimationProps> = ({
  speed = 'medium',
  interactive = true,
  autoPlay = true,
  loop = true,
  showLabels = true,
  size = 'medium',
}) => {
  const [inputCycle, setInputCycle] = useState(0);
  const [outputCycle, setOutputCycle] = useState(0);
  const [processingCycle, setProcessingCycle] = useState(0);
  const [wave, setWave] = useState(0); // for converge/diverge
  const [hoveredOrbit, setHoveredOrbit] = useState<number | null>(null); // index of hovered orbit icon

  // Timings: input changes, then after half the interval output changes
  useEffect(() => {
    if (!autoPlay) return;
    const inputInterval = setInterval(() => {
      setInputCycle((c) => (c + 1) % inputIcons.length);
      setProcessingCycle((c) => (c + 1) % processingIcons.length);
    }, getSpeedDuration(speed));
    const outputInterval = setInterval(() => {
      setOutputCycle((c) => (c + 1) % outputIcons.length);
    }, getSpeedDuration(speed) * 1.5);
    // Wave for converge/diverge
    const waveInterval = setInterval(() => {
      setWave((w) => (w + 2) % 360);
    }, 40); // smooth
    return () => {
      clearInterval(inputInterval);
      clearInterval(outputInterval);
      clearInterval(waveInterval);
    };
  }, [autoPlay, speed, loop]);

  // Icon selection for this cycle
  const InputIcon = inputIcons[inputCycle % inputIcons.length];
  const ProcessingIcon =
    processingIcons[processingCycle % processingIcons.length];
  const OutputIcon = outputIcons[outputCycle % outputIcons.length];

  // Hover/tap effect
  const hoverEffect = interactive
    ? {
        whileHover: { scale: 1.04 },
        whileTap: { scale: 0.97 },
      }
    : {};

  // Calculate orbit positions for the whole container
  const getOrbitPosition = (index: number) => {
    // Converge/diverge: r animates from full to 0 and back
    const baseR = ORBIT_RADIUS[size];
    const waveR =
      baseR * (0.7 + 0.3 * Math.abs(Math.sin((wave * Math.PI) / 180)));
    let angle = ((360 / ORBIT_ICON_COUNT) * index + wave) * (Math.PI / 180);
    // If an icon is hovered, shift the orbit center toward that icon
    if (hoveredOrbit !== null) {
      const hoverAngle =
        ((360 / ORBIT_ICON_COUNT) * hoveredOrbit + wave) * (Math.PI / 180);
      // Shift all icons' angle a bit toward the hovered icon's angle
      const shiftStrength = 0.18; // how much the orbit "leans"
      angle = angle + shiftStrength * Math.sin(hoverAngle - angle);
    }
    return {
      left: `calc(50% + ${Math.cos(angle) * waveR}px - ${
        iconSize[size] / 1.5
      }px)`,
      top: `calc(50% + ${Math.sin(angle) * waveR}px - ${
        iconSize[size] / 1.5
      }px)`,
    };
  };

  return (
    <div
      className={`relative flex items-center justify-center ${sizeStyles[size]}`}
      style={{ minHeight: '8rem' }}
    >
      {/* Orbiting icons around the whole container */}
      {orbitIcons.map((OrbitIcon, i) => (
        <motion.div
          key={i}
          className={`absolute text-foreground drop-shadow-lg ${
            hoveredOrbit === i ? 'z-20' : 'z-0'
          }`}
          style={{ ...getOrbitPosition(i) }}
          animate={
            hoveredOrbit === i
              ? {
                  opacity: 1,
                  scale: 1.25,
                  filter: 'drop-shadow(0 0 12px var(--tw-shadow-color, #888))',
                }
              : { opacity: 0.3, scale: 1, filter: 'none' }
          }
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onMouseEnter={() => setHoveredOrbit(i)}
          onMouseLeave={() => setHoveredOrbit(null)}
        >
          <OrbitIcon size={iconSize[size] * 1.2} />
        </motion.div>
      ))}
      {/* Main animation row */}
      <div className="flex flex-row items-center justify-center gap-8 w-full z-10">
        {/* Input Container */}
        <motion.div
          {...hoverEffect}
          className={`relative flex items-center justify-center overflow-hidden w-1/3 h-full bg-transparent rounded-xl`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={inputCycle}
              className={`flex items-center justify-center ${iconColors.input}`}
              variants={inputVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.6, type: 'spring' }}
            >
              <InputIcon size={iconSize[size]} aria-label="Input" />
            </motion.div>
          </AnimatePresence>
          {showLabels && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <span className="text-xs font-medium text-muted-foreground capitalize tracking-wide">
                Input
              </span>
            </div>
          )}
        </motion.div>
        {/* Processing Container */}
        <motion.div
          {...hoverEffect}
          className={`relative flex items-center justify-center overflow-hidden w-1/3 h-full bg-transparent rounded-xl`}
        >
          {/* BookOpen background icon */}
          <motion.div
            className="absolute flex items-center justify-center opacity-50 text-foreground"
            style={{
              zIndex: 2,
              filter: 'drop-shadow(0 0 12px rgba(0,0,0,0.12))',
            }}
            animate={{ scale: [1, 1.1, 1], rotate: [0, 8, -8, 0] }}
            transition={{
              duration: 2,
              repeat: loop ? Infinity : 0,
              ease: [0.42, 0, 0.58, 1],
              type: 'tween',
            }}
          >
            {/* <BookOpen size={iconSize[size] * 1.4} /> */}
          </motion.div>
          {/* Main processing icon */}
          <motion.div
            key={processingCycle}
            className={`flex items-center justify-center ${iconColors.processing}`}
            style={{ zIndex: 2 }}
            animate={{
              scale: getProcessingPulse(loop).animate.scale,
              rotate: getProcessingPulse(loop).animate.rotate,
            }}
            transition={{
              duration: getProcessingPulse(loop).animate.transition.duration,
              repeat: getProcessingPulse(loop).animate.transition.repeat,
              ease: [0.42, 0, 0.58, 1],
            }}
          >
            <ProcessingIcon size={iconSize[size]} aria-label="Processing" />
          </motion.div>
          {showLabels && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <span className="text-xs font-medium text-muted-foreground capitalize tracking-wide">
                Processing
              </span>
            </div>
          )}
        </motion.div>
        {/* Output Container */}
        <motion.div
          {...hoverEffect}
          className={`relative flex items-center justify-center overflow-hidden w-1/3 h-full bg-transparent rounded-xl`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={outputCycle}
              className={`flex items-center justify-center ${iconColors.output}`}
              variants={outputVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.6, type: 'spring' }}
            >
              <OutputIcon size={iconSize[size]} aria-label="Output" />
            </motion.div>
          </AnimatePresence>
          {showLabels && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <span className="text-xs font-medium text-muted-foreground capitalize tracking-wide">
                Output
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ContainerAnimation;
