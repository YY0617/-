import { GameStoreType, MonsterMechanism } from '../store/gameStore';
import { SHOP_ITEMS } from '../data/itemData';

export interface BattleResult {
  playerDamage: number;
  monsterDamage: number;
  isCrit: boolean;
  isEvasion: boolean;
  isVictory: boolean;
  isDefeat: boolean;
  logs: string[];
  phaseChange?: {
    newPhase: number;
    monsterAttackBonus: number;
  };
}

// 机制辅助函数
function hasMechanism(mechanisms: MonsterMechanism[] | undefined, type: string): boolean {
  if (!mechanisms) return false;
  return mechanisms.some(m => m.type === type);
}

function getMechanism<T extends MonsterMechanism>(mechanisms: MonsterMechanism[] | undefined, type: T['type']): T | undefined {
  if (!mechanisms) return undefined;
  return mechanisms.find(m => m.type === type) as T;
}

export function calculatePlayerDamage(
  game: GameStoreType,
  monster: { defense: number; isBoss?: boolean; mechanisms?: MonsterMechanism[] },
  skillDamage: number = 0,
  bossPhase: number = 0
): { baseDamage: number; finalDamage: number; isCrit: boolean; reflectDamage: number } {
  const critRate = game.stats.critRate || 0;
  const isCrit = Math.random() < critRate;
  
  const baseAttack = game.stats.attack;
  
  const attackBonus = game.stats.tempAttackBonus || 0;
  const critBonus = game.stats.tempCritBonus || 0;
  
  let defense = monster.defense;
  
  // 破甲机制
  const armorBreak = getMechanism<{ type: 'armorBreak', ignoreDefensePercent: number }>(monster.mechanisms, 'armorBreak');
  if (armorBreak) {
    defense = Math.floor(defense * (1 - armorBreak.ignoreDefensePercent / 100));
  }
  
  let attackPower = baseAttack * (1 + attackBonus);
  
  if (skillDamage > 0) {
    attackPower += skillDamage;
  }
  
  let baseDamage = Math.max(1, Math.floor(attackPower - defense * 0.5));
  
  const critMultiplier = 1 + (isCrit ? 0.5 + critBonus : 0);
  baseDamage = Math.floor(baseDamage * critMultiplier);
  
  const battleBonus = getTotalBattleBonus(game);
  const finalDamage = Math.floor(baseDamage * battleBonus);
  
  // 反射伤害
  let reflectDamage = 0;
  const reflect = getMechanism<{ type: 'reflect', percent: number }>(monster.mechanisms, 'reflect');
  if (reflect) {
    reflectDamage = Math.floor(finalDamage * (reflect.percent / 100));
  }
  
  return { baseDamage, finalDamage, isCrit, reflectDamage };
}

export function calculateMonsterDamage(
  monster: { attack: number; isBoss?: boolean; mechanisms?: MonsterMechanism[] },
  playerDefense: number,
  defenseBonus: number,
  currentMonsterHp: number,
  maxMonsterHp: number,
  bossPhase: number = 1
): { baseDamage: number; poisonDamage: number; isDoubleStrike: boolean } {
  let monsterAttack = monster.attack;

  const isBerserk = hasMechanism(monster.mechanisms, 'berserk') && currentMonsterHp <= maxMonsterHp * 0.3;
  if (isBerserk) {
    monsterAttack = Math.floor(monsterAttack * 1.5);
  }

  let defense = playerDefense * (1 + defenseBonus);
  
  const phaseMultiplier = 1 + (bossPhase - 1) * 0.2;
  const actualAttack = monsterAttack * phaseMultiplier;
  
  const baseDamage = Math.max(1, Math.floor(actualAttack - defense * 0.5));
  
  // 毒素伤害
  let poisonDamage = 0;
  const poison = getMechanism<{ type: 'poison', poisonPerTurn: number }>(monster.mechanisms, 'poison');
  if (poison) {
    poisonDamage = poison.poisonPerTurn;
  }
  
  // 连击判断
  let isDoubleStrike = false;
  const doubleStrike = getMechanism<{ type: 'doubleStrike', chance: number }>(monster.mechanisms, 'doubleStrike');
  if (doubleStrike && Math.random() < doubleStrike.chance) {
    isDoubleStrike = true;
  }
  
  return { baseDamage, poisonDamage, isDoubleStrike };
}

export function checkEvasion(playerAgility: number, monsterMechanisms: MonsterMechanism[] | undefined): boolean {
  let evasionRate = Math.min(0.3, playerAgility * 0.005);
  
  // 怪物闪避机制
  const dodge = getMechanism<{ type: 'dodge', bonus: number }>(monsterMechanisms, 'dodge');
  if (dodge) {
    if (Math.random() < dodge.bonus / 100) {
      return true;
    }
  }
  
  return Math.random() < evasionRate;
}

export function getTotalBattleBonus(game: GameStoreType): number {
  let bonus = 1.0;
  
  bonus *= game.getBattleBonus();
  
  const formationBonus = game.getActiveFormationBonus();
  if (formationBonus.attackBonus) {
    bonus *= (1 + formationBonus.attackBonus);
  }
  
  if (game.activePet) {
    const pet = game.pets.find(p => p.id === game.activePet);
    if (pet) {
      const loyaltyMultiplier = pet.loyalty >= 80 ? 1.2 : pet.loyalty >= 50 ? 1.0 : 0.6;
      bonus *= (1 + (pet.stats.attack || 0) * loyaltyMultiplier * 0.01);
    }
  }
  
  return bonus;
}

export function getTotalDefense(game: GameStoreType): number {
  let defense = game.stats.defense;
  
  const formationBonus = game.getActiveFormationBonus();
  if (formationBonus.defenseBonus) {
    defense *= (1 + formationBonus.defenseBonus);
  }
  
  if (game.activePet) {
    const pet = game.pets.find(p => p.id === game.activePet);
    if (pet) {
      const loyaltyMultiplier = pet.loyalty >= 80 ? 1.2 : pet.loyalty >= 50 ? 1.0 : 0.6;
      defense += Math.floor((pet.stats.defense || 0) * loyaltyMultiplier);
    }
  }
  
  return defense;
}

export function executeBattleRound(
  game: GameStoreType,
  monster: {
    id: string;
    name: string;
    hp: number;
    maxHp: number;
    attack: number;
    defense: number;
    isBoss?: boolean;
    expReward: number;
    goldReward: number;
    mechanisms?: MonsterMechanism[];
  },
  skill: { name?: string; spiritualPowerCost: number; damage: number } | null,
  currentMonsterHp: number,
  currentPlayerHp: number,
  bossPhase: number
): {
  newMonsterHp: number;
  newPlayerHp: number;
  newBossPhase: number;
  result: 'continuing' | 'victory' | 'defeat';
  logs: string[];
  phaseChange?: { newPhase: number; monsterAttackBonus: number };
  isCrit?: boolean;
} {
  const logs: string[] = [];
  let newMonsterHp = currentMonsterHp;
  let newPlayerHp = currentPlayerHp;
  let newBossPhase = bossPhase;
  let phaseChange: { newPhase: number; monsterAttackBonus: number } | undefined;
  
  if (skill && !game.useSpiritualPower(skill.spiritualPowerCost)) {
    logs.push('灵力不足！');
    return { newMonsterHp, newPlayerHp, newBossPhase, result: 'continuing', logs, isCrit: false };
  }
  
  const skillDamage = skill ? skill.damage : 0;
  const { finalDamage, isCrit, reflectDamage } = calculatePlayerDamage(game, monster, skillDamage, bossPhase);
  
  newMonsterHp = Math.max(0, newMonsterHp - finalDamage);
  
  const skillName = skill ? `使用${skill.damage > 0 ? skill.name : '技能'}` : '普通攻击';
  logs.push(`${isCrit ? '暴击! ' : ''}${skillName}，造成 ${finalDamage} 伤害！`);
  
  if (reflectDamage > 0) {
    logs.push(`受到${reflectDamage}点反射伤害！`);
    newPlayerHp = Math.max(0, newPlayerHp - reflectDamage);
  }
  
  if (newMonsterHp <= 0) {
    logs.push(`击败 ${monster.name}！`);
    return { newMonsterHp, newPlayerHp, newBossPhase, result: 'victory', logs, isCrit };
  }
  
  // Boss阶段转换
  if (monster.isBoss && bossPhase > 0) {
    const maxHp = monster.maxHp;
    
    if (bossPhase === 1 && newMonsterHp <= maxHp * 0.5) {
      newBossPhase = 2;
      phaseChange = { newPhase: 2, monsterAttackBonus: 20 };
      logs.push('━━━━━━━━━━━━━━━━');
      logs.push(`【阶段转换】${monster.name}进入第二阶段！攻击力提升20%！`);
      logs.push('━━━━━━━━━━━━━━━━');
    } else if (bossPhase === 2 && newMonsterHp <= maxHp * 0.25) {
      newBossPhase = 3;
      phaseChange = { newPhase: 3, monsterAttackBonus: 40 };
      logs.push('━━━━━━━━━━━━━━━━');
      logs.push(`【阶段转换】${monster.name}进入第三阶段！攻击力大幅提升！`);
      logs.push('━━━━━━━━━━━━━━━━');
    }
  }
  
  // 怪物回合
  const isEvasion = checkEvasion(game.stats.agility, monster.mechanisms);
  if (isEvasion) {
    logs.push('你闪避了攻击！');
  } else {
    const { baseDamage, poisonDamage, isDoubleStrike } = calculateMonsterDamage(
      monster,
      game.stats.defense,
      game.stats.tempDefenseBonus || 0,
      newMonsterHp,
      monster.maxHp,
      newBossPhase
    );
    
    let totalMonsterDamage = baseDamage;
    if (isDoubleStrike) {
      logs.push(`${monster.name}使出连击！`);
      totalMonsterDamage = Math.floor(totalMonsterDamage * 1.5);
    }
    
    newPlayerHp = Math.max(0, newPlayerHp - totalMonsterDamage);
    logs.push(`${monster.name}反击，造成 ${totalMonsterDamage} 伤害！`);
    
    if (poisonDamage > 0) {
      newPlayerHp = Math.max(0, newPlayerHp - poisonDamage);
      logs.push(`毒素侵蚀，额外造成${poisonDamage}伤害！`);
    }
  }
  
  // 再生机制
  const regeneration = getMechanism<{ type: 'regeneration', hpPerTurn: number }>(monster.mechanisms, 'regeneration');
  if (regeneration) {
    const regenAmount = Math.min(regeneration.hpPerTurn, monster.maxHp - newMonsterHp);
    if (regenAmount > 0) {
      newMonsterHp += regenAmount;
      logs.push(`${monster.name}恢复了${regenAmount}点气血！`);
    }
  }
  
  if (newPlayerHp <= 0) {
    logs.push('战斗失败！');
    return { newMonsterHp, newPlayerHp: 0, newBossPhase, result: 'defeat', logs, phaseChange, isCrit };
  }
  
  return { newMonsterHp, newPlayerHp, newBossPhase, result: 'continuing', logs, phaseChange, isCrit };
}

export function canSkipBattle(
  playerStats: { hp: number; hpMax: number; attack: number; defense: number },
  monster: { hp: number; maxHp: number; attack: number; defense: number; isBoss?: boolean }
): boolean {
  if (monster.isBoss) return false;
  
  if (playerStats.hp <= 0) return false;
  if (playerStats.hp < monster.attack * 1.5) return false;
  if (playerStats.hpMax < monster.maxHp * 2) return false;
  if (playerStats.attack < monster.attack * 2) return false;
  if (playerStats.defense < monster.defense * 2) return false;
  
  return true;
}

export function processDefeat(game: GameStoreType, penalty?: { goldPercent?: number; cultivationPercent?: number }): string[] {
  const logs: string[] = [];
  const goldLost = Math.max(0, Math.floor(game.gold * (penalty?.goldPercent || 0.1)));
  const maxCultivationLoss = Math.max(0, game.stats.cultivation);
  const cultivationLost = Math.min(maxCultivationLoss, Math.floor(game.stats.cultivation * (penalty?.cultivationPercent || 0.05)));
  
  if (goldLost > 0) {
    game.gainGold(-goldLost);
    logs.push(`损失${goldLost}灵石！`);
  }
  if (cultivationLost > 0) {
    game.gainCultivation(-cultivationLost);
    logs.push(`损失${cultivationLost}修为！`);
  }
  game.advanceGameTime(60);
  logs.push('战斗失败！');
  return logs;
}

export interface BattleVictoryResult {
  expReward: number;
  goldReward: number;
  droppedItems: Array<{ name: string; quantity: number }>;
  isBoss: boolean;
  logs: string[];
}

export function processVictory(
  game: GameStoreType,
  monster: { name: string; expReward: number; goldReward: number; id?: string; isBoss?: boolean; realm?: number; drops?: Array<{ item: any; chance: number }> }
): BattleVictoryResult {
  const logs: string[] = [];
  const droppedItems: Array<{ name: string; quantity: number }> = [];
  
  game.gainCultivation(monster.expReward);
  game.gainGold(monster.goldReward);
  game.updateQuestProgress('kill_monster', 1);
  game.advanceGameTime(180);
  
  logs.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  logs.push('🎉 战斗胜利！');
  logs.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  logs.push(`击败了 ${monster.name}！`);
  logs.push('');
  logs.push('📊 战斗奖励：');
  logs.push(`   ✨ 修为 +${monster.expReward}`);
  logs.push(`   💰 灵石 +${monster.goldReward}`);
  
  // 额外掉落炼丹和炼器材料
  const alchemyMaterials = [
    { id: 'herb_1', name: '灵草', common: true },
    { id: 'herb_2', name: '灵花', common: false },
    { id: 'herb_3', name: '万年灵芝', common: false, rare: true },
    { id: 'mineral_1', name: '灵石碎末', common: true },
    { id: 'mineral_2', name: '玄晶', common: false },
    { id: 'essence', name: '天地精华', common: false, legendary: true },
  ];
  
  const refineryMaterials = [
    { id: 'iron_ore', name: '铁矿石', common: true },
    { id: 'jade_stone', name: '玉石', common: true },
    { id: 'purple_gold', name: '紫金', common: false, rare: true },
    { id: 'spirit_essence', name: '灵魄精华', common: false, rare: true },
    { id: 'heavenly_essence', name: '天灵髓', common: false, legendary: true },
  ];
  
  // 根据怪物境界调整掉落概率
  const monsterRealm = monster.realm || 0;
  const bonusDropChance = monsterRealm * 0.05;
  const isBoss = monster.isBoss || false;
  
  const allExtraMaterials = [...alchemyMaterials, ...refineryMaterials];
  
  let extraDropped: Array<{ name: string; quantity: number }> = [];
  
  allExtraMaterials.forEach(mat => {
    let dropChance = 0;

    if (mat.common) {
      dropChance = 0.4 + bonusDropChance;
    } else if (mat.rare) {
      dropChance = 0.15 + bonusDropChance * 0.5;
    } else if (mat.legendary) {
      dropChance = 0.03 + bonusDropChance * 0.2;
    } else {
      dropChance = 0.25 + bonusDropChance;
    }

    if (isBoss) dropChance += 0.15;

    if (Math.random() < dropChance) {
      let quantity = 1;
      if (mat.common) {
        quantity = Math.ceil(Math.random() * 3) + 1;
      } else if (mat.rare) {
        quantity = Math.ceil(Math.random() * 2);
      }

      extraDropped.push({ name: mat.name, quantity });
      // 使用 SHOP_ITEMS 查找物品并添加到背包
      const itemData = SHOP_ITEMS.find(item => item.id === mat.id);
      if (itemData) {
        game.addItem(itemData, quantity);
      }
    }
  });
  
  if (extraDropped.length > 0) {
    if (!monster.drops || monster.drops.length === 0) {
      logs.push('');
      logs.push('🎁 掉落物品：');
    }
    extraDropped.forEach(item => {
      droppedItems.push(item);
      logs.push(`   - ${item.name} x${item.quantity}`);
    });
    // 记录材料获取
    const totalQuantity = extraDropped.reduce((sum, item) => sum + item.quantity, 0);
    if (totalQuantity > 0) {
      game.recordMaterialsGained(totalQuantity);
    }
  }
  
  if (monster.drops && monster.drops.length > 0) {
    logs.push('');
    logs.push('🎁 掉落物品：');
    monster.drops.forEach(drop => {
      if (Math.random() < drop.chance) {
        const quantity = Math.ceil(Math.random() * 3);
        droppedItems.push({ name: drop.item.name, quantity });
        logs.push(`   - ${drop.item.name} x${quantity}`);
        game.addItem(drop.item, quantity);
        game.recordEquipmentAcquired();
      }
    });
  }
  
  if (droppedItems.length === 0) {
    logs.push('   （无掉落物品）');
  }
  
  logs.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  return {
    expReward: monster.expReward,
    goldReward: monster.goldReward,
    droppedItems,
    isBoss: monster.isBoss || false,
    logs
  };
}
