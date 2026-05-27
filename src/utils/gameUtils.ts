/**
 * Game Utilities - 游戏公共工具函数
 * 包含：随机、属性计算、公式配置等
 */
import type { PlayerStats } from '../data/types';

// ============================================================
// 随机函数
// ============================================================

/**
 * 等概率随机抽取
 */
export function randomPick<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * 等概率随机抽取索引
 */
export function randomPickIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

/**
 * 权重随机抽取（根据权重值，越大越容易抽到）
 */
export function weightedRandomPick<T extends { weight: number }>(array: T[]): T {
  const totalWeight = array.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  for (const item of array) {
    random -= item.weight;
    if (random <= 0) return item;
  }
  return array[array.length - 1];
}

/**
 * 概率判定
 */
export function chance(percent: number): boolean {
  return Math.random() < percent;
}

/**
 * 范围内随机整数
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 范围内随机浮点数
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// ============================================================
// 属性计算公式
// ============================================================

/**
 * 计算战斗力
 */
export function calculateCombatPower(stats: PlayerStats): number {
  const baseAttack = stats.attack * 1.5;
  const baseDefense = stats.defense * 1.2;
  const hpBonus = (stats.hpMax / 100) * 0.5;
  const agilityBonus = stats.agility * 0.8;
  const critBonus = stats.critRate * stats.attack * 0.5;
  
  return Math.floor(baseAttack + baseDefense + hpBonus + agilityBonus + critBonus);
}

/**
 * 计算修炼速度加成（百分比）
 */
export function calculateCultivationSpeed(
  stats: PlayerStats,
  timeBonus: number,
  weatherBonus: number,
  buffBonus: number
): number {
  const baseMultiplier = 1.0;
  const lingenBonus = stats.spiritualRoot * 0.05;
  const intelligenceBonus = stats.intelligence * 0.02;
  
  return (baseMultiplier + lingenBonus + intelligenceBonus + timeBonus + weatherBonus + buffBonus) * 100;
}

/**
 * 计算战斗加成（百分比）
 */
export function calculateBattleBonus(
  stats: PlayerStats,
  timeBonus: number,
  weatherBonus: number,
  buffBonus: number,
  equipmentBonus: number
): number {
  const baseMultiplier = 1.0;
  const attackBonus = (stats.attackBonus || 0) * 0.01;
  const agilityBonus = stats.agility * 0.01;
  
  return (baseMultiplier + attackBonus + agilityBonus + timeBonus + weatherBonus + buffBonus + equipmentBonus) * 100;
}

/**
 * 计算暴击伤害
 */
export function calculateCritDamage(baseDamage: number, critBonus: number = 0): number {
  return Math.floor(baseDamage * (1.5 + critBonus));
}

/**
 * 计算闪避概率（上限90%）
 */
export function calculateEvasionRate(stats: PlayerStats): number {
  return Math.min(0.9, stats.evasionRate + stats.agility * 0.005);
}

/**
 * 计算吸血效果
 */
export function calculateLifesteal(damage: number, lifestealRate: number): number {
  return Math.floor(damage * lifestealRate);
}

// ============================================================
// 数值格式化
// ============================================================

/**
 * 格式化大数字（超过1000显示为1K等）
 */
export function formatNumber(num: number, decimals: number = 1): string {
  if (num < 1000) return num.toString();
  if (num < 10000) return (num / 1000).toFixed(decimals) + 'K';
  if (num < 1000000) return (num / 10000).toFixed(decimals) + 'W';
  if (num < 100000000) return (num / 1000000).toFixed(decimals) + 'M';
  return (num / 100000000).toFixed(decimals) + 'E';
}

/**
 * 格式化百分比
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return (value * 100).toFixed(decimals) + '%';
}

/**
 * 格式化属性名称
 */
export const STAT_NAMES: Record<string, string> = {
  attack: '攻击',
  defense: '防御',
  hp: '气血',
  hpMax: '最大气血',
  spiritualPower: '灵力',
  spiritualPowerMax: '最大灵力',
  agility: '敏捷',
  intelligence: '悟性',
  luck: '运气',
  spiritualRoot: '灵根',
  critRate: '暴击率',
  evasionRate: '闪避率',
  lifesteal: '吸血率',
  stamina: '体力',
  staminaMax: '最大体力',
  realm: '境界',
  cultivation: '修为',
  cultivationNext: '下一境界需求',
};

/**
 * 格式化属性值
 */
export function formatStatValue(key: string, value: number): string {
  if (key.includes('Rate') || key.includes('rate')) {
    return formatPercent(value);
  }
  if (key === 'attack' || key === 'defense') {
    return '+' + Math.floor(value);
  }
  return Math.floor(value).toString();
}

/**
 * 格式化属性显示
 */
export function formatStatDisplay(key: string, value: number): string {
  const name = STAT_NAMES[key] || key;
  return `${name}: ${formatStatValue(key, value)}`;
}

// ============================================================
// 装备品阶
// ============================================================

export type ItemGrade = 'huang' | 'xuan' | 'di' | 'tian' | 'dao' | 'hun';

export const ITEM_GRADE_INFO: Record<ItemGrade, {
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  multiplier: number;
}> = {
  huang: { name: '黄阶', color: 'text-gray-600', bgColor: 'bg-gray-100', borderColor: 'border-gray-400', multiplier: 1.0 },
  xuan: { name: '玄阶', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-400', multiplier: 1.5 },
  di: { name: '地阶', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-500', multiplier: 2.5 },
  tian: { name: '天阶', color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-500', multiplier: 4.0 },
  dao: { name: '道阶', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-500', multiplier: 6.0 },
  hun: { name: '混元', color: 'text-rose-600', bgColor: 'bg-rose-50', borderColor: 'border-rose-500', multiplier: 10.0 },
};

/**
 * 获取品阶前缀
 */
export function getGradePrefix(grade: ItemGrade): string {
  return ITEM_GRADE_INFO[grade]?.name + '·' || '';
}

// ============================================================
// 道基品质
// ============================================================

export type DaoQuality = 'mortal' | 'spirit' | 'immortal' | 'celestial' | 'divine';

export const DAO_QUALITY_INFO: Record<DaoQuality, {
  name: string;
  bonusRate: number;
  color: string;
}> = {
  mortal: { name: '凡人道基', bonusRate: 0, color: 'text-gray-600' },
  spirit: { name: '灵根道基', bonusRate: 0.05, color: 'text-blue-600' },
  immortal: { name: '仙人道基', bonusRate: 0.12, color: 'text-purple-600' },
  celestial: { name: '天道道基', bonusRate: 0.25, color: 'text-yellow-600' },
  divine: { name: '大道道基', bonusRate: 0.40, color: 'text-rose-600' },
};

// ============================================================
// 时间格式化
// ============================================================

/**
 * 格式化游戏时间（秒转为 天:时:分:秒）
 */
export function formatGameTime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (days > 0) {
    return `${days}天${hours}时${minutes}分`;
  }
  if (hours > 0) {
    return `${hours}时${minutes}分${secs}秒`;
  }
  if (minutes > 0) {
    return `${minutes}分${secs}秒`;
  }
  return `${secs}秒`;
}

/**
 * 获取时辰名称
 */
export function getTimePeriodName(gameTime: number): string {
  const hourInDay = Math.floor((gameTime % 86400) / 3600);
  if (hourInDay >= 5 && hourInDay < 9) return '黎明';
  if (hourInDay >= 9 && hourInDay < 12) return '上午';
  if (hourInDay >= 12 && hourInDay < 14) return '正午';
  if (hourInDay >= 14 && hourInDay < 18) return '下午';
  if (hourInDay >= 18 && hourInDay < 20) return '黄昏';
  if (hourInDay >= 20 || hourInDay < 2) return '深夜';
  return '夜晚';
}

// ============================================================
// 数组工具
// ============================================================

/**
 * 随机打乱数组
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 获取唯一ID
 */
export function generateId(prefix: string = ''): string {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
