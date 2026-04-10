/**
 * Matiks Score Reveal Screen
 * Orchestrates the full post-game animation sequence.
 */
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { AnimatedBackground } from './src/components/AnimatedBackground';
import { ScoreCounter } from './src/components/ScoreCounter';
import { ComboStreakBadge } from './src/components/ComboStreakBadge';
import { RankReveal } from './src/components/RankReveal';
import { ShareButton } from './src/components/ShareButton';
import { ConfettiCanvas } from './src/components/ConfettiCanvas';

// Mock Data
const MOCK_DATA = {
  score: 2840,
  combo: 7,
  rank: 3,
  totalPlayers: 1200,
};

export default function App() {
  const [fireConfetti, setFireConfetti] = useState(false);

  // Trigger confetti when score counting is complete
  const handleScoreComplete = () => {
    setFireConfetti(true);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        
        <AnimatedBackground>
        <View style={styles.content}>
          <View style={styles.mainReveal}>
            <ScoreCounter 
              targetScore={MOCK_DATA.score} 
              onComplete={handleScoreComplete} 
            />
            {/* The combo badge will self-animate its entry delay */}
            <ComboStreakBadge comboCount={MOCK_DATA.combo} />
          </View>

          <View style={styles.footer}>
            {/* The rank will slide up after its delay */}
            <RankReveal 
              rank={MOCK_DATA.rank} 
              totalPlayers={MOCK_DATA.totalPlayers} 
            />
            
            {/* Share button will slide/fade in last */}
            <ShareButton />
          </View>
        </View>

        {/* Confetti overlay (rendered full-screen, pointerEvents='none') */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <ConfettiCanvas fire={fireConfetti} />
        </View>
      </AnimatedBackground>
    </SafeAreaView>
  </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07061A', // Matches theme.Colors.bgDark
  },
  content: {
    flex: 1,
    // Add safe area padding essentially
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
    zIndex: 10,
  },
  mainReveal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
