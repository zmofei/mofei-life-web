"use client"
import Image from 'next/image';
import { useState, useCallback, useEffect, useRef } from 'react';
import { imagePreloader } from '@/utils/imagePreloader';
import { shouldUseUnoptimized, getImageFallbackProps } from '@/utils/imageConfig';
import { smartBlurDataURL } from '@/utils/blurDataURL';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  quality?: number;
  onClick?: () => void;
  loading?: 'lazy' | 'eager';
  unoptimized?: boolean;
  style?: React.CSSProperties;
  preload?: boolean;
  preloadPriority?: 'high' | 'medium' | 'low';
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes,
  placeholder = 'empty',
  blurDataURL,
  quality = 75,
  onClick,
  loading = 'lazy',
  unoptimized = false,
  style,
  preload = false,
  preloadPriority = 'medium',
}: OptimizedImageProps) {
  // 智能判断是否需要unoptimized
  const finalUnoptimized = shouldUseUnoptimized(src, unoptimized);
  const fallbackProps = getImageFallbackProps(src);
  
  // 合并fallback属性
  const finalQuality = quality || fallbackProps.quality;
  const finalLoading = loading || fallbackProps.loading;
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setIsPreloaded] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback((error?: unknown) => {
    console.warn(`Image load failed: ${src}`, error);
    setIsLoading(false);
    setHasError(true);
  }, [src]);

  // 预加载处理
  useEffect(() => {
    if (preload && containerRef.current) {
      // 立即预加载高优先级图片
      if (preloadPriority === 'high' || priority) {
        imagePreloader.preload(src).then((success) => {
          setIsPreloaded(success);
        });
      } else {
        // 其他优先级使用交集观察器
        imagePreloader.observe(containerRef.current, src);
      }
    }

    return () => {
      // 在清理函数中存储current值以避免React警告
      const current = containerRef.current;
      if (current) {
        imagePreloader.unobserve(current);
      }
    };
  }, [src, preload, preloadPriority, priority]);

  // 智能选择合适的模糊占位符
  const defaultBlurDataURL = blurDataURL || smartBlurDataURL(src, alt);

  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
        style={fill ? undefined : { width, height }}
        onClick={onClick}
        title={`Failed to load image: ${alt}`}
      >
        <div className="flex flex-col items-center gap-1">
          <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          {width && width > 100 && (
            <span className="text-xs text-gray-500 text-center px-1">
              {alt || 'Image'}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className}`} onClick={onClick}>
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"
          style={fill ? undefined : { width, height }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={finalQuality}
        sizes={sizes}
        placeholder={placeholder}
        blurDataURL={defaultBlurDataURL}
        loading={finalLoading}
        unoptimized={finalUnoptimized}
        className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-150 ${className}`}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          objectFit: 'cover',
          ...style,
        }}
      />
    </div>
  );
}