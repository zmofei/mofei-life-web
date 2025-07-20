"use client"

import React, { ReactNode, useState, useEffect } from 'react';
import { useAppRouter } from '@/components/Context/RouterContext';
import { usePathname } from 'next/navigation';

interface SPATransitionProps {
  children: ReactNode;
}

export default function SPATransition({ children }: SPATransitionProps) {
  const { isNavigating } = useAppRouter();
  const pathname = usePathname();
  const [currentContent, setCurrentContent] = useState(children);

  useEffect(() => {
    if (isNavigating) {
      // 开始导航时直接更新内容，不做淡出效果
      setCurrentContent(children);
    } else {
      // 导航完成时确保内容已更新
      setCurrentContent(children);
    }
  }, [isNavigating, children]);

  // 监听路径变化，确保内容同步
  useEffect(() => {
    setCurrentContent(children);
  }, [pathname, children]);

  return (
    <div className="spa-transition-container">
      {/* 增强的加载指示器 */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
          {/* 更明显的进度条 */}
          <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-white/70 to-white/30 animate-[slide_1s_ease-in-out_infinite]"></div>
          </div>
          
          {/* 额外的视觉反馈 - 右上角加载指示 */}
          <div className="fixed top-4 right-4 z-50">
            <div className="bg-black/40 backdrop-blur-sm rounded-full p-2 shadow-lg border border-white/20">
              <div className="w-4 h-4 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      )}
      
      {/* 页面内容 */}
      <div>
        {currentContent}
      </div>

      <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(200%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </div>
  );
}