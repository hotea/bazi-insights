/**
 * Zustand 全局状态管理
 */

import { create } from 'zustand';
import type { BaZiInput, BaZiResult, UserPreferences } from '../types';
import { calculateBaZi } from '../core';

interface BaZiStore {
  /** 用户输入 */
  input: BaZiInput;
  /** 计算结果 */
  result: BaZiResult | null;
  /** 用户偏好 */
  preferences: UserPreferences;

  /** 更新输入并重新计算 */
  setInput: (input: Partial<BaZiInput>) => void;
  /** 重新执行计算 */
  calculate: () => void;
  /** 更新偏好 */
  setPreferences: (prefs: Partial<UserPreferences>) => void;
}

const DEFAULT_INPUT: BaZiInput = {
  dateType: 'solar',
  year: 2024,
  month: 1,
  day: 1,
  hour: 12,
  minute: 0,
  timeType: 'standard',
  gender: 'male',
  longitude: 120.0,
  earlyRatSplit: true,
};

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  locale: 'zh',
  earlyRatSplit: true,
  defaultLongitude: 120.0,
};

export const useBaZiStore = create<BaZiStore>((set, get) => ({
  input: DEFAULT_INPUT,
  result: null,
  preferences: DEFAULT_PREFERENCES,

  setInput: (newInput) => {
    set((state) => ({
      input: { ...state.input, ...newInput },
    }));
    get().calculate();
  },

  calculate: () => {
    const { input } = get();
    try {
      const result = calculateBaZi(input);
      set({ result });
    } catch (error) {
      console.error('Calculation failed:', error);
    }
  },

  setPreferences: (newPrefs) => {
    set((state) => ({
      preferences: { ...state.preferences, ...newPrefs },
    }));
  },
}));
