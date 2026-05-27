import React from 'react';
import { useGameStore } from '../../store/gameStore';

interface TutorialStep {
  title: string;
  content: string;
  highlight?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: '欢迎来到修炼世界！',
    content: '道友，恭喜你踏上修炼之路。接下来让我为你介绍武道修炼的基础知识。',
  },
  {
    title: '武道境界',
    content: '武道分为煅体、玄脉、武心、灵现、凌虚、悟道、冠绝、绝圣、圣君、君帝十大境界。每个境界分为初期、中期、后期、圆满四重，一步一个脚印，方能武道通神。',
  },
  {
    title: '修炼提升',
    content: '点击修炼按钮可以获得修为。修为积累足够后可以尝试突破，不过突破可能会失败，需要做好准备。',
    highlight: 'cultivate_btn',
  },
  {
    title: '战斗历练',
    content: '通过战斗可以获得经验和灵石。战斗时可以选择不同的战斗策略，影响你的战斗表现。',
    highlight: 'battle_btn',
  },
  {
    title: '灵根资质',
    content: '你的灵根决定了修炼速度。变异灵根和天灵根是修炼的上等资质，而五灵根修炼较慢但基础扎实。',
  },
  {
    title: '探索秘境',
    content: '达到特定境界后可以探索秘境，获得稀有宝物和材料。秘境中有强大的敌人，需要小心应对。',
    highlight: 'realm_btn',
  },
  {
    title: '道心选择',
    content: '你的选择会影响道心。是正道直行、杀伐果断还是顺其自然？每个选择都会带来不同的机缘。',
  },
  {
    title: '祝道友武道昌盛！',
    content: '修炼之路漫漫，望道友坚持不懈，终成武道传奇！',
  },
];

const TutorialPanel: React.FC = () => {
  const { tutorial, nextTutorialStep, completeTutorial, setTutorialStep } = useGameStore();

  if (tutorial.completed) return null;

  const currentStep = tutorialSteps[tutorial.currentStep];
  if (!currentStep) return null;

  const isLastStep = tutorial.currentStep === tutorialSteps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">{currentStep.title}</h2>
          <div className="text-sm text-gray-500">
            {tutorial.currentStep + 1} / {tutorialSteps.length}
          </div>
        </div>
        <p className="text-gray-700 mb-6">{currentStep.content}</p>

        <div className="flex gap-2">
          {tutorial.currentStep > 0 && (
            <button
              onClick={() => setTutorialStep(tutorial.currentStep - 1)}
              className="flex-1 py-3 bg-gray-200 rounded-lg font-bold text-gray-700"
            >
              上一步
            </button>
          )}
          {isLastStep ? (
            <button
              onClick={completeTutorial}
              className="flex-1 py-3 bg-green-600 text-white rounded-lg font-bold"
            >
              开始修炼！
            </button>
          ) : (
            <button
              onClick={nextTutorialStep}
              className="flex-1 py-3 bg-gray-800 text-white rounded-lg font-bold"
            >
              下一步
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorialPanel;
