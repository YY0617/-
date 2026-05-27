import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { NPC, STATUS_LABELS } from '../../data/npcTemplates';
import { getRealmName } from '../../store/gameStore';
import { generateChatInteraction, generateGiftInteraction, generateDuelInteraction, updateNPCPlayerMemory } from '../../systems/npcAI';
import { getAvailableQuestsForNPC, NPCQuest } from '../../data/npcQuests';

interface NPCDetailPanelProps {
  npc: NPC;
  onBack: () => void;
}

const NPCDetailPanel: React.FC<NPCDetailPanelProps> = ({ npc, onBack }) => {
  const { updateNPC, stats, showToast } = useGameStore();
  const [activeTab, setActiveTab] = useState<'info' | 'interact' | 'relations' | 'quests'>('info');
  const [currentInteraction, setCurrentInteraction] = useState<any>(null);

  const getPlayerMemory = () => npc.memories['player'] || {
    interactions: 0,
    trust: 50,
    lastMeeting: Date.now(),
    importantMoments: []
  };
  
  const availableQuests = getAvailableQuestsForNPC(npc, stats, []);

  const handleChat = () => {
    const interaction = generateChatInteraction(npc);
    setCurrentInteraction(interaction);
  };

  const handleGift = () => {
    const interaction = generateGiftInteraction(npc);
    setCurrentInteraction(interaction);
  };

  const handleDuel = () => {
    const interaction = generateDuelInteraction(npc);
    setCurrentInteraction(interaction);
  };

  const handleInteractionChoice = (choiceIndex: number) => {
    if (!currentInteraction) return;
    
    const choice = currentInteraction.choices[choiceIndex];
    let trustChange = choice.rewards?.trustChange || 0;
    if (choice.consequences?.trustChange) {
      trustChange += choice.consequences.trustChange;
    }
    
    const updatedNPC = updateNPCPlayerMemory(npc, trustChange, 
      `与${npc.name}进行了${currentInteraction.type === 'chat' ? '交谈' : 
        currentInteraction.type === 'gift' ? '送礼' : '切磋'}活动`);
    
    updateNPC(npc.id, { memories: updatedNPC.memories });
    setCurrentInteraction(null);
    
    if (choice.rewards?.exp) {
      showToast(`获得 ${choice.rewards.exp} 修为！`, 'success');
    }
  };

  const trust = getPlayerMemory().trust;

  const renderTabContent = (): React.ReactNode => {
    if (activeTab === 'info') {
      return (
        <div className="space-y-2">
          <div className="bg-white p-3 rounded border border-gray-200">
            <h3 className="font-bold text-black mb-2">基本信息</h3>
            <div className="space-y-2 text-gray-700">
              <p><span className="font-medium">境界：</span>{getRealmName(npc.currentRealm, npc.currentSubLevel)}</p>
              <p><span className="font-medium">位置：</span>{npc.location}</p>
              <p><span className="font-medium">状态：</span><span className="text-black">{STATUS_LABELS[npc.status]}</span></p>
              <p><span className="font-medium">灵石：</span>{npc.gold}</p>
              <p><span className="font-medium">修为：</span>{Math.floor(npc.cultivation)}</p>
            </div>
          </div>

          <div className="bg-white p-3 rounded border border-gray-200">
            <h3 className="font-bold text-black mb-2">形象</h3>
            <p className="text-gray-700">{npc.appearance}</p>
          </div>

          <div className="bg-white p-3 rounded border border-gray-200">
            <h3 className="font-bold text-black mb-2">性格</h3>
            <p className="text-gray-700">{npc.personality}</p>
          </div>

          <div className="bg-white p-3 rounded border border-gray-200">
            <h3 className="font-bold text-black mb-2">背景</h3>
            <p className="text-gray-700">{npc.background}</p>
          </div>

          <div className="bg-white p-3 rounded border border-gray-200">
            <h3 className="font-bold text-black mb-2">志向</h3>
            <p className="text-gray-700">{npc.longTermGoal}</p>
          </div>
        </div>
      );
    }

    if (activeTab === 'interact') {
      return (
        <div className="space-y-2">
          <div className="bg-white p-3 rounded border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-black">对你的印象</h3>
              <div className="text-sm">
                <span className="text-black">
                  信任度：{trust}%
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded h-3 mb-2">
              <div
                className="bg-black h-3 rounded transition-all"
                style={{ width: trust + '%' }}
              />
            </div>
            <p className="text-sm text-gray-600">
              互动次数：{getPlayerMemory().interactions}
            </p>
            {getPlayerMemory().importantMoments.length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                <p>记忆：</p>
                <ul className="mt-1">
                  {getPlayerMemory().importantMoments.slice(-3).map((moment, i) => (
                    <li key={i}>• {moment}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <button onClick={handleChat} className="p-3 bg-black text-white rounded hover:bg-gray-800 min-h-[44px]">谈</button>
            <button onClick={handleGift} className="p-3 bg-gray-600 text-white rounded hover:bg-gray-700 min-h-[44px]">礼</button>
            <button onClick={handleDuel} className="p-3 bg-gray-800 text-white rounded hover:bg-gray-900 min-h-[44px]">战</button>
          </div>

          <div className="text-center text-gray-500 text-sm mt-2">
            更多互动方式正在开发中...
          </div>
        </div>
      );
    }

    if (activeTab === 'relations') {
      return (
        <div className="space-y-2">
          <div className="bg-white p-3 rounded border border-gray-200">
            <h3 className="font-bold text-black mb-2">与其他修士的关系</h3>
            {Object.keys(npc.relationships).length === 0 ? (
              <div className="text-gray-500 text-center p-3">暂无关系记录...</div>
            ) : (
              <div className="space-y-2">
                {Object.entries(npc.relationships).map(([otherId, relation]) => (
                  <div key={otherId} className="p-2 bg-gray-50 rounded border border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">神秘修士</span>
                      <span className={'text-xs text-black border border-gray-300 px-2 py-1 rounded'}>
                        {relation.type === 'friend' ? '好友' : relation.type === 'rival' ? '对手' : '中立'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">信任度：{relation.trust}%</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (activeTab === 'quests') {
      return (
        <div className="space-y-2">
          <div className="bg-white p-3 rounded border border-gray-200">
            <h3 className="font-bold text-black mb-2">可接取的任务</h3>
            {availableQuests.length === 0 ? (
              <div className="text-gray-500 text-center p-3">暂无可接取的任务...</div>
            ) : (
              <div className="space-y-2">
                {availableQuests.map(quest => (
                  <div key={quest.id} className="p-3 bg-gray-50 rounded border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-black">{quest.title}</h4>
                      {quest.repeatable && (
                        <span className="text-xs bg-gray-200 text-black px-2 py-1 rounded border border-gray-300">可重复</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{quest.description}</p>
                    <div className="text-xs text-gray-600 mb-2">
                      <p className="font-medium mb-1">目标：</p>
                      <ul>
                        {quest.objectives.map((obj, i) => (
                          <li key={i}>• {obj.target} ({obj.current}/{obj.count})</li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      <p className="font-medium">奖励：</p>
                      <p>
                        {quest.rewards.gold ? quest.rewards.gold + '灵石' : ''}
                        {quest.rewards.exp ? ' ' + quest.rewards.exp + '修为' : ''}
                        {quest.rewards.item ? ' ' + quest.rewards.item : ''}
                      </p>
                    </div>
                    <button className="w-full py-2 bg-black text-white rounded hover:bg-gray-800 min-h-[44px]">接取任务</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-3">
      <div className="flex items-center mb-2">
        <button
          onClick={onBack}
          className="mr-3 p-2 bg-gray-200 rounded text-black hover:bg-gray-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          返回
        </button>
        <h2 className="text-base font-bold text-black py-2.5">
          {npc.gender === 'male' ? '男' : '女'} {npc.name}
        </h2>
      </div>

      {currentInteraction ? (
        <div className="bg-white p-3 rounded border border-gray-200">
          <h3 className="font-bold text-black mb-2">{currentInteraction.title}</h3>
          <p className="text-gray-700 mb-2 whitespace-pre-line">{currentInteraction.content}</p>
          
          <div className="space-y-2">
            {currentInteraction.choices.map((choice: any, index: number) => (
              <button
                key={index}
                onClick={() => handleInteractionChoice(index)}
                className="w-full p-3 bg-black text-white rounded hover:bg-gray-800 text-left min-h-[44px]"
              >
                {choice.text}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentInteraction(null)}
            className="mt-2 p-2 bg-gray-400 text-white rounded hover:bg-gray-500 min-h-[44px]"
          >
            取消
          </button>
        </div>
      ) : (
        <>
          <div className="flex space-x-2 mb-2">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-3 py-2 rounded border min-h-[44px] ${activeTab === 'info' ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300'}`}
            >
              详情
            </button>
            <button
              onClick={() => setActiveTab('interact')}
              className={`px-3 py-2 rounded border min-h-[44px] ${activeTab === 'interact' ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300'}`}
            >
              互动
            </button>
            <button
              onClick={() => setActiveTab('relations')}
              className={`px-3 py-2 rounded border min-h-[44px] ${activeTab === 'relations' ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300'}`}
            >
              关系
            </button>
            <button
              onClick={() => setActiveTab('quests')}
              className={`px-3 py-2 rounded border min-h-[44px] ${activeTab === 'quests' ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300'}`}
            >
              任务
            </button>
          </div>

          {renderTabContent()}
        </>
      )}
    </div>
  );
};

export default NPCDetailPanel;
