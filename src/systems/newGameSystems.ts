import { SPIRIT_TREASURES, SpiritTreasure } from '../data/spiritTreasures';
import { SECRET_REALMS, SecretRealm } from '../data/secretRealms';
import { RANDOM_EVENTS, RandomEvent } from '../data/randomEvents';

export interface SecretRealmProgress {
  realmId: string;
  currentLevel: number;
  completed: boolean;
  timesCompleted: number;
  highestLevelReached: number;
  fragmentsCollected: number;
  lastVisitTime: number;
}

export interface SpiritTreasureInventory {
  treasureId: string;
  equipped: boolean;
  slot?: 'active' | 'passive';
  level: number;
}

export interface EventHistory {
  eventId: string;
  triggeredAt: number;
  choiceMade: number;
  outcome: 'success' | 'failure';
}

export interface GameStateExtensions {
  secretRealms: SecretRealmProgress[];
  spiritTreasures: SpiritTreasureInventory[];
  treasureFragments: Record<string, number>;
  eventHistory: EventHistory[];
  currentSecretRealm: string | null;
  currentRandomEvent: RandomEvent | null;
  realmStones: number;
  totalEventsTriggered: number;
  weeklyRealmRuns: Record<string, number>;
  weeklyRealmResetTime: number;
}

export function getInitialSecretRealmState(): SecretRealmProgress[] {
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

export function getSecretRealm(realmId: string): SecretRealm | undefined {
  return SECRET_REALMS.find(r => r.id === realmId);
}

export function canAccessRealm(realm: SecretRealm, playerRealm: number): boolean {
  return playerRealm >= realm.reqRealm;
}

export function getRealmRewards(realm: SecretRealm, completionLevel: number): {
  gold: number;
  exp: number;
  realmStones: number;
  fragments: number;
} {
  const baseGold = realm.rewards.gold[0] + Math.random() * (realm.rewards.gold[1] - realm.rewards.gold[0]);
  const baseExp = realm.rewards.exp[0] + Math.random() * (realm.rewards.exp[1] - realm.rewards.exp[0]);
  const baseStones = realm.rewards.realmStones[0] + Math.floor(Math.random() * (realm.rewards.realmStones[1] - realm.rewards.realmStones[0] + 1));
  const fragments = realm.rewards.treasureFragments ? 
    Math.floor(Math.random() * (realm.rewards.treasureFragments[1] - realm.rewards.treasureFragments[0] + 1)) + realm.rewards.treasureFragments[0] : 0;
  
  const completionBonus = Math.max(0, completionLevel * 0.2);
  
  return {
    gold: Math.floor(baseGold * (1 + completionBonus)),
    exp: Math.floor(baseExp * (1 + completionBonus)),
    realmStones: Math.floor(baseStones * (1 + completionBonus / 2)),
    fragments: fragments,
  };
}

export function getSpiritTreasure(treasureId: string): SpiritTreasure | undefined {
  return SPIRIT_TREASURES.find(t => t.id === treasureId);
}

export function getRandomEventByScene(scene: 'cultivation' | 'battle' | 'explore' | 'rest' | 'shop'): RandomEvent | undefined {
  const events = RANDOM_EVENTS.filter(e => e.triggerScene === scene);
  if (events.length === 0) return undefined;
  return events[Math.floor(Math.random() * events.length)];
}

export function shouldTriggerEvent(scene: 'cultivation' | 'battle' | 'explore' | 'rest' | 'shop', lastTriggered: number): boolean {
  const now = Date.now();
  if (now - lastTriggered < 60000) return false;
  
  const baseChance = 0.2;
  const sceneMultiplier = scene === 'explore' ? 1.5 : 1;
  const timeMultiplier = (now - lastTriggered) / 180000;
  
  return Math.random() < Math.min(0.6, baseChance * sceneMultiplier * timeMultiplier);
}
