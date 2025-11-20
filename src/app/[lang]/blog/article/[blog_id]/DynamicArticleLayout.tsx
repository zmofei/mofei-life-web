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

interface BlogRecommend {
  metadata: {
    blog_id: string;
    title: string;
    title_en: string;
  };
}

interface DynamicArticleLayoutProps {
  blog: BlogContent;
  lang: 'zh' | 'en';
  blog_id: string;
  blogRecommend: BlogRecommend[];
}

export default function DynamicArticleLayout({ blog, lang, blog_id, blogRecommend }: DynamicArticleLayoutProps) {

  return (
    <div className="relative min-h-screen">
      {/* Reading Progress Bar stays fixed */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <SimpleReadingProgress 
          targetSelector=".prose-stone" 
          showPercentage={true} 
        />
      </div>

      <BlogBackground />

      <div className="relative z-10">
        <ArticleHeader blog={blog} lang={lang} blog_id={blog_id} />
      </div>

      <div className="relative z-10 bg-black/10 backdrop-blur-lg border-t border-white/20 mt-6 md:mt-10 pt-6 md:pt-10">
        <ArticlePageClient blog={blog} lang={lang} blog_id={blog_id} blogRecommend={blogRecommend} />
      </div>
    </div>
  );
}
