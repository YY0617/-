// 炼丹系统 - 更多玩法

export interface AlchemyRecipe {
  id: string;
  name: string;
  description: string;
  requiredRealm: number;
  materials: {
    id: string;
    name: string;
    count: number;
  }[];
  result: {
    id: string;
    name: string;
    count: number;
  };
  successRate: number;
  craftTime: number; // 秒
}

export const ALCHEMY_RECIPES: AlchemyRecipe[] = [
  {
    id: 'health_potion',
    name: '气血丹',
    description: '恢复气血的基础丹药',
    requiredRealm: 0,
    materials: [
      { id: 'herb_1', name: '灵草', count: 3 },
    ],
    result: {
      id: 'qi_pill',
      name: '淬体丹',
      count: 1,
    },
    successRate: 0.8,
    craftTime: 10,
  },
  {
    id: 'spirit_potion',
    name: '灵力丹',
    description: '恢复灵力的丹药',
    requiredRealm: 1,
    materials: [
      { id: 'herb_1', name: '灵草', count: 5 },
      { id: 'herb_2', name: '灵花', count: 2 },
    ],
    result: {
      id: 'spirit_pill',
      name: '通脉丹',
      count: 2,
    },
    successRate: 0.7,
    craftTime: 20,
  },
  {
    id: 'breakthrough_pill_low',
    name: '筑基丹',
    description: '提升突破成功率的低阶丹药',
    requiredRealm: 2,
    materials: [
      { id: 'herb_2', name: '灵花', count: 5 },
      { id: 'mineral_1', name: '灵石碎末', count: 3 },
    ],
    result: {
      id: 'breakthrough_pill_2',
      name: '玄阶·筑基丹',
      count: 1,
    },
    successRate: 0.6,
    craftTime: 30,
  },
  {
    id: 'breakthrough_pill_high',
    name: '九转金丹',
    description: '大幅提升突破成功率的珍贵丹药',
    requiredRealm: 5,
    materials: [
      { id: 'herb_3', name: '万年灵芝', count: 1 },
      { id: 'mineral_2', name: '玄晶', count: 3 },
      { id: 'essence', name: '天地精华', count: 1 },
    ],
    result: {
      id: 'breakthrough_pill_4',
      name: '天阶·九转金丹',
      count: 1,
    },
    successRate: 0.4,
    craftTime: 120,
  },
];

// 炼丹材料
export interface AlchemyMaterial {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  price: number;
}

export const ALCHEMY_MATERIALS: AlchemyMaterial[] = [
  {
    id: 'herb_1',
    name: '灵草',
    description: '最基础的炼丹材料，随处可见',
    rarity: 'common',
    price: 10,
  },
  {
    id: 'herb_2',
    name: '灵花',
    description: '蕴含些许灵气的花朵',
    rarity: 'uncommon',
    price: 30,
  },
  {
    id: 'herb_3',
    name: '万年灵芝',
    description: '生长了万年的珍稀灵芝',
    rarity: 'epic',
    price: 500,
  },
  {
    id: 'mineral_1',
    name: '灵石碎末',
    description: '灵石的碎末，仍有一定灵气',
    rarity: 'common',
    price: 20,
  },
  {
    id: 'mineral_2',
    name: '玄晶',
    description: '蕴含大道气息的神奇晶石',
    rarity: 'rare',
    price: 200,
  },
  {
    id: 'essence',
    name: '天地精华',
    description: '天地灵气凝结而成的至宝',
    rarity: 'legendary',
    price: 1000,
  },
];
