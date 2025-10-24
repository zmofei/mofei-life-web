"use client"

import { memo, useCallback, useMemo } from 'react';
import PageContent from '../../article/[blog_id]/page_content';
import Foot from '@/components/Common/Foot';
import WeChatModalManager from '../../article/[blog_id]/WeChatModalManager';

interface DraftBlogContent {
  title: string;
  html: string;
  pubtime?: string;
  previousArticle?: { _id: string; title: string };
  nextArticle?: { _id: string; title: string };
  voice_commentary?: string;
  visited?: number;
}

interface DraftArticleClientProps {
  blog: DraftBlogContent;
  lang: 'zh' | 'en';
  draftId: string;
}

const MemoizedPageContent = memo(PageContent);
const MemoizedFoot = memo(Foot);

export default function DraftArticleClient({ blog, lang, draftId }: DraftArticleClientProps) {
  const handleWeChatClick = useCallback(() => {
    window.dispatchEvent(new CustomEvent('openWeChatModal'));
  }, []);

  const pageContentParams = useMemo(() => ({
    content: blog,
    lang,
    blog_id: draftId,
    hideTitle: true,
    onWeChatClick: handleWeChatClick,
    isDraftPreview: true,
    visitCountLabel: lang === 'zh' ? '草稿预览' : 'Draft preview',
  }), [blog, lang, draftId, handleWeChatClick]);

  return (
    <>
      <div className='min-h-screen relative
        px-2 pt-0 pb-8
        md:px-10 md:pt-0 md:pb-12
        lg:px-16 xl:px-20 2xl:px-24
      '>
        <MemoizedPageContent params={pageContentParams} />
      </div>

      <div className='mt-10 md:mt-20'>
        <MemoizedFoot lang={lang} />
      </div>

      <WeChatModalManager lang={lang} />
    </>
  );
}
