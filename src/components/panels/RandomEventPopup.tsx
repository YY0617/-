import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { useEventSystem } from '../../hooks/newGameHooks';

const RandomEventPopup: React.FC = () => {
  const { currentRandomEvent, showToast } = useGameStore();
  const { makeEventChoice, skipEvent } = useEventSystem();

  if (!currentRandomEvent) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-3 rounded max-w-md w-full mx-4 border border-gray-300">
        <h2 className="text-base font-bold mb-2 text-black py-2.5">{currentRandomEvent.title}</h2>
        <p className="text-gray-700 mb-2">{currentRandomEvent.content}</p>

        <div className="space-y-2">
          {currentRandomEvent.choices.map((choice: any, index: number) => (
            <button
              key={index}
              onClick={() => {
                const result = makeEventChoice(index);
                if (result.success) {
                  let msg = '成功！';
                  if (result.rewards) {
                    if (result.rewards.gold) msg += ` 获得${result.rewards.gold}灵石`;
                    if (result.rewards.exp) msg += ` 获得${result.rewards.exp}修为`;
                    if (result.rewards.achievement) msg += ` 解锁成就！`;
                  }
                  showToast(msg, 'success');
                } else {
                  let msg = '失败了...';
                  if (result.consequences) {
                    if (result.consequences.damage) msg += ` 受到${result.consequences.damage}点伤害`;
                    if (result.consequences.expLoss) msg += ` 损失${result.consequences.expLoss}修为`;
                  }
                  showToast(msg, 'error');
                }
              }}
              className="w-full p-3 bg-black text-white rounded hover:bg-gray-800 text-left min-h-[44px]"
            >
              {choice.text}
              {choice.successRate !== undefined && (
                <span className="text-xs opacity-75 ml-2">
                  (成功率: {Math.round(choice.successRate * 100)}%)
                </span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => skipEvent()}
          className="w-full mt-2 p-3 bg-gray-400 text-white rounded hover:bg-gray-500 min-h-[44px]"
        >
          跳过
        </button>
      </div>
    </div>
  );
};

export default RandomEventPopup;
