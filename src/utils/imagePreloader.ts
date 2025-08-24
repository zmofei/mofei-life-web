// 图片预加载管理器
class ImagePreloader {
  private cache = new Set<string>();
  private preloadQueue: string[] = [];
  private isProcessing = false;
  private observer: IntersectionObserver | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initIntersectionObserver();
    }
  }

  private initIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const src = entry.target.getAttribute('data-preload-src');
            if (src) {
              this.preload(src);
            }
          }
        });
      },
      {
        rootMargin: '200px 0px', // 提前200px预加载
        threshold: 0.1
      }
    );
  }

  // 预加载单张图片
  async preload(src: string): Promise<boolean> {
    if (this.cache.has(src)) {
      return true;
    }

    return new Promise((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        this.cache.add(src);
        resolve(true);
      };
      
      img.onerror = () => {
        console.warn(`Failed to preload image: ${src}`);
        resolve(false);
      };

      // 设置超时
      setTimeout(() => {
        if (!this.cache.has(src)) {
          resolve(false);
        }
      }, 10000); // 10秒超时

      img.src = src;
    });
  }

  // 批量预加载
  async preloadBatch(urls: string[], maxConcurrent: number = 3): Promise<void> {
    const batches = [];
    for (let i = 0; i < urls.length; i += maxConcurrent) {
      batches.push(urls.slice(i, i + maxConcurrent));
    }

    for (const batch of batches) {
      const promises = batch.map(url => this.preload(url));
      await Promise.allSettled(promises);
    }
  }

  // 智能预加载策略
  smartPreload(images: Array<{ src: string; priority: 'high' | 'medium' | 'low' }>) {
    const highPriority = images.filter(img => img.priority === 'high').map(img => img.src);
    const mediumPriority = images.filter(img => img.priority === 'medium').map(img => img.src);
    const lowPriority = images.filter(img => img.priority === 'low').map(img => img.src);

    // 立即预加载高优先级图片
    if (highPriority.length > 0) {
      this.preloadBatch(highPriority, 5);
    }

    // 延迟预加载中优先级图片
    if (mediumPriority.length > 0) {
      setTimeout(() => {
        this.preloadBatch(mediumPriority, 3);
      }, 1000);
    }

    // 更晚预加载低优先级图片
    if (lowPriority.length > 0) {
      setTimeout(() => {
        this.preloadBatch(lowPriority, 2);
      }, 3000);
    }
  }

  // 观察元素进行懒预加载
  observe(element: Element, src: string) {
    if (this.observer) {
      element.setAttribute('data-preload-src', src);
      this.observer.observe(element);
    }
  }

  // 取消观察
  unobserve(element: Element) {
    if (this.observer) {
      this.observer.unobserve(element);
    }
  }

  // 检查图片是否已缓存
  isCached(src: string): boolean {
    return this.cache.has(src);
  }

  // 获取缓存统计
  getCacheStats() {
    return {
      cacheSize: this.cache.size,
      cachedUrls: Array.from(this.cache)
    };
  }

  // 清理缓存
  clearCache() {
    this.cache.clear();
  }

  // 销毁
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.clearCache();
  }
}

// 单例实例
export const imagePreloader = new ImagePreloader();

// 工具函数：生成响应式图片sizes属性
export function generateSizes(config: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
  fallback?: string;
}): string {
  const {
    mobile = '100vw',
    tablet = '50vw', 
    desktop = '33vw',
    fallback = '25vw'
  } = config;

  return `(max-width: 768px) ${mobile}, (max-width: 1200px) ${tablet}, (max-width: 1600px) ${desktop}, ${fallback}`;
}

// 工具函数：根据图片位置决定加载策略
export function getImageLoadingStrategy(index: number, total: number) {
  const isAboveFold = index < 4;
  // const isVisible = index < 8; // 暂未使用
  
  return {
    priority: isAboveFold,
    loading: (isAboveFold ? 'eager' : 'lazy') as 'eager' | 'lazy',
    quality: index === 0 ? 95 : isAboveFold ? 90 : 80,
    placeholder: (index < 2 ? 'blur' : 'empty') as 'blur' | 'empty',
    sizes: generateSizes({
      mobile: '100vw',
      tablet: total <= 2 ? '50vw' : total <= 4 ? '50vw' : '33vw',
      desktop: total <= 2 ? '50vw' : total <= 4 ? '33vw' : '25vw',
      fallback: '25vw'
    })
  };
}

export default imagePreloader;