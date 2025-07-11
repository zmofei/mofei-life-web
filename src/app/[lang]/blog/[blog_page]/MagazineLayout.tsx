"use client"

import Link from 'next/link';
import BlogItemBlock from './BlogItemBlock';
import MagazineLargeCard from './MagazineLargeCard';

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
  tags?: Array<{ name: string; color?: string }>;
  pubtime: string;
}

interface MagazineLayoutProps {
  blogList: BlogItem[];
  lang: 'zh' | 'en';
}

export default function MagazineLayout({ blogList, lang }: MagazineLayoutProps) {
  
  const getCardType = (index: number) => {
    // 循环模式：每6篇文章中，第0篇和第3篇是大卡片
    const cyclePosition = index % 6;
    return cyclePosition === 0 || cyclePosition === 3 ? 'large' : 'small';
  };

  const renderCard = (blog: BlogItem, index: number, cardType: 'large' | 'small') => {
    const key = blog._id;
    const href = `/${lang}/blog/article/${blog._id}`;
    
    if (cardType === 'large') {
      return (
        <Link 
          key={key} 
          href={href} 
          className="col-span-2 row-span-2 group cursor-pointer" 
          prefetch={true}
        >
          <MagazineLargeCard blog={blog} index={index} />
        </Link>
      );
    } else {
      return (
        <Link 
          key={key} 
          href={href} 
          className="col-span-1 row-span-1 group cursor-pointer" 
          prefetch={true}
        >
          <BlogItemBlock blog={blog} index={index} />
        </Link>
      );
    }
  };

  return (
    <div className="mt-8 md:mt-16 container max-w-[2000px] m-auto px-5 md:px-10">
      {/* 杂志式网格布局 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 auto-rows-fr">
        {blogList.map((blog, index) => {
          const cardType = getCardType(index);
          return renderCard(blog, index, cardType);
        })}
      </div>
      
      {/* 移动端优化：小屏幕上所有卡片都是普通大小 */}
      <style jsx>{`
        @media (max-width: 768px) {
          .col-span-2 {
            grid-column: span 1 !important;
          }
          .row-span-2 {
            grid-row: span 1 !important;
          }
        }
      `}</style>
    </div>
  );
}