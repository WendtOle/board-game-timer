export interface Player {
  id: string;
  name: string;
  timeRemaining: number; // in seconds, can be negative
  maxTime: number; // maximum time this player has had (for progress ring calculation)
}

export interface TimerSettings {
  initialTime: number; // in seconds
  bonusTime: number; // in seconds added each turn
}

export interface GameState {
  players: Player[];
  activePlayerIndex: number | null;
  isPaused: boolean; // global pause state
  isRunning: boolean; // game is active (not in setup)
  settings: TimerSettings;
}

export type GamePhase = 'setup' | 'playing' | 'paused' | 'ended';

export interface GameActions {
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endTurn: () => void;
  resetGame: () => void;
}