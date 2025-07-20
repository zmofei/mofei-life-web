// 全局音频管理器
class AudioManager {
    private static instance: AudioManager;
    private currentAudio: HTMLAudioElement | null = null;
    private currentSrc: string = '';

    private constructor() {}

    static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    toggle(src: string): void {
        // 如果是同一个音频源
        if (this.currentSrc === src && this.currentAudio) {
            if (this.currentAudio.paused) {
                // 暂停状态，继续播放
                this.currentAudio.play().catch(error => {
                    console.error('Error playing audio:', error);
                });
            } else {
                // 正在播放，暂停
                this.currentAudio.pause();
            }
        } else {
            // 不同音频源，停止当前播放并播放新的
            this.stop();
            this.currentSrc = src;
            this.currentAudio = new Audio(src);
            this.currentAudio.play().catch(error => {
                console.error('Error playing audio:', error);
            });

            // 监听音频结束事件
            this.currentAudio.addEventListener('ended', () => {
                this.currentAudio = null;
                this.currentSrc = '';
            });
        }
    }

    // 直接播放指定音频，不切换状态
    play(src: string): void {
        if (this.currentSrc === src && this.currentAudio) {
            if (this.currentAudio.paused) {
                this.currentAudio.play().catch(error => {
                    console.error('Error playing audio:', error);
                });
            }
        } else {
            // 不同音频源，停止当前播放并播放新的
            this.stop();
            this.currentSrc = src;
            this.currentAudio = new Audio(src);
            this.currentAudio.play().catch(error => {
                console.error('Error playing audio:', error);
            });

            // 监听音频结束事件
            this.currentAudio.addEventListener('ended', () => {
                this.currentAudio = null;
                this.currentSrc = '';
            });
        }
    }

    // 暂停当前音频
    pause(): void {
        if (this.currentAudio && !this.currentAudio.paused) {
            this.currentAudio.pause();
        }
    }

    stop(): void {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
            this.currentSrc = '';
        }
    }

    isPlaying(src?: string): boolean {
        if (src) {
            return this.currentSrc === src && this.currentAudio !== null && !this.currentAudio.paused;
        }
        return this.currentAudio !== null && !this.currentAudio.paused;
    }

    getCurrentSrc(): string {
        return this.currentSrc;
    }

    getCurrentAudio(): HTMLAudioElement | null {
        return this.currentAudio;
    }

    // 页面卸载时清理音频
    cleanup(): void {
        this.stop();
    }
}

export default AudioManager;