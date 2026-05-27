// 任务数据配置 - 玄幻世界观

import { Quest, GameState } from './types';

// 先定义一个带可选字段的类型
type QuestTemplate = Omit<Quest, 'isClaimed' | 'isCompleted'> & Partial<Pick<Quest, 'isClaimed' | 'isCompleted'>>;

export const QUESTS: QuestTemplate[] = [
  // ============== 主线任务 ==============
  {
    id: 'first_cultivation',
    type: 'main',
    name: '初次修炼',
    description: '完成第一次修炼',
    target: 1,
    current: 0,
    rewards: { gold: 100, cultivation: 50 },
    requiredBackground: undefined,
    unlockCondition: undefined
  },
  {
    id: 'reach_100_cultivation',
    type: 'main',
    name: '踏入玄幻之门',
    description: '修为达到100点',
    target: 100,
    current: 0,
    rewards: { gold: 200, cultivation: 80 },
    requiredBackground: undefined,
    unlockCondition: 'first_cultivation'
  },
  {
    id: 'win_first_battle',
    type: 'main',
    name: '初战告捷',
    description: '赢得第一场战斗',
    target: 1,
    current: 0,
    rewards: { gold: 300, cultivation: 100 },
    requiredBackground: undefined,
    unlockCondition: 'reach_100_cultivation'
  },
  {
    id: 'win_5_battles',
    type: 'main',
    name: '小有名气',
    description: '赢得5场战斗',
    target: 5,
    current: 0,
    rewards: { gold: 500, cultivation: 200, realmStones: 1 },
    requiredBackground: undefined,
    unlockCondition: 'win_first_battle'
  },
  {
    id: 'reach_realm2',
    type: 'main',
    name: '小成之境',
    description: '突破至第二重境界',
    target: 2,
    current: 0,
    rewards: { gold: 1000, cultivation: 300, talentPoint: 1 },
    requiredBackground: undefined,
    unlockCondition: 'win_5_battles'
  },
  {
    id: 'win_10_battles',
    type: 'main',
    name: '崭露头角',
    description: '赢得10场战斗',
    target: 10,
    current: 0,
    rewards: { gold: 1500, cultivation: 500, realmStones: 2 },
    requiredBackground: undefined,
    unlockCondition: 'reach_realm2'
  },
  {
    id: 'reach_realm3',
    type: 'main',
    name: '登堂入室',
    description: '突破至第三重境界',
    target: 3,
    current: 0,
    rewards: { gold: 2000, cultivation: 800, talentPoint: 1 },
    requiredBackground: undefined,
    unlockCondition: 'win_10_battles'
  },
  {
    id: 'win_20_battles',
    type: 'main',
    name: '名动一方',
    description: '赢得20场战斗',
    target: 20,
    current: 0,
    rewards: { gold: 3000, cultivation: 1000, realmStones: 3 },
    requiredBackground: undefined,
    unlockCondition: 'reach_realm3'
  },
  {
    id: 'reach_realm4',
    type: 'main',
    name: '超凡入圣',
    description: '突破至第四重境界',
    target: 4,
    current: 0,
    rewards: { gold: 5000, cultivation: 1500, talentPoint: 2 },
    requiredBackground: undefined,
    unlockCondition: 'win_20_battles'
  },
  {
    id: 'win_30_battles',
    type: 'main',
    name: '威震天下',
    description: '赢得30场战斗',
    target: 30,
    current: 0,
    rewards: { gold: 8000, cultivation: 2000, realmStones: 5 },
    requiredBackground: undefined,
    unlockCondition: 'reach_realm4'
  },
  {
    id: 'reach_realm5',
    type: 'main',
    name: '一代宗师',
    description: '突破至第五重境界',
    target: 5,
    current: 0,
    rewards: { gold: 10000, cultivation: 3000, talentPoint: 3 },
    requiredBackground: undefined,
    unlockCondition: 'win_30_battles'
  },

  // ============== 通用支线任务 ==============
  {
    id: 'collect_gold_1000',
    type: 'side',
    name: '聚财有道',
    description: '累计获得1000灵石',
    target: 1000,
    current: 0,
    rewards: { gold: 300, cultivation: 150 },
    requiredBackground: undefined,
    unlockCondition: undefined
  },
  {
    id: 'explore_5_days',
    type: 'side',
    name: '持之以恒',
    description: '探索5次',
    target: 5,
    current: 0,
    rewards: { gold: 400, cultivation: 200, realmStones: 1 },
    requiredBackground: undefined,
    unlockCondition: undefined
  },
  {
    id: 'total_cultivation_5000',
    type: 'side',
    name: '日积月累',
    description: '累计修炼获得5000修为',
    target: 5000,
    current: 0,
    rewards: { gold: 800, cultivation: 400, talentPoint: 1 },
    requiredBackground: undefined,
    unlockCondition: undefined
  },
  {
    id: 'collect_gold_5000',
    type: 'side',
    name: '富甲一方',
    description: '累计获得5000灵石',
    target: 5000,
    current: 0,
    rewards: { gold: 1500, cultivation: 600, realmStones: 2 },
    requiredBackground: undefined,
    unlockCondition: 'collect_gold_1000'
  },
  {
    id: 'explore_20_days',
    type: 'side',
    name: '不懈探索',
    description: '探索20次',
    target: 20,
    current: 0,
    rewards: { gold: 1200, cultivation: 500, talentPoint: 1 },
    requiredBackground: undefined,
    unlockCondition: 'explore_5_days'
  },
  {
    id: 'total_cultivation_20000',
    type: 'side',
    name: '厚积薄发',
    description: '累计修炼获得20000修为',
    target: 20000,
    current: 0,
    rewards: { gold: 2000, cultivation: 1000, talentPoint: 2 },
    requiredBackground: undefined,
    unlockCondition: 'total_cultivation_5000'
  },

  // ============== 宗门背景专属支线 ==============
  {
    id: 'sect_contribution',
    type: 'side',
    name: '宗门贡献',
    description: '赢得10场战斗为宗门争光',
    target: 10,
    current: 0,
    rewards: { gold: 600, cultivation: 400, realmStones: 1 },
    requiredBackground: 'sect',
    unlockCondition: undefined
  },
  {
    id: 'sect_elder',
    type: 'side',
    name: '宗门长老',
    description: '突破至第四重境界',
    target: 4,
    current: 0,
    rewards: { gold: 2500, cultivation: 1200, talentPoint: 2 },
    requiredBackground: 'sect',
    unlockCondition: 'sect_contribution'
  },

  // ============== 师父背景专属支线 ==============
  {
    id: 'master_disciple',
    type: 'side',
    name: '尊师重道',
    description: '完成10次修炼',
    target: 10,
    current: 0,
    rewards: { gold: 500, cultivation: 350 },
    requiredBackground: 'master',
    unlockCondition: undefined
  },
  {
    id: 'master_successor',
    type: 'side',
    name: '衣钵传人',
    description: '突破至第四重境界',
    target: 4,
    current: 0,
    rewards: { gold: 2200, cultivation: 1100, talentPoint: 2 },
    requiredBackground: 'master',
    unlockCondition: 'master_disciple'
  },

  // ============== 独行背景专属支线 ==============
  {
    id: 'solo_wanderer',
    type: 'side',
    name: '孤胆游侠',
    description: '探索10次',
    target: 10,
    current: 0,
    rewards: { gold: 550, cultivation: 300, realmStones: 2 },
    requiredBackground: 'solo',
    unlockCondition: undefined
  },
  {
    id: 'solo_legend',
    type: 'side',
    name: '独行侠影',
    description: '赢得25场战斗',
    target: 25,
    current: 0,
    rewards: { gold: 2800, cultivation: 1400, talentPoint: 2 },
    requiredBackground: 'solo',
    unlockCondition: 'solo_wanderer'
  },

  // ============== 家族背景专属支线 ==============
  {
    id: 'family_honor',
    type: 'side',
    name: '家族荣耀',
    description: '累计获得3000灵石',
    target: 3000,
    current: 0,
    rewards: { gold: 800, cultivation: 380 },
    requiredBackground: 'family',
    unlockCondition: undefined
  },
  {
    id: 'family_heir',
    type: 'side',
    name: '家族继承人',
    description: '突破至第四重境界',
    target: 4,
    current: 0,
    rewards: { gold: 2400, cultivation: 1300, talentPoint: 2 },
    requiredBackground: 'family',
    unlockCondition: 'family_honor'
  },

  // ============== 通用隐藏/特殊支线 ==============
  {
    id: 'unlock_all_features',
    type: 'side',
    name: '全能者',
    description: '进行修炼、战斗、探索各一次',
    target: 3,
    current: 0,
    rewards: { gold: 1000, cultivation: 600, realmStones: 2, talentPoint: 1 },
    requiredBackground: undefined,
    unlockCondition: undefined
  },
  {
    id: 'reach_realm6',
    type: 'side',
    name: '陆地神仙',
    description: '突破至第六重境界',
    target: 6,
    current: 0,
    rewards: { gold: 15000, cultivation: 5000, talentPoint: 5 },
    requiredBackground: undefined,
    unlockCondition: 'reach_realm5'
  }
];

export function getInitialQuests(): Quest[] {
  return QUESTS.map(q => ({ ...q, isClaimed: false, isCompleted: false }));
}

export function updateQuestProgress(quests: Quest[], type: string, amount: number, state: GameState): Quest[] {
  return quests.map(q => {
    if (q.isCompleted || q.isClaimed) return q;

    // 检查背景限制
    if (q.requiredBackground && q.requiredBackground !== state.background?.id) {
      return q;
    }

    // 检查解锁条件
    if (q.unlockCondition) {
      const preQuest = quests.find(x => x.id === q.unlockCondition);
      if (!preQuest || !preQuest.isCompleted) {
        return q;
      }
    }

    let newCurrent = q.current;

    switch (q.id) {
      // 修炼任务
      case 'first_cultivation':
        if (type === 'cultivation') newCurrent = Math.min(q.target, q.current + 1);
        break;
      
      // 修为任务
      case 'reach_100_cultivation':
      case 'total_cultivation_5000':
      case 'total_cultivation_20000':
        if (type === 'cultivation') newCurrent = Math.min(q.target, state.totalCultivation || 0);
        break;
      
      // 战斗胜利任务
      case 'win_first_battle':
      case 'win_5_battles':
      case 'win_10_battles':
      case 'win_20_battles':
      case 'win_30_battles':
      case 'sect_contribution':
      case 'solo_legend':
        if (type === 'battle') newCurrent = Math.min(q.target, q.current + amount);
        break;
      
      // 境界任务
      case 'reach_realm2':
      case 'reach_realm3':
      case 'reach_realm4':
      case 'reach_realm5':
      case 'reach_realm6':
      case 'sect_elder':
      case 'master_successor':
      case 'family_heir':
        newCurrent = Math.min(q.target, state.stats.realm);
        break;
      
      // 收集灵石任务
      case 'collect_gold_1000':
      case 'collect_gold_5000':
      case 'family_honor':
        if (type === 'gold') newCurrent = Math.min(q.target, state.totalGold || 0);
        break;
      
      // 探索任务
      case 'explore_5_days':
      case 'explore_20_days':
      case 'solo_wanderer':
        if (type === 'explore') newCurrent = Math.min(q.target, q.current + amount);
        break;
      
      // 师父背景任务
      case 'master_disciple':
        if (type === 'cultivation') newCurrent = Math.min(q.target, q.current + amount);
        break;
      
      // 全能者任务
      case 'unlock_all_features':
        if (type === 'feature') {
          newCurrent = Math.min(q.target, q.current + amount);
        }
        break;
    }

    return {
      ...q,
      current: newCurrent,
      isCompleted: newCurrent >= q.target
    };
  });
}
