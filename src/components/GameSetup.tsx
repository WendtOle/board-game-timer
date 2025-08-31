import { useState } from 'react';
import { TimerSettings } from '@/types/game';

interface GameSetupProps {
  initialSettings: TimerSettings;
  onSettingsUpdate: (settings: TimerSettings) => void;
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (playerId: string) => void;
  onStartGame: () => void;
  players: Array<{ id: string; name: string; timeRemaining: number }>;
}

export const GameSetup: React.FC<GameSetupProps> = ({
  initialSettings,
  onSettingsUpdate,
  onAddPlayer,
  onRemovePlayer,
  onStartGame,
  players,
}) => {
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [settings, setSettings] = useState(initialSettings);

  const handleSettingsChange = (newSettings: TimerSettings) => {
    setSettings(newSettings);
    onSettingsUpdate(newSettings);
  };

  const handleAddPlayer = () => {
    if (playerName.trim()) {
      onAddPlayer(playerName.trim());
      setPlayerName('');
      setShowAddPlayerModal(false);
    }
  };

  const canStartGame = players.length >= 2 && settings.initialTime > 0;

  return (
    <div className="h-dvh bg-gray-50 py-8 px-4 overflow-hidden flex flex-col">
      <div className="flex-1 max-w-md mx-auto flex flex-col w-full">
        <div className="flex-1 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Players</h3>
          
          <div className="space-y-2 max-h-76 overflow-y-auto">
            {players.map((player, index) => (
              <div key={player.id} className="flex items-center justify-between p-2 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-base font-semibold">
                    {index + 1}
                  </div>
                  <span className="text-gray-800 font-medium text-lg">{player.name}</span>
                </div>
                <button
                  onClick={() => onRemovePlayer(player.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  aria-label={`Remove ${player.name}`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button
              onClick={() => setShowAddPlayerModal(true)}
              className="mt-2 w-full p-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center space-x-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-lg font-medium">Add Player</span>
            </button>
        </div>

        <div className="mb-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <div className="text-sm text-gray-500 text-center mb-3 font-medium">Initial Time</div>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  max="120"
                  placeholder="Min"
                  value={Math.floor(settings.initialTime / 60) || ''}
                  onChange={(e) => {
                    const minutes = parseInt(e.target.value) || 0;
                    const currentSeconds = settings.initialTime % 60;
                    handleSettingsChange({
                      ...settings,
                      initialTime: minutes * 60 + currentSeconds,
                    });
                  }}
                  className="flex-1 p-3 text-center text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  min="0"
                  max="59"
                  placeholder="Sec"
                  value={(settings.initialTime % 60) || ''}
                  onChange={(e) => {
                    const seconds = parseInt(e.target.value) || 0;
                    const currentMinutes = Math.floor(settings.initialTime / 60);
                    handleSettingsChange({
                      ...settings,
                      initialTime: currentMinutes * 60 + seconds,
                    });
                  }}
                  className="flex-1 p-3 text-center text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 text-center mb-3 font-medium">Bonus Time</div>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  max="10"
                  placeholder="Min"
                  value={Math.floor(settings.bonusTime / 60) || ''}
                  onChange={(e) => {
                    const minutes = parseInt(e.target.value) || 0;
                    const currentSeconds = settings.bonusTime % 60;
                    handleSettingsChange({
                      ...settings,
                      bonusTime: minutes * 60 + currentSeconds,
                    });
                  }}
                  className="flex-1 p-3 text-center text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  min="0"
                  max="59"
                  placeholder="Sec"
                  value={(settings.bonusTime % 60) || ''}
                  onChange={(e) => {
                    const seconds = parseInt(e.target.value) || 0;
                    const currentMinutes = Math.floor(settings.bonusTime / 60);
                    handleSettingsChange({
                      ...settings,
                      bonusTime: currentMinutes * 60 + seconds,
                    });
                  }}
                  className="flex-1 p-3 text-center text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <button
            onClick={onStartGame}
            disabled={!canStartGame}
            className="w-full py-4 text-xl font-semibold text-white bg-green-500 rounded-xl hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
{canStartGame ? 'Start Game' : players.length < 2 ? 'Add at least 2 players' : 'Set initial time > 0'}
          </button>
        </div>

        {players.length < 2 && (
          <p className="text-center text-sm text-gray-500">
            Click the + button to add players
          </p>
        )}
      </div>

      {showAddPlayerModal && (
        <div className="fixed inset-0  flex items-center justify-center z-50 bg-gray-50/75">
          <div className="absolute bg-white rounded-lg p-6 w-80 mx-4 shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-center">Add Player</h3>
            
            <input
              type="text"
              placeholder="Player name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddPlayer();
                } else if (e.key === 'Escape') {
                  setShowAddPlayerModal(false);
                  setPlayerName('');
                }
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              autoFocus
            />
            
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowAddPlayerModal(false);
                  setPlayerName('');
                }}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPlayer}
                disabled={!playerName.trim()}
                className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};