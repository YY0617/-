import { useGameStore } from '../store/gameStore';
import { SECRET_REALMS } from '../data/secretRealms';
import { SPIRIT_TREASURES } from '../data/spiritTreasures';
import { RANDOM_EVENTS } from '../data/eventData';
import { BREAKTHROUGH_PILLS, BREAKTHROUGH_PILL_DROP_RATE, ALCHEMY_MATERIALS, WEAPONS, ARMORS, ACCESSORIES } from '../data/itemData';
import { REFINERY_MATERIALS, REFINERY_ITEMS } from '../data/refineryData';
import {
  getSecretRealm,
  getSpiritTreasure,
  getRandomEventByScene,
  getRealmRewards,
  canAccessRealm
} from '../systems/newGameSystems';

export function useSecretRealmSystem() {
  const gameState = useGameStore();

  // 计算当前周次（用于每周重置）
  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  const enterRealm = (realmId: string) => {
    const realm = getSecretRealm(realmId);
    if (!realm) return { success: false, msg: '秘境不存在！' };
    
    if (!canAccessRealm(realm, gameState.stats.realm)) {
      return { success: false, msg: '境界不足，无法进入！' };
    }
    
    if (gameState.stats.stamina < realm.staminaCost) {
      return { success: false, msg: '体力不足！' };
    }
    
    const year = new Date().getFullYear();
    const weekNumber = getWeekNumber(new Date());
    const weeklyKey = `${year}_${weekNumber}_${realmId}`;
    const weeklyRuns = gameState.weeklyRealmRuns[weeklyKey] || 0;
    
    if (realm.type === 'weekly' && weeklyRuns >= 3) {
      return { success: false, msg: '本周秘境挑战已用完！' };
    }
    
    gameState.useStamina(realm.staminaCost);
    useGameStore.setState({
      currentSecretRealm: realmId,
      weeklyRealmRuns: {
        ...gameState.weeklyRealmRuns,
        [weeklyKey]: weeklyRuns + 1,
      }
    });
    
    return { success: true, msg: `成功进入${realm.name}！` };
  };

  const exitRealm = (completed = false, levelReached = 0) => {
    const realmId = gameState.currentSecretRealm;
    if (!realmId) return;
    
    const realm = getSecretRealm(realmId);
    if (!realm) return;
    
    const rewards = completed ? getRealmRewards(realm, levelReached) : {
      gold: Math.floor(realm.rewards.gold[0] * 0.3),
      exp: Math.floor(realm.rewards.exp[0] * 0.3),
      realmStones: Math.floor(realm.rewards.realmStones[0] * 0.3),
      fragments: 0,
    };
    
    // 掉落材料
    const droppedItems: Array<{name: string, count: number}> = [];
    
    const realmLevel = realm.reqRealm;
    const rarityMultiplier = {
      common: 1,
      rare: 2,
      epic: 3,
      legendary: 5
    }[realm.rarity];

    // 炼丹材料掉落
    const alchemyDropChance = completed ? 0.8 : 0.4;
    if (Math.random() < alchemyDropChance) {
      const availableAlchemy = ALCHEMY_MATERIALS.filter(m => {
        const r = (m as any).rarity as string;
        const rarityScore = (r === 'common' ? 0 : r === 'rare' ? 1 : r === 'epic' ? 2 : 3);
        return rarityScore <= realmLevel + (rarityMultiplier || 1);
      });
      const material = availableAlchemy[Math.floor(Math.random() * availableAlchemy.length)];
      if (material) {
        const count = Math.floor(Math.random() * (3 * (rarityMultiplier || 1))) + 1;
        gameState.addItem(
          { id: material.id, name: material.name, type: 'material', description: '', price: 0 },
          count
        );
        droppedItems.push({name: material.name, count});
      }
    }

    // 炼器材料掉落
    const refineryDropChance = completed ? 0.7 : 0.35;
    if (Math.random() < refineryDropChance) {
      const availableRefinery = REFINERY_MATERIALS.filter(m => {
        const r = (m as any).rarity as string;
        const rarityScore = (r === 'common' ? 0 : r === 'rare' ? 1 : r === 'epic' ? 2 : 3);
        return rarityScore <= realmLevel + (rarityMultiplier || 1);
      });
      const material = availableRefinery[Math.floor(Math.random() * availableRefinery.length)];
      if (material) {
        const count = Math.floor(Math.random() * (2 * (rarityMultiplier || 1))) + 1;
        gameState.addItem(
          { id: material.id, name: material.name, type: 'material', description: '', price: 0 },
          count
        );
        droppedItems.push({name: material.name, count});
      }
    }
    
    if (completed) {
      gameState.gainGold(rewards.gold);
      gameState.gainCultivation(rewards.exp);
      gameState.updateQuestProgress('clear_secret_realm', 1);
      
      const dropChance = realm.rarity === 'legendary' ? 0.3 : realm.rarity === 'epic' ? 0.15 : realm.rarity === 'rare' ? 0.08 : 0.03;
      const actualDropChance = completed ? dropChance : dropChance * 0.5;
      
      for (const [pillId, rate] of Object.entries(BREAKTHROUGH_PILL_DROP_RATE)) {
        const pill = BREAKTHROUGH_PILLS.find(p => p.id === pillId);
        if (!pill) continue;
        
        if (pill.rarity === 'legendary' && realm.rarity !== 'legendary' && realm.rarity !== 'epic') continue;
        if (pill.rarity === 'epic' && realm.rarity !== 'epic' && realm.rarity !== 'legendary') continue;
        
        if (Math.random() < rate * actualDropChance) {
          gameState.addItem({ id: pill.id, name: pill.name, type: 'consumable', description: pill.description, price: 0 }, 1);
          break;
        }
      }
      
      if (realm.rarity === 'legendary' && completed) {
        gameState.enhanceDaoFoundationByRealm(0.05);
      } else if ((realm.rarity === 'epic' || realm.rarity === 'rare') && completed && Math.random() < 0.3) {
        gameState.enhanceDaoFoundationByRealm(0.02);
      }
    } else {
      if (Math.random() < 0.05) {
        const basicPills = BREAKTHROUGH_PILLS.filter(p => p.rarity === 'common' || p.rarity === 'rare');
        const pill = basicPills[Math.floor(Math.random() * basicPills.length)];
        if (pill) {
          gameState.addItem({ id: pill.id, name: pill.name, type: 'consumable', description: pill.description, price: 0 }, 1);
        }
      }
    }
    
    useGameStore.setState({
      currentSecretRealm: null,
      secretRealms: gameState.secretRealms.map(sr => {
        if (sr.realmId === realmId) {
          return {
            ...sr,
            completed: completed || sr.completed,
            timesCompleted: completed ? sr.timesCompleted + 1 : sr.timesCompleted,
            highestLevelReached: Math.max(sr.highestLevelReached, levelReached),
            lastVisitTime: Date.now(),
          };
        }
        return sr;
      }),
      realmStones: gameState.realmStones + rewards.realmStones,
      treasureFragments: {
        ...gameState.treasureFragments,
        [realmId]: (gameState.treasureFragments[realmId] || 0) + rewards.fragments,
      }
    });

    // 显示材料掉落提示
    if (droppedItems.length > 0) {
      const dropText = droppedItems.map(item => `${item.name} x${item.count}`).join(', ');
      gameState.showToast(`获得材料: ${dropText}`, 'success');
      // 记录材料获取
      const totalQuantity = droppedItems.reduce((sum, item) => sum + item.count, 0);
      gameState.recordMaterialsGained(totalQuantity);
    }
    
    return rewards;
  };

  const getAvailableRealms = () => {
    return SECRET_REALMS.filter(realm => canAccessRealm(realm, gameState.stats.realm));
  };

  const getRealmProgress = (realmId: string) => {
    return gameState.secretRealms.find(sr => sr.realmId === realmId);
  };

  return {
    enterRealm,
    exitRealm,
    getAvailableRealms,
    getRealmProgress,
  };
}

export function useSpiritTreasureSystem() {
  const gameState = useGameStore();

  const getTreasure = (treasureId: string) => {
    return getSpiritTreasure(treasureId);
  };

  const acquireTreasure = (treasureId: string) => {
    const treasure = getSpiritTreasure(treasureId);
    if (!treasure) return { success: false, msg: '灵宝不存在！' };
    
    if (gameState.spiritTreasures.find(st => st.treasureId === treasureId)) {
      return { success: false, msg: '你已经拥有这件灵宝了！' };
    }
    
    if (gameState.stats.realm < treasure.requiredRealm) {
      return { success: false, msg: '境界不足，无法拥有此灵宝！' };
    }
    
    useGameStore.setState({
      spiritTreasures: [
        ...gameState.spiritTreasures,
        {
          treasureId,
          equipped: false,
          level: 1,
        },
      ],
    });
    
    return { success: true, msg: `成功获得${treasure.name}！` };
  };

  const equipTreasure = (treasureId: string, slot: 'active' | 'passive') => {
    const treasure = getSpiritTreasure(treasureId);
    if (!treasure) return { success: false, msg: '灵宝不存在！' };
    
    const existing = gameState.spiritTreasures.find(st => st.treasureId === treasureId);
    if (!existing) return { success: false, msg: '你还没有这件灵宝！' };
    
    if (slot === 'active' && treasure.type !== 'active') {
      return { success: false, msg: '这件灵宝无法装备在主动槽！' };
    }
    
    if (slot === 'passive' && treasure.type !== 'passive') {
      return { success: false, msg: '这件灵宝无法装备在被动槽！' };
    }
    
    useGameStore.setState({
      spiritTreasures: gameState.spiritTreasures.map(st => {
        if (st.treasureId === treasureId) {
          return { ...st, equipped: true, slot };
        }
        if (st.equipped && st.slot === slot) {
          return { ...st, equipped: false, slot: undefined };
        }
        return st;
      }),
    });
    
    return { success: true, msg: `成功装备${treasure.name}！` };
  };

  const unequipTreasure = (treasureId: string) => {
    useGameStore.setState({
      spiritTreasures: gameState.spiritTreasures.map(st => {
        if (st.treasureId === treasureId) {
          return { ...st, equipped: false, slot: undefined };
        }
        return st;
      }),
    });
    
    return { success: true };
  };

  const getEquippedTreasures = () => {
    return gameState.spiritTreasures.filter(st => st.equipped);
  };

  const combineFragments = (fragmentId: string): { success: boolean; msg: string } => {
    const fragments = gameState.treasureFragments[fragmentId] || 0;
    const requiredFragments = 10;
    
    if (fragments < requiredFragments) {
      return { success: false, msg: `碎片不足！需要${requiredFragments}，当前${fragments}个` };
    }
    
    // 使用精确匹配而不是模糊匹配
    const matchingTreasure = SPIRIT_TREASURES.find(t => t.id === fragmentId || `fragment_${t.id}` === fragmentId);
    if (!matchingTreasure) {
      return { success: false, msg: '无法找到对应的灵宝！' };
    }
    
    useGameStore.setState({
      treasureFragments: {
        ...gameState.treasureFragments,
        [fragmentId]: fragments - requiredFragments,
      },
    });
    
    return acquireTreasure(matchingTreasure.id);
  };

  const getAllTreasures = () => SPIRIT_TREASURES;
  const getInventoryTreasures = () => gameState.spiritTreasures;

  return {
    getTreasure,
    acquireTreasure,
    equipTreasure,
    unequipTreasure,
    getEquippedTreasures,
    combineFragments,
    getAllTreasures,
    getInventoryTreasures,
  };
}

export function useEventSystem() {
  const gameState = useGameStore();

  const triggerEvent = (scene: 'cultivation' | 'battle' | 'explore' | 'rest' | 'shop') => {
    if (gameState.currentRandomEvent) return { success: false, msg: '已有事件进行中！' };
    
    const event = getRandomEventByScene(scene);
    if (!event) return { success: false, msg: '没有适合的事件！' };
    
    useGameStore.setState({
      currentRandomEvent: event,
      totalEventsTriggered: gameState.totalEventsTriggered + 1,
    });
    
    return { success: true, event };
  };

  const makeEventChoice = (choiceIndex: number) => {
    const event = gameState.currentRandomEvent;
    if (!event) return { success: false, msg: '没有当前事件！' };
    
    const choice = event.choices[choiceIndex];
    if (!choice) return { success: false, msg: '无效的选择！' };
    
    let success = true;
    if (choice.successRate !== undefined) {
      success = Math.random() < choice.successRate;
    }
    
    if (success && choice.rewards) {
      if (choice.rewards.gold) gameState.gainGold(choice.rewards.gold);
      if (choice.rewards.exp) gameState.gainCultivation(choice.rewards.exp);
    }
    
    if (!success && choice.consequences) {
      if (choice.consequences.damage) {
        gameState.takeDamage(choice.consequences.damage);
      }
      if (choice.consequences.expLoss) {
        gameState.gainCultivation(-choice.consequences.expLoss);
      }
    }
    
    useGameStore.setState({
      currentRandomEvent: null,
      eventHistory: [
        ...gameState.eventHistory.slice(-99),
        {
          eventId: event.id,
          triggeredAt: Date.now(),
          choiceMade: choiceIndex,
          outcome: success ? 'success' : 'failure',
        },
      ],
    });
    
    return { 
      success, 
      rewards: success ? choice.rewards : null, 
      consequences: !success ? choice.consequences : null 
    };
  };

  const skipEvent = () => {
    useGameStore.setState({
      currentRandomEvent: null,
    });
    return { success: true };
  };

  const getEventHistory = () => gameState.eventHistory;
  const getCurrentEvent = () => gameState.currentRandomEvent;

  return {
    triggerEvent,
    makeEventChoice,
    skipEvent,
    getEventHistory,
    getCurrentEvent,
  };
}
