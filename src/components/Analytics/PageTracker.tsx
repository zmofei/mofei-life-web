"use client"
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { pageview, trackEvent } from '@/lib/gtag';

export default function PageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    // 发送页面浏览事件
    pageview(url);
    
    // 根据路径类型发送特定事件
    if (pathname.includes('/blog/article/')) {
      const articleId = pathname.split('/').pop() || 'unknown';
      trackEvent.articleView(articleId, document.title);
    } else if (pathname.includes('/blog/')) {
      trackEvent.pageView('Blog List', url);
    } else if (pathname.includes('/message/')) {
      trackEvent.pageView('Message Board', url);
    } else if (pathname.includes('/friends')) {
      trackEvent.pageView('Friends Page', url);
    } else if (pathname === '/' || pathname === '/zh' || pathname === '/en') {
      trackEvent.pageView('Home Page', url);
    }
    
  }, [pathname, searchParams]);

  return null;
}