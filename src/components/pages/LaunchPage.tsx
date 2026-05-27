import React, { useState } from 'react';

interface LaunchPageProps {
  onNewGame: () => void;
  onLoadGame: (slot: number) => void;
  hasSavedGames: boolean[];
}

const LaunchPage: React.FC<LaunchPageProps> = ({ onNewGame, onLoadGame, hasSavedGames }) => {
  const [showSlots, setShowSlots] = useState(false);
  const [showGuidance, setShowGuidance] = useState(false);
  const hasAnySave = hasSavedGames.some(v => v);

  const handleContinue = () => {
    if (!hasAnySave) {
      setShowGuidance(true);
      setTimeout(() => setShowGuidance(false), 4000);
      return;
    }
    setShowSlots(!showSlots);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">成帝，等闲之事</h1>
          <p className="text-gray-500">踏上修炼之路，问鼎武道巅峰</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={onNewGame}
            className={`w-full py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-lg transition-all min-h-[56px] ${showGuidance ? 'animate-glow ring-4 ring-yellow-400 ring-offset-2' : ''}`}
          >
            踏上武道
          </button>

          <button
            onClick={handleContinue}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all min-h-[56px] border-2 ${
              showSlots
                ? 'bg-gray-100 border-gray-900 text-gray-900'
                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-900'
            }`}
          >
            继续征程
          </button>

          {showGuidance && (
            <div className="text-center animate-slide-in">
              <div className="inline-flex items-center gap-2 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>暂无存档，请先点击上方的 <strong>「踏上武道」</strong> 开始新游戏！</span>
              </div>
            </div>
          )}

          {showSlots && hasAnySave && (
            <div className="mt-4 grid grid-cols-3 gap-3 animate-fade-in">
              {[1, 2, 3].map((slot) => {
                const hasSave = hasSavedGames[slot - 1];
                if (!hasSave) {
                  return (
                    <div
                      key={slot}
                      className="p-4 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center min-h-[80px]"
                    >
                      <div className="text-sm font-bold text-gray-400">存档 {slot}</div>
                      <div className="text-xs text-gray-300 mt-1">空</div>
                    </div>
                  );
                }
                return (
                  <button
                    key={slot}
                    onClick={() => onLoadGame(slot)}
                    className="p-4 rounded-xl border-2 border-gray-900 bg-white hover:bg-gray-50 transition-all min-h-[80px] flex flex-col items-center justify-center"
                  >
                    <div className="text-sm font-bold text-gray-900">存档 {slot}</div>
                    <div className="text-xs text-green-600 mt-1">已存档</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LaunchPage;
