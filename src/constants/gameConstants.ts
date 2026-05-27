export const PROPERTY_NAMES: Record<string, string> = {
  'attack': '攻击',
  'defense': '防御',
  'hp': '气血',
  'hpMax': '最大气血',
  'spiritualPower': '灵力',
  'spiritualPowerMax': '最大灵力',
  'stamina': '体力',
  'staminaMax': '最大体力',
  'agility': '敏捷',
  'intelligence': '悟性',
  'luck': '运气',
  'spiritualRoot': '灵根',
  'cultivation': '修为',
  'gold': '灵石',
  'critRate': '暴击率',
  'evasionRate': '闪避率',
  'lifesteal': '吸血',
  'attackBonus': '攻击加成',
  'defenseBonus': '防御加成',
  'critRateBonus': '暴击加成',
  'hpRegen': '气血恢复',
  'spiritualPowerRegen': '灵力恢复',
  'speed': '速度',
  'reputation': '声望',
};

// 元素相克关系：金克木，木克土，土克水，水克火，火克金
export const ELEMENT_ADVANTAGE: Record<string, Record<string, number>> = {
  'jin': { 'mu': 1.5 },
  'mu': { 'tu': 1.5 },
  'tu': { 'shui': 1.5 },
  'shui': { 'huo': 1.5 },
  'huo': { 'jin': 1.5 },
  'feng': { 'tu': 1.3, 'mu': 1.2 },
  'lei': { 'shui': 1.3, 'huo': 1.2 },
  'bing': { 'huo': 1.3, 'jin': 1.2 },
  'guang': { 'an': 1.5 },
  'an': { 'guang': 1.5 },
  'neutral': {},
};

export const ELEMENT_NAMES: Record<string, string> = {
  'jin': '金',
  'mu': '木',
  'shui': '水',
  'huo': '火',
  'tu': '土',
  'feng': '风',
  'lei': '雷',
  'bing': '冰',
  'guang': '光',
  'an': '暗',
  'neutral': '无',
};

export function getPropertyName(key: string): string {
  return PROPERTY_NAMES[key] || key;
}

export const BATTLE_QUOTES = {
  attack: [
    "在绝对的力量面前，一切都是徒劳！",
    "一剑斩破九重天！",
    "我要这诸天万界，都烟消云散！"
  ],
  dodge: [
    "你的速度太慢了！",
    "你连我衣角都碰不到！",
    "就这？"
  ],
  kill: [
    "土鸡瓦狗，不堪一击！",
    "在我眼中，你早已是死人！",
    "何人敢与我一战？"
  ]
};

export const FAVORABILITY_NAMES = ['陌生', '初识', '友好', '信赖', '挚友', '生死之交'];
export const PERSONALITY_TYPES = ['稳重', '活泼', '高冷', '贪财', '豪爽', '孤僻'];

export const PERSONALITY_DESCS: Record<string, string> = {
  '稳重': '办事靠谱，不会给你太冒进的建议',
  '活泼': '偶尔会触发惊喜事件，但也可能搞砸',
  '高冷': '很难打交道，但一旦成为朋友会给巨大帮助',
  '贪财': '需要更多灵石，但给的奖励也更好',
  '豪爽': '性格豪爽，经常给你额外好处',
  '孤僻': '独来独往，可能有独特的机缘'
};

export function getRandomPersonality(): string {
  return PERSONALITY_TYPES[Math.floor(Math.random() * PERSONALITY_TYPES.length)];
}

export const EQUIPMENT_SLOTS = ['weapon', 'armor', 'accessory', 'boots', 'bracelet', 'waist'] as const;
export type EquipmentSlotType = typeof EQUIPMENT_SLOTS[number];

export const SLOT_NAMES: Record<EquipmentSlotType, string> = {
  weapon: '武器',
  armor: '护甲',
  accessory: '饰品',
  boots: '靴子',
  bracelet: '护腕',
  waist: '腰带'
};

export const INITIAL_STAMINA_COSTS = {
  practice: 5,
  battle: 8,
  secretRealmRefresh: 5
};
