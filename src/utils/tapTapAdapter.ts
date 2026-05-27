/**
 * TapTap小游戏平台适配层
 * 统一处理浏览器和TapTap小游戏环境的差异
 */

import { isTapTapEnv as sdkIsTapTapEnv } from './tapTapSDK';

export function isTapTapEnv(): boolean {
  return sdkIsTapTapEnv();
}

export class TapTapStorage {
  private static memoryStorage: Map<string, string> = new Map();

  static setItem(key: string, value: string): void {
    try {
      if (sdkIsTapTapEnv()) {
        const tap = (window as any).tap;
        if (tap && typeof tap.setStorageSync === 'function') {
          tap.setStorageSync({ key, data: value });
          return;
        }
        if (tap && typeof tap.setStorage === 'function') {
          tap.setStorage({ key, data: value });
          return;
        }
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value);
      } else {
        this.memoryStorage.set(key, value);
      }
    } catch (e) {
      console.warn('[TapTapStorage] setItem failed, fallback to memory:', e);
      this.memoryStorage.set(key, value);
    }
  }

  static getItem(key: string): string | null {
    try {
      if (sdkIsTapTapEnv()) {
        const tap = (window as any).tap;
        if (tap && typeof tap.getStorageSync === 'function') {
          const res = tap.getStorageSync(key);
          if (res && res.data !== undefined) {
            return String(res.data);
          }
          return res ? String(res) : null;
        }
        if (tap && typeof tap.getStorage === 'function') {
          const res = tap.getStorage({ key });
          if (res && res.data !== undefined) {
            return String(res.data);
          }
        }
      }
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
      return this.memoryStorage.get(key) || null;
    } catch (e) {
      console.warn('[TapTapStorage] getItem failed, fallback to memory:', e);
      return this.memoryStorage.get(key) || null;
    }
  }

  static removeItem(key: string): void {
    try {
      if (sdkIsTapTapEnv()) {
        const tap = (window as any).tap;
        if (tap && typeof tap.removeStorageSync === 'function') {
          tap.removeStorageSync(key);
          return;
        }
        if (tap && typeof tap.removeStorage === 'function') {
          tap.removeStorage({ key });
          return;
        }
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
      } else {
        this.memoryStorage.delete(key);
      }
    } catch (e) {
      console.warn('[TapTapStorage] removeItem failed:', e);
      this.memoryStorage.delete(key);
    }
  }
}

export interface TouchPoint {
  x: number;
  y: number;
  id: number;
}

export interface TouchHandler {
  onTouchStart?: (points: TouchPoint[]) => void;
  onTouchMove?: (points: TouchPoint[]) => void;
  onTouchEnd?: (points: TouchPoint[]) => void;
}

export function setupGlobalTouchHandlers(handler: TouchHandler): () => void {
  if (sdkIsTapTapEnv()) {
    const tap = (window as any).tap;
    tap.onTouchStart((res: any) => {
      if (handler.onTouchStart && res.touches) {
        const points = res.touches.map((t: any) => ({
          x: t.clientX,
          y: t.clientY,
          id: t.identifier,
        }));
        handler.onTouchStart(points);
      }
    });

    tap.onTouchMove((res: any) => {
      if (handler.onTouchMove && res.touches) {
        const points = res.touches.map((t: any) => ({
          x: t.clientX,
          y: t.clientY,
          id: t.identifier,
        }));
        handler.onTouchMove(points);
      }
    });

    tap.onTouchEnd((res: any) => {
      if (handler.onTouchEnd && res.touches) {
        const points = res.touches.map((t: any) => ({
          x: t.clientX,
          y: t.clientY,
          id: t.identifier,
        }));
        handler.onTouchEnd(points);
      }
    });

    return () => {};
  }

  const handleTouchStart = (e: TouchEvent) => {
    if (handler.onTouchStart) {
      const points = Array.from(e.touches).map((t) => ({
        x: t.clientX,
        y: t.clientY,
        id: t.identifier,
      }));
      handler.onTouchStart(points);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (handler.onTouchMove) {
      const points = Array.from(e.touches).map((t) => ({
        x: t.clientX,
        y: t.clientY,
        id: t.identifier,
      }));
      handler.onTouchMove(points);
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (handler.onTouchEnd) {
      const points = Array.from(e.changedTouches).map((t) => ({
        x: t.clientX,
        y: t.clientY,
        id: t.identifier,
      }));
      handler.onTouchEnd(points);
    }
  };

  document.addEventListener('touchstart', handleTouchStart, { passive: true });
  document.addEventListener('touchmove', handleTouchMove, { passive: true });
  document.addEventListener('touchend', handleTouchEnd, { passive: true });

  return () => {
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };
}

export const TapTapAdapter = {
  isTapTapEnv,
  storage: TapTapStorage,
  setupGlobalTouchHandlers,
};