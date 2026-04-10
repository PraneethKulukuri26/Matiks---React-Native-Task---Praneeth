/**
 * ConfettiCanvas Component (BONUS)
 * Particle burst using @shopify/react-native-skia.
 *
 * Each particle has:
 * - Randomized trajectory (angle + velocity)
 * - Randomized rotation
 * - Fade-out over duration
 *
 * Uses Skia's <Canvas> with useSharedValue driving frame updates.
 * Falls back gracefully if Skia is not available.
 */
import React, { useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import {
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import {
  CONFETTI_PARTICLE_COUNT,
  CONFETTI_DURATION,
  CONFETTI_GRAVITY,
  CONFETTI_VELOCITY_MIN,
  CONFETTI_VELOCITY_MAX,
} from '../constants/animations';

// Lazy-load Skia to handle cases where it may not be installed
let Canvas: any;
let RoundedRect: any;
let useCanvasRef: any;
let SkiaAvailable = false;

try {
  const Skia = require('@shopify/react-native-skia');
  Canvas = Skia.Canvas;
  RoundedRect = Skia.RoundedRect;
  useCanvasRef = Skia.useCanvasRef;
  SkiaAvailable = true;
} catch {
  SkiaAvailable = false;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Confetti colors — vibrant palette
const CONFETTI_COLORS = [
  '#FFD700', // Gold
  '#FF6B35', // Orange
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#10B981', // Green
  '#EC4899', // Pink
  '#F59E0B', // Amber
];

interface Particle {
  x: number;       // start X
  y: number;       // start Y
  vx: number;      // velocity X
  vy: number;      // velocity Y
  rotation: number; // angular velocity (rad/s)
  width: number;
  height: number;
  color: string;
  delay: number;   // stagger delay in ms
}

function generateParticles(): Particle[] {
  const particles: Particle[] = [];
  const centerX = SCREEN_WIDTH / 2;
  const centerY = SCREEN_HEIGHT * 0.3; // burst from score area

  for (let i = 0; i < CONFETTI_PARTICLE_COUNT; i++) {
    const angle = (Math.random() * Math.PI * 2); // full 360°
    const velocity =
      CONFETTI_VELOCITY_MIN +
      Math.random() * (CONFETTI_VELOCITY_MAX - CONFETTI_VELOCITY_MIN);

    particles.push({
      x: centerX + (Math.random() - 0.5) * 40,
      y: centerY + (Math.random() - 0.5) * 20,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity * -0.8, // bias upward
      rotation: (Math.random() - 0.5) * 12, // rad/s
      width: 6 + Math.random() * 8,
      height: 4 + Math.random() * 6,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: Math.random() * 150, // slight stagger
    });
  }

  return particles;
}

interface ConfettiCanvasProps {
  fire: boolean;
}

// Skia-based implementation
const SkiaConfetti: React.FC<ConfettiCanvasProps> = ({ fire }) => {
  const progress = useSharedValue(0);
  const [frameData, setFrameData] = React.useState<
    { x: number; y: number; w: number; h: number; r: number; color: string; opacity: number }[]
  >([]);

  const particles = useMemo(() => generateParticles(), []);
  const durationSec = CONFETTI_DURATION / 1000;

  useEffect(() => {
    if (fire) {
      progress.value = 0;
      progress.value = withTiming(1, {
        duration: CONFETTI_DURATION,
        easing: Easing.linear,
      });
    }
  }, [fire]);

  const updateFrame = React.useCallback(
    (t: number) => {
      if (t <= 0) return;
      const elapsed = t * durationSec;

      const frames = particles.map((p) => {
        const particleTime = Math.max(0, elapsed - p.delay / 1000);
        const x = p.x + p.vx * particleTime;
        const y =
          p.y + p.vy * particleTime + 0.5 * CONFETTI_GRAVITY * particleTime * particleTime;
        const r = p.rotation * particleTime;
        const opacity = Math.max(0, 1 - t * 1.2); // fade out

        return {
          x,
          y,
          w: p.width,
          h: p.height,
          r,
          color: p.color,
          opacity: Math.max(0, opacity),
        };
      });

      setFrameData(frames);
    },
    [particles, durationSec]
  );

  useAnimatedReaction(
    () => progress.value,
    (val) => {
      runOnJS(updateFrame)(val);
    },
    [progress]
  );

  if (!fire || !SkiaAvailable || !Canvas) return null;

  return (
    <Canvas style={styles.canvas}>
      {frameData.map((f, i) => (
        <RoundedRect
          key={i}
          x={f.x}
          y={f.y}
          width={f.w}
          height={f.h}
          r={2}
          color={f.color}
          opacity={f.opacity}
          transform={[{ rotate: f.r }]}
          origin={{ x: f.x + f.w / 2, y: f.y + f.h / 2 }}
        />
      ))}
    </Canvas>
  );
};

// Reanimated-only fallback (no Skia dependency)
const ReanimatedConfetti: React.FC<ConfettiCanvasProps> = ({ fire }) => {
  const particles = useMemo(() => generateParticles(), []);
  const progress = useSharedValue(0);
  const [frameData, setFrameData] = React.useState<
    { x: number; y: number; w: number; h: number; r: number; color: string; opacity: number }[]
  >([]);
  const durationSec = CONFETTI_DURATION / 1000;

  useEffect(() => {
    if (fire) {
      progress.value = 0;
      progress.value = withTiming(1, {
        duration: CONFETTI_DURATION,
        easing: Easing.linear,
      });
    }
  }, [fire]);

  const updateFrame = React.useCallback(
    (t: number) => {
      if (t <= 0) return;
      const elapsed = t * durationSec;

      const frames = particles.map((p) => {
        const particleTime = Math.max(0, elapsed - p.delay / 1000);
        const x = p.x + p.vx * particleTime;
        const y =
          p.y + p.vy * particleTime + 0.5 * CONFETTI_GRAVITY * particleTime * particleTime;
        const r = p.rotation * particleTime * (180 / Math.PI);
        const opacity = Math.max(0, 1 - t * 1.2);

        return { x, y, w: p.width, h: p.height, r, color: p.color, opacity };
      });

      setFrameData(frames);
    },
    [particles, durationSec]
  );

  useAnimatedReaction(
    () => progress.value,
    (val) => {
      runOnJS(updateFrame)(val);
    },
    [progress]
  );

  if (!fire) return null;

  return (
    <React.Fragment>
      {frameData
        .filter((f) => f.opacity > 0.01)
        .map((f, i) => (
          <React.Fragment key={i}>
            {/* Use regular View for each confetti piece */}
            <ConfettiPiece data={f} />
          </React.Fragment>
        ))}
    </React.Fragment>
  );
};

// Individual confetti piece as a plain View (fallback)
const ConfettiPiece: React.FC<{
  data: { x: number; y: number; w: number; h: number; r: number; color: string; opacity: number };
}> = React.memo(({ data }) => (
  <React.Fragment>
    {/* Using a simple View positioned absolutely */}
    <ConfettiPieceView {...data} />
  </React.Fragment>
));

const ConfettiPieceView: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
  color: string;
  opacity: number;
}> = ({ x, y, w, h, r, color, opacity }) => {
  const { View } = require('react-native');
  return (
    <View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        backgroundColor: color,
        opacity,
        borderRadius: 2,
        transform: [{ rotate: `${r}deg` }],
      }}
    />
  );
};

// Export the appropriate implementation
export const ConfettiCanvas: React.FC<ConfettiCanvasProps> = (props) => {
  if (SkiaAvailable) {
    return <SkiaConfetti {...props} />;
  }
  return <ReanimatedConfetti {...props} />;
};

const styles = StyleSheet.create({
  canvas: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    pointerEvents: 'none',
  },
});
