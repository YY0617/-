/**
 * Realm configuration data — includes REALM_CONFIGS, weather/time effects, and helper functions.
 * staminaMax values rebalanced per design requirements.
 * 玄幻世界武道境界体系：煅体境 → 玄脉境 → 武心境 → 灵现境 → 凌虚境 → 悟道境 → 冠绝境 → 绝圣境 → 圣君境 → 君帝境
 */
import type { RealmConfig, WeatherType, TimeOfDay, WeatherEffect, TimeEffect } from './types';

// ============================================================
// REALM_CONFIGS — 10境界 × 4小境界（初期、中期、后期、圆满）
// ============================================================
// 玄幻武道世界设定

const REALM_CONFIGS_DATA: RealmConfig[] = [
  {
    id: 0,
    name: '煅体境',
    subLevels: ['初期', '中期', '后期', '圆满'],
    coefficient: 1.0,
    breakthroughRates: [0.95, 0.90, 0.85, 0.80],
    cultivationRequirements: [50, 100, 200, 400, 800],
    baseStats: {
      hpMax: [80, 90, 100, 120, 145],
      attack: [8, 10, 12, 15, 18],
      defense: [4, 5, 6, 8, 10],
      spiritualPowerMax: [40, 50, 60, 75, 90],
      staminaMax: [100, 100, 100, 100, 100],
      agility: [4, 5, 6, 7, 8],
      intelligence: [4, 5, 6, 7, 8],
      luck: [3, 3, 4, 4, 4],
    },
    unlockFeatures: ['武徒修炼', '基础武技', '基础战斗', '基础商店'],
    availableMonsters: ['stone_beetle', 'spirit_snake', 'fire_wolf'],
    availableRealms: ['luoye'],
    description: '煅体境，武道之始。通过煅炼肉身，打通经脉，为日后修炼武道打下坚实基础。',
  },
  {
    id: 1,
    name: '玄脉境',
    subLevels: ['初期', '中期', '后期', '圆满'],
    coefficient: 1.5,
    breakthroughRates: [0.50, 0.45, 0.40, 0.35],
    cultivationRequirements: [800, 1600, 3200, 6400, 12800],
    baseStats: {
      hpMax: [145, 175, 200, 240, 280],
      attack: [18, 22, 28, 35, 42],
      defense: [10, 13, 16, 20, 24],
      spiritualPowerMax: [90, 110, 135, 160, 190],
      staminaMax: [100, 100, 100, 100, 100],
      agility: [8, 10, 12, 14, 16],
      intelligence: [8, 10, 12, 14, 16],
      luck: [4, 5, 5, 6, 6],
    },
    unlockFeatures: ['玄脉打通', '内力修炼', '功法入门', '灵宠初现'],
    availableMonsters: ['fire_wolf', 'shadow_tiger', 'ice_toad'],
    availableRealms: ['luoye', 'heiyan', 'ancient_tomb'],
    description: '玄脉境，沟通天地玄气。打通玄脉，凝聚内力，初步感知天地灵气。',
  },
  {
    id: 2,
    name: '武心境',
    subLevels: ['初期', '中期', '后期', '圆满'],
    coefficient: 2.5,
    breakthroughRates: [0.45, 0.40, 0.35, 0.30],
    cultivationRequirements: [12800, 25600, 51200, 102400, 204800],
    baseStats: {
      hpMax: [280, 320, 360, 420, 500],
      attack: [42, 50, 60, 75, 95],
      defense: [24, 28, 35, 42, 52],
      spiritualPowerMax: [190, 230, 275, 330, 400],
      staminaMax: [110, 110, 110, 110, 110],
      agility: [16, 20, 24, 30, 38],
      intelligence: [16, 20, 24, 30, 38],
      luck: [6, 7, 8, 10, 12],
    },
    unlockFeatures: ['武道之心', '真气运转', '武技进阶', '秘境探索'],
    availableMonsters: ['shadow_tiger', 'ice_toad', 'boss_flame_dragon'],
    availableRealms: ['heiyan', 'bingpo', 'flame_mountain'],
    description: '武心境，心意通达。武道之心初成，真气运转如意，战力大增。',
  },
  {
    id: 3,
    name: '灵现境',
    subLevels: ['初期', '中期', '后期', '圆满'],
    coefficient: 4.0,
    breakthroughRates: [0.25, 0.20, 0.15, 0.10],
    cultivationRequirements: [204800, 409600, 819200, 1638400, 3276800],
    baseStats: {
      hpMax: [500, 650, 850, 1100, 1450],
      attack: [95, 130, 180, 250, 350],
      defense: [52, 72, 100, 140, 195],
      spiritualPowerMax: [400, 550, 750, 1000, 1350],
      staminaMax: [120, 120, 120, 120, 120],
      agility: [38, 52, 72, 100, 140],
      intelligence: [38, 52, 72, 100, 140],
      luck: [12, 16, 22, 30, 40],
    },
    unlockFeatures: ['灵识初现', '灵气外放', '法器运用', '阵法入门'],
    availableMonsters: ['boss_flame_dragon', 'boss_shadow_lord', 'ice_giant'],
    availableRealms: ['bingpo', 'ice_pole', 'thunder_forbidden'],
    description: '灵现境，灵力显现。灵识初现，可灵气外放，初步运用法器和阵法。',
  },
  {
    id: 4,
    name: '凌虚境',
    subLevels: ['初期', '中期', '后期', '圆满'],
    coefficient: 6.0,
    breakthroughRates: [0.15, 0.12, 0.10, 0.08],
    cultivationRequirements: [3276800, 6553600, 13107200, 26214400, 52428800],
    baseStats: {
      hpMax: [1450, 2000, 2800, 4000, 5500],
      attack: [350, 500, 720, 1050, 1500],
      defense: [195, 280, 400, 580, 840],
      spiritualPowerMax: [1350, 1900, 2700, 3900, 5500],
      staminaMax: [130, 130, 130, 130, 130],
      agility: [140, 200, 290, 420, 600],
      intelligence: [140, 200, 290, 420, 600],
      luck: [40, 55, 75, 105, 145],
    },
    unlockFeatures: ['凌空虚渡', '灵气化形', '领域初成', '御器飞行'],
    availableMonsters: ['boss_shadow_lord', 'ice_giant', 'void_demon'],
    availableRealms: ['spirit_spring', 'nine_nether', 'sky_palace'],
    description: '凌虚境，凌空蹈虚。可短暂凌空虚渡，灵气化形，实力已是不凡。',
  },
  {
    id: 5,
    name: '悟道境',
    subLevels: ['初期', '中期', '后期', '圆满'],
    coefficient: 8.5,
    breakthroughRates: [0.10, 0.08, 0.06, 0.05],
    cultivationRequirements: [52428800, 104857600, 209715200, 419430400, 838860800],
    baseStats: {
      hpMax: [5500, 8000, 11500, 16500, 24000],
      attack: [1500, 2200, 3200, 4700, 6800],
      defense: [840, 1220, 1780, 2600, 3800],
      spiritualPowerMax: [5500, 8000, 11500, 16500, 24000],
      staminaMax: [140, 140, 140, 140, 140],
      agility: [600, 880, 1280, 1880, 2750],
      intelligence: [600, 880, 1280, 1880, 2750],
      luck: [145, 200, 275, 380, 520],
    },
    unlockFeatures: ['悟道初成', '法则感应', '空间法则', '道法自然'],
    availableMonsters: ['ice_giant', 'void_demon', 'destruction_dragon'],
    availableRealms: ['god_battlefield', 'chaos_void', 'eternal_land'],
    description: '悟道境，初步悟道。初窥法则之力，可感悟空间法则，实力深不可测。',
  },
  {
    id: 6,
    name: '冠绝境',
    subLevels: ['初期', '中期', '后期', '圆满'],
    coefficient: 12.0,
    breakthroughRates: [0.06, 0.05, 0.04, 0.03],
    cultivationRequirements: [838860800, 1677721600, 3355443200, 6710886400, 13421772800],
    baseStats: {
      hpMax: [24000, 36000, 54000, 81000, 121000],
      attack: [6800, 10200, 15300, 23000, 34500],
      defense: [3800, 5700, 8550, 12850, 19300],
      spiritualPowerMax: [24000, 36000, 54000, 81000, 121000],
      staminaMax: [150, 150, 150, 150, 150],
      agility: [2750, 4150, 6250, 9400, 14100],
      intelligence: [2750, 4150, 6250, 9400, 14100],
      luck: [520, 700, 940, 1270, 1720],
    },
    unlockFeatures: ['冠绝当世', '本源融合', '天地法相', '神游太虚'],
    availableMonsters: ['void_demon', 'destruction_dragon', 'chaos_ancient_god'],
    availableRealms: ['chaos_void', 'eternal_land', 'primordial_land'],
    description: '冠绝境，冠绝当世。已是一方霸主，举手投足间可毁天灭地。',
  },
  {
    id: 7,
    name: '绝圣境',
    subLevels: ['初期', '中期', '后期', '圆满'],
    coefficient: 17.0,
    breakthroughRates: [0.04, 0.03, 0.02, 0.015],
    cultivationRequirements: [13421772800, 26843545600, 53687091200, 107374182400, 214748364800],
    baseStats: {
      hpMax: [121000, 185000, 280000, 425000, 645000],
      attack: [34500, 52500, 80000, 122000, 185000],
      defense: [19300, 29400, 44800, 68300, 104000],
      spiritualPowerMax: [121000, 185000, 280000, 425000, 645000],
      staminaMax: [160, 160, 160, 160, 160],
      agility: [14100, 21500, 32800, 50000, 76200],
      intelligence: [14100, 21500, 32800, 50000, 76200],
      luck: [1720, 2300, 3080, 4120, 5520],
    },
    unlockFeatures: ['绝圣之威', '改天换地', '万法归一', '圣人领域'],
    availableMonsters: ['destruction_dragon', 'chaos_ancient_god', 'heaven_will'],
    availableRealms: ['primordial_land', 'hongmeng_world', 'dao_origin'],
    description: '绝圣境，圣人之威。已是传说中的人物，举手投足可改天换地。',
  },
  {
    id: 8,
    name: '圣君境',
    subLevels: ['初期', '中期', '后期', '圆满'],
    coefficient: 24.0,
    breakthroughRates: [0.02, 0.015, 0.01, 0.005],
    cultivationRequirements: [214748364800, 429496729600, 858993459200, 1717986918400, 3435973836800],
    baseStats: {
      hpMax: [645000, 1000000, 1550000, 2400000, 3700000],
      attack: [185000, 287000, 445000, 690000, 1070000],
      defense: [104000, 161000, 250000, 388000, 602000],
      spiritualPowerMax: [645000, 1000000, 1550000, 2400000, 3700000],
      staminaMax: [170, 170, 170, 170, 170],
      agility: [76200, 118000, 183000, 284000, 440000],
      intelligence: [76200, 118000, 183000, 284000, 440000],
      luck: [5520, 7400, 9920, 13300, 17800],
    },
    unlockFeatures: ['圣君之威', '执掌天道', '万物归宗', '天道化身'],
    availableMonsters: ['chaos_ancient_god', 'heaven_will', 'fate_sovereign'],
    availableRealms: ['dao_origin', 'chaos_beginning', 'ultimate_eternal'],
    description: '圣君境，一代圣君。已是天道代言，掌控万物生灵，寿元无尽。',
  },
  {
    id: 9,
    name: '君帝境',
    subLevels: ['初期', '中期', '后期', '圆满'],
    coefficient: 35.0,
    breakthroughRates: [0.01, 0.008, 0.005, 0.003],
    cultivationRequirements: [3435973836800, 6871947673600, 13743895347200, 27487790694400, 54975581388800],
    baseStats: {
      hpMax: [3700000, 5800000, 9100000, 14300000, 22500000],
      attack: [1070000, 1680000, 2640000, 4150000, 6520000],
      defense: [602000, 945000, 1485000, 2330000, 3660000],
      spiritualPowerMax: [3700000, 5800000, 9100000, 14300000, 22500000],
      staminaMax: [180, 180, 180, 180, 180],
      agility: [440000, 692000, 1088000, 1710000, 2690000],
      intelligence: [440000, 692000, 1088000, 1710000, 2690000],
      luck: [17800, 24200, 32800, 44500, 60400],
    },
    unlockFeatures: ['君帝之威', '超脱轮回', '永恒不灭', '武道尽头'],
    availableMonsters: ['heaven_will', 'fate_sovereign', 'destiny_overlord'],
    availableRealms: ['ultimate_eternal', 'destiny_end', 'transcendence'],
    description: '君帝境，武道巅峰。超脱轮回，永恒不灭，已是武道尽头的人物。',
  },
];

/** Exported singleton reference */
export const REALM_CONFIGS: RealmConfig[] = REALM_CONFIGS_DATA;

// ============================================================
// Weather / Time Effects
// ============================================================

export const WEATHER_EFFECTS: Record<WeatherType, WeatherEffect> = {
  sunny: { cultivationBonus: 1.1, battleBonus: 1.0, description: '晴空万里', icon: '☀️' },
  cloudy: { cultivationBonus: 1.0, battleBonus: 1.0, description: '多云', icon: '☁️' },
  rainy: { cultivationBonus: 0.9, battleBonus: 0.95, description: '细雨绵绵', icon: '🌧️' },
  stormy: { cultivationBonus: 0.8, battleBonus: 1.15, description: '雷电交加', icon: '⛈️' },
  snowy: { cultivationBonus: 0.85, battleBonus: 0.9, description: '大雪纷飞', icon: '❄️' },
  foggy: { cultivationBonus: 0.9, battleBonus: 0.85, description: '迷雾重重', icon: '🌫️' },
};

export const TIME_EFFECTS: Record<TimeOfDay, TimeEffect> = {
  dawn: { cultivationBonus: 1.05, battleBonus: 1.0, description: '破晓' },
  morning: { cultivationBonus: 1.1, battleBonus: 1.05, description: '上午' },
  noon: { cultivationBonus: 0.95, battleBonus: 1.1, description: '正午' },
  afternoon: { cultivationBonus: 1.0, battleBonus: 1.05, description: '下午' },
  dusk: { cultivationBonus: 1.05, battleBonus: 0.95, description: '黄昏' },
  night: { cultivationBonus: 1.2, battleBonus: 0.9, description: '深夜' },
};

// ============================================================
// Helper functions
// ============================================================

export function getRealmName(realmIndex: number, subIndex: number = 0): string {
  if (realmIndex >= REALM_CONFIGS.length) return '未知境界';
  const realm = REALM_CONFIGS[realmIndex];
  const sub = realm.subLevels[subIndex] || realm.subLevels[0];
  return `${realm.name}·${sub}`;
}

export function getRealmConfig(realmIndex: number): RealmConfig | null {
  if (realmIndex >= REALM_CONFIGS.length) return null;
  return REALM_CONFIGS[realmIndex];
}

export function getRealmStats(realm: number, subLevel: number) {
  const config = getRealmConfig(realm);
  if (!config) return null;

  const idx = Math.min(subLevel, config.subLevels.length - 1);
  return {
    hpMax: config.baseStats.hpMax[idx],
    attack: config.baseStats.attack[idx],
    defense: config.baseStats.defense[idx],
    spiritualPowerMax: config.baseStats.spiritualPowerMax[idx],
    staminaMax: config.baseStats.staminaMax[idx],
    agility: config.baseStats.agility[idx],
    intelligence: config.baseStats.intelligence[idx],
    luck: config.baseStats.luck[idx],
  };
}

export function getBreakthroughRate(realm: number, subLevel: number): number {
  const config = getRealmConfig(realm);
  if (!config) return 0.5;
  const idx = Math.min(subLevel, config.breakthroughRates.length - 1);
  return config.breakthroughRates[idx];
}

export function getRealmCoefficient(realm: number): number {
  const config = getRealmConfig(realm);
  if (!config) return 1.0;
  return config.coefficient;
}

/**
 * 自动恢复速度 = 3 + 境界 / 60秒
 */
export function getStaminaRegenRate(realm: number): number {
  return 3 + realm / 60;
}

/**
 * 养神丹回复体力上限的 20%（改为百分比）
 */
export function getStaminaPillRestore(staminaMax: number): number {
  return Math.floor(staminaMax * 0.2);
}

/**
 * 突破后体力恢复 50%（非回满）
 */
export function getBreakthroughStaminaRestore(staminaMax: number): number {
  return Math.floor(staminaMax * 0.5);
}
