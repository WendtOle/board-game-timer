import { useState, useCallback } from 'react';
import { GameState, Player, TimerSettings } from '@/types/game';

const DEFAULT_SETTINGS: TimerSettings = {
  initialTime: 300, // 5 minutes
  bonusTime: 30, // 30 seconds
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    activePlayerIndex: null,
    isPaused: false,
    isRunning: false,
    settings: DEFAULT_SETTINGS,
  });

  const addPlayer = useCallback((name: string) => {
    const newPlayer: Player = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      timeRemaining: gameState.settings.initialTime,
      maxTime: gameState.settings.initialTime,
    };
    setGameState(prev => ({
      ...prev,
      players: [...prev.players, newPlayer],
    }));
  }, [gameState.settings.initialTime]);

  const removePlayer = useCallback((playerId: string) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.filter(p => p.id !== playerId),
      activePlayerIndex: prev.players.findIndex(p => p.id === playerId) === -1 ? prev.activePlayerIndex : null,
    }));
  }, []);

  const updateSettings = useCallback((settings: TimerSettings) => {
    setGameState(prev => ({
      ...prev,
      settings,
      players: prev.players.map(player => ({
        ...player,
        timeRemaining: settings.initialTime,
        maxTime: settings.initialTime,
      })),
    }));
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isRunning: true,
      activePlayerIndex: prev.players.length > 0 ? 0 : null,
    }));
  }, []);

  const startTimer = useCallback((playerIndex: number) => {
    setGameState(prev => ({
      ...prev,
      activePlayerIndex: playerIndex,
      isRunning: true,
    }));
  }, []);

  const stopTimer = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: true,
    }));
  }, []);

  const updatePlayerTime = useCallback((playerId: string, timeRemaining: number) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player =>
        player.id === playerId ? { ...player, timeRemaining } : player
      ),
    }));
  }, []);

  const nextTurn = useCallback(() => {
    setGameState(prev => {
      const currentIndex = prev.activePlayerIndex !== null ? prev.activePlayerIndex : -1;
      const nextIndex = currentIndex !== -1 ? (currentIndex + 1) % prev.players.length : 0;

      // Add turn bonus to all players
      const updatedPlayers = prev.players.map(player => ({
        ...player,
        timeRemaining: player.timeRemaining + prev.settings.bonusTime,
      }));

      return {
        ...prev,
        players: updatedPlayers,
        activePlayerIndex: prev.players.length > 0 ? nextIndex : null,
        isPaused: false,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player => ({
        ...player,
        timeRemaining: prev.settings.initialTime,
        maxTime: prev.settings.initialTime,
      })),
      activePlayerIndex: null,
      isPaused: false,
      isRunning: false,
    }));
  }, []);

  return {
    gameState,
    addPlayer,
    removePlayer,
    updateSettings,
    startGame,
    startTimer,
    stopTimer,
    updatePlayerTime,
    nextTurn,
    resetGame,
  };
};