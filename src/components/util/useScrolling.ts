"use client"

import { useState, useEffect, useRef } from 'react';

export function useScrolling(delay: number = 150) {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // 立即设置为滚动状态
      setIsScrolling(true);
      
      // 清除之前的定时器
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
      
      // 延迟设置为非滚动状态
      scrollTimer.current = setTimeout(() => {
        setIsScrolling(false);
      }, delay);
    };

    // 添加滚动监听
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // 清理函数
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, [delay]);

  return isScrolling;
}