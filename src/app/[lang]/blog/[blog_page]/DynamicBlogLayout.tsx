"use client"

import Foot from '@/components/Common/Foot';
import BlogBannerTitle from './BlogBannerTitle';
import BlogBackground from './BlogBackground';
import BlogContent from './BlogContent';

interface BlogItem {
  _id: string;
  title: string;
  [key: string]: unknown;
}

interface TagItem {
  name: string;
  [key: string]: unknown;
}

interface DynamicBlogLayoutProps {
  blogList: BlogItem[];
  totalPages: number;
  lang: 'zh' | 'en';
  tagList: TagItem[];
  currentPage: number;
  tag: string;
  isPageOutOfBounds: boolean;
}

export default function DynamicBlogLayout({ 
  blogList, 
  totalPages, 
  lang, 
  tagList, 
  currentPage, 
  tag, 
  isPageOutOfBounds 
}: DynamicBlogLayoutProps) {

  return (
    <>
      <BlogBackground />
      
      {/* Fixed banner title - behind content */}
      <div className="fixed top-0 left-0 right-0 z-10">
        <BlogBannerTitle lang={lang} />
      </div>
      
      {/* Spacer with hidden header content to maintain exact height */}
      <div className="invisible pointer-events-none" aria-hidden="true">
        <BlogBannerTitle lang={lang} />
      </div>
      
      {/* Scrolling content - above title */}
      <div className="relative z-20">
        {/* Main content area */}
        <div className="bg-black/10 backdrop-blur-lg">
          {/* Separator between banner and blog items */}
          <div className="container max-w-[2000px] m-auto px-5 md:px-10 py-8 md:py-12">
            <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          </div>
        
          {/* Blog content */}
          <div className="relative">
            <BlogContent
              blogList={blogList}
              totalPages={totalPages}
              lang={lang}
              tagList={tagList}
              currentPage={currentPage}
              tag={tag}
              isPageOutOfBounds={isPageOutOfBounds}
            />

            <div className='mt-10 md:mt-24'>
              <Foot lang={lang} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}