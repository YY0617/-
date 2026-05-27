/**
 * 炼器系统数据 - 打造属于你的神器
 */

export interface RefineryMaterial {
  id: string;
  name: string;
  description: string;
  rarity: number;
  grade: 'common' | 'rare' | 'epic' | 'legendary';
  type: 'metal' | 'stone' | 'herb' | 'essence' | 'soul';
  effects: Record<string, number>;
}

export interface RefineryRecipe {
  id: string;
  name: string;
  description: string;
  resultItemId: string;
  materials: Array<{ materialId: string; quantity: number }>;
  difficulty: number;
  successRate: number;
  baseGrade: 'huang' | 'xuan' | 'di' | 'tian' | 'dao' | 'hun';
  requiredLevel: number;
  experienceReward: number;
}

export interface RefineryState {
  level: number;
  experience: number;
  maxExperience: number;
  successBonus: number;
  qualityBonus: number;
  bonusStats: Record<string, number>;
  unlockedRecipes: string[];
  recentCreations: Array<{
    itemId: string;
    success: boolean;
    timestamp: number;
    grade: string;
  }>;
  totalItemsCreated: number;
  totalLegendaryItems: number;
}

// ============================================================
// 炼器材料数据
// ============================================================
export const REFINERY_MATERIALS: RefineryMaterial[] = [
  {
    id: 'iron_ore',
    name: '铁矿石',
    description: '普通的铁矿石，可用于基础炼器',
    rarity: 60,
    grade: 'common',
    type: 'metal',
    effects: { durability: 10 },
  },
  {
    id: 'jade_stone',
    name: '玉石',
    description: '蕴含灵气的玉石',
    rarity: 40,
    grade: 'common',
    type: 'stone',
    effects: { spiritualPower: 15 },
  },
  {
    id: 'purple_gold',
    name: '紫金',
    description: '稀有的紫金矿石',
    rarity: 20,
    grade: 'rare',
    type: 'metal',
    effects: { attack: 20, durability: 25 },
  },
  {
    id: 'spirit_essence',
    name: '灵魄精华',
    description: '蕴含强大力量的精华',
    rarity: 10,
    grade: 'epic',
    type: 'essence',
    effects: { allStats: 10 },
  },
  {
    id: 'heavenly_essence',
    name: '天灵髓',
    description: '传说中的天材地宝',
    rarity: 3,
    grade: 'legendary',
    type: 'essence',
    effects: { allStats: 25 },
  },
];

// ============================================================
// 炼器配方数据
// ============================================================
export const REFINERY_RECIPES: RefineryRecipe[] = [
  {
    id: 'iron_sword',
    name: '铁剑',
    description: '基础的铁剑，适合初学者使用',
    resultItemId: 'iron_sword',
    materials: [
      { materialId: 'iron_ore', quantity: 5 },
    ],
    difficulty: 1,
    successRate: 0.9,
    baseGrade: 'huang',
    requiredLevel: 0,
    experienceReward: 10,
  },
  {
    id: 'jade_pendant',
    name: '玉佩',
    description: '精致的玉佩，可增加防御力',
    resultItemId: 'jade_pendant',
    materials: [
      { materialId: 'jade_stone', quantity: 3 },
      { materialId: 'iron_ore', quantity: 2 },
    ],
    difficulty: 2,
    successRate: 0.7,
    baseGrade: 'xuan',
    requiredLevel: 1,
    experienceReward: 25,
  },
  {
    id: 'purple_gold_armor',
    name: '紫金战甲',
    description: '稀有的紫金战甲，强力的防护',
    resultItemId: 'purple_gold_armor',
    materials: [
      { materialId: 'purple_gold', quantity: 10 },
      { materialId: 'jade_stone', quantity: 5 },
    ],
    difficulty: 4,
    successRate: 0.45,
    baseGrade: 'di',
    requiredLevel: 3,
    experienceReward: 80,
  },
  {
    id: 'spirit_sword',
    name: '灵剑',
    description: '蕴含灵力的宝剑',
    resultItemId: 'spirit_sword',
    materials: [
      { materialId: 'spirit_essence', quantity: 3 },
      { materialId: 'purple_gold', quantity: 8 },
    ],
    difficulty: 6,
    successRate: 0.25,
    baseGrade: 'tian',
    requiredLevel: 5,
    experienceReward: 150,
  },
  {
    id: 'heavenly_sword',
    name: '天道神剑',
    description: '传说中的天道神剑',
    resultItemId: 'heavenly_sword',
    materials: [
      { materialId: 'heavenly_essence', quantity: 5 },
      { materialId: 'spirit_essence', quantity: 10 },
    ],
    difficulty: 10,
    successRate: 0.1,
    baseGrade: 'dao',
    requiredLevel: 8,
    experienceReward: 500,
  },
];

// ============================================================
// 初始炼器物品数据
// ============================================================
export const REFINERY_ITEMS: Record<string, any> = {
  iron_sword: {
    id: 'iron_sword',
    name: '铁剑',
    type: 'weapon',
    desc: '基础的铁剑',
    grade: 'huang',
    stats: { attack: 10 },
  },
  jade_pendant: {
    id: 'jade_pendant',
    name: '玉佩',
    type: 'accessory',
    desc: '精致的玉佩',
    grade: 'xuan',
    stats: { defense: 8, spiritualPowerMax: 20 },
  },
  purple_gold_armor: {
    id: 'purple_gold_armor',
    name: '紫金战甲',
    type: 'armor',
    desc: '稀有的紫金战甲',
    grade: 'di',
    stats: { defense: 35, hpMax: 50 },
  },
  spirit_sword: {
    id: 'spirit_sword',
    name: '灵剑',
    type: 'weapon',
    desc: '蕴含灵力的宝剑',
    grade: 'tian',
    stats: { attack: 60, spiritualPowerMax: 40, critRate: 0.1 },
  },
  heavenly_sword: {
    id: 'heavenly_sword',
    name: '天道神剑',
    type: 'weapon',
    desc: '传说中的天道神剑',
    grade: 'dao',
    stats: { attack: 150, spiritualPowerMax: 100, critRate: 0.2, luck: 10 },
  },
};
