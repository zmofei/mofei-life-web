import { fetchDraftBlogContent } from '@/app/actions/blog-server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DraftArticleLayout from './DraftArticleLayout';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface DraftPageParams {
  lang: 'zh' | 'en';
  draft_id: string;
}

interface DraftBlogContent {
  _id?: string;
  title: string;
  introduction?: string;
  introduction_en?: string;
  html: string;
  pubtime?: string;
  cover?: string;
  keywords?: string[];
  voice_commentary?: string;
}

type PageProps = {
  params: Promise<DraftPageParams>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, draft_id } = await params;

  try {
    const blog = await fetchDraftBlogContent(draft_id, lang) as DraftBlogContent;
    const localizedBlogTitle = lang === 'zh' ? 'Mofei的生活博客' : "Mofei's Life Blog";
    const titleSuffix = lang === 'zh' ? '草稿预览' : 'Draft Preview';
    const title = `${blog.title} (${titleSuffix}) | ${localizedBlogTitle}`;
    const defaultDescription = lang === 'zh'
      ? '这是一个仅供作者查看的草稿预览页面。'
      : 'Internal draft preview page for the author.';

    return {
      title,
      description: blog.introduction || blog.introduction_en || defaultDescription,
      robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
          'max-snippet': -1,
          'max-image-preview': 'none',
          'max-video-preview': -1,
        },
      },
      openGraph: {
        type: 'article',
        title,
        description: blog.introduction || blog.introduction_en || defaultDescription,
        locale: lang === 'zh' ? 'zh_CN' : 'en_US',
        url: `https://www.mofei.life/${lang}/blog/draft/${draft_id}`,
        images: blog.cover ? [
          {
            url: blog.cover,
            width: 1200,
            height: 630,
            alt: blog.title,
          },
        ] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: blog.introduction || blog.introduction_en || defaultDescription,
        images: blog.cover ? [blog.cover] : undefined,
      },
    };
  } catch {
    const fallbackTitle = lang === 'zh'
      ? '草稿预览 | Mofei的生活博客'
      : "Draft Preview | Mofei's Life Blog";
    return {
      title: fallbackTitle,
      robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
          'max-snippet': -1,
          'max-image-preview': 'none',
          'max-video-preview': -1,
        },
      },
    };
  }
}

export default async function DraftPreviewPage({ params }: PageProps) {
  const { lang, draft_id } = await params;

  try {
    const blog = await fetchDraftBlogContent(draft_id, lang) as DraftBlogContent;
    if (!blog || !blog.html) {
      return notFound();
    }

    return (
      <DraftArticleLayout blog={blog} lang={lang} draftId={draft_id} />
    );
  } catch {
    return notFound();
  }
}
