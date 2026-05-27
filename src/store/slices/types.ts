/**
 * Shared store type — combined from all 6 slices.
 * Each slice file imports this to type-check cross-slice action calls via get().
 */
import type { PlayerSlice } from './playerSlice';
import type { ProgressionSlice } from './progressionSlice';
import type { WorldSlice } from './worldSlice';
import type { ContentSlice } from './contentSlice';
import type { SystemSlice } from './systemSlice';
import type { CompetitionSlice } from './competitionSlice';
import type { EnhancedSystemSlice } from './enhancedSystemSlice';

/** Full store type — all state + all actions from every slice */
export type FullStore = PlayerSlice & ProgressionSlice & WorldSlice & ContentSlice & SystemSlice & CompetitionSlice & EnhancedSystemSlice;
