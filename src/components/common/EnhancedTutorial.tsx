import React, { useState, useEffect, useCallback, useMemo } from 'react';

// 教程步骤类型
export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  actionText: string;
  type: 'info' | 'action' | 'milestone';
  requiredAction?: string; // 需要完成的动作
  highlightElement?: string; // 高亮的元素ID
  reward?: {
    gold?: number;
    cultivation?: number;
    item?: { id: string; name: string; quantity: number };
  };
}

// 完整的新手引导流程
export const ENHANCED_TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: '欢迎来到修仙世界',
    content: '道友，恭喜你踏入修仙一途！在这个世界里，你将通过修炼提升境界，挑战妖兽，最终成为传说中的大能。',
    actionText: '开始修仙',
    type: 'info',
  },
  {
    id: 'character_intro',
    title: '你的属性',
    content: '每位修士都有自己的灵根、体质和基础属性。灵根决定了你的修炼速度，体质则影响战斗能力。',
    actionText: '了解属性',
    type: 'info',
  },
  {
    id: 'cultivation_intro',
    title: '修炼之道',
    content: '点击「修炼」按钮来获得修为。修为积累到一定程度后，可以尝试突破至更高的小境界或大境界。',
    actionText: '开始修炼',
    type: 'action',
    requiredAction: 'cultivation',
    highlightElement: 'cultivate_btn',
    reward: { cultivation: 50 },
  },
  {
    id: 'gold_intro',
    title: '灵石的重要性',
    content: '灵石是修仙界的硬通货。你可以通过战斗、任务等方式获得灵石，用于购买装备、丹药等资源。',
    actionText: '了解灵石',
    type: 'info',
  },
  {
    id: 'battle_intro',
    title: '战斗历练',
    content: '战斗是提升实力的重要途径。通过与妖兽战斗，你可以获得修为、灵石，还有可能获得掉落物品。',
    actionText: '挑战妖兽',
    type: 'action',
    requiredAction: 'battle',
    highlightElement: 'battle_btn',
    reward: { gold: 100 },
  },
  {
    id: 'equipment_intro',
    title: '装备加持',
    content: '合适的装备能大幅提升你的战斗力。你可以在商店购买装备，记得要及时更新你的装备。',
    actionText: '查看装备',
    type: 'info',
    highlightElement: 'equipment_panel',
  },
  {
    id: 'quest_intro',
    title: '任务系统',
    content: '完成任务可以获得丰厚奖励。任务分为主线任务和支线任务，指引你修仙的方向。',
    actionText: '查看任务',
    type: 'info',
    highlightElement: 'quest_panel',
  },
  {
    id: 'first_milestone',
    title: '第一个里程碑',
    content: '你已经掌握了修仙的基础！接下来，努力修炼到煅体境中期吧。',
    actionText: '继续前进',
    type: 'milestone',
    reward: { gold: 200, cultivation: 100 },
  },
  {
    id: 'skills_intro',
    title: '功法学习',
    content: '功法是战斗中的重要手段。不同的功法有不同的属性和效果，找到适合你的功法吧。',
    actionText: '了解功法',
    type: 'info',
  },
  {
    id: 'tutorial_complete',
    title: '教程完成',
    content: '恭喜你完成了新手教程！你已经准备好在修仙世界大展拳脚了。记住，持之以恒，方能成就大道！',
    actionText: '开启修仙之旅',
    type: 'milestone',
    reward: { 
      gold: 500, 
      cultivation: 200,
      item: { id: 'spirit_pill', name: '通脉丹', quantity: 5 }
    },
  },
];

interface EnhancedTutorialProps {
  isActive: boolean;
  currentStepIndex: number;
  completedSteps: string[];
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
  onSkip: () => void;
  onActionComplete?: (actionType: string) => void;
  waitingForAction?: boolean;
}

export const EnhancedTutorial: React.FC<EnhancedTutorialProps> = ({
  isActive,
  currentStepIndex,
  completedSteps,
  onNext,
  onPrev,
  onComplete,
  onSkip,
  onActionComplete,
  waitingForAction,
}) => {
  const currentStep = useMemo(
    () => ENHANCED_TUTORIAL_STEPS[currentStepIndex],
    [currentStepIndex]
  );

  if (!isActive || !currentStep) return null;

  const progress = Math.round(((currentStepIndex + 1) / ENHANCED_TUTORIAL_STEPS.length) * 100);

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === ENHANCED_TUTORIAL_STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* 进度条 */}
        <div className="h-1 bg-gray-100">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-6">
          {/* 标题和步骤指示 */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {currentStep.title}
            </h2>
            <span className="text-sm text-gray-500">
              {currentStepIndex + 1}/{ENHANCED_TUTORIAL_STEPS.length}
            </span>
          </div>

          {/* 图标/标记 */}
          <div className="flex items-center gap-2 mb-4">
            {currentStep.type === 'info' && (
              <span className="text-blue-500 text-xl">📖</span>
            )}
            {currentStep.type === 'action' && (
              <span className="text-yellow-500 text-xl">⚔️</span>
            )}
            {currentStep.type === 'milestone' && (
              <span className="text-green-500 text-xl">🏆</span>
            )}
            <span className="text-sm text-gray-600">
              {currentStep.type === 'info' && '知识'}
              {currentStep.type === 'action' && '行动'}
              {currentStep.type === 'milestone' && '里程碑'}
            </span>
          </div>

          {/* 内容 */}
          <p className="text-gray-700 mb-6 leading-relaxed">
            {currentStep.content}
          </p>

          {/* 奖励提示 */}
          {currentStep.reward && (
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="text-sm font-medium text-yellow-800 mb-2">完成奖励</div>
              <div className="flex flex-wrap gap-2">
                {currentStep.reward.gold && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                    💰 {currentStep.reward.gold} 灵石
                  </span>
                )}
                {currentStep.reward.cultivation && (
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                    ✨ {currentStep.reward.cultivation} 修为
                  </span>
                )}
                {currentStep.reward.item && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    📦 {currentStep.reward.item.name} x{currentStep.reward.item.quantity}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* 等待操作提示 */}
          {waitingForAction && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-blue-700 text-sm">
                👆 请按照提示完成相应操作后继续
              </p>
            </div>
          )}

          {/* 按钮区域 */}
          <div className="flex gap-3">
            {!isFirstStep && (
              <button
                onClick={onPrev}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                上一步
              </button>
            )}
            
            {isLastStep ? (
              <button
                onClick={onComplete}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium transition-all"
              >
                {currentStep.actionText}
              </button>
            ) : (
              <button
                onClick={onNext}
                disabled={waitingForAction}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  waitingForAction
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                }`}
              >
                {waitingForAction ? '等待操作...' : currentStep.actionText}
              </button>
            )}
          </div>

          {/* 跳过按钮 */}
          <div className="mt-4 text-center">
            <button
              onClick={onSkip}
              className="text-gray-400 hover:text-gray-600 text-sm transition-colors"
            >
              跳过教程
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTutorial;
