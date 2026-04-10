/**
 * Matiks Animation Configs
 * Centralized spring / timing configurations for consistent feel.
 * All values tuned for 60fps smoothness on both Android & iOS.
 */
import { Easing } from 'react-native-reanimated';

// ─── Score Counter ───────────────────────────────────────────────
export const SCORE_COUNT_DURATION = 2000; // ms to tick from 0 → final
export const SCORE_OVERSHOOT_FACTOR = 1.04; // overshoot multiplier

export const scoreTimingConfig = {
  duration: SCORE_COUNT_DURATION,
  easing: Easing.out(Easing.exp),
};

export const scoreOvershootSpring = {
  damping: 14,
  stiffness: 100,
  mass: 1,
};

// ─── Combo Streak Badge ──────────────────────────────────────────
export const COMBO_ENTRY_DELAY = 1200; // ms after score starts (at ~50%)

export const comboBounceInSpring = {
  damping: 8,
  stiffness: 180,
  mass: 0.8,
};

export const comboSettleSpring = {
  damping: 14,
  stiffness: 120,
  mass: 1,
};

export const FLAME_PULSE_DURATION = 800; // ms per pulse half-cycle
export const FLAME_PULSE_SCALE_MAX = 1.18;
export const FLAME_PULSE_SCALE_MIN = 1.0;
export const FLAME_PULSE_OPACITY_MIN = 0.7;
export const FLAME_PULSE_OPACITY_MAX = 1.0;

// ─── Rank Reveal ─────────────────────────────────────────────────
export const RANK_STAGGER_DELAY = 200; // ms after score completes
export const RANK_TRANSLATE_FROM = 80; // px below fold

export const rankSlideSpring = {
  damping: 16,
  stiffness: 90,
  mass: 1,
};

export const rankFadeConfig = {
  duration: 400,
  easing: Easing.out(Easing.quad),
};

// ─── Share Button ────────────────────────────────────────────────
export const SHARE_ENTRY_DELAY = 600; // ms after rank reveals
export const SHIMMER_DURATION = 1800; // ms per shimmer sweep

export const sharePressInSpring = {
  damping: 18,
  stiffness: 200,
  mass: 0.6,
};

export const sharePressOutSpring = {
  damping: 10,
  stiffness: 120,
  mass: 0.8,
};

export const SHARE_PRESS_SCALE = 0.92;

// ─── Confetti (Bonus) ────────────────────────────────────────────
export const CONFETTI_PARTICLE_COUNT = 60;
export const CONFETTI_DURATION = 2500; // ms total animation
export const CONFETTI_GRAVITY = 600; // px/s²
export const CONFETTI_VELOCITY_MIN = 350;
export const CONFETTI_VELOCITY_MAX = 900;

// ─── Sequence Timing ─────────────────────────────────────────────
export const SEQUENCE = {
  BG_FADE_IN: 0,
  SCORE_START: 200,
  COMBO_ENTRY: 1400,      // SCORE_START + ~1200
  SCORE_COMPLETE: 2200,    // SCORE_START + SCORE_COUNT_DURATION
  CONFETTI_FIRE: 2200,     // same as score complete
  RANK_REVEAL: 2400,      // SCORE_COMPLETE + RANK_STAGGER_DELAY
  SHARE_ENTRY: 3000,      // RANK_REVEAL + SHARE_ENTRY_DELAY
} as const;
