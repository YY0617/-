import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { getRealmName } from '../../data/realmConfig';
import { STAT_NAMES } from '../../utils/gameUtils';
import { 
  SECTS_BY_BACKGROUND, 
  SECTS_BY_FORCE,
  SECT_TASKS, 
  SECT_TECHNOLOGIES, 
  INITIAL_MEMBERS, 
  INITIAL_RESOURCES,
  FAMILY_TASKS,
  CLAN_TASKS,
  getTasksForBackground as getTasksForBg,
  getSectTerms,
  type Sect,
  type SectTask
} from '../../data/sectData';

export const SectPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const game = useGameStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'tech' | 'members'>('overview');
  const [showInit, setShowInit] = useState(!game.sect);

  useEffect(() => {
    if (game.background && !game.sect) {
      setShowInit(true);
    }
  }, [game.background, game.sect]);

  const getTasksForBackground = (): SectTask[] => {
    if (!game.background) return SECT_TASKS;
    return getTasksForBg(game.background.id);
  };

  const bgId = game.background?.id || 'sect';
  const sectTerms = getSectTerms(bgId);

  const initSect = () => {
    if (!game.background) return;
    const bgId = game.background.id;
    
    let sectTemplate: Partial<Sect>;
    let sectName: string;
    let isPreExisting: boolean = false;
    
    if (bgId === 'sect' && game.force) {
      sectTemplate = SECTS_BY_FORCE[game.force.id] || SECTS_BY_BACKGROUND['sect'];
      sectName = sectTemplate.name || game.force.name;
      isPreExisting = true;
    } else {
      sectTemplate = SECTS_BY_BACKGROUND[bgId] || SECTS_BY_BACKGROUND['solo'];
      sectName = sectTemplate.name || '逍遥居';
    }
    
    const tasks = getTasksForBackground();
    
    const newSect: Sect = {
      id: `sect_${Date.now()}`,
      name: sectName,
      level: 1,
      prestige: 0,
      maxMembers: bgId === 'family' ? 20 : bgId === 'sect' ? 50 : 10,
      members: INITIAL_MEMBERS.map(m => ({ ...m, joinedAt: Date.now() })),
      resources: [...INITIAL_RESOURCES],
      tasks: tasks.filter(t => !t.prerequisites?.realm || game.stats.realm >= t.prerequisites.realm),
      technologies: bgId === 'master' ? SECT_TECHNOLOGIES.slice(0, 2) : SECT_TECHNOLOGIES.map(t => ({ ...t, level: 0 })),
      foundedAt: Date.now(),
      backgroundType: bgId,
      specialBonuses: sectTemplate.specialBonuses || {}
    };
    game.setSect(newSect);
    setShowInit(false);
    
    const msg = isPreExisting ? `成功加入${sectName}！` :
                bgId === 'family' ? `成功加入家族！` : 
                bgId === 'sect' ? `成功加入势力！` : 
                bgId === 'master' ? `师尊道统已建立！` : 
                `成功创立${sectName}！`;
    game.showToast(msg, 'success');
  };

  const canCreateSect = () => {
    return !game.background || ['solo'].includes(game.background.id);
  };

  const doTask = (task: SectTask) => {
    if (!game.sect) return;
    if (task.prerequisites?.realm && game.stats.realm < task.prerequisites.realm) {
      game.showToast('境界不足，无法完成此任务！', 'error');
      return;
    }
    let bonusMult = 1;
    if (task.backgroundBonus && game.background) {
      bonusMult = task.backgroundBonus[game.background.id] || 1;
    }
    const contribution = Math.floor(task.rewards.contribution * bonusMult);
    const goldReward = task.rewards.gold ? Math.floor(task.rewards.gold * bonusMult) : 0;
    game.setSect({
      ...game.sect,
      prestige: game.sect.prestige + 10,
      members: game.sect.members.map(m => m.id === 'player' ? { ...m, contribution: m.contribution + contribution } : m)
    });
    if (goldReward > 0) {
      game.gainGold(goldReward);
    }
    game.recordSectTaskCompleted();
    game.showToast(`完成任务${task.name}，获得${contribution}贡献${goldReward ? `、${goldReward}灵石` : ''}！`, 'success');
  };

  const upgradeTech = (techId: string) => {
    if (!game.sect) return;
    const tech = game.sect.technologies.find(t => t.id === techId);
    if (!tech || tech.level >= tech.maxLevel) return;

    const cost = tech.upgradeCost;
    const spiritStoneRes = game.sect.resources.find(r => r.type === 'spiritStone');
    const herbRes = game.sect.resources.find(r => r.type === 'herb');
    const oreRes = game.sect.resources.find(r => r.type === 'ore');

    if (!spiritStoneRes || !herbRes || !oreRes) {
      game.showToast('资源数据异常！', 'error');
      return;
    }

    if (spiritStoneRes.amount < cost.spiritStone) {
      game.showToast('灵石不足！', 'error');
      return;
    }
    if (herbRes.amount < cost.herb) {
      game.showToast('灵草不足！', 'error');
      return;
    }
    if (oreRes.amount < cost.ore) {
      game.showToast('矿石不足！', 'error');
      return;
    }

    game.setSect({
      ...game.sect,
      resources: game.sect.resources.map(r => {
        if (r.type === 'spiritStone') return { ...r, amount: r.amount - cost.spiritStone };
        if (r.type === 'herb') return { ...r, amount: r.amount - cost.herb };
        if (r.type === 'ore') return { ...r, amount: r.amount - cost.ore };
        return r;
      }),
      technologies: game.sect.technologies.map(t => 
        t.id === techId ? { ...t, level: t.level + 1 } : t
      )
    });
    game.showToast(`升级${tech.name}成功！`, 'success');
  };

  const getPanelTitle = () => {
    if (!game.background) return '势力';
    switch (game.background.id) {
      case 'family':
        return '家族';
      case 'sect':
        return '势力';
      case 'master':
        return '道统';
      default:
        return '势力';
    }
  };

  const getInitMessage = () => {
    if (!game.background) return '';
    switch (game.background.id) {
      case 'family':
        return '您出身于顶级世家，现在可以开始为家族效力了！';
      case 'sect':
        if (game.force) {
          return `您是${game.force.name}弟子，现在可以开始为势力效力了！`;
        }
        return '您是势力弟子，现在可以开始为势力效力了！';
      case 'master':
        return '师尊已传授您道统，现在可以开始弘扬师门！';
      default:
        return '根据您的出身，您现在可以创立自己的势力了！';
    }
  };

  const getInitButtonText = () => {
    if (!game.background) return '创立势力';
    switch (game.background.id) {
      case 'family':
        return '加入家族';
      case 'sect':
        return '效力势力';
      case 'master':
        return '弘扬道统';
      default:
        return '创立势力';
    }
  };

  if (showInit) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{getPanelTitle()}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">
            {game.background?.id === 'family' && '🏠'}
            {game.background?.id === 'sect' && '🏯'}
            {game.background?.id === 'master' && '🧙'}
            {game.background?.id === 'solo' && '🏰'}
          </div>
          <p className="mb-6 text-gray-600">{getInitMessage()}</p>
          <button 
            onClick={initSect} 
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold"
          >
            {getInitButtonText()}
          </button>
        </div>
      </div>
    );
  }

  if (!game.sect) return null;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">{game.sect.name}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
      </div>
      
      <div className="flex gap-2 mb-4 border-b pb-2">
        {(['overview', 'tasks', 'tech', 'members'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded text-sm ${activeTab === tab ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {{ overview: '总览', tasks: '任务', tech: '经营', members: '成员' }[tab]}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">等级</p>
              <p className="text-xl font-bold">{game.sect.level}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">声望</p>
              <p className="text-xl font-bold">{game.sect.prestige}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-bold mb-2">资源</h3>
            <div className="grid grid-cols-3 gap-2">
              {game.sect.resources.map(r => (
                <div key={r.type} className="text-center p-2 bg-white rounded">
                  <div className="text-sm text-gray-500">{r.name}</div>
                  <div className="font-bold">{r.amount}/{r.maxAmount}</div>
                </div>
              ))}
            </div>
          </div>

          {Object.keys(game.sect.specialBonuses).length > 0 && (
            <div className="bg-purple-50 p-4 rounded border border-purple-200">
              <h3 className="font-bold mb-2">出身特殊加成</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                {Object.entries(game.sect.specialBonuses).map(([k, v]) => {
                  const nameMap: Record<string, string> = {
                    'cultivationBonus': '修炼速度',
                    'luckBonus': '幸运值',
                    'taskRewardBonus': '任务奖励',
                    'attackBonus': '攻击力',
                    'defenseBonus': '防御力',
                    'goldBonus': '灵石获取',
                    'spiritRootBonus': '灵根效果',
                    'breakthroughBonus': '突破成功率',
                    'resourceBonus': '资源产量',
                    'wealthBonus': '财富获取',
                    'combatBonus': '战斗加成',
                    'masterGuideBonus': '师尊指引',
                    'freedomBonus': '自由探索',
                    'explorationBonus': '秘境收益'
                  };
                  return (
                    <li key={k}>• {nameMap[k] || STAT_NAMES[k] || k}: +{typeof v === 'number' ? v : v}%</li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-3">
          {getTasksForBackground().map(task => {
            const canDo = !task.prerequisites?.realm || game.stats.realm >= task.prerequisites.realm;
            return (
              <div key={task.id} className={`p-3 rounded border ${canDo ? 'bg-white border-gray-200' : 'bg-gray-100 border-gray-300 opacity-60'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{task.name}</h3>
                    <p className="text-sm text-gray-600">{task.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    task.difficulty <= 1 ? 'bg-green-100 text-green-700' : 
                    task.difficulty <=2 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {task.difficulty}星
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  奖励: 贡献+{task.rewards.contribution}{task.rewards.gold ? `、灵石+${task.rewards.gold}` : ''}
                </div>
                {task.prerequisites && (
                  <p className="text-xs text-orange-600 mt-1">需要: {getRealmName(task.prerequisites.realm || 0, 0)}</p>
                )}
                <button
                  onClick={() => doTask(task)}
                  disabled={!canDo}
                  className="mt-2 w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white text-sm rounded"
                >
                  {sectTerms.taskButton}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'tech' && (
        <div className="space-y-3">
          {game.sect.technologies.map(tech => (
            <div key={tech.id} className="p-3 bg-white rounded border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{tech.name}</h3>
                  <p className="text-sm text-gray-600">{tech.description}</p>
                </div>
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-sm font-bold">
                  Lv.{tech.level}/{tech.maxLevel}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
                {Object.entries(tech.effect).map(([k, v]) => {
                  const nameMap: Record<string, string> = {
                    'cultivation': '修炼速度',
                    'cultivationBonus': '修炼速度',
                    'attack': '攻击力',
                    'defense': '防御力',
                    'gold': '灵石获取',
                    'prestige': '声望获取',
                    'breakthrough': '突破成功率',
                    'luck': '幸运值',
                    'resource': '资源产量',
                    'resourceBonus': '资源产量',
                    'combatBonus': '战斗加成',
                    'discipleLimit': '成员上限'
                  };
                  return (
                    <div key={k}>+{Number(v) * (tech.level || 1)}% {nameMap[k] || STAT_NAMES[k] || k}</div>
                  );
                })}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                消耗: 灵石{tech.upgradeCost.spiritStone} | 灵草{tech.upgradeCost.herb} | 矿石{tech.upgradeCost.ore}
              </div>
              <button
                onClick={() => upgradeTech(tech.id)}
                disabled={tech.level >= tech.maxLevel}
                className="mt-2 w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white text-sm rounded"
              >
                {tech.level >= tech.maxLevel ? '已满级' : '升级'}
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'members' && (
        <div className="space-y-2">
          {game.sect.members.map(member => (
            <div key={member.id} className="p-3 bg-white rounded border border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                  {member.name[0]}
                </div>
                <div>
                  <p className="font-bold">{member.name}</p>
                  <p className="text-xs text-gray-500">
                    {sectTerms[member.role]}
                  </p>
                </div>
              </div>
              <div className="text-right text-sm">
                <div>境界: {getRealmName(member.realm, 0)}</div>
                <div className="text-gray-500">贡献: {member.contribution}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
