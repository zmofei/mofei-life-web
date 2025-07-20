"use client"

import { useState } from 'react';
import { trackEvent } from '@/lib/gtag';
import SPALink from '@/components/Common/SPALink';
import MasonryCard from './MasonryCard';
import TechCard from './TechCard';

interface BlogItem {
  _id: string;
  title: string;
  content: string;
  date: string;
  processedCover?: string;
  fallbackCover?: string;
  processedTitle?: { en?: string; zh?: string };
  processedIntroduction?: { en?: string; zh?: string };
  introduction?: string;
  tags?: Array<{ id: number; name: string; color?: string }>;
  pubtime: string;
  isTechArticle?: boolean;
  voice_commentary?: string;
}

interface MasonryLayoutProps {
  blogList: BlogItem[];
  lang: 'zh' | 'en';
}

export default function MasonryLayout({ blogList, lang }: MasonryLayoutProps) {
  const [clickedCard, setClickedCard] = useState<string | null>(null);

  const handleCardClick = (blog: BlogItem) => {
    // GA跟踪博客卡片点击
    trackEvent.navClick('Blog Card Click', `${blog._id}: ${blog.title}`);
    
    setClickedCard(blog._id);
    // Clear the clicked state after a short delay
    setTimeout(() => {
      setClickedCard(null);
    }, 150);
  };

  return (
    <div className="mt-8 md:mt-16 container max-w-[2000px] m-auto px-5 md:px-10">
      {/* 网格布局 - 自适应高度 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 auto-rows-fr">
        {blogList.map((blog, index) => {
          const isClicked = clickedCard === blog._id;
          
          return (
            <div key={blog._id} className="h-full">
              <SPALink 
                href={`/${lang}/blog/article/${blog._id}`} 
                className={`block group cursor-pointer transition-opacity duration-150 h-full ${
                  isClicked ? 'opacity-70' : 'hover:opacity-90'
                }`}
                onClick={() => handleCardClick(blog)}
              >
                {blog.isTechArticle ? (
                  <TechCard blog={blog} index={index} />
                ) : (
                  <MasonryCard blog={blog} index={index} />
                )}
              </SPALink>
            </div>
          );
        })}
      </div>
      
      {/* 样式优化 */}
      <style jsx>{`
        /* 确保网格布局在移动端正常工作 */
        @media (max-width: 768px) {
          .grid-cols-1 {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
}