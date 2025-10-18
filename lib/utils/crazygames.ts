/**
 * CrazyGames SDK v3 集成工具
 * 文档: https://docs.crazygames.com/sdk/intro/#html5
 */

// 声明 CrazyGames SDK v3 全局类型
declare global {
  interface Window {
    CrazyGames?: {
      SDK?: {
        init: () => Promise<void>;
        environment?: 'crazygames' | 'local' | 'disabled';
        game?: {
          gameplayStart: () => void;
          gameplayStop: () => void;
          happytime: () => void;
          loadingStart: () => void;  // v3 新方法名
          loadingStop: () => void;   // v3 新方法名
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
   * 初始化 SDK (v3 版本)
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
      console.log('Initializing CrazyGames SDK v3...');
      
      // 等待 SDK 脚本加载
      await this.waitForSDK();
      
      // 调用官方的 v3 init 方法
      if (window.CrazyGames?.SDK?.init) {
        await window.CrazyGames.SDK.init();
        this.sdk = window.CrazyGames.SDK;
        this.initialized = true;
        console.log('✅ CrazyGames SDK v3 initialized successfully');
        console.log('Environment:', this.sdk.environment);
        return true;
      } else {
        throw new Error('CrazyGames.SDK.init method not found');
      }
    } catch (error) {
      console.error('❌ Failed to initialize CrazyGames SDK:', error);
      return false;
    }
  }

  /**
   * 检测是否在 CrazyGames 平台
   * v3 SDK 会在 localhost/127.0.0.1 自动设置为 'local' 环境
   */
  isOnCrazyGames(): boolean {
    // 服务端渲染时返回 false
    if (typeof window === 'undefined') return false;
    
    const hostname = window.location.hostname;
    
    // 本地开发环境 - 自动禁用
    // v3 SDK 在 localhost 会显示演示广告，但我们可以选择禁用
    if (hostname === 'localhost' || 
        hostname === '127.0.0.1' || 
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.')) {
      return false;
    }
    
    // 检查是否在 CrazyGames 域名或预览环境
    const isCrazyGamesDomain = hostname.includes('crazygames.com') || 
                                hostname.includes('crazygames.');
    
    // 检查是否有 CrazyGames SDK 对象
    const hasSDK = !!window.CrazyGames;
    
    // 检查 referrer (可能从 CrazyGames 嵌入)
    const referrer = typeof document !== 'undefined' ? document.referrer.toLowerCase() : '';
    const isCrazyGamesReferrer = referrer.includes('crazygames.com') || 
                                  referrer.includes('crazygames.');
    
    return isCrazyGamesDomain || (hasSDK && isCrazyGamesReferrer);
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
   * 获取 SDK 环境
   * @returns 'crazygames' | 'local' | 'disabled' | 'unknown'
   */
  getEnvironment(): string {
    if (!this.initialized) return 'disabled';
    return this.sdk?.environment || 'unknown';
  }

  /**
   * 检查 SDK 是否已初始化
   */
  isInitialized(): boolean {
    return this.initialized;
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
   * 游戏加载开始 (v3: loadingStart)
   */
  gameLoadingStart(): void {
    if (!this.initialized || !this.isOnCrazyGames()) {
      return;
    }
    
    try {
      if (this.sdk?.game?.loadingStart) {
        console.log('CrazyGames: Loading started');
        this.sdk.game.loadingStart();
      }
    } catch (error) {
      console.warn('CrazyGames: Failed to trigger loadingStart', error);
    }
  }

  /**
   * 游戏加载完成 (v3: loadingStop)
   */
  gameLoadingStop(): void {
    if (!this.initialized || !this.isOnCrazyGames()) {
      return;
    }
    
    try {
      if (this.sdk?.game?.loadingStop) {
        console.log('CrazyGames: Loading stopped');
        this.sdk.game.loadingStop();
      }
    } catch (error) {
      console.warn('CrazyGames: Failed to trigger loadingStop', error);
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

