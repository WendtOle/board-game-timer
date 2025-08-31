'use client';


import { Player } from '@/types/game';

interface PlayerTimerProps {
  player: Player;
  isActive: boolean;
  isPaused: boolean;
  onPlayerClick: () => void;
  onContinue?: () => void;
  onNextTurn?: () => void;
  showButtons: boolean;
  width: number;
}

export const PlayerTimer: React.FC<PlayerTimerProps> = ({
  player,
  isActive,
  isPaused,
  onPlayerClick,
  onContinue,
  onNextTurn,
  showButtons,
  width
}) => {
  const containerWidth = width * 0.9
  const formatTime = (seconds: number) => {
    const isNegative = seconds < 0;
    const absoluteSeconds = Math.abs(seconds);
    const minutes = Math.floor(absoluteSeconds / 60);
    const remainingSeconds = absoluteSeconds % 60;
    const timeString = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    return isNegative ? `-${timeString}` : timeString;
  };

  const isNegativeTime = player.timeRemaining < 0;
  const isLowTime = player.timeRemaining <= 60 && player.timeRemaining > 0;
  
  const config = { containerSize: 200, radius: 80, strokeWidth: 12, fontSize: 'text-lg', nameSize: 'text-2xl' };
  const radius = containerWidth / 2.5

  // Calculate progress for the ring (0 to 1)
  const getProgress = () => {
    if (isNegativeTime) return 1; // Show full ring when negative for pulsing effect
    return Math.max(0, Math.min(1, player.timeRemaining / player.maxTime));
  };

  const progress = getProgress();
  const circumference = 2 * Math.PI * radius;
  // For a progress ring that empties as time decreases:
  // progress of 1 (full time) should show full ring (offset = 0)
  // progress of 0 (no time) should show empty ring (offset = circumference)
  const strokeDashoffset = circumference * (1 - progress);

  const getRingColor = () => {
    if (isNegativeTime && isActive) return '#ef4444'; // bright red for active negative
    if (isNegativeTime && !isActive) return '#f3b1b1ff'; // faded red for inactive negative
    if (isLowTime && isActive) return '#f59e0b'; // orange
    if (isActive) return '#10b981'; // green
    return '#bdbdbfff'; // gray
  };

  const getTextColor = () => {
    if (isNegativeTime) return 'text-red-500';
    if (isActive) return 'text-gray-900';
    return 'text-gray-600';
  };

  return (
    <div 
      className={`relative flex flex-col items-center justify-center cursor-pointer transition-all duration-300 
        ${isPaused && isActive ? 'bg-red400 opacity-70' : ''}`}
      style={{
        width: width,
        height: width
      }}
      onClick={!showButtons ? onPlayerClick : undefined}
    >
      <svg
        className="absolute inset-0 w-full h-full transform -rotate-90"
        width={containerWidth}
        height={containerWidth}
      >
        <circle
          cx={containerWidth / 2 + 8}
          cy={containerWidth / 2 + 10}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={containerWidth / 10}
        />
        
        <circle
          cx={containerWidth / 2 + 8}
          cy={containerWidth / 2 + 10}
          r={radius}
          fill="none"
          stroke={getRingColor()}
          strokeWidth={containerWidth / 10 }
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeOpacity={isNegativeTime && !isActive ? 0.6 : 1}
          className={`transition-all duration-300 ${
            (isNegativeTime && isActive) ? 'animate-pulse' : (isActive && !isPaused && !showButtons ? 'animate-pulse' : '')
          }`}
        />
      </svg>

      <div className="z-10 text-center">
        <div className={`${config.nameSize} font-bold mb-1 ${getTextColor()} truncate`} style={{
          maxWidth: config.containerSize
        }}>
          {player.name}
        </div>
        <div className={`${config.fontSize} font-mono ${getTextColor()}`}>
          {formatTime(player.timeRemaining)}
        </div>
      </div>  
      {showButtons && isActive && (
      <div className="absolute -top-4 -left-4 flex items-center justify-center w-16 h-16  rounded-full transition-colors" onClick={(e) => {
            e.stopPropagation();
            onNextTurn?.();
          }}>
        <svg 
          className="w-8 h-8 text-black" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
        </svg>
      </div>
      )}
          {showButtons && isActive && (
      <div className="absolute -top-4 -right-4 flex items-center justify-center w-16 h-16  rounded-full transition-colors" onClick={(e) => {
            e.stopPropagation();
            onContinue?.();
          }}>
        <svg 
          className="w-8 h-8 text-black ml-1" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
      )}    
    </div>
    
  );
};