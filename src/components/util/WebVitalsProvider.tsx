"use client"
import { useEffect } from 'react';
import { initWebVitals, generatePerformanceReport } from '@/lib/web-vitals';

interface WebVitalsProviderProps {
  children: React.ReactNode;
  enableReporting?: boolean;
}

export default function WebVitalsProvider({ 
  children, 
  enableReporting = process.env.NODE_ENV === 'development' 
}: WebVitalsProviderProps) {
  useEffect(() => {
    if (!enableReporting) return;

    // 初始化 Web Vitals 监控
    initWebVitals();

    // 页面完全加载后生成性能报告
    const handleLoad = () => {
      setTimeout(() => {
        generatePerformanceReport();
      }, 1000); // 延迟1秒确保所有资源加载完成
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad, { once: true });
    }

    // 页面隐藏时收集最终指标
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // 最后一次收集指标
        console.log('📊 Final Web Vitals collection on page hide');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('load', handleLoad);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enableReporting]);

  return <>{children}</>;
}