/**
 * progressionSlice — progression systems: quests, achievements, breakthroughs, talents, formations, story
 */
import type { StateCreator } from 'zustand';
import type { FullStore } from './types';
import type { PlayerStats, StoryNode } from '../../data/types';
import { getRealmConfig, getRealmName, getBreakthroughRate, getRealmCoefficient } from '../../data/realmConfig';
import { FORMATIONS, TALENTS, BREAKTHROUGH_PILLS } from '../../data/itemData';
import { STORY_NODES } from '../../data/eventData';
import { SPIRIT_TREASURES } from '../../data/spiritTreasures';

const NUMERIC_STAT_KEYS: (keyof PlayerStats)[] = [
  'realm', 'subLevel', 'cultivation', 'cultivationNext',
  'hp', 'hpMax', 'spiritualPower', 'spiritualPowerMax',
  'attack', 'defense', 'agility', 'intelligence', 'luck',
  'spiritualRoot', 'stamina', 'staminaMax',
  'critRate', 'evasionRate', 'lifesteal',
  'attackBonus', 'defenseBonus',
  'tempAttackBonus', 'tempDefenseBonus', 'tempCritBonus',
  'breakthroughBonusRate', 'spiritTreasureBonusRate'
];

function applyStatModifier(current: PlayerStats, modifier: Partial<Record<keyof PlayerStats, number>>, isAdd: boolean): PlayerStats {
  const result = { ...current };
  for (const key of NUMERIC_STAT_KEYS) {
    const modValue = modifier[key];
    if (typeof modValue === 'number') {
      const currentVal = current[key];
      if (typeof currentVal === 'number') {
        (result as any)[key] = isAdd ? currentVal + modValue : currentVal - modValue;
      }
    }
  }
  return result;
}

export interface ProgressionSlice {
  // State
  totalKills: Record<string, number>;
  activeFormation: string | null;
  formationEndTime: number;
  formationCooldowns: Record<string, number>;
  hasActivatedFormation: boolean;
  talentPoints: number;
  unlockedTalents: string[];
  currentStoryNode: string | null;
  completedStories: string[];

  // Actions
  getRealmName: () => string;
  getRealmNameByIndex: (realmIndex: number) => string;
  getRealmCoefficient: () => number;
  attemptBreakthrough: () => { success: boolean; msg: string };
  unlockTalent: (talentId: string) => { success: boolean; msg: string };
  resetTalents: () => { success: boolean; msg: string };
  activateFormation: (formationId: string) => { success: boolean; msg: string };
  deactivateFormation: () => void;
  getActiveFormationBonus: () => Record<string, number>;
  getCurrentStory: () => StoryNode | null;
  setCurrentStoryNode: (nodeId: string) => void;
  selectStoryChoice: (choiceIndex: number) => { success: boolean; msg: string };
  getStoryProgress: () => { completed: number; total: number; percentage: number };
  getTotalAchievements: () => number;
}

export const createProgressionSlice: StateCreator<FullStore, [], [], ProgressionSlice> = (set, get) => ({
  // ---- Initial state ----
  totalKills: {},
  activeFormation: null,
  formationEndTime: 0,
  formationCooldowns: {},
  hasActivatedFormation: false,
  talentPoints: 3,
  unlockedTalents: [],
  currentStoryNode: 'story_prologue',
  completedStories: [],

  // ---- Actions ----
  getRealmName: function () {
    const s = get();
    return getRealmName(s.stats.realm, s.stats.subLevel);
  },

  getRealmNameByIndex: function (realmIndex: number) {
    const config = getRealmConfig(realmIndex);
    return config?.name || '未知境界';
  },

  getRealmCoefficient: function () {
    return getRealmCoefficient(get().stats.realm);
  },

  attemptBreakthrough: () => {
    const s = get();
    if (s.stats.cultivation < s.stats.cultivationNext) return { success: false, msg: '修为不足！' };
    
    const currentRealmConfig = getRealmConfig(s.stats.realm);
    if (!currentRealmConfig) return { success: false, msg: '境界配置错误！' };
    
    // 计算突破加成
    const daoFoundationBonus = s.stats.daoFoundation.bonusRate;
    const pillBonus = s.stats.breakthroughBonusRate;
    const spiritTreasureBonus = s.stats.spiritTreasureBonusRate;
    const totalBonus = daoFoundationBonus + pillBonus + spiritTreasureBonus;
    
    // 检查是否达到当前大境界的最高小层
    const maxSubLevel = currentRealmConfig.subLevels.length - 1;
    if (s.stats.subLevel < maxSubLevel) {
      // 小境界突破
      const baseRate = getBreakthroughRate(s.stats.realm, s.stats.subLevel);
      const successRate = Math.min(baseRate + totalBonus, 0.95);
      const roll = Math.random() * 100;
      const overflowCultivation = s.stats.cultivation - s.stats.cultivationNext;

      if (roll < successRate * 100) {
        const newSubLevel = s.stats.subLevel + 1;
        const newStats = currentRealmConfig.baseStats;
        
        // 保留外部加成（装备、天赋等）
        const oldIdx = s.stats.subLevel;
        const externalAttackBonus = s.stats.attack - currentRealmConfig.baseStats.attack[oldIdx] - (s.stats.tempAttackBonus || 0);
        const externalDefenseBonus = s.stats.defense - currentRealmConfig.baseStats.defense[oldIdx] - (s.stats.tempDefenseBonus || 0);
        const externalHpBonus = s.stats.hpMax - currentRealmConfig.baseStats.hpMax[oldIdx];
        const externalSpBonus = s.stats.spiritualPowerMax - currentRealmConfig.baseStats.spiritualPowerMax[oldIdx];

        set((st) => ({
          stats: {
            ...st.stats,
            subLevel: newSubLevel,
            cultivation: Math.floor(overflowCultivation * 0.9),
            cultivationNext: currentRealmConfig.cultivationRequirements[newSubLevel],
            hpMax: newStats.hpMax[newSubLevel] + Math.max(0, externalHpBonus),
            hp: newStats.hpMax[newSubLevel] + Math.max(0, externalHpBonus),
            spiritualPowerMax: newStats.spiritualPowerMax[newSubLevel] + Math.max(0, externalSpBonus),
            spiritualPower: newStats.spiritualPowerMax[newSubLevel] + Math.max(0, externalSpBonus),
            attack: newStats.attack[newSubLevel] + Math.max(0, externalAttackBonus),
            defense: newStats.defense[newSubLevel] + Math.max(0, externalDefenseBonus),
            breakthroughBonusRate: Math.max(0, st.stats.breakthroughBonusRate - st.stats.breakthroughBonusItems.length * 0.15),
            breakthroughBonusItems: [],
          },
        }));
        return { success: true, msg: `小境界突破成功！晋升至${getRealmName(s.stats.realm, newSubLevel)}！修为溢出90%已转化！` };
      } else {
        set((st) => ({
          stats: {
            ...st.stats,
            cultivation: Math.floor(st.stats.cultivation * 0.9),
            breakthroughBonusRate: Math.max(0, st.stats.breakthroughBonusRate - st.stats.breakthroughBonusItems.length * 0.15),
            breakthroughBonusItems: [],
          },
        }));
        return { success: false, msg: '小境界突破失败！修为损失10%...' };
      }
    } else {
      // 大境界突破
      if (s.stats.realm >= 9) return { success: false, msg: '已至仙境巅峰！' };

      const baseRate = getBreakthroughRate(s.stats.realm, s.stats.subLevel);
      const successRate = Math.min(baseRate + totalBonus, 0.95);
      const roll = Math.random() * 100;
      const overflowCultivation = s.stats.cultivation - s.stats.cultivationNext;

      if (roll < successRate * 100) {
        const newRealm = s.stats.realm + 1;
        const realmConfig = getRealmConfig(newRealm);
        if (!realmConfig) return { success: false, msg: '突破失败！' };

        const newStats = realmConfig.baseStats;
        const idx = 0;
        const oldRealmConfig = currentRealmConfig;
        const oldIdx = maxSubLevel;

        const externalAttackBonus = s.stats.attack - oldRealmConfig.baseStats.attack[oldIdx] - (s.stats.tempAttackBonus || 0);
        const externalDefenseBonus = s.stats.defense - oldRealmConfig.baseStats.defense[oldIdx] - (s.stats.tempDefenseBonus || 0);
        const externalHpBonus = s.stats.hpMax - oldRealmConfig.baseStats.hpMax[oldIdx];
        const externalSpBonus = s.stats.spiritualPowerMax - oldRealmConfig.baseStats.spiritualPowerMax[oldIdx];
        const oldStamina = s.stats.stamina;
        const oldStaminaMax = s.stats.staminaMax;

        set((st) => ({
          stats: {
            ...st.stats,
            realm: newRealm,
            subLevel: 0,
            cultivation: Math.floor(overflowCultivation * 0.7),
            cultivationNext: realmConfig.cultivationRequirements[0],
            hpMax: newStats.hpMax[idx] + Math.max(0, externalHpBonus),
            hp: newStats.hpMax[idx] + Math.max(0, externalHpBonus),
            spiritualPowerMax: newStats.spiritualPowerMax[idx] + Math.max(0, externalSpBonus),
            spiritualPower: newStats.spiritualPowerMax[idx] + Math.max(0, externalSpBonus),
            attack: newStats.attack[idx] + Math.max(0, externalAttackBonus),
            defense: newStats.defense[idx] + Math.max(0, externalDefenseBonus),
            staminaMax: newStats.staminaMax[idx],
            stamina: Math.floor(newStats.staminaMax[idx] * 0.5),
            breakthroughBonusRate: Math.max(0, st.stats.breakthroughBonusRate - st.stats.breakthroughBonusItems.length * 0.15),
            breakthroughBonusItems: [],
          },
        }));
        return { success: true, msg: `大境界突破成功！晋升至${getRealmName(newRealm, 0)}！修为溢出70%已转化！体力恢复50%！` };
      } else {
        set((st) => ({
          stats: {
            ...st.stats,
            cultivation: Math.floor(st.stats.cultivation * 0.75),
            subLevel: Math.max(0, st.stats.subLevel - 2),
            breakthroughBonusRate: Math.max(0, st.stats.breakthroughBonusRate - st.stats.breakthroughBonusItems.length * 0.15),
            breakthroughBonusItems: [],
          },
        }));
        return { success: false, msg: '大境界突破失败！修为损失25%，小境界倒退2层...' };
      }
    }
  },

  unlockTalent: (talentId: string) => {
    const s = get();
    const talent = TALENTS.find(t => t.id === talentId);
    if (!talent) return { success: false, msg: '天赋不存在！' };
    if (s.unlockedTalents.includes(talentId)) return { success: false, msg: '天赋已解锁！' };
    if (s.talentPoints < talent.cost) return { success: false, msg: '天赋点不足！' };
    const hasAllRequired = talent.requiredTalents.every(rt => s.unlockedTalents.includes(rt));
    if (!hasAllRequired) return { success: false, msg: '未满足前置天赋！' };

    let newStats = { ...s.stats };
    const statsToAdd: Partial<Record<keyof PlayerStats, number>> = {};
    for (const [key, value] of Object.entries(talent.effect)) {
      const statKey = key as keyof PlayerStats;
      if (NUMERIC_STAT_KEYS.includes(statKey) && typeof value === 'number') {
        statsToAdd[statKey] = value;
      }
    }
    newStats = applyStatModifier(newStats, statsToAdd, true);

    set((state) => ({
      talentPoints: state.talentPoints - talent.cost,
      unlockedTalents: [...state.unlockedTalents, talentId],
      stats: newStats,
    }));
    return { success: true, msg: `成功解锁天赋「${talent.name}」！` };
  },

  resetTalents: () => {
    const s = get();
    if (s.unlockedTalents.length === 0) return { success: false, msg: '暂无已解锁天赋！' };
    const refundPoints = s.unlockedTalents.reduce((sum, tid) => {
      const talent = TALENTS.find(t => t.id === tid);
      return sum + (talent?.cost || 0);
    }, 0);
    const resetCost = Math.max(100, s.gold < 1000 ? 50 : Math.floor(s.gold * 0.1));
    if (s.gold < resetCost) return { success: false, msg: `灵石不足！重置需要${resetCost}灵石` };

    let newStats = { ...s.stats };
    const statsToRemove: Partial<Record<keyof PlayerStats, number>> = {};
    for (const tid of s.unlockedTalents) {
      const talent = TALENTS.find(t => t.id === tid);
      if (talent) {
        for (const [key, value] of Object.entries(talent.effect)) {
          const statKey = key as keyof PlayerStats;
          if (NUMERIC_STAT_KEYS.includes(statKey) && typeof value === 'number') {
            statsToRemove[statKey] = (statsToRemove[statKey] || 0) + value;
          }
        }
      }
    }
    newStats = applyStatModifier(newStats, statsToRemove, false);

    set((state) => ({
      unlockedTalents: [],
      talentPoints: state.talentPoints + refundPoints,
      gold: state.gold - resetCost,
      stats: newStats,
    }));
    return { success: true, msg: `天赋重置成功！返还${refundPoints}天赋点，消耗${resetCost}灵石` };
  },

  activateFormation: (formationId: string) => {
    const s = get();
    const formation = FORMATIONS.find(f => f.id === formationId);
    if (!formation) return { success: false, msg: '阵法不存在！' };
    const now = Date.now();
    if (s.formationCooldowns[formationId] && s.formationCooldowns[formationId] > now) {
      const remaining = Math.ceil((s.formationCooldowns[formationId] - now) / 1000);
      return { success: false, msg: `阵法冷却中，剩余${remaining}秒` };
    }
    if (formation.requiredRealm && s.stats.realm < formation.requiredRealm) {
      const realms = ['煅体境', '玄脉境', '武心境', '灵现境', '凌虚境', '悟道境', '冠绝境', '绝圣境', '圣君境', '君帝境'];
      return { success: false, msg: `境界不足，需要${realms[formation.requiredRealm]}！` };
    }
    const hasAllSkills = formation.requiredSkills.every(skillId => s.skills.some(skill => skill.id === skillId));
    if (!hasAllSkills) return { success: false, msg: '缺少必要功法！' };
    if (!s.useSpiritualPower(formation.cost)) return { success: false, msg: '灵力不足！' };
    set({
      activeFormation: formationId,
      hasActivatedFormation: true,
      formationEndTime: now + formation.duration * 1000,
      formationCooldowns: { ...s.formationCooldowns, [formationId]: now + formation.cooldown * 1000 },
    });
    return { success: true, msg: `成功激活${formation.name}！` };
  },

  deactivateFormation: () => set({ activeFormation: null, formationEndTime: 0 }),

  getActiveFormationBonus: () => {
    const s = get();
    if (!s.activeFormation || Date.now() > s.formationEndTime) {
      if (s.activeFormation) set({ activeFormation: null, formationEndTime: 0 });
      return {};
    }
    const formation = FORMATIONS.find(f => f.id === s.activeFormation);
    return formation?.effect || {};
  },

  getCurrentStory: () => {
    const s = get();
    if (!s.currentStoryNode) return null;
    return STORY_NODES.find(n => n.id === s.currentStoryNode) || null;
  },

  setCurrentStoryNode: (nodeId: string) => set({ currentStoryNode: nodeId }),

  selectStoryChoice: (choiceIndex: number) => {
    const s = get();
    const story = STORY_NODES.find(n => n.id === s.currentStoryNode);
    if (!story || !story.choices[choiceIndex]) return { success: false, msg: '无效选择！' };
    const choice = story.choices[choiceIndex];
    set((state) => {
      let newGold = state.gold;
      let newCultivation = state.stats.cultivation;
      let newAttack = state.stats.attack;
      if (choice.rewards?.cultivation) newCultivation += choice.rewards.cultivation;
      if (choice.rewards?.attack) newAttack += choice.rewards.attack;
      if (choice.rewards?.gold) newGold += choice.rewards.gold;
      const newCurrentStoryNode = choice.nextNode ? choice.nextNode : null;
      const newCompletedStories = state.completedStories.includes(story.id)
        ? state.completedStories
        : [...state.completedStories, story.id];
      return {
        gold: newGold,
        stats: { ...state.stats, cultivation: newCultivation, attack: newAttack },
        currentStoryNode: newCurrentStoryNode,
        completedStories: newCompletedStories,
      };
    });
    return { success: true, msg: choice.consequence || '选择完成！' };
  },

  getStoryProgress: () => {
    const s = get();
    const total = STORY_NODES.length;
    const completed = s.completedStories.length;
    return { completed, total, percentage: Math.floor((completed / total) * 100) };
  },

  getTotalAchievements: () => {
    // Use a safe import since we can't import here
    return 30; // Estimate the number of achievements
  },
});
