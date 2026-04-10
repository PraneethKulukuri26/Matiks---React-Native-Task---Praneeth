# Matiks — Animated Score Reveal & Combo Streak UI

**An immersive, highly animated post-game score reveal screen built for a multiplayer math duel application.**

This project is the implemented solution for the **UI Developer Intern Assignment**. It targets 60fps animations exclusively dispatched on the UI-thread without bridging blocking logic on the JavaScript thread, following modern React Native paradigms.

## 📸 App Previews
*(Please place your screenshots in the `assets/` folder named `screen1.png` and `screen2.png`!)*

<p align="center">
  <img src="./assets/screen1.png" width="250" alt="Score Reveal State 1" style="margin-right: 15px;" />
  <img src="./assets/screen2.png" width="250" alt="Completed Reveal State 2" />
</p>

---

## 🎯 Problem Statement & Goal

After a multiplayer math duel ends, Matiks needs an immersive post-game score reveal screen rendering production-quality animations natively.

This project delivers:
- **Zero Javascript State-Loop Bottlenecks**: All physical manipulation acts exclusively across the UI Native threads heavily relying on Reanimated Shared Values.
- **Micro-interactions**: Bounce scaling, sequential delays, opacity fading, and continuous pulsing techniques create a lively, breathing application feel.

---

## 🛠 Tech Stack & Packages

This module takes advantage of modern capabilities inside the Expo SDK ecosystem:

- **React Native (Expo SDK 54 / RN 0.81.5)**: Modern, New-Architecture ready app chassis.
- **[react-native-reanimated (v4.1.1)](https://docs.swmansion.com/react-native-reanimated/)**: The core engine powering **100% of the animations**. Reanimated 4 ensures ultra-smooth 60fps execution physically running isolated on the native Worklets implementation (bypassing React component renders).
- **[react-native-worklets](https://github.com/margelo/react-native-worklets-core)**: Modern architecture C++ turbo module dependency enabling Reanimated 4 thread separation logic.
- **[@shopify/react-native-skia](https://shopify.github.io/react-native-skia/)**: High-performance 2D Canvas rendering engine mapping to device GPUs utilized to render the randomized **Confetti Burst** physics!
- **[expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)**: Access Native device vibration engines providing tactile feedback natively tied to the Share Button physical interaction states.
- **[expo-linear-gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)**: Generates the high-fidelity dark immersive backdrop gradients and the shimmer overlay masking matrices safely.

---

## 🏗 Component Architecture & Animation Details

### 1. `ScoreCounter.tsx` (Score Iteration & Overshoot Phase)
Animates a raw mathematical numeric value from `0` to the `Target Score` simulating an aggressive point influx tick sequence.
- **Animation Strategy**: Implements a highly performant custom `useCountUp` engine utilizing `useSharedValue`.
- **Properties**: Modifies target trajectories securely with `withSequence` combining `withTiming` to intentionally trigger an overshoot (hitting roughly 104% of the target) before securely rubber-banding precisely back into final state via a customized `withSpring` configuration!
- **UI Bridging**: Triggers `<Text>` updates by hooking a `useAnimatedReaction` intercept on the native value triggering `runOnJS()` logic precisely when frame updates execute.

### 2. `ComboStreakBadge.tsx` (Momentum Display)
Renders the prominent `🔥 X Combo Streak!` achievement panel.
- **Animation Strategy**: Initially hidden, it delays presentation logically waiting for the parent `ScoreCounter` to reach ~50% completion. 
- **Properties**: Upon trigger, rapidly explodes into reality scaling upward utilizing a bouncy spring parameter bounds mapping from `0` → `1.15` dropping heavily back stabilizing at `1.0`.
- **Infinite Pulse**: The internal flame `🔥` icon implements an infinite background tasking metric `withRepeat(..., -1)` that constantly cycles scale mappings and opacity matrices producing a real-world breathing effect permanently out of bounds.

### 3. `RankReveal.tsx` (Competition Positioning)
Renders a segmented UI physical card presenting the global participant performance location representing platform integration.
- **Animation Strategy**: Holds state completely frozen matching physical delays. Triggers identically 200 ms after the `ScoreCounter.tsx` resolves execution.
- **Properties**: Uses `translateY` bound arrays to slide dynamically out from a masked boundary dropping the opacity shroud rendering perfectly aligned directly underneath the other data segments.

### 4. `ShareButton.tsx` (Call to Action Glint & Haptics)
Prominently colored dynamic social execution button heavily pushing interaction metrics.
- **Animation Strategy (Shimmer)**: Drives a `withRepeat` timeline binding against an inner hidden white angled `-rgba` gradient pushing explicit `translateX` offset mappings from `-100vw` straight across to off-screen right over a `1800ms` window infinitely looping.
- **Animation Strategy (Press Metrics)**: Intercepts `onPressIn` and `onPressOut` lifecycle phases executing hard-stops converting internal static views into native spring mechanics squeezing physical boundaries down to `0.92` ratio and snapping upwards aggressively attached directly with synchronous SDK `Haptics.impactAsync` firings delivering heavy tactile device responses!

### 5. `ConfettiCanvas.tsx` (*Bonus Intern Task*) 
Executes a heavy load burst graphic representation signaling successful presentation metrics triggering locally the exact millisecond the numerical counter settles exactly.
- **Animation Strategy**: Uses a raw Native Skia rendering surface `<Canvas>`. Computes internal mathematical variables representing `[Trajectory, Angle, Velocity, Rotation, Opacity Decay]` for exactly 60 individual fragments. 
- **Properties**: Executes a standalone single-run timing engine pushing variable decay constants against physical parameters dropping out dynamically off screen.

---

## 💻 Local Setup & Execution Guide

### 1. Clone the Repository
```bash
git clone https://github.com/PraneethKulukuri26/Matiks---React-Native-Task---Praneeth.git
cd ReactNativeMatiks
```

### 2. Install Package Dependencies
Ensure you have `Node.js` installed perfectly on your machine, then execute:
```bash
npm install
```

### 3. Build & Run Natively
> **CRITICAL WARNING**: Do **NOT** use `Expo Go`. The Bonus Skia Canvas dependency uses custom native modifications which explicitly require a Development Client Build compilation natively compiling Java elements inside Android.

You must have the **Android Studio SDK Tools & NDK** set up on your machine!

*To start the build:*
```bash
# Clear old packager caches completely before binding
npx expo start -c

# In a new terminal tab, execute the native build procedure
npx expo run:android
```

Once the SDK hooks cleanly into Gradle and compiles the `app-debug.apk` directly on Android, the Metro bundler will connect, transferring fast-refreshed JS instructions seamlessly!

---

## 🚀 Generating a Standalone Production APK 

To compile a hardened executable `.apk` file that can be distributed and sideloaded completely independently (without needing a command terminal running the bundler):

We will process this natively in the cloud effectively bypassing hardware environments locally using Expo Application Services (`EAS`).

### Step 1: Install EAS CLI Globally
```bash
npm install -g eas-cli
```

### Step 2: Login or Register an Expo Account
```bash
eas login
```

### Step 3: Configure Build Architecture
Create an initialization payload specifying the local Android app build targets:
```bash
eas build:configure
```

### Step 4: Modify `eas.json` (Important for APK rather than AAB distribution)
Open the generated `eas.json` document and add the `"buildType": "apk"` instruction directly into the `preview` or `production` blocks to prevent it executing `AAB` Store targets seamlessly:
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### Step 5: Execute APK Compilation
Trigger the remote cloud hardware processing queue directly targeted at Android outputs securely:
```bash
eas build -p android --profile preview
```
After roughly 4 to 8 minutes, the automated compiler matrix will generate an `.apk` file output hosted entirely cleanly. Just download it directly to any Android hardware to execute independently!!

---

## 👤 Author Information

- **Name**: K.Praneeth
- **Email**: praneethkulukuri@gmail.com
- **Mobile**: 8074674228
- **GitHub Repository**: [PraneethKulukuri26/Matiks---React-Native-Task---Praneeth](https://github.com/PraneethKulukuri26/Matiks---React-Native-Task---Praneeth.git)
- **LinkedIn**: [praneeth-kulukuri](https://www.linkedin.com/in/praneeth-kulukuri/)

