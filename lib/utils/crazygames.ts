/**
 * CrazyGames SDK 集成工具
 * 文档: https://docs.crazygames.com/sdk/html5/
 */

// 声明 CrazyGames SDK 全局类型
declare global {
  interface Window {
    CrazyGames?: {
      SDK?: {
        game?: {
          gameplayStart: () => void;
          gameplayStop: () => void;
          happytime: () => void;
          sdkGameLoadingStart: () => void;
          sdkGameLoadingStop: () => void;
        };
        ad?: {
          requestAd: (type: 'midgame' | 'rewarded', callbacks?: {
            adStarted?: () => void;
            adFinished?: () => void;
            adError?: (error: any) => void;
          }) => void;
        };
        banner?: {
          requestResponsiveBanner: (options: any) => void;
          clearBanner: (id: string) => void;
        };
      };
    };
  }
}

class CrazyGamesSDK {
  private sdk: any = null;
  private initialized = false;

  /**
   * 初始化 SDK
   */
  async init(): Promise<boolean> {
    if (this.initialized) {
      console.log('CrazyGames SDK already initialized');
      return true;
    }

    // 检查是否在 CrazyGames 平台
    if (!this.isOnCrazyGames()) {
      console.log('Not on CrazyGames platform, SDK disabled (local development)');
      return false;
    }

    try {
      console.log('Waiting for CrazyGames SDK...');
      // 等待 SDK 加载
      await this.waitForSDK();
      this.sdk = window.CrazyGames?.SDK;
      this.initialized = true;
      console.log('✅ CrazyGames SDK initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize CrazyGames SDK:', error);
      return false;
    }
  }

  /**
   * 检测是否在 CrazyGames 平台
   */
  isOnCrazyGames(): boolean {
    // 本地开发环境
    if (typeof window === 'undefined') return false;
    
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
      return false;
    }
    
    // 检查 referrer 或特定参数
    const referrer = document.referrer.toLowerCase();
    const isCrazyGames = referrer.includes('crazygames.com') || 
                         referrer.includes('crazygames.') ||
                         hostname.includes('crazygames') ||
                         !!window.CrazyGames;
    
    return isCrazyGames;
  }

  /**
   * 等待 SDK 加载
   */
  private waitForSDK(timeout = 5000): Promise<void> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const checkSDK = () => {
        if (window.CrazyGames?.SDK) {
          resolve();
        } else if (Date.now() - startTime > timeout) {
          reject(new Error('SDK loading timeout'));
        } else {
          setTimeout(checkSDK, 100);
        }
      };
      
      checkSDK();
    });
  }

  /**
   * 通知游戏开始
   * 必须在游戏实际开始时调用（不是加载时）
   */
  gameplayStart(): void {
    if (!this.initialized || !this.isOnCrazyGames()) {
      return;
    }
    
    try {
      if (this.sdk?.game?.gameplayStart) {
        console.log('CrazyGames: Gameplay started');
        this.sdk.game.gameplayStart();
      }
    } catch (error) {
      console.warn('CrazyGames: Failed to trigger gameplayStart', error);
    }
  }

  /**
   * 通知游戏停止
   * 在显示菜单、暂停或关卡选择时调用
   */
  gameplayStop(): void {
    if (!this.initialized || !this.isOnCrazyGames()) {
      return;
    }
    
    try {
      if (this.sdk?.game?.gameplayStop) {
        console.log('CrazyGames: Gameplay stopped');
        this.sdk.game.gameplayStop();
      }
    } catch (error) {
      console.warn('CrazyGames: Failed to trigger gameplayStop', error);
    }
  }

  /**
   * 通知快乐时刻
   * 在玩家完成关卡、获得高分等时刻调用
   */
  happytime(): void {
    if (!this.initialized || !this.isOnCrazyGames()) {
      console.log('CrazyGames: Happytime skipped (SDK not initialized or not on platform)');
      return;
    }
    
    try {
      if (this.sdk?.game?.happytime) {
        console.log('CrazyGames: Happytime triggered');
        this.sdk.game.happytime();
      }
    } catch (error) {
      console.warn('CrazyGames: Failed to trigger happytime', error);
    }
  }

  /**
   * 游戏加载开始
   */
  gameLoadingStart(): void {
    if (!this.initialized || !this.isOnCrazyGames()) {
      return;
    }
    
    try {
      if (this.sdk?.game?.sdkGameLoadingStart) {
        this.sdk.game.sdkGameLoadingStart();
      }
    } catch (error) {
      console.warn('CrazyGames: Failed to trigger gameLoadingStart', error);
    }
  }

  /**
   * 游戏加载完成
   */
  gameLoadingStop(): void {
    if (!this.initialized || !this.isOnCrazyGames()) {
      return;
    }
    
    try {
      if (this.sdk?.game?.sdkGameLoadingStop) {
        this.sdk.game.sdkGameLoadingStop();
      }
    } catch (error) {
      console.warn('CrazyGames: Failed to trigger gameLoadingStop', error);
    }
  }

  /**
   * 请求中插广告
   */
  async requestMidgameAd(): Promise<boolean> {
    if (!this.sdk?.ad?.requestAd) return false;

    return new Promise((resolve) => {
      this.sdk.ad.requestAd('midgame', {
        adStarted: () => {
          console.log('Midgame ad started');
          // 暂停游戏音效等
        },
        adFinished: () => {
          console.log('Midgame ad finished');
          resolve(true);
        },
        adError: (error: any) => {
          console.error('Midgame ad error:', error);
          resolve(false);
        },
      });
    });
  }

  /**
   * 请求激励广告
   */
  async requestRewardedAd(): Promise<boolean> {
    if (!this.sdk?.ad?.requestAd) return false;

    return new Promise((resolve) => {
      this.sdk.ad.requestAd('rewarded', {
        adStarted: () => {
          console.log('Rewarded ad started');
        },
        adFinished: () => {
          console.log('Rewarded ad finished');
          resolve(true);
        },
        adError: (error: any) => {
          console.error('Rewarded ad error:', error);
          resolve(false);
        },
      });
    });
  }
}

// 导出单例
export const crazyGamesSDK = new CrazyGamesSDK();

