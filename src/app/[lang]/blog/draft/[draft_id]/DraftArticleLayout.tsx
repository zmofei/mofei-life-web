"use client"

import BlogBackground from '../../[blog_page]/BlogBackground';
import ArticleHeader from '../../article/[blog_id]/ArticleHeader';
import SimpleReadingProgress from '@/components/util/SimpleReadingProgress';
import DraftArticleClient from './DraftArticleClient';

interface DraftBlogContent {
  _id?: string;
  title: string;
  html: string;
  pubtime?: string;
  previousArticle?: { _id: string; title: string };
  nextArticle?: { _id: string; title: string };
  voice_commentary?: string;
  visited?: number;
}

interface DraftArticleLayoutProps {
  blog: DraftBlogContent;
  lang: 'zh' | 'en';
  draftId: string;
}

export default function DraftArticleLayout({ blog, lang, draftId }: DraftArticleLayoutProps) {
  const previewBlog = {
    ...blog,
    visited: blog.visited ?? 0,
  };
  const visitCountLabel = lang === 'zh' ? '草稿预览' : 'Draft preview';

  return (
    <div className="relative min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50">
        <SimpleReadingProgress 
          targetSelector=".prose-stone" 
          showPercentage={true} 
        />
      </div>

      <BlogBackground />

      <div className="relative z-10">
        <ArticleHeader blog={previewBlog} lang={lang} blog_id={draftId} visitCountLabel={visitCountLabel} />
      </div>

      <div className="relative z-10 bg-black/10 backdrop-blur-lg border-t border-white/20 mt-6 md:mt-10 pt-6 md:pt-10">
        <DraftArticleClient blog={previewBlog} lang={lang} draftId={draftId} />
      </div>
    </div>
  );
}
