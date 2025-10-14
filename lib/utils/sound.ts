import { Howl } from 'howler';

/**
 * 音效管理器
 */
class SoundManager {
  private sounds: Map<string, Howl> = new Map();
  private muted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initSounds();
    }
  }

  private initSounds() {
    // 移动音效
    this.sounds.set(
      'move',
      new Howl({
        src: ['/sounds/move.mp3'],
        volume: 0.3,
        preload: true,
      })
    );

    // 胜利音效
    this.sounds.set(
      'win',
      new Howl({
        src: ['/sounds/win.mp3'],
        volume: 0.5,
        preload: true,
      })
    );

    // 非法移动音效
    this.sounds.set(
      'invalid',
      new Howl({
        src: ['/sounds/invalid.mp3'],
        volume: 0.2,
        preload: true,
      })
    );
  }

  play(soundName: string) {
    if (this.muted) return;

    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.play();
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted;
  }

  isMuted(): boolean {
    return this.muted;
  }
}

// 单例实例
export const soundManager = new SoundManager();

// 便捷方法
export function playSound(soundName: 'move' | 'win' | 'invalid') {
  soundManager.play(soundName);
}

export function setMuted(muted: boolean) {
  soundManager.setMuted(muted);
}

