/**
 * Competition Config - 比赛系统配置
 * 天下武道大会、各类小型比赛配置
 */

/**
 * 比赛类型
 */
export type CompetitionType = 'world' | 'faction' | 'regional' | 'trial';

/**
 * 比赛等级
 */
export type CompetitionLevel = 's' | 'a' | 'b' | 'c' | 'd';

/**
 * 比赛配置接口
 */
export interface CompetitionConfig {
  id: string;
  name: string;
  type: CompetitionType;
  level: CompetitionLevel;
  description: string;
  
  // 参赛要求
  requirements: {
    minRealm?: number;
    maxRealm?: number;
    requiredBackgrounds?: string[];  // 'sect' | 'master' | 'solo' | 'family'
    requiredFaction?: string[];    // 宗门ID列表
  };
  
  // 赛制
  format: {
    type: 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss';
    rounds: number;
    matchDuration: number;  // 秒
  };
  
  // 奖励
  rewards: {
    participation: { gold: number; cultivation: number };      // 参与奖
    roundWins: { [round: number]: { gold: number; cultivation: number; reputation: number } };
    champion: { gold: number; cultivation: number; reputation: number; title: string };
    runnerUp: { gold: number; cultivation: number; reputation: number; title: string };
  };
  
  // 举办周期（游戏内天数）
  schedule: {
    frequency: 'once' | 'daily' | 'weekly' | 'monthly';
    duration: number;  // 持续天数
    registrationDays: number;  // 报名持续天数
  };
  
  // 图标
  icon: string;
}

/**
 * 天下武道大会（世界级）
 */
export const WORLD_WUSHU_CONFERENCE: CompetitionConfig = {
  id: 'world_wushu_conference',
  name: '天下武道大会',
  type: 'world',
  level: 's',
  description: '三年一度的天下武道盛会，汇聚各路高手，争夺"天下第一人"的至高荣耀',
  
  requirements: {
    minRealm: 2,  // 武心境以上
  },
  
  format: {
    type: 'single_elimination',
    rounds: 6,
    matchDuration: 300,
  },
  
  rewards: {
    participation: { gold: 500, cultivation: 1000 },
    roundWins: {
      1: { gold: 200, cultivation: 500, reputation: 10 },
      2: { gold: 400, cultivation: 1000, reputation: 25 },
      3: { gold: 800, cultivation: 2000, reputation: 50 },
      4: { gold: 1500, cultivation: 4000, reputation: 100 },
      5: { gold: 3000, cultivation: 8000, reputation: 200 },
    },
    champion: { 
      gold: 10000, 
      cultivation: 50000, 
      reputation: 500, 
      title: '天下第一' 
    },
    runnerUp: { 
      gold: 5000, 
      cultivation: 25000, 
      reputation: 300, 
      title: '天下第二' 
    },
  },
  
  schedule: {
    frequency: 'monthly',
    duration: 7,
    registrationDays: 30,
  },
  
  icon: '🏆',
};

/**
 * 宗门大比（宗门专属）
 */
export const FACTION_CHAMPIONSHIP: CompetitionConfig = {
  id: 'faction_championship',
  name: '宗门大比',
  type: 'faction',
  level: 'b',
  description: '各宗门内部选拔赛，前三名可代表宗门参加天下武道大会',
  
  requirements: {
    requiredBackgrounds: ['sect'],
  },
  
  format: {
    type: 'single_elimination',
    rounds: 4,
    matchDuration: 180,
  },
  
  rewards: {
    participation: { gold: 100, cultivation: 200 },
    roundWins: {
      1: { gold: 80, cultivation: 150, reputation: 5 },
      2: { gold: 150, cultivation: 300, reputation: 15 },
      3: { gold: 300, cultivation: 600, reputation: 30 },
    },
    champion: { 
      gold: 1000, 
      cultivation: 3000, 
      reputation: 100, 
      title: '宗门首席' 
    },
    runnerUp: { 
      gold: 500, 
      cultivation: 1500, 
      reputation: 60, 
      title: '宗门第二' 
    },
  },
  
  schedule: {
    frequency: 'weekly',
    duration: 3,
    registrationDays: 7,
  },
  
  icon: '⚔️',
};

/**
 * 家族大比（家族专属）
 */
export const FAMILY_CHAMPIONSHIP: CompetitionConfig = {
  id: 'family_championship',
  name: '家族大比',
  type: 'faction',
  level: 'c',
  description: '家族内部的比武大会，争夺家主之位的有力竞争',
  
  requirements: {
    requiredBackgrounds: ['family'],
  },
  
  format: {
    type: 'round_robin',
    rounds: 3,
    matchDuration: 180,
  },
  
  rewards: {
    participation: { gold: 80, cultivation: 150 },
    roundWins: {
      1: { gold: 50, cultivation: 100, reputation: 3 },
      2: { gold: 100, cultivation: 200, reputation: 8 },
    },
    champion: { 
      gold: 800, 
      cultivation: 2000, 
      reputation: 80, 
      title: '家族第一' 
    },
    runnerUp: { 
      gold: 400, 
      cultivation: 1000, 
      reputation: 50, 
      title: '家族第二' 
    },
  },
  
  schedule: {
    frequency: 'weekly',
    duration: 2,
    registrationDays: 7,
  },
  
  icon: '👨‍👩‍👧‍👦',
};

/**
 * 游侠大会（散修专属）
 */
export const WANDERER_GATHERING: CompetitionConfig = {
  id: 'wanderer_gathering',
  name: '游侠大会',
  type: 'regional',
  level: 'b',
  description: '散修们的盛会，无门无派者的比武擂台',
  
  requirements: {
    requiredBackgrounds: ['solo'],
  },
  
  format: {
    type: 'double_elimination',
    rounds: 5,
    matchDuration: 200,
  },
  
  rewards: {
    participation: { gold: 150, cultivation: 300 },
    roundWins: {
      1: { gold: 100, cultivation: 200, reputation: 8 },
      2: { gold: 200, cultivation: 400, reputation: 20 },
      3: { gold: 400, cultivation: 800, reputation: 40 },
      4: { gold: 800, cultivation: 1600, reputation: 80 },
    },
    champion: { 
      gold: 2000, 
      cultivation: 8000, 
      reputation: 150, 
      title: '散修第一人' 
    },
    runnerUp: { 
      gold: 1000, 
      cultivation: 4000, 
      reputation: 100, 
      title: '散修第二' 
    },
  },
  
  schedule: {
    frequency: 'weekly',
    duration: 3,
    registrationDays: 7,
  },
  
  icon: '🌟',
};

/**
 * 师徒切磋（拜师专属）
 */
export const MASTER_DISCIPLE_TOURNEY: CompetitionConfig = {
  id: 'master_disciple_tourney',
  name: '师徒切磋',
  type: 'faction',
  level: 'd',
  description: '师父指导徒弟的切磋大会，展示师门功法的机会',
  
  requirements: {
    requiredBackgrounds: ['master'],
  },
  
  format: {
    type: 'single_elimination',
    rounds: 3,
    matchDuration: 150,
  },
  
  rewards: {
    participation: { gold: 50, cultivation: 100 },
    roundWins: {
      1: { gold: 30, cultivation: 80, reputation: 2 },
      2: { gold: 60, cultivation: 150, reputation: 5 },
    },
    champion: { 
      gold: 300, 
      cultivation: 800, 
      reputation: 30, 
      title: '得意门生' 
    },
    runnerUp: { 
      gold: 150, 
      cultivation: 400, 
      reputation: 15, 
      title: '优秀弟子' 
    },
  },
  
  schedule: {
    frequency: 'weekly',
    duration: 2,
    registrationDays: 7,
  },
  
  icon: '🎓',
};

/**
 * 历练试炼（通用）
 */
export const TRIAL_CHALLENGE: CompetitionConfig = {
  id: 'trial_challenge',
  name: '历练试炼',
  type: 'trial',
  level: 'c',
  description: '考验综合实力的试炼挑战，完成全部关卡可获得丰厚奖励',
  
  requirements: {
    minRealm: 0,
  },
  
  format: {
    type: 'single_elimination',
    rounds: 4,
    matchDuration: 120,
  },
  
  rewards: {
    participation: { gold: 30, cultivation: 50 },
    roundWins: {
      1: { gold: 20, cultivation: 40, reputation: 1 },
      2: { gold: 40, cultivation: 80, reputation: 3 },
      3: { gold: 80, cultivation: 150, reputation: 8 },
      4: { gold: 200, cultivation: 400, reputation: 20 },
    },
    champion: { 
      gold: 500, 
      cultivation: 1500, 
      reputation: 50, 
      title: '试炼通关者' 
    },
    runnerUp: { 
      gold: 250, 
      cultivation: 800, 
      reputation: 25, 
      title: '试炼接近通关' 
    },
  },
  
  schedule: {
    frequency: 'daily',
    duration: 1,
    registrationDays: 1,
  },
  
  icon: '🏔️',
};

/**
 * 所有比赛配置
 */
export const ALL_COMPETITIONS: CompetitionConfig[] = [
  WORLD_WUSHU_CONFERENCE,
  FACTION_CHAMPIONSHIP,
  FAMILY_CHAMPIONSHIP,
  WANDERER_GATHERING,
  MASTER_DISCIPLE_TOURNEY,
  TRIAL_CHALLENGE,
];

/**
 * 根据背景获取可用比赛
 */
export function getCompetitionsForBackground(background: string): CompetitionConfig[] {
  return ALL_COMPETITIONS.filter(comp => {
    if (!comp.requirements.requiredBackgrounds) return true;
    return comp.requirements.requiredBackgrounds.includes(background);
  });
}

/**
 * 根据境界获取可用比赛
 */
export function getCompetitionsForRealm(realm: number): CompetitionConfig[] {
  return ALL_COMPETITIONS.filter(comp => {
    if (comp.requirements.minRealm && realm < comp.requirements.minRealm) return false;
    if (comp.requirements.maxRealm && realm > comp.requirements.maxRealm) return false;
    return true;
  });
}

/**
 * 获取比赛等级颜色
 */
export function getCompetitionLevelColor(level: CompetitionLevel): string {
  const colors: Record<CompetitionLevel, string> = {
    s: 'text-rose-600',
    a: 'text-orange-600',
    b: 'text-purple-600',
    c: 'text-blue-600',
    d: 'text-green-600',
  };
  return colors[level];
}

/**
 * 获取比赛等级名称
 */
export function getCompetitionLevelName(level: CompetitionLevel): string {
  const names: Record<CompetitionLevel, string> = {
    s: 'S级',
    a: 'A级',
    b: 'B级',
    c: 'C级',
    d: 'D级',
  };
  return names[level];
}
