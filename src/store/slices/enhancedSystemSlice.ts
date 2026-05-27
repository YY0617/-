import { StateCreator } from 'zustand';
import type { FullStore } from './types';

const SENSITIVE_WORDS = [
  '敏感词1',
  '敏感词2',
];

export interface EnhancedSystemSlice {
  equipmentEnhancement: {
    [itemId: string]: {
      level: number;
      exp: number;
      maxLevel: number;
    };
  };

  activeSetBonus: string[];

  analytics: {
    sessionStart: number;
    actions: {
      [actionType: string]: number;
    };
    featureUsage: {
      [feature: string]: number;
    };
  };

  enhanceEquipment: (itemId: string) => { success: boolean; newLevel: number };

  filterText: (text: string) => string;
  isTextClean: (text: string) => boolean;

  trackAction: (actionType: string) => void;
  trackFeatureUsage: (feature: string) => void;
  getPlayTime: () => number;
}

export const createEnhancedSystemSlice: StateCreator<FullStore, [], [], EnhancedSystemSlice> = (set, get) => ({
  equipmentEnhancement: {},

  activeSetBonus: [],

  analytics: {
    sessionStart: Date.now(),
    actions: {},
    featureUsage: {},
  },

  enhanceEquipment: (itemId: string) => {
    const s = get();
    const current = s.equipmentEnhancement[itemId] || { level: 0, exp: 0, maxLevel: 10 };

    const successChance = Math.max(0.3, 1 - current.level * 0.08);
    const success = Math.random() < successChance;

    if (success && current.level < current.maxLevel) {
      const newLevel = current.level + 1;
      set((state) => ({
        equipmentEnhancement: {
          ...state.equipmentEnhancement,
          [itemId]: { ...current, level: newLevel, exp: 0 },
        }
      }));
      return { success: true, newLevel };
    }

    set((state) => ({
      equipmentEnhancement: {
        ...state.equipmentEnhancement,
        [itemId]: { ...current, exp: current.exp + 10 },
      }
    }));

    return { success: false, newLevel: current.level };
  },

  filterText: (text: string) => {
    let filtered = text;
    SENSITIVE_WORDS.forEach(word => {
      const regex = new RegExp(word, 'gi');
      filtered = filtered.replace(regex, '*'.repeat(word.length));
    });
    return filtered;
  },

  isTextClean: (text: string) => {
    return !SENSITIVE_WORDS.some(word =>
      text.toLowerCase().includes(word.toLowerCase())
    );
  },

  trackAction: (actionType: string) => set((state) => ({
    analytics: {
      ...state.analytics,
      actions: {
        ...state.analytics.actions,
        [actionType]: (state.analytics.actions[actionType] || 0) + 1,
      }
    }
  })),

  trackFeatureUsage: (feature: string) => set((state) => ({
    analytics: {
      ...state.analytics,
      featureUsage: {
        ...state.analytics.featureUsage,
        [feature]: (state.analytics.featureUsage[feature] || 0) + 1,
      }
    }
  })),

  getPlayTime: () => {
    return Math.floor((Date.now() - get().analytics.sessionStart) / 1000);
  },
});