import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { STORY_DATA, StoryNode } from '../../data/storyData';

interface StoryPanelProps {
  onClose: () => void;
}

export const StoryPanel: React.FC<StoryPanelProps> = ({ onClose }) => {
  const game = useGameStore();
  const [currentNodeId, setCurrentNodeId] = useState<string>('universal_start');
  const [showStory, setShowStory] = useState(true);
  
  const currentNode = STORY_DATA[currentNodeId];
  const completedStories = game.completedStories || [];
  
  const getUnlockedStories = () => {
    return Object.values(STORY_DATA).filter(node => {
      const canShow = !node.requiredRealm || game.stats.realm >= node.requiredRealm;
      const canShowBackground = !node.requiredBackground;
      return canShow && canShowBackground;
    });
  };

  const handleChoice = (nextNode: string) => {
    if (currentNode?.rewards) {
      if (currentNode.rewards.gold) game.gainGold(currentNode.rewards.gold);
      if (currentNode.rewards.cultivation) game.gainCultivation(currentNode.rewards.cultivation);
      if (currentNode.rewards.talentPoints) {
        game.talentPoints = (game.talentPoints || 0) + currentNode.rewards.talentPoints;
      }
    }
    
    if (!completedStories.includes(currentNodeId)) {
      const newCompleted = [...completedStories, currentNodeId];
      game.completedStories = newCompleted;
    }
    
    if (nextNode) {
      setCurrentNodeId(nextNode);
    }
  };

  const unlockedStories = getUnlockedStories();

  if (!showStory) {
    return (
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">剧情选择</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {unlockedStories.map((node) => {
            const isCompleted = completedStories.includes(node.id);
            const isUnlocked = !node.requiredRealm || game.stats.realm >= node.requiredRealm;
            
            return (
              <button
                key={node.id}
                onClick={() => {
                  if (isUnlocked) {
                    setCurrentNodeId(node.id);
                    setShowStory(true);
                  }
                }}
                disabled={!isUnlocked}
                className={`w-full p-4 rounded-lg text-left transition-all ${
                  isUnlocked
                    ? isCompleted
                      ? 'bg-green-50 border border-green-200 hover:bg-green-100'
                      : 'bg-blue-50 border border-blue-200 hover:bg-blue-100'
                    : 'bg-gray-100 border border-gray-300 cursor-not-allowed'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-black">{node.title}</span>
                  {isCompleted && <span className="text-green-600">✓</span>}
                </div>
                {node.requiredRealm !== undefined && (
                  <p className="text-sm text-gray-500">
                    要求境界: {node.requiredRealm + 1}层
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 max-w-md mx-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-black">{currentNode?.title || '剧情'}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowStory(false)}
            className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
          >
            选择章节
          </button>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg mb-4 border border-purple-200">
        <p className="text-black leading-relaxed text-lg">{currentNode?.content || '暂无剧情内容'}</p>
      </div>

      {currentNode?.rewards && (
        <div className="bg-yellow-50 p-3 rounded-lg mb-4 border border-yellow-200">
          <p className="text-yellow-700 font-bold mb-2">完成奖励:</p>
          <div className="text-sm text-black">
            {currentNode.rewards.gold && <p>💰 {currentNode.rewards.gold}灵石</p>}
            {currentNode.rewards.cultivation && <p>✨ {currentNode.rewards.cultivation}修为</p>}
            {currentNode.rewards.talentPoints && <p>🌟 {currentNode.rewards.talentPoints}天赋点</p>}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {currentNode?.choices ? (
          currentNode.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleChoice(choice.nextNode)}
              className={`w-full p-4 rounded-lg text-left transition-all font-bold ${
                choice.consequence === 'good'
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : choice.consequence === 'bad'
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {choice.text}
            </button>
          ))
        ) : currentNode?.nextNode ? (
          <button
            onClick={() => currentNode.nextNode && handleChoice(currentNode.nextNode)}
            className="w-full p-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold"
          >
            继续剧情
          </button>
        ) : (
          <div className="text-center p-4 bg-green-100 rounded-lg">
            <p className="text-green-700 font-bold text-lg">🎉 恭喜完成此剧情!</p>
            <button
              onClick={() => setShowStory(false)}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              返回选择
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
