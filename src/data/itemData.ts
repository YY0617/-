/**
 * Item Data - 道具数据
 * 包含：消耗品、装备（6品阶）、材料、丹药、突破丹
 * 品阶：黄、玄、地、天、道、混
 */
import type { InventoryItem, Skill, Pet, Formation, Talent, BreakthroughBonusItem, ItemGrade } from './types';

// ============================================================
// 品阶前缀生成函数
// ============================================================
export function getGradePrefix(grade: ItemGrade): string {
  const prefixes: Record<ItemGrade, string> = {
    'huang': '黄阶·',
    'xuan': '玄阶·',
    'di': '地阶·',
    'tian': '天阶·',
    'dao': '道阶·',
    'hun': '混元·',
  };
  return prefixes[grade];
}

// ============================================================
// 消耗品（不分品阶）
// ============================================================
export const CONSUMABLES: Omit<InventoryItem, 'quantity'>[] = [
  { id: 'qi_pill', name: '淬体丹', type: 'consumable', description: '恢复50气血', price: 30, grade: 'huang' },
  { id: 'spirit_pill', name: '通脉丹', type: 'consumable', description: '恢复30灵力', price: 25, grade: 'huang' },
  { id: 'big_qi_pill', name: '凝元丹', type: 'consumable', description: '恢复120气血', price: 80, grade: 'xuan' },
  { id: 'big_spirit_pill', name: '聚灵丹', type: 'consumable', description: '恢复70灵力', price: 65, grade: 'xuan' },
  { id: 'stamina_pill', name: '养神丹', type: 'consumable', description: '恢复20体力', price: 40, grade: 'huang' },
];

// ============================================================
// 炼丹材料
// ============================================================
export const ALCHEMY_MATERIALS: Omit<InventoryItem, 'quantity'>[] = [
  { id: 'herb_1', name: '灵草', type: 'consumable', description: '最基础的炼丹材料，随处可见', price: 10, grade: 'huang' },
  { id: 'herb_2', name: '灵花', type: 'consumable', description: '蕴含些许灵气的花朵', price: 30, grade: 'xuan' },
  { id: 'herb_3', name: '万年灵芝', type: 'consumable', description: '生长了万年的珍稀灵芝', price: 500, grade: 'tian' },
  { id: 'mineral_1', name: '灵石碎末', type: 'consumable', description: '灵石的碎末，仍有一定灵气', price: 20, grade: 'huang' },
  { id: 'mineral_2', name: '玄晶', type: 'consumable', description: '蕴含大道气息的神奇晶石', price: 200, grade: 'di' },
  { id: 'essence', name: '天地精华', type: 'consumable', description: '天地灵气凝结而成的至宝', price: 1000, grade: 'tian' },
  // 炼器材料
  { id: 'iron_ore', name: '铁矿石', type: 'consumable', description: '普通的铁矿石，可用于基础炼器', price: 10, grade: 'huang' },
  { id: 'jade_stone', name: '玉石', type: 'consumable', description: '蕴含灵气的玉石', price: 30, grade: 'xuan' },
  { id: 'purple_gold', name: '紫金', type: 'consumable', description: '稀有的紫金矿石', price: 150, grade: 'di' },
  { id: 'spirit_essence', name: '灵魄精华', type: 'consumable', description: '蕴含强大力量的精华', price: 400, grade: 'tian' },
  { id: 'heavenly_essence', name: '天灵髓', type: 'consumable', description: '传说中的天材地宝', price: 1200, grade: 'dao' },
];

// ============================================================
// 武器（6品阶 × 3种）
// ============================================================
export const WEAPONS: Omit<InventoryItem, 'quantity'>[] = [
  // 黄阶武器
  { id: 'weapon_huang_1', name: '黄阶·玄铁剑', type: 'weapon', description: '攻击+5，基础剑器', price: 80, stats: { attack: 5 }, grade: 'huang' },
  { id: 'weapon_huang_2', name: '黄阶·精钢刀', type: 'weapon', description: '攻击+6，沉重有力', price: 100, stats: { attack: 6 }, grade: 'huang' },
  { id: 'weapon_huang_3', name: '黄阶·铁骨鞭', type: 'weapon', description: '攻击+5，柔韧灵活', price: 90, stats: { attack: 5, agility: 1 }, grade: 'huang' },
  { id: 'iron_sword', name: '铁剑', type: 'weapon', description: '基础的铁剑', price: 50, stats: { attack: 10 }, grade: 'huang' },
  
  // 玄阶武器
  { id: 'weapon_xuan_1', name: '玄阶·灵纹剑', type: 'weapon', description: '攻击+12，灵力灌注', price: 280, stats: { attack: 12 }, grade: 'xuan' },
  { id: 'weapon_xuan_2', name: '玄阶·青锋剑', type: 'weapon', description: '攻击+11，敏捷+2', price: 300, stats: { attack: 11, agility: 2 }, grade: 'xuan' },
  { id: 'weapon_xuan_3', name: '玄阶·烈火刀', type: 'weapon', description: '攻击+13，火属性', price: 320, stats: { attack: 13 }, grade: 'xuan' },
  
  // 地阶武器
  { id: 'weapon_di_1', name: '地阶·赤霄剑', type: 'weapon', description: '攻击+22，暴击+5%', price: 800, stats: { attack: 22, critRate: 0.05 }, grade: 'di' },
  { id: 'weapon_di_2', name: '地阶·紫电剑', type: 'weapon', description: '攻击+20，敏捷+5', price: 850, stats: { attack: 20, agility: 5 }, grade: 'di' },
  { id: 'weapon_di_3', name: '地阶·青冥剑', type: 'weapon', description: '攻击+21，灵力+15', price: 900, stats: { attack: 21, spiritualPowerMax: 15 }, grade: 'di' },
  
  // 天阶武器
  { id: 'weapon_tian_1', name: '天阶·天瀑剑', type: 'weapon', description: '攻击+38，暴击+10%', price: 2500, stats: { attack: 38, critRate: 0.1 }, grade: 'tian' },
  { id: 'weapon_tian_2', name: '天阶·诛仙剑', type: 'weapon', description: '攻击+40，附带真伤', price: 3000, stats: { attack: 40 }, grade: 'tian' },
  { id: 'weapon_tian_3', name: '天阶·天羽剑', type: 'weapon', description: '攻击+35，敏捷+12', price: 2800, stats: { attack: 35, agility: 12 }, grade: 'tian' },
  { id: 'spirit_sword', name: '灵剑', type: 'weapon', description: '蕴含灵力的宝剑', price: 2000, stats: { attack: 60, spiritualPowerMax: 40, critRate: 0.1 }, grade: 'tian' },
  
  // 道阶武器
  { id: 'weapon_dao_1', name: '道阶·道衍剑', type: 'weapon', description: '攻击+60，道法加持', price: 8000, stats: { attack: 60, intelligence: 10 }, grade: 'dao' },
  { id: 'weapon_dao_2', name: '道阶·道心剑', type: 'weapon', description: '攻击+55，悟性+15', price: 8500, stats: { attack: 55, intelligence: 15 }, grade: 'dao' },
  { id: 'weapon_dao_3', name: '道阶·大道剑', type: 'weapon', description: '攻击+65，全属性+5', price: 10000, stats: { attack: 65, intelligence: 5, luck: 5 }, grade: 'dao' },
  { id: 'heavenly_sword', name: '天道神剑', type: 'weapon', description: '传说中的天道神剑', price: 7000, stats: { attack: 150, spiritualPowerMax: 100, critRate: 0.2, luck: 10 }, grade: 'dao' },
  
  // 混元阶武器
  { id: 'weapon_hun_1', name: '混元·混沌剑', type: 'weapon', description: '攻击+100，混沌之力', price: 30000, stats: { attack: 100, critRate: 0.15, lifesteal: 0.1 }, grade: 'hun' },
  { id: 'weapon_hun_2', name: '混元·鸿蒙剑', type: 'weapon', description: '攻击+95，鸿蒙开辟', price: 35000, stats: { attack: 95, intelligence: 25 }, grade: 'hun' },
  { id: 'weapon_hun_3', name: '混元·起源剑', type: 'weapon', description: '攻击+120，起源之力', price: 50000, stats: { attack: 120 }, grade: 'hun' },
];

// ============================================================
// 防具（6品阶 × 3种）
// ============================================================
export const ARMORS: Omit<InventoryItem, 'quantity'>[] = [
  // 黄阶防具
  { id: 'armor_huang_1', name: '黄阶·布衫', type: 'armor', description: '防御+4，轻便舒适', price: 60, stats: { defense: 4 }, grade: 'huang' },
  { id: 'armor_huang_2', name: '黄阶·皮甲', type: 'armor', description: '防御+5，防护一般', price: 80, stats: { defense: 5 }, grade: 'huang' },
  { id: 'armor_huang_3', name: '黄阶·粗布衣', type: 'armor', description: '防御+4，气血+10', price: 70, stats: { defense: 4, hpMax: 10 }, grade: 'huang' },
  
  // 玄阶防具
  { id: 'armor_xuan_1', name: '玄阶·灵纹袍', type: 'armor', description: '防御+9，灵力+12', price: 300, stats: { defense: 9, spiritualPowerMax: 12 }, grade: 'xuan' },
  { id: 'armor_xuan_2', name: '玄阶·玄铁甲', type: 'armor', description: '防御+12，笨重但坚固', price: 350, stats: { defense: 12 }, grade: 'xuan' },
  { id: 'armor_xuan_3', name: '玄阶·精钢衣', type: 'armor', description: '防御+10，气血+20', price: 320, stats: { defense: 10, hpMax: 20 }, grade: 'xuan' },
  
  // 地阶防具
  { id: 'armor_di_1', name: '地阶·玄武甲', type: 'armor', description: '防御+20，反伤+5%', price: 900, stats: { defense: 20 }, grade: 'di' },
  { id: 'armor_di_2', name: '地阶·紫霞衣', type: 'armor', description: '防御+18，灵力+25', price: 950, stats: { defense: 18, spiritualPowerMax: 25 }, grade: 'di' },
  { id: 'armor_di_3', name: '地阶·碧鳞甲', type: 'armor', description: '防御+22，气血+40', price: 1000, stats: { defense: 22, hpMax: 40 }, grade: 'di' },
  { id: 'purple_gold_armor', name: '紫金战甲', type: 'armor', description: '稀有的紫金战甲，强力的防护', price: 800, stats: { defense: 35, hpMax: 50 }, grade: 'di' },
  
  // 天阶防具
  { id: 'armor_tian_1', name: '天阶·玄武战甲', type: 'armor', description: '防御+35，反伤+10%', price: 2800, stats: { defense: 35 }, grade: 'tian' },
  { id: 'armor_tian_2', name: '天阶·天蚕宝衣', type: 'armor', description: '防御+30，闪避+8%', price: 3000, stats: { defense: 30, evasionRate: 0.08 }, grade: 'tian' },
  { id: 'armor_tian_3', name: '天阶·天羽战袍', type: 'armor', description: '防御+32，气血+80', price: 3200, stats: { defense: 32, hpMax: 80 }, grade: 'tian' },
  
  // 道阶防具
  { id: 'armor_dao_1', name: '道阶·道祖袍', type: 'armor', description: '防御+50，道法护体', price: 8500, stats: { defense: 50, intelligence: 10 }, grade: 'dao' },
  { id: 'armor_dao_2', name: '道阶·大道金甲', type: 'armor', description: '防御+55，反伤+15%', price: 10000, stats: { defense: 55 }, grade: 'dao' },
  { id: 'armor_dao_3', name: '道阶·太极道衣', type: 'armor', description: '防御+52，气血+120', price: 9500, stats: { defense: 52, hpMax: 120 }, grade: 'dao' },
  
  // 混元阶防具
  { id: 'armor_hun_1', name: '混元·混沌战衣', type: 'armor', description: '防御+85，混沌护体', price: 30000, stats: { defense: 85, hpMax: 150 }, grade: 'hun' },
  { id: 'armor_hun_2', name: '混元·鸿蒙圣甲', type: 'armor', description: '防御+90，鸿蒙不灭', price: 35000, stats: { defense: 90, evasionRate: 0.15 }, grade: 'hun' },
  { id: 'armor_hun_3', name: '混元·起源道袍', type: 'armor', description: '防御+100，生命起源', price: 50000, stats: { defense: 100, hpMax: 200, spiritualPowerMax: 100 }, grade: 'hun' },
];

// ============================================================
// 饰品（6品阶 × 3种）
// ============================================================
export const ACCESSORIES: Omit<InventoryItem, 'quantity'>[] = [
  // 黄阶饰品
  { id: 'accessory_huang_1', name: '黄阶·木簪', type: 'accessory', description: '灵力+5，简单装饰', price: 50, stats: { spiritualPowerMax: 5 }, grade: 'huang' },
  { id: 'accessory_huang_2', name: '黄阶·石戒', type: 'accessory', description: '气血+15，朴素无华', price: 60, stats: { hpMax: 15 }, grade: 'huang' },
  { id: 'accessory_huang_3', name: '黄阶·草环', type: 'accessory', description: '敏捷+2，轻便灵活', price: 55, stats: { agility: 2 }, grade: 'huang' },
  
  // 玄阶饰品
  { id: 'accessory_xuan_1', name: '玄阶·玉佩', type: 'accessory', description: '灵力+18，悟性+2', price: 280, stats: { spiritualPowerMax: 18, intelligence: 2 }, grade: 'xuan' },
  { id: 'accessory_xuan_2', name: '玄阶·银项链', type: 'accessory', description: '气血+35，灵力+10', price: 300, stats: { hpMax: 35, spiritualPowerMax: 10 }, grade: 'xuan' },
  { id: 'accessory_xuan_3', name: '玄阶·护符', type: 'accessory', description: '防御+3，闪避+3%', price: 320, stats: { defense: 3, evasionRate: 0.03 }, grade: 'xuan' },
  { id: 'jade_pendant', name: '玉佩', type: 'accessory', description: '精致的玉佩，可增加防御力', price: 200, stats: { defense: 8, spiritualPowerMax: 20 }, grade: 'xuan' },
  
  // 地阶饰品
  { id: 'accessory_di_1', name: '地阶·碧玉环', type: 'accessory', description: '灵力+35，悟性+5', price: 850, stats: { spiritualPowerMax: 35, intelligence: 5 }, grade: 'di' },
  { id: 'accessory_di_2', name: '地阶·紫金戒', type: 'accessory', description: '气血+70，攻击+5', price: 900, stats: { hpMax: 70, attack: 5 }, grade: 'di' },
  { id: 'accessory_di_3', name: '地阶·灵珠', type: 'accessory', description: '灵力+40，气血恢复+5', price: 950, stats: { spiritualPowerMax: 40, lifesteal: 0.05 }, grade: 'di' },
  
  // 天阶饰品
  { id: 'accessory_tian_1', name: '天阶·天珠', type: 'accessory', description: '灵力+60，天道加持', price: 2600, stats: { spiritualPowerMax: 60, intelligence: 10 }, grade: 'tian' },
  { id: 'accessory_tian_2', name: '天阶·天心玉', type: 'accessory', description: '悟性+15，气血+100', price: 2800, stats: { intelligence: 15, hpMax: 100 }, grade: 'tian' },
  { id: 'accessory_tian_3', name: '天阶·天命环', type: 'accessory', description: '闪避+12%，幸运+5', price: 3000, stats: { evasionRate: 0.12, luck: 5 }, grade: 'tian' },
  
  // 道阶饰品
  { id: 'accessory_dao_1', name: '道阶·道果', type: 'accessory', description: '灵力+100，道法自然', price: 8000, stats: { spiritualPowerMax: 100, intelligence: 20 }, grade: 'dao' },
  { id: 'accessory_dao_2', name: '道阶·道韵珠', type: 'accessory', description: '悟性+25，气血+150', price: 8500, stats: { intelligence: 25, hpMax: 150 }, grade: 'dao' },
  { id: 'accessory_dao_3', name: '道阶·大道之眼', type: 'accessory', description: '暴击+15%，闪避+10%', price: 10000, stats: { critRate: 0.15, evasionRate: 0.1 }, grade: 'dao' },
  
  // 混元阶饰品
  { id: 'accessory_hun_1', name: '混元·混沌珠', type: 'accessory', description: '全属性+30，混沌本源', price: 30000, stats: { intelligence: 30, spiritualPowerMax: 150, hpMax: 150 }, grade: 'hun' },
  { id: 'accessory_hun_2', name: '混元·命运之轮', type: 'accessory', description: '幸运+20，悟性+30', price: 35000, stats: { luck: 20, intelligence: 30 }, grade: 'hun' },
  { id: 'accessory_hun_3', name: '混元·起源之眼', type: 'accessory', description: '混沌初开，万物之源', price: 50000, stats: { attack: 50, defense: 50, intelligence: 50 }, grade: 'hun' },
];

// ============================================================
// 靴子（6品阶 × 3种）
// ============================================================
export const BOOTS: Omit<InventoryItem, 'quantity'>[] = [
  // 黄阶靴子
  { id: 'boots_huang_1', name: '黄阶·草鞋', type: 'boots', description: '敏捷+2，轻便透气', price: 40, stats: { agility: 2 }, grade: 'huang' },
  { id: 'boots_huang_2', name: '黄阶·布靴', type: 'boots', description: '敏捷+3，舒适耐用', price: 50, stats: { agility: 3 }, grade: 'huang' },
  { id: 'boots_huang_3', name: '黄阶·麻履', type: 'boots', description: '敏捷+2，气血+8', price: 45, stats: { agility: 2, hpMax: 8 }, grade: 'huang' },
  
  // 玄阶靴子
  { id: 'boots_xuan_1', name: '玄阶·疾风靴', type: 'boots', description: '敏捷+6，行动如风', price: 220, stats: { agility: 6 }, grade: 'xuan' },
  { id: 'boots_xuan_2', name: '玄阶·踏云靴', type: 'boots', description: '敏捷+7，闪避+3%', price: 250, stats: { agility: 7, evasionRate: 0.03 }, grade: 'xuan' },
  { id: 'boots_xuan_3', name: '玄阶·飞羽履', type: 'boots', description: '敏捷+8，轻盈如羽', price: 280, stats: { agility: 8 }, grade: 'xuan' },
  
  // 地阶靴子
  { id: 'boots_di_1', name: '地阶·青云靴', type: 'boots', description: '敏捷+12，腾云驾雾', price: 750, stats: { agility: 12 }, grade: 'di' },
  { id: 'boots_di_2', name: '地阶·玄武靴', type: 'boots', description: '敏捷+10，闪避+8%', price: 800, stats: { agility: 10, evasionRate: 0.08 }, grade: 'di' },
  { id: 'boots_di_3', name: '地阶·追风履', type: 'boots', description: '敏捷+14，速度极致', price: 850, stats: { agility: 14 }, grade: 'di' },
  
  // 天阶靴子
  { id: 'boots_tian_1', name: '天阶·天云履', type: 'boots', description: '敏捷+20，凌云踏虚', price: 2400, stats: { agility: 20 }, grade: 'tian' },
  { id: 'boots_tian_2', name: '天阶·风雷靴', type: 'boots', description: '敏捷+18，闪避+15%', price: 2600, stats: { agility: 18, evasionRate: 0.15 }, grade: 'tian' },
  { id: 'boots_tian_3', name: '天阶·天羽靴', type: 'boots', description: '敏捷+22，御风而行', price: 2800, stats: { agility: 22 }, grade: 'tian' },
  
  // 道阶靴子
  { id: 'boots_dao_1', name: '道阶·道行履', type: 'boots', description: '敏捷+30，道法自然', price: 7500, stats: { agility: 30, intelligence: 5 }, grade: 'dao' },
  { id: 'boots_dao_2', name: '道阶·大道履', type: 'boots', description: '敏捷+28，闪避+20%', price: 8000, stats: { agility: 28, evasionRate: 0.2 }, grade: 'dao' },
  { id: 'boots_dao_3', name: '道阶·天道靴', type: 'boots', description: '敏捷+35，天道加持', price: 9000, stats: { agility: 35 }, grade: 'dao' },
  
  // 混元阶靴子
  { id: 'boots_hun_1', name: '混元·混沌云靴', type: 'boots', description: '敏捷+50，混沌踏天', price: 28000, stats: { agility: 50, evasionRate: 0.25 }, grade: 'hun' },
  { id: 'boots_hun_2', name: '混元·鸿蒙履', type: 'boots', description: '敏捷+45，鸿蒙开辟', price: 32000, stats: { agility: 45 }, grade: 'hun' },
  { id: 'boots_hun_3', name: '混元·起源靴', type: 'boots', description: '敏捷+60，起源极速', price: 45000, stats: { agility: 60 }, grade: 'hun' },
];

// ============================================================
// 护腕（6品阶 × 3种）
// ============================================================
export const BRACELETS: Omit<InventoryItem, 'quantity'>[] = [
  // 黄阶护腕
  { id: 'bracelet_huang_1', name: '黄阶·草绳护腕', type: 'bracelet', description: '攻击+2，简单防护', price: 35, stats: { attack: 2 }, grade: 'huang' },
  { id: 'bracelet_huang_2', name: '黄阶·皮护腕', type: 'bracelet', description: '防御+2，基础防御', price: 45, stats: { defense: 2 }, grade: 'huang' },
  { id: 'bracelet_huang_3', name: '黄阶·粗麻护臂', type: 'bracelet', description: '攻击+2，防御+1', price: 50, stats: { attack: 2, defense: 1 }, grade: 'huang' },
  
  // 玄阶护腕
  { id: 'bracelet_xuan_1', name: '玄阶·玄铁护腕', type: 'bracelet', description: '攻击+5，防御+3', price: 180, stats: { attack: 5, defense: 3 }, grade: 'xuan' },
  { id: 'bracelet_xuan_2', name: '玄阶·灵纹护腕', type: 'bracelet', description: '防御+6，灵力+8', price: 200, stats: { defense: 6, spiritualPowerMax: 8 }, grade: 'xuan' },
  { id: 'bracelet_xuan_3', name: '玄阶·精钢护臂', type: 'bracelet', description: '攻击+6，敏捷+2', price: 220, stats: { attack: 6, agility: 2 }, grade: 'xuan' },
  
  // 地阶护腕
  { id: 'bracelet_di_1', name: '地阶·玄武护腕', type: 'bracelet', description: '攻击+10，防御+8', price: 650, stats: { attack: 10, defense: 8 }, grade: 'di' },
  { id: 'bracelet_di_2', name: '地阶·紫金护臂', type: 'bracelet', description: '防御+12，气血+25', price: 700, stats: { defense: 12, hpMax: 25 }, grade: 'di' },
  { id: 'bracelet_di_3', name: '地阶·金刚护腕', type: 'bracelet', description: '攻击+12，暴击+3%', price: 750, stats: { attack: 12, critRate: 0.03 }, grade: 'di' },
  
  // 天阶护腕
  { id: 'bracelet_tian_1', name: '天阶·天命护腕', type: 'bracelet', description: '攻击+20，防御+15', price: 2000, stats: { attack: 20, defense: 15 }, grade: 'tian' },
  { id: 'bracelet_tian_2', name: '天阶·天蚕护臂', type: 'bracelet', description: '防御+18，闪避+8%', price: 2200, stats: { defense: 18, evasionRate: 0.08 }, grade: 'tian' },
  { id: 'bracelet_tian_3', name: '天阶·天雷护腕', type: 'bracelet', description: '攻击+22，雷属性', price: 2400, stats: { attack: 22 }, grade: 'tian' },
  
  // 道阶护腕
  { id: 'bracelet_dao_1', name: '道阶·道祖护腕', type: 'bracelet', description: '攻击+35，防御+25', price: 6500, stats: { attack: 35, defense: 25 }, grade: 'dao' },
  { id: 'bracelet_dao_2', name: '道阶·大道护臂', type: 'bracelet', description: '防御+30，气血+80', price: 7000, stats: { defense: 30, hpMax: 80 }, grade: 'dao' },
  { id: 'bracelet_dao_3', name: '道阶·道心护腕', type: 'bracelet', description: '攻击+30，暴击+10%', price: 7500, stats: { attack: 30, critRate: 0.1 }, grade: 'dao' },
  
  // 混元阶护腕
  { id: 'bracelet_hun_1', name: '混元·混沌护腕', type: 'bracelet', description: '攻击+55，防御+45', price: 25000, stats: { attack: 55, defense: 45 }, grade: 'hun' },
  { id: 'bracelet_hun_2', name: '混元·鸿蒙护臂', type: 'bracelet', description: '防御+50，混沌护体', price: 28000, stats: { defense: 50, hpMax: 150 }, grade: 'hun' },
  { id: 'bracelet_hun_3', name: '混元·起源护腕', type: 'bracelet', description: '全属性+25，起源之力', price: 40000, stats: { attack: 50, defense: 50 }, grade: 'hun' },
];

// ============================================================
// 腰带（6品阶 × 3种）
// ============================================================
export const WAIST_ITEMS: Omit<InventoryItem, 'quantity'>[] = [
  // 黄阶腰带
  { id: 'waist_huang_1', name: '黄阶·草绳腰带', type: 'waist', description: '气血+12，简易束腰', price: 30, stats: { hpMax: 12 }, grade: 'huang' },
  { id: 'waist_huang_2', name: '黄阶·布腰带', type: 'waist', description: '气血+15，稳固耐用', price: 40, stats: { hpMax: 15 }, grade: 'huang' },
  { id: 'waist_huang_3', name: '黄阶·麻绳带', type: 'waist', description: '气血+10，敏捷+1', price: 35, stats: { hpMax: 10, agility: 1 }, grade: 'huang' },
  
  // 玄阶腰带
  { id: 'waist_xuan_1', name: '玄阶·玄铁腰带', type: 'waist', description: '气血+30，防护周全', price: 180, stats: { hpMax: 30 }, grade: 'xuan' },
  { id: 'waist_xuan_2', name: '玄阶·灵纹腰带', type: 'waist', description: '气血+35，灵力+8', price: 200, stats: { hpMax: 35, spiritualPowerMax: 8 }, grade: 'xuan' },
  { id: 'waist_xuan_3', name: '玄阶·精钢腰带', type: 'waist', description: '气血+28，防御+3', price: 220, stats: { hpMax: 28, defense: 3 }, grade: 'xuan' },
  
  // 地阶腰带
  { id: 'waist_di_1', name: '地阶·玄武腰带', type: 'waist', description: '气血+60，固若金汤', price: 600, stats: { hpMax: 60 }, grade: 'di' },
  { id: 'waist_di_2', name: '地阶·紫金腰带', type: 'waist', description: '气血+70，灵力+15', price: 650, stats: { hpMax: 70, spiritualPowerMax: 15 }, grade: 'di' },
  { id: 'waist_di_3', name: '地阶·金刚腰带', type: 'waist', description: '气血+55，防御+8', price: 700, stats: { hpMax: 55, defense: 8 }, grade: 'di' },
  
  // 天阶腰带
  { id: 'waist_tian_1', name: '天阶·天蚕腰带', type: 'waist', description: '气血+120，天蚕丝织', price: 1800, stats: { hpMax: 120 }, grade: 'tian' },
  { id: 'waist_tian_2', name: '天阶·天命腰带', type: 'waist', description: '气血+100，悟性+8', price: 2000, stats: { hpMax: 100, intelligence: 8 }, grade: 'tian' },
  { id: 'waist_tian_3', name: '天阶·天御腰带', type: 'waist', description: '气血+110，闪避+5%', price: 2200, stats: { hpMax: 110, evasionRate: 0.05 }, grade: 'tian' },
  
  // 道阶腰带
  { id: 'waist_dao_1', name: '道阶·道祖腰带', type: 'waist', description: '气血+180，道法护体', price: 6000, stats: { hpMax: 180 }, grade: 'dao' },
  { id: 'waist_dao_2', name: '道阶·大道腰带', type: 'waist', description: '气血+160，灵力+50', price: 6500, stats: { hpMax: 160, spiritualPowerMax: 50 }, grade: 'dao' },
  { id: 'waist_dao_3', name: '道阶·太极腰带', type: 'waist', description: '气血+200，防御+20', price: 7000, stats: { hpMax: 200, defense: 20 }, grade: 'dao' },
  
  // 混元阶腰带
  { id: 'waist_hun_1', name: '混元·混沌腰带', type: 'waist', description: '气血+300，混沌不灭', price: 22000, stats: { hpMax: 300 }, grade: 'hun' },
  { id: 'waist_hun_2', name: '混元·鸿蒙腰带', type: 'waist', description: '气血+280，鸿蒙开辟', price: 25000, stats: { hpMax: 280, spiritualPowerMax: 120 }, grade: 'hun' },
  { id: 'waist_hun_3', name: '混元·起源腰带', type: 'waist', description: '气血+350，生命起源', price: 35000, stats: { hpMax: 350, hp: 100 }, grade: 'hun' },
];

// ============================================================
// 商店物品（合并所有可购买物品）
// ============================================================
export const SHOP_ITEMS: Omit<InventoryItem, 'quantity'>[] = [
  ...CONSUMABLES,
  ...ALCHEMY_MATERIALS,
  ...WEAPONS,
  ...ARMORS,
  ...ACCESSORIES,
  ...BOOTS,
  ...BRACELETS,
  ...WAIST_ITEMS,
];

// ============================================================
// 突破丹（用于突破增强，按品阶分类）
// ============================================================
export const BREAKTHROUGH_PILLS: BreakthroughBonusItem[] = [
  { id: 'breakthrough_pill_1', name: '黄阶·破境丹', description: '最基础的突破辅助丹药，可小幅提升突破成功率', bonusRate: 0.15, rarity: 'common', icon: '丹', color: 'text-gray-600' },
  { id: 'breakthrough_pill_2', name: '玄阶·筑基丹', description: '稳固道基，显著提升突破成功率', bonusRate: 0.25, rarity: 'rare', requiredRealm: 2, icon: '丹', color: 'text-blue-500' },
  { id: 'breakthrough_pill_3', name: '地阶·金刚破境丹', description: '蕴含金刚之力，大幅提升突破成功率', bonusRate: 0.35, rarity: 'epic', requiredRealm: 3, icon: '丹', color: 'text-green-600' },
  { id: 'breakthrough_pill_4', name: '天阶·九转金丹', description: '九转成丹，珍稀至极，突破成功率大幅提升', bonusRate: 0.50, rarity: 'legendary', icon: '丹', color: 'text-purple-600' },
  { id: 'breakthrough_pill_5', name: '道阶·天道破境丹', description: '逆天改命，传说中可助人突破至大帝之境', bonusRate: 0.80, rarity: 'legendary', requiredRealm: 6, icon: '丹', color: 'text-orange-600' },
];

// ============================================================
// 功法数据
// ============================================================
export const SKILLS: Skill[] = [
  // 基础拳谱 - 无品阶
  { id: 'basic_fist', name: '基础拳谱', description: '朴实无华的拳术', spiritualPowerCost: 5, damage: 15, level: 1, maxLevel: 5, element: 'neutral' },
  // 黄阶功法
  { id: 'fire_palm', name: '黄阶·烈焰掌', description: '掌力炙热，可焚烧万物', spiritualPowerCost: 12, damage: 28, level: 1, maxLevel: 5, element: 'fire', grade: 'huang' },
  { id: 'ice_sword', name: '黄阶·寒霜剑诀', description: '剑气如霜，冰寒刺骨', spiritualPowerCost: 15, damage: 32, level: 1, maxLevel: 5, element: 'ice', grade: 'huang' },
  { id: 'shadow_step', name: '黄阶·影步', description: '身法如影，来去无踪', spiritualPowerCost: 8, damage: 12, level: 1, maxLevel: 5, element: 'shadow', grade: 'huang' },
  
  // 玄阶功法
  { id: 'thunder_strike', name: '玄阶·天雷一击', description: '引动天雷，威力惊人', spiritualPowerCost: 20, damage: 45, level: 1, maxLevel: 5, element: 'thunder', grade: 'xuan' },
  { id: 'wind_blade', name: '玄阶·风刃术', description: '凝聚风之力，形成锋利风刃', spiritualPowerCost: 18, damage: 40, level: 1, maxLevel: 5, element: 'neutral', grade: 'xuan' },
  { id: 'earth_shield', name: '玄阶·大地之盾', description: '召唤大地之力形成护盾', spiritualPowerCost: 25, damage: 20, level: 1, maxLevel: 5, element: 'neutral', grade: 'xuan' },
  { id: 'healing_light', name: '玄阶·治愈之光', description: '治愈之光，恢复气血', spiritualPowerCost: 30, damage: 0, level: 1, maxLevel: 5, element: 'neutral', grade: 'xuan' },
  
  // 地阶功法
  { id: 'inferno_blaze', name: '地阶·地狱业火', description: '召唤地狱之火，焚烧一切', spiritualPowerCost: 35, damage: 80, level: 1, maxLevel: 5, element: 'fire', grade: 'di' },
  { id: 'glacier_strike', name: '地阶·冰川怒击', description: '引动极寒之力，冻结万物', spiritualPowerCost: 40, damage: 75, level: 1, maxLevel: 5, element: 'ice', grade: 'di' },
  { id: 'storm_call', name: '地阶·风暴召唤', description: '召唤风暴，席卷战场', spiritualPowerCost: 45, damage: 90, level: 1, maxLevel: 5, element: 'thunder', grade: 'di' },
  
  // 天阶功法
  { id: 'sun_flare', name: '天阶·烈日耀斑', description: '引动太阳之力，光芒万丈', spiritualPowerCost: 60, damage: 150, level: 1, maxLevel: 5, element: 'fire', grade: 'tian' },
  { id: 'moon_frost', name: '天阶·月华霜冷', description: '借月华之力，冰封万里', spiritualPowerCost: 55, damage: 140, level: 1, maxLevel: 5, element: 'ice', grade: 'tian' },
  { id: 'starfall', name: '天阶·星辰坠落', description: '引动星辰之力，天降陨石', spiritualPowerCost: 70, damage: 180, level: 1, maxLevel: 5, element: 'thunder', grade: 'tian' },
  
  // 道阶功法
  { id: 'dao_fire', name: '道阶·大道火域', description: '领悟火之道，焚天煮海', spiritualPowerCost: 100, damage: 300, level: 1, maxLevel: 5, element: 'fire', grade: 'dao' },
  { id: 'dao_ice', name: '道阶·大道冰封', description: '领悟冰之道，冻结时空', spiritualPowerCost: 95, damage: 280, level: 1, maxLevel: 5, element: 'ice', grade: 'dao' },
  { id: 'dao_thunder', name: '道阶·大道雷霆', description: '领悟雷之道，万雷寂灭', spiritualPowerCost: 110, damage: 320, level: 1, maxLevel: 5, element: 'thunder', grade: 'dao' },
  
  // 混阶功法
  { id: 'chaos_fire', name: '混阶·混沌炎域', description: '混沌之火，焚烧诸天', spiritualPowerCost: 150, damage: 500, level: 1, maxLevel: 5, element: 'fire', grade: 'hun' },
  { id: 'chaos_void', name: '混阶·混沌虚空', description: '混沌之力，吞噬万物', spiritualPowerCost: 160, damage: 550, level: 1, maxLevel: 5, element: 'shadow', grade: 'hun' },
];

// ============================================================
// 功法商店价格
// ============================================================
export const SKILL_PRICES: Record<string, number> = {
  // 黄阶功法
  'fire_palm': 260,
  'ice_sword': 320,
  'shadow_step': 210,
  
  // 玄阶功法
  'thunder_strike': 450,
  'wind_blade': 420,
  'earth_shield': 480,
  'healing_light': 430,
  
  // 地阶功法
  'inferno_blaze': 800,
  'glacier_strike': 750,
  'storm_call': 850,
  
  // 天阶功法
  'sun_flare': 1500,
  'moon_frost': 1400,
  'starfall': 1600,
  
  // 道阶功法
  'dao_fire': 3000,
  'dao_ice': 2800,
  'dao_thunder': 3200,
  
  // 混阶功法
  'chaos_fire': 5000,
  'chaos_void': 5500,
};

// ============================================================
// 灵宠数据
// ============================================================
export const PET_TEMPLATES: Pet[] = [
  { id: 'pet_tiger', name: '烈焰虎', type: 'mount', description: '身披烈焰的猛虎', icon: '🐯', level: 1, maxLevel: 50, loyalty: 50, stats: { speed: 20, attack: 15 }, skills: ['冲锋', '烈焰爪'] },
  { id: 'pet_fox', name: '九尾灵狐', type: 'support', description: '拥有九条尾巴的灵狐', icon: '🦊', level: 1, maxLevel: 50, loyalty: 50, stats: { speed: 25, defense: 10 }, skills: ['幻术', '治愈'] },
  { id: 'pet_dragon', name: '青龙', type: 'combat', description: '传说中的青龙', icon: '🐉', level: 1, maxLevel: 100, loyalty: 50, stats: { attack: 50, defense: 30 }, skills: ['龙息', '龙威'] },
];

// ============================================================
// 阵法数据
// ============================================================
export const FORMATIONS: Formation[] = [
  { id: 'attack_formation', name: '攻击阵法', type: 'attack', description: '提升全体攻击力', requiredSkills: ['fire_palm', 'thunder_strike'], requiredRealm: 2, effect: { attackBonus: 0.2 }, cost: 100, duration: 300, cooldown: 600 },
  { id: 'defense_formation', name: '防御阵法', type: 'defense', description: '提升全体防御力', requiredSkills: ['ice_sword', 'earth_shield'], requiredRealm: 2, effect: { defenseBonus: 0.2 }, cost: 100, duration: 300, cooldown: 600 },
  { id: 'support_formation', name: '支援阵法', type: 'support', description: '提升气血恢复速度', requiredSkills: ['shadow_step', 'healing_light'], requiredRealm: 3, effect: { hpRegen: 5 }, cost: 150, duration: 300, cooldown: 900 },
];

// ============================================================
// 天赋数据
// ============================================================
export const TALENTS: Talent[] = [
  { id: 'power_1', name: '力量强化', description: '永久提升攻击力', branch: 'attack', tier: 1, requiredTalents: [], cost: 1, effect: { attack: 5 } },
  { id: 'power_2', name: '力量精通', description: '大幅提升攻击力', branch: 'attack', tier: 2, requiredTalents: ['power_1'], cost: 2, effect: { attack: 10 } },
  { id: 'defense_1', name: '防御强化', description: '永久提升防御力', branch: 'defense', tier: 1, requiredTalents: [], cost: 1, effect: { defense: 5 } },
  { id: 'defense_2', name: '防御精通', description: '大幅提升防御力', branch: 'defense', tier: 2, requiredTalents: ['defense_1'], cost: 2, effect: { defense: 10 } },
  { id: 'support_1', name: '悟性提升', description: '永久提升悟性', branch: 'support', tier: 1, requiredTalents: [], cost: 1, effect: { intelligence: 5 } },
  { id: 'support_2', name: '悟性精通', description: '大幅提升悟性', branch: 'support', tier: 2, requiredTalents: ['support_1'], cost: 2, effect: { intelligence: 10 } },
];

// ============================================================
// 突破丹掉落概率
// ============================================================
export const BREAKTHROUGH_PILL_DROP_RATE: Record<string, number> = {
  breakthrough_pill_1: 0.15,
  breakthrough_pill_2: 0.08,
  breakthrough_pill_3: 0.03,
  breakthrough_pill_4: 0.005,
  breakthrough_pill_5: 0.001,
};

// ============================================================
// 装备品阶筛选帮助函数
// ============================================================
export function getItemsByGrade(grade: ItemGrade): Omit<InventoryItem, 'quantity'>[] {
  return SHOP_ITEMS.filter(item => item.grade === grade);
}

export function getItemsByTypeAndGrade(type: string, grade: ItemGrade): Omit<InventoryItem, 'quantity'>[] {
  return SHOP_ITEMS.filter(item => item.type === type && item.grade === grade);
}