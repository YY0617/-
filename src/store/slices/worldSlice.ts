/**
 * worldSlice — world state, NPCs, monsters, pets, random events, secret realms
 */
import type { StateCreator } from 'zustand';
import type { FullStore } from './types';
import type {
  RandomEvent, WeatherType, Monster, Pet, SecretRealmProgress,
  SpiritTreasureInventory, EventHistory, NPC, EventType, Quest,
  Achievement, GameState,
} from '../../data/types';
import { MONSTERS } from '../../data/monsters';
import { PET_TEMPLATES } from '../../data/itemData';
import { RANDOM_EVENTS } from '../../data/randomEvents';
import { SECRET_REALMS } from '../../data/secretRealms';
import { SPIRIT_TREASURES } from '../../data/spiritTreasures';
import { ACHIEVEMENTS } from '../../data/achievements';
import { QUESTS, getInitialQuests, updateQuestProgress } from '../../data/questData';
import { simulateNPCs } from '../../systems/npcSystem';
import { NPC_TEMPLATES } from '../../data/npcTemplates';
import { WORLD_EVENT_TEMPLATES, createWorldEvent, isEventActive } from '../../data/worldEvents';
import type { WorldEvent } from '../../data/worldEvents';

function getInitialSecretRealms(): SecretRealmProgress[] {
  return SECRET_REALMS.map(realm => ({
    realmId: realm.id,
    currentLevel: 0,
    completed: false,
    timesCompleted: 0,
    highestLevelReached: 0,
    fragmentsCollected: 0,
    lastVisitTime: 0,
  }));
}

export interface WorldSlice {
  // State
  location: string;
  gameTime: number;
  weather: WeatherType;
  currentEvent: RandomEvent | null;
  lastEventTime: number;
  monsters: Monster[];
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
  pets: Pet[];
  activePet: string | null;
  wildPetsDefeated: Record<string, boolean>;
  petFavorability: Record<string, number>;
  npcFavorability: Record<string, number>;
  npcPersonalities: Record<string, string>;
  npcEvents: Record<string, string[]>;
  addNpcEvent: (npcId: string, event: string) => void;
  reputation: Record<string, number>;
  npcs: NPC[];
  lastSimulatedTime: number;
  activeWorldEvents: WorldEvent[];
  pastWorldEvents: WorldEvent[];
  // Quest system
  quests: Quest[];
  // Achievement system
  unlockedAchievements: string[];
  claimedAchievements: string[];

  // Actions
  advanceGameTime: (seconds: number) => void;
  triggerRandomEvent: () => void;
  handleEventChoice: (choiceIndex: number) => { success: boolean; msg: string };
  clearEvent: () => void;
  acquirePet: (petTemplateId: string) => { success: boolean; msg: string };
  levelUpPet: (petId: string) => void;
  activatePet: (petId: string) => void;
  feedPet: (petId: string) => { success: boolean; msg: string };
  modifyFavorability: (npcId: string, amount: number, eventDesc?: string) => void;
  getFavorability: (npcId: string) => number;
  setNpcPersonalities: (personalities: Record<string, string>) => void;
  getNPCsAtLocation: (location: string) => NPC[];
  getNPC: (npcId: string) => NPC | undefined;
  simulateNPCs: (deltaTime: number) => void;
  updateNPC: (npcId: string, updates: Partial<NPC>) => void;
  moveNPC: (npcId: string, location: string) => void;
  getPetCaptureMethod: (petTemplateId: string) => 'battle' | 'feed' | 'available';
  markWildPetDefeated: (petTemplateId: string) => void;
  modifyPetFavorability: (petTemplateId: string, amount: number) => void;
  triggerRandomWorldEvent: () => void;
  updateWorldEvents: (currentTime: number) => void;
  getActiveEventsAtLocation: (location: string) => WorldEvent[];
  joinWorldEvent: (eventId: string) => void;
  updateRealmStones: (amount: number) => void;
  equipSpiritTreasure: (treasureId: string) => { success: boolean; msg: string };
  unequipSpiritTreasure: (treasureId: string) => void;
  calculateSpiritTreasureBonus: () => number;
  enhanceDaoFoundationByRealm: (realmBonus: number) => void;
  // Quest actions
  updateQuestProgress: (type: string, amount?: number) => void;
  claimQuestReward: (questId: string) => { success: boolean; msg: string };
  // Achievement actions
  checkAchievements: () => { newAchievements: string[] };
  claimAchievementReward: (achievementId: string) => { success: boolean; msg: string };
}

export const createWorldSlice: StateCreator<FullStore, [], [], WorldSlice> = (set, get) => ({
  // ---- Initial state ----
  location: '落叶城',
  gameTime: 3600,
  weather: 'sunny' as WeatherType,
  currentEvent: null,
  lastEventTime: 0,
  monsters: MONSTERS,
  secretRealms: getInitialSecretRealms(),
  spiritTreasures: [],
  treasureFragments: {},
  eventHistory: [],
  currentSecretRealm: null,
  currentRandomEvent: null,
  realmStones: 0,
  totalEventsTriggered: 0,
  weeklyRealmRuns: {},
  weeklyRealmResetTime: Date.now(),
  pets: [],
  activePet: null,
  wildPetsDefeated: {},
  petFavorability: {},
  npcFavorability: {},
  npcPersonalities: {},
  npcEvents: {},
  reputation: {},
  npcs: NPC_TEMPLATES.map(template => ({ ...template })),
  lastSimulatedTime: Date.now(),
  activeWorldEvents: [],
  pastWorldEvents: [],
  quests: getInitialQuests(),
  unlockedAchievements: [],
  claimedAchievements: [],

  // ---- Actions ----
  advanceGameTime: (seconds) => set((s) => {
    let newTime = s.gameTime + seconds;
    let weather = s.weather;
    if (newTime >= s.gameTime + 300) {
      if (Math.random() < 0.3) {
        const weathers: WeatherType[] = ['sunny', 'cloudy', 'rainy', 'stormy', 'snowy', 'foggy'];
        weather = weathers[Math.floor(Math.random() * weathers.length)];
      }
    }
    return { gameTime: newTime % (24 * 3600), weather };
  }),

  triggerRandomEvent: () => set((s) => {
    const now = Date.now();
    if (now - s.lastEventTime < 60000) return {};
    if (s.currentEvent) return {};
    if (Math.random() > 0.3) return {};
    const rawEvent = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
    const event = {
      id: rawEvent.id,
      type: (rawEvent.triggerScene === 'cultivation' ? 'training' : rawEvent.triggerScene === 'explore' ? 'treasure' : rawEvent.triggerScene === 'battle' ? 'monster_surge' : 'adventure') as EventType,
      title: rawEvent.title,
      description: rawEvent.content,
      choices: rawEvent.choices.map(c => ({
        text: c.text,
        successRate: c.successRate,
        successMsg: c.rewards ? '获得奖励！' : '成功！',
        failMsg: c.consequences ? '受到损失...' : '失败...',
        effects: {
          ...(c.rewards?.gold ? { gold: c.rewards.gold } : {}),
          ...(c.rewards?.exp ? { cultivation: c.rewards.exp } : {}),
        } as Record<string, number>,
      })),
    };
    return { currentEvent: event, lastEventTime: now };
  }),

  handleEventChoice: (choiceIndex) => {
    const s = get();
    const event = s.currentEvent;
    if (!event) return { success: false, msg: '没有事件' };
    const choice = event.choices[choiceIndex];
    if (!choice) return { success: false, msg: '无效选择' };
    const successRate = choice.successRate || 1;
    const success = Math.random() < successRate;
    if (success && (choice as any).effects) {
      const effects = (choice as any).effects as Record<string, number>;
      if (effects.gold) s.gainGold(effects.gold);
      if (effects.cultivation) s.gainCultivation(effects.cultivation);
    }
    set({ currentEvent: null });
    return { success, msg: success ? choice.successMsg : (choice.failMsg || '失败了') };
  },

  clearEvent: () => set({ currentEvent: null }),

  acquirePet: (petTemplateId) => {
    const template = PET_TEMPLATES.find(p => p.id === petTemplateId);
    if (!template) return { success: false, msg: '未知灵宠！' };
    const s = get();
    if (s.pets.find(p => p.id === petTemplateId)) return { success: false, msg: '已拥有此灵宠！' };
    const captureRate = 0.4 + (s.stats.luck / 100) * 0.2;
    if (Math.random() > captureRate) return { success: false, msg: `${template.name}挣脱了控制，逃跑了！` };
    set((state) => ({ pets: [...state.pets, { ...template }] }));
    return { success: true, msg: `成功收服${template.name}！` };
  },

  levelUpPet: (petId) => set((s) => ({
    pets: s.pets.map(p => p.id === petId && p.level < p.maxLevel ? { ...p, level: p.level + 1 } : p),
  })),

  activatePet: (petId) => {
    const pet = get().pets.find(p => p.id === petId);
    if (!pet) return;
    set({ activePet: petId });
  },

  feedPet: (petId) => {
    const s = get();
    const idx = s.pets.findIndex(p => p.id === petId);
    if (idx < 0) return { success: false, msg: '灵宠不存在！' };
    if (s.gold < 30) return { success: false, msg: '灵石不足！需要30灵石' };
    const pet = s.pets[idx];
    const loyaltyGain = pet.loyalty < 30 ? 8 : pet.loyalty < 70 ? 5 : 2;
    const newLoyalty = Math.min(100, pet.loyalty + loyaltyGain);
    set((state) => {
      const pets = [...state.pets];
      pets[idx] = { ...pets[idx], loyalty: newLoyalty };
      return { pets, gold: state.gold - 30 };
    });
    return { success: true, msg: `喂养成功！${pet.name}忠诚度+${loyaltyGain}！` };
  },

  modifyFavorability: (npcId, amount, eventDesc) => set((s) => {
    const current = s.npcFavorability[npcId] || 0;
    const newValue = Math.max(-100, Math.min(100, current + amount));
    const updatedNpcs = s.npcs.map(npc => {
      if (npc.id === npcId) {
        const currentRelation = npc.relationships['player'] || { trust: 0, type: 'neutral' as const };
        const newTrust = Math.max(-100, Math.min(100, currentRelation.trust + amount));
        const relType: 'friend' | 'rival' | 'neutral' = newTrust >= 30 ? 'friend' : newTrust <= -30 ? 'rival' : 'neutral';
        return {
          ...npc,
          relationships: {
            ...npc.relationships,
            player: { trust: newTrust, type: relType },
          },
        };
      }
      return npc;
    });
    const events = s.npcEvents[npcId] || [];
    const updatedNpcEvents = eventDesc
      ? { ...s.npcEvents, [npcId]: [...events.slice(-99), eventDesc] }
      : s.npcEvents;
    return { npcFavorability: { ...s.npcFavorability, [npcId]: newValue }, npcs: updatedNpcs, npcEvents: updatedNpcEvents };
  }),

  getFavorability: (npcId) => get().npcFavorability[npcId] || 0,

  addNpcEvent: (npcId: string, event: string) => set((s) => {
    const events = s.npcEvents[npcId] || [];
    return { npcEvents: { ...s.npcEvents, [npcId]: [...events.slice(-99), event] } };
  }),

  setNpcPersonalities: (personalities) => set({ npcPersonalities: personalities }),

  getNPCsAtLocation: (location) => {
    return get().npcs.filter(npc => npc.location === location);
  },

  getNPC: (npcId) => {
    return get().npcs.find(npc => npc.id === npcId);
  },

  simulateNPCs: (deltaTime) => set((s) => {
    const simulatedNPCs = simulateNPCs(s.npcs, deltaTime);
    return { npcs: simulatedNPCs, lastSimulatedTime: Date.now() };
  }),

  updateNPC: (npcId, updates) => set((s) => {
    const npcs = s.npcs.map(npc =>
      npc.id === npcId ? { ...npc, ...updates, lastActive: Date.now() } : npc
    );
    return { npcs };
  }),

  moveNPC: (npcId, location) => set((s) => {
    const npcs = s.npcs.map(npc =>
      npc.id === npcId ? { ...npc, location, lastActive: Date.now() } : npc
    );
    return { npcs };
  }),

  getPetCaptureMethod: (petTemplateId) => {
    const s = get();
    if (s.pets.find(p => p.id === petTemplateId)) return 'available';
    if (s.wildPetsDefeated[petTemplateId]) return 'feed';
    return 'battle';
  },

  markWildPetDefeated: (petTemplateId) => set((s) => ({
    wildPetsDefeated: { ...s.wildPetsDefeated, [petTemplateId]: true },
  })),

  modifyPetFavorability: (petTemplateId, amount) => set((s) => {
    const current = s.petFavorability[petTemplateId] || 0;
    const newValue = Math.max(0, Math.min(100, current + amount));
    return { petFavorability: { ...s.petFavorability, [petTemplateId]: newValue } };
  }),

  triggerRandomWorldEvent: () => set((s) => {
    const hasActiveEvent = s.activeWorldEvents.length > 0;
    if (hasActiveEvent && Math.random() > 0.1) return s;

    const template = WORLD_EVENT_TEMPLATES[Math.floor(Math.random() * WORLD_EVENT_TEMPLATES.length)];
    const newEvent = createWorldEvent(template);

    const participantNPCs = s.npcs.filter(npc =>
      npc.location === newEvent.location || (Math.random() < 0.3 && npc.traits.social > 50)
    );
    newEvent.participants = participantNPCs.map(npc => npc.id);

    return {
      activeWorldEvents: [...s.activeWorldEvents, newEvent],
    };
  }),

  updateWorldEvents: (currentTime) => set((s) => {
    const stillActive = s.activeWorldEvents.filter(event =>
      event.active && isEventActive(event, currentTime)
    );
    const expired = s.activeWorldEvents.filter(event =>
      !event.active || !isEventActive(event, currentTime)
    );

    return {
      activeWorldEvents: stillActive.map(e => ({ ...e, active: true })),
      pastWorldEvents: [...s.pastWorldEvents, ...expired.map(e => ({ ...e, active: false }))],
    };
  }),

  getActiveEventsAtLocation: (location) => {
    return get().activeWorldEvents.filter(event => event.location === location);
  },
joinWorldEvent: (eventId) => set((s) => {
    const eventIndex = s.activeWorldEvents.findIndex(e => e.id === eventId);
    if (eventIndex < 0) return {};
    const event = s.activeWorldEvents[eventIndex];
    const updatedEvent = {
      ...event,
      participants: event.participants.includes('player')
        ? event.participants
        : [...event.participants, 'player'],
    };
    const updatedEvents = [...s.activeWorldEvents];
    updatedEvents[eventIndex] = updatedEvent;
    return { activeWorldEvents: updatedEvents };
  }),

  updateRealmStones: (amount) => set((s) => ({
    realmStones: Math.max(0, s.realmStones + amount),
  })),

  equipSpiritTreasure: (treasureId) => {
    const treasure = SPIRIT_TREASURES.find(t => t.id === treasureId);
    if (!treasure) return { success: false, msg: '灵宝不存在！' };
    
    const s = get();
    const existingIndex = s.spiritTreasures.findIndex(t => t.treasureId === treasureId);
    if (existingIndex !== -1) {
      const updated = [...s.spiritTreasures];
      updated[existingIndex] = { ...updated[existingIndex], equipped: true };
      const bonus = s.calculateSpiritTreasureBonus();
      return { success: true, msg: `装备${treasure.name}成功！`, spiritTreasures: updated, stats: { ...s.stats, spiritTreasureBonusRate: bonus } };
    }
    
    const newTreasure: SpiritTreasureInventory = {
      treasureId,
      equipped: true,
      level: 1,
    };
    
    const bonus = s.calculateSpiritTreasureBonus();
    return {
      success: true,
      msg: `装备${treasure.name}成功！`,
      spiritTreasures: [...s.spiritTreasures, newTreasure],
      stats: { ...s.stats, spiritTreasureBonusRate: bonus },
    };
  },

  unequipSpiritTreasure: (treasureId) => {
    const s = get();
    const updated = s.spiritTreasures.map(t =>
      t.treasureId === treasureId ? { ...t, equipped: false } : t
    );
    const bonus = s.calculateSpiritTreasureBonus();
    set({ spiritTreasures: updated, stats: { ...s.stats, spiritTreasureBonusRate: bonus } });
  },

  calculateSpiritTreasureBonus: () => {
    const s = get();
    let totalBonus = 0;
    
    for (const inv of s.spiritTreasures) {
      if (!inv.equipped) continue;
      const treasure = SPIRIT_TREASURES.find(t => t.id === inv.treasureId);
      if (treasure?.effect.breakthroughBonusRate) {
        totalBonus += treasure.effect.breakthroughBonusRate;
      }
    }
    
    const equippedIds = s.spiritTreasures.filter(t => t.equipped).map(t => t.treasureId);
    const legendarySetTreasures = [
      'qingming_zhuxian_dadao_guiyi',
      'qingming_zhuxian_sword',
      'spring_dragon_essence_bracelet',
      'soul_calming_god_pearl'
    ];
    const hasFullSet = legendarySetTreasures.every(id => equippedIds.includes(id));
    if (hasFullSet) {
      const setTreasure = SPIRIT_TREASURES.find(t => t.id === 'qingming_zhuxian_dadao_guiyi');
      if (setTreasure?.setBonus?.breakthroughBonusRate) {
        totalBonus += setTreasure.setBonus.breakthroughBonusRate;
      }
    }
    
    return totalBonus;
  },

  enhanceDaoFoundationByRealm: (realmBonus) => {
    const s = get();
    const newBonus = s.stats.daoFoundation.bonusRate + realmBonus;
    const qualityList: Array<'mortal' | 'spirit' | 'immortal' | 'celestial' | 'divine'> = ['mortal', 'spirit', 'immortal', 'celestial', 'divine'];
    let newQuality = s.stats.daoFoundation.quality;
    
    if (newBonus >= 0.40) newQuality = 'divine';
    else if (newBonus >= 0.25) newQuality = 'celestial';
    else if (newBonus >= 0.12) newQuality = 'immortal';
    else if (newBonus >= 0.05) newQuality = 'spirit';
    
    const qualityDescMap: Record<string, string> = {
      mortal: '凡人道基，根基浅薄',
      spirit: '灵根道基，根基稳固',
      immortal: '仙人道基，脱胎换骨',
      celestial: '天道道基，与道合真',
      divine: '大道道基，证道之基',
    };
    
    set({
      stats: {
        ...s.stats,
        daoFoundation: {
          ...s.stats.daoFoundation,
          level: s.stats.daoFoundation.level + 1,
          quality: newQuality,
          bonusRate: newBonus,
          description: qualityDescMap[newQuality],
          lastEnhancedAt: Date.now(),
          enhancedBy: '秘境奇遇',
        },
      },
    });
  },

  // Quest system
  updateQuestProgress: (type, amount = 1) => {
    const s = get();
    const gameState: GameState = {
      playerName: s.playerName,
      gold: s.gold,
      stats: s.stats,
      inventory: s.inventory,
      equipment: s.equipment,
      skills: s.skills,
      quests: s.quests,
      location: s.location,
      battleHistory: [],
      totalKills: {},
      playTime: s.playTime,
      physique: s.physique,
      lingen: s.lingen,
      background: s.background,
      force: s.force,
      master: s.master,
      gameStarted: s.gameStarted,
      npcFavorability: s.npcFavorability,
      npcPersonalities: s.npcPersonalities,
      npcEvents: s.npcEvents,
      gameTime: s.gameTime,
      weather: s.weather,
      currentEvent: s.currentEvent,
      lastEventTime: s.lastEventTime,
      unlockedAchievements: s.unlockedAchievements,
      claimedAchievements: s.claimedAchievements,
      dailyResetTime: 0,
      weeklyResetTime: 0,
      activeFormation: s.activeFormation,
      formationEndTime: s.formationEndTime,
      formationCooldowns: s.formationCooldowns,
      hasActivatedFormation: s.hasActivatedFormation,
      pets: s.pets,
      activePet: s.activePet,
      talentPoints: s.talentPoints ?? 0,
      unlockedTalents: s.unlockedTalents ?? [],
      currentStoryNode: null,
      completedStories: [],
      wildPetsDefeated: s.wildPetsDefeated,
      petFavorability: s.petFavorability,
      monsters: s.monsters,
      reputation: s.reputation,
      secretRealms: s.secretRealms,
      spiritTreasures: s.spiritTreasures,
      treasureFragments: s.treasureFragments,
      eventHistory: s.eventHistory,
      currentSecretRealm: s.currentSecretRealm,
      currentRandomEvent: s.currentRandomEvent,
      realmStones: s.realmStones,
      totalEventsTriggered: s.totalEventsTriggered,
      weeklyRealmRuns: s.weeklyRealmRuns,
      weeklyRealmResetTime: s.weeklyRealmResetTime,
      totalCultivation: s.totalCultivation,
      totalGold: s.totalGold,
      npcs: s.npcs,
      lastSimulatedTime: s.lastSimulatedTime,
      activeWorldEvents: s.activeWorldEvents,
      pastWorldEvents: s.pastWorldEvents,
      buffs: [],
      announcements: [],
      daoHeart: { righteousPoints: 0, evilPoints: 0, currentType: 'neutral', records: [] },
      enlightenment: { active: false, currentEvent: null, remainingTime: 0 },
      demonHeart: { enabled: false, strongestDefeated: null, timesChallenged: 0, timesVictory: 0 },
      karma: { events: [], currentKarma: 0 },
      adWatch: { records: [], todayCount: 0 },
    };
    const updatedQuests = updateQuestProgress(s.quests, type, amount, gameState);
    set({ quests: updatedQuests });
    // Check achievements when quest progress updates
    get().checkAchievements();
  },

  claimQuestReward: (questId) => {
    const s = get();
    const quest = s.quests.find(q => q.id === questId);
    if (!quest) return { success: false, msg: '任务不存在' };
    if (!quest.isCompleted) return { success: false, msg: '任务未完成' };
    if (quest.isClaimed) return { success: false, msg: '奖励已领取' };

    const rewards = quest.rewards;
    s.gainGold(rewards.gold);
    s.gainCultivation(rewards.cultivation);
    if (rewards.realmStones) s.updateRealmStones(rewards.realmStones);
    if (rewards.talentPoint) set((state) => ({ talentPoints: (state.talentPoints ?? 0) + rewards.talentPoint! }));

    set((state) => ({
      quests: state.quests.map(q => q.id === questId ? { ...q, isClaimed: true } : q),
    }));

    return { success: true, msg: `领取${quest.name}奖励成功！` };
  },

  // Achievement system
  checkAchievements: () => {
    const s = get();
    const gameState: GameState = {
      playerName: s.playerName,
      gold: s.gold,
      stats: s.stats,
      inventory: s.inventory,
      equipment: s.equipment,
      skills: s.skills,
      quests: s.quests,
      location: s.location,
      battleHistory: [],
      totalKills: {},
      playTime: s.playTime,
      physique: s.physique,
      lingen: s.lingen,
      background: s.background,
      force: s.force,
      master: s.master,
      gameStarted: s.gameStarted,
      npcFavorability: s.npcFavorability,
      npcPersonalities: s.npcPersonalities,
      npcEvents: s.npcEvents,
      gameTime: s.gameTime,
      weather: s.weather,
      currentEvent: s.currentEvent,
      lastEventTime: s.lastEventTime,
      unlockedAchievements: s.unlockedAchievements,
      claimedAchievements: s.claimedAchievements,
      dailyResetTime: 0,
      weeklyResetTime: 0,
      activeFormation: s.activeFormation,
      formationEndTime: s.formationEndTime,
      formationCooldowns: s.formationCooldowns,
      hasActivatedFormation: s.hasActivatedFormation,
      pets: s.pets,
      activePet: s.activePet,
      talentPoints: s.talentPoints ?? 0,
      unlockedTalents: s.unlockedTalents ?? [],
      currentStoryNode: null,
      completedStories: [],
      wildPetsDefeated: s.wildPetsDefeated,
      petFavorability: s.petFavorability,
      monsters: s.monsters,
      reputation: s.reputation,
      secretRealms: s.secretRealms,
      spiritTreasures: s.spiritTreasures,
      treasureFragments: s.treasureFragments,
      eventHistory: s.eventHistory,
      currentSecretRealm: s.currentSecretRealm,
      currentRandomEvent: s.currentRandomEvent,
      realmStones: s.realmStones,
      totalEventsTriggered: s.totalEventsTriggered,
      weeklyRealmRuns: s.weeklyRealmRuns,
      weeklyRealmResetTime: s.weeklyRealmResetTime,
      totalCultivation: s.totalCultivation,
      totalGold: s.totalGold,
      npcs: s.npcs,
      lastSimulatedTime: s.lastSimulatedTime,
      activeWorldEvents: s.activeWorldEvents,
      pastWorldEvents: s.pastWorldEvents,
      buffs: [],
      announcements: [],
      daoHeart: { righteousPoints: 0, evilPoints: 0, currentType: 'neutral', records: [] },
      enlightenment: { active: false, currentEvent: null, remainingTime: 0 },
      demonHeart: { enabled: false, strongestDefeated: null, timesChallenged: 0, timesVictory: 0 },
      karma: { events: [], currentKarma: 0 },
      adWatch: { records: [], todayCount: 0 },
    };

    const newUnlocked: string[] = [...s.unlockedAchievements];
    const newlyUnlocked: string[] = [];

    for (const achievement of ACHIEVEMENTS) {
      if (!newUnlocked.includes(achievement.id) && achievement.condition(gameState)) {
        newUnlocked.push(achievement.id);
        newlyUnlocked.push(achievement.id);
        s.showToast?.(`🎉 解锁成就：${achievement.name}！`, 'success');
      }
    }

    if (newlyUnlocked.length > 0) {
      set({ unlockedAchievements: newUnlocked });
    }

    return { newAchievements: newlyUnlocked };
  },

  claimAchievementReward: (achievementId) => {
    const s = get();
    if (!s.unlockedAchievements.includes(achievementId)) return { success: false, msg: '成就未解锁' };
    if (s.claimedAchievements.includes(achievementId)) return { success: false, msg: '奖励已领取' };

    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) return { success: false, msg: '成就不存在' };

    const reward = achievement.reward;
    if (reward.gold) s.gainGold(reward.gold);
    if (reward.cultivation) s.gainCultivation(reward.cultivation);
    if (reward.talentPoint) set((state) => ({ talentPoints: (state.talentPoints ?? 0) + reward.talentPoint! }));

    set((state) => ({
      claimedAchievements: [...state.claimedAchievements, achievementId],
    }));

    return { success: true, msg: `领取${achievement.name}奖励成功！` };
  },
});
