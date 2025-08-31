'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Player, TimerSettings, GameActions } from '@/types/game';

const STORAGE_KEY = 'board-game-timer-state';

const DEFAULT_SETTINGS: TimerSettings = {
  initialTime: 30, // 30 seconds
  bonusTime: 10, // 10 seconds
};

const createDefaultPlayers = (): Player[] => [
  {
    id: 'default-ole',
    name: 'Ole',
    timeRemaining: DEFAULT_SETTINGS.initialTime,
    maxTime: DEFAULT_SETTINGS.initialTime,
  },
  {
    id: 'default-lydi',
    name: 'Lydi',
    timeRemaining: DEFAULT_SETTINGS.initialTime,
    maxTime: DEFAULT_SETTINGS.initialTime,
  },
];

const loadGameState = (): GameState => {
  if (typeof window === 'undefined') {
    // Server-side rendering fallback
    return {
      players: createDefaultPlayers(),
      activePlayerIndex: null,
      isPaused: false,
      isRunning: false,
      settings: DEFAULT_SETTINGS,
    };
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validate the parsed data has required structure
      if (parsed.players && parsed.settings) {
        return {
          ...parsed,
          // Ensure settings have default values for new properties
          settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
          // Always pause on load if game was running (since timer stops on page reload)
          isPaused: parsed.isRunning ? true : parsed.isPaused,
        };
      }
    }
  } catch (error) {
    console.warn('Failed to load game state from localStorage:', error);
  }

  // Return default state if no valid saved state
  return {
    players: createDefaultPlayers(),
    activePlayerIndex: null,
    isPaused: false,
    isRunning: false,
    settings: DEFAULT_SETTINGS,
  };
};

const saveGameState = (gameState: GameState) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  } catch (error) {
    console.warn('Failed to save game state to localStorage:', error);
  }
};

const clearGameState = () => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear game state from localStorage:', error);
  }
};

export const useGameTimer = () => {
  const [gameState, setGameState] = useState<GameState>(() => loadGameState());

  const showActivePlayerButtons = gameState.isPaused

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  // Note: Pausing on load is now handled in loadGameState() to prevent hydration mismatch

  // Timer logic - runs every second when game is active and not paused
  useEffect(() => {
    if (gameState.isRunning && !gameState.isPaused && gameState.activePlayerIndex !== null && !showActivePlayerButtons) {
      timerRef.current = setInterval(() => {
        setGameState(prev => {
          const activePlayer = prev.players[prev.activePlayerIndex!];
          if (!activePlayer) return prev;

          const updatedPlayers = prev.players.map((player, index) =>
            index === prev.activePlayerIndex
              ? { ...player, timeRemaining: player.timeRemaining - 1 }
              : player
          );

          return {
            ...prev,
            players: updatedPlayers,
          };
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState.isRunning, gameState.isPaused, gameState.activePlayerIndex, showActivePlayerButtons]);

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
    setGameState(prev => {
      const playerIndex = prev.players.findIndex(p => p.id === playerId);
      const newPlayers = prev.players.filter(p => p.id !== playerId);
      let newActiveIndex = prev.activePlayerIndex;
      
      if (playerIndex === prev.activePlayerIndex) {
        newActiveIndex = newPlayers.length > 0 ? 0 : null;
      } else if (prev.activePlayerIndex !== null && playerIndex < prev.activePlayerIndex) {
        newActiveIndex = prev.activePlayerIndex - 1;
      }
      
      return {
        ...prev,
        players: newPlayers,
        activePlayerIndex: newActiveIndex,
      };
    });
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
      isPaused: true, // Start in paused mode
      activePlayerIndex: prev.players.length > 0 ? 0 : null,
    }));
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: true,
    }));
  }, []);

  const resumeGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: false,
    }));
  }, []);

  const handlePlayerClick = useCallback((playerIndex: number) => {
    if (playerIndex === gameState.activePlayerIndex) {
      setGameState(prev => ({
        ...prev,
        isPaused: !prev.isPaused,
      }));
    } else {
      // Clicking on inactive player switches to them
      setGameState(prev => {
        const updatedPlayers = prev.players.map((player, index) => {
          if (index === playerIndex) {
            const newTimeRemaining = player.timeRemaining + prev.settings.bonusTime;
            return { 
              ...player, 
              timeRemaining: newTimeRemaining,
              maxTime: Math.max(player.maxTime, newTimeRemaining)
            };
          }
          return player;
        });

        return {
          ...prev,
          players: updatedPlayers,
          activePlayerIndex: playerIndex,
          isPaused: false,
        };
      });
    }
  }, [gameState.activePlayerIndex]);

  const handleContinue = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: false,
    }));
  }, []);

  const handleNextTurn = useCallback(() => {
    setGameState(prev => {
      if (prev.activePlayerIndex === null) return prev;
      
      // Add bonus time to current player (for their next turn)
      const updatedPlayers = prev.players.map((player, index) => {
        if (index === prev.activePlayerIndex) {
          const newTimeRemaining = player.timeRemaining + prev.settings.bonusTime;
          return { 
            ...player, 
            timeRemaining: newTimeRemaining,
            maxTime: Math.max(player.maxTime, newTimeRemaining)
          };
        }
        return player;
      });

      return {
        ...prev,
        players: updatedPlayers,
        isPaused: false
      };
    });
  }, []);

  const endTurn = useCallback(() => {
    setGameState(prev => {
      if (prev.activePlayerIndex === null || prev.players.length === 0) {
        return prev;
      }

      const nextIndex = (prev.activePlayerIndex + 1) % prev.players.length;
      
      // Add bonus time to the next player
      const updatedPlayers = prev.players.map((player, index) => {
        if (index === nextIndex) {
          const newTimeRemaining = player.timeRemaining + prev.settings.bonusTime;
          return { 
            ...player, 
            timeRemaining: newTimeRemaining,
            maxTime: Math.max(player.maxTime, newTimeRemaining)
          };
        }
        return player;
      });

      return {
        ...prev,
        players: updatedPlayers,
        activePlayerIndex: nextIndex,
        isPaused: false, // Resume game when switching turns
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.length === 0 ? createDefaultPlayers() : prev.players.map(player => ({
        ...player,
        timeRemaining: prev.settings.initialTime,
        maxTime: prev.settings.initialTime,
      })),
      activePlayerIndex: null,
      isPaused: false,
      isRunning: false,
    }));
  }, []);

  const clearAllData = useCallback(() => {
    clearGameState();
    setGameState({
      players: createDefaultPlayers(),
      activePlayerIndex: null,
      isPaused: false,
      isRunning: false,
      settings: DEFAULT_SETTINGS,
    });
  }, []);

  const actions: GameActions = {
    startGame,
    pauseGame,
    resumeGame,
    endTurn,
    resetGame,
  };

  return {
    gameState,
    actions,
    addPlayer,
    removePlayer,
    updateSettings,
    handlePlayerClick,
    handleContinue,
    handleNextTurn,
    showActivePlayerButtons,
    clearAllData,
  };
};