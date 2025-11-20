"use client"

import Foot from '@/components/Common/Foot';
import BlogBannerTitle from './BlogBannerTitle';
import BlogBackground from './BlogBackground';
import BlogContent from './BlogContent';

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

interface Tag {
  id: number;
  name: string;
  name_en?: string;
  count: number;
}

interface DynamicBlogLayoutProps {
  blogList: BlogItem[];
  totalPages: number;
  lang: 'zh' | 'en';
  tagList: Tag[];
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
    <div className="relative min-h-screen">
      <BlogBackground />

      {/* Banner title moves with the document flow now */}
      <div className="relative z-10">
        <BlogBannerTitle lang={lang} />
      </div>

      {/* Main content area */}
      <div className="relative z-10 bg-black/10 backdrop-blur-lg border-t border-white/20 mt-6 md:mt-10 pt-6 md:pt-10">
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
  );
}
