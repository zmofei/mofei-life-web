"use client"
import { useState, useEffect, useCallback } from 'react';
import OptimizedImage from './OptimizedImage';

interface BlogImageOptimizerProps {
  images: { src: string; alt?: string }[];
  priority?: boolean;
  className?: string;
}

// 图片预加载缓存
const imageCache = new Set<string>();

// 预加载图片函数
const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (imageCache.has(src)) {
      resolve();
      return;
    }

    const img = new Image();
    img.onload = () => {
      imageCache.add(src);
      resolve();
    };
    img.onerror = reject;
    img.src = src;
  });
};

export default function BlogImageOptimizer({ images, priority = false }: BlogImageOptimizerProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [, setIntersectedImages] = useState<Set<string>>(new Set());

  // 批量预加载下一批图片
  const preloadNextBatch = useCallback(async (startIndex: number, batchSize: number = 3) => {
    const batch = images.slice(startIndex, startIndex + batchSize);
    const promises = batch.map(img => preloadImage(img.src));
    
    try {
      await Promise.allSettled(promises);
      const newLoaded = new Set(loadedImages);
      batch.forEach(img => newLoaded.add(img.src));
      setLoadedImages(newLoaded);
    } catch (error) {
      console.warn('Image preload failed:', error);
    }
  }, [images, loadedImages]);

  // 交集观察器 - 当图片进入视口时预加载下一批
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const src = entry.target.getAttribute('data-src');
            if (src) {
              setIntersectedImages(prev => new Set(prev).add(src));
              
              // 预加载下一批图片
              const currentIndex = images.findIndex(img => img.src === src);
              if (currentIndex !== -1 && currentIndex < images.length - 3) {
                preloadNextBatch(currentIndex + 1);
              }
            }
          }
        });
      },
      {
        rootMargin: '50px 0px', // 提前50px开始加载
        threshold: 0.1
      }
    );

    // 观察所有图片容器
    const imageElements = document.querySelectorAll('[data-blog-image]');
    imageElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [images, preloadNextBatch]);

  // 初始预加载前几张图片
  useEffect(() => {
    if (priority && images.length > 0) {
      preloadNextBatch(0, Math.min(3, images.length));
    }
  }, [priority, images, preloadNextBatch]);

  return null; // 这是一个纯逻辑组件，不渲染UI
}

// 智能图片组件 - 根据位置自动决定加载策略
interface SmartImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  index?: number;
  total?: number;
  priority?: boolean;
}

export function SmartImage({
  src,
  alt = '',
  width,
  height,
  className,
  index = 0,
  total = 1,
  priority = false
}: SmartImageProps) {
  // 自动决定加载策略
  const shouldPrioritize = priority || index < 3; // 前3张图片优先加载
  const isAboveFold = index < 2; // 前2张认为是首屏
  
  // 生成适合的sizes属性
  const generateSizes = () => {
    if (width && width <= 100) return `${width}px`;
    if (total <= 2) return '(max-width: 768px) 100vw, 50vw';
    if (total <= 4) return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
    return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw';
  };

  return (
    <div data-blog-image data-src={src}>
      <OptimizedImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={shouldPrioritize}
        loading={shouldPrioritize ? 'eager' : 'lazy'}
        quality={isAboveFold ? 90 : 80} // 首屏图片更高质量
        sizes={generateSizes()}
        placeholder={isAboveFold ? 'blur' : 'empty'} // 首屏图片使用模糊占位
      />
    </div>
  );
}