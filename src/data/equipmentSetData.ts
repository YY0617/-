// 装备套装系统

export interface EquipmentSet {
  id: string;
  name: string;
  description: string;
  requiredItems: string[]; // 需要的装备ID
  setBonuses: {
    [itemCount: number]: {
      description: string;
      stats: {
        attack?: number;
        defense?: number;
        hpMax?: number;
        spiritualPowerMax?: number;
        critRate?: number;
        evasionRate?: number;
      };
    };
  };
}

export const EQUIPMENT_SETS: EquipmentSet[] = [
  {
    id: 'beginner_set',
    name: '新手套装',
    description: '为初入修仙界的修士准备的基础套装',
    requiredItems: [
      'weapon_huang_1',
      'armor_huang_1',
      'accessory_huang_1',
    ],
    setBonuses: {
      2: {
        description: '2件：气血+50',
        stats: { hpMax: 50 },
      },
      3: {
        description: '3件：攻击+10，防御+5',
        stats: { attack: 10, defense: 5 },
      },
    },
  },
  {
    id: 'flame_set',
    name: '烈焰套装',
    description: '蕴含火焰之力的强力套装',
    requiredItems: [
      'weapon_xuan_1',
      'armor_xuan_1',
      'accessory_xuan_1',
      'boots_xuan_1',
    ],
    setBonuses: {
      2: {
        description: '2件：攻击力+20',
        stats: { attack: 20 },
      },
      3: {
        description: '3件：暴击率+10%',
        stats: { critRate: 0.1 },
      },
      4: {
        description: '4件：攻击力+50，暴击率+15%',
        stats: { attack: 50, critRate: 0.15 },
      },
    },
  },
  {
    id: 'ice_set',
    name: '冰霜套装',
    description: '散发着极寒气息的防御套装',
    requiredItems: [
      'weapon_di_1',
      'armor_di_1',
      'accessory_di_1',
      'boots_di_1',
      'bracelet_di_1',
    ],
    setBonuses: {
      2: {
        description: '2件：防御力+30',
        stats: { defense: 30 },
      },
      3: {
        description: '3件：闪避率+10%',
        stats: { evasionRate: 0.1 },
      },
      4: {
        description: '4件：防御力+60，闪避率+15%',
        stats: { defense: 60, evasionRate: 0.15 },
      },
      5: {
        description: '5件：气血+300，防御力+100',
        stats: { hpMax: 300, defense: 100 },
      },
    },
  },
  {
    id: 'heavenly_set',
    name: '天神圣装',
    description: '传说中的上古神兵套装',
    requiredItems: [
      'weapon_tian_1',
      'armor_tian_1',
      'accessory_tian_1',
      'boots_tian_1',
      'bracelet_tian_1',
      'waist_tian_1',
    ],
    setBonuses: {
      2: {
        description: '2件：全属性+20',
        stats: { attack: 20, defense: 20, hpMax: 100 },
      },
      4: {
        description: '4件：暴击率+20%，闪避率+15%',
        stats: { critRate: 0.2, evasionRate: 0.15 },
      },
      6: {
        description: '6件：攻击力+200，防御力+150，气血+800',
        stats: { attack: 200, defense: 150, hpMax: 800 },
      },
    },
  },
];

// 获取装备套装加成
export function getActiveSetBonuses(equippedItemIds: string[]): {
  sets: { set: EquipmentSet; count: number }[];
  totalBonuses: EquipmentSet['setBonuses'][0]['stats'];
} {
  const activeSets: { set: EquipmentSet; count: number }[] = [];
  let totalBonuses: EquipmentSet['setBonuses'][0]['stats'] = {};

  for (const set of EQUIPMENT_SETS) {
    const equippedCount = set.requiredItems.filter(id => 
      equippedItemIds.includes(id)
    ).length;

    if (equippedCount >= 2) {
      activeSets.push({ set, count: equippedCount });

      // 找到该套装最高的可获得加成
      const validCounts = Object.keys(set.setBonuses)
        .map(Number)
        .sort((a, b) => b - a);
      
      for (const count of validCounts) {
        if (equippedCount >= count) {
          const bonus = set.setBonuses[count];
          totalBonuses = {
            ...totalBonuses,
            ...bonus.stats,
          };
          break;
        }
      }
    }
  }

  return { sets: activeSets, totalBonuses };
}
