import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import type { NPC } from '../../data/types';
import { getRealmName, getBreakthroughRate } from '../../data/realmConfig';
import { STORY_NODES } from '../../data/eventData';
import {
  CharacterPanel, InventoryPanel, SkillPanel, ShopPanel, SettingsPanel,
} from '../panels/CharacterPanels';
import { FormationPanel, QuestPanel, AchievementPanel, TalentPanel } from '../panels/FeaturePanels';
import { BattlePanel } from '../panels/BattlePanel';
import { PetPanel } from '../panels/PetPanel';
import SecretRealmPanel from '../panels/SecretRealmPanel';
import SpiritTreasurePanel from '../panels/SpiritTreasurePanel';
import RandomEventPopup from '../panels/RandomEventPopup';
import NPCWorldPanel from '../panels/NPCWorldPanel';
import NPCDetailPanel from '../panels/NPCDetailPanel';
import ExchangeShopPanel from '../panels/ExchangeShopPanel';
import WorldEventPanel from '../panels/WorldEventPanel';
import AnnouncementPanel from '../panels/AnnouncementPanel';
import { AdScenePanel, TianjiPanel } from '../panels/AdScenePanel';
import { CompetitionPanel, RankingPanel } from '../panels/CompetitionPanel';
import { SectPanel } from '../panels/SectPanel';
import { MasterDisciplePanel } from '../panels/MasterDisciplePanel';
import { RefineryPanel } from '../panels/RefineryPanel';
import { AlchemyPanel } from '../panels/AlchemyPanel';
import { STAT_NAMES } from '../../utils/gameUtils';

type Tab = 'cultivation' | 'battle' | 'shop' | 'inventory' | 'more' | 
           'character' | 'skill' | 'quest' | 'formation' | 'pet' | 'achievement' | 'talent' | 
           'settings' | 'secretRealm' | 'spiritTreasure' | 'npcWorld' | 'exchange' | 
           'announcement' | 'worldEvent' | 'story' | 'rankings' | 'competition' | 'tianji' |
           'sect' | 'masterDisciple' | 'refinery' | 'alchemy';

const StatusBar: React.FC<{
  label: string;
  current: number;
  max: number;
  percent: number;
  color: string;
}> = ({ label, current, max, percent, color }) => {
  return (
    <div className="p-1.5 rounded-lg bg-gray-50">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-700">{label}</span>
        <span className="text-xs font-bold text-gray-900">{current}/{max}</span>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>
    </div>
  );
};

interface GamePageProps {
  onSave: (slot: number) => void;
  onDeleteSave: (slot: number) => void;
  currentSaveSlot: number | null;
  onReturnToLaunch: () => void;
  saves: any[];
}

const GamePage: React.FC<GamePageProps> = ({ 
  onSave, 
  onDeleteSave, 
  currentSaveSlot, 
  onReturnToLaunch,
  saves 
}) => {
  const game = useGameStore();
  const [activeTab, setActiveTab] = useState<Tab>('cultivation');
  const [showAchievement, setShowAchievement] = useState<{ success: boolean; msg: string } | null>(null);
  const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null);
  const [actionResult, setActionResult] = useState<{ success: boolean; msg: string } | null>(null);
  const [showAdScene, setShowAdScene] = useState(false);
  const gameRef = useRef(game);
  gameRef.current = game;

  useEffect(() => {
    if (showAchievement) {
      const timer = setTimeout(() => {
        setShowAchievement(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showAchievement]);

  useEffect(() => {
    game.initRestCount();
  }, []);

  useEffect(() => {
    const timers = [
      setInterval(() => {
        const store = gameRef.current;
        const { newAchievements } = store.checkAchievements();
        if (newAchievements.length > 0) {
          setShowAchievement({ success: true, msg: `解锁成就: ${newAchievements.length}个` });
        }
      }, 60000),

      setInterval(() => {
        const store = gameRef.current;
        store.updateBuffs(60);
        if (store.stats.stamina < store.stats.staminaMax) {
          store.recoverStamina(3 + store.stats.realm);
        }
      }, 60000),

      setInterval(() => {
        const store = gameRef.current;
        const now = Date.now();
        const deltaTime = now - store.lastSimulatedTime;
        if (deltaTime > 30000) {
          store.simulateNPCs(deltaTime);
        }
      }, 30000),

      setInterval(() => {
        const store = gameRef.current;
        if (Math.random() < 0.1) {
          store.triggerRandomWorldEvent();
        }
      }, 60000),

      setInterval(() => {
        const store = gameRef.current;
        if (Math.random() < 0.3) {
          const type = Math.random() < 0.5 ? 'world' : 'milestone';
          const templates = type === 'world'
            ? [
                { title: '天降祥瑞', content: '天空中出现七彩祥云，修士们纷纷抬头观望...' },
                { title: '灵气潮汐', content: '天地灵气突然变得异常活跃，修炼效率提升！' },
                { title: '秘境开启', content: '某处秘境的大门缓缓打开，吸引了众多修士前往...' },
                { title: '灵兽异动', content: '深山中的灵兽群突然躁动不安...' },
                { title: '宗门盛典', content: '附近宗门正在举办庆典，欢迎各方修士参加...' },
              ]
            : [
                { title: '十年磨一剑', content: '某位修士苦修十年，终于突破瓶颈...' },
                { title: '新星崛起', content: '一位年轻的修士展现了惊人的天赋...' },
                { title: '传奇诞生', content: '修炼界又诞生了一位传奇人物...' },
                { title: '宝物现世', content: '传说中的灵宝在某地现世，引发轰动...' },
                { title: '天劫降临', content: '有修士渡劫，引得天地变色...' },
              ];
          const template = templates[Math.floor(Math.random() * templates.length)];
          store.addAnnouncement(type as any, template.title, template.content, type === 'world' ? 'medium' : 'high');
        }
      }, 300000),
    ];

    return () => timers.forEach(clearInterval);
  }, []);

  const getTimeDesc = () => {
    const hour = Math.floor(game.gameTime / 3600);
    if (hour >= 5 && hour < 7) return '破晓';
    if (hour >= 7 && hour < 11) return '上午';
    if (hour >= 11 && hour < 13) return '正午';
    if (hour >= 13 && hour < 17) return '下午';
    if (hour >= 17 && hour < 19) return '黄昏';
    return '深夜';
  };

  const getWeatherDesc = () => {
    const weatherMap: Record<string, string> = {
      sunny: '晴空万里',
      cloudy: '多云',
      rainy: '细雨绵绵',
      stormy: '雷电交加',
      snowy: '大雪纷飞',
      foggy: '迷雾重重',
    };
    return weatherMap[game.weather];
  };

  const getCultivationBonus = () => {
    const timeBonus = game.getTimeOfDay() === 'night' ? '×1.2' :
      game.getTimeOfDay() === 'morning' ? '×1.1' :
      game.getTimeOfDay() === 'noon' ? '×0.95' : '×1.0';
    return `${timeBonus}`;
  };

  const getBattleBonus = () => {
    const timeBonus = game.getTimeOfDay() === 'noon' ? '×1.1' :
      game.getTimeOfDay() === 'night' ? '×0.9' : '×1.0';
    return `${timeBonus}`;
  };

  const renderPanel = () => {
    if (selectedNPC) {
      return <NPCDetailPanel npc={selectedNPC} onBack={() => setSelectedNPC(null)} />;
    }

    switch (activeTab) {
      case 'cultivation': return <CultivationContent game={game} setActionResult={setActionResult} setShowAdScene={setShowAdScene} />;
      case 'battle': return <BattlePanel />;
      case 'shop': return <ShopWithExchangePanel onClose={() => setActiveTab('shop')} />;
      case 'inventory': return <InventoryPanel onClose={() => setActiveTab('inventory')} />;
      case 'more': return <MorePanel setActiveTab={setActiveTab} />;
      case 'character': return <CharacterPanel onClose={() => setActiveTab('more')} />;
      case 'skill': return <SkillPanel onClose={() => setActiveTab('more')} />;
      case 'quest': return <QuestPanel onClose={() => setActiveTab('more')} />;
      case 'formation': return <FormationPanel onClose={() => setActiveTab('more')} />;
      case 'pet': return <PetPanel onClose={() => setActiveTab('more')} />;
      case 'achievement': return <AchievementPanel onClose={() => setActiveTab('more')} />;
      case 'talent': return <TalentPanel onClose={() => setActiveTab('more')} />;
      case 'settings': return (
        <SettingsPanel
          onClose={() => setActiveTab('more')}
          onSave={onSave}
          onDeleteSave={onDeleteSave}
          currentSaveSlot={currentSaveSlot}
          onReturnToLaunch={onReturnToLaunch}
          saves={saves}
        />
      );
      case 'secretRealm': return <SecretRealmPanelWithBack onBack={() => setActiveTab('more')} />;
      case 'spiritTreasure': return <SpiritTreasurePanel onClose={() => setActiveTab('more')} />;
      case 'npcWorld': return <NPCWorldPanelWithBack onSelectNPC={(npc) => setSelectedNPC(npc)} onBack={() => setActiveTab('more')} />;
      case 'exchange': return <ExchangeShopPanel />;
      case 'announcement': return <AnnouncementPanel onClose={() => setActiveTab('more')} />;
      case 'worldEvent': return <WorldEventPanel onClose={() => setActiveTab('more')} />;
      case 'story': return <StoryPanel onClose={() => setActiveTab('more')} />;
      case 'rankings': return <RankingPanel onClose={() => setActiveTab('more')} />;
      case 'competition': return <CompetitionPanel onClose={() => setActiveTab('more')} />;
      case 'tianji': return <TianjiPanel onClose={() => setActiveTab('more')} />;
      case 'sect': return <SectPanel onClose={() => setActiveTab('more')} />;
      case 'masterDisciple': return <MasterDisciplePanel onClose={() => setActiveTab('more')} />;
      case 'refinery': return <RefineryPanel onClose={() => setActiveTab('more')} />;
      case 'alchemy': return <AlchemyPanel onClose={() => setActiveTab('more')} />;
      default: return <CultivationContent game={game} setActionResult={setActionResult} setShowAdScene={setShowAdScene} />;
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'cultivation', label: '修炼' },
    { id: 'battle', label: '战斗' },
    { id: 'shop', label: '商城' },
    { id: 'inventory', label: '背包' },
    { id: 'more', label: '更多' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 max-w-md mx-auto relative pb-24">
      {game.showBreakthrough && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 pointer-events-none">
          <div className="text-center animate-pulse">
            <div className="text-4xl font-bold text-yellow-400 mb-2">✨ 突破成功 ✨</div>
            <div className="text-white text-lg">恭喜突破境界！</div>
          </div>
        </div>
      )}
      
      {showAchievement && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-in">
          <div className="bg-black text-white px-4 py-3 rounded-lg shadow-lg">
            <div className="text-center font-bold">成就解锁</div>
            <div className="text-center text-sm opacity-90">{showAchievement.msg}</div>
          </div>
        </div>
      )}

      <RandomEventPopup />

      {game.enlightenment.active && game.enlightenment.currentEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl border border-gray-200 mx-4">
            <h2 className="text-xl font-bold text-center text-black mb-2">
              {game.enlightenment.currentEvent.title}
            </h2>
            <p className="text-gray-600 text-center text-sm mb-4">
              {game.enlightenment.currentEvent.description}
            </p>

            <div className="space-y-3">
              {game.enlightenment.currentEvent.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => {
                    const gains = game.selectEnlightenmentChoice(choice.id);
                    if (gains) {
                      const gainStr = Object.entries(gains)
                        .map(([k, v]) => `${STAT_NAMES[k] || k}:+${v}`)
                        .join(', ');
                      setActionResult({ success: true, msg: `顿悟成功！获得: ${gainStr}` });
                    }
                  }}
                  className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-left min-h-[44px]"
                >
                  <div className="font-bold text-black">{choice.text}</div>
                  <div className="text-xs text-gray-500 mt-1">{choice.description}</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => game.skipEnlightenment()}
              className="w-full mt-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 text-sm min-h-[44px]"
            >
              放弃顿悟
            </button>
          </div>
        </div>
      )}

      {showAdScene && <AdScenePanel onClose={() => setShowAdScene(false)} />}

      <div className="sticky top-0 bg-white border-b border-gray-200 px-3 pt-2 pb-1.5 z-10">
        <div className="flex justify-between items-center mb-1.5">
          <div className="text-base font-bold text-black truncate max-w-[50%]">{game.playerName}</div>
          <div className="text-xs font-bold bg-gray-100 px-2 py-0.5 rounded-full">{game.getRealmName()}</div>
        </div>

        <div className="grid grid-cols-3 gap-1.5 mb-1.5">
          <StatusBar
            label="气血"
            current={game.stats.hp}
            max={game.stats.hpMax}
            percent={(game.stats.hp / game.stats.hpMax) * 100}
            color="bg-red-500"
          />
          <StatusBar
            label="灵力"
            current={game.stats.spiritualPower}
            max={game.stats.spiritualPowerMax}
            percent={(game.stats.spiritualPower / game.stats.spiritualPowerMax) * 100}
            color="bg-blue-500"
          />
          <StatusBar
            label="体力"
            current={game.stats.stamina}
            max={game.stats.staminaMax}
            percent={(game.stats.stamina / game.stats.staminaMax) * 100}
            color="bg-green-500"
          />
        </div>

        <div className="flex justify-between text-xs text-gray-600">
          <span>灵石: {game.gold}</span>
          <span className="flex items-center gap-1">
            <span>☀️</span>
            {getTimeDesc()} | {getWeatherDesc()}
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-0.5">
          <span className="truncate max-w-[40%]">灵根: {game.lingen.name}</span>
          <span>修炼{getCultivationBonus()} | 战斗{getBattleBonus()}</span>
        </div>
      </div>

      <div className="px-3 pt-2">
        {renderPanel()}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto z-20">
        <div className="flex justify-around">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors min-w-[60px] ${
                activeTab === tab.id
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-base font-bold">{tab.label.charAt(0)}</span>
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

interface CultivationContentProps {
  game: ReturnType<typeof useGameStore.getState>;
  setActionResult: React.Dispatch<React.SetStateAction<{ success: boolean; msg: string } | null>>;
  setShowAdScene: React.Dispatch<React.SetStateAction<boolean>>;
}

const CultivationContent: React.FC<CultivationContentProps> = ({ game, setActionResult, setShowAdScene }) => {
  const [localActionResult, setLocalActionResult] = useState<{ success: boolean; msg: string } | null>(null);

  const handleCultivate = () => {
    if (game.stats.stamina < 5) {
      setLocalActionResult({ success: false, msg: '体力不足！需要5点体力' });
      return;
    }

    if (game.stats.cultivation >= 200 && !game.enlightenment.active && Math.random() < 0.08) {
      game.useStamina(5);
      game.advanceGameTime(300);
      game.triggerEnlightenment();
      return;
    }

    game.useStamina(5);
    const baseCultivation = Math.floor((game.stats.intelligence + game.stats.spiritualRoot) * 0.8);
    const bonus = game.getCultivationBonus();
    let cultivation = Math.floor(baseCultivation * bonus);
    
    const hasDoubleBonus = game.useDoubleCultivation();
    if (hasDoubleBonus) {
      cultivation *= 2;
    }
    
    game.gainCultivation(cultivation);
    game.advanceGameTime(300);
    game.triggerRandomEvent();
    setLocalActionResult({ success: true, msg: `修炼获得${cultivation}修为！${hasDoubleBonus ? '（双倍）' : ''}` });
    game.updateQuestProgress('cultivate', 1);
  };

  const handleRest = () => {
    if (game.stats.stamina >= game.stats.staminaMax) {
      setLocalActionResult({ success: false, msg: '体力已满，无需休息！' });
      return;
    }
    const restCheck = game.checkRestCount();
    if (!restCheck.canRest) {
      setLocalActionResult({ success: false, msg: '今日休息次数已用完！观看广告可获得3次额外休息机会。' });
      return;
    }
    if (game.useRest()) {
      game.recoverStamina(30);
      game.advanceGameTime(300);
      setLocalActionResult({ success: true, msg: `休息恢复30点体力！今日剩余${restCheck.remaining - 1}次休息机会。` });
    }
  };

  const handleBreakthrough = () => {
    const result = game.attemptBreakthrough();
    if (result.success) {
      game.triggerBreakthroughEffect();
    }
    setLocalActionResult(result);
  };

  const currentActionResult = localActionResult || null;

  return (
    <div className="space-y-3">
      {currentActionResult && (
        <div className={`p-3 rounded-xl border ${
          currentActionResult.success
            ? 'bg-green-50 border-green-300'
            : 'bg-red-50 border-red-300'
        }`}>
          <div className={`text-center font-bold text-sm ${
            currentActionResult.success ? 'text-green-700' : 'text-red-700'
          }`}>
            {currentActionResult.success ? '成功' : '失败'}
          </div>
          <div className="text-center text-xs mt-1 text-gray-700">{currentActionResult.msg}</div>
          <button
            onClick={() => setLocalActionResult(null)}
            className="w-full mt-2 text-xs text-gray-500 py-2 min-h-[36px]"
          >
            关闭
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-base font-bold text-center text-black mb-4">修炼室</h3>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-700">修为</span>
            <span className="text-sm font-bold text-black">{game.stats.cultivation} / {game.stats.cultivationNext}</span>
          </div>
          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-black rounded-full transition-all duration-500"
              style={{ width: `${(game.stats.cultivation / game.stats.cultivationNext) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-purple-700">道基</span>
            <span className={`text-xs font-bold ${
              game.stats.daoFoundation.quality === 'divine' ? 'text-rose-500' :
              game.stats.daoFoundation.quality === 'celestial' ? 'text-yellow-600' :
              game.stats.daoFoundation.quality === 'immortal' ? 'text-purple-600' :
              game.stats.daoFoundation.quality === 'spirit' ? 'text-blue-600' : 'text-gray-600'
            }`}>
              {game.stats.daoFoundation.description}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">突破成功概率</span>
            <span className="text-xs font-bold text-green-600">+{(game.stats.daoFoundation.bonusRate * 100).toFixed(0)}%</span>
          </div>
        </div>

        {game.stats.breakthroughBonusRate > 0 && (
          <div className="mb-3 p-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-yellow-700">丹药加成</span>
              <span className="text-xs font-bold text-orange-600">+{(game.stats.breakthroughBonusRate * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500">灵宝加成</span>
              <span className="text-xs font-bold text-cyan-600">+{(game.stats.spiritTreasureBonusRate * 100).toFixed(0)}%</span>
            </div>
          </div>
        )}

        {game.stats.spiritTreasureBonusRate > 0 && game.stats.breakthroughBonusRate === 0 && (
          <div className="mb-3 p-2 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-cyan-700">灵宝加成</span>
              <span className="text-xs font-bold text-cyan-600">+{(game.stats.spiritTreasureBonusRate * 100).toFixed(0)}%</span>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <button
            onClick={handleCultivate}
            className="w-full py-3 bg-gray-800 text-white rounded-lg font-bold min-h-[44px]"
          >
            打坐修炼 (-5体力) {game.adRewards?.doubleCultivation && '✨双倍'}
          </button>
          <button
            onClick={handleBreakthrough}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-bold min-h-[44px]"
          >
            尝试突破
            {(() => {
              const baseRate = getBreakthroughRate(game.stats.realm, game.stats.subLevel);
              const totalBonus = game.stats.daoFoundation.bonusRate + game.stats.breakthroughBonusRate + game.stats.spiritTreasureBonusRate;
              const totalRate = Math.min(baseRate + totalBonus, 0.95);
              return ` ${(totalRate * 100).toFixed(1)}%`;
            })()}
          </button>
          {game.inventory.some(i => i.id.startsWith('breakthrough_pill')) && (
            <div className="flex gap-2">
              {game.inventory.filter(i => i.id.startsWith('breakthrough_pill')).map(pill => (
                <button
                  key={pill.id}
                  onClick={() => {
                    const result = game.useBreakthroughPill(pill.id);
                    if (result.success) {
                      game.showToast(result.msg, 'success');
                    }
                  }}
                  className={`flex-1 py-2 text-xs rounded-lg font-bold ${
                    pill.id === 'breakthrough_pill_5' ? 'bg-rose-600 text-white' :
                    pill.id === 'breakthrough_pill_4' ? 'bg-purple-600 text-white' :
                    pill.id === 'breakthrough_pill_3' ? 'bg-yellow-600 text-white' :
                    pill.id === 'breakthrough_pill_2' ? 'bg-blue-600 text-white' :
                    'bg-gray-600 text-white'
                  }`}
                >
                  服用{pill.name} (x{pill.quantity})
                </button>
              ))}
            </div>
          )}
          <button
            onClick={handleRest}
            className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-bold min-h-[44px]"
          >
            休息恢复体力 (今日剩余{game.checkRestCount().remaining}次)
          </button>
          {game.checkRestCount().remaining <= 2 && (
            <button
              onClick={() => {
                if (game.rest.adBonusUsed < 3) {
                  setShowAdScene(true);
                } else {
                  game.showToast('今日广告休息次数已达上限！', 'error');
                }
              }}
              className="w-full py-3 bg-yellow-500 text-white rounded-lg font-bold min-h-[44px]"
            >
              观看广告 +3次休息 (今日可用{3 - game.rest.adBonusUsed}次)
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-base font-bold text-black mb-3">属性</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">攻击</span>
            <span className="text-sm font-bold text-black">{game.stats.attack}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">防御</span>
            <span className="text-sm font-bold text-black">{game.stats.defense}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">敏捷</span>
            <span className="text-sm font-bold text-black">{game.stats.agility}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">悟性</span>
            <span className="text-sm font-bold text-black">{game.stats.intelligence}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">运气</span>
            <span className="text-sm font-bold text-black">{game.stats.luck}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">体质</span>
            <span className={`text-sm font-bold ${game.physique.color}`}>{game.physique.name}</span>
          </div>
        </div>
        {game.background && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-base">{game.background.icon}</span>
              <span className="text-sm text-gray-700">出身: <span className="font-bold text-black">{game.background.name}</span></span>
            </div>
            {game.master && (
              <div className="text-sm text-gray-600 mt-1">师父: {game.master.name}</div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-base font-bold text-black mb-3">功法</h3>
        <div className="space-y-2">
          {game.skills.length > 0 ? (
            game.skills.map((skill, i) => (
              <div key={i} className="p-2 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-bold text-black">{skill.name}</span>
                    <span className="text-xs text-gray-500 ml-2">Lv.{skill.level}</span>
                  </div>
                  <span className="text-xs text-gray-600">消耗{skill.spiritualPowerCost}灵力 | 伤害{skill.damage}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">暂未学习功法</div>
          )}
        </div>
      </div>
    </div>
  );
};

const MorePanel: React.FC<{ setActiveTab: React.Dispatch<React.SetStateAction<Tab>> }> = ({ setActiveTab }) => {
  const game = useGameStore();
  
  const menuItems = [
    { id: 'tianji' as Tab, label: '天机阁', desc: '便利服务与福利' },
    { id: 'sect' as Tab, label: '势力', desc: '建立自己的势力' },
    { id: 'masterDisciple' as Tab, label: '师徒', desc: '拜师收徒传功法' },
    { id: 'refinery' as Tab, label: '炼器', desc: '打造神兵利器' },
    { id: 'alchemy' as Tab, label: '炼丹', desc: '炼制仙丹妙药' },
    { id: 'npcWorld' as Tab, label: '人脉', desc: '结交江湖豪杰' },
    { id: 'secretRealm' as Tab, label: '秘境', desc: '探索神秘之地' },
    { id: 'spiritTreasure' as Tab, label: '灵宝', desc: '收集稀世珍宝' },
    { id: 'pet' as Tab, label: '灵宠', desc: '坐骑与伙伴' },
    { id: 'formation' as Tab, label: '阵法', desc: '组合技能加成' },
    { id: 'talent' as Tab, label: '天赋', desc: '解锁特殊能力' },
    { id: 'achievement' as Tab, label: '成就', desc: '挑战与成就' },
    { id: 'story' as Tab, label: '剧情', desc: '故事与抉择' },
    { id: 'quest' as Tab, label: '任务', desc: '任务' },
    { id: 'announcement' as Tab, label: '公告', desc: '公告' },
    { id: 'worldEvent' as Tab, label: '世界', desc: '世界事件' },
    { id: 'character' as Tab, label: '角色', desc: '角色信息' },
    { id: 'skill' as Tab, label: '功法', desc: '修炼功法' },
    { id: 'competition' as Tab, label: '比武', desc: '参加修炼界大赛' },
    { id: 'rankings' as Tab, label: '榜单', desc: '修炼界排行榜' },
    { id: 'settings' as Tab, label: '设置', desc: '游戏设置' },
  ];

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="mb-3">
          <h3 className="text-base font-bold text-black">更多功能</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 text-left transition-colors min-h-[64px]"
            >
              <div className="font-bold text-black text-sm">{item.label}</div>
              <div className="text-xs text-gray-500">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="text-sm font-bold text-black mb-3">游戏统计</div>
        
        <div className="space-y-3">
          <div>
            <div className="text-xs font-bold text-gray-700 mb-2">基础信息</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>游戏时长: {Math.floor(game.playTime / 60)}分钟</div>
              <div>击杀总数: {Object.values(game.totalKills).reduce((a, b) => a + b, 0)}</div>
              <div>成就进度: {game.claimedAchievements.length}/{game.getTotalAchievements()}</div>
              <div>秘境石: {game.realmStones}</div>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-gray-700 mb-2">战斗统计</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>总战斗次数: {game.statsRecord?.totalBattles || 0}</div>
              <div>胜利次数: {game.statsRecord?.totalWins || 0}</div>
              <div>击杀怪物: {game.statsRecord?.totalMonstersKilled || 0}</div>
              <div>击杀Boss: {game.statsRecord?.totalBossesDefeated || 0}</div>
              <div>最高连胜: {game.statsRecord?.maxConsecutiveWins || 0}</div>
              <div>当前连胜: {game.statsRecord?.currentConsecutiveWins || 0}</div>
              <div>总伤害输出: {game.statsRecord?.totalDamageDealt || 0}</div>
              <div>总承受伤害: {game.statsRecord?.totalDamageTaken || 0}</div>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-gray-700 mb-2">修炼统计</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>修炼次数: {game.statsRecord?.totalCultivationSessions || 0}</div>
              <div>休息次数: {game.statsRecord?.totalRestSessions || 0}</div>
              <div>突破尝试: {game.statsRecord?.totalBreakthroughAttempts || 0}</div>
              <div>突破成功: {game.statsRecord?.totalBreakthroughSuccesses || 0}</div>
              <div>心魔战胜: {game.statsRecord?.totalDemonHeartVictories || 0}</div>
              <div>顿悟事件: {game.statsRecord?.totalEnlightenmentEvents || 0}</div>
              <div>历史最高修为: {game.statsRecord?.highestCultivation || 0}</div>
              <div>历史最高灵石: {game.statsRecord?.highestGold || 0}</div>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-gray-700 mb-2">势力与师徒</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>势力任务: {game.statsRecord?.totalSectTasksCompleted || 0}</div>
              <div>授业课程: {game.statsRecord?.totalLessonsCompleted || 0}</div>
            </div>
          </div>
          
          <div>
            <div className="text-xs font-bold text-gray-700 mb-2">探索与收集</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>秘境完成: {game.statsRecord?.totalSecretRealmsCompleted || 0}</div>
              <div>比武参与: {game.statsRecord?.totalCompetitionsParticipated || 0}</div>
              <div>比武获胜: {game.statsRecord?.totalCompetitionsWon || 0}</div>
              <div>物品使用: {game.statsRecord?.totalItemsUsed || 0}</div>
              <div>NPC交互: {game.statsRecord?.totalNPCInteractions || 0}</div>
              <div>收到礼物: {game.statsRecord?.totalGiftsReceived || 0}</div>
              <div>任务完成: {game.statsRecord?.totalQuestsCompleted || 0}</div>
              <div>成就解锁: {game.statsRecord?.totalAchievementsUnlocked || 0}</div>
              <div>灵宝获取: {game.statsRecord?.totalSpiritTreasuresAcquired || 0}</div>
              <div>灵宠获取: {game.statsRecord?.totalPetsAcquired || 0}</div>
              <div>灵宠战斗: {game.statsRecord?.totalPetBattles || 0}</div>
              <div>炼器次数: {game.statsRecord?.totalItemsRefined || 0}</div>
              <div>灵力消耗: {game.statsRecord?.totalSpiritualPowerUsed || 0}</div>
              <div>体力消耗: {game.statsRecord?.totalStaminaUsed || 0}</div>
              <div>材料获取: {game.statsRecord?.totalMaterialsGained || 0}</div>
              <div>装备获取: {game.statsRecord?.totalEquipmentsAcquired || 0}</div>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-gray-700 mb-2">炼丹统计</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>炼丹次数: {game.statsRecord?.totalAlchemySessions || 0}</div>
              <div>炼丹成功: {game.statsRecord?.totalAlchemySuccesses || 0}</div>
              <div>
                成功率: {
                  game.statsRecord?.totalAlchemySessions 
                    ? ((game.statsRecord.totalAlchemySuccesses / game.statsRecord.totalAlchemySessions) * 100).toFixed(1)
                    : '0'
                }%
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-gray-700 mb-2">累计获取</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>修为获取: {game.statsRecord?.totalCultivationGained || 0}</div>
              <div>灵石获取: {game.statsRecord?.totalGoldGained || 0}</div>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-gray-700 mb-2">成功率统计</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>
                战斗胜率: {
                  game.statsRecord?.totalBattles 
                    ? ((game.statsRecord.totalWins / game.statsRecord.totalBattles) * 100).toFixed(1)
                    : '0'
                }%
              </div>
              <div>
                突破成功率: {
                  game.statsRecord?.totalBreakthroughAttempts 
                    ? ((game.statsRecord.totalBreakthroughSuccesses / game.statsRecord.totalBreakthroughAttempts) * 100).toFixed(1)
                    : '0'
                }%
              </div>
              <div>
                炼器成功率: {
                  game.refinery && game.refinery.totalItemsCreated > 0
                    ? ((game.refinery.totalLegendaryItems / game.refinery.totalItemsCreated) * 100).toFixed(1)
                    : '0'
                }%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShopWithExchangePanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'shop' | 'exchange'>('shop');

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex-1 py-2 rounded-lg font-bold text-sm min-h-[44px] ${
            activeTab === 'shop' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          商店
        </button>
        <button
          onClick={() => setActiveTab('exchange')}
          className={`flex-1 py-2 rounded-lg font-bold text-sm min-h-[44px] ${
            activeTab === 'exchange' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          兑换
        </button>
      </div>

      {activeTab === 'shop' && <ShopPanel onClose={onClose} />}
      {activeTab === 'exchange' && <ExchangeShopPanel />}
    </div>
  );
};

const SecretRealmPanelWithBack: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ←
        </button>
        <h2 className="text-base font-bold text-black">秘境</h2>
      </div>
      <SecretRealmPanel />
    </div>
  );
};

const NPCWorldPanelWithBack: React.FC<{ onSelectNPC: (npc: NPC) => void; onBack: () => void }> = ({ onSelectNPC, onBack }) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ←
        </button>
        <h2 className="text-base font-bold text-black">人脉</h2>
      </div>
      <NPCWorldPanel onSelectNPC={onSelectNPC} />
    </div>
  );
};

const StoryPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const game = useGameStore();

  const getNextStoryNode = (storyId: string) => {
    const story = STORY_NODES.find(s => s.id === storyId);
    if (!story || !story.choices[0]?.nextNode) return null;
    return STORY_NODES.find(s => s.id === story.choices[0].nextNode);
  };

  const canAccessStory = (storyId: string) => {
    if (storyId === 'story_prologue') return true;
    const story = STORY_NODES.find(s => s.id === storyId);
    if (!story) return false;
    
    const prevStories = STORY_NODES.filter(s => 
      s.choices.some(c => c.nextNode === storyId)
    );
    return prevStories.length === 0 || prevStories.some(ps => game.completedStories.includes(ps.id));
  };

  const handleSelectChoice = (storyId: string, choiceIndex: number) => {
    const story = STORY_NODES.find(s => s.id === storyId);
    if (!story) return;
    
    game.setCurrentStoryNode(storyId);
    const result = game.selectStoryChoice(choiceIndex);
    if (result.success) {
      game.showToast(result.msg || '剧情推进！', 'success');
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 max-h-[70vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base font-bold text-black">剧情</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
      </div>

      <div className="space-y-3">
        {STORY_NODES.map((story, index) => {
          const isCompleted = game.completedStories.includes(story.id);
          const isAccessible = canAccessStory(story.id);
          const nextStory = getNextStoryNode(story.id);
          const hasNext = !!nextStory && !game.completedStories.includes(nextStory.id);
          
          return (
            <div 
              key={story.id} 
              className={`p-3 rounded-lg ${
                isCompleted ? 'bg-gray-100' : 
                isAccessible ? 'bg-gray-50' : 'bg-gray-50 opacity-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-0.5 bg-black text-white rounded">
                  {index + 1}
                </span>
                <div className="font-bold text-black">{story.title}</div>
                {isCompleted && <span className="text-green-600 text-xs">✓ 已完成</span>}
              </div>
              <div className="text-sm text-gray-600 mb-3">{story.content}</div>
              
              {!isCompleted && isAccessible && (
                <div className="space-y-2">
                  {story.choices.map((choice, choiceIndex) => (
                    <button
                      key={choiceIndex}
                      onClick={() => handleSelectChoice(story.id, choiceIndex)}
                      className="w-full py-2 bg-black text-white rounded-lg font-bold text-sm min-h-[44px] hover:bg-gray-800 transition-colors"
                    >
                      {choice.text}
                      {choice.rewards && Object.keys(choice.rewards).length > 0 && (
                        <span className="text-xs ml-2 opacity-80">
                          (奖励: {Object.entries(choice.rewards).map(([key, val]) => {
                            const keyNames: Record<string, string> = {
                              attack: '攻击', defense: '防御', cultivation: '修为', 
                              gold: '灵石', intelligence: '悟性', agility: '敏捷',
                              luck: '运气', spiritualRoot: '灵根'
                            };
                            return `${keyNames[key] || key}+${val}`;
                          }).join(', ')})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
              
              {!isCompleted && !isAccessible && (
                <div className="text-xs text-gray-500">完成前置剧情后解锁</div>
              )}
              
              {isCompleted && hasNext && !isAccessible && (
                <div className="text-xs text-gray-500">等待后续剧情...</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GamePage;
