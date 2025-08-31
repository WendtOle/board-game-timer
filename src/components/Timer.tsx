'use client';

import { useGameTimer } from '@/hooks/useGameTimer';
import { GameSetup } from './GameSetup';
import { PlayerTimer } from './PlayerTimer';
import { GameControls } from './GameControls';
import { useLayoutEffect, useState } from 'react';
import { getMaxSquareWidth } from '@/utils/getSquareWidth';

export const Timer: React.FC = () => {
  const { 
    gameState, 
    actions, 
    addPlayer, 
    removePlayer, 
    updateSettings, 
    handlePlayerClick,
    handleContinue,
    handleNextTurn,
    showActivePlayerButtons 
  } = useGameTimer();
  const [cols, setCols] = useState<number>()
  const [width, setWidth] = useState<number>()

  useLayoutEffect(() => {
    const { innerWidth: screenWidth, innerHeight } = window;  
    const screenHeight = innerHeight - 52  
    const [width, cols] = getMaxSquareWidth(screenWidth, screenHeight, gameState.players.length)
    setWidth(width)
    setCols(cols)
  }, [gameState.players.length])

  if (!gameState.isRunning) {
    return (
      <GameSetup
        initialSettings={gameState.settings}
        onSettingsUpdate={updateSettings}
        onAddPlayer={addPlayer}
        onRemovePlayer={removePlayer}
        onStartGame={actions.startGame}
        players={gameState.players}
      />
    );
  }

  return (
    <div  className="h-dvh bg-gray-50 py-2 px-2 overflow-hidden flex flex-col gap-2">
      {gameState.isRunning && <GameControls
        actions={actions}
        isPaused={gameState.isPaused}
        onPlayerClick={gameState.activePlayerIndex !== -1 && gameState.activePlayerIndex !== null ? () => handlePlayerClick(gameState.activePlayerIndex) : undefined}
      />}
      <div className={`grid grid-cols-${cols} justify-center items-center w-full h-full`}>
          {gameState.players.map((player, index) => (
            <PlayerTimer
              key={player.id}
              player={player}
              isActive={gameState.activePlayerIndex === index}
              isPaused={gameState.isPaused}
              onPlayerClick={() => handlePlayerClick(index)}
              onContinue={handleContinue}
              onNextTurn={handleNextTurn}
              showButtons={showActivePlayerButtons && gameState.activePlayerIndex === index}
              width={width ?? 0}
              />
          ))}
      </div>
    </div>
  );
};