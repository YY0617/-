/**
 * Competition & Ranking Slice - 比赛和排行榜状态管理
 */
import { useGameStore } from '../gameStore';
import type { StateCreator } from 'zustand';
import type { FullStore } from './types';
import type { CompetitionConfig } from '../../config/competitionConfig';
import type { RankingEntry, RankingType } from '../../config/rankingConfig';
import { ALL_COMPETITIONS, getCompetitionsForBackground, getCompetitionsForRealm } from '../../config/competitionConfig';
import { RANKING_CONFIGS, generateRanking, updateRanking, RankingNPC } from '../../config/rankingConfig';
import { generateCompetitionOpponent, type CompetitionOpponent } from '../../data/npcTemplates';
import { calculateCombatPower } from '../../utils/gameUtils';

export interface CompetitionSchedule {
  competitionId: string;
  nextAvailableTime: number; // 游戏内时间（秒）
}

export interface CompetitionSlice {
  // 比赛系统
  availableCompetitions: CompetitionConfig[];
  registeredCompetitions: string[];
  activeCompetition: CompetitionConfig | null;
  competitionProgress: {
    currentRound: number;
    maxRounds: number;
    wins: number;
    losses: number;
  } | null;
  currentOpponent: CompetitionOpponent | null;
  // 比赛周期系统
  competitionSchedules: CompetitionSchedule[];
  
  // 排行榜系统
  rankings: Record<RankingType, RankingEntry[]>;
  rankingNPCs: Record<RankingType, RankingNPC[]>;
  lastRankingUpdate: number;
  
  // 动作
  refreshAvailableCompetitions: () => void;
  registerForCompetition: (competitionId: string) => { success: boolean; reason?: string };
  startCompetition: (competitionId: string) => boolean;
  generateOpponent: () => CompetitionOpponent | null;
  simulateCompetitionMatch: () => { won: boolean; reward?: { gold: number; cultivation: number; reputation: number }; opponent?: CompetitionOpponent };
  completeCompetition: () => void;
  withdrawFromCompetition: () => void;
  // 比赛周期相关
  updateCompetitionSchedules: (timePassed: number) => void;
  getCompetitionStatus: (competitionId: string) => 'available' | 'coming_soon' | 'completed' | 'registered';
  getNextAvailableTime: (competitionId: string) => number | null;
  
  // 排行榜动作
  refreshRankings: () => void;
  updateRankings: (daysElapsed: number) => void;
  getPlayerRanking: (type: RankingType) => RankingEntry | null;
  getCompetitionById: (id: string) => CompetitionConfig | undefined;
}

// 频率转换为游戏内时间（秒）
const FREQUENCY_TO_SECONDS: Record<string, number> = {
  'daily': 86400, // 1天 = 86400秒
  'weekly': 604800, // 7天
  'monthly': 2592000, // 30天
  'once': Number.MAX_SAFE_INTEGER, // 一次性
};

export const createCompetitionSlice: StateCreator<FullStore, [], [], CompetitionSlice> = (set, get) => ({
  // 初始状态
  availableCompetitions: [],
  registeredCompetitions: [],
  activeCompetition: null,
  competitionProgress: null,
  currentOpponent: null,
  competitionSchedules: [],
  
  rankings: {
    potential: [],
    combat: [],
    wealth: [],
    reputation: [],
    cultivation: [],
  },
  rankingNPCs: {
    potential: [],
    combat: [],
    wealth: [],
    reputation: [],
    cultivation: [],
  },
  lastRankingUpdate: Date.now(),
  
  // 刷新可用比赛
  refreshAvailableCompetitions: () => {
    const state = get();
    const player = {
      background: state.background?.id || 'solo',
      realm: state.stats.realm,
    };
    const gameTime = state.gameTime || 0;
    
    // 初始化比赛时间表（如果还没有）
    let schedules = [...state.competitionSchedules];
    ALL_COMPETITIONS.forEach(comp => {
      if (!schedules.find(s => s.competitionId === comp.id)) {
        // 初始设置为立即可用
        schedules.push({
          competitionId: comp.id,
          nextAvailableTime: gameTime,
        });
      }
    });
    
    // 根据玩家背景筛选可用比赛
    let competitions = getCompetitionsForBackground(player.background);
    
    // 再根据境界筛选
    competitions = competitions.filter(comp => {
      if (comp.requirements.minRealm && player.realm < comp.requirements.minRealm) return false;
      if (comp.requirements.maxRealm && player.realm > comp.requirements.maxRealm) return false;
      return true;
    });
    
    // 根据周期时间筛选
    competitions = competitions.filter(comp => {
      const schedule = schedules.find(s => s.competitionId === comp.id);
      if (!schedule) return true;
      return schedule.nextAvailableTime <= gameTime;
    });
    
    // 过滤掉已注册的比赛
    competitions = competitions.filter(c => !state.registeredCompetitions.includes(c.id));
    
    set({ availableCompetitions: competitions, competitionSchedules: schedules });
  },
  
  // 更新比赛周期时间
  updateCompetitionSchedules: (timePassed: number) => {
    const state = get();
    // 这里不需要主动做什么，下次refreshAvailableCompetitions时会自动检查
  },
  
  // 获取比赛状态
  getCompetitionStatus: (competitionId: string) => {
    const state = get();
    const gameTime = state.gameTime || 0;
    
    if (state.registeredCompetitions.includes(competitionId)) {
      return 'registered';
    }
    
    const schedule = state.competitionSchedules.find(s => s.competitionId === competitionId);
    if (schedule && schedule.nextAvailableTime > gameTime) {
      return 'coming_soon';
    }
    
    return 'available';
  },
  
  // 获取下次可用时间
  getNextAvailableTime: (competitionId: string) => {
    const state = get();
    const schedule = state.competitionSchedules.find(s => s.competitionId === competitionId);
    return schedule ? schedule.nextAvailableTime : null;
  },
  
  // 报名比赛
  registerForCompetition: (competitionId: string): { success: boolean; reason?: string } => {
    const competition = ALL_COMPETITIONS.find(c => c.id === competitionId);
    if (!competition) return { success: false, reason: '比赛不存在' };
    
    const state = get();
    
    // 检查是否有资格 - 境界要求
    if (competition.requirements.minRealm && state.stats.realm < competition.requirements.minRealm) {
      return { success: false, reason: `境界不足，需要${competition.requirements.minRealm}阶以上` };
    }
    
    // 检查是否有资格 - 背景要求
    if (competition.requirements.requiredBackgrounds && 
        !competition.requirements.requiredBackgrounds.includes(state.background?.id || '')) {
      return { success: false, reason: '背景不符，无法参加此比赛' };
    }
    
    // 扣除报名费（如果有）
    const registrationFee = Math.floor(competition.rewards.participation.gold * 0.5);
    if (state.gold < registrationFee) {
      return { success: false, reason: `灵石不足，需要${registrationFee}灵石` };
    }
    
    set(state => ({
      registeredCompetitions: [...state.registeredCompetitions, competitionId],
      gold: state.gold - registrationFee,
    }));
    
    return { success: true };
  },
  
  // 生成对手
  generateOpponent: () => {
    const state = get();
    const playerCombatPower = calculateCombatPower(state.stats);
    const opponent = generateCompetitionOpponent(
      state.stats.realm,
      state.stats.subLevel,
      playerCombatPower
    );
    set({ currentOpponent: opponent });
    return opponent;
  },
  
  // 开始比赛
  startCompetition: (competitionId: string) => {
    const competition = ALL_COMPETITIONS.find(c => c.id === competitionId);
    if (!competition) return false;
    
    const state = get();
    const playerCombatPower = calculateCombatPower(state.stats);
    const opponent = generateCompetitionOpponent(
      state.stats.realm,
      state.stats.subLevel,
      playerCombatPower
    );
    
    set({
      activeCompetition: competition,
      competitionProgress: {
        currentRound: 1,
        maxRounds: competition.format.rounds,
        wins: 0,
        losses: 0,
      },
      currentOpponent: opponent,
    });
    
    return true;
  },
  
  // 模拟比赛回合
  simulateCompetitionMatch: () => {
    const state = get();
    const competition = state.activeCompetition;
    const progress = state.competitionProgress;
    let opponent = state.currentOpponent;
    
    if (!competition || !progress) {
      return { won: false };
    }
    
    // 如果没有对手，生成一个
    if (!opponent) {
      const playerCombatPower = calculateCombatPower(state.stats);
      opponent = generateCompetitionOpponent(
        state.stats.realm,
        state.stats.subLevel,
        playerCombatPower
      );
    }
    
    // 计算胜负（基于玩家战斗力与对手差距）
    const playerCombatPower = calculateCombatPower(state.stats);
    const baseWinRate = 0.5;
    const powerRatio = playerCombatPower / opponent.combatPower;
    const winRate = Math.min(0.9, Math.max(0.1, baseWinRate * powerRatio));
    
    const won = Math.random() < winRate;
    
    // 更新进度
    const newProgress = {
      ...progress,
      currentRound: progress.currentRound + 1,
      wins: progress.wins + (won ? 1 : 0),
      losses: progress.losses + (won ? 0 : 1),
    };
    
    // 计算奖励
    let reward: { gold: number; cultivation: number; reputation: number } | undefined;
    if (won) {
      reward = competition.rewards.roundWins[progress.currentRound] || competition.rewards.participation;
    }
    
    // 如果比赛还没结束，生成下一个对手
    let nextOpponent: CompetitionOpponent | null = null;
    if (newProgress.currentRound <= newProgress.maxRounds) {
      nextOpponent = generateCompetitionOpponent(
        state.stats.realm,
        state.stats.subLevel,
        playerCombatPower
      );
    }
    
    set({ 
      competitionProgress: newProgress,
      currentOpponent: nextOpponent
    });
    
    return { won, reward, opponent };
  },
  
  // 完成比赛
  completeCompetition: () => {
    const state = get();
    const competition = state.activeCompetition;
    const progress = state.competitionProgress;
    
    if (!competition || !progress) return;
    
    // 根据玩家境界获取奖励倍率
    const realmMultiplier = getRealmRewardMultiplier(state.stats.realm);
    
    // 计算最终奖励
    let finalReward = { gold: 0, cultivation: 0, reputation: 0 };
    
    if (progress.wins === progress.maxRounds) {
      // 冠军奖励
      finalReward = {
        gold: Math.floor(competition.rewards.champion.gold * realmMultiplier),
        cultivation: Math.floor(competition.rewards.champion.cultivation * realmMultiplier),
        reputation: Math.floor(competition.rewards.champion.reputation * realmMultiplier),
      };
    } else if (progress.wins === progress.maxRounds - 1) {
      // 亚军奖励
      finalReward = {
        gold: Math.floor(competition.rewards.runnerUp.gold * realmMultiplier),
        cultivation: Math.floor(competition.rewards.runnerUp.cultivation * realmMultiplier),
        reputation: Math.floor(competition.rewards.runnerUp.reputation * realmMultiplier),
      };
    } else {
      // 按胜场发放奖励
      for (let i = 1; i <= progress.wins; i++) {
        const roundReward = competition.rewards.roundWins[i];
        if (roundReward) {
          finalReward.gold += Math.floor(roundReward.gold * realmMultiplier);
          finalReward.cultivation += Math.floor(roundReward.cultivation * realmMultiplier);
          finalReward.reputation += Math.floor(roundReward.reputation * realmMultiplier);
        }
      }
      // 参与奖
      finalReward.gold += Math.floor(competition.rewards.participation.gold * realmMultiplier);
      finalReward.cultivation += Math.floor(competition.rewards.participation.cultivation * realmMultiplier);
    }
    
    // 更新比赛周期时间
    const gameTime = state.gameTime || 0;
    const interval = FREQUENCY_TO_SECONDS[competition.schedule.frequency] || FREQUENCY_TO_SECONDS['weekly'];
    const nextAvailable = gameTime + interval;
    
    const newSchedules = state.competitionSchedules.map(s => {
      if (s.competitionId === competition.id) {
        return { ...s, nextAvailableTime: nextAvailable };
      }
      return s;
    });
    
    // 应用奖励
    set(state => ({
      gold: state.gold + finalReward.gold,
      stats: {
        ...state.stats,
        cultivation: state.stats.cultivation + finalReward.cultivation,
      },
      reputation: {
        ...state.reputation,
        general: (state.reputation.general || 0) + finalReward.reputation,
      },
      activeCompetition: null,
      competitionProgress: null,
      currentOpponent: null,
      registeredCompetitions: state.registeredCompetitions.filter(id => id !== competition.id),
      competitionSchedules: newSchedules,
    }));
  },
  
  // 退出比赛
  withdrawFromCompetition: () => {
    set({
      activeCompetition: null,
      competitionProgress: null,
      currentOpponent: null,
    });
  },
  
  // 刷新排行榜
  refreshRankings: () => {
    const state = get();
    const playerStats = {
      name: state.playerName,
      realmName: getRealmName(state.stats.realm, state.stats.subLevel),
      value: 0,
      realm: state.stats.realm,
      subLevel: state.stats.subLevel,
    };
    
    const newRankings: Record<RankingType, RankingEntry[]> = {} as any;
    const newNPCs: Record<RankingType, RankingNPC[]> = {} as any;
    
    const rankingTypes: RankingType[] = ['potential', 'combat', 'wealth', 'reputation', 'cultivation'];
    
    rankingTypes.forEach(type => {
      // 根据类型设置玩家值
      const playerEntry = { ...playerStats };
      switch (type) {
        case 'combat':
          playerEntry.value = calculateCombatPower(state.stats);
          break;
        case 'wealth':
          playerEntry.value = state.gold;
          break;
        case 'reputation':
          playerEntry.value = state.reputation.general || 0;
          break;
        case 'cultivation':
          playerEntry.value = state.stats.cultivation;
          break;
        default:
          playerEntry.value = state.stats.intelligence * 10 + state.stats.luck * 5;
      }
      
      const ranking = generateRanking(type, 30, playerEntry, state.rankingNPCs[type]);
      newRankings[type] = ranking;
      newNPCs[type] = (ranking.filter(e => e.npcId).map(e => {
        const existing = state.rankingNPCs[type]?.find(n => n.id === e.npcId);
        return existing || { id: e.npcId!, name: e.name, realmName: e.realmName } as RankingNPC;
      }));
    });
    
    set({
      rankings: newRankings,
      rankingNPCs: newNPCs,
      lastRankingUpdate: Date.now(),
    });
  },
  
  // 更新排行榜（时间流逝）
  updateRankings: (daysElapsed: number) => {
    const state = get();
    
    const newRankings = { ...state.rankings };
    
    (Object.keys(newRankings) as RankingType[]).forEach(type => {
      newRankings[type] = updateRanking(newRankings[type], daysElapsed);
    });
    
    set({ rankings: newRankings });
  },
  
  // 获取玩家排名
  getPlayerRanking: (type: RankingType) => {
    const rankings = get().rankings[type];
    return rankings.find(r => r.isPlayer) || null;
  },
  
  // 根据ID获取比赛
  getCompetitionById: (id: string) => {
    return ALL_COMPETITIONS.find(c => c.id === id);
  },
});

function getRealmName(realm: number, subLevel: number): string {
  const realms = ['煅体', '玄脉', '武心', '灵现', '凌虚', '悟道', '冠绝', '绝圣', '圣君', '君帝'];
  const subLevels = ['初期', '中期', '后期', '圆满'];
  return (realms[realm] || '未知') + (subLevels[subLevel] || '');
}

// 根据境界获取奖励倍率
function getRealmRewardMultiplier(realm: number): number {
  const multipliers: Record<number, number> = {
    0: 1.0,   // 煅体境
    1: 1.2,   // 玄脉境
    2: 1.5,   // 武心境
    3: 2.0,   // 灵现境
    4: 2.5,   // 凌虚境
    5: 3.0,   // 悟道境
    6: 4.0,   // 冠绝境
    7: 5.0,   // 绝圣境
    8: 7.0,   // 圣君境
    9: 10.0,  // 君帝境
  };
  return multipliers[realm] || 1.0;
}
