/**
 * RankReveal Component
 * Player rank slides up from below with a fade.
 * Staggered 200ms after the score counter completes.
 *
 * ✅ withSpring for slide, withTiming for opacity
 * ✅ UI-thread safe
 */
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { Colors, FontSizes, Spacing, BorderRadius } from '../constants/theme';
import {
  RANK_TRANSLATE_FROM,
  rankSlideSpring,
  rankFadeConfig,
  SEQUENCE,
} from '../constants/animations';

interface RankRevealProps {
  rank: number;
  totalPlayers: number;
}

export const RankReveal: React.FC<RankRevealProps> = ({
  rank,
  totalPlayers,
}) => {
  const translateY = useSharedValue(RANK_TRANSLATE_FROM);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const delay = SEQUENCE.RANK_REVEAL;

    translateY.value = withDelay(
      delay,
      withSpring(0, rankSlideSpring)
    );

    opacity.value = withDelay(
      delay,
      withTiming(1, rankFadeConfig)
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.card}>
        <View style={styles.rankBadge}>
          <Text style={styles.hashSymbol}>#</Text>
          <Text style={styles.rankNumber}>{rank}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailColumn}>
          <Text style={styles.ofText}>
            of {totalPlayers.toLocaleString()} players
          </Text>
          <Text style={styles.subtitle}>Global Ranking</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    // Purple glow
    shadowColor: Colors.purple,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 6,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  hashSymbol: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: Colors.purple,
    marginRight: 2,
  },
  rankNumber: {
    fontSize: FontSizes.xxxl,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.surfaceBorder,
    marginHorizontal: Spacing.lg,
  },
  detailColumn: {
    alignItems: 'flex-start',
  },
  ofText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  subtitle: {
    fontSize: FontSizes.xs,
    fontWeight: '500',
    color: Colors.textMuted,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});
