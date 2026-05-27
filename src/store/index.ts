/**
 * Store index — combines all 6 Zustand slices into a single persisted store.
 * Persist key: "game-store" (unchanged from original).
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { FullStore } from './slices/types';
import { createPlayerSlice } from './slices/playerSlice';
import { createProgressionSlice } from './slices/progressionSlice';
import { createWorldSlice } from './slices/worldSlice';
import { createContentSlice } from './slices/contentSlice';
import { createSystemSlice } from './slices/systemSlice';
import { createCompetitionSlice } from './slices/competitionSlice';
import { createEnhancedSystemSlice } from './slices/enhancedSystemSlice';

export type { FullStore };

export const useGameStore = create<FullStore>()(
  persist(
    (...a) => ({
      ...createPlayerSlice(...a),
      ...createProgressionSlice(...a),
      ...createWorldSlice(...a),
      ...createContentSlice(...a),
      ...createSystemSlice(...a),
      ...createCompetitionSlice(...a),
      ...createEnhancedSystemSlice(...a),
    }),
    { name: 'game-store', version: 3, skipHydration: true }
  )
);

/** Convenience type for the full store shape (state + actions) */
export type GameStoreType = FullStore;
