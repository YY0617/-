/**
 * Battle Config - 战斗系统配置
 * 所有战斗相关公式和参数配置
 */

/**
 * 战斗基础配置
 */
export const BATTLE_CONFIG = {
  // 回合限制
  maxRounds: 50,
  
  // 伤害计算公式系数
  damageFormula: {
    baseMultiplier: 1.0,
    attackWeight: 1.5,
    defenseWeight: 1.2,
    critMultiplier: 0.5,
    elementAdvantageMultiplier: 0.3,
    elementDisadvantageMultiplier: -0.2,
  },
  
  // 暴击配置
  crit: {
    baseChance: 0.05,
    critDamageBonus: 0.5,  // 暴击伤害增加50%
    critDamageCap: 5.0,     // 暴击伤害上限5倍
  },
  
  // 闪避配置
  evasion: {
    baseChance: 0.0,
    agilityWeight: 0.005,   // 每点敏捷增加0.5%闪避
    evasionCap: 0.75,       // 闪避上限75%
  },
  
  // 吸血配置
  lifesteal: {
    baseRate: 0.0,
    lifestealCap: 0.5,      // 吸血上限50%
  },
  
  // 属性相克
  elementAdvantage: {
    fire: { weak: 'ice', strong: 'wind' },
    ice: { weak: 'fire', strong: 'thunder' },
    thunder: { weak: 'wind', strong: 'ice' },
    wind: { weak: 'thunder', strong: 'fire' },
    shadow: { weak: 'light', strong: 'neutral' },
    light: { weak: 'shadow', strong: 'neutral' },
    neutral: { weak: 'none', strong: 'none' },
  },
  
  // 出手顺序
  turnOrder: {
    baseAgilityWeight: 1.0,
    randomWeight: 0.1,       // 随机因素10%
  },
  
  // 逃跑配置
  escape: {
    baseChance: 0.3,
    levelDiffPenalty: 0.05,  // 每高一阶降低5%逃跑成功率
    minChance: 0.1,          // 最低10%
  },
};

/**
 * 战斗结果枚举
 */
export type BattleResult = 'victory' | 'defeat' | 'escape' | 'draw';

/**
 * 战斗伤害类型
 */
export type DamageType = 'normal' | 'crit' | 'miss' | 'element' | 'absorbed';

/**
 * 战斗记录
 */
export interface BattleLog {
  round: number;
  attacker: string;
  defender: string;
  damage: number;
  damageType: DamageType;
  isPlayer: boolean;
}

/**
 * 战斗结果
 */
export interface BattleOutcome {
  result: BattleResult;
  playerHpLoss: number;
  enemyHpLoss: number;
  rewards: {
    gold: number;
    cultivation: number;
    exp: number;
  };
  battleLog: BattleLog[];
}

/**
 * 伤害计算
 */
export function calculateDamage(
  attackerStats: { attack: number; critRate: number; element?: string },
  defenderStats: { defense: number; evasionRate?: number; element?: string },
  element?: string
): { damage: number; isCrit: boolean; isMiss: boolean; elementEffect: number } {
  // 先计算闪避
  const totalEvasion = (defenderStats.evasionRate || 0) + 
                       (defenderStats.evasionRate || 0) * BATTLE_CONFIG.evasion.agilityWeight;
  if (Math.random() < Math.min(totalEvasion, BATTLE_CONFIG.evasion.evasionCap)) {
    return { damage: 0, isCrit: false, isMiss: true, elementEffect: 0 };
  }
  
  // 计算暴击
  const isCrit = Math.random() < attackerStats.critRate;
  
  // 基础伤害
  let damage = attackerStats.attack * BATTLE_CONFIG.damageFormula.attackWeight;
  
  // 暴击加成
  if (isCrit) {
    damage *= (1 + BATTLE_CONFIG.crit.critDamageBonus);
  }
  
  // 防御减伤
  const defenseReduction = defenderStats.defense * BATTLE_CONFIG.damageFormula.defenseWeight;
  damage = Math.max(1, damage - defenseReduction);
  
  // 属性相克
  let elementEffect = 0;
  if (element && attackerStats.element && defenderStats.element) {
    const advantage = BATTLE_CONFIG.elementAdvantage[attackerStats.element as keyof typeof BATTLE_CONFIG.elementAdvantage];
    if (advantage) {
      if (advantage.weak === defenderStats.element) {
        elementEffect = BATTLE_CONFIG.damageFormula.elementAdvantageMultiplier;
        damage *= (1 + elementEffect);
      } else if (advantage.strong === defenderStats.element) {
        elementEffect = BATTLE_CONFIG.damageFormula.elementDisadvantageMultiplier;
        damage *= (1 + elementEffect);
      }
    }
  }
  
  return {
    damage: Math.floor(damage),
    isCrit,
    isMiss: false,
    elementEffect,
  };
}

/**
 * 计算逃跑成功率
 */
export function calculateEscapeChance(
  playerAgility: number,
  enemyAgility: number,
  playerRealm: number,
  enemyRealm: number
): number {
  const baseChance = BATTLE_CONFIG.escape.baseChance;
  const agilityBonus = (playerAgility - enemyAgility) * 0.01;
  const levelPenalty = (enemyRealm - playerRealm) * BATTLE_CONFIG.escape.levelDiffPenalty;
  
  return Math.max(BATTLE_CONFIG.escape.minChance, baseChance + agilityBonus - levelPenalty);
}

/**
 * 计算战斗奖励
 */
export function calculateBattleRewards(
  enemyLevel: number,
  enemyRealm: number,
  playerRealm: number,
  playerLevel: number
): { gold: number; cultivation: number; exp: number } {
  const levelDiff = Math.max(1, enemyLevel - playerLevel);
  const realmDiff = Math.max(0, enemyRealm - playerRealm);
  
  // 基础奖励
  const baseGold = 10 + enemyLevel * 5;
  const baseCultivation = 20 + enemyLevel * 10;
  const baseExp = 15 + enemyLevel * 8;
  
  // 等级差加成（越级击杀奖励更高）
  const levelBonus = 1 + levelDiff * 0.2;
  const realmBonus = 1 + realmDiff * 0.5;
  
  return {
    gold: Math.floor(baseGold * levelBonus * realmBonus),
    cultivation: Math.floor(baseCultivation * levelBonus * realmBonus),
    exp: Math.floor(baseExp * levelBonus * realmBonus),
  };
}

/**
 * AI战斗决策
 */
export type AIAction = 'attack' | 'skill' | 'defend' | 'escape' | 'use_item';

export function getAIDecision(
  aiStats: { hp: number; hpMax: number; stamina: number; hasSkills: boolean },
  playerThreat: number
): AIAction {
  const hpPercent = aiStats.hp / aiStats.hpMax;
  
  // 血量低时考虑逃跑
  if (hpPercent < 0.2 && Math.random() < 0.4) {
    return 'escape';
  }
  
  // 血量低时考虑防御
  if (hpPercent < 0.3) {
    if (Math.random() < 0.3) return 'defend';
  }
  
  // 有技能且血量健康时可能使用技能
  if (aiStats.hasSkills && hpPercent > 0.5 && Math.random() < 0.2) {
    return 'skill';
  }
  
  // 默认攻击
  return 'attack';
}
