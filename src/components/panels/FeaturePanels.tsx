import React, { useState, useCallback } from 'react';
import { useGameStore } from '../../store/gameStore';
import { ACHIEVEMENTS } from '../../data/achievements';
import { QUESTS } from '../../data/questData';
import { TALENTS, FORMATIONS, SKILLS as SKILL_SHOP } from '../../data/itemData';
import { Modal } from '../common/UIComponents';
import { STAT_NAMES } from '../../utils/gameUtils';

export const FormationPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const game = useGameStore();
  const [activatingFormation, setActivatingFormation] = useState<string | null>(null);

  const getSkillName = (skillId: string) => {
    const skill = SKILL_SHOP.find(s => s.id === skillId);
    return skill ? skill.name : skillId;
  };
  
  const getRealmName = (realm: number) => {
    const realms = ['煅体境', '玄脉境', '武心境', '灵现境', '凌虚境', '悟道境', '冠绝境', '绝圣境', '圣君境', '君帝境'];
    return realms[realm] || '未知';
  };

  const handleActivate = useCallback((formationId: string) => {
    const result = game.activateFormation(formationId);
    if (result.success) {
      setActivatingFormation(null);
    } else {
      game.showToast(result.msg, 'error');
    }
  }, [game]);

  const handleDeactivate = useCallback(() => {
    game.deactivateFormation();
  }, [game]);

  const activeFormation = game.activeFormation 
    ? FORMATIONS.find(f => f.id === game.activeFormation) 
    : null;

  const isActive = activeFormation && Date.now() < game.formationEndTime;

  const canActivate = useCallback((formation: typeof FORMATIONS[number]) => {
    const hasSkills = formation.requiredSkills.every(skillId => 
      game.skills.some(skill => skill.id === skillId)
    );
    const hasRealm = !formation.requiredRealm || game.stats.realm >= formation.requiredRealm;
    const now = Date.now();
    const onCooldown = game.formationCooldowns[formation.id] && game.formationCooldowns[formation.id] > now;
    return hasSkills && hasRealm && !onCooldown;
  }, [game]);

  const getCooldownRemaining = useCallback((formationId: string) => {
    const endTime = game.formationCooldowns[formationId];
    if (!endTime || Date.now() >= endTime) return 0;
    return Math.ceil((endTime - Date.now()) / 1000);
  }, [game]);

  return (
    <div className="bg-white rounded p-3 max-h-[70vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-bold text-black py-2.5">阵法</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl min-h-[44px] min-w-[44px] flex items-center justify-center">&times;</button>
      </div>

      {activeFormation && (
        <div className={`p-3 rounded mb-2 border ${isActive ? 'border-black bg-gray-50' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="font-bold text-base text-black">{activeFormation.name}</div>
              <div className="text-sm text-gray-600">{activeFormation.description}</div>
            </div>
            {isActive && (
              <span className="px-2 py-1 bg-black text-white rounded text-xs">激活中</span>
            )}
          </div>
          
          {isActive && (
            <div className="text-sm text-gray-600 mb-3">
              剩余: {Math.ceil((game.formationEndTime - Date.now()) / 1000)}秒
            </div>
          )}
          
          {isActive && (
            <button
              onClick={handleDeactivate}
              className="w-full bg-black hover:bg-gray-800 text-white py-2 rounded min-h-[44px]"
            >
              解除阵法
            </button>
          )}
        </div>
      )}

      <div className="space-y-2">
        {FORMATIONS.map((formation, i) => {
          const cooldown = getCooldownRemaining(formation.id);
          const available = canActivate(formation);
          const hasSkills = formation.requiredSkills.every(skillId => 
            game.skills.some(skill => skill.id === skillId)
          );
          const hasRealm = !formation.requiredRealm || game.stats.realm >= formation.requiredRealm;

          return (
            <div key={i} className="p-3 bg-gray-50 rounded border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold text-black">{formation.name}</div>
                  <div className="text-xs text-gray-600">{formation.description}</div>
                </div>
                <span className="px-2 py-1 rounded text-xs border border-gray-300 bg-white text-black">
                  {formation.type === 'attack' ? '攻击' :
                   formation.type === 'defense' ? '防御' : '均衡'}
                </span>
              </div>

              <div className="text-xs text-gray-600 mb-2">
                效果: 
                {formation.effect.attackBonus && ` 攻击+${(formation.effect.attackBonus * 100).toFixed(0)}%`}
                {formation.effect.defenseBonus && ` 防御+${(formation.effect.defenseBonus * 100).toFixed(0)}%`}
                {formation.effect.critRateBonus && ` 暴击+${(formation.effect.critRateBonus * 100).toFixed(0)}%`}
                {formation.effect.hpRegen && ` 气血恢复+${formation.effect.hpRegen}/秒`}
                {formation.effect.spiritualPowerRegen && ` 灵力恢复+${formation.effect.spiritualPowerRegen}/秒`}
              </div>

              <div className="text-xs text-gray-600 mb-2">
                消耗: {formation.cost}灵力 | 时长: {formation.duration}秒 | 冷却: {formation.cooldown}秒
              </div>

              <div className="text-xs text-gray-600 mb-2">
                需求: 
                {formation.requiredRealm && ` 境界:${getRealmName(formation.requiredRealm)};`}
                {formation.requiredSkills.length > 0 && ` 功法:${formation.requiredSkills.map(getSkillName).join(', ')}`}
              </div>

              {!hasRealm && (
                <div className="text-xs text-red-500 mb-2">
                  境界不足: 需要{formation.requiredRealm && getRealmName(formation.requiredRealm)}
                </div>
              )}

              {!hasSkills && (
                <div className="text-xs text-red-500 mb-2">
                  缺少功法: {formation.requiredSkills.filter(id => !game.skills.find(s => s.id === id)).map(getSkillName).join(', ')}
                </div>
              )}

              {hasSkills && hasRealm && cooldown > 0 && (
                <div className="text-xs text-gray-500 mb-2">冷却中: {cooldown}秒</div>
              )}

              <button
                onClick={() => available && handleActivate(formation.id)}
                disabled={!available}
                className={`w-full py-2 rounded font-bold text-sm min-h-[44px] ${
                  available 
                    ? 'bg-black hover:bg-gray-800 text-white' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {available ? '激活阵法' : cooldown > 0 ? `冷却中 (${cooldown}秒)` : '无法激活'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const QuestPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const game = useGameStore();
  const [activeTab, setActiveTab] = useState<'all' | 'main' | 'side' | 'daily' | 'weekly' | 'timed' | 'branch' | 'faction'>('all');

  const handleClaim = useCallback((questId: string) => {
    const result = game.claimQuestReward(questId);
    if (result.success) {
      game.showToast(result.msg, 'success');
    } else {
      game.showToast(result.msg, 'error');
    }
  }, [game]);

  const getQuestCategoryLabel = (type: string) => {
    switch (type) {
      case 'main': return '主线';
      case 'side': return '支线';
      case 'daily': return '日常';
      case 'weekly': return '周常';
      case 'timed': return '限时';
      case 'branch': return '分支';
      case 'faction': return '势力';
      default: return '其他';
    }
  };

  const filteredQuests = activeTab === 'all' 
    ? game.quests 
    : game.quests.filter(q => q.type === activeTab);

  const availableQuests = filteredQuests.filter(q => {
    const meetsBackground = !q.requiredBackground || q.requiredBackground === game.background?.id;
    return meetsBackground;
  });
  const inProgress = availableQuests.filter(q => !q.isCompleted);
  const canClaim = availableQuests.filter(q => q.isCompleted && !q.isClaimed);
  const completed = availableQuests.filter(q => q.isClaimed);

  return (
    <div className="bg-white rounded p-3 max-h-[70vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-bold text-black py-2.5">任务</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl min-h-[44px] min-w-[44px] flex items-center justify-center">&times;</button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 mb-3 overflow-x-auto pb-1">
        {['all', 'main', 'side', 'daily', 'weekly', 'timed', 'branch', 'faction'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap min-h-[36px] ${
              activeTab === tab
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab === 'all' ? '全部' : getQuestCategoryLabel(tab)}
          </button>
        ))}
      </div>

      {/* Can Claim Section */}
      {canClaim.length > 0 && (
        <div className="mb-3">
          <div className="text-sm font-bold text-black mb-2">
            🎁 可领取奖励 ({canClaim.length})
          </div>
          {canClaim.map((quest, i) => (
            <div key={i} className="p-3 rounded mb-2 border border-black bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="font-bold text-black">{quest.name}</div>
                  <div className="text-xs text-gray-600">{quest.description}</div>
                </div>
                <span className="px-2 py-1 rounded text-xs border border-black bg-white text-black">
                  {getQuestCategoryLabel(quest.type)}
                </span>
              </div>
              <div className="text-xs text-gray-600 mb-2">
                奖励: {quest.rewards.gold}灵石 | {quest.rewards.cultivation}修为
                {quest.rewards.realmStones && ` | ${quest.rewards.realmStones}秘境石`}
                {quest.rewards.talentPoint && ` | ${quest.rewards.talentPoint}天赋点`}
              </div>
              <button
                onClick={() => handleClaim(quest.id)}
                className="w-full py-2 bg-black text-white rounded text-sm font-bold min-h-[44px]"
              >
                领取奖励
              </button>
            </div>
          ))}
        </div>
      )}

      {/* In Progress Section */}
      <div className="mb-3">
        <div className="text-sm font-bold text-black mb-2">
          进行中 ({inProgress.length})
        </div>
        {inProgress.map((quest, i) => {
          return (
            <div key={i} className="p-3 rounded mb-2 border border-gray-200 bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="font-bold text-black">{quest.name}</div>
                  <div className="text-xs text-gray-600">{quest.description}</div>
                </div>
                <span className="px-2 py-1 rounded text-xs border border-gray-300 bg-white text-black">
                  {getQuestCategoryLabel(quest.type)}
                </span>
              </div>

              <div className="mb-2">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
                  <div 
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${Math.min(100, (quest.current / quest.target) * 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 text-right">
                  {quest.current}/{quest.target}
                </div>
              </div>

              <div className="text-xs text-gray-600">
                奖励: {quest.rewards.gold}灵石 | {quest.rewards.cultivation}修为
                {quest.rewards.realmStones && ` | ${quest.rewards.realmStones}秘境石`}
                {quest.rewards.talentPoint && ` | ${quest.rewards.talentPoint}天赋点`}
              </div>
            </div>
          );
        })}
        {inProgress.length === 0 && (
          <div className="text-center text-gray-500 p-3">暂无进行中任务</div>
        )}
      </div>

      {/* Completed Section */}
      {completed.length > 0 && (
        <div>
          <div className="text-sm font-bold text-black mb-2">已完成 ({completed.length})</div>
          {completed.map((quest, i) => (
            <div key={i} className="p-2 bg-gray-100 rounded mb-1 border border-gray-200">
              <div className="text-sm text-gray-500 line-through">{quest.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const AchievementPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const game = useGameStore();

  const handleClaim = useCallback((achievementId: string) => {
    const result = game.claimAchievementReward(achievementId);
    if (result.success) {
      game.showToast(result.msg, 'success');
    } else {
      game.showToast(result.msg, 'error');
    }
  }, [game]);

  const totalAchievements = ACHIEVEMENTS.length;
  const unlockedCount = game.unlockedAchievements.length;
  const claimedCount = game.claimedAchievements.length;

  const canClaim = ACHIEVEMENTS.filter(ach => 
    game.unlockedAchievements.includes(ach.id) && 
    !game.claimedAchievements.includes(ach.id)
  );

  return (
    <div className="bg-white rounded p-3 max-h-[70vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-bold text-black py-2.5">成就</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl min-h-[44px] min-w-[44px] flex items-center justify-center">&times;</button>
      </div>

      {/* Progress Summary */}
      <div className="bg-gray-50 rounded p-3 mb-3 border border-gray-300">
        <div className="text-sm font-bold text-black mb-1">成就进度</div>
        <div className="text-base font-bold text-black">{unlockedCount}/{totalAchievements}</div>
        <div className="text-xs text-gray-600 mb-1">已解锁 {unlockedCount} | 已领取 {claimedCount}</div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-black h-2 rounded-full transition-all"
            style={{ width: `${(unlockedCount / totalAchievements) * 100}%` }}
          />
        </div>
      </div>

      {/* Can Claim Section */}
      {canClaim.length > 0 && (
        <div className="mb-3">
          <div className="text-sm font-bold text-black mb-2">
            🎁 可领取奖励 ({canClaim.length})
          </div>
          {canClaim.map((ach, i) => (
            <div key={i} className="p-3 rounded mb-2 border border-black bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="font-bold text-black">{ach.icon} {ach.name}</div>
                  <div className="text-xs text-gray-600">{ach.description}</div>
                </div>
              </div>
              <div className="text-xs text-gray-600 mb-2">
                奖励: {ach.reward.gold && `${ach.reward.gold}灵石`}
                {ach.reward.cultivation && ` | ${ach.reward.cultivation}修为`}
                {ach.reward.talentPoint && ` | ${ach.reward.talentPoint}天赋点`}
              </div>
              <button
                onClick={() => handleClaim(ach.id)}
                className="w-full py-2 bg-black text-white rounded text-sm font-bold min-h-[44px]"
              >
                领取奖励
              </button>
            </div>
          ))}
        </div>
      )}

      {/* All Achievements Grid */}
      <div>
        <div className="text-sm font-bold text-black mb-2">全部成就</div>
        <div className="grid grid-cols-2 gap-1.5">
          {ACHIEVEMENTS.map((ach, i) => {
            const unlocked = game.unlockedAchievements.includes(ach.id);
            const claimed = game.claimedAchievements.includes(ach.id);
            
            return (
              <div 
                key={i} 
                className={`p-3 rounded border ${
                  claimed ? 'bg-gray-100 border-gray-200' :
                  unlocked ? 'bg-gray-50 border-black' :
                  'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="text-xl text-center mb-1">{ach.icon}</div>
                <div className={`text-xs font-bold text-center text-black`}>
                  {ach.name}
                </div>
                <div className="text-xs text-gray-600 text-center mt-1">{ach.description}</div>
                {claimed && <div className="text-xs text-black text-center mt-1 font-bold">√ 已领取</div>}
                {unlocked && !claimed && <div className="text-xs text-black text-center mt-1">待领取</div>}
                {!unlocked && <div className="text-xs text-gray-500 text-center mt-1">未解锁</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const TalentPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const game = useGameStore();
  const [unlockingTalent, setUnlockingTalent] = useState<string | null>(null);

  const handleUnlock = useCallback((talentId: string) => {
    const result = game.unlockTalent(talentId);
    if (result.success) {
      setUnlockingTalent(null);
    } else {
      game.showToast(result.msg, 'error');
    }
  }, [game]);

  const handleReset = useCallback(() => {
    const result = game.resetTalents();
    if (!result.success) {
      game.showToast(result.msg, 'error');
    }
  }, [game]);

  const branches = ['attack', 'defense', 'support', 'special'] as const;
  const branchNames: Record<typeof branches[number], string> = { 
    attack: '攻击', 
    defense: '防御', 
    support: '辅助', 
    special: '特殊' 
  };

  const statNames: Record<string, string> = {
    attack: '攻击',
    defense: '防御',
    critRate: '暴击率',
    lifesteal: '吸血',
    agility: '敏捷',
    evasionRate: '闪避率',
    intelligence: '悟性',
    luck: '运气',
    spiritualRoot: '灵根',
    hpMax: '最大气血',
    spiritualPowerMax: '最大灵力',
    staminaMax: '最大体力',
  };

  const getTalentName = (talentId: string) => {
    const talent = TALENTS.find(t => t.id === talentId);
    return talent ? talent.name : talentId;
  };

  const formatEffectValue = (key: string, val: number) => {
    const statName = statNames[key] || STAT_NAMES[key] || key;
    if (key.includes('Rate')) {
      return `+${(val * 100).toFixed(0)}% ${statName}`;
    }
    return `+${val} ${statName}`;
  };

  return (
    <div className="bg-white rounded p-3 max-h-[70vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-bold text-black py-2.5">天赋</h2>
        <div className="flex items-center gap-2">
          <div className="text-black font-bold">剩余: {game.talentPoints}点</div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl min-h-[44px] min-w-[44px] flex items-center justify-center">&times;</button>
        </div>
      </div>

      {game.unlockedTalents.length > 0 && (
        <button
          onClick={handleReset}
          className="w-full mb-2 bg-gray-200 hover:bg-gray-300 text-black py-2 rounded text-sm font-bold min-h-[44px]"
        >
          重置天赋
        </button>
      )}

      {branches.map(branch => {
        const branchTalents = TALENTS.filter(t => t.branch === branch);
        return (
          <div key={branch} className="mb-2">
            <div className="text-sm font-bold text-black mb-2">
              {branchNames[branch]}
            </div>
            <div className="space-y-2">
              {branchTalents.map((talent, i) => {
                const unlocked = game.unlockedTalents.includes(talent.id);
                const available = !unlocked && 
                  game.talentPoints >= talent.cost &&
                  talent.requiredTalents.every(rt => game.unlockedTalents.includes(rt));
                const locked = !unlocked && !available;

                return (
                  <div 
                    key={i}
                    className={`p-3 rounded border ${
                      unlocked ? 'bg-gray-50 border-black' :
                      locked ? 'bg-gray-50 border-gray-200 opacity-50' :
                      'bg-white border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-bold text-black">{talent.name}</div>
                      <span className="px-2 py-1 bg-gray-200 text-black rounded text-xs font-bold">
                        {talent.cost}点
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">{talent.description}</div>
                    <div className="text-xs text-gray-600">
                      {Object.entries(talent.effect).map(([key, val]) => (
                        <span key={key} className="mr-2">{formatEffectValue(key, val)}</span>
                      ))}
                    </div>
                    {talent.requiredTalents.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        前置: {talent.requiredTalents.map(getTalentName).join(', ')}
                      </div>
                    )}
                    {unlocked && <div className="text-xs text-black mt-1 font-bold">√ 已解锁</div>}
                    {!unlocked && (
                      <button
                        onClick={() => available && handleUnlock(talent.id)}
                        disabled={!available}
                        className={`w-full mt-2 py-1 rounded text-sm font-bold min-h-[44px] ${
                          available 
                            ? 'bg-black text-white hover:bg-gray-800' 
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {locked ? '未解锁' : '解锁'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {unlockingTalent && (
        <Modal title="确认解锁天赋" onClose={() => setUnlockingTalent(null)}>
          <div className="text-center">
            <div className="text-base font-bold mb-2 text-black">{TALENTS.find(t => t.id === unlockingTalent)?.name}</div>
            <div className="text-sm text-gray-600 mb-2">消耗 {TALENTS.find(t => t.id === unlockingTalent)?.cost} 天赋点</div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setUnlockingTalent(null)} 
              className="flex-1 bg-gray-200 py-2 rounded min-h-[44px]"
            >
              取消
            </button>
            <button 
              onClick={() => handleUnlock(unlockingTalent)} 
              className="flex-1 bg-black text-white py-2 rounded min-h-[44px]"
            >
              解锁
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
