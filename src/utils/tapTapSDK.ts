/**
 * TapTap小游戏 SDK 统一封装
 * MiniApp ID: tapmcgrpxwxpctofs9
 * Client ID: hboyjapnc1bmmcthbj
 */

declare const tap: any;

const MINI_APP_ID = 'tapmcgrpxwxpctofs9';
const CLIENT_ID = 'hboyjapnc1bmmcthbj';

let initialized = false;

export function isTapTapEnv(): boolean {
  try {
    return typeof tap !== 'undefined' && tap !== null;
  } catch {
    return false;
  }
}

export interface SDKUserInfo {
  openId?: string;
  nickName?: string;
  avatarUrl?: string;
  gender?: number;
  province?: string;
  city?: string;
}

export function initTapTapSDK(): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      if (!isTapTapEnv()) {
        resolve(false);
        return;
      }
    } catch {
      resolve(false);
      return;
    }

    if (initialized) {
      resolve(true);
      return;
    }

    const TIMEOUT_MS = 3000;
    let resolved = false;

    const timeoutId = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        console.warn('[TapTap SDK] 初始化超时');
        resolve(false);
      }
    }, TIMEOUT_MS);

    try {
      tap.init({
        appId: MINI_APP_ID,
        clientId: CLIENT_ID,
        success: () => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeoutId);
            initialized = true;
            resolve(true);
          }
        },
        fail: (err: any) => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeoutId);
            console.warn('[TapTap SDK] 初始化失败:', err);
            resolve(false);
          }
        },
      });
    } catch (e) {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeoutId);
        console.warn('[TapTap SDK] 初始化异常:', e);
        resolve(false);
      }
    }
  });
}

export function loginTapTap(): Promise<SDKUserInfo | null> {
  return new Promise((resolve) => {
    if (!initialized || !isTapTapEnv()) {
      resolve(null);
      return;
    }

    try {
      tap.login({
        success: (res: any) => {
          if (res.code) {
            tap.getUserInfo({
              success: (userRes: any) => {
                resolve({
                  openId: userRes.userInfo?.openId || '',
                  nickName: userRes.userInfo?.nickName || '',
                  avatarUrl: userRes.userInfo?.avatarUrl || '',
                  gender: userRes.userInfo?.gender,
                  province: userRes.userInfo?.province,
                  city: userRes.userInfo?.city,
                });
              },
              fail: () => {
                resolve({ openId: res.code });
              },
            });
          } else {
            resolve(null);
          }
        },
        fail: () => {
          resolve(null);
        },
      });
    } catch {
      resolve(null);
    }
  });
}

export function shareTapTap(options: { title?: string; imageUrl?: string } = {}): Promise<boolean> {
  return new Promise((resolve) => {
    if (!initialized || !isTapTapEnv()) {
      resolve(false);
      return;
    }

    try {
      tap.shareAppMessage({
        title: options.title || '成帝，等闲之事 - 修仙放置RPG',
        imageUrl: options.imageUrl || '',
        success: () => resolve(true),
        fail: () => resolve(false),
      });
    } catch {
      resolve(false);
    }
  });
}

export function openCustomerService(): void {
  if (!initialized || !isTapTapEnv()) return;

  try {
    tap.openCustomerServiceConversation({
      success: () => console.log('[TapTap SDK] 客服打开成功'),
      fail: () => console.warn('[TapTap SDK] 客服打开失败'),
    });
  } catch { /* ignore */ }
}

export function showToastTapTap(title: string, icon: 'success' | 'error' | 'loading' | 'none' = 'none'): void {
  if (!isTapTapEnv()) return;
  try {
    tap.showToast({ title, icon, duration: 2000 });
  } catch { /* ignore */ }
}

export function getSystemInfoTapTap(): any {
  if (!isTapTapEnv()) return null;
  try {
    return tap.getSystemInfoSync();
  } catch {
    return null;
  }
}

export function vibrateTapTap(): void {
  if (!isTapTapEnv()) return;
  try {
    tap.vibrateShort();
  } catch { /* ignore */ }
}

export const TapTapSDK = {
  init: initTapTapSDK,
  login: loginTapTap,
  share: shareTapTap,
  openCustomerService,
  showToast: showToastTapTap,
  getSystemInfo: getSystemInfoTapTap,
  vibrate: vibrateTapTap,
  isTapTapEnv,
  MINI_APP_ID,
  CLIENT_ID,
};
