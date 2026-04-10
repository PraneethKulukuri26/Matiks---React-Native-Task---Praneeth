/**
 * AnimatedBackground Component
 * Deep dark gradient background with subtle animated particles/stars.
 * Creates an immersive, space-like atmosphere for the score reveal.
 *
 * ✅ Uses Reanimated for floating particle animation
 * ✅ LinearGradient for the base gradient
 */
import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Generate floating ambient particles
const PARTICLE_COUNT = 20;

interface StarParticle {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
}

function generateStars(): StarParticle[] {
  const stars: StarParticle[] = [];
  const particleColors = [
    'rgba(255, 215, 0, 0.3)',   // gold
    'rgba(139, 92, 246, 0.25)', // purple
    'rgba(6, 182, 212, 0.2)',   // cyan
    'rgba(255, 255, 255, 0.15)', // white
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    stars.push({
      x: Math.random() * SCREEN_WIDTH,
      y: Math.random() * SCREEN_HEIGHT,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 3000,
      duration: 2000 + Math.random() * 3000,
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
    });
  }
  return stars;
}

const FloatingParticle: React.FC<{ particle: StarParticle }> = ({ particle }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    // Pulsing opacity
    opacity.value = withDelay(
      particle.delay,
      withRepeat(
        withTiming(1, {
          duration: particle.duration,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true
      )
    );

    // Gentle float
    translateY.value = withDelay(
      particle.delay,
      withRepeat(
        withTiming(-15, {
          duration: particle.duration * 1.5,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: particle.x,
          top: particle.y,
          width: particle.size,
          height: particle.size,
          borderRadius: particle.size / 2,
          backgroundColor: particle.color,
        },
        style,
      ]}
    />
  );
};

interface AnimatedBackgroundProps {
  children: React.ReactNode;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  children,
}) => {
  const stars = useMemo(() => generateStars(), []);

  // Background fade-in
  const bgOpacity = useSharedValue(0);

  useEffect(() => {
    bgOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.quad),
    });
  }, []);

  const bgStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, bgStyle]}>
      <LinearGradient
        colors={[Colors.bgDark, Colors.bgMid, Colors.bgLight, Colors.bgDark]}
        locations={[0, 0.3, 0.6, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Radial glow in center */}
      <View style={styles.radialGlow} />

      {/* Floating particles */}
      {stars.map((star, i) => (
        <FloatingParticle key={i} particle={star} />
      ))}

      {/* Content */}
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  radialGlow: {
    position: 'absolute',
    width: SCREEN_WIDTH * 1.2,
    height: SCREEN_WIDTH * 1.2,
    borderRadius: SCREEN_WIDTH * 0.6,
    backgroundColor: 'rgba(139, 92, 246, 0.06)',
    top: SCREEN_HEIGHT * 0.15,
    left: -(SCREEN_WIDTH * 0.1),
  },
});
