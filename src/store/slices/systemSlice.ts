/**
 * systemSlice — meta systems: buffs, announcements, dao heart, enlightenment, demon heart, karma, ad watch, battle
 */
import type { StateCreator } from 'zustand';
import type { FullStore } from './types';
import type {
  Buff, PlayerStats, DaoHeartState, EnlightenmentState,
  DemonHeartState, KarmaState, AdWatchState, TimeOfDay,
} from '../../data/types';
import { Announcement, createAnnouncement } from '../../data/announcements';
import { WEATHER_EFFECTS, TIME_EFFECTS } from '../../data/realmConfig';

const NUMERIC_STAT_KEYS: (keyof PlayerStats)[] = [
  'realm', 'subLevel', 'cultivation', 'cultivationNext',
  'hp', 'hpMax', 'spiritualPower', 'spiritualPowerMax',
  'attack', 'defense', 'agility', 'intelligence', 'luck',
  'spiritualRoot', 'stamina', 'staminaMax',
  'critRate', 'evasionRate', 'lifesteal',
  'attackBonus', 'defenseBonus',
  'tempAttackBonus', 'tempDefenseBonus', 'tempCritBonus',
  'breakthroughBonusRate', 'spiritTreasureBonusRate'
];

function applyStatModifier(current: PlayerStats, modifier: Partial<Record<keyof PlayerStats, number>>, isAdd: boolean): PlayerStats {
  const result = { ...current };
  for (const key of NUMERIC_STAT_KEYS) {
    const modValue = modifier[key];
    if (typeof modValue === 'number') {
      const currentVal = current[key];
      if (typeof currentVal === 'number') {
        (result as any)[key] = isAdd ? currentVal + modValue : currentVal - modValue;
      }
    }
  }
  return result;
}

function getInitialDaoHeart(): DaoHeartState {
  return { righteousPoints: 0, evilPoints: 0, currentType: 'neutral', records: [] };
}

function getInitialEnlightenment(): EnlightenmentState {
  return { active: false, currentEvent: null, remainingTime: 0 };
}

function getInitialDemonHeart(): DemonHeartState {
  return { enabled: false, strongestDefeated: null, timesChallenged: 0, timesVictory: 0 };
}

function getInitialKarma(): KarmaState {
  return { events: [], currentKarma: 0 };
}

function getInitialAdWatch(): AdWatchState {
  return { records: [], todayCount: 0 };
}

export interface TutorialState {
  completed: boolean;
  currentStep: number;
  highlightedElements: string[];
}

export interface AdRewardState {
  doubleCultivation: boolean;
  breakthroughBonusActive: boolean;
}

export interface RestState {
  todayDate: string;
  remainingCount: number;
  adBonusUsed: number; // 今天使用广告获取的额外次数
}

export interface SystemSlice {
  // State
  battleHistory: string[];
  buffs: Buff[];
  announcements: Announcement[];
  daoHeart: DaoHeartState;
  enlightenment: EnlightenmentState;
  demonHeart: DemonHeartState;
  karma: KarmaState;
  adWatch: AdWatchState;
  adRewards: AdRewardState;
  rest: RestState;
  toasts: { id: number; msg: string; type: 'success' | 'error' | 'info' }[];
  battleStrategy: 'aggressive' | 'defensive' | 'balanced';
  tutorial: TutorialState;
  showBreakthrough: boolean;

  // Actions
  addBattleLog: (log: string) => void;
  clearBattleLog: () => void;
  addBuff: (buff: Omit<Buff, 'remainingDuration'>) => void;
  removeBuff: (buffId: string) => void;
  updateBuffs: (timePassed: number) => void;
  getEffectiveStats: () => PlayerStats;
  addAnnouncement: (type: Announcement['type'], title: string, content: string, priority?: Announcement['priority']) => void;
  markAnnouncementRead: (id: string) => void;
  clearAllAnnouncements: () => void;
  markAllAnnouncementsRead: () => void;
  getUnreadCount: () => number;
  recordDaoHeartChoice: (choice: 'help' | 'ignore' | 'harm' | 'trade_honest' | 'trade_cheat', description: string, npcId?: string) => void;
  getDaoHeartBonus: () => { breakthroughBonus: number; luckBonus: number; eventBonus: number };
  triggerEnlightenment: () => boolean;
  selectEnlightenmentChoice: (choiceId: string) => Record<string, number> | undefined;
  skipEnlightenment: () => void;
  startDemonHeartBattle: () => { success: boolean; message: string };
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  recordDemonHeartVictory: (monsterId: string, realm: number) => void;
  addKarmaEvent: (type: string, description: string, npcId?: string) => void;
  getKarmaBonus: () => { encounterBonus: number; treasureChance: number; npcGiftChance: number };
  getTimelyBonus: () => { cultivationBonus: number; treasureChance: number };
  watchAd: (type: string) => void;
  canWatchAd: () => boolean;
  getAdScene: (type: string) => { name: string; description: string; benefit: string } | undefined;
  setAdReward: (type: keyof AdRewardState, value: boolean) => void;
  useDoubleCultivation: () => boolean;
  hasBreakthroughBonus: () => boolean;
  useBreakthroughBonus: () => boolean;
  selectBattleStrategy: (strategy: 'aggressive' | 'defensive' | 'balanced') => void;
  triggerBreakthroughEffect: () => void;
  getTimeOfDay: () => TimeOfDay;
  getCultivationBonus: () => number;
  getBattleBonus: () => number;
  nextTutorialStep: () => void;
  setTutorialStep: (step: number) => void;
  completeTutorial: () => void;
  // Rest actions
  initRestCount: () => void;
  checkRestCount: () => { canRest: boolean; remaining: number };
  useRest: () => boolean;
  addRestBonusFromAd: () => boolean;
  loadGameState: (state: Partial<FullStore>) => void;
}

function getInitialTutorial(): TutorialState {
  return { completed: false, currentStep: 0, highlightedElements: [] };
}

export const createSystemSlice: StateCreator<FullStore, [], [], SystemSlice> = (set, get) => ({
  // ---- Initial state ----
  battleHistory: [],
  buffs: [],
  announcements: [
    createAnnouncement('system', '欢迎来到修炼世界', '道友，欢迎踏上修炼之路！愿你早日得道飞升。', 'high'),
  ],
  daoHeart: getInitialDaoHeart(),
  enlightenment: getInitialEnlightenment(),
  demonHeart: getInitialDemonHeart(),
  karma: getInitialKarma(),
  adWatch: getInitialAdWatch(),
  adRewards: {
    doubleCultivation: false,
    breakthroughBonusActive: false,
  },
  rest: {
    todayDate: '',
    remainingCount: 5,
    adBonusUsed: 0,
  },
  toasts: [],
  battleStrategy: 'balanced',
  tutorial: getInitialTutorial(),
  showBreakthrough: false,

  // ---- Actions ----
  addBattleLog: (log) => set((s) => ({
    battleHistory: [...s.battleHistory.slice(-99), log],
  })),

  clearBattleLog: () => set({ battleHistory: [] }),

  addBuff: (buff) => set((s) => ({
    buffs: [...s.buffs, { ...buff, remainingDuration: buff.duration } as Buff],
  })),

  removeBuff: (buffId) => set((s) => ({
    buffs: s.buffs.filter(b => b.id !== buffId),
  })),

  updateBuffs: (timePassed) => set((s) => ({
    buffs: s.buffs.map(buff => ({
      ...buff,
      remainingDuration: buff.remainingDuration - timePassed,
    })).filter(buff => buff.remainingDuration > 0),
  })),

  getEffectiveStats: () => {
    const s = get();
    let stats = { ...s.stats };
    const statsToAdd: Partial<Record<keyof PlayerStats, number>> = {};
    s.buffs.forEach(buff => {
      Object.keys(buff.effect).forEach(key => {
        const statKey = key as keyof PlayerStats;
        if (NUMERIC_STAT_KEYS.includes(statKey) && typeof buff.effect[statKey] === 'number') {
          statsToAdd[statKey] = (statsToAdd[statKey] || 0) + (buff.effect[statKey] as number);
        }
      });
    });
    stats = applyStatModifier(stats, statsToAdd, true);
    return stats;
  },

  addAnnouncement: (type, title, content, priority = 'medium') => set((s) => {
    const newAnnouncement = createAnnouncement(type, title, content, priority);
    return {
      announcements: [newAnnouncement, ...s.announcements].slice(0, 50),
    };
  }),

  markAnnouncementRead: (id) => set((s) => ({
    announcements: s.announcements.map(ann =>
      ann.id === id ? { ...ann, isRead: true } : ann
    ),
  })),

  clearAllAnnouncements: () => set({ announcements: [] }),

  markAllAnnouncementsRead: () => set((s) => ({
    announcements: s.announcements.map(ann => ({ ...ann, isRead: true })),
  })),

  getUnreadCount: () => {
    return get().announcements.filter(a => !a.isRead).length;
  },

  recordDaoHeartChoice: (choice, description, npcId?) => set((s) => {
    const choiceEffects: Record<string, { righteous: number; evil: number }> = {
      help: { righteous: 3, evil: 0 },
      ignore: { righteous: 0, evil: 2 },
      harm: { righteous: 0, evil: 5 },
      trade_honest: { righteous: 2, evil: 0 },
      trade_cheat: { righteous: 0, evil: 3 },
    };

    const effects = choiceEffects[choice];
    let newRighteous = s.daoHeart.righteousPoints + effects.righteous;
    let newEvil = s.daoHeart.evilPoints + effects.evil;

    let newType: 'righteous' | 'evil' | 'neutral' = 'neutral';
    if (newRighteous > newEvil + 10) newType = 'righteous';
    else if (newEvil > newRighteous + 10) newType = 'evil';

    return {
      daoHeart: {
        ...s.daoHeart,
        righteousPoints: newRighteous,
        evilPoints: newEvil,
        currentType: newType,
        records: [
          ...s.daoHeart.records.slice(-49),
          {
            id: `dao_${Date.now()}`,
            timestamp: Date.now(),
            choice,
            description,
            npcId,
          },
        ],
      },
    };
  }),

  getDaoHeartBonus: () => {
    const s = get();
    const type = s.daoHeart.currentType;
    switch (type) {
      case 'righteous': return { breakthroughBonus: 0.05, luckBonus: 0.1, eventBonus: 0.1 };
      case 'evil': return { breakthroughBonus: 0.03, luckBonus: 0.15, eventBonus: 0.05 };
      default: return { breakthroughBonus: 0, luckBonus: 0, eventBonus: 0.1 };
    }
  },

  triggerEnlightenment: () => {
    const events = [
      {
        id: 'enlighten_1',
        title: '十年磨一剑',
        description: '你决定闭关修炼，将全部心神投入剑道之中。',
        choices: [
          { id: 'e1_a', text: '以剑气磨砺心志', effects: { attack: 5, cultivation: 100 } as Record<string, number>, description: '剑意入体，攻击力永久提升' },
          { id: 'e1_b', text: '以心境映照剑道', effects: { intelligence: 3, cultivation: 80 } as Record<string, number>, description: '心境通明，悟性提升' },
        ],
      },
      {
        id: 'enlighten_2',
        title: '红尘炼心',
        description: '你决定下山游历，在红尘中感悟天道。',
        choices: [
          { id: 'e2_a', text: '扶危济困，积累功德', effects: { luck: 3, cultivation: 120 } as Record<string, number>, description: '善行积德，运气提升', daoHeart: 'righteous' as const },
          { id: 'e2_b', text: '看透世情，冷眼旁观', effects: { intelligence: 5, cultivation: 100 } as Record<string, number>, description: '洞察人心，悟性提升' },
        ],
      },
      {
        id: 'enlighten_3',
        title: '灵根觉醒',
        description: '你感应到体内灵根的异动，似乎要发生蜕变。',
        choices: [
          { id: 'e3_a', text: '引导灵根突破', effects: { spiritualRoot: 5, cultivation: 150 } as Record<string, number>, description: '灵根升华，资质提升' },
          { id: 'e3_b', text: '压制异动，稳扎稳打', effects: { defense: 3, cultivation: 80 } as Record<string, number>, description: '厚积薄发，防御提升' },
        ],
      },
    ];

    const event = events[Math.floor(Math.random() * events.length)];
    set({
      enlightenment: {
        active: true,
        currentEvent: event,
        remainingTime: 600000,
      },
    });
    return true;
  },

  selectEnlightenmentChoice: (choiceId) => {
    const s = get();
    if (!s.enlightenment.active || !s.enlightenment.currentEvent) return;

    const choice = s.enlightenment.currentEvent.choices.find(c => c.id === choiceId);
    if (!choice) return;

    let newStats = { ...s.stats };
    let gains: Record<string, number> = {};

    if (choice.effects.cultivation) {
      newStats.cultivation += choice.effects.cultivation;
      gains.cultivation = choice.effects.cultivation;
    }
    if (choice.effects.attack) {
      newStats.attack += choice.effects.attack;
      gains.attack = choice.effects.attack;
    }
    if (choice.effects.defense) {
      newStats.defense += choice.effects.defense;
      gains.defense = choice.effects.defense;
    }
    if (choice.effects.intelligence) {
      newStats.intelligence += choice.effects.intelligence;
      gains.intelligence = choice.effects.intelligence;
    }
    if (choice.effects.luck) {
      newStats.luck += choice.effects.luck;
      gains.luck = choice.effects.luck;
    }
    if (choice.effects.spiritualRoot) {
      newStats.spiritualRoot += choice.effects.spiritualRoot;
      gains.spiritualRoot = choice.effects.spiritualRoot;
    }
    if (choice.effects.hp) {
      newStats.hpMax += choice.effects.hp;
      newStats.hp += choice.effects.hp;
      gains.hp = choice.effects.hp;
    }
    if (choice.effects.spiritualPower) {
      newStats.spiritualPowerMax += choice.effects.spiritualPower;
      newStats.spiritualPower += choice.effects.spiritualPower;
      gains.spiritualPower = choice.effects.spiritualPower;
    }

    if (choice.daoHeart === 'righteous') {
      set((state) => ({
        daoHeart: {
          ...state.daoHeart,
          righteousPoints: state.daoHeart.righteousPoints + 3,
        },
      }));
    }

    set({
      enlightenment: { active: false, currentEvent: null, remainingTime: 0 },
      stats: newStats,
    });

    return gains;
  },

  skipEnlightenment: () => set({
    enlightenment: { active: false, currentEvent: null, remainingTime: 0 },
  }),

  startDemonHeartBattle: () => {
    const s = get();
    if (s.stats.cultivation < 200) return { success: false, message: '修为不足，无法触发心魔' };
    set((state) => ({
      demonHeart: { ...state.demonHeart, enabled: true },
    }));
    return { success: true, message: '心魔降临！' };
  },

  recordDemonHeartVictory: (monsterId, realm) => set((s) => {
    const newTimesVictory = s.demonHeart.timesVictory + 1;
    const rewards = {
      cultivation: Math.floor(200 * Math.pow(1.5, realm)),
      attack: 5 + realm,
      defense: 3 + realm,
    };

    let newStats = { ...s.stats };
    newStats.cultivation += rewards.cultivation;
    newStats.attack += rewards.attack;
    newStats.defense += rewards.defense;

    return {
      demonHeart: {
        ...s.demonHeart,
        strongestDefeated: { monsterId, realm, timestamp: Date.now() },
        timesVictory: newTimesVictory,
        enabled: false,
      },
      stats: newStats,
    };
  }),

  addKarmaEvent: (type, description, npcId?) => set((s) => {
    let karmaChange = 0;
    if (type === 'npc_help') karmaChange = 10;
    else if (type === 'npc_betray') karmaChange = -10;
    else if (type === 'monster_kill') karmaChange = -1;

    return {
      karma: {
        ...s.karma,
        events: [
          ...s.karma.events.slice(-49),
          { id: `karma_${Date.now()}`, type, description, npcId, timestamp: Date.now() },
        ],
        currentKarma: Math.max(-100, Math.min(100, s.karma.currentKarma + karmaChange)),
      },
    };
  }),

  getKarmaBonus: () => {
    const s = get();
    const karma = s.karma.currentKarma;
    if (karma >= 50) return { encounterBonus: 0.2, treasureChance: 0.15, npcGiftChance: 0.3 };
    if (karma >= 20) return { encounterBonus: 0.1, treasureChance: 0.08, npcGiftChance: 0.15 };
    if (karma <= -50) return { encounterBonus: 0.15, treasureChance: 0.12, npcGiftChance: -0.1 };
    if (karma <= -20) return { encounterBonus: 0.05, treasureChance: 0.05, npcGiftChance: -0.05 };
    return { encounterBonus: 0, treasureChance: 0, npcGiftChance: 0 };
  },

  getTimelyBonus: () => {
    const s = get();
    const hour = Math.floor(s.gameTime / 3600) % 24;
    let cultivationBonus = 1.0;
    let treasureChance = 0.1;

    if (hour >= 22 || hour < 5) {
      cultivationBonus = 1.3;
      treasureChance = 0.2;
    } else if (hour >= 5 && hour < 7) {
      cultivationBonus = 1.15;
    } else if (hour >= 11 && hour < 13) {
      cultivationBonus = 0.95;
    }

    if (s.weather === 'rainy') {
      cultivationBonus *= 0.9;
      treasureChance *= 1.3;
    } else if (s.weather === 'stormy') {
      cultivationBonus *= 0.8;
      treasureChance *= 1.5;
    } else if (s.weather === 'foggy') {
      treasureChance *= 1.2;
    }

    return { cultivationBonus, treasureChance };
  },

  watchAd: (type) => set((s) => ({
    adWatch: {
      records: [...s.adWatch.records.slice(-99), { type, timestamp: Date.now() }],
      todayCount: s.adWatch.todayCount + 1,
    },
  })),

  showToast: (msg, type = 'info') => set((s) => ({
    toasts: [...s.toasts, { id: Date.now(), msg, type }],
  })),

  canWatchAd: () => {
    const s = get();
    if (s.adWatch.records.length === 0) return true;
    const lastWatch = s.adWatch.records[s.adWatch.records.length - 1];
    return Date.now() - lastWatch.timestamp >= 30000;
  },

  getAdScene: (type) => {
    const scenes: Record<string, { name: string; description: string; benefit: string }> = {
      breakthrough_guardian: { name: '天劫护法', description: '请天劫护法助你渡劫', benefit: '突破成功率+30%' },
      enlightenment_speedup: { name: '顿悟加速', description: '加速顿悟进程', benefit: '立即进入顿悟状态' },
      realm_explore_speedup: { name: '秘境速通', description: '跳过秘境冷却', benefit: '立即进入秘境' },
      tianji_consult: { name: '天机咨询', description: '询问天机老人', benefit: '获得机缘精确位置' },
    };
    return scenes[type];
  },

  selectBattleStrategy: (strategy) => set((s) => {
    const bonuses: Record<string, { attackBonus: number; defenseBonus: number; critBonus?: number; evasionBonus?: number }> = {
      aggressive: { attackBonus: 0.12, defenseBonus: -0.08, critBonus: 0.04 },
      defensive: { attackBonus: -0.06, defenseBonus: 0.18, evasionBonus: 0.1 },
      balanced: { attackBonus: 0.03, defenseBonus: 0.03, critBonus: 0.02 },
    };
    const effect = bonuses[strategy];
    return {
      battleStrategy: strategy,
      stats: {
        ...s.stats,
        tempAttackBonus: effect.attackBonus,
        tempDefenseBonus: effect.defenseBonus,
        tempCritBonus: effect.critBonus || 0,
      },
    };
  }),

  getTimeOfDay: (): TimeOfDay => {
    const hour = Math.floor(get().gameTime / 3600);
    if (hour >= 5 && hour < 7) return 'dawn';
    if (hour >= 7 && hour < 11) return 'morning';
    if (hour >= 11 && hour < 13) return 'noon';
    if (hour >= 13 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 19) return 'dusk';
    return 'night';
  },

  getCultivationBonus: (): number => {
    const timeEffect = TIME_EFFECTS[get().getTimeOfDay()];
    const weatherEffect = WEATHER_EFFECTS[get().weather];
    return timeEffect.cultivationBonus * weatherEffect.cultivationBonus;
  },

  getBattleBonus: (): number => {
    const timeEffect = TIME_EFFECTS[get().getTimeOfDay()];
    const weatherEffect = WEATHER_EFFECTS[get().weather];
    return timeEffect.battleBonus * weatherEffect.battleBonus;
  },

  nextTutorialStep: () => set((s) => ({
    tutorial: {
      ...s.tutorial,
      currentStep: s.tutorial.currentStep + 1,
    },
  })),

  setTutorialStep: (step) => set((s) => ({
    tutorial: {
      ...s.tutorial,
      currentStep: step,
    },
  })),

  completeTutorial: () => set((s) => ({
    tutorial: {
      ...s.tutorial,
      completed: true,
    },
  })),

  triggerBreakthroughEffect: () => {
    set({ showBreakthrough: true });
    setTimeout(() => set({ showBreakthrough: false }), 3000);
  },
  
  // 广告奖励相关
  setAdReward: (type, value) => set((s) => ({
    adRewards: {
      ...s.adRewards,
      [type]: value,
    },
  })),
  
  useDoubleCultivation: () => {
    const s = get();
    if (s.adRewards.doubleCultivation) {
      set((state) => ({
        adRewards: {
          ...state.adRewards,
          doubleCultivation: false,
        },
      }));
      return true;
    }
    return false;
  },
  
  hasBreakthroughBonus: () => {
    return get().adRewards.breakthroughBonusActive;
  },
  
  useBreakthroughBonus: () => {
    const s = get();
    if (s.adRewards.breakthroughBonusActive) {
      set((state) => ({
        adRewards: {
          ...state.adRewards,
          breakthroughBonusActive: false,
        },
      }));
      return true;
    }
    return false;
  },

  // 初始化检查每天的休息次数（在useEffect中调用）
  initRestCount: () => {
    const s = get();
    const today = new Date().toISOString().split('T')[0];
    let rest = s.rest;

    // 如果日期变了，重置次数
    if (rest.todayDate !== today) {
      rest = {
        todayDate: today,
        remainingCount: 5,
        adBonusUsed: 0,
      };
      set({ rest });
    }
  },

  // 检查每天的休息次数（仅读取，不修改状态）
  checkRestCount: () => {
    const s = get();
    const today = new Date().toISOString().split('T')[0];
    let rest = s.rest;
    
    // 这里只检查是否需要更新，但不调用set()
    const needsUpdate = rest.todayDate !== today;
    
    return {
      canRest: !needsUpdate && rest.remainingCount > 0,
      remaining: needsUpdate ? 5 : rest.remainingCount,
    };
  },

  // 使用一次休息
  useRest: () => {
    const s = get();
    const today = new Date().toISOString().split('T')[0];
    let rest = s.rest;

    // 如果日期变了，重置次数
    if (rest.todayDate !== today) {
      rest = {
        todayDate: today,
        remainingCount: 5,
        adBonusUsed: 0,
      };
    }

    if (rest.remainingCount > 0) {
      set({
        rest: {
          ...rest,
          remainingCount: rest.remainingCount - 1,
        },
      });
      return true;
    }
    return false;
  },

  // 观看广告增加休息次数
  addRestBonusFromAd: () => {
    const s = get();
    const today = new Date().toISOString().split('T')[0];
    let rest = s.rest;

    // 如果日期变了，重置次数
    if (rest.todayDate !== today) {
      rest = {
        todayDate: today,
        remainingCount: 5,
        adBonusUsed: 0,
      };
    }

    // 每天最多通过广告增加3次
    if (rest.adBonusUsed < 3) {
      set({
        rest: {
          ...rest,
          remainingCount: rest.remainingCount + 3,
          adBonusUsed: rest.adBonusUsed + 1,
        },
      });
      return true;
    }
    return false;
  },

  loadGameState: (state: Partial<FullStore>) => {
    set(state);
  },
});
