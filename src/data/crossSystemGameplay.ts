// 跨系统联动玩法

export interface SynergyCombo {
  id: string;
  name: string;
  description: string;
  requirements: {
    type: 'skill' | 'equipment' | 'pet' | 'formation' | 'realm';
    id: string;
  }[];
  effect: {
    type: 'passive_bonus' | 'active_ability' | 'special_effect';
    description: string;
    stats?: {
      [key: string]: number;
    };
  };
}

export const SYNERGY_COMBOS: SynergyCombo[] = [
  {
    id: 'fire_master',
    name: '火焰宗师',
    description: '掌握所有火系功法的修士可发挥出真正的火焰之力',
    requirements: [
      { type: 'skill', id: 'fire_palm' },
      { type: 'skill', id: 'inferno_blaze' },
      { type: 'skill', id: 'sun_flare' },
    ],
    effect: {
      type: 'passive_bonus',
      description: '火系伤害+50%，暴击率+15%',
      stats: {
        attack: 30,
        critRate: 0.15,
      },
    },
  },
  {
    id: 'battle_mage',
    name: '战阵大师',
    description: '同时掌握阵法和多种功法的全能修士',
    requirements: [
      { type: 'skill', id: 'thunder_strike' },
      { type: 'formation', id: 'attack_formation' },
      { type: 'equipment', id: 'weapon_di_1' },
    ],
    effect: {
      type: 'passive_bonus',
      description: '阵法效果+30%，攻击力+40',
      stats: {
        attack: 40,
      },
    },
  },
  {
    id: 'immortal_protector',
    name: '不灭守护',
    description: '在冰霜套装的加持下，配合治愈功法达到不死之躯',
    requirements: [
      { type: 'equipment', id: 'armor_di_1' },
      { type: 'skill', id: 'healing_light' },
      { type: 'formation', id: 'defense_formation' },
    ],
    effect: {
      type: 'passive_bonus',
      description: '防御力+80，气血恢复+100%',
      stats: {
        defense: 80,
        hpMax: 200,
      },
    },
  },
  {
    id: 'swift_blade',
    name: '疾风剑豪',
    description: '以影步配合风刃，再穿上疾风之靴，速度快到肉眼难辨',
    requirements: [
      { type: 'skill', id: 'shadow_step' },
      { type: 'skill', id: 'wind_blade' },
      { type: 'equipment', id: 'boots_di_1' },
    ],
    effect: {
      type: 'passive_bonus',
      description: '闪避率+25%，攻击速度提升',
      stats: {
        evasionRate: 0.25,
      },
    },
  },
];

// 检查联动组合是否激活
export function checkActiveCombos(
  equippedSkills: string[],
  equippedItems: string[],
  activeFormation: string | null,
  activePet: string | null
): SynergyCombo[] {
  return SYNERGY_COMBOS.filter(combo => {
    return combo.requirements.every(req => {
      switch (req.type) {
        case 'skill':
          return equippedSkills.includes(req.id);
        case 'equipment':
          return equippedItems.includes(req.id);
        case 'formation':
          return activeFormation === req.id;
        case 'pet':
          return activePet === req.id;
        default:
          return false;
      }
    });
  });
}
