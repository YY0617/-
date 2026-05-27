/**
 * Cultivation Config - 修炼系统配置
 * 所有修炼相关公式和参数配置
 */
import type { RealmConfig } from '../data/types';

/**
 * 境界基础配置
 */
export const REALM_BASE_CONFIG: Omit<RealmConfig, 'coefficient' | 'baseStats' | 'unlockFeatures' | 'availableMonsters' | 'availableRealms'>[] = [
  { id: 0, name: '淬体境', subLevels: ['初期', '中期', '后期', '圆满'], breakthroughRates: [0.4, 0.35, 0.3, 0.25], cultivationRequirements: [100, 300, 600, 1000], description: '淬炼肉身，奠基修炼之路' },
  { id: 1, name: '玄脉境', subLevels: ['初期', '中期', '后期', '圆满'], breakthroughRates: [0.38, 0.33, 0.28, 0.23], cultivationRequirements: [1500, 2500, 4000, 6000], description: '通经走脉，灵力初现' },
  { id: 2, name: '武心境', subLevels: ['初期', '中期', '后期', '圆满'], breakthroughRates: [0.35, 0.3, 0.25, 0.2], cultivationRequirements: [8000, 12000, 18000, 26000], description: '心如止水，武意初生' },
  { id: 3, name: '金丹境', subLevels: ['初期', '中期', '后期', '圆满'], breakthroughRates: [0.32, 0.27, 0.22, 0.18], cultivationRequirements: [35000, 50000, 75000, 100000], description: '丹成九转，金光内敛' },
  { id: 4, name: '元婴境', subLevels: ['初期', '中期', '后期', '圆满'], breakthroughRates: [0.28, 0.23, 0.18, 0.15], cultivationRequirements: [130000, 180000, 250000, 350000], description: '元婴出窍，神游太虚' },
  { id: 5, name: '化神境', subLevels: ['初期', '中期', '后期', '圆满'], breakthroughRates: [0.25, 0.2, 0.15, 0.12], cultivationRequirements: [450000, 600000, 800000, 1000000], description: '神魂蜕变，化虚为实' },
  { id: 6, name: '大乘境', subLevels: ['初期', '中期', '后期', '圆满'], breakthroughRates: [0.2, 0.15, 0.1, 0.08], cultivationRequirements: [1300000, 1700000, 2200000, 2800000], description: '大乘临世，道法自然' },
  { id: 7, name: '渡劫境', subLevels: ['初期', '中期', '后期', '圆满'], breakthroughRates: [0.15, 0.1, 0.08, 0.05], cultivationRequirements: [3500000, 4500000, 6000000, 8000000], description: '渡劫飞升，天雷淬体' },
  { id: 8, name: '真仙境', subLevels: ['初期', '中期', '后期', '圆满'], breakthroughRates: [0.1, 0.08, 0.05, 0.03], cultivationRequirements: [10000000, 15000000, 22000000, 30000000], description: '长生不老，位列仙班' },
  { id: 9, name: '仙王境', subLevels: ['初期', '中期', '后期', '圆满'], breakthroughRates: [0.08, 0.05, 0.03, 0.02], cultivationRequirements: [40000000, 55000000, 75000000, 100000000], description: '仙王称尊，独断万古' },
];

/**
 * 境界基础属性配置（每阶每小境界）
 */
export const REALM_BASE_STATS = {
  hpMax: [100, 150, 200, 280, 400, 550, 750, 1000, 1350, 1800, 2400, 3000, 4000, 5200, 6800, 8800, 11500, 15000, 19500, 25000, 32000, 40000, 50000, 62000, 78000, 98000, 125000, 160000, 200000, 250000, 320000, 400000, 500000, 630000, 800000, 1000000],
  attack: [10, 15, 20, 28, 40, 55, 75, 100, 135, 180, 240, 300, 400, 520, 680, 880, 1150, 1500, 1950, 2500, 3200, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000, 25000, 32000, 40000, 50000, 63000, 80000, 100000],
  defense: [5, 8, 12, 18, 25, 35, 48, 65, 90, 120, 160, 200, 270, 360, 480, 640, 850, 1100, 1450, 1900, 2500, 3300, 4300, 5600, 7300, 9600, 12500, 16000, 21000, 28000, 36000, 47000, 62000, 80000, 105000, 140000],
  spiritualPowerMax: [50, 80, 110, 150, 200, 270, 360, 480, 640, 850, 1100, 1500, 2000, 2700, 3600, 4800, 6300, 8500, 11000, 15000, 20000, 27000, 36000, 48000, 64000, 85000, 110000, 150000, 200000, 270000, 360000, 480000, 640000, 850000, 1100000, 1500000],
  staminaMax: [100, 120, 150, 180, 220, 270, 330, 400, 480, 580, 700, 850, 1050, 1300, 1600, 2000, 2500, 3200, 4000, 5000, 6300, 8000, 10000, 13000, 16000, 20000, 26000, 33000, 42000, 54000, 70000, 90000, 115000, 150000, 195000, 250000],
  agility: [5, 6, 7, 8, 10, 12, 14, 17, 20, 24, 29, 35, 42, 50, 60, 72, 86, 100, 120, 145, 175, 210, 255, 310, 375, 450, 550, 670, 820, 1000, 1250, 1550, 1900, 2350, 2900, 3600],
  intelligence: [5, 6, 7, 8, 10, 12, 14, 17, 20, 24, 29, 35, 42, 50, 60, 72, 86, 100, 120, 145, 175, 210, 255, 310, 375, 450, 550, 670, 820, 1000, 1250, 1550, 1900, 2350, 2900, 3600],
  luck: [3, 4, 5, 6, 7, 8, 10, 12, 14, 17, 20, 24, 29, 35, 42, 50, 60, 72, 86, 100, 120, 145, 175, 210, 255, 310, 375, 450, 550, 670, 820, 1000, 1250, 1550, 1900, 2350],
};

/**
 * 修炼参数配置
 */
export const CULTIVATION_CONFIG = {
  // 基础修炼每次获得修为
  baseCultivationPerAction: 10,
  
  // 修为公式系数
  cultivationFormula: {
    base: 1.0,
    lingenMultiplier: 0.05,  // 灵根每点增加5%修炼速度
    intelligenceMultiplier: 0.02,  // 悟性每点增加2%修炼速度
  },
  
  // 时间加成
  timeBonus: {
    dawn: 0.05,      // 黎明 +5%
    morning: 0.1,    // 上午 +10%
    noon: 0.15,      // 正午 +15%（最佳修炼时间）
    afternoon: 0.08, // 下午 +8%
    dusk: 0.0,       // 黄昏 无加成
    night: 0.12,     // 夜晚 +12%（夜间灵气浓郁）
  },
  
  // 天气加成
  weatherBonus: {
    sunny: 0.1,      // 晴天 +10%
    cloudy: 0.0,     // 多云 无加成
    rainy: 0.05,    // 雨天 +5%（灵气湿润）
    stormy: -0.1,    // 暴风雨 -10%
    snowy: 0.08,     // 雪天 +8%（灵气纯净）
    foggy: -0.05,    // 雾天 -5%
  },
  
  // 双倍修炼消耗
  doubleCultivation: {
    staminaCost: 30,    // 消耗30体力
    multiplier: 2.0,    // 获得2倍修为
  },
};

// ============================================================
// 突破配置
// ============================================================
export const BREAKTHROUGH_CONFIG = {
  // 基础突破成功率（由境界和子境界决定）
  baseSuccessRates: [
    [0.40, 0.35, 0.30, 0.25],  // 淬体境
    [0.38, 0.33, 0.28, 0.23],  // 玄脉境
    [0.35, 0.30, 0.25, 0.20],  // 武心境
    [0.32, 0.27, 0.22, 0.18],  // 金丹境
    [0.28, 0.23, 0.18, 0.15],  // 元婴境
    [0.25, 0.20, 0.15, 0.12],  // 化神境
    [0.20, 0.15, 0.10, 0.08],  // 大乘境
    [0.15, 0.10, 0.08, 0.05],  // 渡劫境
    [0.10, 0.08, 0.05, 0.03],  // 真仙境
    [0.08, 0.05, 0.03, 0.02],  // 仙王境
  ],
  
  // 突破加成上限
  maxBonusRate: 0.95,  // 最高95%成功率
  
  // 失败惩罚
  failurePenalty: {
    cultivationLoss: 0.1,  // 损失10%当前修为
    hpLoss: 0.2,          // 损失20%当前气血
  },
  
  // 突破成功奖励
  successReward: {
    hpFull: true,           // 气血回满
    spiritualPowerFull: true, // 灵力回满
  },
};

/**
 * 获取境界配置
 */
export function getRealmConfig(realmId: number, subLevel: number = 0): {
  name: string;
  subLevelName: string;
  baseRate: number;
  cultivationRequirement: number;
  stats: {
    hpMax: number;
    attack: number;
    defense: number;
    spiritualPowerMax: number;
    staminaMax: number;
    agility: number;
    intelligence: number;
    luck: number;
  };
} | null {
  const realm = REALM_BASE_CONFIG[realmId];
  if (!realm) return null;
  
  const index = realmId * 4 + subLevel;
  
  return {
    name: realm.name,
    subLevelName: realm.subLevels[subLevel],
    baseRate: realm.breakthroughRates[subLevel],
    cultivationRequirement: realm.cultivationRequirements[subLevel],
    stats: {
      hpMax: REALM_BASE_STATS.hpMax[index],
      attack: REALM_BASE_STATS.attack[index],
      defense: REALM_BASE_STATS.defense[index],
      spiritualPowerMax: REALM_BASE_STATS.spiritualPowerMax[index],
      staminaMax: REALM_BASE_STATS.staminaMax[index],
      agility: REALM_BASE_STATS.agility[index],
      intelligence: REALM_BASE_STATS.intelligence[index],
      luck: REALM_BASE_STATS.luck[index],
    },
  };
}
