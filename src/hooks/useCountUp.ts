/**
 * useCountUp Hook
 * Drives the animated score counter from 0 → target using Reanimated shared values.
 * 
 * ✅ UI-thread safe — no setState in animation callbacks
 * Uses useAnimatedReaction + runOnJS to update display text
 */
import { useCallback, useState } from 'react';
import {
  useSharedValue,
  useAnimatedReaction,
  withTiming,
  withSequence,
  withSpring,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import {
  SCORE_COUNT_DURATION,
  SCORE_OVERSHOOT_FACTOR,
  scoreOvershootSpring,
} from '../constants/animations';

interface UseCountUpOptions {
  /** Target number to count up to */
  target: number;
  /** Duration of the count-up in ms */
  duration?: number;
  /** Callback when counting is complete */
  onComplete?: () => void;
}

interface UseCountUpReturn {
  /** Current displayed value (JS thread, for Text rendering) */
  displayValue: number;
  /** Shared value driving the animation (UI thread) */
  animatedValue: ReturnType<typeof useSharedValue<number>>;
  /** Start the count-up animation */
  start: () => void;
  /** Whether the animation has completed */
  isComplete: boolean;
}

export function useCountUp({
  target,
  duration = SCORE_COUNT_DURATION,
  onComplete,
}: UseCountUpOptions): UseCountUpReturn {
  const animatedValue = useSharedValue(0);
  const [displayValue, setDisplayValue] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Bridge from UI thread → JS thread for text display
  // This is the ONLY place we touch setState, and it's via runOnJS
  const updateDisplay = useCallback((value: number) => {
    setDisplayValue(Math.round(value));
  }, []);

  const markComplete = useCallback(() => {
    setIsComplete(true);
    onComplete?.();
  }, [onComplete]);

  // React to shared value changes on UI thread
  useAnimatedReaction(
    () => animatedValue.value,
    (current, previous) => {
      if (current !== previous) {
        runOnJS(updateDisplay)(current);
      }
    },
    [animatedValue]
  );

  const start = useCallback(() => {
    // Sequence: count up with overshoot, then spring settle to exact target
    const overshootTarget = Math.round(target * SCORE_OVERSHOOT_FACTOR);

    animatedValue.value = withSequence(
      // Phase 1: Fast count-up to slightly past target (overshoot)
      withTiming(overshootTarget, {
        duration,
        easing: Easing.out(Easing.exp),
      }),
      // Phase 2: Spring back to exact target
      withSpring(target, scoreOvershootSpring, (finished) => {
        if (finished) {
          runOnJS(markComplete)();
        }
      })
    );
  }, [target, duration, animatedValue, markComplete]);

  return { displayValue, animatedValue, start, isComplete };
}
