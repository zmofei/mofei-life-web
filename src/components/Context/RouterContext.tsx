"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface RouterContextType {
  navigate: (path: string) => void;
  currentPath: string;
  isNavigating: boolean;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

interface RouterProviderProps {
  children: ReactNode;
}

export function RouterProvider({ children }: RouterProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState(pathname);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // 当路径真正改变时，停止导航状态
    if (pathname !== currentPath) {
      setCurrentPath(pathname);
      // 给一点延迟确保用户能看到加载动画
      setTimeout(() => {
        setIsNavigating(false);
      }, 500);
    }
  }, [pathname, currentPath]);

  const navigate = async (path: string) => {
    if (path === currentPath) return;
    
    setIsNavigating(true);
    
    try {
      // 使用 Next.js router 进行客户端导航
      router.push(path);
    } catch (error) {
      console.error('Navigation error:', error);
      setIsNavigating(false);
    }
  };

  return (
    <RouterContext.Provider value={{ navigate, currentPath, isNavigating }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useAppRouter() {
  const context = useContext(RouterContext);
  if (context === undefined) {
    throw new Error('useAppRouter must be used within a RouterProvider');
  }
  return context;
}