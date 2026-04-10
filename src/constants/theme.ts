/**
 * Matiks Design System — Theme Tokens
 * Dark, premium aesthetic with golden accents for the score reveal screen.
 */

export const Colors = {
  // Background gradient stops
  bgDark: '#07061A',
  bgMid: '#12103B',
  bgLight: '#1A1450',

  // Primary accent — gold
  gold: '#FFD700',
  goldDark: '#C5A200',
  goldLight: '#FFED80',
  goldGlow: 'rgba(255, 215, 0, 0.35)',

  // Secondary accent — purple
  purple: '#8B5CF6',
  purpleGlow: 'rgba(139, 92, 246, 0.3)',

  // Accent cyan
  cyan: '#06B6D4',
  cyanGlow: 'rgba(6, 182, 212, 0.25)',

  // Surfaces
  surface: 'rgba(255, 255, 255, 0.06)',
  surfaceBorder: 'rgba(255, 255, 255, 0.10)',
  surfaceHighlight: 'rgba(255, 255, 255, 0.12)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0C0',
  textMuted: '#6B6B8D',

  // Status
  streakOrange: '#FF6B35',
  streakRed: '#EF4444',

  // Misc
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  score: 72,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;
