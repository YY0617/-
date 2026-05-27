/**
 * 宗门系统数据 - 单机版宗门系统，根据出身背景调整
 */
import type { Background } from './types';

export interface SectMember {
  id: string;
  name: string;
  role: 'leader' | 'elder' | 'disciple' | 'guest';
  realm: number;
  loyalty: number;
  joinedAt: number;
  contribution: number;
}

export interface SectResource {
  type: 'spiritStone' | 'herb' | 'ore' | 'treasure' | 'land';
  name: string;
  amount: number;
  productionRate: number;
  maxAmount: number;
}

export interface SectTask {
  id: string;
  name: string;
  description: string;
  difficulty: number;
  rewards: {
    contribution: number;
    gold?: number;
    items?: Array<{ itemId: string; quantity: number }>;
  };
  duration: number;
  prerequisites?: {
    realm?: number;
    contribution?: number;
  };
  isRepeatable: boolean;
  backgroundBonus?: Record<string, number>; // 不同出身背景的奖励加成
}

export interface SectTech {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  effect: {
    cultivationBonus?: number;
    combatBonus?: number;
    resourceBonus?: number;
    discipleLimit?: number;
  };
  upgradeCost: {
    spiritStone: number;
    herb: number;
    ore: number;
  };
  requiredLevel: number;
}

export interface Sect {
  id: string;
  name: string;
  level: number;
  prestige: number;
  maxMembers: number;
  members: SectMember[];
  resources: SectResource[];
  tasks: SectTask[];
  technologies: SectTech[];
  foundedAt: number;
  backgroundType: string; // 关联的出身背景类型
  specialBonuses: Record<string, number>; // 特殊加成
}

// ============================================================
// 根据出身背景生成的宗门/家族数据
// ============================================================
export const SECTS_BY_FORCE: Record<string, Partial<Sect>> = {
  xuanjian: {
    name: '玄剑宗',
    specialBonuses: { cultivationBonus: 0.12, attackBonus: 0.15, taskRewardBonus: 0.15 },
  },
  danding: {
    name: '丹鼎阁',
    specialBonuses: { cultivationBonus: 0.1, resourceBonus: 0.2, taskRewardBonus: 0.2 },
  },
  jiuxiao: {
    name: '九霄阁',
    specialBonuses: { cultivationBonus: 0.15, combatBonus: 0.1, taskRewardBonus: 0.15 },
  },
  xuantian: {
    name: '玄天殿',
    specialBonuses: { cultivationBonus: 0.2, luckBonus: 0.1, taskRewardBonus: 0.25 },
  },
};

export const SECTS_BY_BACKGROUND: Record<string, Partial<Sect>> = {
  sect: {
    name: '青云宗',
    specialBonuses: { cultivationBonus: 0.15, taskRewardBonus: 0.2 },
  },
  master: {
    name: '师尊道统',
    specialBonuses: { combatBonus: 0.2, masterGuideBonus: 0.3 },
  },
  solo: {
    name: '逍遥居',
    specialBonuses: { freedomBonus: 1, explorationBonus: 0.25 },
  },
  family: {
    name: '顶级世家',
    specialBonuses: { resourceBonus: 0.3, wealthBonus: 0.2 },
  },
};

// ============================================================
// 家族任务数据（家族出身专用）
// ============================================================
export const FAMILY_TASKS: SectTask[] = [
  {
    id: 'family_gather',
    name: '家族采购',
    description: '为家族采购物资，获得家族贡献',
    difficulty: 1,
    rewards: { contribution: 15, gold: 30 },
    duration: 30,
    isRepeatable: true,
    backgroundBonus: { family: 2 },
  },
  {
    id: 'family_guard',
    name: '守护家族',
    description: '守护家族领地，抵御外敌',
    difficulty: 2,
    rewards: { contribution: 25, gold: 50 },
    duration: 45,
    prerequisites: { realm: 1 },
    isRepeatable: true,
    backgroundBonus: { family: 1.8 },
  },
  {
    id: 'family_trade',
    name: '家族经商',
    description: '代表家族进行商业往来',
    difficulty: 3,
    rewards: { contribution: 40, gold: 100 },
    duration: 60,
    prerequisites: { realm: 3 },
    isRepeatable: true,
    backgroundBonus: { family: 1.5 },
  },
  {
    id: 'family_meeting',
    name: '家族会议',
    description: '参加家族重要会议',
    difficulty: 4,
    rewards: { contribution: 60, gold: 150 },
    duration: 90,
    prerequisites: { realm: 5, contribution: 100 },
    isRepeatable: false,
    backgroundBonus: { family: 2 },
  },
];

// ============================================================
// 宗门任务数据（宗门出身专用）
// ============================================================
export const CLAN_TASKS: SectTask[] = [
  {
    id: 'clan_patrol',
    name: '势力巡逻',
    description: '巡逻势力边界，维护势力安全',
    difficulty: 1,
    rewards: { contribution: 12, gold: 25 },
    duration: 30,
    isRepeatable: true,
    backgroundBonus: { sect: 1.5 },
  },
  {
    id: 'clan_resource',
    name: '资源采集',
    description: '为势力采集修炼资源',
    difficulty: 2,
    rewards: { contribution: 20, gold: 45 },
    duration: 45,
    prerequisites: { realm: 1 },
    isRepeatable: true,
    backgroundBonus: { sect: 1.4 },
  },
  {
    id: 'clan_mission',
    name: '势力任务',
    description: '执行势力派发的外出任务',
    difficulty: 3,
    rewards: { contribution: 35, gold: 80 },
    duration: 60,
    prerequisites: { realm: 3 },
    isRepeatable: true,
    backgroundBonus: { sect: 1.3 },
  },
  {
    id: 'clan_guardian',
    name: '守护重地',
    description: '守护势力重地，责任重大',
    difficulty: 4,
    rewards: { contribution: 55, gold: 120 },
    duration: 90,
    prerequisites: { realm: 5 },
    isRepeatable: false,
    backgroundBonus: { sect: 1.5 },
  },
  {
    id: 'clan_competition',
    name: '势力大比',
    description: '参加势力年度大比',
    difficulty: 5,
    rewards: { contribution: 100, gold: 250 },
    duration: 120,
    prerequisites: { realm: 7, contribution: 200 },
    isRepeatable: false,
    backgroundBonus: { sect: 1.6 },
  },
];

// ============================================================
// 宗门任务数据
// ============================================================
export const SECT_TASKS: SectTask[] = [
  {
    id: 'gathering',
    name: '灵草采集',
    description: '为势力采集灵草，贡献度+10',
    difficulty: 1,
    rewards: { contribution: 10, gold: 20 },
    duration: 30,
    isRepeatable: true,
    backgroundBonus: { family: 1.5, sect: 1.3 },
  },
  {
    id: 'patrol',
    name: '势力巡逻',
    description: '巡逻势力领地，贡献度+15',
    difficulty: 2,
    rewards: { contribution: 15, gold: 35 },
    duration: 45,
    prerequisites: { realm: 1 },
    isRepeatable: true,
    backgroundBonus: { sect: 1.4, solo: 1.2 },
  },
  {
    id: 'mission',
    name: '外出任务',
    description: '执行势力派遣的任务，贡献度+25',
    difficulty: 3,
    rewards: { contribution: 25, gold: 60 },
    duration: 60,
    prerequisites: { realm: 3 },
    isRepeatable: true,
    backgroundBonus: { solo: 1.5, master: 1.3 },
  },
  {
    id: 'guard',
    name: '镇守任务',
    description: '镇守势力重地，贡献度+40',
    difficulty: 4,
    rewards: { contribution: 40, gold: 100 },
    duration: 90,
    prerequisites: { realm: 5 },
    isRepeatable: false,
    backgroundBonus: { master: 1.5, sect: 1.3 },
  },
  {
    id: 'challenge',
    name: '势力大比',
    description: '参加势力大比，贡献度+80',
    difficulty: 5,
    rewards: { contribution: 80, gold: 200 },
    duration: 120,
    prerequisites: { realm: 7, contribution: 200 },
    isRepeatable: false,
    backgroundBonus: { master: 1.5, sect: 1.4, family: 1.3 },
  },
];

// ============================================================
// 宗门科技数据
// ============================================================
export const SECT_TECHNOLOGIES: SectTech[] = [
  {
    id: 'spiritGather',
    name: '聚灵阵',
    description: '修炼速度+10%每级',
    level: 0,
    maxLevel: 10,
    effect: { cultivationBonus: 0.1 },
    upgradeCost: { spiritStone: 100, herb: 50, ore: 30 },
    requiredLevel: 1,
  },
  {
    id: 'combatFormation',
    name: '战阵堂',
    description: '战斗属性+5%每级',
    level: 0,
    maxLevel: 10,
    effect: { combatBonus: 0.05 },
    upgradeCost: { spiritStone: 120, herb: 30, ore: 60 },
    requiredLevel: 2,
  },
  {
    id: 'herbGarden',
    name: '灵草园',
    description: '资源产出+15%每级',
    level: 0,
    maxLevel: 10,
    effect: { resourceBonus: 0.15 },
    upgradeCost: { spiritStone: 80, herb: 100, ore: 20 },
    requiredLevel: 1,
  },
  {
    id: 'discipleHall',
    name: '弟子堂',
    description: '宗门成员上限+2每级',
    level: 0,
    maxLevel: 10,
    effect: { discipleLimit: 2 },
    upgradeCost: { spiritStone: 150, herb: 40, ore: 40 },
    requiredLevel: 3,
  },
];

// ============================================================
// 初始宗门成员模板
// ============================================================
export const INITIAL_MEMBERS: SectMember[] = [
  {
    id: 'player',
    name: '你',
    role: 'leader',
    realm: 0,
    loyalty: 100,
    joinedAt: Date.now(),
    contribution: 0,
  },
  {
    id: 'elder1',
    name: '张大长老',
    role: 'elder',
    realm: 3,
    loyalty: 90,
    joinedAt: Date.now(),
    contribution: 500,
  },
  {
    id: 'disciple1',
    name: '李二',
    role: 'disciple',
    realm: 1,
    loyalty: 80,
    joinedAt: Date.now(),
    contribution: 50,
  },
];

// ============================================================
// 宗门资源初始值
// ============================================================
export const INITIAL_RESOURCES: SectResource[] = [
  { type: 'spiritStone', name: '灵石', amount: 200, productionRate: 2, maxAmount: 2000 },
  { type: 'herb', name: '灵草', amount: 100, productionRate: 1, maxAmount: 1000 },
  { type: 'ore', name: '矿石', amount: 80, productionRate: 0.8, maxAmount: 800 },
];

// 根据出身背景获取对应的任务列表
export function getTasksForBackground(backgroundId: string = 'sect'): SectTask[] {
  switch (backgroundId) {
    case 'family':
      return FAMILY_TASKS;
    case 'sect':
      return CLAN_TASKS;
    default:
      return SECT_TASKS;
  }
}

// 根据出身背景获取对应的名称映射
export function getSectTerms(backgroundId: string = 'sect'): Record<string, string> {
  switch (backgroundId) {
    case 'family':
      return {
        title: '家族',
        leader: '家主',
        elder: '族老',
        disciple: '族人',
        guest: '门客',
        taskButton: '为家族效力',
      };
    case 'master':
      return {
        title: '道统',
        leader: '掌门',
        elder: '师叔',
        disciple: '师侄',
        guest: '客人',
        taskButton: '弘扬师门',
      };
    case 'solo':
      return {
        title: '居所',
        leader: '主人',
        elder: '朋友',
        disciple: '弟子',
        guest: '访客',
        taskButton: '完成事务',
      };
    case 'sect':
    default:
      return {
        title: '势力',
        leader: '宗主',
        elder: '长老',
        disciple: '弟子',
        guest: '客卿',
        taskButton: '为势力效力',
      };
  }
}
