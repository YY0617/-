/**
 * Competition & Ranking Panels - 比赛和排行榜面板组件
 */
import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Modal } from '../common/UIComponents';
import { ALL_COMPETITIONS, getCompetitionLevelColor, getCompetitionLevelName, getCompetitionLevelName as getLevelName } from '../../config/competitionConfig';
import { RANKING_CONFIGS } from '../../config/rankingConfig';
import type { RankingType } from '../../config/rankingConfig';
import type { CompetitionConfig } from '../../config/competitionConfig';

function getRealmName(realm: number, subLevel: number): string {
  const realms = ['煅体', '玄脉', '武心', '灵现', '悟道', '冠绝', '绝圣', '圣君', '君帝'];
  const subLevels = ['初期', '中期', '后期', '圆满'];
  return (realms[realm] || '未知') + (subLevels[subLevel] || '');
}

function formatGameTime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) {
    return `${days}天${hours}时`;
  } else if (hours > 0) {
    return `${hours}时${minutes}分`;
  } else {
    return `${minutes}分`;
  }
}

/**
 * 比赛面板
 */
export const CompetitionPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const game = useGameStore();
  const [selectedTab, setSelectedTab] = useState<'available' | 'registered' | 'active'>('available');
  const [selectedCompetition, setSelectedCompetition] = useState<CompetitionConfig | null>(null);
  const [, forceUpdate] = useState(0);
  
  useEffect(() => {
    game.refreshAvailableCompetitions();
  }, []);
  
  // 定期刷新以更新倒计时
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedTab === 'available') {
        forceUpdate(n => n + 1);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [selectedTab]);
  
  const handleRegister = (competition: CompetitionConfig) => {
    const result = game.registerForCompetition(competition.id);
    if (result.success) {
      game.showToast(`成功报名${competition.name}！`, 'success');
      game.refreshAvailableCompetitions();
    } else {
      game.showToast(result.reason || '报名失败', 'error');
    }
  };
  
  const handleStart = (competition: CompetitionConfig) => {
    const success = game.startCompetition(competition.id);
    if (success) {
      setSelectedCompetition(competition);
      setSelectedTab('active');
    }
  };
  
  const handleMatch = () => {
    const result = game.simulateCompetitionMatch();
    if (result.won && result.reward) {
      const opponentName = result.opponent?.name || '对手';
      game.showToast(`战胜${opponentName}！获得灵石${result.reward.gold}，修为${result.reward.cultivation}`, 'success');
    } else if (!result.won) {
      const opponentName = result.opponent?.name || '对手';
      game.showToast(`被${opponentName}击败！`, 'error');
    }
    
    // 检查是否完成
    const progress = game.competitionProgress;
    if (progress && progress.currentRound > progress.maxRounds) {
      game.completeCompetition();
      game.updateQuestProgress('participate_competition', 1);
      setSelectedCompetition(null);
      game.showToast('比赛结束！', 'info');
    }
  };
  
  return (
    <div className="bg-white rounded p-4 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-black">比武大会</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
      </div>
      
      {/* 标签页 */}
      <div className="flex gap-2 mb-4">
        {(['available', 'registered', 'active'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded font-bold text-sm ${
              selectedTab === tab ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {tab === 'available' ? '可报名' : tab === 'registered' ? '已报名' : '进行中'}
          </button>
        ))}
      </div>
      
      {/* 可报名比赛列表 */}
      {selectedTab === 'available' && (
        <div className="space-y-3">
          {game.availableCompetitions.length === 0 ? (
            <div className="text-center text-gray-500 py-8">暂无可报名的比赛</div>
          ) : (
            game.availableCompetitions.map(comp => (
              <CompetitionCard
                key={comp.id}
                competition={comp}
                onRegister={() => handleRegister(comp)}
                onStart={() => handleStart(comp)}
              />
            ))
          )}
        </div>
      )}
      
      {/* 已报名比赛列表 */}
      {selectedTab === 'registered' && (
        <div className="space-y-3">
          {game.registeredCompetitions.length === 0 ? (
            <div className="text-center text-gray-500 py-8">暂无已报名的比赛</div>
          ) : (
            game.registeredCompetitions.map(compId => {
              const comp = ALL_COMPETITIONS.find(c => c.id === compId);
              if (!comp) return null;
              return (
                <div key={compId} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-black">{comp.icon} {comp.name}</div>
                      <div className="text-sm text-gray-600">{comp.description}</div>
                    </div>
                    <button
                      onClick={() => handleStart(comp)}
                      className="px-4 py-2 bg-green-600 text-white rounded font-bold"
                    >
                      开始比赛
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
      
      {/* 进行中比赛 */}
      {selectedTab === 'active' && selectedCompetition && game.competitionProgress && (
        <div className="p-4 bg-gradient-to-b from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-300">
          <div className="text-center mb-4">
            <div className="text-3xl mb-2">{selectedCompetition.icon}</div>
            <div className="text-xl font-bold text-black">{selectedCompetition.name}</div>
            <div className="text-gray-600">
              第 {game.competitionProgress.currentRound} / {game.competitionProgress.maxRounds} 轮
            </div>
          </div>
          
          {/* 对手信息 */}
          {game.currentOpponent && (
            <div className="mb-4 p-3 bg-white rounded-lg border">
              <div className="text-center mb-2">
                <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                  game.currentOpponent.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  game.currentOpponent.difficulty === 'normal' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {game.currentOpponent.difficulty === 'easy' ? '简单' :
                   game.currentOpponent.difficulty === 'normal' ? '普通' : '困难'}
                </span>
              </div>
              <div className="text-center font-bold text-lg text-black mb-1">
                {game.currentOpponent.title} {game.currentOpponent.name}
              </div>
              <div className="text-center text-sm text-gray-600 mb-2">
                {getRealmName(game.currentOpponent.realm, game.currentOpponent.subLevel)}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-gray-600">战力</div>
                  <div className="font-bold text-purple-600">{game.currentOpponent.combatPower}</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-gray-600">攻击</div>
                  <div className="font-bold text-red-600">{game.currentOpponent.stats.attack}</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-gray-600">防御</div>
                  <div className="font-bold text-blue-600">{game.currentOpponent.stats.defense}</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-gray-600">生命</div>
                  <div className="font-bold text-green-600">{game.currentOpponent.stats.hpMax}</div>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-white rounded">
              <div className="text-2xl font-bold text-green-600">{game.competitionProgress.wins}</div>
              <div className="text-sm text-gray-600">胜利场次</div>
            </div>
            <div className="text-center p-3 bg-white rounded">
              <div className="text-2xl font-bold text-red-600">{game.competitionProgress.losses}</div>
              <div className="text-sm text-gray-600">失败场次</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={handleMatch}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-bold text-lg"
            >
              {game.currentOpponent ? `挑战 ${game.currentOpponent.name}` : '进行比赛'}
            </button>
            <button
              onClick={() => {
                game.withdrawFromCompetition();
                setSelectedCompetition(null);
              }}
              className="w-full py-2 bg-gray-200 text-gray-600 rounded font-bold"
            >
              退出比赛
            </button>
          </div>
        </div>
      )}
      
      {selectedTab === 'active' && !selectedCompetition && (
        <div className="text-center text-gray-500 py-8">当前没有进行中的比赛</div>
      )}
    </div>
  );
};

/**
 * 比赛卡片组件
 */
const CompetitionCard: React.FC<{
  competition: CompetitionConfig;
  onRegister: () => void;
  onStart: () => void;
}> = ({ competition, onRegister, onStart }) => {
  const game = useGameStore();
  const status = game.getCompetitionStatus(competition.id);
  const nextAvailable = game.getNextAvailableTime(competition.id);
  const gameTime = game.gameTime || 0;
  
  const getFrequencyText = (frequency: string): string => {
    switch (frequency) {
      case 'daily': return '每日';
      case 'weekly': return '每周';
      case 'monthly': return '每月';
      default: return '限时';
    }
  };
  
  const isAvailable = status === 'available';
  const isComingSoon = status === 'coming_soon';
  const isRegistered = status === 'registered';
  
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{competition.icon}</span>
          <div>
            <div className="font-bold text-black">{competition.name}</div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-xs px-2 py-1 rounded-full ${
            isAvailable ? 'bg-green-100 text-green-700' : 
            isComingSoon ? 'bg-yellow-100 text-yellow-700' : 
            'bg-blue-100 text-blue-700'
          }`}>
            {isAvailable ? '可报名' : isComingSoon ? '即将开始' : '已报名'}
          </div>
          {isComingSoon && nextAvailable && (
            <div className="text-xs text-gray-500 mt-1">
              剩余: {formatGameTime(nextAvailable - gameTime)}
            </div>
          )}
        </div>
      </div>
      
      <div className="text-sm text-gray-600 mb-3">{competition.description}</div>
      
      <div className="flex justify-between items-center text-sm mb-3">
        <div className="text-gray-500">
          赛制: {competition.format.type === 'single_elimination' ? '单败淘汰' : 
                  competition.format.type === 'double_elimination' ? '双败淘汰' :
                  competition.format.type === 'round_robin' ? '循环赛' : '瑞士制'}
        </div>
        <div className="text-gray-500">
          周期: {getFrequencyText(competition.schedule.frequency)}
        </div>
      </div>
      
      <div className="text-xs text-gray-400 mb-3">
        需 {competition.requirements.minRealm ? `境界${getRealmName(competition.requirements.minRealm, 0)}以上` : '无境界要求'}
      </div>
      
      {isAvailable && (
        <div className="flex gap-2">
          <button
            onClick={onRegister}
            className="flex-1 py-2 bg-blue-600 text-white rounded font-bold text-sm"
          >
            报名（消耗{(competition.rewards.participation.gold * 0.5).toFixed(0)}灵石）
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * 排行榜面板
 */
export const RankingPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const game = useGameStore();
  const [selectedType, setSelectedType] = useState<RankingType>('combat');
  
  useEffect(() => {
    game.refreshRankings();
  }, []);
  
  const rankings = game.rankings[selectedType] || [];
  const config = RANKING_CONFIGS.find(c => c.type === selectedType);
  const playerRank = rankings.find(r => r.isPlayer);
  
  return (
    <div className="bg-white rounded p-4 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-black">修炼界榜单</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
      </div>
      
      {/* 排行榜类型选择 - 自动换行 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {RANKING_CONFIGS.map(cfg => (
          <button
            key={cfg.type}
            onClick={() => setSelectedType(cfg.type)}
            className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
              selectedType === cfg.type 
                ? 'bg-black text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cfg.name}
          </button>
        ))}
      </div>
      
      {/* 玩家排名提示 */}
      {playerRank && (
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">你的排名</div>
            <div className="text-xl font-bold text-blue-600">
              第 {playerRank.rank} 名
              {playerRank.change > 0 && <span className="text-green-500 text-sm ml-1">↑{playerRank.change}</span>}
              {playerRank.change < 0 && <span className="text-red-500 text-sm ml-1">↓{Math.abs(playerRank.change)}</span>}
            </div>
          </div>
        </div>
      )}
      
      {/* 排行榜列表 */}
      <div className="space-y-2">
        {rankings.slice(0, 30).map((entry, index) => (
          <div
            key={entry.npcId || entry.name}
            className={`flex items-center p-3 rounded-lg ${
              entry.isPlayer 
                ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300' 
                : index < 3 
                  ? 'bg-gray-50' 
                  : 'bg-white border border-gray-100'
            }`}
          >
            {/* 排名 - 前三名数字+颜色 */}
            <div className={`w-10 h-10 flex items-center justify-center rounded-full mr-3 font-bold text-lg ${
              entry.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
              entry.rank === 2 ? 'bg-gray-300 text-gray-700' :
              entry.rank === 3 ? 'bg-amber-600 text-white' :
              'bg-gray-100 text-gray-600'
            }`}>
              {entry.rank}
            </div>
            
            {/* 角色信息 */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`font-bold ${entry.isPlayer ? 'text-orange-600' : 'text-gray-800'}`}>
                  {entry.name}
                </span>
                {entry.title && (
                  <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                    {entry.title}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500">{entry.realmName}</div>
            </div>
            
            {/* 数值 */}
            <div className="text-right">
              <div className="font-bold text-gray-800">
                {config?.unit === '灵石' ? (entry.value / 10000).toFixed(1) + 'W' : 
                 config?.unit === '修为' ? (entry.value / 10000).toFixed(1) + 'W' :
                 entry.value.toLocaleString()}
              </div>
              {entry.change !== 0 && (
                <div className={`text-xs ${entry.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {entry.change > 0 ? '↑' : '↓'} {Math.abs(entry.change)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* 刷新按钮 */}
      <button
        onClick={() => {
          game.refreshRankings();
          game.showToast('排行榜已刷新', 'info');
        }}
        className="w-full mt-4 py-2 bg-gray-100 text-gray-600 rounded font-bold"
      >
        刷新排行榜
      </button>
    </div>
  );
};

export default { CompetitionPanel, RankingPanel };
