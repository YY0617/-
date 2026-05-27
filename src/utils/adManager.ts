/**
 * 广告管理器
 * 统一管理广告加载、展示、奖励发放
 * 支持模拟广告（开发测试）和真实广告 SDK（预留接口）
 */

export type AdType = 'rewarded' | 'banner' | 'interstitial';

export interface AdReward {
  type: string;
  amount: number;
  description: string;
}

export interface AdConfig {
  // 真实广告 SDK 配置
  appId?: string;
  rewardedAdUnitId?: string;
  bannerAdUnitId?: string;
  interstitialAdUnitId?: string;
  
  // 是否使用模拟模式（开发测试）
  useMock: boolean;
  
  // 模拟广告的播放时长（毫秒）
  mockAdDuration: number;
}

const DEFAULT_CONFIG: AdConfig = {
  useMock: true,
  mockAdDuration: 3000,
};

class AdManager {
  private config: AdConfig = DEFAULT_CONFIG;
  private isInitialized = false;
  private rewardCallbacks: Map<string, (success: boolean, reward?: AdReward) => void> = new Map();
  private adLoadCallbacks: Map<string, (success: boolean) => void> = new Map();

  /**
   * 初始化广告管理器
   */
  init(config?: Partial<AdConfig>): void {
    if (this.isInitialized) {
      console.warn('AdManager already initialized');
      return;
    }

    this.config = { ...DEFAULT_CONFIG, ...config };
    this.isInitialized = true;
    console.log('AdManager initialized with config:', this.config);

    if (!this.config.useMock) {
      // TODO: 初始化真实广告 SDK
      // this.initRealAdSDK();
    }
  }

  /**
   * 加载激励视频广告
   */
  loadRewardedAd(placementId: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.config.useMock) {
        console.log(`Mock: Loading rewarded ad for placement ${placementId}`);
        setTimeout(() => {
          console.log(`Mock: Rewarded ad loaded for placement ${placementId}`);
          resolve(true);
        }, 500);
      } else {
        // TODO: 调用真实广告 SDK 加载激励视频
        resolve(false);
      }
    });
  }

  /**
   * 展示激励视频广告
   */
  showRewardedAd(placementId: string, reward: AdReward): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.config.useMock) {
        console.log(`Mock: Showing rewarded ad for placement ${placementId}`, reward);
        
        // 模拟广告播放
        setTimeout(() => {
          console.log(`Mock: Rewarded ad completed, granting reward:`, reward);
          resolve(true);
        }, this.config.mockAdDuration);
      } else {
        // TODO: 调用真实广告 SDK 展示激励视频
        resolve(false);
      }
    });
  }

  /**
   * 加载 Banner 广告
   */
  loadBannerAd(placementId: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.config.useMock) {
        console.log(`Mock: Loading banner ad for placement ${placementId}`);
        setTimeout(() => {
          console.log(`Mock: Banner ad loaded for placement ${placementId}`);
          resolve(true);
        }, 300);
      } else {
        // TODO: 调用真实广告 SDK 加载 Banner
        resolve(false);
      }
    });
  }

  /**
   * 展示 Banner 广告
   */
  showBannerAd(placementId: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.config.useMock) {
        console.log(`Mock: Showing banner ad for placement ${placementId}`);
        resolve(true);
      } else {
        // TODO: 调用真实广告 SDK 展示 Banner
        resolve(false);
      }
    });
  }

  /**
   * 隐藏 Banner 广告
   */
  hideBannerAd(placementId: string): void {
    if (this.config.useMock) {
      console.log(`Mock: Hiding banner ad for placement ${placementId}`);
    } else {
      // TODO: 调用真实广告 SDK 隐藏 Banner
    }
  }

  /**
   * 加载插屏广告
   */
  loadInterstitialAd(placementId: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.config.useMock) {
        console.log(`Mock: Loading interstitial ad for placement ${placementId}`);
        setTimeout(() => {
          console.log(`Mock: Interstitial ad loaded for placement ${placementId}`);
          resolve(true);
        }, 400);
      } else {
        // TODO: 调用真实广告 SDK 加载插屏
        resolve(false);
      }
    });
  }

  /**
   * 展示插屏广告
   */
  showInterstitialAd(placementId: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.config.useMock) {
        console.log(`Mock: Showing interstitial ad for placement ${placementId}`);
        setTimeout(() => {
          console.log(`Mock: Interstitial ad closed`);
          resolve(true);
        }, 2000);
      } else {
        // TODO: 调用真实广告 SDK 展示插屏
        resolve(false);
      }
    });
  }

  /**
   * 检查是否可以观看广告（冷却检查）
   */
  canWatchAd(lastWatchTime: number, cooldownMs: number = 30000): boolean {
    return Date.now() - lastWatchTime >= cooldownMs;
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<AdConfig>): void {
    this.config = { ...this.config, ...config };
    console.log('AdManager config updated:', this.config);
  }

  /**
   * 获取当前配置
   */
  getConfig(): AdConfig {
    return { ...this.config };
  }

  /**
   * 重置（用于测试）
   */
  reset(): void {
    this.rewardCallbacks.clear();
    this.adLoadCallbacks.clear();
    this.isInitialized = false;
    this.config = DEFAULT_CONFIG;
  }
}

// 导出单例
export const adManager = new AdManager();
