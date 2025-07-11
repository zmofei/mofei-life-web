"use client"

import { FixedSizeGrid as Grid } from 'react-window';
import { useCallback, useMemo } from 'react';
import Link from 'next/link';
import BlogItemBlock from './BlogItemBlock';

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

interface VirtualizedBlogListProps {
  blogList: BlogItem[];
  lang: 'zh' | 'en';
  containerWidth?: number;
  containerHeight?: number;
}

export default function VirtualizedBlogList({ 
  blogList, 
  lang, 
  containerWidth = 1200,
  containerHeight = 600 
}: VirtualizedBlogListProps) {
  
  // Calculate grid dimensions based on screen size
  const gridConfig = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isTablet = typeof window !== 'undefined' && window.innerWidth < 1024;
    
    let columnCount;
    let columnWidth;
    
    if (isMobile) {
      columnCount = 1;
      columnWidth = containerWidth - 40; // Account for padding
    } else if (isTablet) {
      columnCount = 2;
      columnWidth = (containerWidth - 80) / 2; // Account for padding and gap
    } else {
      columnCount = 3;
      columnWidth = (containerWidth - 120) / 3; // Account for padding and gap
    }
    
    const rowHeight = 400; // Fixed height for each blog item
    const rowCount = Math.ceil(blogList.length / columnCount);
    
    return {
      columnCount,
      columnWidth,
      rowHeight,
      rowCount
    };
  }, [containerWidth, blogList.length]);

  const Cell = useCallback(({ columnIndex, rowIndex, style }: {
    columnIndex: number;
    rowIndex: number;
    style: React.CSSProperties;
  }) => {
    const itemIndex = rowIndex * gridConfig.columnCount + columnIndex;
    const blog = blogList[itemIndex];
    
    if (!blog) {
      return <div style={style} />;
    }
    
    return (
      <div style={{ ...style, padding: '8px' }}>
        <Link 
          href={`/${lang}/blog/article/${blog._id}`} 
          className="block h-full cursor-pointer" 
          prefetch={true}
        >
          <BlogItemBlock blog={blog} index={itemIndex} />
        </Link>
      </div>
    );
  }, [blogList, lang, gridConfig.columnCount]);

  // If blog list is small, render normally without virtualization
  if (blogList.length <= 12) {
    return (
      <div className='blog-grid grid text-black bg-none mt-8 md:mt-16 container max-w-[2000px] m-auto 
        grid-cols-1 px-5 gap-8
        md:grid-cols-2 md:px-10 md:gap-10
        lg:grid-cols-3 lg:gap-8
        xl:grid-cols-3 xl:gap-12
        2xl:gap-16'>
        {blogList.map((blog: BlogItem, index: number) => (
          <Link 
            key={blog._id} 
            href={`/${lang}/blog/article/${blog._id}`} 
            className="relative cursor-pointer" 
            prefetch={true}
          >
            <BlogItemBlock blog={blog} index={index} />
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-8 md:mt-16 container max-w-[2000px] m-auto px-5 md:px-10">
      <Grid
        columnCount={gridConfig.columnCount}
        columnWidth={gridConfig.columnWidth}
        height={containerHeight}
        rowCount={gridConfig.rowCount}
        rowHeight={gridConfig.rowHeight}
        width={containerWidth}
        className="blog-virtual-grid"
      >
        {Cell}
      </Grid>
    </div>
  );
}