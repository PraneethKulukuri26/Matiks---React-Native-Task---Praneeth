/**
 * ComboStreakBadge Component
 * 🔥 7 Combo Streak! badge with bounce-in entry and looping flame pulse.
 *
 * ✅ Entry: scale 0 → 1.15 → 1.0 with spring bounce
 * ✅ Flame emoji: looping pulse (scale + opacity) via withRepeat
 * ✅ All animations UI-thread safe
 */
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Colors, FontSizes, Spacing, BorderRadius } from '../constants/theme';
import {
  comboBounceInSpring,
  comboSettleSpring,
  FLAME_PULSE_DURATION,
  FLAME_PULSE_SCALE_MAX,
  FLAME_PULSE_SCALE_MIN,
  FLAME_PULSE_OPACITY_MIN,
  FLAME_PULSE_OPACITY_MAX,
  SEQUENCE,
} from '../constants/animations';

interface ComboStreakBadgeProps {
  comboCount: number;
}

export const ComboStreakBadge: React.FC<ComboStreakBadgeProps> = ({
  comboCount,
}) => {
  // Badge entry animation
  const badgeScale = useSharedValue(0);
  const badgeOpacity = useSharedValue(0);

  // Flame pulse animation
  const flameScale = useSharedValue(FLAME_PULSE_SCALE_MIN);
  const flameOpacity = useSharedValue(FLAME_PULSE_OPACITY_MAX);

  useEffect(() => {
    // Badge entry: delayed, then bounce in
    const entryDelay = SEQUENCE.COMBO_ENTRY;

    badgeOpacity.value = withDelay(
      entryDelay,
      withTiming(1, { duration: 200 })
    );

    badgeScale.value = withDelay(
      entryDelay,
      withSequence(
        // Overshoot to 1.15
        withSpring(1.15, comboBounceInSpring),
        // Settle to 1.0
        withSpring(1.0, comboSettleSpring)
      )
    );

    // Start flame pulse after badge settles (entry + ~500ms for spring)
    const pulseDelay = entryDelay + 600;

    flameScale.value = withDelay(
      pulseDelay,
      withRepeat(
        withSequence(
          withTiming(FLAME_PULSE_SCALE_MAX, {
            duration: FLAME_PULSE_DURATION,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(FLAME_PULSE_SCALE_MIN, {
            duration: FLAME_PULSE_DURATION,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1, // infinite
        false
      )
    );

    flameOpacity.value = withDelay(
      pulseDelay,
      withRepeat(
        withSequence(
          withTiming(FLAME_PULSE_OPACITY_MIN, {
            duration: FLAME_PULSE_DURATION,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(FLAME_PULSE_OPACITY_MAX, {
            duration: FLAME_PULSE_DURATION,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        false
      )
    );
  }, []);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
    opacity: badgeOpacity.value,
  }));

  const flameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameScale.value }],
    opacity: flameOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, badgeStyle]}>
      <View style={styles.innerCard}>
        <Animated.Text style={[styles.flame, flameStyle]}>🔥</Animated.Text>
        <View style={styles.textContainer}>
          <Text style={styles.comboCount}>{comboCount}</Text>
          <Text style={styles.comboLabel}>Combo Streak!</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  innerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.streakOrange,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    // Orange glow
    shadowColor: Colors.streakOrange,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  flame: {
    fontSize: 36,
    marginRight: Spacing.sm,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.xs,
  },
  comboCount: {
    fontSize: FontSizes.xxl,
    fontWeight: '900',
    color: Colors.streakOrange,
  },
  comboLabel: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});
