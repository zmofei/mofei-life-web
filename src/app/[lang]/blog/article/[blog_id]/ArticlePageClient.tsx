"use client"

import { memo, useCallback, useMemo } from 'react';
import PageContent from './page_content';
import Recommend from './recommends';
import BlogComments from './comments';
import Foot from '@/components/Common/Foot';
import WeChatModalManager from './WeChatModalManager';

interface BlogContent {
  title: string;
  html: string;
  pubtime?: string;
  previousArticle?: { _id: string; title: string };
  nextArticle?: { _id: string; title: string };
  voice_commentary?: string;
  visited?: number;
}

interface RecommendItem {
  _id: string;
  title: string;
  [key: string]: unknown;
}

interface ArticlePageClientProps {
  blog: BlogContent;
  lang: 'zh' | 'en';
  blog_id: string;
  blogRecommend: RecommendItem[];
}

// Memoized components to prevent unnecessary re-renders
const MemoizedPageContent = memo(PageContent);
const MemoizedRecommend = memo(Recommend);
const MemoizedBlogComments = memo(BlogComments);
const MemoizedFoot = memo(Foot);

export default function ArticlePageClient({ blog, lang, blog_id, blogRecommend }: ArticlePageClientProps) {
  // Create a stable callback that doesn't change
  const handleWeChatClick = useCallback(() => {
    window.dispatchEvent(new CustomEvent('openWeChatModal'));
  }, []);

  // Memoize the params object
  const pageContentParams = useMemo(() => ({
    content: blog,
    lang,
    blog_id,
    hideTitle: true,
    onWeChatClick: handleWeChatClick
  }), [blog, lang, blog_id, handleWeChatClick]);

  return (
    <>
      <div className='min-h-screen relative
        px-2 pt-0 pb-8
        md:px-10 md:pt-0 md:pb-12
        lg:px-16 xl:px-20 2xl:px-24
      '>
        <MemoizedPageContent params={pageContentParams} />

        {/* Recommend blogs */}
        <MemoizedRecommend blogRecommend={blogRecommend} />

        {/* Comments */}
        <MemoizedBlogComments lang={lang} message_id={blog_id} />
      </div>
      
      {/* Footer - outside content wrapper for full width */}
      <div className='mt-10 md:mt-20'>
        <MemoizedFoot lang={lang} />
      </div>

      {/* WeChat Modal Manager - isolated from this component's state */}
      <WeChatModalManager lang={lang} />
    </>
  );
}