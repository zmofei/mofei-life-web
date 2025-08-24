"use client"

import BlogBackground from '../../[blog_page]/BlogBackground';
import ArticleHeader from './ArticleHeader';
import SimpleReadingProgress from '@/components/util/SimpleReadingProgress';
import ArticlePageClient from './ArticlePageClient';

interface BlogContent {
  _id: string;
  title: string;
  html: string;
  pubtime?: string;
  previousArticle?: { _id: string; title: string };
  nextArticle?: { _id: string; title: string };
  voice_commentary?: string;
  visited?: number;
  keywords?: string[];
  introduction?: string;
  cover?: string;
}

interface DynamicArticleLayoutProps {
  blog: BlogContent;
  lang: 'zh' | 'en';
  blog_id: string;
  blogRecommend: any[];
}

export default function DynamicArticleLayout({ blog, lang, blog_id, blogRecommend }: DynamicArticleLayoutProps) {

  return (
    <>
      {/* Fixed Reading Progress Bar at top of page */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <SimpleReadingProgress 
          targetSelector=".prose-stone" 
          showPercentage={true} 
        />
      </div>

      {/* Fixed background */}
      <div className="fixed inset-0 z-0">
        <BlogBackground />
      </div>

      {/* Fixed title section - behind content */}
      <div className="fixed top-0 left-0 right-0 z-10">
        <ArticleHeader blog={blog} lang={lang} blog_id={blog_id} />
      </div>

      {/* Spacer with hidden header content to maintain exact height */}
      <div className="invisible pointer-events-none" aria-hidden="true">
        <ArticleHeader blog={blog} lang={lang} blog_id={blog_id} />
      </div>

      {/* Scrolling content with glass effect */}
      <div className="relative z-20">
        <div className="bg-black/10 backdrop-blur-lg">
          {/* Gradient separator line */}
          <div className="container max-w-[2000px] m-auto px-5 md:px-10 py-8 md:py-12">
            <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          </div>
          
          <ArticlePageClient blog={blog} lang={lang} blog_id={blog_id} blogRecommend={blogRecommend} />
        </div>
      </div>
    </>
  );
}