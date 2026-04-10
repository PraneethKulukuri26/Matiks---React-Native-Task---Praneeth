/**
 * ShareButton Component
 * "Share Result" CTA with:
 * - Looping shimmer/glint effect
 * - Press: scale-down → scale-up with haptic feedback
 *
 * ✅ Shimmer via withRepeat + translateX on a gradient overlay
 * ✅ Press uses withSpring on shared values — no setState
 * ✅ expo-haptics for tactile feedback
 */
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSizes, Spacing, BorderRadius } from '../constants/theme';
import {
  SHIMMER_DURATION,
  sharePressInSpring,
  sharePressOutSpring,
  SHARE_PRESS_SCALE,
  SEQUENCE,
} from '../constants/animations';

const BUTTON_WIDTH = Dimensions.get('window').width * 0.75;
const SHIMMER_WIDTH = 80;

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export const ShareButton: React.FC = () => {
  // Entry animation
  const entryOpacity = useSharedValue(0);
  const entryTranslateY = useSharedValue(30);

  // Shimmer position
  const shimmerX = useSharedValue(-SHIMMER_WIDTH);

  // Press scale
  const pressScale = useSharedValue(1);

  useEffect(() => {
    const delay = SEQUENCE.SHARE_ENTRY;

    // Fade/slide in
    entryOpacity.value = withDelay(
      delay,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) })
    );
    entryTranslateY.value = withDelay(
      delay,
      withSpring(0, { damping: 15, stiffness: 100 })
    );

    // Start shimmer loop after entry
    shimmerX.value = withDelay(
      delay + 600,
      withRepeat(
        withTiming(BUTTON_WIDTH + SHIMMER_WIDTH, {
          duration: SHIMMER_DURATION,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        false
      )
    );
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: entryOpacity.value,
    transform: [
      { translateY: entryTranslateY.value },
      { scale: pressScale.value },
    ],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }],
  }));

  const handlePressIn = () => {
    pressScale.value = withSpring(SHARE_PRESS_SCALE, sharePressInSpring);
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, sharePressOutSpring);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <Animated.View style={[styles.wrapper, containerStyle]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressable}
      >
        <LinearGradient
          colors={[Colors.purple, '#6D28D9', Colors.purple]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {/* Shimmer overlay */}
          <Animated.View style={[styles.shimmerContainer, shimmerStyle]}>
            <LinearGradient
              colors={[
                'transparent',
                'rgba(255,255,255,0.25)',
                'transparent',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.shimmer}
            />
          </Animated.View>

          <Text style={styles.icon}>📤</Text>
          <Text style={styles.text}>Share Result</Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  pressable: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    // Purple glow shadow
    shadowColor: Colors.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: BUTTON_WIDTH,
    paddingVertical: Spacing.md + 2,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  shimmerContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: SHIMMER_WIDTH,
  },
  shimmer: {
    flex: 1,
    width: SHIMMER_WIDTH,
  },
  icon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  text: {
    fontSize: FontSizes.lg,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 1,
  },
});
