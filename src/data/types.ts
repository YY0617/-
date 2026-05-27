/**
 * Core type definitions for the cultivation game
 * Centralized type definitions extracted from the monolithic gameStore.ts
 */

import { PROPERTY_NAMES, BATTLE_QUOTES } from '../constants/gameConstants';

export { PROPERTY_NAMES, BATTLE_QUOTES };

// ============================================================
// Enum-like string union types
// ============================================================

export type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'foggy';
export type TimeOfDay = 'dawn' | 'morning' | 'noon' | 'afternoon' | 'dusk' | 'night';
export type EquipType = 'weapon' | 'armor' | 'accessory' | 'boots' | 'bracelet' | 'waist';
export type ItemType = EquipType | 'consumable' | 'material';
export type SkillElement = 'fire' | 'ice' | 'thunder' | 'shadow' | 'neutral';
export type EventType = 'adventure' | 'help' | 'monster_surge' | 'treasure' | 'merchant' | 'training' | 'trade' | 'social' | 'environment' | 'pet' | 'combat' | 'blessing' | 'puzzle';
export type QuestType = 'main' | 'side' | 'daily' | 'weekly' | 'timed' | 'branch' | 'faction';
export type FormationType = 'attack' | 'defense' | 'support' | 'mixed';
export type PetType = 'mount' | 'combat' | 'support';
export type TalentBranch = 'attack' | 'defense' | 'support' | 'special';

// ============================================================
// Realm / Config types
// ============================================================

export interface RealmConfig {
  id: number;
  name: string;
  subLevels: string[];
  coefficient: number;
  breakthroughRates: number[];
  cultivationRequirements: number[];
  baseStats: {
    hpMax: number[];
    attack: number[];
    defense: number[];
    spiritualPowerMax: number[];
    staminaMax: number[];
    agility: number[];
    intelligence: number[];
    luck: number[];
  };
  unlockFeatures: string[];
  availableMonsters: string[];
  availableRealms: string[];
  description: string;
}

// ============================================================
// Weather / Time effects
// ============================================================

export interface WeatherEffect {
  cultivationBonus: number;
  battleBonus: number;
  description: string;
  icon: string;
}

export interface TimeEffect {
  cultivationBonus: number;
  battleBonus: number;
  description: string;
}

// ============================================================
// Character creation types
// ============================================================

export interface PhysiqueEffect {
  attack?: number;
  defense?: number;
  hpMax?: number;
  spiritualPowerMax?: number;
  agility?: number;
  intelligence?: number;
  luck?: number;
  spiritualRoot?: number;
  critRate?: number;
  evasionRate?: number;
  gold?: number;
  staminaMax?: number;
}

export interface Physique {
  id: string;
  name: string;
  desc: string;
  rarity: number;
  color: string;
  effect: PhysiqueEffect;
}

export type LinggenElement = 'jin' | 'mu' | 'shui' | 'huo' | 'tu' | 'feng' | 'lei' | 'bing' | 'guang' | 'an' | 'hun' | 'kong' | 'shijian' | 'yinyang' | 'wuxing';

export interface LinggenAffinity {
  element: LinggenElement;
  name: string;
  value: number;
}

export interface Lingen {
  id: string;
  name: string;
  desc: string;
  rarity: number;
  color: string;
  effect: PhysiqueEffect;
  affinities: LinggenAffinity[];
  type: 'xiapinlinggen' | 'fanpinlinggen' | 'zhongpinlinggen' | 'shangpinlinggen' | 'jipinlinggen' | 'juepinlinggen' | 'shenpinlinggen' | 'xianpinlinggen';
  cultivationMultiplier: number;
}

export interface Background {
  id: string;
  name: string;
  desc: string;
  icon: string;
  effect: PhysiqueEffect;
}

export interface Force {
  id: string;
  name: string;
  desc: string;
}

export interface MasterBonus {
  attack?: number;
  hp?: number;
  spiritualPower?: number;
  gold?: number;
  stamina?: number;
  agility?: number;
  intelligence?: number;
  luck?: number;
}

export interface Master {
  id: string;
  name: string;
  desc: string;
  isBoss: boolean;
  chance: number;
  bonus: MasterBonus;
}

// ============================================================
// Monster types
// ============================================================

export type MonsterMechanism =
  | { type: 'berserk' }
  | { type: 'regeneration'; hpPerTurn: number }
  | { type: 'armorBreak'; ignoreDefensePercent: number }
  | { type: 'poison'; poisonPerTurn: number }
  | { type: 'doubleStrike'; chance: number }
  | { type: 'reflect'; percent: number }
  | { type: 'dodge'; bonus: number };

export interface Monster {
  id: string;
  name: string;
  realm: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  expReward: number;
  goldReward: number;
  drops: { item: Omit<InventoryItem, 'quantity'>; chance: number }[];
  location: string;
  element: SkillElement;
  weakness: SkillElement;
  isBoss?: boolean;
  mechanisms?: MonsterMechanism[];
}

// ============================================================
// Item / Equipment types
// ============================================================

export type ItemGrade = 'huang' | 'xuan' | 'di' | 'tian' | 'dao' | 'hun';

export const ITEM_GRADE_NAMES: Record<ItemGrade, string> = {
  'huang': '黄',
  'xuan': '玄',
  'di': '地',
  'tian': '天',
  'dao': '道',
  'hun': '混',
};

export const ITEM_GRADE_COLORS: Record<ItemGrade, { bg: string; border: string; text: string; glow?: string }> = {
  'huang': { bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-600' },
  'xuan': { bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-600' },
  'di': { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-600' },
  'tian': { bg: 'bg-purple-50', border: 'border-purple-500', text: 'text-purple-600' },
  'dao': { bg: 'bg-orange-50', border: 'border-orange-500', text: 'text-orange-600' },
  'hun': { bg: 'bg-rose-50', border: 'border-rose-500', text: 'text-rose-600', glow: 'shadow-lg shadow-rose-500/50' },
};

export interface InventoryItem {
  id: string;
  name: string;
  type: ItemType;
  description: string;
  stats?: Partial<PlayerStats>;
  price: number;
  quantity: number;
  enhancementLevel?: number;
  grade?: ItemGrade;
}

export interface Equipment {
  weapon: InventoryItem | null;
  armor: InventoryItem | null;
  accessory: InventoryItem | null;
  boots: InventoryItem | null;
  bracelet: InventoryItem | null;
  waist: InventoryItem | null;
}

// ============================================================
// Skill types
// ============================================================

export interface Skill {
  id: string;
  name: string;
  description: string;
  spiritualPowerCost: number;
  damage: number;
  level: number;
  maxLevel: number;
  element: SkillElement;
  grade?: ItemGrade;
}

// ============================================================
// Quest types
// ============================================================

export interface QuestRewards {
  gold: number;
  cultivation: number;
  reputation?: number;
  realmStones?: number;
  talentPoint?: number;
}

export interface Quest {
  id: string;
  type: 'main' | 'side' | 'daily' | 'weekly' | 'timed' | 'branch' | 'faction';
  name: string;
  description: string;
  target: number;
  current: number;
  rewards: QuestRewards;
  isClaimed: boolean;
  isCompleted: boolean;
  requiredBackground?: 'sect' | 'master' | 'solo' | 'family';
  unlockCondition?: string;
}

// ============================================================
// Formation types
// ============================================================

export interface Formation {
  id: string;
  name: string;
  type: FormationType;
  description: string;
  requiredSkills: string[];
  requiredRealm?: number;
  effect: {
    attackBonus?: number;
    defenseBonus?: number;
    critRateBonus?: number;
    hpRegen?: number;
    spiritualPowerRegen?: number;
  };
  cost: number;
  duration: number;
  cooldown: number;
}

// ============================================================
// Pet types
// ============================================================

export interface PetStats {
  attack?: number;
  defense?: number;
  speed?: number;
  hp?: number;
}

export interface Pet {
  id: string;
  name: string;
  type: PetType;
  description: string;
  icon: string;
  level: number;
  maxLevel: number;
  loyalty: number;
  stats: PetStats;
  skills: string[];
}

// ============================================================
// Talent types
// ============================================================

export interface Talent {
  id: string;
  name: string;
  description: string;
  branch: TalentBranch;
  tier: number;
  requiredTalents: string[];
  cost: number;
  effect: Record<string, number>;
}

// ============================================================
// Achievement types
// ============================================================

export interface AchievementReward {
  gold?: number;
  cultivation?: number;
  talentPoint?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  reward: AchievementReward;
  condition: (state: GameState) => boolean;
}

// ============================================================
// Story / Event types
// ============================================================

export interface StoryChoice {
  text: string;
  nextNode?: string;
  requirement?: { minRealm?: number; minGold?: number };
  rewards?: Record<string, number>;
  consequence?: string;
}

export interface StoryNode {
  id: string;
  title: string;
  content: string;
  choices: StoryChoice[];
  isCompleted: boolean;
}

export interface RandomEventChoice {
  text: string;
  effects?: Record<string, number | { faction: string; amount: number }>;
  successRate?: number;
  successMsg: string;
  failMsg?: string;
}

export interface RandomEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  choices: RandomEventChoice[];
}

// ============================================================
// Player Stats
// ============================================================

export interface PlayerStats {
  realm: number;
  subLevel: number;
  cultivation: number;
  cultivationNext: number;
  hp: number;
  hpMax: number;
  spiritualPower: number;
  spiritualPowerMax: number;
  attack: number;
  defense: number;
  agility: number;
  intelligence: number;
  luck: number;
  spiritualRoot: number;
  stamina: number;
  staminaMax: number;
  critRate: number;
  evasionRate: number;
  lifesteal: number;
  attackBonus?: number;
  defenseBonus?: number;
  tempAttackBonus?: number;
  tempDefenseBonus?: number;
  tempCritBonus?: number;
  daoFoundation: DaoFoundation;
  breakthroughBonusItems: string[];
  breakthroughBonusRate: number;
  spiritTreasureBonusRate: number;
}

// ============================================================
// System sub-state types
// ============================================================

// ============================================================
// Breakthrough Enhancement Types
// ============================================================

export interface BreakthroughBonusItem {
  id: string;
  name: string;
  description: string;
  bonusRate: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requiredRealm?: number;
  duration?: number;
  icon: string;
  color: string;
}

export interface DaoFoundation {
  level: number;
  quality: 'mortal' | 'spirit' | 'immortal' | 'celestial' | 'divine';
  bonusRate: number;
  description: string;
  lastEnhancedAt?: number;
  enhancedBy?: string;
}

export interface SpiritTreasureInventory {
  treasureId: string;
  equipped: boolean;
  slot?: 'active' | 'passive';
  level: number;
}

export interface SecretRealmProgress {
  realmId: string;
  currentLevel: number;
  completed: boolean;
  timesCompleted: number;
  highestLevelReached: number;
  fragmentsCollected: number;
  lastVisitTime: number;
}

export interface EventHistory {
  eventId: string;
  triggeredAt: number;
  choiceMade: number;
  outcome: 'success' | 'failure';
}

export interface Buff {
  id: string;
  name: string;
  description: string;
  type: 'buff' | 'debuff';
  effect: Partial<Record<keyof PlayerStats, number>>;
  duration: number;
  remainingDuration: number;
  icon: string;
}

export interface DaoHeartRecord {
  id: string;
  timestamp: number;
  choice: string;
  description: string;
  npcId?: string;
}

export interface DaoHeartState {
  righteousPoints: number;
  evilPoints: number;
  currentType: 'righteous' | 'evil' | 'neutral';
  records: DaoHeartRecord[];
}

export interface EnlightenmentChoice {
  id: string;
  text: string;
  effects: Record<string, number>;
  description: string;
  daoHeart?: 'righteous';
}

export interface EnlightenmentEvent {
  id: string;
  title: string;
  description: string;
  choices: EnlightenmentChoice[];
}

export interface EnlightenmentState {
  active: boolean;
  currentEvent: EnlightenmentEvent | null;
  remainingTime: number;
}

export interface DemonHeartDefeated {
  monsterId: string;
  realm: number;
  timestamp: number;
}

export interface DemonHeartState {
  enabled: boolean;
  strongestDefeated: DemonHeartDefeated | null;
  timesChallenged: number;
  timesVictory: number;
}

export interface KarmaEvent {
  id: string;
  type: string;
  description: string;
  npcId?: string;
  timestamp: number;
}

export interface KarmaState {
  events: KarmaEvent[];
  currentKarma: number;
}

export interface AdWatchRecord {
  type: string;
  timestamp: number;
}

export interface AdWatchState {
  records: AdWatchRecord[];
  todayCount: number;
}

// ============================================================
// NPC types (imported from npcTemplates)
// ============================================================

import type { NPC } from './npcTemplates';
import type { WorldEvent } from './worldEvents';
import type { Announcement } from './announcements';

export type { NPC, WorldEvent, Announcement };

// ============================================================
// GameState — the full persistent state
// ============================================================

export interface GameState {
  playerName: string;
  gold: number;
  stats: PlayerStats;
  inventory: InventoryItem[];
  equipment: Equipment;
  skills: Skill[];
  quests: Quest[];
  location: string;
  battleHistory: string[];
  totalKills: Record<string, number>;
  playTime: number;
  physique: Physique;
  lingen: Lingen;
  background: Background | null;
  force: Force | null;
  master: Master | null;
  gameStarted: boolean;
  npcFavorability: Record<string, number>;
  npcPersonalities: Record<string, string>;
  npcEvents: Record<string, string[]>;
  gameTime: number;
  weather: WeatherType;
  currentEvent: RandomEvent | null;
  lastEventTime: number;
  unlockedAchievements: string[];
  claimedAchievements: string[];
  dailyResetTime: number;
  weeklyResetTime: number;
  activeFormation: string | null;
  formationEndTime: number;
  formationCooldowns: Record<string, number>;
  hasActivatedFormation: boolean;
  pets: Pet[];
  activePet: string | null;
  talentPoints: number;
  unlockedTalents: string[];
  currentStoryNode: string | null;
  completedStories: string[];
  wildPetsDefeated: Record<string, boolean>;
  petFavorability: Record<string, number>;
  monsters: Monster[];
  reputation: Record<string, number>;
  secretRealms: SecretRealmProgress[];
  spiritTreasures: SpiritTreasureInventory[];
  treasureFragments: Record<string, number>;
  eventHistory: EventHistory[];
  currentSecretRealm: string | null;
  currentRandomEvent: any;
  realmStones: number;
  totalEventsTriggered: number;
  weeklyRealmRuns: Record<string, number>;
  weeklyRealmResetTime: number;
  // 新增字段
  totalCultivation: number;
  totalGold: number;
  // NPC system
  npcs: NPC[];
  lastSimulatedTime: number;
  // World events
  activeWorldEvents: WorldEvent[];
  pastWorldEvents: WorldEvent[];
  // Buff/Debuff system
  buffs: Buff[];
  // Announcement system
  announcements: Announcement[];
  // Dao heart system
  daoHeart: DaoHeartState;
  // Enlightenment system
  enlightenment: EnlightenmentState;
  // Demon heart system
  demonHeart: DemonHeartState;
  // Karma system
  karma: KarmaState;
  // Ad watch system
  adWatch: AdWatchState;
}
