/**
 * Monster data — 50 monsters total (5 per realm: 4 common + 1 boss).
 * Merged from gameStore.ts MONSTERS and gameData.ts monsters,
 * with additional monsters added.
 */
import type { Monster } from './types';

export const MONSTERS: Monster[] = [
  // ============================================================
  // Realm 0 — 煅体境 (hp 30-50, attack 5-12)
  // ============================================================
  {
    id: 'stone_beetle', name: '石甲虫', realm: 0, hp: 35, maxHp: 35, attack: 6, defense: 3,
    expReward: 12, goldReward: 6,
    drops: [
      { item: { id: 'beetle_shell', name: '虫甲碎片', type: 'material', description: '石甲虫坚硬外壳', price: 4 }, chance: 0.5 },
    ],
    location: '落叶山脉', element: 'neutral', weakness: 'neutral',
    mechanisms: [{ type: 'dodge', bonus: 10 }],
  },
  {
    id: 'spirit_snake', name: '灵纹蛇', realm: 0, hp: 45, maxHp: 45, attack: 9, defense: 4,
    expReward: 18, goldReward: 10,
    drops: [
      { item: { id: 'snake_gall', name: '蛇胆', type: 'material', description: '灵纹蛇的胆囊', price: 12 }, chance: 0.4 },
    ],
    location: '落叶山脉', element: 'shadow', weakness: 'thunder',
    mechanisms: [{ type: 'poison', poisonPerTurn: 3 }, { type: 'dodge', bonus: 15 }],
  },
  {
    id: 'wind_rabbit', name: '疾风兔', realm: 0, hp: 30, maxHp: 30, attack: 5, defense: 2,
    expReward: 10, goldReward: 5,
    drops: [{ item: { id: 'rabbit_fur', name: '兔绒', type: 'material', description: '疾风兔的软毛', price: 3 }, chance: 0.6 }],
    location: '落叶山脉', element: 'neutral', weakness: 'neutral',
    mechanisms: [{ type: 'dodge', bonus: 20 }],
  },
  {
    id: 'iron_scorpion', name: '铁蝎', realm: 0, hp: 50, maxHp: 50, attack: 12, defense: 6,
    expReward: 22, goldReward: 12,
    drops: [{ item: { id: 'scorpion_stinger', name: '蝎尾针', type: 'material', description: '铁蝎的毒针', price: 8 }, chance: 0.35 }],
    location: '落叶山脉', element: 'shadow', weakness: 'fire',
    mechanisms: [{ type: 'poison', poisonPerTurn: 4 }, { type: 'armorBreak', ignoreDefensePercent: 10 }],
  },
  {
    id: 'boss_great_worm', name: '地龙', realm: 0, hp: 150, maxHp: 150, attack: 20, defense: 12,
    expReward: 50, goldReward: 35,
    drops: [
      { item: { id: 'worm_core', name: '地龙核心', type: 'material', description: '地龙的内丹', price: 25 }, chance: 0.4 },
    ],
    location: '落叶山脉', element: 'neutral', weakness: 'thunder', isBoss: true,
    mechanisms: [{ type: 'berserk' }, { type: 'regeneration', hpPerTurn: 3 }, { type: 'armorBreak', ignoreDefensePercent: 15 }],
  },

  // ============================================================
  // Realm 1 — 玄脉境
  // ============================================================
  {
    id: 'fire_wolf', name: '赤火狼', realm: 1, hp: 70, maxHp: 70, attack: 14, defense: 7,
    expReward: 32, goldReward: 18,
    drops: [
      { item: { id: 'wolf_fang', name: '狼牙', type: 'material', description: '赤火狼的利齿', price: 16 }, chance: 0.5 },
      { item: { id: 'fire_fur', name: '火绒皮甲', type: 'armor', description: '赤火狼皮制的甲胄', price: 150, stats: { defense: 6, hpMax: 12 } }, chance: 0.06 },
    ],
    location: '黑炎岭', element: 'fire', weakness: 'ice',
    mechanisms: [{ type: 'berserk' }, { type: 'doubleStrike', chance: 0.2 }],
  },
  {
    id: 'shadow_tiger', name: '影虎', realm: 1, hp: 95, maxHp: 95, attack: 19, defense: 11,
    expReward: 45, goldReward: 28,
    drops: [
      { item: { id: 'tiger_bone', name: '虎骨', type: 'material', description: '影虎的骨材', price: 30 }, chance: 0.4 },
      { item: { id: 'tiger_claw', name: '虎爪刃', type: 'weapon', description: '影虎爪炼制的短刃', price: 220, stats: { attack: 11, agility: 2 } }, chance: 0.05 },
    ],
    location: '黑炎岭', element: 'shadow', weakness: 'thunder',
    mechanisms: [{ type: 'berserk' }, { type: 'dodge', bonus: 20 }, { type: 'reflect', percent: 10 }],
  },
  {
    id: 'thorn_boar', name: '铁鬃猪', realm: 1, hp: 85, maxHp: 85, attack: 16, defense: 10,
    expReward: 38, goldReward: 22,
    drops: [{ item: { id: 'boar_tusk', name: '野猪獠牙', type: 'material', description: '铁鬃猪的獠牙', price: 20 }, chance: 0.45 }],
    location: '黑炎岭', element: 'neutral', weakness: 'fire',
    mechanisms: [{ type: 'berserk' }],
  },
  {
    id: 'flying_mantis', name: '风镰螳', realm: 1, hp: 65, maxHp: 65, attack: 22, defense: 5,
    expReward: 35, goldReward: 20,
    drops: [{ item: { id: 'mantis_blade', name: '螳螂刃', type: 'material', description: '风镰螳的前臂刃', price: 18 }, chance: 0.35 }],
    location: '黑炎岭', element: 'thunder', weakness: 'ice',
    mechanisms: [{ type: 'doubleStrike', chance: 0.3 }, { type: 'dodge', bonus: 15 }],
  },
  {
    id: 'boss_flame_commander', name: '炎将', realm: 1, hp: 300, maxHp: 300, attack: 40, defense: 22,
    expReward: 120, goldReward: 80,
    drops: [
      { item: { id: 'flame_crystal', name: '炎晶', type: 'material', description: '炎将的力量结晶', price: 60 }, chance: 0.35 },
    ],
    location: '黑炎岭', element: 'fire', weakness: 'ice', isBoss: true,
    mechanisms: [{ type: 'berserk' }, { type: 'doubleStrike', chance: 0.3 }, { type: 'reflect', percent: 12 }],
  },

  // ============================================================
  // Realm 2 — 武心境
  // ============================================================
  {
    id: 'ice_toad', name: '寒蟾', realm: 2, hp: 140, maxHp: 140, attack: 26, defense: 16,
    expReward: 65, goldReward: 42,
    drops: [
      { item: { id: 'ice_crystal', name: '冰髓晶', type: 'material', description: '蕴含寒力的晶石', price: 45 }, chance: 0.4 },
      { item: { id: 'frost_jade', name: '霜月佩', type: 'accessory', description: '寒蟾腹内玉佩', price: 380, stats: { spiritualPowerMax: 22, intelligence: 4 } }, chance: 0.04 },
    ],
    location: '冰魄潭', element: 'ice', weakness: 'fire',
    mechanisms: [{ type: 'regeneration', hpPerTurn: 5 }, { type: 'armorBreak', ignoreDefensePercent: 15 }],
  },
  {
    id: 'poison_spider', name: '毒蛛', realm: 2, hp: 120, maxHp: 120, attack: 30, defense: 12,
    expReward: 58, goldReward: 38,
    drops: [{ item: { id: 'spider_silk', name: '蛛丝', type: 'material', description: '毒蛛吐出的坚韧丝线', price: 35 }, chance: 0.4 }],
    location: '冰魄潭', element: 'shadow', weakness: 'thunder',
    mechanisms: [{ type: 'poison', poisonPerTurn: 6 }, { type: 'dodge', bonus: 12 }],
  },
  {
    id: 'frost_viper', name: '霜蛇', realm: 2, hp: 130, maxHp: 130, attack: 28, defense: 14,
    expReward: 62, goldReward: 40,
    drops: [{ item: { id: 'frost_scale', name: '霜鳞', type: 'material', description: '霜蛇的鳞片', price: 40 }, chance: 0.35 }],
    location: '冰魄潭', element: 'ice', weakness: 'fire',
    mechanisms: [{ type: 'poison', poisonPerTurn: 4 }, { type: 'regeneration', hpPerTurn: 4 }],
  },
  {
    id: 'stone_golem', name: '石傀儡', realm: 2, hp: 180, maxHp: 180, attack: 22, defense: 22,
    expReward: 70, goldReward: 45,
    drops: [{ item: { id: 'golem_core', name: '傀儡核心', type: 'material', description: '石傀儡的能量核心', price: 50 }, chance: 0.3 }],
    location: '冰魄潭', element: 'neutral', weakness: 'shadow',
    mechanisms: [{ type: 'armorBreak', ignoreDefensePercent: 10 }, { type: 'reflect', percent: 15 }],
  },
  {
    id: 'boss_frost_queen', name: '霜后', realm: 2, hp: 500, maxHp: 500, attack: 55, defense: 35,
    expReward: 180, goldReward: 130,
    drops: [
      { item: { id: 'queen_crown', name: '霜后冠冕', type: 'accessory', description: '霜后的冰晶王冠', price: 400, stats: { spiritualPowerMax: 35, intelligence: 8 } }, chance: 0.05 },
    ],
    location: '冰魄潭', element: 'ice', weakness: 'fire', isBoss: true,
    mechanisms: [{ type: 'regeneration', hpPerTurn: 10 }, { type: 'berserk' }, { type: 'doubleStrike', chance: 0.3 }],
  },

  // ============================================================
  // Realm 3 — 灵现境
  // ============================================================
  {
    id: 'thunder_hawk', name: '雷鹰', realm: 3, hp: 250, maxHp: 250, attack: 40, defense: 20,
    expReward: 90, goldReward: 55,
    drops: [{ item: { id: 'hawk_feather', name: '雷羽', type: 'material', description: '雷鹰的翎羽', price: 55 }, chance: 0.35 }],
    location: '雷鸣谷', element: 'thunder', weakness: 'shadow',
    mechanisms: [{ type: 'dodge', bonus: 20 }, { type: 'doubleStrike', chance: 0.25 }],
  },
  {
    id: 'lava_salamander', name: '熔岩蜥', realm: 3, hp: 300, maxHp: 300, attack: 45, defense: 25,
    expReward: 100, goldReward: 60,
    drops: [{ item: { id: 'lava_stone', name: '熔岩石', type: 'material', description: '熔岩蜥的体温结晶', price: 60 }, chance: 0.3 }],
    location: '火焰山', element: 'fire', weakness: 'ice',
    mechanisms: [{ type: 'berserk' }, { type: 'regeneration', hpPerTurn: 8 }],
  },
  {
    id: 'shadow_wraith', name: '暗影魂', realm: 3, hp: 220, maxHp: 220, attack: 50, defense: 18,
    expReward: 95, goldReward: 58,
    drops: [{ item: { id: 'shadow_essence', name: '暗影精华', type: 'material', description: '暗影魂的能量碎片', price: 65 }, chance: 0.3 }],
    location: '暗影深渊', element: 'shadow', weakness: 'thunder',
    mechanisms: [{ type: 'dodge', bonus: 25 }, { type: 'reflect', percent: 10 }],
  },
  {
    id: 'crystal_beast', name: '晶兽', realm: 3, hp: 350, maxHp: 350, attack: 38, defense: 30,
    expReward: 105, goldReward: 65,
    drops: [{ item: { id: 'crystal_shard', name: '晶核碎片', type: 'material', description: '晶兽体内的能量结晶', price: 70 }, chance: 0.25 }],
    location: '雷鸣谷', element: 'neutral', weakness: 'fire',
    mechanisms: [{ type: 'reflect', percent: 20 }, { type: 'armorBreak', ignoreDefensePercent: 10 }],
  },
  {
    id: 'boss_flame_dragon', name: '烈焰龙', realm: 3, hp: 1000, maxHp: 1000, attack: 80, defense: 45,
    expReward: 250, goldReward: 200,
    drops: [
      { item: { id: 'dragon_scale', name: '龙鳞', type: 'material', description: '烈焰龙的鳞片', price: 80 }, chance: 0.6 },
      { item: { id: 'dragon_heart', name: '龙心', type: 'material', description: '蕴含炽热力量的龙心', price: 300 }, chance: 0.15 },
      { item: { id: 'flame_armor', name: '烈焰甲', type: 'armor', description: '烈焰龙皮制的甲胄', price: 800, stats: { defense: 25, hpMax: 80 } }, chance: 0.08 },
    ],
    location: '火焰山', element: 'fire', weakness: 'ice', isBoss: true,
    mechanisms: [{ type: 'berserk' }, { type: 'regeneration', hpPerTurn: 15 }, { type: 'doubleStrike', chance: 0.35 }, { type: 'poison', poisonPerTurn: 8 }],
  },

  // ============================================================
  // Realm 4 — 凌虚境
  // ============================================================
  {
    id: 'wind_chimera', name: '风魔兽', realm: 4, hp: 500, maxHp: 500, attack: 70, defense: 35,
    expReward: 140, goldReward: 85,
    drops: [{ item: { id: 'wind_core', name: '风核', type: 'material', description: '风魔兽的内核', price: 90 }, chance: 0.3 }],
    location: '风啸谷', element: 'thunder', weakness: 'shadow',
    mechanisms: [{ type: 'dodge', bonus: 25 }, { type: 'doubleStrike', chance: 0.3 }],
  },
  {
    id: 'abyss_demon', name: '深渊魔', realm: 4, hp: 600, maxHp: 600, attack: 80, defense: 38,
    expReward: 155, goldReward: 95,
    drops: [{ item: { id: 'abyss_stone', name: '深渊石', type: 'material', description: '深渊凝结的黑暗之石', price: 100 }, chance: 0.25 }],
    location: '暗影深渊', element: 'shadow', weakness: 'thunder',
    mechanisms: [{ type: 'berserk' }, { type: 'reflect', percent: 15 }],
  },
  {
    id: 'frost_drake', name: '冰龙蜥', realm: 4, hp: 550, maxHp: 550, attack: 75, defense: 40,
    expReward: 150, goldReward: 90,
    drops: [{ item: { id: 'drake_scale', name: '龙蜥鳞', type: 'material', description: '冰龙蜥的坚硬鳞片', price: 95 }, chance: 0.3 }],
    location: '冰魄潭', element: 'ice', weakness: 'fire',
    mechanisms: [{ type: 'regeneration', hpPerTurn: 12 }, { type: 'armorBreak', ignoreDefensePercent: 15 }],
  },
  {
    id: 'thunder_behemoth', name: '雷兽', realm: 4, hp: 700, maxHp: 700, attack: 85, defense: 42,
    expReward: 165, goldReward: 100,
    drops: [{ item: { id: 'behemoth_horn', name: '雷兽角', type: 'material', description: '雷兽的独角', price: 110 }, chance: 0.2 }],
    location: '雷鸣谷', element: 'thunder', weakness: 'shadow',
    mechanisms: [{ type: 'berserk' }, { type: 'doubleStrike', chance: 0.35 }],
  },
  {
    id: 'boss_shadow_lord', name: '暗影领主', realm: 4, hp: 2500, maxHp: 2500, attack: 180, defense: 80,
    expReward: 450, goldReward: 350,
    drops: [
      { item: { id: 'shadow_essence', name: '暗影精华', type: 'material', description: '暗影领主的本源之力', price: 120 }, chance: 0.5 },
      { item: { id: 'void_crystal', name: '虚空晶', type: 'material', description: '蕴含虚空法则的晶石', price: 500 }, chance: 0.1 },
      { item: { id: 'shadow_blade', name: '暗影刃', type: 'weapon', description: '暗影领主佩剑', price: 1200, stats: { attack: 35, agility: 8 } }, chance: 0.05 },
    ],
    location: '暗影深渊', element: 'shadow', weakness: 'thunder', isBoss: true,
    mechanisms: [{ type: 'berserk' }, { type: 'reflect', percent: 20 }, { type: 'dodge', bonus: 25 }, { type: 'armorBreak', ignoreDefensePercent: 25 }],
  },

  // ============================================================
  // Realm 5 — 悟道境
  // ============================================================
  {
    id: 'heavenly_serpent', name: '天蛇', realm: 5, hp: 1000, maxHp: 1000, attack: 110, defense: 55,
    expReward: 200, goldReward: 130,
    drops: [{ item: { id: 'serpent_scale', name: '天蛇鳞', type: 'material', description: '天蛇的逆鳞', price: 150 }, chance: 0.3 }],
    location: '青云峰', element: 'shadow', weakness: 'thunder',
    mechanisms: [{ type: 'poison', poisonPerTurn: 10 }, { type: 'dodge', bonus: 20 }],
  },
  {
    id: 'void_demon', name: '虚空魔', realm: 5, hp: 1200, maxHp: 1200, attack: 120, defense: 58,
    expReward: 220, goldReward: 140,
    drops: [{ item: { id: 'void_fragment', name: '虚空碎片', type: 'material', description: '虚空魔的能量残留', price: 160 }, chance: 0.25 }],
    location: '混沌虚空', element: 'shadow', weakness: 'fire',
    mechanisms: [{ type: 'dodge', bonus: 25 }, { type: 'reflect', percent: 18 }],
  },
  {
    id: 'blaze_king', name: '炎王', realm: 5, hp: 1100, maxHp: 1100, attack: 130, defense: 50,
    expReward: 210, goldReward: 135,
    drops: [{ item: { id: 'blaze_heart', name: '炎王之心', type: 'material', description: '炎王的不灭之心', price: 170 }, chance: 0.2 }],
    location: '火焰山', element: 'fire', weakness: 'ice',
    mechanisms: [{ type: 'berserk' }, { type: 'doubleStrike', chance: 0.4 }],
  },
  {
    id: 'frost_giant', name: '冰巨人', realm: 5, hp: 1300, maxHp: 1300, attack: 115, defense: 65,
    expReward: 230, goldReward: 145,
    drops: [{ item: { id: 'giant_ice_core', name: '巨人之核', type: 'material', description: '冰巨人的寒冰核心', price: 180 }, chance: 0.2 }],
    location: '冰魄潭', element: 'ice', weakness: 'fire',
    mechanisms: [{ type: 'regeneration', hpPerTurn: 20 }, { type: 'armorBreak', ignoreDefensePercent: 20 }],
  },
  {
    id: 'boss_ice_giant', name: '冰霜巨人', realm: 5, hp: 4500, maxHp: 4500, attack: 280, defense: 150,
    expReward: 600, goldReward: 500,
    drops: [
      { item: { id: 'ice_giant_core', name: '巨人核心', type: 'material', description: '冰霜巨人的力量源泉', price: 200 }, chance: 0.4 },
      { item: { id: 'frost_crown', name: '霜冠', type: 'accessory', description: '冰霜巨人的王冠', price: 1500, stats: { spiritualPowerMax: 60, intelligence: 15 } }, chance: 0.06 },
    ],
    location: '冰魄潭', element: 'ice', weakness: 'fire', isBoss: true,
    mechanisms: [{ type: 'regeneration', hpPerTurn: 30 }, { type: 'berserk' }, { type: 'doubleStrike', chance: 0.45 }, { type: 'armorBreak', ignoreDefensePercent: 30 }],
  },

  // ============================================================
  // Realm 6 — 冠绝境
  // ============================================================
  {
    id: 'destruction_dragon', name: '灭世龙', realm: 6, hp: 2500, maxHp: 2500, attack: 200, defense: 100,
    expReward: 350, goldReward: 220,
    drops: [{ item: { id: 'dragon_fang', name: '龙牙', type: 'material', description: '灭世龙的利齿', price: 250 }, chance: 0.25 }],
    location: '混沌虚空', element: 'fire', weakness: 'ice',
    mechanisms: [{ type: 'berserk' }, { type: 'doubleStrike', chance: 0.4 }, { type: 'regeneration', hpPerTurn: 25 }],
  },
  {
    id: 'chaos_beast', name: '混沌兽', realm: 6, hp: 3000, maxHp: 3000, attack: 190, defense: 110,
    expReward: 370, goldReward: 240,
    drops: [{ item: { id: 'chaos_essence', name: '混沌精华', type: 'material', description: '混沌兽的本源之力', price: 300 }, chance: 0.2 }],
    location: '混沌虚空', element: 'shadow', weakness: 'thunder',
    mechanisms: [{ type: 'reflect', percent: 20 }, { type: 'dodge', bonus: 20 }],
  },
  {
    id: 'sky_demon', name: '天魔', realm: 6, hp: 2800, maxHp: 2800, attack: 210, defense: 95,
    expReward: 360, goldReward: 230,
    drops: [{ item: { id: 'demon_blood', name: '魔血', type: 'material', description: '天魔的精血', price: 280 }, chance: 0.2 }],
    location: '混沌虚空', element: 'shadow', weakness: 'fire',
    mechanisms: [{ type: 'poison', poisonPerTurn: 15 }, { type: 'berserk' }],
  },
  {
    id: 'ancient_titan', name: '古泰坦', realm: 6, hp: 3500, maxHp: 3500, attack: 180, defense: 130,
    expReward: 390, goldReward: 250,
    drops: [{ item: { id: 'titan_core', name: '泰坦核心', type: 'material', description: '古泰坦的能量源泉', price: 320 }, chance: 0.15 }],
    location: '永恒之地', element: 'neutral', weakness: 'thunder',
    mechanisms: [{ type: 'armorBreak', ignoreDefensePercent: 20 }, { type: 'reflect', percent: 25 }],
  },
  {
    id: 'boss_chaos_ancient_god', name: '混沌古神', realm: 6, hp: 10000, maxHp: 10000, attack: 500, defense: 280,
    expReward: 1000, goldReward: 800,
    drops: [
      { item: { id: 'ancient_god_shard', name: '古神碎片', type: 'material', description: '混沌古神的法则碎片', price: 500 }, chance: 0.3 },
    ],
    location: '混沌虚空', element: 'shadow', weakness: 'fire', isBoss: true,
    mechanisms: [{ type: 'berserk' }, { type: 'regeneration', hpPerTurn: 50 }, { type: 'doubleStrike', chance: 0.5 }, { type: 'reflect', percent: 25 }],
  },

  // ============================================================
  // Realm 7 — 绝圣境
  // ============================================================
  {
    id: 'heaven_will', name: '天意', realm: 7, hp: 5000, maxHp: 5000, attack: 300, defense: 150,
    expReward: 500, goldReward: 350,
    drops: [{ item: { id: 'heaven_token', name: '天道令符', type: 'material', description: '天意凝聚的法旨', price: 400 }, chance: 0.2 }],
    location: '天道之巅', element: 'thunder', weakness: 'shadow',
    mechanisms: [{ type: 'dodge', bonus: 30 }, { type: 'doubleStrike', chance: 0.45 }],
  },
  {
    id: 'world_destroyer', name: '灭世者', realm: 7, hp: 5500, maxHp: 5500, attack: 320, defense: 160,
    expReward: 520, goldReward: 360,
    drops: [{ item: { id: 'destroyer_core', name: '毁灭核心', type: 'material', description: '灭世者的力量核心', price: 450 }, chance: 0.15 }],
    location: '混沌虚空', element: 'fire', weakness: 'ice',
    mechanisms: [{ type: 'berserk' }, { type: 'armorBreak', ignoreDefensePercent: 25 }],
  },
  {
    id: 'eternal_phantom', name: '永恒幻影', realm: 7, hp: 4800, maxHp: 4800, attack: 310, defense: 140,
    expReward: 510, goldReward: 340,
    drops: [{ item: { id: 'phantom_essence', name: '幻影之核', type: 'material', description: '永恒幻影的核心', price: 420 }, chance: 0.2 }],
    location: '永恒之地', element: 'shadow', weakness: 'thunder',
    mechanisms: [{ type: 'dodge', bonus: 35 }, { type: 'reflect', percent: 20 }],
  },
  {
    id: 'primordial_behemoth', name: '原始巨兽', realm: 7, hp: 6000, maxHp: 6000, attack: 290, defense: 180,
    expReward: 540, goldReward: 380,
    drops: [{ item: { id: 'primordial_blood', name: '原始之血', type: 'material', description: '原始巨兽的精血', price: 480 }, chance: 0.15 }],
    location: '原始之地', element: 'neutral', weakness: 'fire',
    mechanisms: [{ type: 'regeneration', hpPerTurn: 40 }, { type: 'berserk' }],
  },
  {
    id: 'boss_heaven_sovereign', name: '天道至尊', realm: 7, hp: 20000, maxHp: 20000, attack: 800, defense: 450,
    expReward: 1800, goldReward: 1500,
    drops: [
      { item: { id: 'sovereign_seal', name: '至尊封印', type: 'material', description: '天道至尊的法则之力', price: 1000 }, chance: 0.2 },
    ],
    location: '天道之巅', element: 'thunder', weakness: 'shadow', isBoss: true,
    mechanisms: [{ type: 'berserk' }, { type: 'regeneration', hpPerTurn: 80 }, { type: 'doubleStrike', chance: 0.55 }, { type: 'reflect', percent: 30 }],
  },

  // ============================================================
  // Realm 8 — 圣君境
  // ============================================================
  {
    id: 'fate_sovereign', name: '命运之主', realm: 8, hp: 8000, maxHp: 8000, attack: 400, defense: 200,
    expReward: 700, goldReward: 500,
    drops: [{ item: { id: 'fate_thread', name: '命运之线', type: 'material', description: '命运之主的法则线', price: 600 }, chance: 0.15 }],
    location: '命运尽头', element: 'shadow', weakness: 'thunder',
    mechanisms: [{ type: 'dodge', bonus: 30 }, { type: 'reflect', percent: 25 }],
  },
  {
    id: 'cosmic_dragon', name: '宇宙龙', realm: 8, hp: 9000, maxHp: 9000, attack: 420, defense: 210,
    expReward: 730, goldReward: 520,
    drops: [{ item: { id: 'cosmic_scale', name: '宇宙龙鳞', type: 'material', description: '宇宙龙的星辰鳞片', price: 650 }, chance: 0.12 }],
    location: '混沌之始', element: 'fire', weakness: 'ice',
    mechanisms: [{ type: 'berserk' }, { type: 'doubleStrike', chance: 0.5 }],
  },
  {
    id: 'void_walker', name: '虚空行者', realm: 8, hp: 7500, maxHp: 7500, attack: 430, defense: 190,
    expReward: 710, goldReward: 510,
    drops: [{ item: { id: 'walker_core', name: '行者核心', type: 'material', description: '虚空行者的次元核心', price: 620 }, chance: 0.15 }],
    location: '混沌虚空', element: 'shadow', weakness: 'fire',
    mechanisms: [{ type: 'dodge', bonus: 35 }, { type: 'armorBreak', ignoreDefensePercent: 30 }],
  },
  {
    id: 'infinity_beast', name: '无限兽', realm: 8, hp: 10000, maxHp: 10000, attack: 380, defense: 240,
    expReward: 750, goldReward: 540,
    drops: [{ item: { id: 'infinity_core', name: '无限核心', type: 'material', description: '无限兽的不灭核心', price: 700 }, chance: 0.1 }],
    location: '永恒之地', element: 'neutral', weakness: 'thunder',
    mechanisms: [{ type: 'regeneration', hpPerTurn: 60 }, { type: 'reflect', percent: 30 }],
  },
  {
    id: 'boss_fate_overlord', name: '命运霸主', realm: 8, hp: 30000, maxHp: 30000, attack: 1200, defense: 650,
    expReward: 2500, goldReward: 2000,
    drops: [
      { item: { id: 'overlord_soul', name: '霸主之魂', type: 'material', description: '命运霸主的不朽灵魂', price: 2000 }, chance: 0.15 },
    ],
    location: '命运尽头', element: 'shadow', weakness: 'thunder', isBoss: true,
    mechanisms: [{ type: 'berserk' }, { type: 'regeneration', hpPerTurn: 120 }, { type: 'doubleStrike', chance: 0.6 }, { type: 'armorBreak', ignoreDefensePercent: 35 }],
  },

  // ============================================================
  // Realm 9 — 君帝境 (hp 12000-25000, attack 500-1200)
  // ============================================================
  {
    id: 'destiny_overlord', name: '命运至尊', realm: 9, hp: 12000, maxHp: 12000, attack: 500, defense: 250,
    expReward: 1000, goldReward: 700,
    drops: [{ item: { id: 'destiny_token', name: '命运令牌', type: 'material', description: '命运至尊的法则令牌', price: 800 }, chance: 0.12 }],
    location: '命运尽头', element: 'shadow', weakness: 'thunder',
    mechanisms: [{ type: 'dodge', bonus: 35 }, { type: 'reflect', percent: 30 }],
  },
  {
    id: 'transcendence_being', name: '超脱者', realm: 9, hp: 15000, maxHp: 15000, attack: 600, defense: 300,
    expReward: 1100, goldReward: 750,
    drops: [{ item: { id: 'transcendence_core', name: '超脱之心', type: 'material', description: '超脱者的本源核心', price: 900 }, chance: 0.1 }],
    location: '超脱之地', element: 'thunder', weakness: 'shadow',
    mechanisms: [{ type: 'doubleStrike', chance: 0.55 }, { type: 'berserk' }],
  },
  {
    id: 'primordial_god', name: '原始神', realm: 9, hp: 18000, maxHp: 18000, attack: 700, defense: 350,
    expReward: 1200, goldReward: 800,
    drops: [{ item: { id: 'primordial_god_essence', name: '原始神之本', type: 'material', description: '原始神的创世精华', price: 1000 }, chance: 0.08 }],
    location: '混沌之始', element: 'neutral', weakness: 'fire',
    mechanisms: [{ type: 'regeneration', hpPerTurn: 80 }, { type: 'reflect', percent: 30 }],
  },
  {
    id: 'eternal_dragon', name: '永恒龙', realm: 9, hp: 25000, maxHp: 25000, attack: 800, defense: 400,
    expReward: 1400, goldReward: 900,
    drops: [{ item: { id: 'eternal_dragon_scale', name: '永恒龙鳞', type: 'material', description: '永恒龙的时间鳞片', price: 1200 }, chance: 0.06 }],
    location: '永恒之地', element: 'fire', weakness: 'ice',
    mechanisms: [{ type: 'berserk' }, { type: 'regeneration', hpPerTurn: 100 }, { type: 'doubleStrike', chance: 0.6 }],
  },
  {
    id: 'boss_creator', name: '创世神', realm: 9, hp: 80000, maxHp: 80000, attack: 2000, defense: 1200,
    expReward: 5000, goldReward: 4000,
    drops: [
      { item: { id: 'creator_spark', name: '创世火花', type: 'material', description: '创世神的起源之火', price: 5000 }, chance: 0.2 },
      { item: { id: 'divine_armor', name: '神之甲', type: 'armor', description: '创世神穿戴的铠甲', price: 20000, stats: { defense: 500, hpMax: 2000 } }, chance: 0.03 },
    ],
    location: '超脱之地', element: 'neutral', weakness: 'neutral', isBoss: true,
    mechanisms: [
      { type: 'berserk' },
      { type: 'regeneration', hpPerTurn: 200 },
      { type: 'doubleStrike', chance: 0.7 },
      { type: 'reflect', percent: 35 },
      { type: 'armorBreak', ignoreDefensePercent: 40 },
    ],
  },
];

/** Index monsters by ID for fast lookup */
export const MONSTER_MAP: Record<string, Monster> = {};
MONSTERS.forEach(m => { MONSTER_MAP[m.id] = m; });

/** Get monsters for a specific realm */
export function getMonstersByRealm(realm: number): Monster[] {
  return MONSTERS.filter(m => m.realm === realm);
}

/** Get common (non-boss) monsters for a realm */
export function getCommonMonstersByRealm(realm: number): Monster[] {
  return MONSTERS.filter(m => m.realm === realm && !m.isBoss);
}

/** Get boss monster for a realm */
export function getBossByRealm(realm: number): Monster | undefined {
  return MONSTERS.find(m => m.realm === realm && m.isBoss);
}

/** Get monster by ID */
export function getMonsterById(id: string): Monster | undefined {
  return MONSTER_MAP[id];
}
