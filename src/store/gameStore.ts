import { create } from 'zustand';

import type { FullStore } from './slices/types';
import { createPlayerSlice } from './slices/playerSlice';
import { createProgressionSlice } from './slices/progressionSlice';
import { createWorldSlice } from './slices/worldSlice';
import { createContentSlice } from './slices/contentSlice';
import { createSystemSlice } from './slices/systemSlice';
import { createCompetitionSlice } from './slices/competitionSlice';
import { createEnhancedSystemSlice } from './slices/enhancedSystemSlice';
import { TapTapStorage } from '../utils/tapTapAdapter';

export { MONSTERS, MONSTER_MAP, getMonstersByRealm, getCommonMonstersByRealm, getBossByRealm, getMonsterById } from '../data/monsters';
export type { Monster } from '../data/types';
export type { MonsterMechanism } from '../data/types';
export { SHOP_ITEMS, SKILLS as SKILL_SHOP, SKILL_PRICES, PET_TEMPLATES, FORMATIONS, TALENTS } from '../data/itemData';
export { ACHIEVEMENTS } from '../data/achievements';
export { BATTLE_QUOTES } from '../constants/gameConstants';
export { getRealmName, getRealmConfig, getRealmStats, getBreakthroughRate, getRealmCoefficient, getStaminaRegenRate, getStaminaPillRestore, getBreakthroughStaminaRestore, REALM_CONFIGS, WEATHER_EFFECTS, TIME_EFFECTS } from '../data/realmConfig';

export type { FullStore };

let initialState: Partial<FullStore> = {};
export function setInitialState(state: Partial<FullStore>) {
  initialState = state;
}

export const useGameStore = create<FullStore>()(
  (...args) => ({
    ...createPlayerSlice(...args),
    ...createProgressionSlice(...args),
    ...createWorldSlice(...args),
    ...createContentSlice(...args),
    ...createSystemSlice(...args),
    ...createCompetitionSlice(...args),
    ...createEnhancedSystemSlice(...args),
    ...initialState,
  })
);

export type GameStoreType = FullStore;

// ============================================================
// 多存档位系统
// ============================================================
const STORAGE_KEY = 'game-saves';

export interface SaveData {
  id: string;
  slot: number;
  savedAt: number;
  gameState: Partial<FullStore>;
  summary: string;
}

export function getSaves(): SaveData[] {
  try {
    const data = TapTapStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveGame(slot: number, gameState: Partial<FullStore>, summary: string): boolean {
  try {
    const saves = getSaves();
    const newSave: SaveData = {
      id: `${Date.now()}`,
      slot,
      savedAt: Date.now(),
      gameState,
      summary,
    };
    const filtered = saves.filter(s => s.slot !== slot);
    const updated = [...filtered, newSave].sort((a, b) => a.slot - b.slot);
    TapTapStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (e) {
    console.error('Failed to save:', e);
    return false;
  }
}

export function loadSave(slot: number): Partial<FullStore> | null {
  try {
    const saves = getSaves();
    const save = saves.find(s => s.slot === slot);
    if (save) {
      return save.gameState;
    }
    return null;
  } catch (e) {
    console.error('Failed to load:', e);
    return null;
  }
}

export function deleteSave(slot: number): boolean {
  try {
    const saves = getSaves();
    const filtered = saves.filter(s => s.slot !== slot);
    TapTapStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
}

export function getHasSaves(): boolean[] {
  const saves = getSaves();
  return [1, 2, 3].map(slot => !!saves.find(s => s.slot === slot));
}
