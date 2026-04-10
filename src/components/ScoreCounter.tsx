/**
 * ScoreCounter Component
 * Animated number that ticks from 0 → final score with overshoot bounce.
 *
 * ✅ All animation on UI thread via useSharedValue
 * ✅ No setState in animation callbacks — uses useCountUp hook
 */
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useCountUp } from '../hooks/useCountUp';
import { Colors, FontSizes, Spacing } from '../constants/theme';
import { SEQUENCE } from '../constants/animations';

interface ScoreCounterProps {
  targetScore: number;
  onComplete?: () => void;
}

export const ScoreCounter: React.FC<ScoreCounterProps> = ({
  targetScore,
  onComplete,
}) => {
  const { displayValue, start, isComplete } = useCountUp({
    target: targetScore,
    onComplete,
  });

  // Entry opacity & scale
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    // Fade in first
    opacity.value = withDelay(
      SEQUENCE.BG_FADE_IN,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) })
    );
    scale.value = withDelay(
      SEQUENCE.BG_FADE_IN,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.back(1.5)) })
    );

    // Start counting after delay
    const timer = setTimeout(() => {
      start();
    }, SEQUENCE.SCORE_START);

    return () => clearTimeout(timer);
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  // Format number with commas
  const formattedScore = displayValue.toLocaleString();

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.Text style={styles.label}>YOUR SCORE</Animated.Text>
      <View style={styles.scoreRow}>
        <Animated.Text style={styles.score}>{formattedScore}</Animated.Text>
      </View>
      {isComplete && (
        <View style={styles.glowLine} />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 4,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  score: {
    fontSize: FontSizes.score,
    fontWeight: '900',
    color: Colors.gold,
    letterSpacing: 2,
    // Text shadow for golden glow
    textShadowColor: Colors.goldGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 30,
  },
  glowLine: {
    width: 120,
    height: 2,
    backgroundColor: Colors.gold,
    marginTop: Spacing.md,
    borderRadius: 1,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
});
