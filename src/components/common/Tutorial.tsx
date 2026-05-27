import React, { useState, useEffect } from 'react';

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  action: string;
  targetElement?: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: '欢迎来到玄幻大世界！',
    content: '天玄大陆，万族林立，诸强并起。你是这个时代的天选之子，在这里，你将踏上成为强者的道路！',
    action: '下一步'
  },
  {
    id: 'cultivation',
    title: '修炼是王道',
    content: '点击「修炼」按钮来增加灵力。灵力是成为强者的基础，只有积累足够的灵力，才能突破更高的境界！',
    action: '了解修炼'
  },
  {
    id: 'battle',
    title: '战斗提升实力',
    content: '通过战斗可以获得更多灵力和奖励。在战斗中磨练自己，成为更强大的玄幻世界强者！',
    action: '战斗介绍'
  },
  {
    id: 'equipment',
    title: '装备与功法',
    content: '收集装备和学习功法可以大幅提升你的战斗能力。记得经常查看商店和功法面板！',
    action: '装备介绍'
  },
  {
    id: 'pet',
    title: '异兽伙伴',
    content: '在玄幻世界中，你可以收服异兽作为伙伴。异兽会在战斗中助你一臂之力，还能带来各种加成！',
    action: '了解异兽'
  },
  {
    id: 'quest',
    title: '任务与成就',
    content: '完成任务和解锁成就可以获得丰厚奖励。不要忘记查看任务面板，了解当前的目标！',
    action: '任务介绍'
  },
  {
    id: 'secret_realm',
    title: '探索秘境',
    content: '秘境是获得稀有宝物的重要途径。消耗秘境石进入秘境，挑战各种敌人，获得珍贵奖励！',
    action: '了解秘境'
  },
  {
    id: 'competition',
    title: '竞技场',
    content: '参加竞技场，与其他强者一决高下！获得更高的排名，证明你的实力！',
    action: '了解竞技场'
  },
  {
    id: 'complete',
    title: '踏上玄幻之路！',
    content: '你已经了解了玄幻世界的基本知识。现在，开始你的征程，成为天玄大陆的传说吧！',
    action: '开始征程'
  }
];

interface TutorialProps {
  onComplete: () => void;
}

export const Tutorial: React.FC<TutorialProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const step = TUTORIAL_STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999]">
      <div className="bg-gradient-to-br from-purple-900 to-purple-700 rounded-xl p-8 max-w-md mx-4 border-2 border-purple-400 shadow-2xl">
        {/* 进度指示器 */}
        <div className="flex justify-center mb-6">
          {TUTORIAL_STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-8 mx-1 rounded-full transition-all duration-300 ${
                index < currentStep
                  ? 'bg-green-400'
                  : index === currentStep
                  ? 'bg-yellow-400 scale-125'
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* 标题 */}
        <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">
          {step.title}
        </h2>

        {/* 内容 */}
        <div className="bg-white bg-opacity-10 rounded-lg p-6 mb-6">
          <p className="text-white text-lg leading-relaxed">
            {step.content}
          </p>
        </div>

        {/* 按钮 */}
        <div className="flex gap-4">
          {currentStep > 0 && (
            <button
              onClick={handlePrev}
              className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              上一步
            </button>
          )}
          
          <button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
          >
            {step.action}
          </button>
        </div>

        {/* 跳过按钮 */}
        <div className="text-center mt-4">
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            跳过教程
          </button>
        </div>

        {/* 步骤指示器 */}
        <div className="text-center mt-6">
          <span className="text-gray-300 text-sm">
            {currentStep + 1} / {TUTORIAL_STEPS.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
