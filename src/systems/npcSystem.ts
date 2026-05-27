import { NPC, NPC_TEMPLATES, LOCATIONS, STATUS_LABELS } from '../data/npcTemplates';

export interface NPCGoal {
  id: string;
  type: 'cultivate' | 'explore' | 'find_treasure' | 'make_friend' | 'defeat_rival';
  target: string | null;
  progress: number;
  deadline: number;
}

export interface NPCMemory {
  npcId: string;
  event: string;
  timestamp: number;
  playerInvolved: boolean;
  impression: 'positive' | 'negative' | 'neutral';
}

export function getInitialNPCState(): any {
  return {
    npcs: NPC_TEMPLATES.map(template => ({ ...template })),
    lastSimulatedTime: Date.now(),
    currentWorldEvent: null,
    worldEventEndTime: 0,
  };
}

export function getNPC(npcId: string, npcs: NPC[]): NPC | undefined {
  return npcs.find(npc => npc.id === npcId);
}

export function getNPCsByLocation(location: string, npcs: NPC[]): NPC[] {
  return npcs.filter(npc => npc.location === location);
}

export function updateNPCStatus(npc: NPC, status: NPC['status']): NPC {
  return { ...npc, status, lastActive: Date.now() };
}

export function moveNPC(npc: NPC, location: string): NPC {
  return { ...npc, location, lastActive: Date.now() };
}

export function simulateNPCs(npcs: NPC[], deltaTime: number): NPC[] {
  const now = Date.now();
  const hoursPassed = deltaTime / (1000 * 60 * 60);
  
  let updatedNPCs = npcs.map(npc => simulateSingleNPC(npc, hoursPassed, now));
  
  if (Math.random() < 0.15 * hoursPassed) {
    updatedNPCs = handleNPCInteractions(updatedNPCs);
  }
  
  updatedNPCs = updateNPCGoals(updatedNPCs, hoursPassed);
  
  return updatedNPCs;
}

function simulateSingleNPC(npc: NPC, hoursPassed: number, now: number): NPC {
  const updatedNPC = { ...npc };
  
  if (Math.random() < 0.02 * hoursPassed) {
    updatedNPC.currentRealm = Math.min(9, updatedNPC.currentRealm + 1);
  }
  
  const currentLocation = updatedNPC.location;
  if (Math.random() < 0.2 * hoursPassed) {
    const newLocation = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    if (newLocation !== currentLocation) {
      updatedNPC.location = newLocation;
    }
  }
  
  return updatedNPC;
}

function updateNPCGoals(npcs: NPC[], hoursPassed: number): NPC[] {
  return npcs.map(npc => {
    if (Math.random() < 0.05 * hoursPassed) {
      const goals = generateRandomGoal();
      return {
        ...npc,
        currentGoal: goals,
      };
    }
    return npc;
  });
}

function generateRandomGoal(): NPCGoal {
  const goalTypes: NPCGoal['type'][] = ['cultivate', 'explore', 'find_treasure', 'make_friend', 'defeat_rival'];
  
  const selectedType = goalTypes[Math.floor(Math.random() * goalTypes.length)];
  
  return {
    id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: selectedType,
    target: null,
    progress: 0,
    deadline: Date.now() + (10 + Math.floor(Math.random() * 20)) * 60000,
  };
}

function handleNPCInteractions(npcs: NPC[]): NPC[] {
  const resultNPCs = [...npcs];
  
  const npcsByLocation: Record<string, NPC[]> = {};
  for (const npc of resultNPCs) {
    if (!npcsByLocation[npc.location]) npcsByLocation[npc.location] = [];
    npcsByLocation[npc.location].push(npc);
  }
  
  for (const location in npcsByLocation) {
    const localNPCs = npcsByLocation[location];
    if (localNPCs.length >= 2) {
      const idx1 = Math.floor(Math.random() * localNPCs.length);
      let idx2 = Math.floor(Math.random() * localNPCs.length);
      while (idx2 === idx1) {
        idx2 = Math.floor(Math.random() * localNPCs.length);
      }
      
      const npc1 = localNPCs[idx1];
      const npc2 = localNPCs[idx2];
      
      const updatedNPCs = updateNPCRelationship(npc1, npc2);
      
      for (let i = 0; i < resultNPCs.length; i++) {
        if (resultNPCs[i].id === npc1.id) resultNPCs[i] = updatedNPCs[0];
        if (resultNPCs[i].id === npc2.id) resultNPCs[i] = updatedNPCs[1];
      }
    }
  }
  
  return resultNPCs;
}

function updateNPCRelationship(npc1: NPC, npc2: NPC): [NPC, NPC] {
  const newNpc1 = { ...npc1 };
  const newNpc2 = { ...npc2 };
  
  let compatibility = 0.5;
  
  if (npc1.traits.kind > 60 && npc2.traits.kind > 60) compatibility += 0.2;
  if (npc1.traits.social > 50 && npc2.traits.social > 50) compatibility += 0.15;
  if (npc1.traits.ambitious > 70 && npc2.traits.ambitious > 70) compatibility -= 0.1;
  
  const relationshipChange = (compatibility - 0.5) * 5;
  const current1 = newNpc1.relationships[npc2.id] || { trust: 0, type: 'neutral' as const };
  const current2 = newNpc2.relationships[npc1.id] || { trust: 0, type: 'neutral' as const };
  const newTrust1 = Math.max(-100, Math.min(100, current1.trust + relationshipChange));
  const newTrust2 = Math.max(-100, Math.min(100, current2.trust + relationshipChange));
  
  newNpc1.relationships[npc2.id] = { trust: newTrust1, type: newTrust1 >= 30 ? 'friend' : newTrust1 <= -30 ? 'rival' : 'neutral' };
  newNpc2.relationships[npc1.id] = { trust: newTrust2, type: newTrust2 >= 30 ? 'friend' : newTrust2 <= -30 ? 'rival' : 'neutral' };
  
  return [newNpc1, newNpc2];
}

export function getPlayerNPCCachedRelation(playerId: string, npc: NPC): number {
  return (npc.relationships[playerId] || { trust: 0, type: 'neutral' }).trust;
}

export function updateNPCHostility(npc: NPC, playerId: string, change: number): NPC {
  const currentRelation = npc.relationships[playerId] || { trust: 0, type: 'neutral' as const };
  const newTrust = Math.max(-100, Math.min(100, currentRelation.trust + change));
  
  return {
    ...npc,
    relationships: {
      ...npc.relationships,
      [playerId]: { trust: newTrust, type: newTrust >= 30 ? 'friend' : newTrust <= -30 ? 'rival' : 'neutral' },
    },
  };
}

export function generateNPCGift(npc: NPC, karmaForPlayer: number): {
  hasGift: boolean;
  giftType: string;
  giftValue: number;
} {
  const baseChance = 0.1;
  const karmaBonus = Math.max(0, karmaForPlayer) * 0.002;
  const personalityBonus = npc.traits.kind > 70 ? 0.15 : 0;
  
  const totalChance = baseChance + karmaBonus + personalityBonus;
  
  if (Math.random() < totalChance) {
    const giftTypes = [
      { type: 'cultivation', name: '修为', value: 50 + npc.currentRealm * 20 },
      { type: 'gold', name: '灵石', value: 20 + npc.currentRealm * 10 },
      { type: 'item', name: '小礼品', value: 1 },
    ];
    
    const gift = giftTypes[Math.floor(Math.random() * giftTypes.length)];
    return { hasGift: true, giftType: gift.type, giftValue: gift.value };
  }
  
  return { hasGift: false, giftType: '', giftValue: 0 };
}

export function getNPCBehaviorTowardsPlayer(npc: NPC, playerId: string): 'friendly' | 'neutral' | 'hostile' {
  const relation = npc.relationships[playerId] || { trust: 0, type: 'neutral' as const };
  
  if (relation.trust >= 30) return 'friendly';
  if (relation.trust <= -30) return 'hostile';
  return 'neutral';
}

export function getNPCDialogue(npc: NPC, playerId: string, context: string): string {
  const behavior = getNPCBehaviorTowardsPlayer(npc, playerId);
  const relation = npc.relationships[playerId] || { trust: 0, type: 'neutral' as const };
  
  if (behavior === 'hostile') {
    return `哼，上次的账还没算清呢！`;
  }
  
  if (behavior === 'friendly' && relation.trust >= 60) {
    const friendlyDialogues = [
      `道友好久不见，近来可好？`,
      `上次的事我还记得，改日定当报答。`,
      `你我虽非同道，但这份情谊我记在心里。`,
    ];
    return friendlyDialogues[Math.floor(Math.random() * friendlyDialogues.length)];
  }
  
  if (context === 'breakthrough') {
    return `听闻道友即将突破，恭喜恭喜！`;
  }
  
  if (context === 'hunt') {
    return `前面山上有妖兽出没，道友可要小心。`;
  }
  
  const neutralDialogues = [
    `道友也是来此修炼的吗？`,
    `最近灵气似乎有些异常...`,
    `各人有各人的缘法，不必强求。`,
  ];
  return neutralDialogues[Math.floor(Math.random() * neutralDialogues.length)];
}