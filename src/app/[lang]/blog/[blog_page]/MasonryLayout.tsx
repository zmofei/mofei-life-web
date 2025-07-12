"use client"

import Link from 'next/link';
import { useState } from 'react';
import { trackEvent } from '@/lib/gtag';
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
      {/* 瀑布流布局 */}
      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 md:gap-8">
        {blogList.map((blog, index) => {
          const isClicked = clickedCard === blog._id;
          
          return (
            <div key={blog._id} className="break-inside-avoid mb-6 md:mb-8">
              <Link 
                href={`/${lang}/blog/article/${blog._id}`} 
                className={`block group cursor-pointer transition-opacity duration-150 ${
                  isClicked ? 'opacity-70' : 'hover:opacity-90'
                }`}
                prefetch={true}
                onClick={() => handleCardClick(blog)}
              >
                {blog.isTechArticle ? (
                  <TechCard blog={blog} index={index} />
                ) : (
                  <MasonryCard blog={blog} index={index} />
                )}
              </Link>
            </div>
          );
        })}
      </div>
      
      {/* 样式优化 */}
      <style jsx>{`
        /* 确保瀑布流在移动端正常工作 */
        @media (max-width: 768px) {
          .columns-1 {
            column-count: 1;
          }
        }
        
        /* 防止卡片被截断 */
        .break-inside-avoid {
          break-inside: avoid;
          page-break-inside: avoid;
          -webkit-column-break-inside: avoid;
        }
      `}</style>
    </div>
  );
}