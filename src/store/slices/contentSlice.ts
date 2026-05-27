/**
 * contentSlice — content data references (minimal state, mostly data access helpers)
 */
import type { StateCreator } from 'zustand';
import type { FullStore } from './types';

export interface ContentSlice {
  // This slice exists for the slice pattern structure.
}

export const createContentSlice: StateCreator<FullStore, [], [], ContentSlice> = () => ({
  // Content data is imported directly where needed.
});
