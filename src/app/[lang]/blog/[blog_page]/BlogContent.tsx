"use client"

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import BlogPagination from './BlogPagination';
import BlogTagFilter from './BlogTagFilter';
import MasonryLayout from './MasonryLayout';

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

interface Tag {
  id: number;
  name: string;
  name_en?: string;
  count: number;
}

interface BlogContentProps {
  blogList: BlogItem[];
  totalPages: number;
  lang: 'zh' | 'en';
  tagList: Tag[];
  currentPage: number;
  tag?: string;
  isPageOutOfBounds: boolean;
}

export default function BlogContent({
  blogList,
  totalPages,
  lang,
  tagList,
  currentPage,
  tag,
  isPageOutOfBounds
}: BlogContentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const blogListRef = useRef<HTMLDivElement>(null);

  // Handle page navigation with loading state
  const handlePageChange = () => {
    setIsLoading(true);
    
    // Scroll to blog list area smoothly
    if (blogListRef.current) {
      blogListRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }

    // Show skeleton loading for smooth transition
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Reset loading state when component mounts with new data
  useEffect(() => {
    setIsLoading(false);
  }, [blogList, currentPage]);

  // Skeleton loader component matching masonry layout
  const BlogSkeleton = () => (
    <div className="container max-w-[2000px] m-auto px-5 md:px-10 mb-12">
      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 md:gap-8">
        {[...Array(12)].map((_, index) => {
          // Randomize heights for natural masonry look
          const heights = ['h-64', 'h-80', 'h-72', 'h-96', 'h-60'];
          const randomHeight = heights[index % heights.length];
          
          return (
            <div key={`skeleton-${index}`} className="break-inside-avoid mb-6 md:mb-8">
              <div className={`bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-white/20 shadow-xl relative overflow-hidden loading-shimmer ${randomHeight}`}>
                {/* Animated glass effect overlays */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5 pointer-events-none rounded-2xl"></div>
                
                {/* Content skeleton */}
                <div className="relative z-10 h-full flex flex-col">
                  {/* Image skeleton */}
                  <div className="w-full h-32 md:h-40 bg-white/10 rounded-xl mb-4 loading-shimmer" />
                  
                  {/* Title skeleton */}
                  <div className="space-y-2 mb-4">
                    <div className="h-5 md:h-6 bg-white/10 rounded-lg w-full loading-shimmer" />
                    <div className="h-5 md:h-6 bg-white/10 rounded-lg w-3/4 loading-shimmer" />
                  </div>
                  
                  {/* Content skeleton */}
                  <div className="space-y-2 mb-4 flex-1">
                    <div className="h-3 md:h-4 bg-white/10 rounded w-full loading-shimmer" />
                    <div className="h-3 md:h-4 bg-white/10 rounded w-5/6 loading-shimmer" />
                    <div className="h-3 md:h-4 bg-white/10 rounded w-4/5 loading-shimmer" />
                  </div>
                  
                  {/* Footer skeleton */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="h-3 md:h-4 bg-white/10 rounded w-16 md:w-20 loading-shimmer" />
                    <div className="h-3 md:h-4 bg-white/10 rounded w-20 md:w-24 loading-shimmer" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Tag Filter */}
      <BlogTagFilter lang={lang} tagList={tagList} />
      
      {/* Scroll anchor */}
      <div ref={blogListRef} id="blogList" className='relative -top-24 invisible'></div>
      
      {isPageOutOfBounds && (
        <div className="flex flex-col items-center justify-center text-white mt-20 mb-20">
          <div className="relative text-center p-12 max-w-2xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20">
            <div className="text-6xl mb-6 md:animate-bounce">🌟</div>
            <h1 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">
              {lang == 'zh' ? '哎呀，走得有点远了' : 'Oops, You\'ve Gone Too Far!'}
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed drop-shadow-md">
              {lang == 'zh' 
                ? `第 ${currentPage} 页好像还没有内容呢～总共只有 ${totalPages} 页哦！` 
                : `Page ${currentPage} doesn't exist yet! There are only ${totalPages} pages in total.`
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href={`/${lang}/blog/1${tag ? `?tag=${tag}` : ''}`}
                className="inline-flex items-center px-8 py-4 text-lg font-medium text-white rounded-2xl transition-all duration-300 md:duration-500 md:hover:opacity-90 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 shadow-lg hover:shadow-xl"
              >
                <span className="mr-2">🏠</span>
                {lang == 'zh' ? '回到首页' : 'Go to First Page'}
              </Link>
              
              {totalPages > 1 && (
                <Link 
                  href={`/${lang}/blog/${totalPages}${tag ? `?tag=${tag}` : ''}`}
                  className="inline-flex items-center px-8 py-4 text-lg font-medium text-white rounded-2xl transition-all duration-300 md:duration-500 md:hover:opacity-90 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 shadow-lg hover:shadow-xl"
                >
                  <span className="mr-2">📄</span>
                  {lang == 'zh' ? '最后一页' : 'Last Page'}
                </Link>
              )}
            </div>
            
            <div className="mt-8 text-sm text-white/60 italic">
              {lang == 'zh' 
                ? '💡 小贴士：可以使用下方的分页导航来浏览所有内容' 
                : '💡 Tip: Use the pagination below to navigate through all content'
              }
            </div>
          </div>
        </div>
      )}
      
      {/* Blog content with loading state */}
      {!isPageOutOfBounds && (
        <>
          {isLoading ? (
            <BlogSkeleton />
          ) : blogList ? (
            <MasonryLayout 
              blogList={blogList} 
              lang={lang}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-white mt-20">
              <div className="text-center p-8 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20
                hover:bg-white/[0.12] transition-all duration-500">
                <h1 className="text-3xl font-semibold mb-4 drop-shadow-lg">😕 {lang == 'zh' ? '没有找到博客' : ' No Blog Found'}</h1>
                <p className="text-white/80 mb-6 drop-shadow-md">{lang == 'zh' ? '您访问的页面没有博客内容，请返回首页。' : ' The page you visited has no blog content. Please return to the homepage.'} </p>
                <Link href='/blog/1'
                  className="inline-block mt-4 px-8 py-3 text-lg font-medium bg-white/20 hover:bg-white/30 text-white rounded-2xl 
                  transition-all duration-300 backdrop-blur-md border border-white/30 shadow-lg hover:shadow-xl
                  md:hover:opacity-90"
                >
                  {lang == 'zh' ? '返回博客列表第一页' : 'Return to first page of blog list'}
                </Link>
              </div>
            </div>
          )}
        </>
      )}

      

      {/* Pagination with enhanced loading state */}
      {!isPageOutOfBounds && (
        <BlogPagination 
          blog_page={currentPage} 
          totalPages={totalPages} 
          baseURL={`/${lang}/blog`} 
          onPageClick={handlePageChange}
        />
      )}
    </>
  );
}