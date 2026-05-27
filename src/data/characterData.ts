/**
 * Character Creation Data - 角色创建相关数据
 * 包含：体质、灵根、背景、势力、师父、道基
 */
import type { Physique, Lingen, Background, Force, Master, DaoFoundation } from './types';

// ============================================================
// 体质数据
// ============================================================
export const PHYSIQUES: Physique[] = [
  { id: 'normal', name: '凡体', desc: '平平无奇的凡胎肉体', rarity: 65, color: 'text-gray-600', effect: {} },
  { id: 'fire', name: '焚天战体', desc: '烈焰缠身，火属性伤害+30%', rarity: 8, color: 'text-orange-600', effect: { attack: 10, hpMax: 20 } },
  { id: 'ice', name: '寒冰仙体', desc: '寒气逼人，冰属性伤害+30%', rarity: 8, color: 'text-cyan-600', effect: { spiritualPowerMax: 30, defense: 5 } },
  { id: 'thunder', name: '雷霆道体', desc: '雷罚降临，暴击率+20%', rarity: 5, color: 'text-yellow-600', effect: { attack: 15, agility: 10, critRate: 0.1 } },
  { id: 'sword', name: '万剑之体', desc: '天生剑修，剑法伤害+50%', rarity: 3, color: 'text-blue-600', effect: { attack: 20, intelligence: 10 } },
  { id: 'undying', name: '不死之体', desc: '生命力极强，恢复速度+100%', rarity: 2, color: 'text-green-600', effect: { hpMax: 50, defense: 15 } },
  { id: 'void', name: '虚空霸体', desc: '傲视诸天，全属性+50%', rarity: 1, color: 'text-purple-600', effect: { attack: 30, defense: 20, hpMax: 80, spiritualPowerMax: 50, intelligence: 15 } },
];

// ============================================================
// 灵根数据 - 统一品阶命名
// ============================================================
export const LINGEN: Lingen[] = [
  { 
    id: 'xiapinlinggen', 
    name: '下品灵根', 
    desc: '金木水火土五行俱全，但每样都不精通，修炼速度缓慢', 
    rarity: 30, 
    color: 'text-gray-500', 
    effect: { spiritualRoot: 1 },
    type: 'xiapinlinggen',
    cultivationMultiplier: 0.3,
    affinities: [
      { element: 'jin', name: '金', value: 20 },
      { element: 'mu', name: '木', value: 20 },
      { element: 'shui', name: '水', value: 20 },
      { element: 'huo', name: '火', value: 20 },
      { element: 'tu', name: '土', value: 20 }
    ]
  },
  { 
    id: 'fanpinlinggen', 
    name: '凡品灵根', 
    desc: '拥有四种属性，修炼速度较慢', 
    rarity: 25, 
    color: 'text-gray-600', 
    effect: { spiritualRoot: 2 },
    type: 'fanpinlinggen',
    cultivationMultiplier: 0.5,
    affinities: [
      { element: 'jin', name: '金', value: 25 },
      { element: 'mu', name: '木', value: 25 },
      { element: 'shui', name: '水', value: 25 },
      { element: 'huo', name: '火', value: 25 }
    ]
  },
  { 
    id: 'zhongpinlinggen', 
    name: '中品灵根', 
    desc: '拥有三种属性，修炼速度一般', 
    rarity: 20, 
    color: 'text-yellow-700', 
    effect: { spiritualRoot: 4 },
    type: 'zhongpinlinggen',
    cultivationMultiplier: 0.8,
    affinities: [
      { element: 'jin', name: '金', value: 33 },
      { element: 'shui', name: '水', value: 33 },
      { element: 'tu', name: '土', value: 34 }
    ]
  },
  { 
    id: 'shangpinlinggen', 
    name: '上品灵根', 
    desc: '拥有两种属性，修炼速度较快，也称「真灵根」', 
    rarity: 12, 
    color: 'text-orange-600', 
    effect: { spiritualRoot: 6 },
    type: 'shangpinlinggen',
    cultivationMultiplier: 1.5,
    affinities: [
      { element: 'huo', name: '火', value: 50 },
      { element: 'tu', name: '土', value: 50 }
    ]
  },
  { 
    id: 'jipinlinggen_jin', 
    name: '金系极品灵根', 
    desc: '纯金属性，修炼金系功法一日千里', 
    rarity: 3, 
    color: 'text-yellow-500', 
    effect: { spiritualRoot: 8, attack: 5 },
    type: 'jipinlinggen',
    cultivationMultiplier: 3.0,
    affinities: [{ element: 'jin', name: '金', value: 100 }]
  },
  { 
    id: 'jipinlinggen_mu', 
    name: '木系极品灵根', 
    desc: '纯木属性，修炼木系功法一日千里', 
    rarity: 3, 
    color: 'text-green-500', 
    effect: { spiritualRoot: 8, intelligence: 5 },
    type: 'jipinlinggen',
    cultivationMultiplier: 3.0,
    affinities: [{ element: 'mu', name: '木', value: 100 }]
  },
  { 
    id: 'jipinlinggen_shui', 
    name: '水系极品灵根', 
    desc: '纯水属性，修炼水系功法一日千里', 
    rarity: 3, 
    color: 'text-blue-500', 
    effect: { spiritualRoot: 8, spiritualPowerMax: 10 },
    type: 'jipinlinggen',
    cultivationMultiplier: 3.0,
    affinities: [{ element: 'shui', name: '水', value: 100 }]
  },
  { 
    id: 'jipinlinggen_huo', 
    name: '火系极品灵根', 
    desc: '纯火属性，修炼火系功法一日千里', 
    rarity: 3, 
    color: 'text-red-500', 
    effect: { spiritualRoot: 8, attack: 8 },
    type: 'jipinlinggen',
    cultivationMultiplier: 3.0,
    affinities: [{ element: 'huo', name: '火', value: 100 }]
  },
  { 
    id: 'jipinlinggen_tu', 
    name: '土系极品灵根', 
    desc: '纯土属性，修炼土系功法一日千里', 
    rarity: 3, 
    color: 'text-amber-600', 
    effect: { spiritualRoot: 8, defense: 10 },
    type: 'jipinlinggen',
    cultivationMultiplier: 3.0,
    affinities: [{ element: 'tu', name: '土', value: 100 }]
  },
  { 
    id: 'juepinlinggen_lei', 
    name: '雷系绝品灵根', 
    desc: '变异雷系灵根，攻击力惊人，修炼速度极快', 
    rarity: 1.5, 
    color: 'text-yellow-400', 
    effect: { spiritualRoot: 9, attack: 12, critRate: 0.05 },
    type: 'juepinlinggen',
    cultivationMultiplier: 3.5,
    affinities: [{ element: 'lei', name: '雷', value: 100 }]
  },
  { 
    id: 'juepinlinggen_feng', 
    name: '风系绝品灵根', 
    desc: '变异风系灵根，身法敏捷，修炼速度极快', 
    rarity: 1.5, 
    color: 'text-cyan-400', 
    effect: { spiritualRoot: 9, agility: 15, evasionRate: 0.05 },
    type: 'juepinlinggen',
    cultivationMultiplier: 3.5,
    affinities: [{ element: 'feng', name: '风', value: 100 }]
  },
  { 
    id: 'juepinlinggen_bing', 
    name: '冰系绝品灵根', 
    desc: '变异冰系灵根，冰系功法威力加倍', 
    rarity: 1.5, 
    color: 'text-blue-300', 
    effect: { spiritualRoot: 9, defense: 8, spiritualPowerMax: 15 },
    type: 'juepinlinggen',
    cultivationMultiplier: 3.5,
    affinities: [{ element: 'bing', name: '冰', value: 100 }]
  },
  { 
    id: 'shenpinlinggen_yinyang', 
    name: '阴阳神品灵根', 
    desc: '传说中的阴阳灵根，蕴含天地至理', 
    rarity: 0.8, 
    color: 'text-indigo-500', 
    effect: { spiritualRoot: 10, attack: 10, defense: 10, intelligence: 10 },
    type: 'shenpinlinggen',
    cultivationMultiplier: 4.0,
    affinities: [{ element: 'yinyang', name: '阴阳', value: 100 }]
  },
  { 
    id: 'shenpinlinggen_kong', 
    name: '空神圣品灵根', 
    desc: '传说中的空属性灵根，空间法则的宠儿', 
    rarity: 0.5, 
    color: 'text-purple-500', 
    effect: { spiritualRoot: 11, intelligence: 15, luck: 5 },
    type: 'shenpinlinggen',
    cultivationMultiplier: 4.5,
    affinities: [{ element: 'kong', name: '空', value: 100 }]
  },
  { 
    id: 'shenpinlinggen_shijian', 
    name: '时间神品灵根', 
    desc: '传说中的时间灵根，能够操控时间流速', 
    rarity: 0.3, 
    color: 'text-silver-400', 
    effect: { spiritualRoot: 11, intelligence: 20, luck: 8 },
    type: 'shenpinlinggen',
    cultivationMultiplier: 5.0,
    affinities: [{ element: 'shijian', name: '时间', value: 100 }]
  },
  { 
    id: 'xianpinlinggen', 
    name: '混沌仙品灵根', 
    desc: '传说中的混沌灵根，蕴含宇宙本源，修炼速度恐怖如斯', 
    rarity: 0.1, 
    color: 'text-purple-600', 
    effect: { spiritualRoot: 15, attack: 15, defense: 15, hpMax: 30, spiritualPowerMax: 30, intelligence: 15, luck: 10 },
    type: 'xianpinlinggen',
    cultivationMultiplier: 8.0,
    affinities: [
      { element: 'hun', name: '混沌', value: 100 },
      { element: 'wuxing', name: '五行', value: 100 }
    ]
  }
];

// ============================================================
// 背景数据
// ============================================================
export const BACKGROUNDS: Background[] = [
  { id: 'sect', name: '拜入宗门', desc: '加入一个宗门，获得稳定资源和庇护，但行动受限', icon: '🏯', effect: { gold: 40, hpMax: 10, agility: -2 } },
  { id: 'master', name: '拜人为师', desc: '拜一位神秘人物为师，获得指点但资源稀少', icon: '🧙', effect: { gold: 20, attack: 5, defense: -2 } },
  { id: 'solo', name: '独自修炼', desc: '独自一人闯荡江湖，自由自在但缺少支援', icon: '🧘', effect: { gold: 30, agility: 5, hpMax: -10 } },
  { id: 'family', name: '家族势力', desc: '背靠家族，资源充足但受家族事务缠身', icon: '🏠', effect: { gold: 50, defense: 5, intelligence: -2 } },
];

// ============================================================
// 势力数据
// ============================================================
export const FORCES: Force[] = [
  { id: 'xuanjian', name: '玄剑宗', desc: '剑道宗门，剑法专精' },
  { id: 'danding', name: '丹鼎阁', desc: '炼丹宗门，丹药众多' },
  { id: 'jiuxiao', name: '九霄阁', desc: '底蕴深厚的大宗门' },
  { id: 'xuantian', name: '玄天殿', desc: '神秘莫测的势力' },
  { id: 'none', name: '无势力', desc: '无门无派' },
];

// ============================================================
// 师父数据
// ============================================================
export const MASTERS: Master[] = [
  { id: 'hermit', name: '太上真君', desc: '隐世数千年的仙尊', isBoss: true, chance: 0.15, bonus: { attack: 15, intelligence: 10 } },
  { id: 'phoenix', name: '凤凰仙子', desc: '涅槃重生的上古神兽', isBoss: true, chance: 0.15, bonus: { hp: 50, spiritualPower: 30 } },
  { id: 'sword', name: '剑仙李逍遥', desc: '一剑破万法的传奇剑修', isBoss: true, chance: 0.1, bonus: { attack: 20, agility: 10 } },
  { id: 'alchemist', name: '丹圣玄机子', desc: '炼丹宗师，活死人肉白骨', isBoss: true, chance: 0.1, bonus: { intelligence: 15, gold: 100 } },
  { id: 'weak', name: '王二狗', desc: '自称曾是仙门弟子', isBoss: false, chance: 0.2, bonus: { gold: 50 } },
  { id: 'farmer', name: '老农夫', desc: '看起来只是个普通人', isBoss: false, chance: 0.15, bonus: { stamina: 20 } },
  { id: 'drunkard', name: '醉仙翁', desc: '嗜酒如命的落魄道士', isBoss: false, chance: 0.15, bonus: { luck: 5 } },
];

// ============================================================
// 道基数据 - 用于角色创建时抽取
// ============================================================
export const DAO_FOUNDATIONS = [
  {
    id: 'furen',
    name: '凡人道基',
    quality: 'mortal',
    bonusRate: 0,
    desc: '凡人道基，根基浅薄',
    rarity: 50,
    color: 'text-gray-600'
  },
  {
    id: 'linggen',
    name: '灵根道基',
    quality: 'spirit',
    bonusRate: 0.05,
    desc: '灵根道基，根基稳固，突破成功概率+5%',
    rarity: 30,
    color: 'text-blue-600'
  },
  {
    id: 'xianren',
    name: '仙人道基',
    quality: 'immortal',
    bonusRate: 0.12,
    desc: '仙人道基，脱胎换骨，突破成功概率+12%',
    rarity: 15,
    color: 'text-purple-600'
  },
  {
    id: 'tiandao',
    name: '天道道基',
    quality: 'celestial',
    bonusRate: 0.25,
    desc: '天道道基，与道合真，突破成功概率+25%',
    rarity: 4,
    color: 'text-yellow-600'
  },
  {
    id: 'dadao',
    name: '大道道基',
    quality: 'divine',
    bonusRate: 0.4,
    desc: '大道道基，证道之基，突破成功概率+40%',
    rarity: 1,
    color: 'text-rose-600'
  }
];

// ============================================================
// 初始道基（凡人）
// ============================================================
export const INITIAL_DAO_FOUNDATION: DaoFoundation = {
  level: 1,
  quality: 'mortal',
  bonusRate: 0,
  description: '凡人道基，根基浅薄'
};