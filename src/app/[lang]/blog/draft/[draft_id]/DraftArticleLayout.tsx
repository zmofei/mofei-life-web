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
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <SimpleReadingProgress 
          targetSelector=".prose-stone" 
          showPercentage={true} 
        />
      </div>

      <div className="fixed inset-0 z-0">
        <BlogBackground />
      </div>

      <div className="fixed top-0 left-0 right-0 z-10">
        <ArticleHeader blog={previewBlog} lang={lang} blog_id={draftId} visitCountLabel={visitCountLabel} />
      </div>

      <div className="invisible pointer-events-none" aria-hidden="true">
        <ArticleHeader blog={previewBlog} lang={lang} blog_id={draftId} visitCountLabel={visitCountLabel} />
      </div>

      <div className="relative z-20">
        <div className="bg-black/10 backdrop-blur-lg">
          <div className="container max-w-[2000px] m-auto px-5 md:px-10 py-8 md:py-12">
            <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          </div>
          
          <DraftArticleClient blog={previewBlog} lang={lang} draftId={draftId} />
        </div>
      </div>
    </>
  );
}
