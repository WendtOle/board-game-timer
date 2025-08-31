# Board Game Timer App

A minimalistic multiplayer board game timer application built with Next.js, React, and TypeScript. This app manages turn-based timing for multiple players with a clean, focused interface featuring circular progress rings and essential information only.

## Design Philosophy

**Minimalistic & Clean**: The interface focuses solely on what matters - player names, time remaining, and visual progress. No clutter, no unnecessary elements.

## Features

### Core Functionality
- **Multiple Players**: Support for 2+ players with individual circular timers
- **Configurable Time Settings**: Set initial time per player and bonus time per turn
- **Negative Time Support**: Timers can go below zero (overtime) with visual ring indicators
- **Turn Bonus System**: Each new turn adds bonus time to current time (can make negative time positive again)
- **Global Pause**: Ability to pause the entire game - no player timers run during pause
- **Visual Progress Rings**: Time remaining shown through SVG progress circles around each player

### Minimalistic Interface
- **Clean Circular Timers**: Each player gets a circular display with progress ring
- **Essential Information Only**: Player name and time remaining - nothing more
- **Visual Time Representation**: Progress ring shows remaining time at a glance
- **Simple Interactions**: Click on active player's circle to end turn
- **Minimal Controls**: Essential pause/resume and reset functionality only

### Visual States
- **Active Player**: Green progress ring, clickable to end turn
- **Waiting Players**: Gray progress ring, inactive state
- **Low Time**: Yellow/orange ring when under 1 minute remaining
- **Overtime**: Red progress ring for negative time
- **Paused**: All rings pause animation, subtle visual indication

### Game Flow
1. **Setup**: Configure number of players, initial time, and bonus time per turn
2. **Play**: Start the game - first player's timer begins
3. **Turn Switch**: When a player ends their turn, bonus time is added to their current time
4. **Overtime**: If time goes negative, player is in overtime but can continue playing
5. **Pause**: Global pause stops all timers until resumed
6. **Recovery**: Negative time can become positive again when bonus time is added on next turn

## Technical Implementation

### Architecture
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for responsive styling
- **React Hooks** for state management
- **Custom Hooks** for timer logic

### Core Components
- `GameSetup`: Minimal setup interface for players and settings
- `PlayerTimer`: Circular timer with SVG progress ring and essential info only
- `GameControls`: Simplified controls - pause/resume and reset icons
- `Timer`: Clean main layout with circular timer grid

### Key Types
```typescript
interface Player {
  id: string;
  name: string;
  timeRemaining: number; // Can be negative
}

interface GameState {
  players: Player[];
  activePlayerIndex: number | null;
  isPaused: boolean;
  isRunning: boolean;
}

interface TimerSettings {
  initialTime: number; // in seconds
  bonusTime: number;   // in seconds
}
```

### Custom Hook: useGameTimer
Manages all timer logic including:
- Countdown functionality with negative time support
- Turn switching with bonus time addition
- Global pause/resume functionality
- Progress ring calculations for visual display
- Active player management

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
npm run dev
```

### Development
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run lint   # Run ESLint
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. **Game Setup**
   - Enter number of players (minimum 2)
   - Set initial time per player (e.g., 10 minutes)
   - Set bonus time per turn (e.g., 30 seconds)

2. **During Game**
   - Only the active player's timer counts down (green ring animating)
   - Click on active player's circle to end their turn
   - Use pause icon to stop all timers globally
   - Negative time shows red ring with minus time display

3. **Turn Management**
   - When a player starts their turn, bonus time is added to their current time
   - This can bring negative time back to positive
   - Players can continue playing even with negative time
   - Ring progress visually represents time remaining

## Features in Detail

### Negative Time Handling
- Timers continue counting below zero
- Visual indication: red progress ring, minus sign in time display
- No automatic game ending when time goes negative
- Recovery possible: bonus time on next turn can make time positive again

### Global Pause System
- Pause icon stops all player timers and ring animations
- Subtle visual indication when game is paused (dimmed rings)
- Resume continues with previously active player
- Can be used for breaks, discussions, or rule clarifications

### Minimalistic Visual Design
- **Clean circles**: Each player timer is a perfect circle with progress ring
- **Essential info only**: Player name (large) and time remaining (subtitle)
- **Color-coded rings**: Intuitive visual feedback without text labels
- **Smooth animations**: Progress rings animate smoothly as time counts down
- **Responsive grid**: Circles adapt to screen size while maintaining proportions

## Future Enhancements
- **Sound alerts**: Subtle audio cues for low time warnings
- **Theme options**: Dark/light mode toggle
- **Custom colors**: Personalized ring colors per player
- **Gesture controls**: Swipe gestures for mobile interactions
- **Haptic feedback**: Touch vibrations for mobile devices
- **Accessibility**: Screen reader support and high contrast mode
