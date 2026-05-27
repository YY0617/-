/**
 * 师徒系统数据 - 单机版，根据出身背景调整
 */

export interface MasterDisciple {
  id: string;
  name: string;
  role: 'master' | 'disciple';
  realm: number;
  relationship: number; // 0-100 亲密度
  knowledge: number; // 传道授业能力/学习能力
  specialty: string[]; // 专长领域
  lastInteraction: number;
  lessonsGiven: number;
  lessonsReceived: number;
  breakthroughsAssisted: number;
  backgroundType: string; // 关联的出身背景
}

export interface Lesson {
  id: string;
  name: string;
  description: string;
  type: 'combat' | 'cultivation' | 'alchemy' | 'formation' | 'insight';
  difficulty: number;
  rewards: {
    exp?: number;
    relationship?: number;
    stats?: Record<string, number>;
    cultivationBonus?: number;
  };
  duration: number;
  cooldown: number;
  prerequisites?: {
    realm?: number;
    relationship?: number;
  };
  backgroundBonus?: Record<string, number>; // 不同出身背景的奖励加成
}

export interface GuidanceRequest {
  id: string;
  type: 'breakthrough' | 'skill' | 'cultivation' | 'problem';
  description: string;
  successChance: number;
  rewards: Record<string, number>;
  cooldown: number;
}

export interface MasterDiscipleSystemState {
  master: MasterDisciple | null;
  disciples: MasterDisciple[];
  availableMentors: MasterDisciple[];
  ongoingLessons: Array<{
    lessonId: string;
    partnerId: string;
    endTime: number;
  }>;
  guidanceCooldowns: Record<string, number>;
  totalLessonsCompleted: number;
  totalBreakthroughsAssisted: number;
}

// ============================================================
// 根据出身背景调整的师父模板
// ============================================================
export const MENTORS_BY_BACKGROUND: Record<string, MasterDisciple[]> = {
  sect: [
    {
      id: 'sect_master',
      name: '玄剑真人',
      role: 'master',
      realm: 7,
      relationship: 50,
      knowledge: 90,
      specialty: ['combat', 'cultivation', 'formation'],
      lastInteraction: Date.now(),
      lessonsGiven: 0,
      lessonsReceived: 0,
      breakthroughsAssisted: 0,
      backgroundType: 'sect',
    },
    {
      id: 'sect_elder',
      name: '丹鼎长老',
      role: 'master',
      realm: 6,
      relationship: 40,
      knowledge: 85,
      specialty: ['alchemy', 'cultivation'],
      lastInteraction: Date.now(),
      lessonsGiven: 0,
      lessonsReceived: 0,
      breakthroughsAssisted: 0,
      backgroundType: 'sect',
    },
  ],
  master: [
    {
      id: 'mystery_master',
      name: '太上真君',
      role: 'master',
      realm: 10,
      relationship: 70,
      knowledge: 99,
      specialty: ['combat', 'cultivation', 'insight'],
      lastInteraction: Date.now(),
      lessonsGiven: 0,
      lessonsReceived: 0,
      breakthroughsAssisted: 0,
      backgroundType: 'master',
    },
  ],
  solo: [
    {
      id: 'wanderer_sage',
      name: '逍遥散仙',
      role: 'master',
      realm: 8,
      relationship: 30,
      knowledge: 88,
      specialty: ['cultivation', 'insight', 'formation'],
      lastInteraction: Date.now(),
      lessonsGiven: 0,
      lessonsReceived: 0,
      breakthroughsAssisted: 0,
      backgroundType: 'solo',
    },
    {
      id: 'ancient_master',
      name: '上古遗迹守护者',
      role: 'master',
      realm: 9,
      relationship: 20,
      knowledge: 95,
      specialty: ['combat', 'formation', 'insight'],
      lastInteraction: Date.now(),
      lessonsGiven: 0,
      lessonsReceived: 0,
      breakthroughsAssisted: 0,
      backgroundType: 'solo',
    },
  ],
  family: [
    {
      id: 'family_elder',
      name: '家族长老',
      role: 'master',
      realm: 6,
      relationship: 60,
      knowledge: 80,
      specialty: ['cultivation', 'alchemy'],
      lastInteraction: Date.now(),
      lessonsGiven: 0,
      lessonsReceived: 0,
      breakthroughsAssisted: 0,
      backgroundType: 'family',
    },
    {
      id: 'family_ancestor',
      name: '家族老祖',
      role: 'master',
      realm: 8,
      relationship: 45,
      knowledge: 90,
      specialty: ['combat', 'cultivation', 'alchemy'],
      lastInteraction: Date.now(),
      lessonsGiven: 0,
      lessonsReceived: 0,
      breakthroughsAssisted: 0,
      backgroundType: 'family',
    },
  ],
};

// ============================================================
// 授业课程数据
// ============================================================
export const LESSONS: Lesson[] = [
  {
    id: 'basicCultivation',
    name: '基础修炼讲解',
    description: '师父讲解基础修炼心得，修炼效率+20%',
    type: 'cultivation',
    difficulty: 1,
    rewards: {
      cultivationBonus: 0.2,
      relationship: 3,
    },
    duration: 30,
    cooldown: 60,
    backgroundBonus: { master: 1.5, sect: 1.3 },
  },
  {
    id: 'combatTraining',
    name: '战斗技法训练',
    description: '师徒对战演练，攻击力+5',
    type: 'combat',
    difficulty: 2,
    rewards: {
      stats: { attack: 5 },
      relationship: 5,
    },
    duration: 45,
    cooldown: 90,
    prerequisites: { realm: 1 },
    backgroundBonus: { master: 1.4, solo: 1.2 },
  },
  {
    id: 'alchemyLesson',
    name: '丹道入门',
    description: '学习炼丹基础，下次炼丹成功率+15%',
    type: 'alchemy',
    difficulty: 2,
    rewards: {
      relationship: 4,
    },
    duration: 60,
    cooldown: 120,
    prerequisites: { realm: 2 },
    backgroundBonus: { family: 1.4, sect: 1.2 },
  },
  {
    id: 'formationStudy',
    name: '阵法研习',
    description: '研究阵法之道，防御力+3',
    type: 'formation',
    difficulty: 3,
    rewards: {
      stats: { defense: 3 },
      relationship: 6,
    },
    duration: 90,
    cooldown: 180,
    prerequisites: { realm: 3, relationship: 40 },
    backgroundBonus: { sect: 1.5, solo: 1.3 },
  },
  {
    id: 'insightMeditation',
    name: '悟道传功',
    description: '师父引导感悟大道，有机会获得顿悟',
    type: 'insight',
    difficulty: 5,
    rewards: {
      cultivationBonus: 0.5,
      relationship: 10,
    },
    duration: 120,
    cooldown: 300,
    prerequisites: { realm: 5, relationship: 60 },
    backgroundBonus: { master: 1.5, solo: 1.4 },
  },
];

// ============================================================
// 指导请求数据
// ============================================================
export const GUIDANCE_REQUESTS: GuidanceRequest[] = [
  {
    id: 'breakthrough_guidance',
    type: 'breakthrough',
    description: '请求师父指导突破，成功率+20%',
    successChance: 0.85,
    rewards: { breakthroughBonus: 0.2 },
    cooldown: 360,
  },
  {
    id: 'skill_teaching',
    type: 'skill',
    description: '请教师父新技能',
    successChance: 0.7,
    rewards: { skillLearnChance: 0.3 },
    cooldown: 180,
  },
  {
    id: 'problem_solving',
    type: 'problem',
    description: '请教修炼上的难题',
    successChance: 0.9,
    rewards: { cultivationBonus: 0.3 },
    cooldown: 120,
  },
];
