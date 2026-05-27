// 终局内容 - 高境界后可挑战的内容

export interface EndgameChallenge {
  id: string;
  name: string;
  description: string;
  requiredRealm: number;
  type: 'boss' | 'dungeon' | 'trial' | 'tournament';
  rewards: {
    gold: number;
    cultivation: number;
    items?: { id: string; count: number }[];
  };
  difficulty: 'easy' | 'normal' | 'hard' | 'extreme';
}

export const ENDGAME_CHALLENGES: EndgameChallenge[] = [
  {
    id: 'ancient_ruins',
    name: '远古遗迹探索',
    description: '探索传说中上古修士留下的神秘遗迹，其中蕴含着无穷的宝藏和危机',
    requiredRealm: 4, // 凌虚境
    type: 'dungeon',
    rewards: {
      gold: 5000,
      cultivation: 3000,
      items: [
        { id: 'weapon_tian_1', count: 1 },
      ],
    },
    difficulty: 'normal',
  },
  {
    id: 'tribulation_test',
    name: '天劫试炼',
    description: '模拟天劫的考验，只有成功渡过才能向更高境界迈进',
    requiredRealm: 5, // 悟道境
    type: 'trial',
    rewards: {
      gold: 10000,
      cultivation: 8000,
      items: [
        { id: 'breakthrough_pill_4', count: 3 },
      ],
    },
    difficulty: 'hard',
  },
  {
    id: 'immortal_battle',
    name: '仙战擂台',
    description: '与历代强者的幻影战斗，胜利可获得丰厚奖励',
    requiredRealm: 6, // 冠绝境
    type: 'tournament',
    rewards: {
      gold: 20000,
      cultivation: 15000,
      items: [
        { id: 'armor_dao_1', count: 1 },
      ],
    },
    difficulty: 'hard',
  },
  {
    id: 'demon_lord',
    name: '讨伐魔王',
    description: '传说中的魔王现身，需要集结所有力量才能击败',
    requiredRealm: 7, // 绝圣境
    type: 'boss',
    rewards: {
      gold: 50000,
      cultivation: 30000,
      items: [
        { id: 'weapon_dao_1', count: 1 },
        { id: 'armor_dao_1', count: 1 },
      ],
    },
    difficulty: 'extreme',
  },
  {
    id: 'void_cracking',
    name: '虚空裂缝',
    description: '时空裂缝中涌出无数异界生物，守护修仙界的重任落在你的肩上',
    requiredRealm: 8, // 圣君境
    type: 'dungeon',
    rewards: {
      gold: 100000,
      cultivation: 60000,
      items: [
        { id: 'weapon_hun_1', count: 1 },
      ],
    },
    difficulty: 'extreme',
  },
  {
    id: 'final_transcendence',
    name: '终极超脱',
    description: '迈向传说中的君帝境，与天道意志一决高下',
    requiredRealm: 9, // 君帝境
    type: 'boss',
    rewards: {
      gold: 500000,
      cultivation: 300000,
      items: [
        { id: 'weapon_hun_1', count: 1 },
        { id: 'armor_hun_1', count: 1 },
        { id: 'accessory_hun_1', count: 1 },
      ],
    },
    difficulty: 'extreme',
  },
];

// 终局成就
export interface EndgameAchievement {
  id: string;
  name: string;
  description: string;
  requirement: (stats: any) => boolean;
  reward: {
    title?: string;
    item?: string;
  };
}

export const ENDGAME_ACHIEVEMENTS: EndgameAchievement[] = [
  {
    id: 'first_extreme_clear',
    name: '初入巅峰',
    description: '首次通关一个extreme难度的终局挑战',
    requirement: (stats) => {
      // 这里需要根据实际数据结构调整
      return true;
    },
    reward: {
      title: '挑战者',
    },
  },
  {
    id: 'all_challenges_complete',
    name: '传说不朽',
    description: '完成所有终局挑战',
    requirement: (stats) => {
      return true;
    },
    reward: {
      title: '不朽传说',
    },
  },
  {
    id: 'max_realm',
    name: '登峰造极',
    description: '达到君帝境圆满',
    requirement: (stats) => stats.realm >= 9 && stats.subLevel >= 3,
    reward: {
      title: '大帝',
    },
  },
];
