/**
 * playerSlice — core player state and actions
 */
import { useGameStore } from '../gameStore';
import type { StateCreator } from 'zustand';
import type { FullStore } from './types';
import type {
  PlayerStats, InventoryItem, Equipment, Skill,
  Physique, Lingen, Background, Force, Master,
  EquipType, PhysiqueEffect,
} from '../../data/types';
import { getRealmConfig, getRealmStats, REALM_CONFIGS } from '../../data/realmConfig';
import { PHYSIQUES, LINGEN } from '../../data/characterData';
import { BREAKTHROUGH_PILLS } from '../../data/itemData';
import type { Sect, SectTask, SectTech } from '../../data/sectData';
import type { MasterDiscipleSystemState, Lesson } from '../../data/masterDiscipleData';
import type { RefineryState, RefineryRecipe } from '../../data/refineryData';

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

// ============================================================
// Initial state helpers
// ============================================================

function getInitialStats(): PlayerStats {
  const realmConfig = getRealmConfig(0);
  if (!realmConfig) {
    return {
      realm: 0, subLevel: 0, cultivation: 0, cultivationNext: 100,
      hp: 100, hpMax: 100, spiritualPower: 50, spiritualPowerMax: 50,
      attack: 10, defense: 5, agility: 5, intelligence: 5, luck: 3,
      spiritualRoot: 5, stamina: 100, staminaMax: 100,
      critRate: 0.15, evasionRate: 0, lifesteal: 0,
      tempAttackBonus: 0, tempDefenseBonus: 0, tempCritBonus: 0,
      daoFoundation: { level: 1, quality: 'mortal', bonusRate: 0, description: '凡人道基，根基浅薄' },
      breakthroughBonusItems: [],
      breakthroughBonusRate: 0,
      spiritTreasureBonusRate: 0,
    };
  }

  const stats = realmConfig.baseStats;
  return {
    realm: 0, subLevel: 0, cultivation: 0, cultivationNext: realmConfig.cultivationRequirements[0],
    hp: stats.hpMax[0], hpMax: stats.hpMax[0],
    spiritualPower: stats.spiritualPowerMax[0], spiritualPowerMax: stats.spiritualPowerMax[0],
    attack: stats.attack[0], defense: stats.defense[0],
    agility: stats.agility[0], intelligence: stats.intelligence[0], luck: stats.luck[0],
    spiritualRoot: 5, stamina: stats.staminaMax[0], staminaMax: stats.staminaMax[0],
    critRate: 0.15, evasionRate: 0, lifesteal: 0,
    tempAttackBonus: 0, tempDefenseBonus: 0, tempCritBonus: 0,
    daoFoundation: { level: 1, quality: 'mortal', bonusRate: 0, description: '凡人道基，根基浅薄' },
    breakthroughBonusItems: [],
    breakthroughBonusRate: 0,
    spiritTreasureBonusRate: 0,
  };
}

// ============================================================
// Slice interface
// ============================================================

export interface PlayerSlice {
  // State
  playerName: string;
  gold: number;
  stats: PlayerStats;
  playTime: number;
  inventory: InventoryItem[];
  equipment: Equipment;
  skills: Skill[];
  physique: Physique;
  lingen: Lingen;
  background: Background | null;
  force: Force | null;
  master: Master | null;
  gameStarted: boolean;
  totalCultivation: number;
  totalGold: number;
  statsRecord: {
    totalBattles: number;
    totalWins: number;
    totalMonstersKilled: number;
    totalBossesDefeated: number;
    totalPetBattles: number;
    totalSecretRealmsCompleted: number;
    totalCompetitionsParticipated: number;
    totalCompetitionsWon: number;
    totalItemsUsed: number;
    totalCultivationSessions: number;
    totalRestSessions: number;
    totalBreakthroughAttempts: number;
    totalBreakthroughSuccesses: number;
    totalDemonHeartVictories: number;
    totalEnlightenmentEvents: number;
    totalNPCInteractions: number;
    totalGiftsReceived: number;
    totalQuestsCompleted: number;
    totalAchievementsUnlocked: number;
    totalSpiritTreasuresAcquired: number;
    totalPetsAcquired: number;
    maxConsecutiveWins: number;
    currentConsecutiveWins: number;
    totalDamageDealt: number;
    totalDamageTaken: number;
    totalSpiritualPowerUsed: number;
    totalStaminaUsed: number;
    highestCultivation: number;
    highestGold: number;
    totalSectTasksCompleted: number;
    totalLessonsCompleted: number;
    totalItemsRefined: number;
    totalAlchemySessions: number;
    totalAlchemySuccesses: number;
    totalMaterialsGained: number;
    totalGoldGained: number;
    totalCultivationGained: number;
    totalEquipmentsAcquired: number;
  };

  sect: Sect | null;
  masterDisciple: MasterDiscipleSystemState | null;
  refinery: RefineryState | null;

  setPlayerName: (name: string) => void;
  setStats: (stats: Partial<PlayerStats>) => void;
  gainCultivation: (amount: number) => void;
  gainGold: (amount: number) => void;
  takeDamage: (amount: number) => void;
  heal: (amount: number) => void;
  useSpiritualPower: (amount: number) => boolean;
  restoreSpiritualPower: (amount: number) => void;
  useStamina: (amount: number) => boolean;
  recoverStamina: (amount: number) => void;
  addItem: (item: Omit<InventoryItem, 'quantity'>, qty?: number) => { success: boolean; msg: string };
  removeItem: (id: string, qty?: number) => void;
  equipItem: (item: InventoryItem) => void;
  unequipItem: (slot: EquipType) => void;
  addSkill: (skill: Skill) => void;
  levelUpSkill: (skillId: string) => void;
  setPhysique: (physique: Physique) => void;
  setLingen: (lingen: Lingen) => void;
  setBackground: (bg: Background) => void;
  setForce: (force: Force) => void;
  setMaster: (master: Master) => void;
  setGameStarted: (v: boolean) => void;
  useBreakthroughPill: (pillId: string) => { success: boolean; msg: string };
  enhanceDaoFoundation: (quality: 'mortal' | 'spirit' | 'immortal' | 'celestial' | 'divine') => { success: boolean; msg: string };
  resetGame: () => void;
  recordBattle: (won: boolean, isBoss: boolean, damageDealt: number, damageTaken: number) => void;
  recordPetBattle: (won: boolean) => void;
  recordSecretRealmComplete: () => void;
  recordCompetition: (won: boolean) => void;
  recordItemUsed: () => void;
  recordCultivation: () => void;
  recordRest: () => void;
  recordBreakthrough: (success: boolean) => void;
  trackDemonHeartVictory: () => void;
  recordEnlightenment: () => void;
  recordNPCInteraction: () => void;
  recordGiftReceived: () => void;
  recordQuestCompleted: () => void;
  recordAchievementUnlocked: () => void;
  recordSpiritTreasureAcquired: () => void;
  recordPetAcquired: () => void;

  setSect: (sect: Sect) => void;
  setMasterDisciple: (md: MasterDiscipleSystemState) => void;
  setRefinery: (refinery: RefineryState) => void;
  recordSectTaskCompleted: () => void;
  recordLessonCompleted: () => void;
  recordItemRefined: () => void;
  recordAlchemy: (success: boolean) => void;
  recordMaterialsGained: (count: number) => void;
  recordCultivationGained: (amount: number) => void;
  recordGoldGained: (amount: number) => void;
  recordEquipmentAcquired: () => void;
}

// ============================================================
// Slice creator
// ============================================================

export const createPlayerSlice: StateCreator<FullStore, [], [], PlayerSlice> = (set, get) => ({
  playerName: '',
  gold: 100,
  stats: getInitialStats(),
  playTime: 0,
  inventory: [
    { id: 'qi_pill', name: '淬体丹', type: 'consumable', description: '恢复50气血', price: 30, quantity: 5 },
    { id: 'spirit_pill', name: '通脉丹', type: 'consumable', description: '恢复30灵力', price: 25, quantity: 3 },
  ],
  equipment: { weapon: null, armor: null, accessory: null, boots: null, bracelet: null, waist: null },
  skills: [
    { id: 'basic_fist', name: '基础拳谱', description: '朴实无华的拳术', spiritualPowerCost: 5, damage: 15, level: 1, maxLevel: 5, element: 'neutral' },
  ],
  physique: PHYSIQUES[0],
  lingen: LINGEN[2],
  background: null,
  force: null,
  master: null,
  gameStarted: false,
  totalCultivation: 0,
  totalGold: 0,
  statsRecord: {
    totalBattles: 0,
    totalWins: 0,
    totalMonstersKilled: 0,
    totalBossesDefeated: 0,
    totalPetBattles: 0,
    totalSecretRealmsCompleted: 0,
    totalCompetitionsParticipated: 0,
    totalCompetitionsWon: 0,
    totalItemsUsed: 0,
    totalCultivationSessions: 0,
    totalRestSessions: 0,
    totalBreakthroughAttempts: 0,
    totalBreakthroughSuccesses: 0,
    totalDemonHeartVictories: 0,
    totalEnlightenmentEvents: 0,
    totalNPCInteractions: 0,
    totalGiftsReceived: 0,
    totalQuestsCompleted: 0,
    totalAchievementsUnlocked: 0,
    totalSpiritTreasuresAcquired: 0,
    totalPetsAcquired: 0,
    maxConsecutiveWins: 0,
    currentConsecutiveWins: 0,
    totalDamageDealt: 0,
    totalDamageTaken: 0,
    totalSpiritualPowerUsed: 0,
    totalStaminaUsed: 0,
    highestCultivation: 0,
    highestGold: 0,
    totalSectTasksCompleted: 0,
    totalLessonsCompleted: 0,
    totalItemsRefined: 0,
    totalAlchemySessions: 0,
    totalAlchemySuccesses: 0,
    totalMaterialsGained: 0,
    totalGoldGained: 0,
    totalCultivationGained: 0,
    totalEquipmentsAcquired: 0,
  },

  sect: null,
  masterDisciple: null,
  refinery: null,

  setPlayerName: (name) => set({ playerName: name }),

  setStats: (stats) => set((s) => ({
    stats: { ...s.stats, ...stats },
  })),

  gainCultivation: (amount) => set((s) => {
    let decayMultiplier = 1.0;
    if (s.stats.realm >= 5) decayMultiplier = 0.8;
    if (s.stats.realm >= 7) decayMultiplier = 0.6;
    if (s.stats.realm >= 9) decayMultiplier = 0.4;

    const linggenMultiplier = s.lingen.cultivationMultiplier || 1.0;
    
    const finalAmount = Math.max(0, Math.floor(amount * decayMultiplier * linggenMultiplier));
    let newCultivation = s.stats.cultivation + finalAmount;
    let realm = s.stats.realm;
    let subLevel = s.stats.subLevel;
    let cultivationNext = s.stats.cultivationNext;

    let stats = { ...s.stats };
    const newTotalCultivation = s.totalCultivation + finalAmount;
    const newHighestCultivation = Math.max(s.statsRecord.highestCultivation, newTotalCultivation);

    const maxRealm = REALM_CONFIGS.length - 1;

    while (newCultivation >= cultivationNext) {
      newCultivation -= cultivationNext;
      
      if (subLevel < REALM_CONFIGS[realm].subLevels.length - 1) {
        subLevel++;
        cultivationNext = REALM_CONFIGS[realm].cultivationRequirements[subLevel];
      } else if (realm < maxRealm) {
        realm++;
        subLevel = 0;
        cultivationNext = REALM_CONFIGS[realm].cultivationRequirements[0];
        
        const newRealmStats = getRealmStats(realm, 0);
        if (newRealmStats) {
          stats.hp = newRealmStats.hpMax;
          stats.hpMax = newRealmStats.hpMax;
          stats.spiritualPower = newRealmStats.spiritualPowerMax;
          stats.spiritualPowerMax = newRealmStats.spiritualPowerMax;
          stats.attack = newRealmStats.attack;
          stats.defense = newRealmStats.defense;
          stats.agility = newRealmStats.agility;
          stats.intelligence = newRealmStats.intelligence;
          stats.luck = newRealmStats.luck;
          stats.staminaMax = newRealmStats.staminaMax;
          stats.stamina = Math.min(stats.stamina, newRealmStats.staminaMax);
        }
      } else {
        newCultivation = cultivationNext - 1;
        break;
      }
    }

    stats.realm = realm;
    stats.subLevel = subLevel;
    stats.cultivation = newCultivation;
    stats.cultivationNext = cultivationNext;

    return {
      stats,
      totalCultivation: newTotalCultivation,
      statsRecord: {
        ...s.statsRecord,
        totalCultivationSessions: s.statsRecord.totalCultivationSessions + 1,
        highestCultivation: newHighestCultivation,
      },
    };
  }),

  gainGold: (amount) => set((s) => {
    const newGold = Math.max(0, s.gold + amount);
    const newTotalGold = s.totalGold + Math.max(0, amount);
    const newHighestGold = Math.max(s.statsRecord.highestGold, newGold);
    
    return {
      gold: newGold,
      totalGold: newTotalGold,
      statsRecord: {
        ...s.statsRecord,
        highestGold: newHighestGold,
      },
    };
  }),

  takeDamage: (amount) => set((s) => ({
    stats: { ...s.stats, hp: Math.max(0, s.stats.hp - amount) },
  })),

  heal: (amount) => set((s) => ({
    stats: { ...s.stats, hp: Math.min(s.stats.hpMax, s.stats.hp + amount) },
  })),

  useSpiritualPower: (amount) => {
    const s = get();
    if (s.stats.spiritualPower < amount) return false;
    set({
      stats: { ...s.stats, spiritualPower: s.stats.spiritualPower - amount },
      statsRecord: {
        ...s.statsRecord,
        totalSpiritualPowerUsed: s.statsRecord.totalSpiritualPowerUsed + amount,
      },
    });
    return true;
  },

  restoreSpiritualPower: (amount) => set((s) => ({
    stats: { ...s.stats, spiritualPower: Math.min(s.stats.spiritualPowerMax, s.stats.spiritualPower + amount) },
  })),

  useStamina: (amount) => {
    const s = get();
    if (s.stats.stamina < amount) return false;
    set({
      stats: { ...s.stats, stamina: s.stats.stamina - amount },
      statsRecord: {
        ...s.statsRecord,
        totalStaminaUsed: s.statsRecord.totalStaminaUsed + amount,
      },
    });
    return true;
  },

  recoverStamina: (amount) => set((s) => ({
    stats: { ...s.stats, stamina: Math.min(s.stats.staminaMax, s.stats.stamina + amount) },
  })),

  addItem: (item, qty = 1) => {
    const s = get();
    const existingIndex = s.inventory.findIndex(i => i.id === item.id);
    if (existingIndex >= 0) {
      const newInventory = [...s.inventory];
      newInventory[existingIndex] = {
        ...newInventory[existingIndex],
        quantity: newInventory[existingIndex].quantity + qty,
      };
      set({ inventory: newInventory });
    } else {
      set((s) => ({
        inventory: [...s.inventory, { ...item, quantity: qty }],
      }));
    }
    return { success: true, msg: '物品已添加' };
  },

  removeItem: (id, qty = 1) => set((s) => {
    const newInventory = s.inventory.map(item => {
      if (item.id === id) {
        const newQty = item.quantity - qty;
        return newQty <= 0 ? null : { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean) as InventoryItem[];
    return { inventory: newInventory };
  }),

  equipItem: (item) => set((s) => {
    if (item.type !== 'weapon' && item.type !== 'armor' && item.type !== 'accessory' && 
        item.type !== 'boots' && item.type !== 'bracelet' && item.type !== 'waist') {
      return s;
    }
    const newEquipment = { ...s.equipment };
    if (newEquipment[item.type]) {
      s.addItem(newEquipment[item.type]!);
    }
    newEquipment[item.type] = { ...item, quantity: 1 };
    s.removeItem(item.id, 1);
    return { equipment: newEquipment };
  }),

  unequipItem: (slot) => set((s) => {
    const newEquipment = { ...s.equipment };
    if (newEquipment[slot]) {
      s.addItem(newEquipment[slot]!);
      newEquipment[slot] = null;
    }
    return { equipment: newEquipment };
  }),

  addSkill: (skill) => set((s) => {
    if (s.skills.some(sk => sk.id === skill.id)) {
      return s;
    }
    return { skills: [...s.skills, skill] };
  }),

  levelUpSkill: (skillId) => set((s) => {
    const newSkills = s.skills.map(sk => {
      if (sk.id === skillId && sk.level < sk.maxLevel) {
        return { ...sk, level: sk.level + 1, damage: sk.damage + 5 };
      }
      return sk;
    });
    return { skills: newSkills };
  }),

  setPhysique: (physique) => set((s) => {
    let newStats = { ...s.stats };
    if (s.physique && s.physique.effect) {
      newStats = applyStatModifier(newStats, s.physique.effect, false);
    }
    if (physique.effect) {
      newStats = applyStatModifier(newStats, physique.effect, true);
    }
    return { physique, stats: newStats };
  }),

  setLingen: (lingen) => set({ lingen }),
  setBackground: (bg) => set((s) => {
    let newStats = { ...s.stats };
    if (s.background && s.background.effect) {
      newStats = applyStatModifier(newStats, s.background.effect, false);
    }
    if (bg.effect) {
      newStats = applyStatModifier(newStats, bg.effect, true);
    }
    return { background: bg, stats: newStats };
  }),

  setForce: (force) => set({ force }),
  setMaster: (master) => set({ master }),
  setGameStarted: (v) => set({ gameStarted: v }),

  useBreakthroughPill: (pillId) => {
    const pill = BREAKTHROUGH_PILLS.find(p => p.id === pillId);
    if (!pill) return { success: false, msg: '丹药不存在' };
    const s = get();
    const itemIndex = s.inventory.findIndex(i => i.id === pillId);
    if (itemIndex < 0 || s.inventory[itemIndex].quantity <= 0) {
      return { success: false, msg: '丹药不足' };
    }
    s.removeItem(pillId, 1);
    set((s) => ({
      stats: {
        ...s.stats,
        breakthroughBonusRate: (s.stats.breakthroughBonusRate || 0) + pill.bonusRate,
        breakthroughBonusItems: [...(s.stats.breakthroughBonusItems || []), pillId],
      },
    }));
    return { success: true, msg: `使用${pill.name}成功，突破成功率+${pill.bonusRate * 100}%` };
  },

  enhanceDaoFoundation: (quality) => {
    const levels = ['mortal', 'spirit', 'immortal', 'celestial', 'divine'];
    const currentIndex = levels.findIndex(l => l === get().stats.daoFoundation.quality);
    const targetIndex = levels.findIndex(l => l === quality);
    if (targetIndex <= currentIndex) {
      return { success: false, msg: '道基品质未提升' };
    }
    const bonusRates = { mortal: 0, spirit: 0.05, immortal: 0.12, celestial: 0.25, divine: 0.4 };
    const descriptions = {
      mortal: '凡人道基，根基浅薄',
      spirit: '灵根道基，根基稳固',
      immortal: '仙人道基，脱胎换骨',
      celestial: '天人道基，与道合真',
      divine: '大道道基，证道之基',
    };
    set((s) => ({
      stats: {
        ...s.stats,
        daoFoundation: {
          ...s.stats.daoFoundation,
          quality,
          bonusRate: bonusRates[quality],
          description: descriptions[quality],
        },
      },
    }));
    return { success: true, msg: '道基提升成功' };
  },

  resetGame: () => set(() => ({
    playerName: '',
    gold: 100,
    stats: getInitialStats(),
    playTime: 0,
    inventory: [
      { id: 'qi_pill', name: '淬体丹', type: 'consumable', description: '恢复50气血', price: 30, quantity: 5 },
      { id: 'spirit_pill', name: '通脉丹', type: 'consumable', description: '恢复30灵力', price: 25, quantity: 3 },
    ],
    equipment: { weapon: null, armor: null, accessory: null, boots: null, bracelet: null, waist: null },
    skills: [
      { id: 'basic_fist', name: '基础拳谱', description: '朴实无华的拳术', spiritualPowerCost: 5, damage: 15, level: 1, maxLevel: 5, element: 'neutral' },
    ],
    physique: PHYSIQUES[0],
    lingen: LINGEN[2],
    background: null,
    force: null,
    master: null,
    gameStarted: false,
    totalCultivation: 0,
    totalGold: 0,
    sect: null,
    masterDisciple: null,
    refinery: null,
    statsRecord: {
      totalBattles: 0, totalWins: 0, totalMonstersKilled: 0, totalBossesDefeated: 0,
      totalPetBattles: 0, totalSecretRealmsCompleted: 0, totalCompetitionsParticipated: 0, totalCompetitionsWon: 0,
      totalItemsUsed: 0, totalCultivationSessions: 0, totalRestSessions: 0,
      totalBreakthroughAttempts: 0, totalBreakthroughSuccesses: 0, totalDemonHeartVictories: 0, totalEnlightenmentEvents: 0,
      totalNPCInteractions: 0, totalGiftsReceived: 0, totalQuestsCompleted: 0, totalAchievementsUnlocked: 0,
      totalSpiritTreasuresAcquired: 0, totalPetsAcquired: 0, maxConsecutiveWins: 0, currentConsecutiveWins: 0,
      totalDamageDealt: 0, totalDamageTaken: 0, totalSpiritualPowerUsed: 0, totalStaminaUsed: 0,
      highestCultivation: 0, highestGold: 0, totalSectTasksCompleted: 0, totalLessonsCompleted: 0, totalItemsRefined: 0,
      totalAlchemySessions: 0, totalAlchemySuccesses: 0, totalMaterialsGained: 0, totalGoldGained: 0,
      totalCultivationGained: 0, totalEquipmentsAcquired: 0,
    },
  })),

  recordBattle: (won, isBoss, damageDealt, damageTaken) => set((s) => {
    const newConsecutiveWins = won ? s.statsRecord.currentConsecutiveWins + 1 : 0;
    const newMaxConsecutiveWins = Math.max(s.statsRecord.maxConsecutiveWins, newConsecutiveWins);
    
    return {
      statsRecord: {
        ...s.statsRecord,
        totalBattles: s.statsRecord.totalBattles + 1,
        totalWins: won ? s.statsRecord.totalWins + 1 : s.statsRecord.totalWins,
        totalMonstersKilled: won && !isBoss ? s.statsRecord.totalMonstersKilled + 1 : s.statsRecord.totalMonstersKilled,
        totalBossesDefeated: won && isBoss ? s.statsRecord.totalBossesDefeated + 1 : s.statsRecord.totalBossesDefeated,
        totalDamageDealt: s.statsRecord.totalDamageDealt + damageDealt,
        totalDamageTaken: s.statsRecord.totalDamageTaken + damageTaken,
        currentConsecutiveWins: newConsecutiveWins,
        maxConsecutiveWins: newMaxConsecutiveWins,
      },
    };
  }),

  recordPetBattle: (won) => set((s) => ({
    statsRecord: {
      ...s.statsRecord,
      totalPetBattles: s.statsRecord.totalPetBattles + 1,
      totalWins: won ? s.statsRecord.totalWins + 1 : s.statsRecord.totalWins,
    },
  })),

  recordSecretRealmComplete: () => set((s) => ({
    statsRecord: {
      ...s.statsRecord,
      totalSecretRealmsCompleted: s.statsRecord.totalSecretRealmsCompleted + 1,
    },
  })),

  recordCompetition: (won) => set((s) => ({
    statsRecord: {
      ...s.statsRecord,
      totalCompetitionsParticipated: s.statsRecord.totalCompetitionsParticipated + 1,
      totalCompetitionsWon: won ? s.statsRecord.totalCompetitionsWon + 1 : s.statsRecord.totalCompetitionsWon,
    },
  })),

  recordItemUsed: () => set((s) => ({
    statsRecord: {
      ...s.statsRecord,
      totalItemsUsed: s.statsRecord.totalItemsUsed + 1,
    },
  })),

  recordCultivation: () => set((s) => ({
    statsRecord: {
      ...s.statsRecord,
      totalCultivationSessions: s.statsRecord.totalCultivationSessions + 1,
    },
  })),

  recordRest: () => set((s) => ({
    statsRecord: {
      ...s.statsRecord,
      totalRestSessions: s.statsRecord.totalRestSessions + 1,
    },
  })),

  recordBreakthrough: (success) => set((s) => ({
    statsRecord: {
      ...s.statsRecord,
      totalBreakthroughAttempts: s.statsRecord.totalBreakthroughAttempts + 1,
      totalBreakthroughSuccesses: success ? s.statsRecord.totalBreakthroughSuccesses + 1 : s.statsRecord.totalBreakthroughSuccesses,
    },
  })),

  trackDemonHeartVictory: () => set((s) => ({
    statsRecord: {
      ...s.statsRecord,
      totalDemonHeartVictories: s.statsRecord.totalDemonHeartVictories + 1,
    },
  })),

  recordEnlightenment: () => set((s) => ({
    statsRecord: {
      ...s.statsRecord,
      totalEnlightenmentEvents: s.statsRecord.totalEnlightenmentEvents + 1,
    },
  })),

  recordNPCInteraction: () => set((s) => ({
    statsRecord: {
      ...s.statsRecord,
      totalNPCInteractions: s.statsRecord.totalNPCInteractions + 1,
    },
  })),

  recordGiftReceived: () => set((s) => ({
    statsRecord: {
      ...s.statsRecord,
      totalGiftsReceived: s.statsRecord.totalGiftsReceived + 1,
    },
  })),

  recordQuestCompleted: () => set((s) => ({
    statsRecord: {
      ...s.statsRecord,
      totalQuestsCompleted: s.statsRecord.totalQuestsCompleted + 1,
    },
  })),

  recordAchievementUnlocked: () => set((s) => ({
    statsRecord: {
      ...s.statsRecord,
      totalAchievementsUnlocked: s.statsRecord.totalAchievementsUnlocked + 1,
    },
  })),

  recordSpiritTreasureAcquired: () => set((s) => ({
    statsRecord: {
      ...s.statsRecord,
      totalSpiritTreasuresAcquired: s.statsRecord.totalSpiritTreasuresAcquired + 1,
    },
  })),

  recordPetAcquired: () => set((s) => ({
    statsRecord: {
      ...s.statsRecord,
      totalPetsAcquired: s.statsRecord.totalPetsAcquired + 1,
    },
  })),

  setSect: (sect) => set({ sect }),
  setMasterDisciple: (md) => set({ masterDisciple: md }),
  setRefinery: (refinery) => set({ refinery }),
  recordSectTaskCompleted: () => set((s) => ({
    statsRecord: {
      ...s.statsRecord,
      totalSectTasksCompleted: s.statsRecord.totalSectTasksCompleted + 1,
    },
  })),
  recordLessonCompleted: () => set((s) => ({
    statsRecord: {
      ...s.statsRecord,
      totalLessonsCompleted: s.statsRecord.totalLessonsCompleted + 1,
    },
  })),
  recordItemRefined: () => set((s) => ({
    statsRecord: {
      ...s.statsRecord,
      totalItemsRefined: s.statsRecord.totalItemsRefined + 1,
    },
  })),

  recordAlchemy: (success) => set((s) => ({
    statsRecord: {
      ...s.statsRecord,
      totalAlchemySessions: s.statsRecord.totalAlchemySessions + 1,
      totalAlchemySuccesses: success ? s.statsRecord.totalAlchemySuccesses + 1 : s.statsRecord.totalAlchemySuccesses,
    },
  })),

  recordMaterialsGained: (count) => set((s) => ({
    statsRecord: {
      ...s.statsRecord,
      totalMaterialsGained: s.statsRecord.totalMaterialsGained + count,
    },
  })),

  recordCultivationGained: (amount) => set((s) => ({
    statsRecord: {
      ...s.statsRecord,
      totalCultivationGained: s.statsRecord.totalCultivationGained + amount,
    },
  })),

  recordGoldGained: (amount) => set((s) => ({
    statsRecord: {
      ...s.statsRecord,
      totalGoldGained: s.statsRecord.totalGoldGained + amount,
    },
  })),

  recordEquipmentAcquired: () => set((s) => ({
    statsRecord: {
      ...s.statsRecord,
      totalEquipmentsAcquired: s.statsRecord.totalEquipmentsAcquired + 1,
    },
  })),
});
